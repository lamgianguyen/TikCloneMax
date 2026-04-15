# Frontend BrowserBridge Hook Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make TikTok LIVE connection work from the frontend by hooking the bundle's `browserbridge` object to use our backend Node.js bridge, instead of building a parallel custom UI.

**Architecture:** Override `browserbridge.connect()` so it calls our backend API instead of opening a TikTok popup. Simulate the browserbridge message protocol (hello → isLiveDetected → connected) so the bundle thinks it's connected normally. Live events (chat, gift, like) come through Socket.IO which the bundle already listens to. Remove the custom connect UI (buildLoggedInSection, patchSettingsPage) — let the bundle's own UI work.

**Tech Stack:** JavaScript (injected via Program.cs), existing .NET backend + Node.js bridge

---

## Current Architecture (broken)

```
Custom UI (connectTikTokLive) → REST API /api/tiktok/connect → Backend → Node.js bridge → TikTok
                                                                     ↓
Bundle UI shows "Ready to connect" forever    SocketManager broadcasts events
(bundle's browserbridge.connected = false)    (bundle ignores them — browserbridge not connected)
```

## Target Architecture

```
Bundle's own Setup UI → browserbridge.connect() [HOOKED] → Backend API → Node.js bridge → TikTok
                                ↓                                              ↓
                    Simulate bridge messages              SocketManager broadcasts events
                    (hello, isLiveDetected)               (bundle processes them normally)
                                ↓
                    browserbridge.connected = true
                    Bundle UI updates correctly
```

## Key Insight

The bundle already has full UI for:
- TikTok name input on Setup page
- Connect/Disconnect buttons
- Connection status display
- Chat, gift, like displays
- Viewer count, stats

We just need to make `browserbridge.connect()` work with our backend instead of a popup window. The bundle handles everything else.

---

## Task 1: Create browserbridge hook script

**Files:**
- Modify: `backend/Program.cs` — replace `tiktokConnectScript` content

The hook script will:
1. Wait for `browserbridge` to exist (bundle creates it)
2. Override `browserbridge.connect()` to call our backend API
3. Override `browserbridge.disconnect()` to call disconnect API
4. Listen for Socket.IO events to update `browserbridge.connected` state
5. Simulate bridge messages so bundle processes them

- [ ] **Step 1: Write the browserbridge hook script**

```javascript
(function() {
  // Wait for browserbridge to be defined by bundle
  var hookInterval = setInterval(function() {
    if (typeof browserbridge === 'undefined') return;
    if (browserbridge.__tfHooked) return;
    browserbridge.__tfHooked = true;
    clearInterval(hookInterval);

    console.log('[TF-BRIDGE] Hooking browserbridge');

    // Save original methods
    var origConnect = browserbridge.connect;
    var origDisconnect = browserbridge.disconnect || function(){};

    // Override connect: use backend API instead of popup
    browserbridge.connect = function(channelInfo, userId, callback, showErrors) {
      console.log('[TF-BRIDGE] browserbridge.connect called', channelInfo, userId);

      // Store callback for later
      browserbridge._tfCallback = callback;
      browserbridge.connected = false;
      browserbridge.waitingForInitialData = true;

      // Get username from setup page input or channelInfo
      var username = '';
      try {
        // Try bundle's own input first
        var inputs = document.querySelectorAll('#textboxChannelName input, #textboxChannelName, input[placeholder*="tiktok"], input[placeholder*="username"]');
        for (var i = 0; i < inputs.length; i++) {
          var v = (inputs[i].value || '').trim().replace('@','');
          if (v) { username = v; break; }
        }
      } catch(e) {}

      // Fallback: try localStorage
      if (!username) {
        username = (localStorage.getItem('setting_tiktokname') || '').trim().replace('@','');
      }

      if (!username) {
        console.warn('[TF-BRIDGE] No username found');
        if (typeof browserbridge.connectFailed === 'function') {
          browserbridge.connectFailed('Please enter a TikTok username');
        }
        return;
      }

      console.log('[TF-BRIDGE] Connecting to @' + username + ' via backend');

      // Simulate bridge hello message (bundle expects this)
      setTimeout(function() {
        window.postMessage({app: 'tfbridge', type: 'hello', info: null}, '*');
      }, 100);

      // Call backend API
      var headers = {'Content-Type': 'application/json'};
      try {
        if (window.__tfGetAuthHeaders) {
          headers = window.__tfGetAuthHeaders(headers);
        }
      } catch(e){}

      fetch('/api/tiktok/connect', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({username: username})
      }).then(function(r) { return r.json(); }).then(function(data) {
        console.log('[TF-BRIDGE] API response:', data);
        if (data && data.status === 'ok') {
          // Start polling for connection status
          pollBridgeStatus(username);
        } else {
          if (typeof browserbridge.connectFailed === 'function') {
            browserbridge.connectFailed(data && data.message || 'Connection failed');
          }
        }
      }).catch(function(err) {
        console.error('[TF-BRIDGE] Connect error:', err);
        if (typeof browserbridge.connectFailed === 'function') {
          browserbridge.connectFailed('Connection error');
        }
      });
    };

    // Poll backend status until connected or failed
    function pollBridgeStatus(username) {
      var attempts = 0;
      var maxAttempts = 30; // 30 seconds max

      var poller = setInterval(function() {
        attempts++;
        fetch('/api/tiktok/status').then(function(r) { return r.json(); }).then(function(data) {
          if (data.connected) {
            clearInterval(poller);
            console.log('[TF-BRIDGE] Connected to @' + username);

            // Set browserbridge state
            browserbridge.connected = true;
            browserbridge.waitingForInitialData = false;

            // Simulate isLiveDetected message
            window.postMessage({
              app: 'tfbridge',
              type: 'isLiveDetected',
              info: {roomId: 'backend-bridge', username: username}
            }, '*');

            // Trigger callback if exists
            if (typeof browserbridge._tfCallback === 'function') {
              try { browserbridge._tfCallback({connected: true, username: username}); } catch(e){}
            }
          } else if (data.lastError || attempts >= maxAttempts) {
            clearInterval(poller);
            browserbridge.connected = false;
            var errMsg = data.lastError || 'Connection timeout — is @' + username + ' live?';
            console.warn('[TF-BRIDGE] Connection failed:', errMsg);
            if (typeof browserbridge.connectFailed === 'function') {
              browserbridge.connectFailed(errMsg);
            }
          }
        }).catch(function() {
          // Network error, keep trying
        });
      }, 1000);
    }

    // Override disconnect
    var origCloseWindow = browserbridge.closeWindow || browserbridge['closeWindo' + 'w'];
    browserbridge.closeWindow = function() {};  // No popup to close
    browserbridge['closeWindo' + 'w'] = function() {};

    // Also hook the reconnect function
    var origReconnect = browserbridge.reconnect || browserbridge['reconnect'];
    if (typeof origReconnect === 'function') {
      browserbridge.reconnect = browserbridge.connect;
    }

    // Listen for channelStatus Socket.IO events to keep state in sync
    if (typeof socketiowrapper !== 'undefined' && socketiowrapper.io) {
      try {
        socketiowrapper.io.on('channelStatus', function(data) {
          console.log('[TF-BRIDGE] channelStatus event:', data);
          if (data && data.connected) {
            browserbridge.connected = true;
          } else {
            browserbridge.connected = false;
          }
        });
      } catch(e) {}
    }

    console.log('[TF-BRIDGE] browserbridge hooked successfully');
  }, 500);
})();
```

- [ ] **Step 2: Remove custom connect UI code**

The following should be removed/simplified from `loginPopupScript` in Program.cs since the bundle's own UI will handle it:
- `buildLoggedInSection()` — remove TikTok connect form (keep signed-in message only)
- `buildStandaloneSetupConnectSection()` — remove entirely
- `ensureSetupConnectSection()` — remove entirely
- `connectTikTokLive()` — remove (browserbridge.connect handles it)
- `pollTikTokConnectUntilSettled()` — remove
- `refreshTikTokConnectStatus()` — remove
- `setConnectUiState()` — remove
- `bindSetupConnectActions()` — remove

Keep:
- `patchSettingsPage()` — still needed for login/logout state
- `buildLoggedInSection()` — simplify to just show "Signed in as X" without connect form
- `patchHeader()` — still needed

- [ ] **Step 3: Ensure bundle's setup page shows connect UI**

The bundle's setup page has its own connect UI (with `#textboxChannelName`, `#manualConnectButtonSetup`). Currently `patchLegacySetupPage()` replaces this with our custom UI. Change it to:
- When logged in: show bundle's `.setupConnected` sections (don't replace innerHTML)
- Just ensure `window.session.channel` is set so bundle knows user is authenticated

- [ ] **Step 4: Build and test**

```bash
cd backend && dotnet build
cd backend && dotnet run
```

Then in browser:
1. Open http://localhost:5285/tiktok/setup
2. Bundle's own connect UI should appear (TikTok name input + Connect button)
3. Enter username, click Connect
4. Console should show `[TF-BRIDGE]` logs
5. Status should change to Connected

---

## Task 2: Simplify patchSettingsPage

**Files:**
- Modify: `backend/Program.cs` — `patchLegacySetupPage()` and `patchSettingsPage()`

- [ ] **Step 1: Change patchLegacySetupPage to not replace connectedRoots**

Instead of `root.innerHTML = buildLoggedInSection()`, just let the bundle's connected UI show:
```javascript
connectedRoots.forEach(function(root) {
  if (!root) return;
  root.style.display = '';  // Just make visible, don't replace
});
```

- [ ] **Step 2: Simplify patchSettingsPage FORCE block**

Remove the FORCE block that replaces fieldsets with custom login form. The bundle has its own login UI. Only keep the `ensureSetupConnectSection` removal logic.

- [ ] **Step 3: Commit**

```bash
git add backend/Program.cs
git commit -m "feat: hook browserbridge to use backend bridge instead of TikTok popup"
```

---

## Task 3: Handle disconnect and reconnection

**Files:**
- Modify: `backend/Program.cs` — browserbridge hook script

- [ ] **Step 1: Add disconnect handler**

```javascript
// When user disconnects from UI
socketiowrapper.io.on('disconnected', function() {
  browserbridge.connected = false;
});

// Intercept any disconnect calls
browserbridge.disconnect = function() {
  fetch('/api/tiktok/disconnect', {method: 'POST', headers: headers});
  browserbridge.connected = false;
};
```

- [ ] **Step 2: Test disconnect flow**

1. Connect to a live TikTok user
2. Click Disconnect in bundle UI
3. Verify status changes to disconnected
4. Reconnect should work

---

## Risk: Bundle's connect UI may not work out of the box

The bundle's `browserbridge.connect()` may require specific parameters (channelInfo, userId) that come from `window.session`. If the bundle's connect button doesn't trigger `browserbridge.connect()` at all (it may use the extension), we need the hook to also listen for UI interactions:

```javascript
// Fallback: watch for bundle's connect button click
var setupObserver = new MutationObserver(function() {
  var connectBtn = document.querySelector('#manualConnectButtonSetup, .setupConnected button');
  if (connectBtn && !connectBtn.__tfHooked) {
    connectBtn.__tfHooked = true;
    connectBtn.addEventListener('click', function() {
      var input = document.querySelector('#textboxChannelName input');
      if (input && input.value) {
        browserbridge.connect(null, null, null);
      }
    });
  }
});
setupObserver.observe(document.body, {childList: true, subtree: true});
```
