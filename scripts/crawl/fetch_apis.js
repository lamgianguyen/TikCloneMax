const https = require('https');
const fs = require('fs');
const path = require('path');

const ORIGIN = 'https://tikfinity.zerody.one';
const API_DIR = path.join(__dirname, '..', '..', 'downloads', 'api');

function httpsGet(urlStr, options = {}) {
    return new Promise((resolve, reject) => {
        const doRequest = (url, remaining) => {
            const req = https.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': ORIGIN + '/',
                    'Origin': ORIGIN,
                    ...options.headers
                }
            }, (res) => {
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
            req.setTimeout(options.timeout || 15000, () => { req.destroy(); reject(new Error('timeout')); });
        };
        doRequest(urlStr, 3);
    });
}

function httpsPost(urlStr, postData, options = {}) {
    return new Promise((resolve, reject) => {
        const parsed = new URL(urlStr);
        const data = typeof postData === 'string' ? postData : JSON.stringify(postData);
        const req = https.request({
            hostname: parsed.hostname,
            port: parsed.port || 443,
            path: parsed.pathname + parsed.search,
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
                'Referer': ORIGIN + '/',
                'Origin': ORIGIN,
                ...options.headers
            }
        }, (res) => {
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
            res.on('error', reject);
        });
        req.on('error', reject);
        req.setTimeout(options.timeout || 15000, () => { req.destroy(); reject(new Error('timeout')); });
        req.write(data);
        req.end();
    });
}

async function fetchAndSave(apiPath, savePath, options = {}) {
    const fullUrl = `${ORIGIN}${apiPath}`;
    const dest = path.join(API_DIR, savePath || apiPath.replace(/^\/api\//, '').replace(/\?.*$/, ''));

    try {
        let res;
        if (options.method === 'POST') {
            res = await httpsPost(fullUrl, options.body || {}, options);
        } else {
            res = await httpsGet(fullUrl, options);
        }

        const bodyStr = res.body.toString('utf8');

        if (res.status === 200 && bodyStr.length > 0) {
            // Try to validate JSON
            try {
                JSON.parse(bodyStr);
            } catch (e) {
                // Not JSON, save anyway if it has content
                if (bodyStr.length < 10) {
                    console.log(`  [SKIP] ${apiPath} -> not valid JSON (${bodyStr.substring(0, 50)})`);
                    return null;
                }
            }

            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.writeFileSync(dest, res.body);
            console.log(`  [OK] ${apiPath} -> ${dest.replace(API_DIR, 'api')} (${(res.body.length / 1024).toFixed(1)} KB)`);
            return bodyStr;
        } else {
            console.log(`  [HTTP ${res.status}] ${apiPath} (${bodyStr.substring(0, 100)})`);
            return null;
        }
    } catch (err) {
        console.log(`  [ERR] ${apiPath}: ${err.message}`);
        return null;
    }
}

async function main() {
    console.log('=== Fetching ALL API responses from tikfinity.zerody.one ===\n');

    // Backup existing api dir
    const backupDir = path.join(API_DIR + '_backup_' + Date.now());
    if (fs.existsSync(API_DIR)) {
        fs.cpSync(API_DIR, backupDir, { recursive: true });
        console.log(`[BACKUP] api/ -> ${path.basename(backupDir)}\n`);
    }

    // ========== BOOT SEQUENCE APIs ==========
    // These are called during _boot -> _injectModules
    console.log('[1/4] Boot sequence APIs (called during app startup)...');

    await fetchAndSave('/api/init');
    await fetchAndSave('/api/me');
    await fetchAndSave('/api/getAppConfig');
    await fetchAndSave('/api/getSystemConfig');
    await fetchAndSave('/api/getTranslations');
    await fetchAndSave('/api/modules');
    await fetchAndSave('/api/sounds');
    await fetchAndSave('/api/getAllGifts?lang=en-US');
    await fetchAndSave('/api/getAllGiftsCached');
    await fetchAndSave('/api/getOverlayConfig');
    await fetchAndSave('/api/getMyInstants');

    // ========== DATA APIs ==========
    console.log('\n[2/4] Data APIs...');

    await fetchAndSave('/api/getLiveChannels?limit=60');
    await fetchAndSave('/api/getGlobalTransactions');
    await fetchAndSave('/api/getChannelEmotes?uniqueId=lamnguyendev', 'getChannelEmotes');
    await fetchAndSave('/api/getChannelUserCount?channelId=2228412', 'getChannelUserCount');

    // OData endpoints
    await fetchAndSave('/api/odata/channeluser?$orderby=totalAmount%20desc&$top=20&$filter=channelId%20eq%202228412', 'odata/channeluser');
    await fetchAndSave('/api/odata/transaction?$orderby=createdAt%20desc&$top=20&$filter=(channelId%20eq%202228412)%20and%20(isDeleted%20eq%200)%20and%20(isDuringChallenge%20eq%20false)', 'odata/transaction');

    // REST endpoints
    await fetchAndSave('/api/rest/action?channelId=2228412&profileId=1&pageSize=5000', 'rest/action');
    await fetchAndSave('/api/rest/channeluser', 'rest/channeluser');

    // Notifications
    await fetchAndSave('/api/notifications/list?limit=50&archived=false', 'notifications/list');
    await fetchAndSave('/api/notifications/preferences', 'notifications/preferences');

    // Pro/Payment
    await fetchAndSave('/api/pro/tazapay/methods', 'pro/tazapay/methods');

    // Usage
    await fetchAndSave('/api/usage/log', 'usage/log');

    // ========== POST APIs (just save empty OK response) ==========
    console.log('\n[3/4] POST APIs...');

    await fetchAndSave('/api/updateSettings', 'updateSettings', { method: 'POST', body: {} });
    await fetchAndSave('/api/logError', 'logError', { method: 'POST', body: { error: 'test' } });
    await fetchAndSave('/api/pro/setUpgradeIntent', 'pro/setUpgradeIntent', { method: 'POST', body: {} });

    // ========== EXTRA: Try more API endpoints that modules might call ==========
    console.log('\n[4/4] Extra module APIs (discovery)...');

    const extraEndpoints = [
        '/api/getVoices',
        '/api/getTTSVoices',
        '/api/getActions',
        '/api/getEvents',
        '/api/getTriggers',
        '/api/getCommands',
        '/api/getChatCommands',
        '/api/getGoals',
        '/api/getOverlays',
        '/api/getWidgets',
        '/api/getTimers',
        '/api/getPolls',
        '/api/getLeaderboard',
        '/api/getMinigames',
        '/api/getPoints',
        '/api/getMedia',
        '/api/getQueue',
        '/api/getSongRequests',
        '/api/getProfiles',
        '/api/getConfigs',
        '/api/getTemplates',
        '/api/getBadges',
        '/api/getRanks',
        '/api/getRewards',
        '/api/getChallenges',
        '/api/getIntegrations',
        '/api/getConnections',
        '/api/getHistory',
        '/api/getCategories',
        '/api/getSettings',
        '/api/getFeatures',
        '/api/getSubscription',
        '/api/getProfile',
        '/api/getUser',
        '/api/getChannel',
        '/api/getStats',
        '/api/getDashboard',
        '/api/getNotifications',
        '/api/getPreferences',
    ];

    for (const ep of extraEndpoints) {
        await fetchAndSave(ep);
    }

    // ========== SUMMARY ==========
    console.log('\n========================================');
    console.log('  DONE! Check downloads/api/ for results');
    console.log('========================================');
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
