// ============================================================
// REVERSE-ENGINEERED: TikFinity Frontend Boot Sequence
// Decoded from obfuscated combo/app.js
// ============================================================

// === 1. SOCKET.IO WRAPPER (socketiowrapper) ===
// This is the main connection manager for the app

var socketiowrapper = {
    instanceId: generateUUID(),      // Random UUID per session
    io: null,                         // Socket.IO client instance
    appType: null,                    // "app" for main, "widget" for widgets
    channelId: null,                  // e.g., 2228412
    auth: null,                       // Channel signature (e.g., "ysFWNV5tcT")
    widgetSettingsTimeout: null,
    widgetStates: {},
    activeWidgets: [],
    lastPingTs: null,
    globalStatsSubscribed: false,
    wsAuthSuccess: false,             // <<< KEY FLAG - set to true when server responds
    pendingSocketEvents: {},

    // Check if connected and authenticated
    isConnected: function () {
        return this.io && this.io.connected && this.wsAuthSuccess;
    },

    // === INIT: Called during app boot ===
    // This is the CRITICAL function that must resolve for the app to load
    init: function (appType, channelId, auth, callback) {
        return new Promise(function (resolve, reject) {
            socketiowrapper.appType = appType;
            socketiowrapper.channelId = channelId;
            socketiowrapper.auth = auth;

            var hasReconnected = false;

            // Disconnect existing connection
            if (socketiowrapper.isConnected()) {
                socketiowrapper.io.disconnect();
            }

            // >>> CRITICAL: Connect with WebSocket ONLY, NO polling <<<
            socketiowrapper.io = io({
                transports: ['websocket'],   // WebSocket only!
                upgrade: false,              // Never upgrade from polling
                query: socketiowrapper.getQueryParams()
            });

            // >>> On Socket.IO 'connect' event <<<
            socketiowrapper.io.on('connect', function () {
                // Step 1: Emit "login" with context data
                socketiowrapper.login();

                // Step 2: Wait for server's authentication response
                // EVENT NAME: decoded from _0xaecf(0x16f0) + 't' = "loginResul" + "t" = "loginResult"
                // CONFIRMED by running the string decoder
                socketiowrapper.io.once('loginResult', function () {
                    // >>> THIS IS WHAT UNLOCKS THE APP <<<
                    socketiowrapper.wsAuthSuccess = true;
                    socketiowrapper.emitPendingSocketEvents();
                    resolve();  // Promise resolves → app continues to render UI
                });

                if (hasReconnected) {
                    api.logError({ type: 'socket_reconnected' }, true);
                }
                hasReconnected = true;
            });

            // On connection failure
            socketiowrapper.io.on('connect_failed', function (error) {
                reject("Socket connection failed: " + error);
            });

            // Connection error handler
            socketiowrapper.io.on('connect_error', function (error) {
                api.logError({ type: 'socket_connect_error', error: error }, true);
            });

            // Timeout: reject if not connected within ~20 seconds
            setTimeout(function () {
                reject("Socket connection timeout");
            }, 20000); // 0x739+-0x2d6a+0x5511 = 21769ms
        });
    },

    // === LOGIN: Emitted after Socket.IO connect ===
    login: function () {
        socketiowrapper.globalStatsSubscribed = false;
        socketiowrapper.io.emit('login', socketiowrapper.getContextParams());
    },

    // Query params sent in Socket.IO handshake URL
    getQueryParams: function () {
        return {
            appType: socketiowrapper.appType,
            channelId: socketiowrapper.channelId,
            auth: socketiowrapper.auth || '',
            instanceId: socketiowrapper.instanceId
        };
    },

    // Context params sent with "login" event
    getContextParams: function () {
        return {
            appType: socketiowrapper.appType,
            appVersion: (window.tfPageloadData && window.tfPageloadData.version) || '',
            channelId: socketiowrapper.channelId,
            auth: socketiowrapper.auth || '',
            instanceId: socketiowrapper.instanceId,
            origin: location.origin,
            receiveGlobalStats: true
        };
    },

    // Emit event (queues if not connected yet)
    emitSocketEvent: function (eventName, data, callback) {
        if (socketiowrapper.isConnected()) {
            if (callback) {
                socketiowrapper.io.emit(eventName, data, callback);
            } else {
                socketiowrapper.io.emit(eventName, data);
            }
        } else {
            // Queue for later when connected
            socketiowrapper.pendingSocketEvents[eventName] = { data, callback };
        }
    },

    // Flush queued events
    emitPendingSocketEvents: function () {
        for (var key in socketiowrapper.pendingSocketEvents) {
            var evt = socketiowrapper.pendingSocketEvents[key];
            socketiowrapper.emitSocketEvent(key, evt.data, evt.callback);
        }
        socketiowrapper.pendingSocketEvents = {};
    },

    // Keepalive ping tracking
    handlePing: function () {
        socketiowrapper.lastPingTs = new Date().getTime();
    }
};


// === 2. APP BOOT SEQUENCE ===
// Called after all scripts are loaded (init.js finishes loading app.js)

async function appBoot() {
    // Step 1: Read auth from localStorage (set by injected script)
    var channelId = parseInt(localStorage.getItem("setting_channelid")) || 0;
    var channelName = localStorage.getItem("setting_channelname") || "";
    var channelSignature = localStorage.getItem("setting_channelsignature") || "";
    var isPro = localStorage.getItem("setting_ispro") === "true";

    // Step 2: Initialize Socket.IO connection
    // THIS IS WHERE THE APP GETS STUCK if Socket.IO fails
    try {
        await socketiowrapper.init("app", channelId, channelSignature);
        // If we get here, wsAuthSuccess = true
        console.log("[BOOT] Socket.IO authenticated successfully");
    } catch (error) {
        console.error("[BOOT] Socket.IO failed:", error);
        // Show error on loading screen
        return;
    }

    // Step 3: Fetch API data
    // These calls happen AFTER Socket.IO is connected
    var meData = await fetch("/api/me").then(r => r.json());
    var configData = await fetch("/api/getAppConfig").then(r => r.json());
    var systemConfig = await fetch("/api/getSystemConfig").then(r => r.json());
    var translations = await fetch("/api/getTranslations").then(r => r.json());
    var gifts = await fetch("/api/getAllGifts").then(r => r.json());

    // Step 4: Initialize Vue.js app with fetched data
    // ... Vue app mount ...

    // Step 5: Hide splash screen, show main UI
    document.getElementById('splashScreen').style.display = 'none';
    // The splash screen contains "Getting things ready for you..."
    // and "Connecting websocket..." text
}


// === 3. SOCKET.IO EVENT HANDLERS (registered after boot) ===
// These are the events the app listens for from the server

// Server → Client events:
socketiowrapper.io.on('connected', function(data) {
    // { status:'ok', channelId, channelName, isPro, authenticated, channel }
    // Updates connection state in UI
});

socketiowrapper.io.on('authenticated', function(data) {
    // { status:'ok', channelId, channelName, isPro, authenticated }
    // THIS may be the 0x16f0+'t' event that resolves the boot promise
});

socketiowrapper.io.on('ready', function(data) {
    // { status:'ok', channelId }
    // Signals server is ready to accept commands
});

socketiowrapper.io.on('channelStatus', function(data) {
    // { connected:false, channelId, channelName, status:'disconnected' }
    // Updates TikTok connection status in sidebar
});

socketiowrapper.io.on('status', function(data) {
    // { connected:false, tiktok:false }
    // Updates overall connection status
});

socketiowrapper.io.on('stats', function(data) {
    // { viewers:0, likes:0, gifts:0, diamonds:0, followers:0 }
    // Updates live stats in header
});

socketiowrapper.io.on('globalStats', function(data) {
    // { viewers:0, channels:0 }
    // Updates global stats
});

socketiowrapper.io.on('config', function(data) {
    // { debug:false, channelId }
    // Server configuration
});

socketiowrapper.io.on('widgetSettings', function(data) {
    // Widget configuration data
    // Used by widget pages
});


// === 4. KEY DIFFERENCES: Real TikFinity vs Local Clone ===
//
// REAL TIKFINITY:
// 1. Socket.IO connects to: https://tikfinity-cws-{instance}.zerody.one/
//    - This is a SEPARATE WebSocket server (connector)
//    - The {instance} is replaced with a unique ID
// 2. API calls go to: https://tikfinity.zerody.one/api/
// 3. Uses CDN (CloudFlare) for static files
// 4. Proper SSL/HTTPS
//
// LOCAL CLONE:
// 1. Socket.IO connects to: same origin (http://localhost:5285)
//    - Because connectorHost template can't resolve locally
//    - Socket.IO falls back to same origin
// 2. API calls go to: http://localhost:5285/api/
// 3. Files served from local disk (now in-memory cache)
// 4. HTTP only
//
// WHY THE APP GETS STUCK:
// The Socket.IO client tries to connect, and the "init" Promise
// must resolve (wsAuthSuccess = true) for the app to proceed.
// If the server doesn't emit the right event, the Promise never
// resolves, and the splash screen stays forever.
