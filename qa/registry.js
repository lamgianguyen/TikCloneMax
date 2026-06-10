// qa/registry.js — THE extensible source of truth for what gets tested.
//
// ➤ To add a feature test: add an entry here (no new code). Modules read these
//   specs and execute them. Modules MAY also add edge specs internally, but the
//   declarative core lives here so it survives bundle updates + is diff-able.
//
// Severity: CRITICAL (block) · HIGH (warn) · MEDIUM · LOW — mirrors CLAUDE.md §code-review.

module.exports = {
  // ── L1: backend HTTP API contracts (stable — OUR backend defines them) ──────
  // expect.status: number | array of acceptable codes.
  // expect.jsonHas: dot-paths that must EXIST (not undefined) in the JSON body.
  // De-dup is per-path in api-contract.test.js (registry wins over EXTRA_ENDPOINTS).
  // NOTE on bare-array / no-stable-field endpoints (see Inventory-API): /api/modules,
  // /api/getAllGifts, /api/getAllAnimations return ARRAYS (jsonHas dot-paths cannot
  // resolve on an array root) and /api/seed/status returns a bare {Table:count} map —
  // these intentionally carry status-only checks (no jsonHas).
  api: [
    // ── health / liveness ─────────────────────────────────────────────
    // /api/health returns {status:'ok'} (STRING, not 200) — jsonHas:['status'] only, never numeric assert.
    { id: 'api.health', method: 'GET', path: '/api/health',
      expect: { status: [200, 404], jsonHas: ['status', 'version'] }, severity: 'LOW' },

    // ── tiktok (connection / account / gifts / stats) ─────────────────
    { id: 'api.tiktok.status', method: 'GET', path: '/api/tiktok/status',
      expect: { status: 200, jsonHas: ['connected', 'isLive', 'channelId'] }, severity: 'CRITICAL', gate: 'Gate 15/16' },
    { id: 'api.tiktok.account', method: 'GET', path: '/api/tiktok/account',
      expect: { status: 200, jsonHas: ['account'] }, severity: 'HIGH' },
    { id: 'api.tiktok.gifts', method: 'GET', path: '/api/tiktok/gifts',
      expect: { status: 200 }, severity: 'MEDIUM', gate: 'Gate 21' },
    { id: 'api.tiktok.stats', method: 'GET', path: '/api/tiktok/stats',
      expect: { status: 200, jsonHas: ['stats'] }, severity: 'LOW' },

    // ── me / auth / config / settings (boot hot-path) ─────────────────
    { id: 'api.me', method: 'GET', path: '/api/me',
      expect: { status: 200, jsonHas: ['isPro', 'channeluser', 'channel.dynamicSettings', 'wsAuthToken'] }, severity: 'CRITICAL', gate: 'Gate 23b' },
    { id: 'api.loginChannel', method: 'GET', path: '/api/loginChannel',
      expect: { status: 200, jsonHas: ['isPro', 'channelId'] }, severity: 'HIGH' },
    { id: 'api.config.app', method: 'GET', path: '/api/getAppConfig',
      expect: { status: 200, jsonHas: ['isPro', 'channelId', 'version', 'modules'] }, severity: 'HIGH' },
    { id: 'api.config.alias', method: 'GET', path: '/api/config',
      expect: { status: 200, jsonHas: ['isPro', 'channelId'] }, severity: 'LOW' },
    { id: 'api.config.system', method: 'GET', path: '/api/getSystemConfig',
      expect: { status: 200, jsonHas: ['isPro', 'config', 'modules'] }, severity: 'MEDIUM' },
    { id: 'api.config.translations', method: 'GET', path: '/api/getTranslations',
      expect: { status: 200, jsonHas: ['translations'] }, severity: 'LOW' },
    { id: 'api.config.init', method: 'GET', path: '/api/init',
      expect: { status: 200, jsonHas: ['countryCode'] }, severity: 'LOW' },
    { id: 'api.config.v2sync', method: 'GET', path: '/api/v2/sync',
      expect: { status: 200, jsonHas: ['data', 'syncedAt'] }, severity: 'LOW' },
    { id: 'api.settings.overlayconfig', method: 'GET', path: '/api/getOverlayConfig',
      expect: { status: 200, jsonHas: ['overlays'] }, severity: 'MEDIUM' },
    { id: 'api.settings.modules', method: 'GET', path: '/api/modules',
      expect: { status: 200 }, severity: 'LOW' }, // returns a bare ARRAY (no jsonHas)
    { id: 'api.auth.sso', method: 'GET', path: '/api/v1/auth/sso-bridge',
      expect: { status: [200, 404], jsonHas: ['status'] }, severity: 'HIGH' }, // 404 only if NO default channel
    { id: 'api.auth.flowstatus', method: 'GET', path: '/api/v1/flow/status',
      expect: { status: 200, jsonHas: ['status', 'completed'] }, severity: 'LOW' },

    // ── goals ─────────────────────────────────────────────────────────
    { id: 'api.goals', method: 'GET', path: '/api/goals',
      expect: { status: 200, jsonHas: ['goals'] }, severity: 'MEDIUM' },

    // ── actions ───────────────────────────────────────────────────────
    { id: 'api.actions.list', method: 'GET', path: '/api/rest/action',
      expect: { status: 200, jsonHas: ['actions', 'arrayKey'] }, severity: 'HIGH' },

    // ── points (+ leaderboard / channeluser readback) ─────────────────
    { id: 'api.points.leaderboard', method: 'GET', path: '/api/points/leaderboard',
      expect: { status: 200, jsonHas: ['leaderboard', 'total'] }, severity: 'MEDIUM' },
    { id: 'api.points.user', method: 'GET', path: '/api/points/user/qa_probe_user',
      expect: { status: 200, jsonHas: ['username', 'balance'] }, severity: 'LOW' }, // unknown user → balance 0
    { id: 'api.channeluser.odata', method: 'GET', path: '/api/odata/channeluser',
      expect: { status: 200, jsonHas: ['value', '@odata.count'] }, severity: 'MEDIUM' },
    { id: 'api.channeluser.rest', method: 'GET', path: '/api/rest/channeluser',
      expect: { status: 200, jsonHas: ['channelusers', 'data'] }, severity: 'MEDIUM' }, // readback gap area

    // ── commands ──────────────────────────────────────────────────────
    { id: 'api.commands', method: 'GET', path: '/api/commands',
      expect: { status: 200, jsonHas: ['commands'] }, severity: 'MEDIUM' },

    // ── sounds ────────────────────────────────────────────────────────
    { id: 'api.sounds', method: 'GET', path: '/api/sounds',
      expect: { status: 200, jsonHas: ['sounds', 'data', 'arrayKey'] }, severity: 'MEDIUM' },
    { id: 'api.sounds.rest', method: 'GET', path: '/api/rest/sound',
      expect: { status: 200, jsonHas: ['sounds'] }, severity: 'LOW' },

    // ── notifications ─────────────────────────────────────────────────
    { id: 'api.notifications.list', method: 'GET', path: '/api/notifications/list',
      expect: { status: 200, jsonHas: ['notifications'] }, severity: 'MEDIUM' },
    { id: 'api.notifications.count', method: 'GET', path: '/api/notifications/count',
      expect: { status: 200, jsonHas: ['count', 'unread'] }, severity: 'LOW' },

    // ── tts (auth-token; generate excluded — needs TikTok session → 503) ──
    { id: 'api.tts.authtoken', method: 'POST', path: '/api/tts/auth-token', body: {},
      expect: { status: 200, jsonHas: ['ttsAuthToken'] }, severity: 'HIGH', gate: 'Gate 9a' },

    // ── data / odata / fixtures ───────────────────────────────────────
    { id: 'api.odata.transaction', method: 'GET', path: '/api/odata/transaction',
      expect: { status: 200, jsonHas: ['value'] }, severity: 'LOW' },
    { id: 'api.rest.transaction', method: 'GET', path: '/api/rest/transaction',
      expect: { status: 200, jsonHas: ['transactions', 'data'] }, severity: 'LOW' },
    { id: 'api.gifts.all', method: 'GET', path: '/api/getAllGifts',
      expect: { status: 200 }, severity: 'HIGH', gate: 'Gate 21' }, // bare ARRAY
    { id: 'api.animations.all', method: 'GET', path: '/api/getAllAnimations',
      expect: { status: 200 }, severity: 'LOW' }, // bare ARRAY (fixture)
    { id: 'api.data.emotes', method: 'GET', path: '/api/getChannelEmotes',
      expect: { status: 200, jsonHas: ['isPro', 'emotes'] }, severity: 'LOW' },
    { id: 'api.data.usercount', method: 'GET', path: '/api/getChannelUserCount',
      expect: { status: 200, jsonHas: ['count'] }, severity: 'LOW' },
    { id: 'api.data.livechannels', method: 'GET', path: '/api/getLiveChannels',
      expect: { status: 200, jsonHas: ['liveChannels'] }, severity: 'LOW' },
    { id: 'api.data.globaltransactions', method: 'GET', path: '/api/getGlobalTransactions',
      expect: { status: 200, jsonHas: ['globalTransactions'] }, severity: 'LOW' },
    { id: 'api.data.myinstants', method: 'GET', path: '/api/getMyInstants',
      expect: { status: 200, jsonHas: ['instants'] }, severity: 'LOW' },

    // ── backup (export only — import is destructive → mutating) ────────
    { id: 'api.backup.export', method: 'GET', path: '/api/backup/export',
      expect: { status: 200, jsonHas: ['schemaVersion', 'settings', 'actions'] }, severity: 'HIGH' },

    // ── pro ───────────────────────────────────────────────────────────
    { id: 'api.pro.status', method: 'GET', path: '/api/pro/status',
      expect: { status: 200, jsonHas: ['isPro', 'plan'] }, severity: 'MEDIUM' },
    { id: 'api.pro.tazapay', method: 'GET', path: '/api/pro/tazapay/methods',
      expect: { status: 200, jsonHas: ['methods'] }, severity: 'LOW' },

    // ── obs / webhooks / seed / uploads (auxiliary read surfaces) ─────
    { id: 'api.obs.status', method: 'GET', path: '/api/obs/status',
      expect: { status: 200, jsonHas: ['connected'] }, severity: 'LOW' },
    { id: 'api.webhooks.list', method: 'GET', path: '/api/webhooks',
      expect: { status: 200, jsonHas: ['webhooks'] }, severity: 'LOW' },
    { id: 'api.seed.status', method: 'GET', path: '/api/seed/status',
      expect: { status: 200 }, severity: 'LOW' }, // bare {Table:count} map — no stable field
    { id: 'api.uploads.list', method: 'GET', path: '/api/uploads/list',
      expect: { status: 200, jsonHas: ['files'] }, severity: 'LOW' },
  ],

  // Opt-in destructive checks — only run with `--mutating`. Each must be self-undoing
  // or harmless (idempotent reset of ephemeral state).
  mutating: [
    { id: 'api.coinjar.reset', method: 'POST', path: '/api/widget/coinjar/reset', body: {},
      expect: { status: 200 }, severity: 'MEDIUM', gate: 'Gate 35-MECH' },
  ],

  // ── L2: Socket.IO relay (stable — OUR socket-manager) ───────────────────────
  // Sender(appType=controlpage) emits a `distributeEvent` envelope; Receiver
  // (appType=widget) must receive the inner event within `withinMs`. `expectRelay`
  // false = negative test (event NOT in whitelist → must NOT arrive).
  //
  // The 27 positive events MIRROR RELAYABLE_DISTRIBUTE in
  // backend-node/src/services/socket-manager.js:121-135. Lifecycle / server-emitted
  // events (chat, status, stats, goalsChanged, actionsChanged, aggregates, …) are
  // NOT controlpage-distributeEvent-triggerable, so they are intentionally OMITTED
  // here — they need a REST-route / bridge-simulation test path, not this relay harness.
  socket: [
    // settings / goals (original whitelist) — sock-manager.js:123
    { id: 'sock.relay.widgetSettings', event: 'widgetSettings', payload: { __qa: true }, expectRelay: true, severity: 'CRITICAL', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.goalStatus', event: 'goalStatus', payload: { __qa: true }, expectRelay: true, severity: 'HIGH', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.giftGoalStatus', event: 'giftGoalStatus', payload: { __qa: true }, expectRelay: true, severity: 'HIGH', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.testGoal', event: 'testGoal', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.testGiftGoal', event: 'testGiftGoal', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },
    // gift / like FX — sock-manager.js:125
    { id: 'sock.relay.gift', event: 'gift', payload: { __qa: true, diamondCount: 1 }, expectRelay: true, severity: 'HIGH', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.onLikeReceived', event: 'onLikeReceived', payload: { __qa: true }, expectRelay: true, severity: 'HIGH', gate: 'Gate 35 RC-1' },
    // coin jar / match / drop — sock-manager.js:127-129
    { id: 'sock.relay.coinJarGift', event: 'coin-jar:gift', payload: { __qa: true }, expectRelay: true, severity: 'HIGH', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.coinjar.reset', event: 'coin-jar:reset', payload: {}, expectRelay: true, severity: 'HIGH', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.coinMatchStart', event: 'coin-match:start', payload: { __qa: true }, expectRelay: true, severity: 'HIGH', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.coinMatchUpdate', event: 'coin-match:update', payload: { __qa: true }, expectRelay: true, severity: 'HIGH', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.coinMatchResult', event: 'coin-match:result', payload: { __qa: true }, expectRelay: true, severity: 'HIGH', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.coinMatchReset', event: 'coin-match:reset', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.createCoins', event: 'createCoins', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.timeoutCoins', event: 'timeoutCoins', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.collectCoin', event: 'collectCoin', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },
    // wheel — sock-manager.js:131
    { id: 'sock.relay.spinwheel', event: 'onSpinWheel', payload: { __qa: true }, expectRelay: true, severity: 'HIGH', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.spinWheel', event: 'spinWheel', payload: { __qa: true }, expectRelay: true, severity: 'HIGH', gate: 'Gate 35 RC-1' },
    // aggregates / misc overlay — sock-manager.js:133-134
    { id: 'sock.relay.updateTopGifter', event: 'updateTopGifter', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.updateTopLiker', event: 'updateTopLiker', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.updateViewerCount', event: 'updateViewerCount', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.topGiftData', event: 'topGiftData', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.newTransaction', event: 'newTransaction', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.showCommandResult', event: 'showCommandResult', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.showCommands', event: 'showCommands', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.showCustomCommands', event: 'showCustomCommands', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.showUserScore', event: 'showUserScore', payload: { __qa: true }, expectRelay: true, severity: 'MEDIUM', gate: 'Gate 35 RC-1' },

    // NEGATIVE specs — NOT in RELAYABLE_DISTRIBUTE → handler returns at :138, no relay.
    // 'chat' is a real broadcast event (index.js:119) but deliberately NOT whitelisted
    // for distributeEvent → a controlpage distributeEvent('chat',…) must NOT relay.
    { id: 'sock.relay.neg.notWhitelisted', event: '__qa_not_whitelisted__', payload: { __qa: true }, expectRelay: false, severity: 'CRITICAL', gate: 'Gate 35 RC-1' },
    { id: 'sock.relay.neg.chat', event: 'chat', payload: { __qa: true }, expectRelay: false, severity: 'HIGH', gate: 'Gate 35 RC-1' },
  ],

  // ── L3: widget standalone HTML smoke (semi-stable — OUR widget files) ───────
  // The module fetches /widget/<name>?cid=1&preview=1 AND reads the source file.
  // FAIL on: non-200, external blocking <script src=cdn>, missing null-guards,
  // leftover debug console.log spam.
  widgets: [
    'coinjar', 'coinmatch', 'cannon', 'wheel', 'wheelofactions', 'goal', 'giftgoal',
    'webcam', 'overlay', 'talking', 'chat', 'eventcarousel', 'fallingsnow', 'firework',
    'ranking', 'topgifter', 'topliker', 'lastx', 'viewercount', 'myactions', 'timer',
    'socialmediarotator', 'commandinfo', 'userinfo', 'transactionviewer', 'likefountain',
  ],

  // ── L4: bundle-drift gate-health (flags, does NOT block) ────────────────────
  // kind: 'needleInDecompiled' → `needle` must appear in DECOMPILED_MODULES then
  // DECOMPILED_APP (order is load-bearing — some symbols live ONLY in app.js).
  // kind: 'needleInTemplates'  → `needle` must appear in any backend-node/src/templates/*.txt.
  // Absence = bundle drift → the referenced Gate's assumption may have broken.
  // severity here means how loud to flag, NOT a hard fail (gate-health reports
  // WARN-level drift). All needles below verified PRESENT at baseline → all-PASS.
  gates: [
    // ── needleInDecompiled (modules.js first, then app.js) ──────────────────────
    { id: 'gate.06.aivoiceprefix', gate: 'Gate 6/7', kind: 'needleInDecompiled', needle: 'tts_api__', severity: 'HIGH' },
    { id: 'gate.07.resolvevoicecfg', gate: 'Gate 7', kind: 'needleInDecompiled', needle: 'resolveVoiceConfigFromId', severity: 'MEDIUM' },
    { id: 'gate.08.hasbackendctx', gate: 'Gate 8a', kind: 'needleInDecompiled', needle: 'getAiTtsBackendContext', severity: 'MEDIUM' },
    { id: 'gate.09b.currentusagemode', gate: 'Gate 23b', kind: 'needleInDecompiled', needle: 'currentUsageMode', severity: 'HIGH' },
    { id: 'gate.23b.subcredits', gate: 'Gate 23b', kind: 'needleInDecompiled', needle: 'sub_credits', severity: 'HIGH' },
    { id: 'gate.09a.ttsauthtoken', gate: 'Gate 9a', kind: 'needleInDecompiled', needle: 'ttsAuthToken', severity: 'HIGH' },
    { id: 'gate.25.loadaivoicestate', gate: 'Gate 25', kind: 'needleInDecompiled', needle: 'loadAiVoiceState', severity: 'HIGH' },
    { id: 'gate.25.ensureauthtoken', gate: 'Gate 25', kind: 'needleInDecompiled', needle: 'ensureAiAuthToken', severity: 'MEDIUM' },
    { id: 'gate.25.aivoicecooldown', gate: 'Gate 25', kind: 'needleInDecompiled', needle: 'aiVoiceStateLastLoadedAt', severity: 'LOW' },
    { id: 'gate.23.ispro', gate: 'Gate 23', kind: 'needleInDecompiled', needle: 'userFeatures', severity: 'HIGH' },
    { id: 'gate.23.proinfo', gate: 'Gate 23b', kind: 'needleInDecompiled', needle: 'proInfo', severity: 'MEDIUM' },
    { id: 'gate.30a.proChip', gate: 'Gate 30a', kind: 'needleInDecompiled', needle: 'TTSProDropdown', severity: 'HIGH' },
    { id: 'gate.30a.freeChip', gate: 'Gate 30a', kind: 'needleInDecompiled', needle: 'TTSFreeDropdown', severity: 'MEDIUM' },
    { id: 'gate.30b.switchlanguage', gate: 'Gate 30b', kind: 'needleInDecompiled', needle: 'switchLanguage', severity: 'MEDIUM' },
    { id: 'gate.30c.streamprofile', gate: 'Gate 30c', kind: 'needleInDecompiled', needle: 'streamProfileId', severity: 'MEDIUM' },
    { id: 'gate.30c.switchprofile', gate: 'Gate 30c', kind: 'needleInDecompiled', needle: 'switchProfile', severity: 'MEDIUM' },
    { id: 'gate.30d.stretchiframe', gate: 'Gate 30d', kind: 'needleInDecompiled', needle: 'stretchIframe', severity: 'MEDIUM' },
    { id: 'gate.30d.obsoverlays', gate: 'Gate 30d', kind: 'needleInDecompiled', needle: 'lazy-frame', severity: 'LOW' },
    { id: 'gate.34.refreshdatasource', gate: 'Gate 34', kind: 'needleInDecompiled', needle: 'refreshDataSource', severity: 'MEDIUM' },
    { id: 'gate.34.loadtriggers', gate: 'Gate 34', kind: 'needleInDecompiled', needle: 'loadTriggers', severity: 'HIGH' },
    { id: 'gate.34.triggerdatasource', gate: 'Gate 34', kind: 'needleInDecompiled', needle: 'triggerDataSource', severity: 'HIGH' },
    { id: 'gate.34.onEditorPreparing', gate: 'Gate 34', kind: 'needleInDecompiled', needle: 'onEditorPreparing', severity: 'LOW' },
    { id: 'gate.35.distribute', gate: 'Gate 35', kind: 'needleInDecompiled', needle: 'distributeEvent', severity: 'HIGH' },
    { id: 'gate.35.coinjarreset', gate: 'Gate 35', kind: 'needleInDecompiled', needle: 'coin-jar:reset', severity: 'HIGH' },
    { id: 'gate.35.coinmatchstart', gate: 'Gate 35', kind: 'needleInDecompiled', needle: 'coin-match:start', severity: 'MEDIUM' },
    { id: 'gate.35.spinwheel', gate: 'Gate 35', kind: 'needleInDecompiled', needle: 'onSpinWheel', severity: 'MEDIUM' },
    { id: 'gate.35.widgetstate', gate: 'Gate 35', kind: 'needleInDecompiled', needle: 'onWidgetState', severity: 'MEDIUM' },
    { id: 'gate.35.emitwidgetsettings', gate: 'Gate 35', kind: 'needleInDecompiled', needle: 'emitWidgetSettingsToWidgets', severity: 'HIGH' },
    { id: 'gate.35.resetjar', gate: 'Gate 35-MECH', kind: 'needleInDecompiled', needle: 'resetJar', severity: 'MEDIUM' },

    // ── needleInTemplates (backend-node/src/templates/*.txt) ────────────────────
    { id: 'gate.18.chipbg', gate: 'Gate 18', kind: 'needleInTemplates', needle: 'D435554D', severity: 'MEDIUM' },
    { id: 'gate.18.prochipbg', gate: 'Gate 18', kind: 'needleInTemplates', needle: 'FFB54D14', severity: 'MEDIUM' },
    { id: 'gate.22e.pagessrcontent', gate: 'Gate 22 (E)', kind: 'needleInTemplates', needle: 'pageSSRContent', severity: 'MEDIUM' },
    { id: 'gate.16.livestate', gate: 'Gate 16', kind: 'needleInTemplates', needle: 'data-tf-live-state', severity: 'MEDIUM' },
    { id: 'gate.01.tfi18nprebake', gate: 'Gate 3/4', kind: 'needleInTemplates', needle: 'tfI18nPreBake', severity: 'HIGH' },
    { id: 'gate.17.forceprocredits', gate: 'Gate 17', kind: 'needleInTemplates', needle: 'tfForceProCredits', severity: 'HIGH' },
    { id: 'gate.23.activateproui', gate: 'Gate 23', kind: 'needleInTemplates', needle: 'tfActivateProUI', severity: 'HIGH' },
    { id: 'gate.30a.piniaprotrap', gate: 'Gate 30a', kind: 'needleInTemplates', needle: 'tfPiniaProTrap', severity: 'HIGH' },
    { id: 'gate.30b.patchswitchlang', gate: 'Gate 30b', kind: 'needleInTemplates', needle: 'tfPatchSwitchLanguage', severity: 'HIGH' },
    { id: 'gate.30b.langtolocale', gate: 'Gate 30b', kind: 'needleInTemplates', needle: 'LANG_TO_LOCALE', severity: 'MEDIUM' },
    { id: 'gate.30d.triggeroverlays', gate: 'Gate 30d', kind: 'needleInTemplates', needle: 'tfTriggerOverlaysOnVisible', severity: 'MEDIUM' },
    // Overlay-card layout (FIXLOG 2026-06-09, full-team RCA wf_9418fde2 + headless
    // measurement). Cards KEEP gốc `align-items:stretch` (equal height, user request).
    // Coin Match widget centers a fixed h-[410px] box in min-h-screen → transparent
    // reserve area shows the card's #2d0539 purple = the gap. The coinmatch PREVIEW
    // iframe is painted dark to blend it (control-page only; OBS unaffected). If this
    // rule is dropped the purple gap returns — this needle flags the reversion.
    { id: 'gate.overlaycard.iframefill', gate: 'Overlay-Layout', kind: 'needleInTemplates', needle: 'iframe.lazy-frame', severity: 'HIGH' },
    { id: 'gate.34.wrappreloadtrig', gate: 'Gate 34', kind: 'needleInTemplates', needle: 'tfWrapAndPreloadTriggers', severity: 'HIGH' },
    { id: 'gate.06.bootstraptoken', gate: 'Gate 6', kind: 'needleInTemplates', needle: 'tfBootstrapWindowToken', severity: 'HIGH' },
    { id: 'gate.09b.quotapayload', gate: 'Gate 23b', kind: 'needleInTemplates', needle: 'tfBuildQuotaPayload', severity: 'HIGH' },
    { id: 'gate.09b.ttsuserhandler', gate: 'Gate 9b', kind: 'needleInTemplates', needle: 'tfHandleTtsTikfinityUser', severity: 'MEDIUM' },
    { id: 'gate.09c.ttscomhandler', gate: 'Gate 9c', kind: 'needleInTemplates', needle: 'tfHandleTtsTikfinityCom', severity: 'MEDIUM' },
    { id: 'gate.16.patchlivebadge', gate: 'Gate 16', kind: 'needleInTemplates', needle: 'tfPatchLiveBadge', severity: 'MEDIUM' },
    { id: 'gate.35.overlayautosave', gate: 'Gate 35', kind: 'needleInTemplates', needle: 'tfOverlaySettingsAutosave', severity: 'HIGH' },
    { id: 'gate.35.coinjarreset.iife', gate: 'Gate 35-MECH', kind: 'needleInTemplates', needle: 'tfCoinJarResetReliable', severity: 'MEDIUM' },
    { id: 'gate.06.normalizevoice', gate: 'Gate 7', kind: 'needleInTemplates', needle: 'tfNormalizeMockVoice', severity: 'MEDIUM' },
    { id: 'gate.07.ttsgenerate', gate: 'Gate 7', kind: 'needleInTemplates', needle: 'tfHandleTtsGenerate', severity: 'LOW' },
    { id: 'gate.30c.bridgesessionme', gate: 'Gate 30c', kind: 'needleInTemplates', needle: 'tfBridgeSessionMe', severity: 'MEDIUM' },
    { id: 'gate.32.giftitemtemplate', gate: 'Gate 32/33', kind: 'needleInTemplates', needle: 'tfRewriteGiftImagesToCache', severity: 'MEDIUM' },
  ],

  // ── Live-ID discovery seeds (Engineer-LiveID probes these for liveness) ──────
  // The user's own account first, then a few high-traffic always-on accounts as
  // fallback so real-event tests can run even when the user isn't streaming.
  liveCandidates: [
    'handsome.run52', // user's account (from /api/tiktok/status)
  ],
};
