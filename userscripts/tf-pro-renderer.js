/* tf-pro-renderer.js -- runs in page context via executeJavaScript. No Node.js APIs. */
/* ASCII-only source: Unicode chars replaced with \uXXXX escapes to avoid SyntaxError on injection */
(function tfProElectron() {
  'use strict';
  if (window.__tfElectronPro) return;
  window.__tfElectronPro = true;

  var CREDITS = 100000;
  /* Latin Extended + Vietnamese range via Unicode escapes (no literal non-ASCII bytes) */
  var ACCENT_RE = /[\u00C0-\u024F\u1E00-\u1EFF]/;

  function cleanText(t) { return String(t || '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, 200) || ' '; }
  function buildGoogleTts(text) {
    var t = cleanText(text);
    var lang = ACCENT_RE.test(t) ? 'vi' : 'en';
    return 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + lang + '&q=' + encodeURIComponent(t);
  }
  function quota() {
    return {
      exceeded: false, currentUsageMode: 'sub_credits', currentUsageCurrency: 'credits',
      subscriptionCreditsRemaining: CREDITS, subscriptionCreditsTotal: CREDITS,
      purchasedCreditsRemaining: 0, purchasedCreditsTotal: 0,
      freeRequestsRemaining: 0, freeRequestsTotal: 0,
      nextResetAt: new Date(Date.now() + 2592000000).toISOString(), nextResetSeconds: 2592000,
    };
  }
  function jsonRes(o, s) { return new Response(JSON.stringify(o), { status: s || 200, headers: { 'content-type': 'application/json' } }); }
  function parseBody(b) { try { return b ? (typeof b === 'string' ? JSON.parse(b) : b) : {}; } catch (_) { return {}; } }

  /* -- Fetch intercept -- */
  var origFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var method = (init && init.method) || (typeof input !== 'string' && input && input.method) || 'GET';

      if (/\/api\/tts\/(generate|preview)(\b|\/|\?|$)/.test(url)) {
        var body = (init && init.body) || (typeof input !== 'string' && input && input.body);
        var x = parseBody(body);
        var text = cleanText(x.text) || 'Xin chao day la TTS thu nghiem';
        return Promise.resolve(jsonRes({
          statusCode: 200, message: 'Success',
          data: {
            result: { fromCache: false, audioUrl: buildGoogleTts(text), engineType: null, generationDurationMs: 200 },
            user: { id: 1, userId: '1', quota: quota() }, quota: quota(),
          },
        }));
      }

      if (/\/api\/tts\/user(\b|\/|\?|$)/.test(url)) {
        return Promise.resolve(jsonRes({ statusCode: 200, message: 'Success', data: { id: 1, userId: '1', quota: quota() } }));
      }

      if (/\/api\/me(\b|\/|\?|$)/.test(url) && (!method || method.toUpperCase() === 'GET')) {
        return origFetch(input, init).then(function (res) {
          return res.clone().json().then(function (j) {
            try { j.isPro = true; if (j.userFeatures) j.userFeatures.isPro = true; else j.userFeatures = { isPro: true, proInfo: null }; } catch (_) {}
            return jsonRes(j, res.status);
          }).catch(function () { return res; });
        });
      }
    } catch (_) {}
    return origFetch(input, init);
  };

  /* -- Audio -> Google TTS redirect -- */
  var OrigAudio = window.Audio;
  function rewriteAudio(src) {
    if (typeof src !== 'string' || !src) return src;
    if (/translate\.google\.com\/translate_tts/.test(src)) return src;
    if (/tikfinity-tts-api\.zerody\.one/.test(src)) {
      var m = src.match(/[?&]text=([^&]*)/);
      if (m) return buildGoogleTts(decodeURIComponent(m[1].replace(/\+/g, ' ')));
    }
    return src;
  }
  window.Audio = function (src) { return arguments.length ? new OrigAudio(rewriteAudio(src)) : new OrigAudio(); };
  window.Audio.prototype = OrigAudio.prototype;

  /* -- Pro state -- */
  function neuterTts() {
    var t = window.tts; if (!t || typeof t !== 'object') return;
    try { t.markAiCreditsBlocked = function () {}; } catch (_) {}
    try { t.shouldBlockAiGenerate = function () { return false; }; } catch (_) {}
    try { t.isAiFreeQuotaExceeded = function () { return false; }; } catch (_) {}
    t.aiCreditsBlocked = false; t.proCredits = CREDITS; t.proCreditsMax = CREDITS;
    t.subscriptionCreditsRemaining = CREDITS; t.subscriptionCreditsTotal = CREDITS;
    t.topUpCredits = 0; t.purchasedCreditsRemaining = 0;
    if (typeof t.syncNavigationStoreCredits === 'function') try { t.syncNavigationStoreCredits(); } catch (_) {}
  }

  function unlockActions() {
    try { var ae = window.actionsandevents; if (ae && Array.isArray(ae.actions)) ae.actions.forEach(function (a) { if (a && a.isTempDisabled) a.isTempDisabled = false; }); } catch (_) {}
    try { var s = window.sounds; if (s && Array.isArray(s.soundsDataSource)) s.soundsDataSource.forEach(function (x) { if (x && x.isTempDisabled) x.isTempDisabled = false; }); } catch (_) {}
  }

  function patchPinia() {
    var apps = document.querySelectorAll('[data-v-app]');
    for (var i = 0; i < apps.length; i++) {
      var app = apps[i].__vue_app__; if (!app) continue;
      var p = app.config && app.config.globalProperties && app.config.globalProperties.$pinia;
      if (!p || !p.state || !p.state.value) continue;
      var nav = p.state.value.navigation;
      if (nav && typeof nav === 'object') {
        if (nav.isPro !== true) try { nav.isPro = true; } catch (_) {}
        if ('ttsProCredits' in nav) try { nav.ttsProCredits = CREDITS; } catch (_) {}
        if ('ttsProCreditsMax' in nav) try { nav.ttsProCreditsMax = CREDITS; } catch (_) {}
        if ('trialBannerDismissed' in nav) try { nav.trialBannerDismissed = true; } catch (_) {}
      }
      var map = { proCredits: CREDITS, proCreditsMax: CREDITS, subscriptionCreditsRemaining: CREDITS, subscriptionCreditsTotal: CREDITS, lastKnownAiCreditsTotal: CREDITS, aiCreditsBlocked: false, topUpCredits: 0, purchasedCreditsRemaining: 0, trialBannerDismissed: true };
      var st = p.state.value;
      for (var n in st) { var s = st[n]; if (!s || typeof s !== 'object') continue; for (var k in map) if (k in s && s[k] !== map[k]) try { s[k] = map[k]; } catch (_) {} }
    }
  }

  function trapSessionMe() {
    var me = window.session && window.session.me; if (!me) return;
    function trap(o, key) {
      if (!o) return;
      try { var dd = Object.getOwnPropertyDescriptor(o, key); if (dd && dd.get && dd.get() === true) return; Object.defineProperty(o, key, { get: function () { return true; }, set: function () {}, configurable: true, enumerable: true }); } catch (e) { try { o[key] = true; } catch (_) {} }
    }
    trap(me, 'isPro');
    if (!me.userFeatures) me.userFeatures = { isPro: true, proInfo: null }; else trap(me.userFeatures, 'isPro');
  }

  function patchDom() {
    if (typeof window.$ !== 'function') return;
    try {
      window.$('.nopro').hide(); window.$('.proPromoBox').css('display', 'none').removeClass('shakeEffect');
      var $e = window.$('.appNameExtra'); if ($e.length && $e.text() !== 'Pro') $e.text('Pro').css('display', 'inline-block').addClass('proColor');
      window.$('#actionProExpiredWarning,#soundsProExpiredWarning').addClass('hidden');
      window.$('[class*="upgrade"],[class*="proPromo"],#upgrade-button-wrap').each(function () { var $el = window.$(this); if (/upgrade/i.test($el.text())) $el.hide(); });
    } catch (_) {}
  }

  function tick() { neuterTts(); unlockActions(); patchPinia(); trapSessionMe(); patchDom(); }
  [100, 500, 1000, 2000, 4000].forEach(function (ms) { setTimeout(tick, ms); });
  setInterval(tick, 1500);
  setTimeout(function () { try { if (window.tts && typeof window.tts.loadUserCredits === 'function') window.tts.loadUserCredits(); } catch (_) {} }, 1200);

  console.log('%c[tf-pro-electron] Pro active -- survive reloads via asar patch', 'color:#16c784;font-weight:bold');
})();
