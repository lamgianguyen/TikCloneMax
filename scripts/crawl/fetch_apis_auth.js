const https = require('https');
const fs = require('fs');
const path = require('path');

const ORIGIN = 'https://tikfinity.zerody.one';
const API_DIR = path.join(__dirname, '..', '..', 'downloads', 'api');

// Auth headers from traffic capture
const AUTH_HEADERS = {
    'X-Channel-ID': '2228412',
    'X-Channel-Signature': 'ysFWNV5tcT',
    'X-Authorization-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzI2OTg3NzYsImRhdGEiOnsiY2hhbm5lbCI6eyJjaGFubmVsSWQiOjIyMjg0MTJ9LCJpc3N1ZXIiOiJUaWtGaW5pdHkifSwiaWF0IjoxNzcyNjk1MTc2fQ.-unY6Ch4p5-yiLgqf_Rhswd4ybGq3KFRkmdSh1YdkT0',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) tikfinity/1.0.4 Chrome/110.0.5481.208 Electron/23.3.13 Safari/537.36',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Referer': ORIGIN + '/',
};

function httpsGet(urlStr) {
    return new Promise((resolve, reject) => {
        const doRequest = (url, remaining) => {
            const req = https.get(url, { headers: AUTH_HEADERS }, (res) => {
                if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && remaining > 0) {
                    const redirect = res.headers.location.startsWith('http')
                        ? res.headers.location
                        : new URL(res.headers.location, url).href;
                    res.resume();
                    return doRequest(redirect, remaining - 1);
                }
                const chunks = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
                res.on('error', reject);
            });
            req.on('error', reject);
            req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
        };
        doRequest(urlStr, 3);
    });
}

async function fetchAndSave(apiPath, saveName) {
    const fullUrl = `${ORIGIN}${apiPath}`;
    const dest = path.join(API_DIR, saveName || apiPath.replace(/^\/api\//, '').replace(/\?.*$/, ''));

    try {
        const res = await httpsGet(fullUrl);
        const bodyStr = res.body.toString('utf8');

        if (res.status === 200 && bodyStr.length > 2) {
            try { JSON.parse(bodyStr); } catch (e) {
                console.log(`  [NOT JSON] ${apiPath} -> ${bodyStr.substring(0, 80)}`);
                return null;
            }
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.writeFileSync(dest, res.body);
            console.log(`  [OK] ${apiPath} (${(res.body.length / 1024).toFixed(1)} KB)`);
            return bodyStr;
        } else {
            console.log(`  [HTTP ${res.status}] ${apiPath} -> ${bodyStr.substring(0, 120)}`);
            return null;
        }
    } catch (err) {
        console.log(`  [ERR] ${apiPath}: ${err.message}`);
        return null;
    }
}

async function main() {
    console.log('=== Fetching APIs WITH auth headers ===\n');

    // Critical boot APIs that returned 404 without auth
    const bootApis = [
        '/api/me',
        '/api/getAppConfig',
        '/api/getSystemConfig',
        '/api/getTranslations',
        '/api/modules',
        '/api/sounds',
        '/api/getAllGiftsCached',
        '/api/getOverlayConfig',
        '/api/getMyInstants',
    ];

    for (const ep of bootApis) {
        await fetchAndSave(ep);
    }

    // Data APIs
    console.log('\nData APIs...');
    await fetchAndSave('/api/getLiveChannels?limit=60', 'getLiveChannels');
    await fetchAndSave('/api/getGlobalTransactions', 'getGlobalTransactions');
    await fetchAndSave('/api/getChannelEmotes?uniqueId=lamnguyen', 'getChannelEmotes');
    await fetchAndSave('/api/notifications/list?limit=50&archived=false', 'notifications/list');
    await fetchAndSave('/api/notifications/preferences', 'notifications/preferences');

    console.log('\nDone!');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
