// Preload — exposes the same `window.API` shape that the real TikFinity desktop app
// provides, so the bundled frontend (downloads/) doesn't crash when it calls into it.
// Most actions are stubbed because our local .NET backend already handles equivalents
// (Socket.IO broadcast replaces emitWs, local server replaces fetchUrl-as-CORS-bypass).

const { contextBridge, ipcRenderer } = require('electron');

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
        const requestId = Math.random() * 10000000000000000;
        requestConfig.requestId = requestId;
        requestConfig.action = 'fetchUrl';
        if (typeof callback === 'function') fetchUrlQueue.set(requestId, callback);
        ipcRenderer.invoke('toMain', requestConfig);
    },

    setNewRoomIdHandler:           (fn) => { newRoomIdHandler = fn; },
    setIsLiveHandler:              (fn) => { isLiveHandler = fn; },
    setExecPsCommandResultHandler: (fn) => { execPsCommandResultHandler = fn; },
    setAutoItNotInstalledListener: (fn) => { autoItNotInstalledListener = fn; },
    setSpotifyAuthListener:        (fn) => { spotifyAuthListener = fn; },
    setKeyboardListener:           (fn) => { keyboardListener = fn; },
    setDapiClientConnectedHandler: (fn) => { dapiClientConnectedHandler = fn; }
});

// Backward compat: keep the older custom shape we previously exposed
contextBridge.exposeInMainWorld('electronAPI', {
    isElectron: true,
    platform: process.platform,
    version: process.env.npm_package_version || '1.0.0'
});

ipcRenderer.on('newRoomIdDetected', () => {
    if (typeof newRoomIdHandler === 'function') {
        try { newRoomIdHandler(); } catch (e) { console.error('[preload] newRoomIdHandler', e); }
    }
});

ipcRenderer.on('isLiveChanged', (_evt, isLive) => {
    if (typeof isLiveHandler === 'function') {
        try { isLiveHandler(isLive); } catch (e) { console.error('[preload] isLiveHandler', e); }
    }
});

ipcRenderer.on('execPsCommandResult', (_evt, payload) => {
    if (typeof execPsCommandResultHandler === 'function') {
        try { execPsCommandResultHandler(payload); } catch (e) { console.error('[preload] execPsCommandResult', e); }
    }
});

ipcRenderer.on('autoItNotInstalled', () => {
    if (typeof autoItNotInstalledListener === 'function') {
        try { autoItNotInstalledListener(); } catch (e) { console.error('[preload] autoItNotInstalled', e); }
    }
});

ipcRenderer.on('spotifyAuth', (_evt, payload) => {
    if (typeof spotifyAuthListener === 'function') {
        try { spotifyAuthListener(payload); } catch (e) { console.error('[preload] spotifyAuth', e); }
    }
});

ipcRenderer.on('keyboardEvent', (_evt, payload) => {
    if (typeof keyboardListener === 'function') {
        try { keyboardListener(payload); } catch (e) { console.error('[preload] keyboardEvent', e); }
    }
});

ipcRenderer.on('dapiClientConnected', () => {
    if (typeof dapiClientConnectedHandler === 'function') {
        try { dapiClientConnectedHandler(); } catch (e) { console.error('[preload] dapiClientConnected', e); }
    }
});

ipcRenderer.on('fetchUrlResponse', (_evt, payload) => {
    const cb = fetchUrlQueue.get(payload.requestId);
    if (cb) {
        fetchUrlQueue.delete(payload.requestId);
        try { cb(payload); } catch (e) { console.error('[preload] fetchUrlResponse', e); }
    }
});
