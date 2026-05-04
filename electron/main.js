const { app, BrowserWindow, Tray, Menu, nativeImage, dialog, ipcMain, session } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const https = require('https');

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
    // The real backend is the .NET project in ../backend. Electron spawns it
    // via `dotnet run` in dev, or the self-contained publish in a packaged app.
    const isWin = process.platform === 'win32';

    if (app.isPackaged) {
        const exeName = isWin ? 'TikFinityBackend.exe' : 'TikFinityBackend';
        const exePath = path.join(process.resourcesPath, 'backend', exeName);
        return {
            command: exePath,
            args: [],
            cwd: path.join(process.resourcesPath, 'backend'),
            label: exePath
        };
    }

    const backendProjectDir = path.join(__dirname, '..', 'backend');
    return {
        command: isWin ? 'dotnet.exe' : 'dotnet',
        args: ['run', '--project', backendProjectDir, '--no-launch-profile'],
        cwd: backendProjectDir,
        label: `dotnet run --project ${backendProjectDir}`
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
        minWidth: 1230,
        minHeight: 700,
        show: false,
        title: 'TikFinity',
        backgroundColor: '#212121',
        icon: path.join(__dirname, 'icon.png'),
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            backgroundThrottling: false,
            allowRunningInsecureContent: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.menuBarVisible = false;
    mainWindow.maximize();
    mainWindow.loadURL(BACKEND_URL);
    mainWindow.once('ready-to-show', () => mainWindow.show());

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

// --- IPC bridge: window.API.toMain(...) from preload ---
// Mirrors the real TikFinity desktop app's bridge so frontend code that calls
// API.fetchUrl / API.toMain doesn't silently fail.

ipcMain.handle('toMain', async (_event, data) => {
    if (!data || typeof data !== 'object') return;

    switch (data.action) {
        case 'fetchUrl': {
            // Used by frontend as a CORS-bypass HTTP client. Forward via Node http(s).
            try {
                const url = data.url;
                if (!url) throw new Error('fetchUrl: missing url');
                const lib = url.startsWith('https:') ? https : http;
                const reqOpts = {
                    method: data.method || 'GET',
                    headers: data.headers || {}
                };
                const body = data.data ? (typeof data.data === 'string' ? data.data : JSON.stringify(data.data)) : null;
                if (body && !reqOpts.headers['Content-Type'] && !reqOpts.headers['content-type']) {
                    reqOpts.headers['Content-Type'] = 'application/json';
                }
                const responseData = await new Promise((resolve, reject) => {
                    const req = lib.request(url, reqOpts, (res) => {
                        const chunks = [];
                        res.on('data', (c) => chunks.push(c));
                        res.on('end', () => {
                            const buf = Buffer.concat(chunks).toString('utf-8');
                            let parsed = buf;
                            const ct = (res.headers['content-type'] || '').toLowerCase();
                            if (ct.includes('application/json')) {
                                try { parsed = JSON.parse(buf); } catch { parsed = buf; }
                            }
                            resolve({ status: res.statusCode, data: parsed });
                        });
                    });
                    req.on('error', reject);
                    if (body) req.write(body);
                    req.end();
                });
                if (mainWindow) {
                    mainWindow.webContents.send('fetchUrlResponse', {
                        requestId: data.requestId,
                        responseData: responseData.data,
                        responseCode: responseData.status
                    });
                }
            } catch (err) {
                if (mainWindow) {
                    mainWindow.webContents.send('fetchUrlResponse', {
                        requestId: data.requestId,
                        error: err.toString()
                    });
                }
            }
            break;
        }

        case 'setUniqueId':
        case 'setChannelId':
        case 'sendBrowserLog':
        case 'onFeatureFlags':
            // Quietly accept — the local .NET backend tracks these via its own session/JWT.
            break;

        case 'emitWs':
            // Real app broadcasts to its local widget WebSocket. We use Socket.IO via .NET
            // backend (port 5285) for that. Frontend's own widget pages connect to that
            // directly, so the IPC path is a no-op in the clone.
            break;

        case 'execPsCommand':
        case 'execAutoItCommand':
        case 'initKeyboardListener':
            // Native automation features (OBS auto-config, keyboard hooks) — not implemented
            // in the clone. Silently no-op so the UI doesn't surface fake errors.
            console.log(`[ipc] '${data.action}' not implemented in clone — ignored`);
            break;

        default:
            console.warn(`[ipc] Unknown toMain action: ${data.action}`);
    }
});

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
