// Preload script - runs in renderer before page scripts
// Currently minimal - can be extended for IPC communication

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    isElectron: true,
    platform: process.platform,
    version: process.env.npm_package_version || '1.0.0'
});
