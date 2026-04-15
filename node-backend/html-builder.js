// Ports BuildIndexHtml from Program.cs — injects JS patches into index.html
const fs = require('fs');
const path = require('path');

function buildIndexHtml(frontendPath, defaultChannelId = 1, defaultChannelName = 'user', jwtToken = '') {
  const indexPath = path.join(frontendPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.warn('[WARN] index.html not found at:', indexPath);
    return '<html><body><h1>index.html not found</h1></body></html>';
  }

  let html = fs.readFileSync(indexPath, 'utf8');

  // --- String replacements ---
  html = html.replace(/authApiHost:"https:\/\/auth\.zerody\.one\/"/g, 'authApiHost:""');
  html = html.replace(/myinstantsApiHost:"https:\/\/myinstantsapi\.zerody\.one\/"/g, 'myinstantsApiHost:"/myinstants-proxy/"');
  html = html.replace(/connectorHost:"https:\/\/tikfinity-cws-[^"]*\.zerody\.one\/"/g, 'connectorHost:""');

  // Remove analytics/tracking scripts
  html = html.replace(/<script[^>]*posthog[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*sentry[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*cloudflare[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*amplitude[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*google[^>]*analytics[^>]*>[\s\S]*?<\/script>/gi, '');

  // --- Early CSS ---
  const earlyCss = `
<style id="tf-nav-early">
  #sidebar { display: none !important; }
  #navigation-app { display: block !important; }
  #navigation-app.hidden { display: block !important; }
</style>`;

  // --- Main block script ---
  const blockScript = `
<script>
(function(){
  // AUTO-LOGIN with real JWT
  var _jwt = '${jwtToken}';
  if (_jwt && !localStorage.getItem('setting_loginaccesstoken')) {
    document.cookie = 'tf_login_token=' + _jwt + '; path=/; max-age=2592000; SameSite=Lax';
    document.cookie = 'tf_channelid=${defaultChannelId}; path=/; max-age=2592000; SameSite=Lax';
    document.cookie = 'tf_channelname=${defaultChannelName}; path=/; max-age=2592000; SameSite=Lax';
    document.cookie = 'tf_ispro=true; path=/; max-age=2592000; SameSite=Lax';
    try {
      localStorage.setItem('setting_loginaccesstoken', _jwt);
      localStorage.setItem('setting_channelid', '${defaultChannelId}');
      localStorage.setItem('setting_channelname', '${defaultChannelName}');
      localStorage.setItem('setting_ispro', 'true');
    } catch(e) {}
  }

  // GLOBAL STUBS (modules.js defines these, but we load it lazily)
  window.setup = new Proxy({inputValues:{},options:{}}, {
    get: function(t,p) { if (p in t) return t[p]; if (p==='then') return undefined; return function(){}; },
    set: function(t,p,v) { t[p]=v; return true; }
  });
  window.obsdocks = { init: function(){}, stretchIframe: function(){} };
  window.obsoverlays = { stretchIframe: function(){}, init: function(){} };
  window.start = { showItems: function(){}, init: function(){}, refreshRecentTransactions: function(){} };
  window.transaction = { init: function(){} };
  window.crossconnect = { subscribe: function(){}, init: function(){} };
  window.trial = { init: function(){} };
  window.pro = { init: function(){} };
  window.yearlyUpgrade = { init: function(){} };

  // LAZY MODULE LOADER
  window._injectModules = function() {
    return new Promise(function(resolve) {
      if (document.querySelector('script[src*="modules.js"]')) { resolve(); return; }
      var s = document.createElement('script');
      s.src = '/combo/modules.js';
      s.onload = resolve;
      s.onerror = resolve;
      document.head.appendChild(s);
    });
  };

  // VUE ERROR HANDLER INTERCEPT
  Object.defineProperty(window, 'Vue', {
    configurable: true,
    set: function(v) {
      delete window.Vue;
      window.Vue = v;
      if (v && v.createApp) {
        var _origCreate = v.createApp;
        v.createApp = function() {
          var app = _origCreate.apply(this, arguments);
          var _origHandler = app.config.errorHandler;
          app.config.errorHandler = function(err) {
            var msg = (err && err.message) || String(err);
            if (_isKnownError(msg)) { console.warn('[TF-GUARD] Vue:', msg); return; }
            if (_origHandler) return _origHandler.apply(this, arguments);
            console.error('[Vue]', err);
          };
          return app;
        };
      }
    }
  });

  // RELOAD GUARD
  try {
    var _origReload = window.location.reload.bind(window.location);
    window.__tfOrigReload = _origReload;
    window.location.reload = function() { console.warn('[TF-GUARD] Blocked reload'); };
    setTimeout(function() { window.location.reload = _origReload; }, 30000);
    if (window.navigation) {
      var _guardUntil = Date.now() + 15000;
      window.navigation.addEventListener('navigate', function(e) {
        if (Date.now() > _guardUntil) return;
        if (window.__tfAuthReloading) return;
        try {
          var dest = new URL(e.destination.url);
          if (dest.pathname === '/' && window.location.pathname !== '/') { e.preventDefault(); }
          if (dest.pathname === window.location.pathname && dest.search === window.location.search) { e.preventDefault(); }
        } catch(ex) {}
      });
    }
  } catch(e) {}

  // XHR RESPONSETEXT FIX
  try {
    var _rtDesc = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText');
    if (_rtDesc && _rtDesc.get) {
      Object.defineProperty(XMLHttpRequest.prototype, 'responseText', {
        get: function() {
          if (this.responseType === 'json') {
            try { return typeof this.response === 'string' ? this.response : JSON.stringify(this.response); }
            catch(e) { return ''; }
          }
          return _rtDesc.get.call(this);
        },
        configurable: true
      });
    }
  } catch(e) {}

  // ERROR SUPPRESSION
  var _suppressPatterns = [
    'is not defined', 'is not a function',
    'Cannot read properties of undefined', 'Cannot read properties of null',
    'challengeRunning', 'Unexpected end of JSON',
    'checkLimit', 'responseText', 'isInViewport',
    'onChannelContextChanged', 'injectModules'
  ];
  function _isKnownError(msg) {
    if (typeof msg !== 'string') return false;
    for (var i = 0; i < _suppressPatterns.length; i++) {
      if (msg.indexOf(_suppressPatterns[i]) >= 0) return true;
    }
    return false;
  }
  window.addEventListener('error', function(e) {
    var msg = (e.message || (e.error && e.error.message) || '');
    if (_isKnownError(msg)) { e.preventDefault(); e.stopImmediatePropagation(); return false; }
  }, true);
  window.addEventListener('unhandledrejection', function(e) {
    var msg = (e.reason && e.reason.message) ? e.reason.message : String(e.reason || '');
    if (_isKnownError(msg)) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
  var _appOnerror = null;
  Object.defineProperty(window, 'onerror', {
    get: function() { return function(msg) { if (_isKnownError(typeof msg === 'string' ? msg : '')) return true; if (_appOnerror) return _appOnerror.apply(window, arguments); }; },
    set: function(fn) { _appOnerror = fn; },
    configurable: true
  });

  // SPLASH SCREEN AUTO-DISMISS
  setTimeout(function() {
    var splash = document.getElementById('splashScreen');
    if (splash && splash.style.display !== 'none') {
      splash.style.display = 'none';
      document.body.classList.remove('hidden');
      var pages = document.getElementById('pages');
      if (pages) pages.classList.remove('hidden');
      var nav = document.getElementById('navigation-app');
      if (nav) nav.classList.remove('hidden');
    }
  }, 6000);

  // PRO STATUS ENFORCEMENT
  setInterval(function(){
    try {
      if (window.session) {
        if (window.session.userFeatures && !window.session.userFeatures.isPro) {
          window.session.userFeatures.isPro = true;
          if (window.session.userFeatures.proInfo) {
            window.session.userFeatures.proInfo.plan = 'pro';
            window.session.userFeatures.proInfo.active = true;
          }
        }
        if (window.session.subscription && !window.session.subscription.isPro) {
          window.session.subscription.isPro = true;
        }
      }
    } catch(e) {}
  }, 2000);

  // POSTHOG STUB
  window.posthog = {
    init: function(){}, identify: function(){}, capture: function(){}, register: function(){},
    people: { set: function(){} }, onFeatureFlags: function(cb) { try { cb(); } catch(e) {} },
    isFeatureEnabled: function(f) {
      if (f === 'new-navigation') return true;
      if (f === 'new-navigation-design') return true;
      return false;
    },
    getFeatureFlag: function(f) {
      if (f === 'new-navigation') return true;
      if (f === 'new-navigation-design') return true;
      return undefined;
    },
    reloadFeatureFlags: function(){}, reset: function(){}, opt_out_capturing: function(){}
  };

  // SENTRY STUB
  window.Sentry = { init: function(){}, captureException: function(){}, captureMessage: function(){}, configureScope: function(){} };

  // ANALYTICS BLOCKING
  var _origBeacon = navigator.sendBeacon;
  navigator.sendBeacon = function(url) {
    if (typeof url === 'string' && (url.includes('posthog') || url.includes('sentry') || url.includes('amplitude') || url.includes('google'))) return true;
    return _origBeacon ? _origBeacon.apply(navigator, arguments) : true;
  };

  // XHR MONKEY-PATCH
  var _origOpen = XMLHttpRequest.prototype.open;
  var _origSetHeader = XMLHttpRequest.prototype.setRequestHeader;
  var _origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (typeof url === 'string') {
      url = url.replace(/https?:\\/\\/auth\\.zerody\\.one\\//g, '/api/v1/');
      url = url.replace(/https?:\\/\\/myinstantsapi\\.zerody\\.one\\//g, '/myinstants-proxy/');
      url = url.replace(/https?:\\/\\/tikfinity-cws-[^/]*\\.zerody\\.one\\//g, '/');
    }
    this._tfUrl = url;
    return _origOpen.apply(this, [method, url].concat(Array.prototype.slice.call(arguments, 2)));
  };
  XMLHttpRequest.prototype.send = function() {
    var url = this._tfUrl || '';
    if (url.includes('/api/') || url.includes('/hub/')) {
      try {
        var token = localStorage.getItem('setting_loginaccesstoken') || '';
        if (token) this.setRequestHeader('Authorization', 'Bearer ' + token);
      } catch(e) {}
    }
    return _origSend.apply(this, arguments);
  };

  // FETCH MONKEY-PATCH
  var _origFetch = window.fetch;
  window.fetch = function(url, opts) {
    if (typeof url === 'string') {
      url = url.replace(/https?:\\/\\/auth\\.zerody\\.one\\//g, '/api/v1/');
      url = url.replace(/https?:\\/\\/myinstantsapi\\.zerody\\.one\\//g, '/myinstants-proxy/');
      if (url.includes('/api/') || url.includes('/hub/')) {
        opts = opts || {};
        opts.headers = opts.headers || {};
        try {
          var token = localStorage.getItem('setting_loginaccesstoken') || '';
          if (token && !opts.headers.Authorization) opts.headers.Authorization = 'Bearer ' + token;
        } catch(e) {}
      }
    }
    return _origFetch.apply(this, arguments);
  };

  // createNavigation — the frontend expects this global function
  window.createNavigation = function(props) {
    if (typeof Vue === 'undefined' || !Vue.createApp) return;
    if (typeof VueNavigation !== 'undefined' && VueNavigation.default) {
      var app = Vue.createApp(VueNavigation.default, props || {});
      if (typeof VueNavigation.setup === 'function') {
        try { VueNavigation.setup(app); } catch(e) {}
      }
      return app;
    }
  };
})();
</script>`;

  // --- Auth bridge script ---
  const authScript = `
<script>
(function(){
  var defaultChannelId = "${defaultChannelId}";
  var defaultChannelName = "${defaultChannelName}";
  var authCookieMap = {
    setting_loginaccesstoken: 'tf_login_token',
    setting_channelid: 'tf_channelid',
    setting_channelname: 'tf_channelname',
    setting_ispro: 'tf_ispro',
    setting_locale: 'tf_locale',
    setting_tiktokname: 'tf_tiktokname',
    setting_email: 'tf_email',
    setting_channelsignature: 'tf_channelsignature',
    setting_owneruserid: 'tf_owneruserid',
    setting_featurebasetoken: 'tf_featurebasetoken',
    setting_pendinglogin: 'tf_pendinglogin'
  };

  function readCookie(name) {
    try { var m = document.cookie.match(new RegExp('(?:^|;\\\\s*)' + name.replace(/[.*+?^\${}()|[\\]\\\\]/g,'\\\\$&') + '=([^;]*)')); return m ? decodeURIComponent(m[1]) : ''; } catch(e) { return ''; }
  }
  function writeCookie(name, value) {
    try { document.cookie = name + '=' + encodeURIComponent(value||'') + '; path=/; max-age=2592000; SameSite=Lax'; } catch(e) {}
  }
  function readStorage(key, fb) {
    try { var v = localStorage.getItem(key); if (v !== null && v !== '') return v; } catch(e) {}
    var cn = authCookieMap[key]; if (cn) { var cv = readCookie(cn); if (cv) return cv; }
    return fb;
  }
  function persistValue(key, value) {
    try { if (value != null) localStorage.setItem(key, String(value)); } catch(e) {}
    var cn = authCookieMap[key]; if (cn && value != null) writeCookie(cn, value);
  }
  window.__tfReadPersistedValue = readStorage;
  window.__tfPersistValue = persistValue;
  window.__tfReadAccessToken = function() { return readStorage('setting_loginaccesstoken', ''); };
  window.__tfGetAuthHeaders = function(extra) {
    var h = Object.assign({}, extra || {});
    var t = readStorage('setting_loginaccesstoken', '');
    if (t) h.Authorization = 'Bearer ' + t;
    return h;
  };
  window.__tfClearPersistedAuth = function() {
    ['setting_loginaccesstoken','setting_channelid','setting_channelname','setting_ispro','setting_locale','setting_tiktokname','setting_email'].forEach(function(k) {
      try { localStorage.removeItem(k); } catch(e) {}
      if (authCookieMap[k]) { try { document.cookie = authCookieMap[k] + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; } catch(e) {} }
    });
  };

  function applySessionPayload(payload) {
    if (!payload) return;
    var ch = payload.channel || {};
    var channelId = payload.channelId || ch.channelId || ch.ChannelId || 0;
    var channelName = payload.channelName || ch.channelName || ch.ChannelName || '';
    var isPro = payload.isPro !== false;
    persistValue('setting_channelid', String(channelId));
    persistValue('setting_channelname', channelName);
    persistValue('setting_ispro', isPro ? 'true' : 'false');
    window.session = window.session || {};
    window.session.channelId = channelId;
    window.session.channelName = channelName;
    window.session.me = Object.assign({ challengeRunning: false }, ch, { channelId: channelId, channelName: channelName, isPro: isPro });
    window.session.channel = window.session.me;
    window.session.userFeatures = payload.userFeatures || { isPro: isPro, proInfo: { plan: 'pro', active: true } };
    window.session.subscription = payload.subscription || { isPro: isPro, plan: 'pro', active: true };
    window.session.cookieAuth = true;
    window.session.wsAuthToken = payload.wsAuthToken || '';
    window.tfPageloadData = window.tfPageloadData || {};
    window.tfPageloadData.me = Object.assign({}, payload);
  }

  function hydrateFromApi() {
    var token = readStorage('setting_loginaccesstoken', '');
    if (!token || token.length < 10) return;
    window.fetch('/api/me', { method: 'GET', credentials: 'same-origin', headers: window.__tfGetAuthHeaders() })
      .then(function(r) { if (!r.ok) throw new Error('me_failed'); return r.json(); })
      .then(function(data) { applySessionPayload(data); })
      .catch(function(e) { console.warn('[TF-Auth] hydrate error:', e.message); });
  }

  // Auto-populate defaults
  try {
    var hasToken = readStorage('setting_loginaccesstoken', '');
    if (hasToken && hasToken.length > 10 && !readStorage('setting_channelid', '')) {
      persistValue('setting_channelid', defaultChannelId);
      persistValue('setting_channelname', defaultChannelName);
      persistValue('setting_ispro', 'true');
    }
  } catch(e) {}

  // Boot
  applySessionPayload({ channelId: parseInt(readStorage('setting_channelid', '0')), channelName: readStorage('setting_channelname', ''), isPro: true });
  hydrateFromApi();

  // Toggle tf-logged-out based on auth state
  function checkAuth() {
    var token = readStorage('setting_loginaccesstoken', '');
    if (token && token.length >= 10) {
      document.body.classList.remove('tf-logged-out');
    } else {
      document.body.classList.add('tf-logged-out');
    }
  }
  setTimeout(checkAuth, 1000);
  setTimeout(checkAuth, 3000);
})();
</script>`;

  // Inject into <head> (before other scripts)
  const headInjection = earlyCss + blockScript + authScript;

  if (html.includes('</head>')) {
    // Inject before first <script> in <head>, or before </head>
    const headEnd = html.indexOf('</head>');
    html = html.slice(0, headEnd) + headInjection + html.slice(headEnd);
  } else {
    html = headInjection + html;
  }

  // --- Just load tf-connect.js, no custom UI ---
  const loginPopup = `<script src="/js/tf-connect.js"></script>`;

  // Add tf-logged-out class to body and inject login popup
  html = html.replace(/<body([^>]*)>/, '<body$1 class="tf-logged-out">' + loginPopup);

  console.log(`[BuildIndexHtml] Patched index.html (${html.length} bytes)`);
  return html;
}

module.exports = { buildIndexHtml };
