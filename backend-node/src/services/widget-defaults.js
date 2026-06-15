// Static defaults for the widget settings bag. Direct port of
// `WidgetSettingsCache.StaticDefaults` from the C# backend (~150 keys).
//
// Slider convention: 50 = neutral/default, 0-100 range.
//
// Keep the key order stable — every fresh save round-trips through this
// object, and the bundle compares result keys to detect "settings changed".
// Re-ordering would force a recompute on every /api/me call.

module.exports = Object.freeze({
  isPro: true,

  // ── cannon ──────────────────────────────────────────────────────────────
  cannon_ballTimeout: 30,
  cannon_maxBalls: 20,
  cannon_ballSize: 50,
  cannon_intensity: 50,
  cannon_showGiftPictures: true,
  cannon_showCannon: true,

  // ── chat ────────────────────────────────────────────────────────────────
  chat_fontSize: 50,
  chat_showBadges: true,
  chat_showProfilePictures: true,
  chat_showPictures: true,
  chat_hideAfter: 0,
  chat_mini: false,
  chat_rightAlignment: true,
  chat_rightToLeft: false,
  chat_slideEffect: true,
  chat_autoWidth: true,
  chat_showChatNormal: true,
  chat_showChatMod: true,
  chat_showChatSub: true,
  chat_usernameRgb: true,
  chat_usernameColorNormal: '#ffffff',
  chat_usernameColorMod: '#5bc0de',
  chat_usernameColorSub: '#f0ad4e',
  chat_commentColorNormal: '#ffffff',
  chat_commentColorMod: '#ffffff',
  chat_commentColorSub: '#ffffff',
  chat_backgroundNormal: 'rgba(0,0,0,0.65)',
  chat_backgroundMod: 'rgba(0,0,0,0.65)',
  chat_backgroundSub: 'rgba(0,0,0,0.65)',
  chat_usernameEffectNormal: 'none',
  chat_usernameEffectMod: 'none',
  chat_usernameEffectSub: 'none',
  chat_usernameWaveNormal: false,
  chat_usernameWaveMod: false,
  chat_usernameWaveSub: false,
  // Wave SPEED select (slow/normal/fast). chat.html reads these; without the
  // defaults the saved key stays prefixed in the bag (normalizeKey only de-prefixes
  // keys present in DEFAULTS) → the widget reads undefined and the choice reverts
  // on reload. 'normal' matches the bundle schema default.
  chat_usernameWaveSpeedNormal: 'normal',
  chat_usernameWaveSpeedMod: 'normal',
  chat_usernameWaveSpeedSub: 'normal',
  chat_usernameGlowNormal: true,
  chat_usernameGlowMod: true,
  chat_usernameGlowSub: true,
  chat_usernameGlowColorNormal: '#ffffff',
  chat_usernameGlowColorMod: '#5bc0de',
  chat_usernameGlowColorSub: '#e8b461',

  // ── firework ────────────────────────────────────────────────────────────
  firework_maxFireworks: 5,
  firework_minCoins: 1,
  firework_repeatWithCombos: true,
  firework_showUsername: true,
  firework_soundEnabled: true,
  firework_soundVolume: 50,

  // ── gifts ───────────────────────────────────────────────────────────────
  gifts_hideAfter: 10,
  gifts_minValue: 0,
  gifts_mini: false,
  gifts_showPictures: true,
  gifts_slideEffect: true,
  gifts_usernameColor: '#ffffff',
  gifts_commentColor: '#cccccc',
  gifts_backgroundColor: 'rgba(0,0,0,0.5)',
  gifts_usernameRgb: true,
  gifts_usernameEffect: 'none',
  gifts_usernameGlow: true,
  gifts_usernameGlowColor: '#ffffff',
  gifts_usernameWave: false,

  // ── emojify ─────────────────────────────────────────────────────────────
  emojify_emojiSize: 40,
  emojify_emoteSize: 40,
  emojify_profilePictureSize: 40,
  emojify_opacity: 100,
  emojify_animationDuration: 3,
  emojify_disappearAfter: 5,
  emojify_rotations: 2,
  emojify_showEmojis: true,
  emojify_showPictures: true,
  emojify_showSubEmotes: true,

  // ── likefountain ────────────────────────────────────────────────────────
  likefountain_randomColor: true,
  likefountain_randomPosition: true,
  likefountain_showProfilePictures: true,
  // widget reads these (likefountain.html:424-425); were missing → normalizeKey
  // kept widget_-prefix → undefined → hardcoded color instead of user's choice.
  likefountain_heartColor1: '#ff859d',
  likefountain_heartColor2: '#8f81fc',

  // ── coindrop ────────────────────────────────────────────────────────────
  coindrop_soundEnabled: true,
  coindrop_soundVolume: 50,

  // ── viewercount ─────────────────────────────────────────────────────────
  viewercount_textColor: '#ffffff',
  viewercount_backgroundColor: 'rgba(0,0,0,0.5)',
  viewercount_borderColor: '#ffffff',
  viewercount_enableBorder: false,
  viewercount_tiktokText: false,

  // ── ranking/topgifter/topliker common ───────────────────────────────────
  currencyName: 'Coins',
  showUserNicknames: false,

  // ── topg (Top Gift) ─────────────────────────────────────────────────────
  // Username + counter both default to top:170 in the widget which causes
  // overlap. Pin canonical YOffsets so DB rows (saved as widget_topg_*) can
  // normalize to these and override correctly.
  topg_titleColor: '#c9c9c9',
  topg_counterColor: '#ebc94d',
  topg_usernameColor: '#ffffff',
  topg_titleYOffset: 5,
  topg_giftYOffset: 30,
  topg_usernameYOffset: 125,
  topg_counterYOffset: 165,
  topg_titleText: 'Top Gift',
  topg_titleSize: 40,
  topg_usernameSize: 60,
  topg_titleEffect: 'none',
  topg_titleWave: false,
  topg_titleWaveSpeed: 'normal',
  topg_titleGlow: false,
  topg_titleGlowColor: '#ffffff',
  topg_usernameEffect: 'none',
  topg_usernameWave: false,
  topg_usernameWaveSpeed: 'normal',
  topg_usernameGlow: false,
  topg_usernameGlowColor: '#ffffff',
  topg_giftEnabled: true,
  topg_giftOpacity: 90,
  topg_showGiftValue: true,
  topg_enableBorder: true,
  topg_borderColor: '#242424',
  topg_coinsAlias: 'Coins',
  topg_fontType: 'Luckiest Guy',
  topg_fontSize: 50,
  topg_fontLineSpacing: 50,
  topg_fontLetterSpacing: 50,

  // ── tops (Top Streak) — same shape as topg but for biggest combo ────────
  tops_titleColor: '#c9c9c9',
  tops_counterColor: '#ebc94d',
  tops_usernameColor: '#ffffff',
  tops_titleYOffset: 5,
  tops_giftYOffset: 30,
  tops_usernameYOffset: 125,
  tops_counterYOffset: 165,
  tops_titleText: 'Top Streak',
  tops_titleSize: 40,
  tops_usernameSize: 60,
  tops_titleEffect: 'none',
  tops_titleWave: false,
  tops_titleWaveSpeed: 'normal',
  tops_titleGlow: false,
  tops_titleGlowColor: '#ffffff',
  tops_usernameEffect: 'none',
  tops_usernameWave: false,
  tops_usernameWaveSpeed: 'normal',
  tops_usernameGlow: false,
  tops_usernameGlowColor: '#ffffff',
  tops_giftEnabled: true,
  tops_giftOpacity: 90,
  tops_showGiftValue: true,
  tops_enableBorder: true,
  tops_borderColor: '#242424',
  tops_fontType: 'Luckiest Guy',
  tops_fontSize: 50,
  tops_fontLineSpacing: 50,
  tops_fontLetterSpacing: 50,

  // ── topgifter ───────────────────────────────────────────────────────────
  topgifter_usernameColor: '#ffffff',
  topgifter_rankColor: '#aaaaaa',
  topgifter_pointsColor: '#ffcc00',
  topgifter_usernameEffect: 'none',
  topgifter_usernameWave: false,
  topgifter_usernameWaveSpeed: 'normal',
  topgifter_showTrophy: true,
  topgifter_showRank: false,
  topgifter_showCoins: true,
  topgifter_showBoxShadow: true,
  topgifter_boxShadowColor: 'rgba(0,0,0,0.5)',
  topgifter_enableBorder: false,
  topgifter_borderColor: '#ffffff',
  topgifter_rightToLeft: false,

  // ── topliker ────────────────────────────────────────────────────────────
  topliker_usernameColor: '#ffffff',
  topliker_rankColor: '#aaaaaa',
  topliker_pointsColor: '#ffcc00',
  topliker_usernameEffect: 'none',
  topliker_usernameWave: false,
  topliker_usernameWaveSpeed: 'normal',
  topliker_showTrophy: true,
  topliker_showRank: false,
  topliker_showLikes: true,
  topliker_showBoxShadow: true,
  topliker_boxShadowColor: 'rgba(0,0,0,0.5)',
  topliker_enableBorder: false,
  topliker_borderColor: '#ffffff',
  topliker_rightToLeft: false,

  // ── ranking ─────────────────────────────────────────────────────────────
  ranking_usernameColor: '#ffffff',
  ranking_rankColor: '#aaaaaa',
  ranking_pointsColor: '#ffcc00',
  ranking_levelColor: '#aaaaaa',
  ranking_usernameEffect: 'none',
  ranking_usernameWave: false,
  ranking_usernameWaveSpeed: 'normal',
  ranking_showRank: false,
  ranking_showLevel: false,
  ranking_showBoxShadow: true,
  ranking_boxShadowColor: 'rgba(0,0,0,0.5)',
  ranking_rightToLeft: false,

  // ── wheel ───────────────────────────────────────────────────────────────
  wheel_soundEnabled: true,
  wheel_soundVolume: 50,

  // ── font settings (slider scale: 50 = default/neutral, 0-100) ───────────
  chat_fontType: '',
  chat_fontLineSpacing: 50,
  chat_fontLetterSpacing: 50,
  gifts_fontType: '',
  gifts_fontSize: 50,
  gifts_fontLineSpacing: 50,
  gifts_fontLetterSpacing: 50,
  cannon_fontType: '',
  cannon_fontSize: 50,
  cannon_fontLineSpacing: 50,
  cannon_fontLetterSpacing: 50,
  topgifter_fontType: '',
  topgifter_fontSize: 50,
  topgifter_fontLineSpacing: 50,
  topgifter_fontLetterSpacing: 50,
  topliker_fontType: '',
  topliker_fontSize: 50,
  topliker_fontLineSpacing: 50,
  topliker_fontLetterSpacing: 50,
  ranking_fontType: '',
  ranking_fontSize: 50,
  ranking_fontLineSpacing: 50,
  ranking_fontLetterSpacing: 50,
  viewercount_fontType: '',
  viewercount_fontSize: 50,
  viewercount_fontLineSpacing: 50,
  viewercount_fontLetterSpacing: 50,
  goal_fontType: '',
  goal_fontSize: 50,
  goal_fontLineSpacing: 50,
  goal_fontLetterSpacing: 50,
  timer_fontType: '',
  timer_fontSize: 50,
  timer_fontLineSpacing: 50,
  timer_fontLetterSpacing: 50,
  // widget reads these (timer.html ~438-500); were missing → undefined → defaults.
  timer_fontColor: '#ebebeb',
  timer_backgroundColor: 'rgba(40, 40, 40, 0.8)',
  timer_hideAfterExpiry: false,
  emojify_fontType: '',
  emojify_fontSize: 50,
  emojify_fontLineSpacing: 50,
  emojify_fontLetterSpacing: 50,
  gifts_usernameWaveSpeed: 'normal',

  // ── coinjar — toast donor on top, leaderboard at bottom, ranks ──────────
  coinjar_displayAlert: true,
  coinjar_alertDuration: 5,
  coinjar_displayLeaderboard: true,
  coinjar_leaderboardDuration: 10,
  coinjar_leaderboardDisplayFormat: 'single',
  coinjar_displayRankBadges: true,
  coinjar_numberOfRanks: 5,
  coinjar_showTotalCoins: true,
  coinjar_scale: 50,
  coinjar_giftScale: 50,
  coinjar_xOffset: 0,
  coinjar_yOffset: 0,

  // ── wheelofactions — show base wheel even when idle ─────────────────────
  wheelofactions_showBase: true,
  wheelofactions_announceDuration: 5,
  wheelofactions_spinDuration: 8,
  wheelofactions_waitDuration: 3,

  // ── coinmatch ───────────────────────────────────────────────────────────
  coinmatch_backgroundColor: 'rgba(0,0,0,0.5)',
  coinmatch_fontColor: '#ffffff',
  coinmatch_countdown: 60,
  coinmatch_countdownStartDelay: 3,
  coinmatch_hideAfter: 10,
  coinmatch_enableSlowCountdown: true,
  coinmatch_randomizedSlowCountdown: true,
  coinmatch_enableSnipeMode: false,
  coinmatch_shouldAutoScroll: true,
  coinmatch_showParticipantsCount: true,
  // These 3 were missing → normalizeKey kept them `widget_`-prefixed → the
  // coinmatch widget (reads settings.coinmatch_title/showWinners/
  // timerBackgroundColor — coinmatch.html:72/74/84) never got them. Defaults
  // from the bundle schema (deobfuscated.js:18716/18765/18817).
  coinmatch_title: 'Coin Match',
  coinmatch_showWinners: 'keepShowing',
  coinmatch_timerBackgroundColor: 'rgba(255, 255, 255, 0.1)',
  coinmatch_showTitle: true,   // widget reads settings.coinmatch_showTitle (coinmatch.html:71); was missing → toggle never applied via persist path

  // ── commandinfo ─────────────────────────────────────────────────────────
  commandinfo_fontColor: '#ffffff',
  commandinfo_headerColor: '#ffcc00',
  commandinfo_priceColor: '#4ade80',
  commandinfo_showBoxShadow: true,
  commandinfo_boxShadowColor: 'rgba(0,0,0,0.5)',
  commandinfo_rightToLeft: false,
  commandinfo_showCustomCommands: true,

  // ── lastx ───────────────────────────────────────────────────────────────
  lastXFadeDuration: 250,

  // ── ranking levels ──────────────────────────────────────────────────────
  levelPoints: 1000,
  levelMultiplikator: 1.5,

  // ── songrequests ────────────────────────────────────────────────────────
  songrequests_fontColor: '#ffffff',
  songrequests_titleColor: '#ffcc00',
  songrequests_showBoxShadow: true,
  songrequests_boxShadowColor: 'rgba(0,0,0,0.5)',
  songrequests_rightToLeft: false,

  // ── topgifter extras ────────────────────────────────────────────────────
  topgifter_showCrown: true,
  topgifter_showCoinSymbol: true,

  // ── topliker extras ─────────────────────────────────────────────────────
  topliker_showCrown: true,
  topliker_showHeartSymbol: true,
  topliker_pulseHeartSymbol: true,

  // ── transactionviewer ───────────────────────────────────────────────────
  transactionviewer_fontColor: '#ffffff',
  transactionviewer_fontColor_positive: '#4ade80',
  transactionviewer_fontColor_negative: '#ef5350',
  transactionviewer_showBoxShadow: true,
  transactionviewer_boxShadowColor: 'rgba(0,0,0,0.5)',
  transactionviewer_showChatMinutes: true,

  // ── userinfo ────────────────────────────────────────────────────────────
  userinfo_usernameColor: '#ffffff',
  userinfo_pointsColor: '#ffcc00',
  userinfo_rankColor: '#aaaaaa',
  userinfo_levelColor: '#aaaaaa',
  userinfo_showBoxShadow: true,
  userinfo_boxShadowColor: 'rgba(0,0,0,0.5)',
  userinfo_rightToLeft: false,

  // ── myactions ───────────────────────────────────────────────────────────
  // Without these, mediawrapper's `settings.myactions_X === false` checks read
  // undefined and the visual effects (3D shadow, bounce, waves) depend on race
  // timing between text-effects.js (10ms setTimeout) and updateFontSettings().
  // Pin all defaults so every fire renders identically.
  myactions_fontType: '',
  myactions_fontSize: 50,
  myactions_fontLineSpacing: 50,
  myactions_fontLetterSpacing: 50,
  myactions_enable3d: true,
  myactions_enableMove: true,
  myactions_enableWaves: true,
  myactions_singleTextLine: false,
  myactions_rightToLeft: false,
  myactions_enableUsernameColor: true,
  myactions_usernameColor: '#32c3a6',
  myactions_enableUsernameWiggle: false,
  myactions_usernameFontSize: 50,
  myactions_usernameEffect: 'none',
  myactions_usernameWave: false,
  myactions_usernameWaveSpeed: 'normal',
  myactions_usernameGlow: false,
  myactions_usernameGlowColor: '#ffffff',
  myactions_profilePictureSize: 50,
  myactions_showProfilePictures: true,
  myactions_showGiftPictures: false,
  myactions_enableBorder: false,
  myactions_borderColor: '#000000',
  myactions_enableTextShadow: false,

  // ── fallingsnow ─────────────────────────────────────────────────────────
  // Only one control: `variation` (picks one of 8 webm snow videos). It was
  // MISSING here, so normalizeKey() never de-prefixed `widget_fallingsnow_variation`
  // → the broadcast bag kept the prefix → the widget read settings['fallingsnow_variation']
  // = undefined → fell back to 'simple_snow_1'. The in-app preview HID this (it reads a
  // warm `cachedSettings` from the live socket), but OBS/standalone + reload reverted the
  // snow. Listing the key (canonical case) lets normalizeKey strip the prefix so a saved
  // variation survives reload/OBS. Default matches the bundle field default + widget
  // fallback (simple_snow_1). Same class as cannon_* (audit 2026-06-14).
  fallingsnow_variation: 'simple_snow_1',
});
