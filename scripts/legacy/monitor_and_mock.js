const WebSocket = require('ws');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const LOCAL_SERVER = 'http://localhost:3000'; // Local fake server

const DEBUG_PORT = 8315;
const DISCOVERY_URL = `http://localhost:${DEBUG_PORT}/json`;
const LOG_FILE = 'tikfinity_traffic.json';
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');

// Ensure log file and download dir exist
if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, '[]');
if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

function appendToLog(entry) {
    try {
        const data = fs.readFileSync(LOG_FILE, 'utf8');
        const logs = JSON.parse(data);
        logs.push(entry);
        fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    } catch (err) {
        console.error('Error writing to log file:', err.message);
    }
}

// Map extensions to MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

async function getDebuggerUrl() {
    return new Promise((resolve, reject) => {
        // Ưu tiên đọc từ file start.json nếu có
        try {
            const startJsonPath = path.join(__dirname, 'start.json');
            const nodeModulesStartJson = path.join(__dirname, 'node_modules', 'start.json');

            let fileContent = '';
            if (fs.existsSync(startJsonPath) && fs.statSync(startJsonPath).size > 0) {
                fileContent = fs.readFileSync(startJsonPath, 'utf8');
            } else if (fs.existsSync(nodeModulesStartJson) && fs.statSync(nodeModulesStartJson).size > 0) {
                fileContent = fs.readFileSync(nodeModulesStartJson, 'utf8');
            }

            if (fileContent) {
                const targets = JSON.parse(fileContent);
                if (Array.isArray(targets) && targets.length > 0) {
                    const firstTarget = targets[0]; // Lấy giao diện đầu tiên như user yêu cầu
                    if (firstTarget && firstTarget.webSocketDebuggerUrl) {
                        console.log('[INFO] Đã đọc target từ file start.json');
                        return resolve({ url: firstTarget.webSocketDebuggerUrl, title: firstTarget.title || 'First Target' });
                    }
                }
            }
        } catch (e) {
            console.log('[WARN] Không thể parse start.json, sẽ tải từ DISCOVERY_URL:', e.message);
        }

        // Fallback: Tải từ localhost:8315
        http.get(DISCOVERY_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const targets = JSON.parse(data);
                    const mainPage = targets[0]; // Lấy giao diện đầu tiên
                    if (mainPage && mainPage.webSocketDebuggerUrl) {
                        resolve({ url: mainPage.webSocketDebuggerUrl, title: mainPage.title });
                    } else {
                        reject(new Error('Không tìm thấy webSocketDebuggerUrl trong JSON.'));
                    }
                } catch (err) {
                    reject(new Error('Lỗi khi parse JSON từ localhost:8315: ' + err.message));
                }
            });
        }).on('error', reject);
    });
}

async function start() {
    try {
        console.log(`Connecting to ${DISCOVERY_URL}...`);
        const target = await getDebuggerUrl();
        console.log(`Target found: ${target.title} (${target.url})`);

        const ws = new WebSocket(target.url);
        const requestDataMap = new Map(); // Store request info

        let idCounter = 1;
        const send = (method, params = {}) => {
            const message = JSON.stringify({ id: idCounter++, method, params });
            ws.send(message);
            return idCounter - 1;
        };

        ws.on('open', () => {
            console.log(`[CONNECTED] Intercepting fetch requests and checking local cache...`);
            send('Network.enable');
            // Intercept ALL requests at the Fetch level
            send('Fetch.enable', {
                patterns: [
                    { urlPattern: '*tikfinity.zerody.one*', requestStage: 'Request' }
                ]
            });
        });

        ws.on('message', (data) => {
            const message = JSON.parse(data);

            // Fetch Interception Logic — REDIRECT to Local Server
            if (message.method === 'Fetch.requestPaused') {
                const { requestId, request } = message.params;

                try {
                    const parsedUrl = new URL(request.url);

                    // Replace tikfinity.zerody.one with localhost:3000
                    if (parsedUrl.hostname.includes('zerody.one')) {
                        const newUrl = request.url.replace('https://tikfinity.zerody.one', LOCAL_SERVER);
                        console.log(`[REDIRECT] ${parsedUrl.pathname} -> ${LOCAL_SERVER}${parsedUrl.pathname}`);

                        send('Fetch.continueRequest', {
                            requestId,
                            url: newUrl
                        });
                        return;
                    }

                    // Other requests — continue normally
                    send('Fetch.continueRequest', { requestId });

                } catch (e) {
                    console.error('Error handling Fetch.requestPaused:', e.message);
                    send('Fetch.continueRequest', { requestId });
                }
            }


            // Logging Logic (Phase 1)
            // 1. Capture Request
            if (message.method === 'Network.requestWillBeSent') {
                const { requestId, request, timestamp, wallTime } = message.params;

                if (request.url.includes('zerody.one') || request.url.includes('tikfinity')) {
                    const entry = {
                        requestId,
                        interface: target.title,
                        time: new Date(wallTime * 1000).toLocaleString(),
                        method: request.method,
                        url: request.url,
                        requestHeaders: request.headers,
                        postData: request.postData ? request.postData : null
                    };
                    requestDataMap.set(requestId, entry);
                }
            }

            // 2. Capture Response Metadata
            if (message.method === 'Network.responseReceived') {
                const { requestId, response } = message.params;
                if (requestDataMap.has(requestId)) {
                    const entry = requestDataMap.get(requestId);
                    entry.responseStatus = response.status;
                    entry.responseHeaders = response.headers;
                    entry.mimeType = response.mimeType;

                    if (response.status === 200) {
                        const msgId = send('Network.getResponseBody', { requestId });
                        entry.bodyRequestId = msgId;
                    } else {
                        console.log(`[LOGGED] ${entry.method} ${entry.url.substring(0, 80)}... (${entry.responseStatus})`);
                        delete entry.requestId;
                        appendToLog(entry);
                        requestDataMap.delete(requestId);
                    }
                }
            }

            // 3. Capture Response Body & Save Log
            if (message.id && !message.method) {
                for (const [requestId, entry] of requestDataMap.entries()) {
                    if (entry.bodyRequestId === message.id) {
                        if (message.result) {
                            const bodyContent = message.result.body;
                            const isBase64 = message.result.base64Encoded;

                            entry.responseBody = isBase64
                                ? Buffer.from(bodyContent, 'base64').toString('utf8')
                                : bodyContent;

                            console.log(`[LOGGED] ${entry.method} ${entry.url.substring(0, 80)}... (${entry.responseStatus})`);

                            delete entry.bodyRequestId;
                            delete entry.requestId;
                            appendToLog(entry);
                            requestDataMap.delete(requestId);
                        }
                        break;
                    }
                }
            }
        });

        ws.on('close', () => {
            console.log('[DISCONNECTED] Connection closed. Reconnecting in 3s...');
            setTimeout(start, 3000);
        });

        ws.on('error', (err) => {
            console.error('WebSocket Error:', err.message);
        });

    } catch (err) {
        console.error('Error:', err.message);
        console.log('[RETRY] Retrying in 3s...');
        setTimeout(start, 3000);
    }
}

start();
