// Splash window bridge — exposes status/version updates pushed from main.

const { contextBridge, ipcRenderer } = require('electron');

let statusCb = null;
let versionCb = null;
let progressCb = null;

contextBridge.exposeInMainWorld('SPLASH', {
    onStatus: (cb) => { statusCb = cb; },
    onVersion: (cb) => { versionCb = cb; },
    onProgress: (cb) => { progressCb = cb; }
});

ipcRenderer.on('splash:status', (_evt, text) => {
    if (typeof statusCb === 'function') {
        try { statusCb(text); } catch (e) { console.error('[splash] status cb', e); }
    }
});

ipcRenderer.on('splash:version', (_evt, v) => {
    if (typeof versionCb === 'function') {
        try { versionCb(v); } catch (e) { console.error('[splash] version cb', e); }
    }
});

ipcRenderer.on('splash:progress', (_evt, step) => {
    if (typeof progressCb === 'function') {
        try { progressCb(step); } catch (e) { console.error('[splash] progress cb', e); }
    }
});
