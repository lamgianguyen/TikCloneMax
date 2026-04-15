const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 3000;
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
const TIKFINITY_ORIGIN = 'https://tikfinity.zerody.one';

// MIME types
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
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.ico': 'image/x-icon'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

// Try to guess mime from traffic log
function getMimeFromLog(urlPath) {
    try {
        const logFile = path.join(__dirname, 'tikfinity_traffic.json');
        if (fs.existsSync(logFile)) {
            const data = JSON.parse(fs.readFileSync(logFile, 'utf8'));
            const entry = data.find(e => {
                try {
                    const u = new URL(e.url);
                    return u.pathname === urlPath;
                } catch { return false; }
            });
            if (entry && entry.mimeType) return entry.mimeType;
        }
    } catch (e) { /* ignore */ }
    return null;
}

const server = http.createServer((req, res) => {
    const urlPath = req.url.split('?')[0]; // Remove query params
    const localPath = path.join(DOWNLOAD_DIR, urlPath === '/' ? 'index.html' : urlPath);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Expose-Headers', 'X-Authorization-Token');

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Try to serve from local downloads
    if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
        const content = fs.readFileSync(localPath);

        // Determine MIME type: first by extension, then by traffic log
        let mime = getMimeType(localPath);
        if (mime === 'application/octet-stream') {
            // No file extension — check traffic log for original MIME type
            const logMime = getMimeFromLog(urlPath);
            if (logMime) mime = logMime;
        }

        console.log(`[LOCAL] ${req.method} ${urlPath} -> ${mime} (${content.length} bytes)`);
        res.writeHead(200, { 'Content-Type': mime });
        res.end(content);
        return;
    }

    // File not found locally — proxy to real server
    console.log(`[PROXY] ${req.method} ${urlPath} -> forwarding to ${TIKFINITY_ORIGIN}`);

    const https = require('https');
    const proxyUrl = `${TIKFINITY_ORIGIN}${req.url}`;

    const proxyReq = https.request(proxyUrl, {
        method: req.method,
        headers: {
            ...req.headers,
            host: 'tikfinity.zerody.one'
        }
    }, (proxyRes) => {
        // Forward response headers
        const headers = { ...proxyRes.headers };
        headers['access-control-allow-origin'] = '*';
        res.writeHead(proxyRes.statusCode, headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        console.error(`[ERROR] Proxy failed for ${urlPath}:`, err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Proxy failed', message: err.message }));
    });

    // Forward request body (for POST etc.)
    req.pipe(proxyReq);
});

server.listen(PORT, () => {
    console.log(`\n===================================`);
    console.log(`  TikFinity Local Fake Server`);
    console.log(`===================================`);
    console.log(`  Listening on: http://localhost:${PORT}`);
    console.log(`  Serving from: ${DOWNLOAD_DIR}`);
    console.log(`  Proxy to:     ${TIKFINITY_ORIGIN}`);
    console.log(`===================================`);
    console.log(`\nLogic:`);
    console.log(`  1. If file exists in downloads/ -> serve locally`);
    console.log(`  2. If file NOT found -> proxy to ${TIKFINITY_ORIGIN}`);
    console.log(`\nExample:`);
    console.log(`  http://  :${PORT}/api/getLiveChannels`);
    console.log(`  http://localhost:${PORT}/img/user/33930/6755822083143828486`);
    console.log(`\nWaiting for requests...\n`);
});
