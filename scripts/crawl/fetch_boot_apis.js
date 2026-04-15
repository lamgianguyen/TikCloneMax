const https = require('https');
const fs = require('fs');
const path = require('path');

const ORIGIN = 'https://tikfinity.zerody.one';
const API_DIR = path.join(__dirname, '..', '..', 'downloads', 'api');

const AUTH_HEADERS = {
    'X-Channel-ID': '2228412',
    'X-Channel-Signature': 'ysFWNV5tcT',
    'X-Authorization-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzI2OTg3NzYsImRhdGEiOnsiY2hhbm5lbCI6eyJjaGFubmVsSWQiOjIyMjg0MTJ9LCJpc3N1ZXIiOiJUaWtGaW5pdHkifSwiaWF0IjoxNzcyNjk1MTc2fQ.-unY6Ch4p5-yiLgqf_Rhswd4ybGq3KFRkmdSh1YdkT0',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) tikfinity/1.0.4 Chrome/110.0.5481.208 Electron/23.3.13 Safari/537.36',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Referer': ORIGIN + '/',
};

function httpsRequest(method, urlStr, postData) {
    return new Promise((resolve, reject) => {
        const parsed = new URL(urlStr);
        const data = postData ? (typeof postData === 'string' ? postData : JSON.stringify(postData)) : null;
        const options = {
            hostname: parsed.hostname,
            port: parsed.port || 443,
            path: parsed.pathname + parsed.search,
            method: method,
            headers: {
                ...AUTH_HEADERS,
                'Content-Type': 'application/json; charset=UTF-8',
                ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
            }
        };

        const req = https.request(options, (res) => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
                const redirect = res.headers.location.startsWith('http')
                    ? res.headers.location
                    : new URL(res.headers.location, urlStr).href;
                res.resume();
                return httpsRequest(method, redirect, postData).then(resolve).catch(reject);
            }
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
            res.on('error', reject);
        });
        req.on('error', reject);
        req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
        if (data) req.write(data);
        req.end();
    });
}

async function tryEndpoint(apiPath, saveName, postData) {
    const fullUrl = `${ORIGIN}${apiPath}`;
    const dest = path.join(API_DIR, saveName || apiPath.replace(/^\/api\//, ''));

    // Try GET first, then POST
    for (const method of ['GET', 'POST']) {
        try {
            const res = await httpsRequest(method, fullUrl, method === 'POST' ? (postData || {}) : null);
            const bodyStr = res.body.toString('utf8');

            if (res.status === 200 && bodyStr.length > 2) {
                try { JSON.parse(bodyStr); } catch (e) { continue; }
                fs.mkdirSync(path.dirname(dest), { recursive: true });
                fs.writeFileSync(dest, res.body);
                console.log(`  [${method} OK] ${apiPath} (${(res.body.length / 1024).toFixed(1)} KB)`);
                return bodyStr;
            } else if (res.status !== 404) {
                console.log(`  [${method} ${res.status}] ${apiPath} -> ${bodyStr.substring(0, 80)}`);
            }
        } catch (err) {
            console.log(`  [${method} ERR] ${apiPath}: ${err.message}`);
        }
    }
    console.log(`  [FAILED] ${apiPath} - not available via GET or POST`);
    return null;
}

async function main() {
    console.log('=== Trying boot APIs with GET and POST ===\n');

    const bootApis = [
        { path: '/api/me', post: { channelName: 'lamnguyen', monthlyEarnings: 0, streamGifter: 0 } },
        { path: '/api/getAppConfig' },
        { path: '/api/getSystemConfig' },
        { path: '/api/getTranslations' },
        { path: '/api/modules' },
        { path: '/api/sounds' },
        { path: '/api/getAllGiftsCached' },
        { path: '/api/getOverlayConfig' },
        { path: '/api/getMyInstants' },
    ];

    for (const api of bootApis) {
        await tryEndpoint(api.path, undefined, api.post);
    }

    console.log('\nDone!');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
