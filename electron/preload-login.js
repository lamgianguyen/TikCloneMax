// Login window bridge — exposes auth flows to renderer (login.html).

const { contextBridge, ipcRenderer } = require('electron');

let resultCb = null;
let stateCb = null;

contextBridge.exposeInMainWorld('AUTH', {
    // Validate Serial + Key Code with TikfinityServer.
    validateKey: (keyId, keyCode) =>
        ipcRenderer.invoke('auth:validate-key', { keyId, keyCode }),

    // Login with username + password.
    loginUser: (username, password) =>
        ipcRenderer.invoke('auth:login-user', { username, password }),

    // Quit the app from the login window.
    quit: () => ipcRenderer.invoke('auth:quit'),

    // Read current cached auth state (lets login UI prefill last-used keyId, etc.).
    getState: () => ipcRenderer.invoke('auth:get-state'),

    // Push state changes (e.g., "Login server unreachable, retrying...").
    onState: (cb) => { stateCb = cb; },
    onResult: (cb) => { resultCb = cb; }
});

ipcRenderer.on('auth:state', (_evt, state) => {
    if (typeof stateCb === 'function') {
        try { stateCb(state); } catch (e) { console.error('[login] onState', e); }
    }
});

ipcRenderer.on('auth:result', (_evt, result) => {
    if (typeof resultCb === 'function') {
        try { resultCb(result); } catch (e) { console.error('[login] onResult', e); }
    }
});
