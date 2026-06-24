// ==UserScript==
// @name         TikFinity Gốc — Pro + AI TTS
// @namespace    tikmax-qa
// @version      2.1
// @description  Kích hoạt Pro + AI TTS phát thật (Web Speech / Google TTS fallback). QA tool.
// @author       TikMax QA
// @match        https://tikfinity.zerody.one/*
// @match        https://tikfinity.zerody.four/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* ════════════════════════════════════════════════════════════════════════
   TikFinity GỐC — Activate Pro + AI TTS PHÁT THẬT (v2.1: Tampermonkey auto-run)
   ────────────────────────────────────────────────────────────────────────
   DÙNG TAMPERMONKEY (khuyên dùng — tự chạy, không cần paste):
     1. Cài Tampermonkey extension (Chrome/Edge)
     2. New script → dán toàn bộ file này → Save
     3. Mở tikfinity.zerody.one → script tự chạy khi page load

   DÙNG THỦ CÔNG (fallback): F12 → Console → dán toàn bộ file → Enter.

   v2.1: thêm Tampermonkey headers (@run-at document-start → patch fetch trước bundle)
   v2 thêm:
     • TTS ưu tiên giọng tiếng Việt CÀI SẴN trong máy (Web Speech / speechSynthesis)
       → phát local, không trễ mạng → MƯỢT hơn. Không có giọng VN → fallback Google.
     • Mở khoá thẳng action + sound (isTempDisabled=false) → xài được ngay, khỏi reload.
     • Chỉnh tốc độ/cao độ qua TTS_RATE / TTS_PITCH.

   Cơ chế verify từ decompiled gốc:
     - executeAction chặn action nếu a.isTempDisabled (báo "upgrade to Pro"). [mod:8921]
     - isTempDisabled set client theo userFeatures.isPro.            [mod:7113-7116, 13033]
     - play() làm new Audio(audioUrl).play(), nghe sự kiện playing/ended/error. [app:74824,74888]
   ════════════════════════════════════════════════════════════════════════ */
(function tfGocProTts() {
  'use strict';
  if (window.__tfFreeTtsInstalled) {
    console.warn('[tf-pro-tts] đã cài rồi — reload trang nếu muốn cài lại.');
    return;
  }
  window.__tfFreeTtsInstalled = true;

  /* ───────── CONFIG ───────── */
  var CREDITS = 100000;
  var MAX_TTS_CHARS = 200;        // giới hạn / request cho Google fallback
  var TTS_RATE = 1.0;             // tốc độ đọc speechSynthesis (0.5–2). 1.05 nghe tự nhiên hơn
  var TTS_PITCH = 1.0;            // cao độ (0–2)
  var PREFER_VOICE = '';          // ép tên giọng cụ thể (vd 'Microsoft An'). Rỗng = tự chọn.
  var VOICERSS_KEY = '';          // (tuỳ chọn) key free voicerss.org cho fallback

  var ACCENT_RE = /[À-ɏḀ-ỿ]/;     // có dấu Latin → tiếng Việt

  /* ───────── Chọn giọng tiếng Việt trong máy ───────── */
  var VI_VOICE = null;
  function pickViVoice() {
    try {
      var vs = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      if (!vs || !vs.length) return null;
      var vi = vs.filter(function (v) { return /^vi/i.test(v.lang) || /viet/i.test(v.name); });
      if (!vi.length) return null;
      if (PREFER_VOICE) {
        var forced = vi.find(function (v) { return v.name.indexOf(PREFER_VOICE) >= 0; })
          || vs.find(function (v) { return v.name.indexOf(PREFER_VOICE) >= 0; });
        if (forced) return forced;
      }
      // ưu tiên giọng neural/online (mượt nhất)
      return vi.find(function (v) { return /natural|neural|online|hoaimy|namminh/i.test(v.name); }) || vi[0];
    } catch (_) { return null; }
  }
  function refreshVoice() { var v = pickViVoice(); if (v) VI_VOICE = v; }
  if (window.speechSynthesis) {
    refreshVoice();
    try { window.speechSynthesis.onvoiceschanged = refreshVoice; } catch (_) {}
    setTimeout(refreshVoice, 400); setTimeout(refreshVoice, 1500);
  }

  /* ───────── TTS URL builders ───────── */
  function cleanText(t) { return String(t || '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, MAX_TTS_CHARS); }
  function detectLang(t) { return ACCENT_RE.test(t) ? 'vi' : 'en'; }
  function buildGoogle(text) {
    var t = cleanText(text) || ' ';
    return 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + detectLang(t) + '&q=' + encodeURIComponent(t);
  }
  function buildFreeTts(text) {
    var t = cleanText(text) || ' ';
    // Có giọng VN trong máy → dùng speechSynthesis (mượt, local). Không → Google.
    if (window.speechSynthesis && VI_VOICE) return 'tfspeak:' + encodeURIComponent(t);
    return buildGoogle(t);
  }

  /* ───────── Fake <audio> chạy speechSynthesis (emulate API bundle dùng) ───────── */
  var OrigAudio = window.Audio;
  function TFSpeechAudio(text) {
    this._text = text; this._vol = 1; this._listeners = {}; this.duration = 0; this._utt = null; this._fb = null;
  }
  TFSpeechAudio.prototype.addEventListener = function (t, fn) { (this._listeners[t] = this._listeners[t] || []).push(fn); };
  TFSpeechAudio.prototype.removeEventListener = function (t, fn) {
    var a = this._listeners[t]; if (a) { var i = a.indexOf(fn); if (i >= 0) a.splice(i, 1); }
  };
  TFSpeechAudio.prototype._emit = function (t) {
    var a = (this._listeners[t] || []).slice();
    for (var i = 0; i < a.length; i++) { try { a[i].call(this, { type: t, target: this }); } catch (_) {} }
  };
  Object.defineProperty(TFSpeechAudio.prototype, 'volume', {
    get: function () { return this._vol; },
    set: function (v) { this._vol = v; if (this._utt) this._utt.volume = v; if (this._fb) this._fb.volume = v; },
    configurable: true,
  });
  Object.defineProperty(TFSpeechAudio.prototype, 'currentTime', { get: function () { return 0; }, set: function () {}, configurable: true });
  Object.defineProperty(TFSpeechAudio.prototype, 'src', { get: function () { return 'tfspeak:'; }, set: function () {}, configurable: true });
  TFSpeechAudio.prototype.play = function () {
    var self = this;
    if (!window.speechSynthesis || !VI_VOICE) {
      // fallback Google
      self._fb = new OrigAudio(buildGoogle(self._text));
      self._fb.volume = self._vol;
      ['playing', 'ended', 'error', 'abort', 'pause'].forEach(function (t) {
        self._fb.addEventListener(t, function () { self._emit(t); });
      });
      return self._fb.play();
    }
    try {
      var u = new SpeechSynthesisUtterance(self._text);
      u.voice = VI_VOICE; u.lang = VI_VOICE.lang || 'vi-VN';
      u.volume = self._vol; u.rate = TTS_RATE; u.pitch = TTS_PITCH;
      self._utt = u;
      u.onstart = function () { self._emit('playing'); };
      u.onend = function () { self._emit('ended'); };
      u.onerror = function () { self._emit('error'); };
      try { window.speechSynthesis.resume(); } catch (_) {}
      window.speechSynthesis.speak(u);
      return Promise.resolve();
    } catch (e) { setTimeout(function () { self._emit('error'); }, 0); return Promise.reject(e); }
  };
  TFSpeechAudio.prototype.pause = function () {
    try { if (this._fb) this._fb.pause(); else if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (_) {}
  };

  /* ───────── Precondition R4: ttsHost + token ───────── */
  window.appConfig = window.appConfig || {};
  if (!window.appConfig.ttsHost) window.appConfig.ttsHost = 'https://tts.tikfinity.com';
  if (!window.ttsAuthToken) window.ttsAuthToken = (window.session && window.session.me && window.session.me.ttsAuthToken) || 'tf-free-token';

  /* ───────── Response helpers ───────── */
  function quota() {
    return {
      exceeded: false, currentUsageMode: 'sub_credits', currentUsageCurrency: 'credits',
      subscriptionCreditsRemaining: CREDITS, subscriptionCreditsTotal: CREDITS,
      purchasedCreditsRemaining: 0, purchasedCreditsTotal: 0, freeRequestsRemaining: 0, freeRequestsTotal: 0,
      nextResetAt: new Date(Date.now() + 2592000000).toISOString(), nextResetSeconds: 2592000,
    };
  }
  function jsonRes(o, s) { return new Response(JSON.stringify(o), { status: s || 200, headers: { 'content-type': 'application/json' } }); }
  function parseBody(b) { try { return b ? (typeof b === 'string' ? JSON.parse(b) : b) : {}; } catch (_) { return {}; } }
  var PREVIEW_SAMPLE = 'Xin chào, đây là giọng đọc thử nghiệm.';
  function generateRes(b) {
    var x = parseBody(b);
    // Nút Test gọi /api/tts/preview KHÔNG kèm text → dùng câu mẫu cho có tiếng.
    var text = cleanText(x.text) || PREVIEW_SAMPLE;
    return jsonRes({ statusCode: 200, message: 'Success', data: {
      result: { fromCache: false, audioUrl: buildFreeTts(text), engineType: null, generationDurationMs: 200 },
      user: { id: 1, userId: '1', quota: quota() }, quota: quota(),
    } });
  }
  function ttsUserRes() { return jsonRes({ statusCode: 200, message: 'Success', data: { id: 1, userId: '1', quota: quota() } }); }

  function isGenerate(u) { return /\/api\/tts\/(generate|preview)(\b|\/|\?|$)/.test(u); }
  function isTtsUser(u) { return /\/api\/tts\/user(\b|\/|\?|$)/.test(u); }
  function isMeGet(u, m) { return /\/api\/me(\b|\/|\?|$)/.test(u) && (!m || String(m).toUpperCase() === 'GET'); }

  /* ───────── Patch window.fetch ───────── */
  var origFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var method = (init && init.method) || (typeof input !== 'string' && input && input.method) || 'GET';
      if (isGenerate(url)) { var body = (init && init.body) || (typeof input !== 'string' && input && input.body); return Promise.resolve(generateRes(body)); }
      if (isTtsUser(url)) return Promise.resolve(ttsUserRes());
      if (isMeGet(url, method)) {
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

  /* ───────── Patch Audio: sentinel speech + rewrite google/zerody URL ───────── */
  function rewriteAudioUrl(u) {
    try {
      if (typeof u !== 'string' || !u) return u;
      if (u.indexOf('tfspeak:') === 0) return u;
      if (/translate\.google\.com\/translate_tts/.test(u) || /api\.voicerss\.org/.test(u)) return u;
      if (/google\.com\/speech-api/.test(u) || /tikfinity-tts-api\.zerody\.one/.test(u)) {
        var m = u.match(/[?&]text=([^&]*)/);
        if (m) return buildFreeTts(decodeURIComponent(m[1].replace(/\+/g, ' ')));
      }
    } catch (_) {}
    return u;
  }
  window.Audio = function (src) {
    if (arguments.length) {
      if (typeof src === 'string' && src.indexOf('tfspeak:') === 0) return new TFSpeechAudio(decodeURIComponent(src.slice(8)));
      var r = rewriteAudioUrl(src);
      if (typeof r === 'string' && r.indexOf('tfspeak:') === 0) return new TFSpeechAudio(decodeURIComponent(r.slice(8)));
      return new OrigAudio(r);
    }
    return new OrigAudio();
  };
  window.Audio.prototype = OrigAudio.prototype;
  try {
    var proto = window.HTMLMediaElement && window.HTMLMediaElement.prototype;
    var d = proto && Object.getOwnPropertyDescriptor(proto, 'src');
    if (d && d.set && d.get) {
      Object.defineProperty(proto, 'src', {
        configurable: true, enumerable: d.enumerable,
        get: function () { return d.get.call(this); },
        set: function (v) { var r = rewriteAudioUrl(v); if (typeof r === 'string' && r.indexOf('tfspeak:') === 0) r = buildGoogle(decodeURIComponent(r.slice(8))); d.set.call(this, r); },
      });
    }
  } catch (_) {}

  /* ───────── Neuter credit gate + force Pro state ───────── */
  function neuterTts() {
    var t = window.tts; if (!t || typeof t !== 'object') return;
    try { t.markAiCreditsBlocked = function () {}; } catch (_) {}
    try { t.shouldBlockAiGenerate = function () { return false; }; } catch (_) {}
    try { t.isAiFreeQuotaExceeded = function () { return false; }; } catch (_) {}
    t.aiCreditsBlocked = false; t.proCredits = CREDITS; t.proCreditsMax = CREDITS;
    t.subscriptionCreditsRemaining = CREDITS; t.subscriptionCreditsTotal = CREDITS; t.topUpCredits = 0; t.purchasedCreditsRemaining = 0;
    if (typeof t.syncNavigationStoreCredits === 'function') { try { t.syncNavigationStoreCredits(); } catch (_) {} }
  }

  /* ───────── Mở khoá action + sound (isTempDisabled=false) ───────── */
  function unlockActions() {
    try {
      var ae = window.actionsandevents;
      if (ae && Array.isArray(ae.actions)) ae.actions.forEach(function (a) { if (a && a.isTempDisabled) a.isTempDisabled = false; });
    } catch (_) {}
    try {
      var s = window.sounds;
      if (s && Array.isArray(s.soundsDataSource)) s.soundsDataSource.forEach(function (x) { if (x && x.isTempDisabled) x.isTempDisabled = false; });
    } catch (_) {}
  }

  /* ───────── Pro UI (Pinia + session.me + DOM) ───────── */
  function patchPinia() {
    var apps = document.querySelectorAll('[data-v-app]');
    for (var i = 0; i < apps.length; i++) {
      var app = apps[i].__vue_app__; if (!app) continue;
      var p = app.config && app.config.globalProperties && app.config.globalProperties.$pinia; if (!p || !p.state || !p.state.value) continue;
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
    function trap(o, key) { if (!o) return; try { var dd = Object.getOwnPropertyDescriptor(o, key); if (dd && dd.get && dd.get() === true) return; Object.defineProperty(o, key, { get: function () { return true; }, set: function () {}, configurable: true, enumerable: true }); } catch (e) { try { o[key] = true; } catch (_) {} } }
    trap(me, 'isPro'); if (!me.userFeatures) me.userFeatures = { isPro: true, proInfo: null }; else trap(me.userFeatures, 'isPro');
  }
  function patchDom() {
    if (typeof window.$ !== 'function') return;
    try {
      window.$('.nopro').hide(); window.$('.proPromoBox').css('display', 'none').removeClass('shakeEffect');
      var $e = window.$('.appNameExtra'); if ($e.length && $e.text() !== 'Pro') $e.text('Pro').css('display', 'inline-block').addClass('proColor');
      window.$('#actionProExpiredWarning,#soundsProExpiredWarning').addClass('hidden');
      window.$('[class*="upgrade"],[class*="proPromo"],#upgrade-button-wrap').each(function () { var $el = window.$(this); if (/upgrade|nâng cấp/i.test($el.text())) $el.hide(); });
    } catch (_) {}
  }

  function tick() { neuterTts(); unlockActions(); patchPinia(); trapSessionMe(); patchDom(); }
  [50, 300, 800, 1500, 3000, 5000].forEach(function (ms) { setTimeout(tick, ms); });
  setInterval(tick, 1500);
  setTimeout(function () { try { if (window.tts && typeof window.tts.loadUserCredits === 'function') window.tts.loadUserCredits(); } catch (_) {} }, 1200);

  console.log('%c[tf-pro-tts v2] ĐÃ CÀI XONG', 'color:#16c784;font-weight:bold');
  console.log('  • Giọng VN trong máy:', VI_VOICE ? VI_VOICE.name + ' (' + VI_VOICE.lang + ')' : 'KHÔNG có → dùng Google Translate TTS');
  console.log('  • Action + Sound đã mở khoá. Pro giữ cứng mỗi 1.5s.');
  console.log('  • Liệt kê giọng VN có sẵn: speechSynthesis.getVoices().filter(v=>/^vi/i.test(v.lang)).map(v=>v.name)');
})();
