// Preload — exposes window.API matching the original TikFinity desktop bridge
// shape so the bundled frontend (downloads/) doesn't crash when it calls in.
//
// Most actions are forwarded to main.js via IPC; the renderer never sees raw
// Node APIs. Event names mirror the original app exactly so any obfuscated
// bundle code that listens for `isLiveDetected`, `spotifyAuthToken`, etc.
// still works.

const { contextBridge, ipcRenderer } = require('electron');

function seedRendererAuth() {
    let seed = null;

    try {
        seed = ipcRenderer.sendSync('auth:get-renderer-seed');
    } catch {
        return;
    }

    if (!seed || typeof seed !== 'object') return;

    try {
        if (typeof localStorage === 'undefined' || typeof document === 'undefined') {
            throw new Error('storage-unavailable');
        }

        const set = (key, value) => {
            if (localStorage.getItem(key) !== value) {
                localStorage.setItem(key, value);
            }
        };

        set('tfs_authed', '1');
        set('tfs_user', seed.userPayload);
        set('setting_loginaccesstoken', seed.tokenForBundle);
        set('setting_ispro', 'true');
        set('setting_channelid', '1');
        set('setting_channelname', seed.displayName);
        set('setting_email', seed.displayName);

        if (!localStorage.getItem('setting_locale')) {
            localStorage.setItem('setting_locale', 'vi');
        }

        if (!/(?:^|;\s*)tf_login_token=/.test(document.cookie)) {
            const maxAge = 60 * 60 * 24 * 30;
            document.cookie = `tf_login_token=${encodeURIComponent(seed.tokenForBundle)}; path=/; max-age=${maxAge}; SameSite=Lax`;
            document.cookie = `tf_ispro=true; path=/; max-age=${maxAge}; SameSite=Lax`;
            document.cookie = `tf_channelid=1; path=/; max-age=${maxAge}; SameSite=Lax`;
            document.cookie = `tf_channelname=${encodeURIComponent(seed.displayName)}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }
        window.__tfsAuthSeeded = true;
    } catch {
        if (!window.__tfsAuthSeedRetryScheduled) {
            window.__tfsAuthSeedRetryScheduled = true;
            window.addEventListener('DOMContentLoaded', () => {
                if (!window.__tfsAuthSeeded) seedRendererAuth();
            }, { once: true });
        }
    }
}

seedRendererAuth();

let newRoomIdHandler = null;
let isLiveHandler = null;
let execPsCommandResultHandler = null;
let autoItNotInstalledListener = null;
let spotifyAuthListener = null;
let keyboardListener = null;
let dapiClientConnectedHandler = null;

const fetchUrlQueue = new Map();

contextBridge.exposeInMainWorld('API', {
    toMain: (args) => ipcRenderer.invoke('toMain', args),

    fetchUrl: (requestConfig, callback) => {
        const requestId = Math.floor(Math.random() * 1e16);
        const cfg = { ...requestConfig, requestId, action: 'fetchUrl' };
        if (typeof callback === 'function') fetchUrlQueue.set(requestId, callback);
        ipcRenderer.invoke('toMain', cfg);
    },

    setNewRoomIdHandler:           (fn) => { newRoomIdHandler = fn; },
    setIsLiveHandler:              (fn) => { isLiveHandler = fn; },
    setExecPsCommandResultHandler: (fn) => { execPsCommandResultHandler = fn; },
    setAutoItNotInstalledListener: (fn) => { autoItNotInstalledListener = fn; },
    setSpotifyAuthListener:        (fn) => { spotifyAuthListener = fn; },
    setKeyboardListener:           (fn) => { keyboardListener = fn; },
    setDapiClientConnectedHandler: (fn) => { dapiClientConnectedHandler = fn; }
});

// Lightweight diagnostics object for clone-specific code.
contextBridge.exposeInMainWorld('electronAPI', {
    isElectron: true,
    platform: process.platform,
    version: process.env.npm_package_version || '1.0.0'
});

// Auth + TikTok session control surface for renderer.
contextBridge.exposeInMainWorld('TFS', {
    getAuthState: () => ipcRenderer.invoke('auth:get-state'),
    logout:       () => ipcRenderer.invoke('auth:logout'),

    // TikTok sign-in (passport flow). Renderer calls these from the
    // injected "TikTok Login required" modal when the user clicks Connect
    // without a saved sessionid cookie.
    tiktokGetStatus:  () => ipcRenderer.invoke('tiktok:get-signin-status'),
    tiktokSignIn:     () => ipcRenderer.invoke('tiktok:sign-in'),
    tiktokClear:      () => ipcRenderer.invoke('tiktok:clear-session')
});

// ---- IPC event fan-out ----------------------------------------------------

ipcRenderer.on('newRoomIdDetected', (_evt, payload) => {
    if (typeof newRoomIdHandler !== 'function') return;
    try { newRoomIdHandler(payload); } catch (e) { console.error('[preload] newRoomIdHandler', e); }
});

ipcRenderer.on('isLiveDetected', (_evt, payload) => {
    if (typeof isLiveHandler !== 'function') return;
    try { isLiveHandler(payload); } catch (e) { console.error('[preload] isLiveHandler', e); }
});

ipcRenderer.on('execPsCommandResult', (_evt, payload) => {
    if (typeof execPsCommandResultHandler !== 'function') return;
    try { execPsCommandResultHandler(payload); } catch (e) { console.error('[preload] execPsCommandResult', e); }
});

ipcRenderer.on('autoItNotInstalled', () => {
    if (typeof autoItNotInstalledListener !== 'function') return;
    try { autoItNotInstalledListener(); } catch (e) { console.error('[preload] autoItNotInstalled', e); }
});

ipcRenderer.on('spotifyAuthToken', (_evt, payload) => {
    if (typeof spotifyAuthListener !== 'function') return;
    try { spotifyAuthListener(payload?.authToken || payload); } catch (e) { console.error('[preload] spotifyAuthToken', e); }
});

ipcRenderer.on('keyboardEvent', (_evt, payload) => {
    if (typeof keyboardListener !== 'function') return;
    try { keyboardListener(payload); } catch (e) { console.error('[preload] keyboardEvent', e); }
});

ipcRenderer.on('dapiClientConnected', (_evt, payload) => {
    if (typeof dapiClientConnectedHandler !== 'function') return;
    try { dapiClientConnectedHandler(payload); } catch (e) { console.error('[preload] dapiClientConnected', e); }
});

ipcRenderer.on('fetchUrlResponse', (_evt, payload) => {
    if (!payload || typeof payload.requestId === 'undefined') return;
    const cb = fetchUrlQueue.get(payload.requestId);
    if (!cb) return;
    fetchUrlQueue.delete(payload.requestId);
    try { cb(payload); } catch (e) { console.error('[preload] fetchUrlResponse', e); }
});
