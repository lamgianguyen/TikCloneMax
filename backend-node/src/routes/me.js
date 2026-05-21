// /api/me, /api/loginChannel, /api/switchProfile, /api/setAffiliate
//
// Direct port of `backend/Controllers/MeController.cs`. Hot path — bundle
// boots by hitting /api/me, then re-hits on every profile switch and (in
// many builds) every focus event. Three things keep the bundle from
// reloading itself in a loop:
//
//  1. wsAuthToken is CACHED per channel id. The bundle compares `iat`
//     between calls; fresh JWTs trigger a session-reset → full reload.
//  2. featureBaseToken is CACHED per (channelId, frontendChannelName).
//     frontendChannelName is profile-scoped (setting_tiktokname), so
//     caching by channelId alone returned stale tokens after profile
//     switch.
//  3. featurebaseGlobalAuth / featurebasetoken in dynamicSettings are
//     ALWAYS overridden with the cached token, never the stale DB value.
//     If we kept the DB value, the bundle would diff it against
//     localStorage, fire updateSettings, and we'd echo the stale value →
//     ~1 GET+POST /api/me per second.

const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('../services/jwt');
const sockets = require('../services/socket-manager');
const widgetSettings = require('../services/widget-settings-cache');
const chatBot = require('../services/chat-bot');
const tiktokBridge = require('../services/tiktok-bridge');
const channels = require('../db/models/channels');
const subscriptions = require('../db/models/subscriptions');
const profiles = require('../db/models/profiles');
const dynamicSettings = require('../db/models/dynamic-settings');
const { DATA_DIR } = require('../config');
const logger = require('../logger');

const router = express.Router();

// Per-channel JWT cache, persisted to disk so backend restart does NOT mint
// fresh tokens with new `iat`. The bundle's settings.restore compares iat
// across calls; any mismatch triggers a full reload, which becomes a tight
// reload loop on cold boot (cache empty → mint T1 → bundle sees mismatch with
// stored Tx → reload → mint T1 from cache → bundle still sees mismatch with
// Tx that never got persisted → reload → ...).
//
// Persisting the cache keeps `iat` stable across backend restarts so the
// bundle only sees a fresh token once per real session change.
const TOKEN_CACHE_PATH = path.join(DATA_DIR, 'token-cache.json');

/** @type {Map<number, string>} */
const _wsAuthTokenCache = new Map();
/** @type {Map<string, string>} key = `${channelId}|${frontendChannelName}` */
const _featureBaseTokenCache = new Map();

function loadTokenCacheFromDisk() {
  try {
    if (!fs.existsSync(TOKEN_CACHE_PATH)) return;
    const raw = fs.readFileSync(TOKEN_CACHE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    const now = Math.floor(Date.now() / 1000);
    let loaded = 0;
    let dropped = 0;
    for (const [k, v] of Object.entries(parsed.wsAuth || {})) {
      if (typeof v !== 'string' || !v) continue;
      const exp = jwt.peekExp(v);
      if (exp && exp > now + 60) { _wsAuthTokenCache.set(Number(k), v); loaded++; }
      else dropped++;
    }
    for (const [k, v] of Object.entries(parsed.featureBase || {})) {
      if (typeof v !== 'string' || !v) continue;
      const exp = jwt.peekExp(v);
      if (exp && exp > now + 60) { _featureBaseTokenCache.set(String(k), v); loaded++; }
      else dropped++;
    }
    logger.info(`[me] token cache loaded from disk (loaded=${loaded}, dropped_expired=${dropped})`);
  } catch (err) {
    logger.warn({ err: err.message }, '[me] token cache load failed — starting fresh');
  }
}

let _persistTimer = null;
function persistTokenCacheDebounced() {
  if (_persistTimer) return;
  _persistTimer = setTimeout(() => {
    _persistTimer = null;
    try {
      const obj = {
        wsAuth: Object.fromEntries(_wsAuthTokenCache),
        featureBase: Object.fromEntries(_featureBaseTokenCache),
        savedAt: new Date().toISOString(),
      };
      fs.writeFileSync(TOKEN_CACHE_PATH, JSON.stringify(obj, null, 2), 'utf8');
    } catch (err) {
      logger.warn({ err: err.message }, '[me] token cache persist failed');
    }
  }, 500);
}

loadTokenCacheFromDisk();

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}

function readRequestedProfileId(req) {
  if (req.method !== 'POST') return null;
  if (!req.body || typeof req.body !== 'object') return null;
  const raw = req.body.profileId;
  if (raw === undefined || raw === null) return null;
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.trunc(raw);
  if (typeof raw === 'string') {
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function guestResponse() {
  return {
    status: 200,
    message: 'OK',
    channelId: 0,
    channelName: '',
    accountChannelName: '',
    tiktokUsername: '',
    isPro: false,
    channel: {
      channelId: 0,
      channelName: '',
      isPro: false,
      challengeRunning: false,
      challengeName: null,
      challengeStartAt: null,
      dynamicSettings: {},
      profiles: [],
      subscription: { isPro: false, plan: 'free', active: false },
    },
    userFeatures: { isPro: false, proInfo: { plan: 'free', active: false } },
    subscription: { isPro: false, plan: 'free', active: false },
    wsAuthToken: '',
    cookieAuth: false,
    countryCode: 'VN',
    overloadSettings: { enabled: false },
    activePromotions: [],
    isTrialAvailable: false,
    hasActiveTrial: false,
    trialEnded: false,
    trialInfo: null,
    featureBaseToken: '',
  };
}

function buildDynamicSettings(source, frontendChannelName, featureBaseToken, ownerUserId) {
  // Defaults — bundle expects these to be valid JSON strings even when empty.
  const result = {
    events: '[]',
    timer: '[]',
    soundsdatasource: '[]',
    widget_wheelofactions_wheels: '[]',
    wheelcustomsegments: '[]',
    widget_socialmediarotator_socials: '[]',
    'FBVisitedChangelogsTracker-tikfinity': '{"shownChangelogs":[],"unviewedChangelogs":[]}',
    featurebaseIdentifyData: '{}',
  };

  for (const [k, v] of Object.entries(source || {})) {
    result[k] = v ?? '';
  }

  if (!result.profilechannelname || !String(result.profilechannelname).trim()) {
    result.profilechannelname = frontendChannelName;
  }
  if (!result.textboxchannelname || !String(result.textboxchannelname).trim()) {
    result.textboxchannelname = `@${frontendChannelName}`;
  }
  if (!result.owneruserid || !String(result.owneruserid).trim()) {
    result.owneruserid = ownerUserId || '';
  }

  // Always override with cached token (see header note).
  result.featurebaseGlobalAuth = JSON.stringify({
    organization: 'tikfinity',
    jwt: featureBaseToken,
  });
  result.featurebasetoken = featureBaseToken;

  return result;
}

function getOrMintWsToken(channel, isPro) {
  let token = _wsAuthTokenCache.get(channel.ChannelId);
  if (token) {
    const exp = jwt.peekExp(token);
    if (exp && exp > Math.floor(Date.now() / 1000) + 60) return token;
    _wsAuthTokenCache.delete(channel.ChannelId);
  }
  const minted = jwt.generateAccessToken(
    channel.ChannelId,
    channel.ChannelName,
    channel.Email,
    isPro
  );
  token = minted.token;
  _wsAuthTokenCache.set(channel.ChannelId, token);
  persistTokenCacheDebounced();
  return token;
}

function getOrMintFeatureBaseToken(channel, frontendChannelName) {
  const key = `${channel.ChannelId}|${frontendChannelName || ''}`;
  let token = _featureBaseTokenCache.get(key);
  if (token) {
    const exp = jwt.peekExp(token);
    if (exp && exp > Math.floor(Date.now() / 1000) + 60) return token;
    _featureBaseTokenCache.delete(key);
  }
  token = jwt.generateFeaturebaseToken(
    frontendChannelName,
    channel.Email,
    String(channel.ChannelId)
  );
  _featureBaseTokenCache.set(key, token);
  persistTokenCacheDebounced();
  return token;
}

// ── Handlers ────────────────────────────────────────────────────────────────

function handleMe(req, res) {
  const channelId = resolveChannelId(req);
  if (channelId <= 0) return res.json(guestResponse());

  const channel = channels.findById(channelId);
  if (!channel) return res.json(guestResponse());

  // Bundle switchProfile() POSTs to /api/me with body { profileId }. Honor it
  // here too — otherwise the response carries stale profileId and the UI
  // reverts the click.
  const requested = readRequestedProfileId(req);
  if (requested && requested > 0 && requested !== channel.ProfileId) {
    channels.updateProfileId(channelId, requested);
    channel.ProfileId = requested;
    widgetSettings.rebuildAndBroadcast(channelId);
    chatBot.refresh(channelId);
    tiktokBridge.refreshGoals(channelId);
    sockets.broadcast('actionsChanged', {});
    sockets.broadcast('profileChanged', { profileId: requested, channelId });
  }

  // Clamp ProfileId to an existing Profiles row. Earlier the bundle (or a race
  // in switchProfile) wrote ProfileId=2 even though only profile Id=1 existed
  // → bundle tried to restore settings for the missing profile → settings.restore()
  // triggered location.reload() → reload-guard kill switch → app stuck.
  const existingProfile = profiles.findById(channel.ProfileId);
  if (!existingProfile) {
    const fallback = profiles.findById(1) ? 1 : 0;
    if (fallback > 0 && fallback !== channel.ProfileId) {
      logger.warn(`[me] clamping orphan ProfileId=${channel.ProfileId} → ${fallback} for channel ${channelId}`);
      channels.updateProfileId(channelId, fallback);
      channel.ProfileId = fallback;
    }
  }

  const activeProfileId = channel.ProfileId > 0 ? channel.ProfileId : 1;
  const ds = dynamicSettings.readAllAsMap(channelId, activeProfileId);

  let preferredTikTokName = ds['setting_tiktokname'];
  if (typeof preferredTikTokName === 'string') {
    preferredTikTokName = preferredTikTokName.trim().replace(/^@+/, '');
    if (!preferredTikTokName) preferredTikTokName = null;
  } else {
    preferredTikTokName = null;
  }
  const frontendChannelName = preferredTikTokName || channel.ChannelName;

  // User reached this endpoint, which means they passed the TikfinityServer
  // license gate at app startup. Treat as Pro regardless of local Subscription
  // row (which may still default to isPro=false).
  const isPro = true;

  const wsAuthToken = getOrMintWsToken(channel, isPro);
  const featureBaseToken = getOrMintFeatureBaseToken(channel, frontendChannelName);
  const dsOut = buildDynamicSettings(ds, frontendChannelName, featureBaseToken, channel.OwnerUserId);

  const sub = subscriptions.findByChannel(channelId);
  const profs = profiles.listByChannel(channelId);
  const plan = (sub && sub.Plan) || 'free';
  const active = !!(sub && sub.Active);
  const remoteIp = req.ip || req.socket?.remoteAddress || null;

  res.json({
    status: 200,
    message: 'OK',
    channelName: frontendChannelName,
    accountChannelName: channel.ChannelName,
    tiktokUsername: preferredTikTokName || '',
    channel: {
      // Bundle Vue components read ONLY camelCase. ASP.NET Core 9 Web defaults
      // to camelCase via JsonSerializerOptions.Web, so the original C# returns
      // `channelName` not `ChannelName`. Match that exactly.
      ownerUserId: channel.OwnerUserId,
      channelId: channel.ChannelId,
      channelName: frontendChannelName,
      accountChannelName: channel.ChannelName,
      channelSignature: channel.ChannelSignature,
      sub: channel.Sub,
      email: channel.Email,
      affId: channel.AffId,
      agencyId: channel.AgencyId,
      profileId: channel.ProfileId,
      proExpireAt: sub ? sub.ProExpireAt : null,
      proExpireSetBy: sub ? sub.ProExpireSetBy : null,
      locale: channel.Locale,
      isChatbotApproved: !!channel.IsChatbotApproved,
      challengeRunning: !!channel.ChallengeRunning,
      challengeName: channel.ChallengeName,
      signupAuthProvider: channel.SignupAuthProvider,
      challengeStartAt: channel.ChallengeStartAt,
      tiktokUsername: preferredTikTokName || '',
      dynamicSettings: dsOut,
      dynamicProfileSettings: [],
      halvingLastExecutionAt: null,
      catchApplied: false,
      catchEnabled: false,
      catchEnabledInGrid: true,
      catchEnabledAt: null,
      catchProEnabled: false,
      catchProEnabledAt: null,
      catchRandom: 5,
      isCatchAdmin: false,
      userAgent: req.headers['user-agent'] || '',
      customInfoText: null,
      lastActivityAt: channel.UpdatedAt,
      patreonUserId: null,
      discordUsername: null,
      bmcEmail: null,
      lmSubscriptionId: null,
      monthlyEarnings: 0,
      monthlyEarningsMax: 0,
      streamGifter: 0,
      streamGifterMax: 0,
      // UI-only quota fields read by bundle's TTSFreeDropdown component
      // (the "X / Y free messages" chip in topbar). 0/25 = full quota
      // available; bundle renders chip when Max > 0.
      ttsFreeMessages: 0,
      ttsFreeMessagesMax: 25,
      ttsProCredits: 0,
      ttsProCreditsMax: 0,
      trialBannerDismissed: false,
      lastSeenIp: remoteIp,
      lastActiveProDate: null,
      firstActiveProDate: null,
      lastActiveProInfo: null,
      proCanceledAt: null,
      banReason: null,
      tiktokAgencyInfoId: 0,
      tiktokAgencyInfoName: null,
      tiktokAgencyInfoUpdatedAt: null,
      upgradeIntent: null,
      upgradeIntentUpdatedAt: null,
      paymentMethodSelected: null,
      paymentMethodSelectedAt: null,
      specialProOfferPrice: null,
      trialStartedAt: null,
      trialExpiresAt: null,
      trialOfferNotificationSentAt: null,
      createdAt: channel.CreatedAt,
      updatedAt: channel.UpdatedAt,
      isPro,
      subscription: { isPro, plan, active },
      userFeatures: { isPro, proInfo: { plan, active } },
      profiles: profs.map((p) => ({ id: p.Id, name: p.Name, sort: p.Sort })),
    },
    channeluser: null,
    userFeatures: { isPro, proInfo: { plan, active } },
    profile: null,
    cookieAuth: false,
    wsAuthToken,
    discordVerifyToken: channel.ChannelSignature,
    channelId: channel.ChannelId,
    countryCode: channel.Locale || 'VN',
    overloadSettings: {
      enabled: false,
      suffixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      minAccountAge: 5,
      updatedAt: channel.UpdatedAt,
    },
    activePromotions: [],
    mobileVoucherCode: '',
    performanceDebugInfo: {
      cid: channel.ChannelId,
      step1: 0, step2: 0, step3: 0, step4: 0, step5: 0, step6: 0, step7: 0,
      total: 0,
    },
    isTrialAvailable: false,
    hasActiveTrial: false,
    trialEnded: false,
    trialInfo: null,
    featureBaseToken,
    isPro,
    subscription: { isPro, plan, active },
  });
}

function handleSwitchProfile(req, res) {
  const channelId = resolveChannelId(req);
  const profileId = Number(req.body?.profileId) || 0;
  if (profileId <= 0) return res.json({ status: 200, message: 'OK' });

  const channel = channels.findById(channelId);
  if (!channel) return res.json({ status: 200, message: 'OK' });

  const previous = channel.ProfileId;
  if (previous !== profileId) {
    channels.updateProfileId(channelId, profileId);
    widgetSettings.rebuildAndBroadcast(channelId);
    chatBot.refresh(channelId);
    tiktokBridge.refreshGoals(channelId);
    sockets.broadcast('actionsChanged', {});
    sockets.broadcast('profileChanged', { profileId, channelId });
  }
  res.json({ status: 200, message: 'OK', profileId });
}

function handleSetAffiliate(req, res) {
  const channelId = resolveChannelId(req);
  const affId = req.body?.affId;
  if (affId && typeof affId === 'string' && affId.trim()) {
    const channel = channels.findById(channelId);
    if (channel) channels.updateAffId(channelId, affId.trim());
  }
  res.json({ status: 200, message: 'OK' });
}

// /api/me & aliases — GET and POST both supported.
router.get(['/me', '/loginChannel'], handleMe);
router.post(['/me', '/loginChannel'], handleMe);
router.post(['/switchProfile', '/me/switchProfile'], handleSwitchProfile);
router.post(['/setAffiliate', '/setAff'], handleSetAffiliate);

module.exports = router;
