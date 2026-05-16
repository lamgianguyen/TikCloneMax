// /api/getAppConfig, /api/config, /api/getSystemConfig, /api/getTranslations,
// /api/init, /api/v2/sync
//
// Direct port of `backend/Controllers/ConfigController.cs`. The bundle hits
// getAppConfig early during boot to fill the global `appConfig` Pinia store.
// Anything missing from this payload manifests later as silent feature-flag
// drift — keep the shape stable.

const express = require('express');
const channels = require('../db/models/channels');
const subscriptions = require('../db/models/subscriptions');
const dynamicSettings = require('../db/models/dynamic-settings');
const settingsRouter = require('./settings'); // for buildModules reuse

const router = express.Router();

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}

function buildAppConfigPayload(channelId) {
  const channel = channelId > 0 ? channels.findById(channelId) : null;
  const sub = channel ? subscriptions.findByChannel(channelId) : null;
  // User reached this endpoint → license gate already cleared upstream. Force
  // isPro=true (same call MeController makes), otherwise the bundle's
  // appConfig.isPro disagrees with me.isPro and Pro features flicker between
  // enabled/disabled depending on which store the component reads.
  const isPro = true;

  const activeProfileId = channel && channel.ProfileId > 0 ? channel.ProfileId : 1;
  const ds = channel ? dynamicSettings.readAllAsMap(channelId, activeProfileId) : {};

  const modules = settingsRouter.buildModules(channelId);

  return {
    status: 200,
    message: 'OK',
    isPro,
    subscription: {
      isPro,
      plan: (sub && sub.Plan) || 'pro',
      active: true,
    },
    config: {
      // Fixture shape: { id, sort } camelCase (ASP.NET Core 9 Web default).
      modules: modules.map((m) => ({ id: m.id, sort: m.sort })),
      features: isPro ? ['all'] : [],
      settings: ds,
    },
    modules,
    sounds: [],
    actions: [],
    voices: [],
    events: [],
    gifts: [],
    overlays: [],
    widgets: [],
    commands: [],
    goals: [],
    triggers: [],
    settings: ds,
    channelId: channelId > 0 ? channelId : 1,
    version: '1.0.4',
  };
}

router.all(['/getAppConfig', '/config'], (req, res) => {
  const channelId = resolveChannelId(req);
  res.json(buildAppConfigPayload(channelId));
});

router.all('/getSystemConfig', (req, res) => {
  const visibleModules = settingsRouter.DEFAULT_MODULES.map((m) => ({
    id: m.id,
    sort: m.sort,
    enabled: m.enabled,
  }));
  res.json({
    status: 200,
    message: 'OK',
    config: {
      modules: visibleModules,
      features: ['all'],
      settings: {},
    },
    modules: visibleModules,
    isPro: true,
    features: ['all'],
    ttsVoices: [],
    languages: ['en', 'de', 'es', 'fr', 'pt', 'vi'],
    supportedLanguages: ['en', 'de', 'es', 'fr', 'pt', 'vi'],
    defaultLanguage: 'en',
    maxSoundSize: 10485760,
    maxImageSize: 5242880,
  });
});

router.all('/getTranslations', (_req, res) => {
  res.json({ status: 200, message: 'OK', translations: {} });
});

router.all('/init', (_req, res) => {
  res.json({ status: 200, message: 'OK', countryCode: 'VN' });
});

router.all('/v2/sync', (_req, res) => {
  res.json({
    status: 200,
    message: 'OK',
    data: {
      actions: [],
      sounds: [],
      events: [],
      overlays: [],
      commands: [],
      goals: [],
      triggers: [],
      settings: {},
    },
    syncedAt: new Date().toISOString(),
  });
});

module.exports = router;
