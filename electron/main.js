const { app, BrowserWindow, Tray, Menu, nativeImage, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const BACKEND_PORT = 5285;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

let mainWindow = null;
let tray = null;
let backendProcess = null;
let isQuitting = false;

// Prevent multiple instances
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
    app.quit();
}

app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

// --- Backend process management ---

function getBackendLaunchConfig() {
    if (app.isPackaged) {
        // Packaged: node-backend is in resources
        const serverJs = path.join(process.resourcesPath, 'node-backend', 'server.js');
        return {
            command: 'node',
            args: [serverJs],
            cwd: path.join(process.resourcesPath, 'node-backend'),
            label: `node ${serverJs}`
        };
    }

    // Dev: run from project directory
    const serverJs = path.join(__dirname, '..', 'node-backend', 'server.js');
    return {
        command: 'node',
        args: [serverJs],
        cwd: path.join(__dirname, '..', 'node-backend'),
        label: `node ${serverJs}`
    };
}

function startBackend() {
    const backend = getBackendLaunchConfig();

    console.log(`[Electron] Starting backend: ${backend.label}`);

    try {
        backendProcess = spawn(backend.command, backend.args, {
            cwd: backend.cwd,
            env: {
                ...process.env,
                PORT: String(BACKEND_PORT)
            },
            stdio: ['ignore', 'pipe', 'pipe']
        });

        backendProcess.stdout.on('data', (data) => {
            const msg = data.toString().trim();
            if (msg) console.log(`[Backend] ${msg}`);
        });

        backendProcess.stderr.on('data', (data) => {
            const msg = data.toString().trim();
            if (msg) console.error(`[Backend ERR] ${msg}`);
        });

        backendProcess.on('exit', (code) => {
            console.log(`[Backend] Process exited with code ${code}`);
            if (!isQuitting) {
                // Backend crashed - show error and restart option
                dialog.showMessageBox({
                    type: 'error',
                    title: 'TikFinity Backend Error',
                    message: `Backend process exited unexpectedly (code: ${code}).`,
                    buttons: ['Restart', 'Quit'],
                    defaultId: 0
                }).then(({ response }) => {
                    if (response === 0) {
                        startBackend();
                        waitForBackend().then(createWindow);
                    } else {
                        app.quit();
                    }
                });
            }
        });

        backendProcess.on('error', (err) => {
            console.error(`[Backend] Failed to start:`, err.message);
        });

    } catch (err) {
        console.error(`[Electron] Failed to spawn backend:`, err);
    }
}

function waitForBackend(maxRetries = 30, delayMs = 1000) {
    return new Promise((resolve, reject) => {
        let attempt = 0;

        function check() {
            attempt++;
            http.get(`${BACKEND_URL}/api/health`, (res) => {
                if (res.statusCode === 200) {
                    console.log(`[Electron] Backend ready after ${attempt} attempts`);
                    resolve();
                } else {
                    retry();
                }
            }).on('error', () => {
                retry();
            });
        }

        function retry() {
            if (attempt >= maxRetries) {
                reject(new Error(`Backend not ready after ${maxRetries} attempts`));
                return;
            }
            setTimeout(check, delayMs);
        }

        check();
    });
}

function stopBackend() {
    if (backendProcess && !backendProcess.killed) {
        console.log('[Electron] Stopping backend...');
        backendProcess.kill('SIGTERM');
        // Force kill after 5 seconds
        setTimeout(() => {
            if (backendProcess && !backendProcess.killed) {
                backendProcess.kill('SIGKILL');
            }
        }, 5000);
    }
}

// --- Window management ---

function createWindow() {
    if (mainWindow) {
        mainWindow.show();
        return;
    }

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 900,
        minHeight: 600,
        title: 'TikFinity',
        icon: path.join(__dirname, 'icon.png'),
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadURL(BACKEND_URL);

    // Minimize to tray instead of closing
    mainWindow.on('close', (e) => {
        if (!isQuitting) {
            e.preventDefault();
            mainWindow.hide();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Remove the menu bar
    mainWindow.setMenuBarVisibility(false);
}

function createTray() {
    // Create a simple tray icon (1x1 pixel as fallback)
    const iconPath = path.join(__dirname, 'icon.png');
    let icon;
    try {
        icon = nativeImage.createFromPath(iconPath);
        if (icon.isEmpty()) throw new Error('empty');
    } catch {
        // Create a simple 16x16 icon as fallback
        icon = nativeImage.createEmpty();
    }

    tray = new Tray(icon);
    tray.setToolTip('TikFinity');

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show TikFinity',
            click: () => {
                if (mainWindow) mainWindow.show();
                else createWindow();
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => {
        if (mainWindow) mainWindow.show();
        else createWindow();
    });
}

// --- App lifecycle ---

app.whenReady().then(async () => {
    console.log('[Electron] App ready, starting backend...');

    startBackend();
    createTray();

    try {
        await waitForBackend();
        createWindow();
    } catch (err) {
        console.error('[Electron] Backend startup failed:', err.message);
        dialog.showErrorBox('Startup Error',
            'Could not start the TikFinity backend.\n\n' +
            'Make sure Node.js is installed and port 5285 is available.\n\n' +
            err.message
        );
        app.quit();
    }
});

app.on('before-quit', () => {
    isQuitting = true;
    stopBackend();
});

app.on('window-all-closed', () => {
    // Don't quit - keep running in tray
});

app.on('activate', () => {
    if (mainWindow) mainWindow.show();
    else createWindow();
});
