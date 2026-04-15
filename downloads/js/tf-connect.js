// TikTok LIVE connection — single flow: Button → API → Bridge → TikTok
// UI updates: status bar (our own) + channelStatus Socket.IO event (Vue nav handles itself)
(function() {
  'use strict';

  var _pollTimer = null;
  var _connected = false;
  var _connecting = false;
  var _currentUsername = '';

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

  function showStatusBar(text, color, autoHideMs) {
    var bar = document.getElementById('tfStatusBar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'tfStatusBar';
      bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;' +
        'padding:8px 20px;font-size:14px;font-weight:600;font-family:Outfit,sans-serif;' +
        'display:none;align-items:center;justify-content:center;gap:8px;color:#fff;' +
        'transition:all 0.3s;pointer-events:none;text-align:center;';
      document.body.appendChild(bar);
    }
    bar.textContent = text;
    bar.style.background = color;
    bar.style.display = 'flex';
    if (autoHideMs > 0) {
      setTimeout(function() { bar.style.display = 'none'; }, autoHideMs);
    }
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
    var text = (el.textContent || '').trim().toLowerCase();
    return (text.indexOf('tiktok') >= 0 && (text.indexOf('live') >= 0 || text.indexOf('connect') >= 0))
      || text === 'disconnect' || text.indexOf('connecting') === 0;
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
      // else: leave original label
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

  function doConnect(username) {
    var user = normalize(username);
    if (!user) {
      updateUI('', 'failed', 'Please enter a TikTok username');
      return Promise.resolve(false);
    }

    console.log('[TF] Connecting to @' + user + '...');
    updateUI(user, 'connecting');

    return fetch('/api/tiktok/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user })
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
      return doConnect(normalize(user) || getTikTokUsername());
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
      var username = getTikTokUsername(btn);

      if (_connected) {
        var sameUser = normalize(username) === normalize(_currentUsername);
        doDisconnect();
        if (!sameUser && username) {
          setTimeout(function() { doConnect(username); }, 500);
        }
        return;
      }

      if (_connecting) return; // Already connecting, ignore

      if (!username) {
        updateUI('', 'failed', 'Please enter a TikTok username');
        return;
      }

      doConnect(username);
    }, 100);
  }, true);

  // ── Input listener — keep _currentUsername in sync ──

  document.addEventListener('input', function(e) {
    if (!e.target || e.target.tagName !== 'INPUT' || e.target.type === 'hidden') return;
    var val = normalize(e.target.value);
    if (val && val.length >= 2) {
      _currentUsername = val;
      localStorage.setItem('setting_tiktokname', val);
      try { if (window.session) window.session.tiktokUsername = val; } catch(ex) {}
    }
  }, true);

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
      }
      // If store wasn't ready, retry once more after delay
      if (!window.navigationStore && retries > 0) {
        setTimeout(function() { checkBackendStatus(retries - 1); }, 2000);
      }
    }).catch(function() {});
  }
  setTimeout(function() { checkBackendStatus(3); }, 1500);

  console.log('[TF] TikTok connect module loaded');
})();
