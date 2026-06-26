// TikTok LIVE connection — single flow: Button → API → Bridge → TikTok
// UI updates: status bar (our own) + channelStatus Socket.IO event (Vue nav handles itself)
(function() {
  'use strict';

  var _pollTimer = null;
  var _connected = false;
  var _connecting = false;
  var _currentUsername = '';
  var _connectedUsername = '';
  // While a USER-initiated connect/disconnect is settling, the continuous
  // backend monitor must NOT reconcile (it would stomp the in-flight action
  // back to a stale backend value). Timestamp window, cleared by time.
  var _uiBusyUntil = 0;
  // A user click (topbar CTA or native setup button) opens this short window;
  // the browserbridge.connect hook reads it so a connect routed through the
  // bundle's opaque tryConnect still counts as userClick → the failure popup
  // fires. Auto / bootstrap connects (no recent click) stay userClick:false →
  // silent (no popup), preserving the no-mis-fire guarantee.
  var _userConnectIntentUntil = 0;
  var USER_CONNECT_INTENT_MS = 4000;

  // ── Helpers ──

  function normalize(v) { return String(v || '').trim().replace(/^@+/, ''); }

  function getTikTokUsername(btn) {
    // 1. From input near button
    if (btn) {
      var el = btn;
      for (var i = 0; i < 6 && el; i++) {
        el = el.parentElement;
        if (!el) break;
        var input = el.querySelector('input[type="text"], input:not([type="hidden"]):not([type="password"]):not([type="checkbox"]):not([type="radio"])');
        if (input && normalize(input.value)) return normalize(input.value);
      }
    }
    // 2. From known selectors
    var selectors = ['#textboxChannelName input', 'input[placeholder*="TikTok"]', 'input[placeholder*="tiktok"]', 'input[placeholder*="username"]'];
    for (var j = 0; j < selectors.length; j++) {
      var inp = document.querySelector(selectors[j]);
      if (inp && normalize(inp.value)) return normalize(inp.value);
    }
    // 3. From localStorage
    return normalize(localStorage.getItem('setting_tiktokname') || '');
  }

  // ── Status bar (our own UI — fixed top bar) ──

  // Banner thông báo trên đầu trang đã được tắt — Tikfinity gốc không có,
  // status hiển thị ở avatar dropdown (do bundle's Vue store quản lý) là đủ.
  // Giữ stub để chỗ khác trong file gọi không bị undefined error.
  function showStatusBar(_text, _color, _autoHideMs) {
    var bar = document.getElementById('tfStatusBar');
    if (bar) bar.style.display = 'none';
  }

  function hideStatusBar() {
    var bar = document.getElementById('tfStatusBar');
    if (bar) bar.style.display = 'none';
  }

  // ── Button sync ──

  function isConnectButton(el) {
    if (!el) return false;
    if (el.dataset && el.dataset.tfConnectButton === '1') return true;
    var tag = el.tagName;
    if (tag !== 'BUTTON' && el.getAttribute('role') !== 'button' && !el.classList.contains('dx-button')) return false;

    // Skip navigation / sidebar / menu items so we don't overwrite their labels.
    // Sidebar links also have role="button" but are not connect buttons.
    // 2026-05-22: REMOVED `nav, aside, [class*="nav-"]` from exclusion.
    // Bundle's topbar CTA "Kết nối với TikTok LIVE" lives inside
    // `#navigation-app` (Vue topbar) — `closest('nav')` matched it →
    // handler bailed → connect flow never fired. Text match (strict
    // 6 labels in isConnectButton) is sufficient on its own.
    if (el.closest('.sidebar, .menu, .dropdown, .submenu, [class*="menu-"], .topbar-search, .breadcrumb')) {
      return false;
    }

    // Be strict on text: require an exact match of one of the known CTA labels.
    // The bundle uses "Connect to TikTok LIVE" / "Kết nối với TikTok LIVE" /
    // "Disconnect" / our own state-managed "Connecting..." labels.
    var text = (el.textContent || '').trim().toLowerCase();
    if (text.length > 60) return false;  // sidebar items often have longer combined labels
    return text === 'connect to tiktok live'
      || text === 'kết nối với tiktok live'
      || text === 'kết nối tiktok live'
      || text === 'disconnect'
      || text === 'ngắt kết nối'
      || text.indexOf('connecting') === 0
      || text.indexOf('đang kết nối') === 0;
  }

  function findConnectButton(target) {
    var el = target;
    for (var i = 0; i < 6 && el; i++) {
      if (isConnectButton(el)) return el;
      el = el.parentElement;
    }
    return null;
  }

  function setButtonText(btn, label) {
    if (!btn) return;
    // Find the text-bearing child or use button itself
    var spans = btn.querySelectorAll('span, div, small, strong');
    for (var i = 0; i < spans.length; i++) {
      var s = spans[i];
      if (s.children.length) continue;
      var t = (s.textContent || '').trim().toLowerCase();
      if (t.indexOf('tiktok') >= 0 || t === 'disconnect' || t.indexOf('connecting') === 0) {
        if (!s.dataset.tfOrigLabel && t.indexOf('tiktok') >= 0) s.dataset.tfOrigLabel = s.textContent.trim();
        s.textContent = label;
        return;
      }
    }
    // Fallback: set on button itself
    if (!btn.children.length) {
      if (!btn.dataset.tfOrigLabel) btn.dataset.tfOrigLabel = btn.textContent.trim();
      btn.textContent = label;
    }
  }

  function syncButtons() {
    var buttons = document.querySelectorAll('button, [role="button"], .dx-button');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      if (!isConnectButton(btn)) continue;
      btn.dataset.tfConnectButton = '1';
      if (_connected) setButtonText(btn, 'Disconnect');
      else if (_connecting) setButtonText(btn, 'Connecting...');
      else {
        // Idle — restore the original "Connect to TikTok LIVE" label so the
        // button doesn't stay stuck on "Connecting..." after a reset.
        var origSpans = btn.querySelectorAll('span, div, small, strong');
        var restored = false;
        for (var j = 0; j < origSpans.length; j++) {
          var sp = origSpans[j];
          if (sp.dataset && sp.dataset.tfOrigLabel) {
            sp.textContent = sp.dataset.tfOrigLabel;
            restored = true;
          }
        }
        if (!restored && btn.dataset.tfOrigLabel) {
          btn.textContent = btn.dataset.tfOrigLabel;
        }
        // Make sure the button isn't aria-disabled.
        try { btn.disabled = false; btn.removeAttribute('aria-disabled'); } catch(e) {}
      }
    }
  }

  // ── Core: updateUI (single function for all UI state) ──

  function updateUI(username, state, errorMsg) {
    var user = normalize(username || _currentUsername);
    if (user) {
      _currentUsername = user;
      localStorage.setItem('setting_tiktokname', user);
      try { if (window.session) window.session.tiktokUsername = user; } catch(e) {}
    }

    _connected = (state === 'connected');
    _connecting = (state === 'connecting');
    if (_connected) {
      _connectedUsername = user;
    } else {
      _connectedUsername = '';
    }

    // Status bar
    if (state === 'connecting') {
      showStatusBar('Connecting to @' + (user || '?') + '...', '#f59e0b', 0);
    } else if (state === 'connected') {
      showStatusBar('Connected to @' + (user || '?') + ' — LIVE', '#10b981', 5000);
    } else if (state === 'failed') {
      showStatusBar(errorMsg || 'Connection failed', '#ef4444', 8000);
    } else {
      hideStatusBar();
    }

    // Pinia navigationStore — controls Vue nav corner (LIVE, isConnecting, channelName)
    var store = window.navigationStore;
    if (store && store.set) {
      if (state === 'connected') {
        store.set('isLive', true);
        store.set('isConnecting', false);
        if (user) store.set('channelName', user);
      } else if (state === 'connecting') {
        store.set('isConnecting', true);
        store.set('isLive', false);
      } else {
        store.set('isLive', false);
        store.set('isConnecting', false);
      }
    }

    // Button labels
    syncButtons();
  }

  // ── API calls ──

  function stopPolling() {
    if (_pollTimer) { clearInterval(_pollTimer); _pollTimer = null; }
  }

  function startPolling(username) {
    var attempts = 0;
    var user = normalize(username);
    stopPolling();

    _pollTimer = setInterval(function() {
      attempts++;
      fetch('/api/tiktok/status').then(function(r) { return r.json(); }).then(function(d) {
        if (d.connected) {
          stopPolling();
          console.log('[TF] ✓ Connected to @' + (d.username || user) + ' — LIVE!');
          updateUI(d.username || user, 'connected');
        } else if (d.lastError && !d.connecting) {
          stopPolling();
          var msg = d.lastError;
          console.log('[TF] ✗ Failed @' + (d.username || user) + ': ' + msg);
          updateUI(d.username || user, 'failed', msg);
        } else if (!d.connecting && !d.connected) {
          // Backend dropped to idle (user/another tab disconnected, or bridge reset).
          // Don't keep saying "Connecting..." forever — release the button.
          stopPolling();
          console.log('[TF] ⊘ Backend idle, stopping poll');
          updateUI(d.username || user, 'disconnected');
        } else if (attempts >= 30) {
          stopPolling();
          console.log('[TF] ✗ Timeout @' + user);
          updateUI(user, 'failed', 'Connection timeout — check that @' + user + ' is live');
        }
        // else: still connecting, keep polling
      }).catch(function() {
        if (attempts >= 30) {
          stopPolling();
          updateUI(user, 'failed', 'Network error');
        }
      });
    }, 1000);
  }

  function doConnect(username, userClick) {
    var user = normalize(username);
    if (!user) {
      updateUI('', 'failed', 'Please enter a TikTok username');
      return Promise.resolve(false);
    }

    console.log('[TF] Connecting to @' + user + '... userClick=' + !!userClick);
    updateUI(user, 'connecting');
    _uiBusyUntil = Date.now() + 3000; // hold the monitor off until startPolling owns it

    return fetch('/api/tiktok/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, userClick: !!userClick })
    }).then(function(r) { return r.json(); }).then(function(data) {
      console.log('[TF] API:', data.status, data.message || '');
      if (data.status === 'ok') {
        startPolling(data.username || user);
        return true;
      }
      updateUI(user, 'failed', data.message || 'API error');
      return false;
    }).catch(function(err) {
      console.log('[TF] Network error:', err);
      updateUI(user, 'failed', 'Network error');
      return false;
    });
  }

  function doDisconnect() {
    console.log('[TF] Disconnecting from @' + _currentUsername);
    stopPolling();
    // Hold the monitor off so it can't snap the button back to "Disconnect"
    // before the backend has processed the async disconnect POST.
    _uiBusyUntil = Date.now() + 5000;
    updateUI(_currentUsername, 'disconnected');
    return fetch('/api/tiktok/disconnect', { method: 'POST' }).catch(function() {});
  }

  // ── Public API ──

  window.__tfDoConnect = function(username) { return doConnect(normalize(username || getTikTokUsername())); };
  window.__tfDoDisconnect = function() { return doDisconnect(); };

  // ── Hook browserbridge (prevent bundle's popup, redirect to our API) ──

  function hookBridge(bridge) {
    if (!bridge || bridge.__tfHooked) return;

    bridge.connect = function(channelInfo) {
      var user = '';
      if (channelInfo) {
        user = channelInfo.username || channelInfo.uniqueId || channelInfo.channelName || channelInfo.tiktokUsername || '';
      }
      // Propagate user-intent: a connect routed here within the click window is
      // a real user click → userClick:true so a failure surfaces the popup.
      return doConnect(normalize(user) || getTikTokUsername(), Date.now() < _userConnectIntentUntil);
    };
    bridge.disconnect = function() { return doDisconnect(); };
    bridge.reconnect = bridge.connect;
    bridge.closeWindow = function() { bridge.waitingForInitialData = false; };
    if (typeof bridge.connected === 'undefined') bridge.connected = false;
    if (typeof bridge.waitingForInitialData === 'undefined') bridge.waitingForInitialData = false;
    bridge.__tfHooked = true;
    console.log('[TF] browserbridge hooked');
  }

  // ── Click handler (capture phase — intercepts before Vue) ──

  document.addEventListener('click', function(e) {
    var btn = findConnectButton(e.target);
    if (!btn) return;

    // Small delay: let the bridge hook fire first if bundle calls browserbridge.connect
    setTimeout(function() {
      _userConnectIntentUntil = Date.now() + USER_CONNECT_INTENT_MS; // user clicked a connect button
      var username = getTikTokUsername(btn);

      if (_connected) {
        var sameUser = normalize(username) === normalize(_currentUsername);
        doDisconnect();
        if (!sameUser && username) {
          setTimeout(function() { doConnect(username, true); }, 500);
        }
        return;
      }

      if (_connecting) return; // Already connecting, ignore

      if (!username) {
        updateUI('', 'failed', 'Please enter a TikTok username');
        return;
      }

      doConnect(username, true);  // userClick: true → fire popup on failure
    }, 100);
  }, true);

  // ── Input listener — keep _currentUsername in sync + auto-reconnect ──
  // Gốc behavior: đổi username trong setup field → bundle auto disconnect old
  // + connect new. Debounce 800ms.

  var _autoReconnectTimer = null;
  function isUsernameInput(el) {
    if (!el || el.tagName !== 'INPUT' || el.type === 'hidden') return false;
    if (el.dataset && el.dataset.tfTikTokInput === '1') return true;
    var val = (el.value || '').trim();
    var aria = (el.getAttribute('aria-label') || '').toLowerCase();
    var ph = (el.getAttribute('placeholder') || '').toLowerCase();
    if (/tiktok|@user|kênh|channel|tên/.test(aria + ' ' + ph)) {
      el.dataset.tfTikTokInput = '1'; return true;
    }
    var node = el, combinedText = '';
    for (var i = 0; i < 8 && node && node !== document.body; i++) {
      var sibs = node.parentElement ? Array.from(node.parentElement.children) : [];
      for (var j = 0; j < sibs.length && j < 5; j++) {
        if (sibs[j] === node) continue;
        combinedText += ' ' + (sibs[j].textContent || '').toLowerCase().slice(0, 60);
      }
      node = node.parentElement;
    }
    if (/tiktok|kênh|channel|tên\s+(tiktok|của bạn|kênh)/.test(combinedText)) {
      el.dataset.tfTikTokInput = '1'; return true;
    }
    if (val.startsWith('@')) {
      el.dataset.tfTikTokInput = '1'; return true;
    }
    el.dataset.tfTikTokInput = '0';
    return false;
  }

  // ── Change listener — save username and auto-reconnect when changes while connected ──
  document.addEventListener('change', function(e) {
    if (!e.target || e.target.tagName !== 'INPUT' || e.target.type === 'hidden') return;
    if (isUsernameInput(e.target)) {
      var val = normalize(e.target.value);
      if (val && val.length >= 2) {
        var oldUsername = _connectedUsername || _currentUsername;
        _currentUsername = val;
        localStorage.setItem('setting_tiktokname', val);
        try { if (window.session) window.session.tiktokUsername = val; } catch(ex) {}

        // Auto-reconnect only if we were already connected and username actually changed
        if (_connected && val !== normalize(oldUsername)) {
          console.log('[TF] Auto-reconnect detected username change → @' + val);
          doDisconnect();
          setTimeout(function() { doConnect(val, false); }, 500);
        }
      }
    }
  }, true);

  // ── Native inline button trigger (Gate 28 — bundle's setup.onChannelContext
  // Changed is shadowed by Vue, so dxButton init at line 1805 never fires.
  // Call dxButton directly using bundle's native plugin + handler. ──

  function triggerNativeSetupButton() {
    var btn = document.getElementById('manualConnectButtonSetup');
    if (!btn) return false;
    if (btn.classList.contains('dx-button')) return false;
    if (typeof window.$ !== 'function' || typeof window.$.fn.dxButton !== 'function') return false;
    if (!window.session || !window.session.me || !window.session.me.channel) return false;
    try {
      window.$('#manualConnectButtonSetup').dxButton({
        text: (window.localization && window.localization.getString)
          ? window.localization.getString('start_connect_button')
          : 'Connect to TikTok LIVE',
        disabled: !window.session.me.channel.channelName,
        onClick: function() {
          if (window.isTosViolation) {
            return window.showTosViolationWarning && window.showTosViolationWarning();
          }
          _userConnectIntentUntil = Date.now() + USER_CONNECT_INTENT_MS; // user-initiated → failure popup allowed
          if (window.broadcastlistener && window.broadcastlistener.tryConnect) {
            window.broadcastlistener.tryConnect(true, true, true);
          } else {
            var u = (window.session.me.channel.channelName || '').replace(/^@+/, '');
            fetch('/api/tiktok/connect', {
              method:'POST', headers:{'Content-Type':'application/json'},
              body: JSON.stringify({ username: u, userClick: true })  // userClick → failure popup fires
            }).catch(function(){});
          }
          try {
            var inst = window.$('#manualConnectButtonSetup').dxButton('instance');
            inst.option('disabled', true);
            setTimeout(function(){
              try { inst.option('disabled', false); } catch(_){}
            }, 2000);
          } catch(_){}
        }
      }).css('margin-top', '15px');
      console.log('[TF] Native inline button initialized via direct dxButton call');
      return true;
    } catch (e) {
      return false;
    }
  }
  setTimeout(triggerNativeSetupButton, 1500);
  setTimeout(triggerNativeSetupButton, 4000);
  setInterval(triggerNativeSetupButton, 5000);

  // ── Trigger AI voices loader chain ──
  // Bundle's `tts.onChannelContextChanged` (line 6028 decompiled) fires
  // `tts.loadAiVoiceState()` which: ensureAiAuthToken → loadUserCredits +
  // loadAiVoices. In our clone, Vue layer doesn't fire onChannelContextChanged
  // when /api/me parses, so the chain never starts → aiVoices stays [].
  // Manually kick it once session.me + appConfig.ttsHost both ready.
  var _aiVoicesTriggered = false;
  function triggerAiVoicesLoad() {
    if (_aiVoicesTriggered) return;
    if (!window.tts || typeof window.tts.loadAiVoiceState !== 'function') return;
    if (!window.appConfig || !window.appConfig.ttsHost) return;
    if (!window.session || !window.session.me || !window.session.me.channel) return;
    if (window.tts.aiVoices && window.tts.aiVoices.length > 0) {
      _aiVoicesTriggered = true; return;
    }
    _aiVoicesTriggered = true;
    try {
      window.tts.loadAiVoiceState().then(function() {
        var count = (window.tts.aiVoices && window.tts.aiVoices.length) || 0;
        console.log('[TF] AI voices loaded: ' + count);
      }).catch(function(e) {
        console.warn('[TF] loadAiVoiceState failed:', e.message);
        _aiVoicesTriggered = false;  // allow retry
      });
    } catch (e) {
      _aiVoicesTriggered = false;
    }
  }
  setTimeout(triggerAiVoicesLoad, 2500);
  setTimeout(triggerAiVoicesLoad, 5000);
  setInterval(triggerAiVoicesLoad, 8000);

  // ── Periodic: hook browserbridge + sync buttons + sync Pinia store ──

  var _lastSyncState = '';
  setInterval(function() {
    if (window.browserbridge && !window.browserbridge.__tfHooked) hookBridge(window.browserbridge);
    syncButtons();

    // Keep Pinia store in sync (handles late navigationStore init)
    var store = window.navigationStore;
    if (store && store.set) {
      var want = _connected ? 'connected' : (_connecting ? 'connecting' : 'idle');
      if (want !== _lastSyncState) {
        _lastSyncState = want;
        if (_connected) {
          store.set('isLive', true);
          store.set('isConnecting', false);
          if (_currentUsername) store.set('channelName', _currentUsername);
        } else if (_connecting) {
          store.set('isLive', false);
          store.set('isConnecting', true);
        } else {
          store.set('isLive', false);
          store.set('isConnecting', false);
        }
      }
    }
  }, 2000);

  // ── On load: check backend status (retry until navigationStore ready) ──

  function checkBackendStatus(retries) {
    fetch('/api/tiktok/status').then(function(r) { return r.json(); }).then(function(d) {
      if (d.connected) {
        updateUI(d.username, 'connected');
      } else if (d.connecting) {
        updateUI(d.username, 'connecting');
        startPolling(d.username);
      } else {
        // Explicit idle — required so the button doesn't stay stuck on
        // "Connecting..." after a previous failed attempt or reload.
        updateUI(d.username, 'disconnected');
      }
      // If store wasn't ready, retry once more after delay
      if (!window.navigationStore && retries > 0) {
        setTimeout(function() { checkBackendStatus(retries - 1); }, 2000);
      }
    }).catch(function() {});
  }
  setTimeout(function() { checkBackendStatus(3); }, 1500);

  // ── Continuous backend-status monitor (fixes LIVE/Disconnected desync) ──
  // checkBackendStatus above runs ONCE on load; startPolling stops the moment
  // a connect settles. So after a mid-stream backend WS drop (connected→false),
  // the frontend used to stay STALE — button kept "Disconnect", Pinia nav corner
  // kept "LIVE" — while the under-avatar status pill (which polls every 1s)
  // correctly showed "Disconnected". This loop keeps _connected/_connecting (and
  // therefore the button + nav corner + central LIVE pill, all driven by them)
  // BÁM the backend's real /api/tiktok/status, so all indicators stay in sync.
  // Only acts when a fresh value DIFFERS from the current UI state → no flicker,
  // no re-showing the connect status bar. Yields to an in-flight connect poll.
  function monitorBackendStatus() {
    if (_pollTimer || Date.now() < _uiBusyUntil) return; // connect/disconnect owns the UI
    fetch('/api/tiktok/status', { cache: 'no-store' })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (_pollTimer || Date.now() < _uiBusyUntil) return; // re-check after async (race guard)
        var beConnected = !!(d && d.connected);
        var beConnecting = !!(d && d.connecting);
        var user = (d && d.username) || _currentUsername;
        if (beConnected && !_connected) {
          updateUI(user, 'connected');      // backend (re)connected → sync to LIVE
        } else if (!beConnected && _connected) {
          updateUI(user, beConnecting ? 'connecting' : 'disconnected'); // drop → stop lying
        } else if (!beConnected && !_connected && beConnecting && !_connecting) {
          updateUI(user, 'connecting');     // backend started (re)connecting
        } else if (!beConnected && !beConnecting && _connecting) {
          updateUI(user, 'disconnected');   // backend gave up connecting
        }
      })
      .catch(function() {});
  }
  setInterval(monitorBackendStatus, 3000);

  // ── Topbar chip avatar — pull the connected TikTok account's avatar from
  // /api/tiktok/account and paint it into the topright chip. Tikfinity's
  // own OAuth flow normally populates this via a separate "Connect TikTok
  // Account" path; we don't have that, but we DO have the live-room owner's
  // avatar from the bridge, which is good enough for the chip.

  // The bundle's topbar chip renders a default Material "AccountCircle"
  // <svg> when no avatar is set, NOT an <img>. We can't easily swap the
  // SVG without breaking event handlers, so we OVERLAY a positioned <img>
  // (id=tf-chip-avatar) inside the same wrapper. The img sits on top of
  // the SVG and covers it. Re-runs idempotently — the next poll only
  // updates `src` if the avatar URL changes.
  var _lastAvatarUrl = '';

  function findChipContainer(nickname) {
    // The chip text "LIVE" + "<nickname>" is unique to the topright corner.
    // Walk DOM for an element whose direct text contains the nickname AND
    // whose siblings/parent has a small "LIVE" badge or button-ish ancestor.
    try {
      var all = document.querySelectorAll('button, div, span, a');
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        var rect = el.getBoundingClientRect();
        if (rect.top > 100) continue;
        if (rect.right < window.innerWidth - 400) continue;
        var txt = (el.textContent || '');
        if (txt.indexOf(nickname) < 0) continue;
        if (txt.length > 80) continue;  // skip huge wrappers
        // Walk up until we hit a button or a flex container that holds
        // both the avatar and the text.
        var cur = el;
        for (var k = 0; k < 6 && cur; k++) {
          var w = cur.getBoundingClientRect().width;
          if (w >= 80 && w <= 320) return cur;  // chip-ish width
          cur = cur.parentElement;
        }
      }
    } catch (_) {}
    return null;
  }

  function paintTopbarAvatar(avatarUrl, nickname) {
    if (!avatarUrl) return;
    var prev = document.getElementById('tf-chip-avatar');
    if (prev && prev.src === avatarUrl) { _lastAvatarUrl = avatarUrl; return; }

    var done = false;

    // Strategy A: existing <img> swap (covers OAuth-populated chips).
    try {
      var imgs = document.querySelectorAll('header img, [class*="topbar"] img, [class*="TopBar"] img, [class*="navbar"] img, nav img');
      for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        var r1 = img.getBoundingClientRect();
        if (r1.top > 80) continue;
        if (r1.right < window.innerWidth - 350) continue;
        if (r1.width > 60 || r1.height > 60) continue;
        img.src = avatarUrl;
        if (nickname) img.alt = nickname;
        done = true;
      }
    } catch (_) {}

    // Strategy B: <svg> overlay. Find the chip container via nickname text,
    // locate the first <svg> inside it (the AccountCircle icon), wrap with
    // a position:relative parent if needed, drop an absolutely-positioned
    // <img id=tf-chip-avatar> at the same size on top.
    try {
      if (!done && nickname) {
        var container = findChipContainer(nickname);
        if (container) {
          var svg = container.querySelector('svg');
          if (svg) {
            var svgRect = svg.getBoundingClientRect();
            var size = Math.min(svgRect.width, svgRect.height) || 32;
            // Make sure SVG parent can host an absolutely-positioned overlay.
            var host = svg.parentElement;
            var hostCs = window.getComputedStyle(host);
            if (hostCs.position === 'static') host.style.position = 'relative';
            var overlay = prev;
            if (!overlay) {
              overlay = document.createElement('img');
              overlay.id = 'tf-chip-avatar';
              overlay.style.position = 'absolute';
              overlay.style.borderRadius = '50%';
              overlay.style.pointerEvents = 'none';
              overlay.style.objectFit = 'cover';
              overlay.style.zIndex = '1';
              host.appendChild(overlay);
            } else if (overlay.parentElement !== host) {
              host.appendChild(overlay);
            }
            // Re-measure each paint — SVG position may shift after layout.
            var hostRect = host.getBoundingClientRect();
            overlay.style.left = (svgRect.left - hostRect.left) + 'px';
            overlay.style.top  = (svgRect.top  - hostRect.top)  + 'px';
            overlay.style.width = size + 'px';
            overlay.style.height = size + 'px';
            overlay.src = avatarUrl;
            if (nickname) overlay.alt = nickname;
            done = true;
          }
        }
      }
    } catch (_) {}

    // Strategy C: background-image fallback.
    try {
      if (!done && nickname) {
        var nodes = document.querySelectorAll('header *, nav *, [class*="topbar"] *');
        for (var j = 0; j < nodes.length; j++) {
          var el = nodes[j];
          if (el.children.length) continue;
          var txt2 = (el.textContent || '').trim();
          if (txt2 !== nickname && txt2 !== '@' + nickname) continue;
          var anc = el.parentElement;
          for (var k2 = 0; k2 < 5 && anc; k2++) {
            var bg = anc.querySelector('[style*="background-image"], [class*="avatar"], [class*="Avatar"]');
            if (bg) {
              bg.style.backgroundImage = 'url("' + avatarUrl + '")';
              bg.style.backgroundSize = 'cover';
              bg.style.backgroundPosition = 'center';
              done = true;
            }
            anc = anc.parentElement;
          }
        }
      }
    } catch (_) {}

    if (done) {
      _lastAvatarUrl = avatarUrl;
      console.log('[TF] topbar chip avatar updated → ' + avatarUrl.slice(0, 80));
    }
  }

  // Re-measure + re-position the overlay <img> WITHOUT re-fetching the
  // account from backend. Used on window resize / Vue re-render so the
  // overlay stays glued to the SVG even after layout reflow.
  function reflowTopbarAvatar() {
    if (!_lastAvatarUrl) return;
    var overlay = document.getElementById('tf-chip-avatar');
    if (!overlay) return;
    // Forget `_lastAvatarUrl` skip-check by temporarily clearing the
    // src-equality guard inside paintTopbarAvatar — re-measure fresh.
    var prevUrl = _lastAvatarUrl;
    _lastAvatarUrl = '';
    paintTopbarAvatar(prevUrl, overlay.alt);
  }

  function syncTopbarAvatar() {
    fetch('/api/tiktok/account').then(function(r) { return r.json(); }).then(function(d) {
      var acc = (d && d.account) || {};
      if (acc.avatarUrl) paintTopbarAvatar(acc.avatarUrl, acc.nickname || acc.username);
    }).catch(function() {});
  }
  // Poll periodically — roomInfo arrives a few seconds after `connected`,
  // and Vue may re-render the chip later than that. Re-running every 5s
  // ensures the avatar lands even if the DOM wasn't ready on first paint.
  setInterval(syncTopbarAvatar, 5000);
  setTimeout(syncTopbarAvatar, 2500);

  // Window resize → SVG position may have shifted (responsive topbar,
  // sidebar collapse, etc.). Re-measure the overlay so it stays anchored
  // to the icon. Debounced 150ms to avoid 60Hz reflows during drag-resize.
  var _resizeT = null;
  window.addEventListener('resize', function() {
    if (_resizeT) clearTimeout(_resizeT);
    _resizeT = setTimeout(reflowTopbarAvatar, 150);
  }, { passive: true });

  // Profile switch reload chain may move the chip's SVG slightly between
  // intermediate states. Observer fires on any topbar mutation so the
  // overlay tracks the new SVG position. Throttled via requestAnimationFrame.
  try {
    var _rafScheduled = false;
    var topbarMo = new MutationObserver(function() {
      if (_rafScheduled) return;
      _rafScheduled = true;
      requestAnimationFrame(function() {
        _rafScheduled = false;
        reflowTopbarAvatar();
      });
    });
    // Defer observer attach until the topbar exists.
    var attachObs = function() {
      var topbar = document.querySelector('header, nav, [class*="topbar"], [class*="TopBar"]');
      if (topbar) topbarMo.observe(topbar, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
      else setTimeout(attachObs, 1000);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachObs, { once: true });
    } else {
      attachObs();
    }
  } catch (_) {}

  console.log('[TF] TikTok connect module loaded');
})();
