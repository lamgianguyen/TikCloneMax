const https = require('https');
const fs = require('fs');
const path = require('path');

const ORIGIN = 'https://tikfinity.zerody.one';
const DOWNLOAD_DIR = path.join(__dirname, '..', '..', 'downloads');
const downloaded = new Set();
const failed = [];
let totalSaved = 0;

function httpsGet(urlStr, timeout = 15000) {
    return new Promise((resolve, reject) => {
        const doRequest = (url, remaining) => {
            const req = https.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.5'
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
            req.setTimeout(timeout, () => { req.destroy(); reject(new Error('timeout')); });
        };
        doRequest(urlStr, 3);
    });
}

async function downloadFile(urlPath) {
    // Normalize path
    urlPath = urlPath.split('?')[0]; // Remove query string for saving
    if (downloaded.has(urlPath)) return;
    downloaded.add(urlPath);

    const dest = path.join(DOWNLOAD_DIR, urlPath);
    // Skip if already exists and has content
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
        return;
    }

    const fullUrl = `${ORIGIN}${urlPath}`;
    try {
        const res = await httpsGet(fullUrl);
        if (res.status === 200 && res.body.length > 0) {
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.writeFileSync(dest, res.body);
            totalSaved++;
            console.log(`  [OK] ${urlPath} (${(res.body.length / 1024).toFixed(1)} KB)`);
            return res.body;
        } else {
            console.log(`  [SKIP] ${urlPath} -> HTTP ${res.status}`);
        }
    } catch (err) {
        console.log(`  [ERR] ${urlPath}: ${err.message}`);
        failed.push(urlPath);
    }
}

async function downloadUrl(fullUrl) {
    try {
        const parsed = new URL(fullUrl);
        if (!parsed.hostname.includes('zerody.one')) return;
        await downloadFile(parsed.pathname);
    } catch (e) { }
}

async function main() {
    console.log('=== TikFinity Full Asset Fetcher ===\n');

    // ========== STEP 1: index.html ==========
    console.log('[1/7] Fetching index.html...');
    try {
        const res = await httpsGet(ORIGIN);
        if (res.status === 200) {
            const dest = path.join(DOWNLOAD_DIR, 'index.html');
            fs.writeFileSync(dest, res.body);
            console.log(`  [OK] index.html (${(res.body.length / 1024).toFixed(1)} KB)`);
        }
    } catch (e) {
        console.log('  [ERR] Could not fetch index.html:', e.message);
    }

    // ========== STEP 2: Parse index.html for assets ==========
    console.log('\n[2/7] Parsing index.html for asset references...');
    const indexHtml = fs.readFileSync(path.join(DOWNLOAD_DIR, 'index.html'), 'utf8');

    const assetRefs = new Set();

    // script src
    for (const m of indexHtml.matchAll(/src=["']([^"']+)["']/g)) assetRefs.add(m[1]);
    // link href
    for (const m of indexHtml.matchAll(/href=["']([^"']+)["']/g)) assetRefs.add(m[1]);
    // url() in CSS
    for (const m of indexHtml.matchAll(/url\(["']?([^"')]+)["']?\)/g)) assetRefs.add(m[1]);
    // Inline JS references
    for (const m of indexHtml.matchAll(/["'](\/[a-zA-Z0-9_\-/.]+\.(js|css|png|jpg|svg|woff2?|ttf|gif|webp|mp3|json))["']/g)) assetRefs.add(m[1]);

    const localAssets = [...assetRefs].filter(u => {
        if (!u || u.startsWith('data:') || u.startsWith('blob:') || u.startsWith('#') || u.startsWith('javascript:')) return false;
        if (u.startsWith('http') && !u.includes('zerody.one')) return false;
        return true;
    }).map(u => {
        if (u.startsWith('http')) return new URL(u).pathname;
        if (!u.startsWith('/')) return '/' + u;
        return u;
    });

    console.log(`  Found ${localAssets.length} asset refs in index.html`);
    for (const asset of localAssets) {
        await downloadFile(asset);
    }

    // ========== STEP 3: Known static assets ==========
    console.log('\n[3/7] Fetching known static assets...');

    const knownAssets = [
        '/favicon.ico',
        '/css/app.css',
        '/css/main.min.css',
        '/css/text-effects.css',
        '/js/lib-bundle.min.js',
        '/js/init.js',
        '/js/audiofix.js',
        '/js/tts.js',
        '/js/text-effects.js',
        '/js/text-effects-labels.js',
        '/js/text-effects-integration.js',
        '/js/intervalfixworker.js',
        '/sounds/shortcut.mp3',
        '/img/finty-huh.png',
        '/img/tikfinity-logo.png',
        '/img/tikfinity-logo.svg',
        '/img/logo.png',
        '/img/logo.svg',
        '/app/tikfinity_installer.png',
    ];
    for (const asset of knownAssets) {
        await downloadFile(asset);
    }

    // ========== STEP 4: JS bundle - scan for more refs ==========
    console.log('\n[4/7] Scanning JS/CSS files for nested references...');

    function scanFileForRefs(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const refs = new Set();
            // Match paths like /img/xxx.png, /sounds/xxx.mp3, etc.
            for (const m of content.matchAll(/["'`](\/(?:img|css|js|fonts|static|assets|sounds|widget|vue|app|modules)[^"'`\s)]+)["'`]/g)) {
                refs.add(m[1].split('?')[0]);
            }
            // Match relative paths
            for (const m of content.matchAll(/["'`]((?:img|css|js|fonts|assets|sounds|widget)[^"'`\s)]*\.(?:js|css|png|jpg|svg|woff2?|ttf|gif|webp|mp3|mp4|json))["'`]/g)) {
                let p = m[1];
                if (!p.startsWith('/')) p = '/' + p;
                refs.add(p.split('?')[0]);
            }
            return [...refs];
        } catch (e) {
            return [];
        }
    }

    function scanDir(dir) {
        if (!fs.existsSync(dir)) return [];
        const allRefs = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                allRefs.push(...scanDir(fullPath));
            } else if (/\.(js|css|html)$/i.test(entry.name)) {
                allRefs.push(...scanFileForRefs(fullPath));
            }
        }
        return allRefs;
    }

    const nestedRefs = [...new Set(scanDir(DOWNLOAD_DIR))];
    console.log(`  Found ${nestedRefs.length} nested asset refs`);
    for (const ref of nestedRefs) {
        await downloadFile(ref);
    }

    // ========== STEP 5: Widget files ==========
    console.log('\n[5/7] Fetching widget assets...');

    const widgetPages = [
        '/widget/vite/assets/',
    ];

    // Fetch known widget assets from missing_assets.log
    const widgetAssets = [
        '/widget/mediawrapper.js',
        '/widget/winwheel.min.js',
        '/widget/eventcarousel/index.html',
        '/widget/eventcarousel/script.js',
        '/widget/img/gold_crown.svg',
        '/widget/img/wheel_back.png',
        '/widget/img/coin.gif',
        '/widget/img/badges/1-place.png',
        '/widget/img/badges/2-place.png',
        '/widget/img/badges/3-place.png',
        '/widget/sounds/tick.mp3',
        '/widget/sounds/coindrop.mp3',
        '/widget/sounds/collect.mp3',
    ];

    // Firework sounds
    for (let i = 1; i <= 10; i++) {
        widgetAssets.push(`/widget/sounds/firework/rocket_start/${i}.mp3`);
        widgetAssets.push(`/widget/sounds/firework/rocket_boom/${i}.mp3`);
    }

    // Lottie animations
    widgetAssets.push(
        '/assets/lotties/11438-starburst-animation.json',
        '/assets/lotties/gifts/LEVEL_RAIN_archived.json',
        '/assets/lotties/gifts/LIKE_STORM_archived.json',
        '/assets/lotties/gifts/MAKE_IT_RAIN_archived.json',
    );

    for (const asset of widgetAssets) {
        await downloadFile(asset);
    }

    // ========== STEP 6: Vite widget assets ==========
    console.log('\n[6/7] Fetching Vite widget bundles...');

    // Try to discover vite asset hashes by fetching widget pages
    const widgetTypes = [
        'activityFeed', 'chat', 'firework', 'emojify', 'gifts', 'userinfo',
        'commandinfo', 'carousel', 'myactions', 'wheel', 'topgifter',
        'ranking', 'topliker', 'coindrop', 'timer', 'songrequests',
        'viewercount', 'streambuddies', 'coinjar', 'coinmatch',
        'wheelofactions', 'socialmediarotator', 'lastx', 'gcounter',
        'topg', 'tops', 'transactionviewer'
    ];

    for (const wt of widgetTypes) {
        const url = `${ORIGIN}/widget/${wt}?cid=0&preview=1`;
        try {
            const res = await httpsGet(url);
            if (res.status === 200) {
                const html = res.body.toString('utf8');
                const dest = path.join(DOWNLOAD_DIR, 'widget', wt, 'index.html');
                fs.mkdirSync(path.dirname(dest), { recursive: true });
                fs.writeFileSync(dest, res.body);
                console.log(`  [OK] /widget/${wt}/index.html`);

                // Extract vite assets from widget HTML
                for (const m of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
                    let ref = m[1];
                    if (ref.startsWith('data:') || ref.startsWith('http') && !ref.includes('zerody.one')) continue;
                    if (ref.startsWith('http')) ref = new URL(ref).pathname;
                    else if (!ref.startsWith('/')) ref = `/widget/${wt}/${ref}`;
                    await downloadFile(ref);
                }
            }
        } catch (e) {
            console.log(`  [ERR] widget/${wt}: ${e.message}`);
        }
    }

    // Vue dist widgets
    const vueWidgets = ['social-media-rotator'];
    for (const vw of vueWidgets) {
        await downloadFile(`/vue/dist/widgets/${vw}/${vw}.js`);
    }

    // ========== STEP 7: API responses ==========
    console.log('\n[7/7] Fetching API responses...');

    const apiEndpoints = [
        '/api/getAppConfig',
        '/api/getSystemConfig',
        '/api/getTranslations',
        '/api/getAllGifts',
        '/api/getAllGiftsCached',
        '/api/modules',
        '/api/sounds',
        '/api/getGlobalTransactions',
        '/api/getLiveChannels',
        '/api/init',
        '/api/me',
        '/api/getOverlayConfig',
        '/api/getMyInstants',
    ];

    for (const ep of apiEndpoints) {
        const cachePath = path.join(DOWNLOAD_DIR, ep.replace(/^\//, ''));
        // Re-fetch even if exists to get latest
        const fullUrl = `${ORIGIN}${ep}`;
        try {
            const res = await httpsGet(fullUrl);
            if (res.status === 200 && res.body.length > 0) {
                const bodyStr = res.body.toString('utf8');
                try {
                    JSON.parse(bodyStr); // Validate it's JSON
                    fs.mkdirSync(path.dirname(cachePath), { recursive: true });
                    fs.writeFileSync(cachePath, res.body);
                    console.log(`  [OK] ${ep} (${(res.body.length / 1024).toFixed(1)} KB)`);
                } catch (e) {
                    console.log(`  [SKIP] ${ep} -> not valid JSON`);
                }
            } else {
                console.log(`  [SKIP] ${ep} -> HTTP ${res.status}`);
            }
        } catch (e) {
            console.log(`  [ERR] ${ep}: ${e.message}`);
        }
    }

    // ========== STEP 8: Second pass - scan newly downloaded files ==========
    console.log('\n[BONUS] Second pass scan for missed refs...');
    const pass2Refs = [...new Set(scanDir(DOWNLOAD_DIR))];
    let pass2Count = 0;
    for (const ref of pass2Refs) {
        if (!downloaded.has(ref)) {
            await downloadFile(ref);
            pass2Count++;
        }
    }
    console.log(`  Checked ${pass2Count} new refs`);

    // ========== DONE ==========
    console.log(`\n========================================`);
    console.log(`  DONE! Saved ${totalSaved} new files`);
    console.log(`  Total processed: ${downloaded.size}`);
    if (failed.length > 0) {
        console.log(`  Failed: ${failed.length}`);
        fs.writeFileSync(path.join(DOWNLOAD_DIR, '..', 'logs', 'fetch_failed.log'), failed.join('\n'));
        console.log(`  Failed list saved to logs/fetch_failed.log`);
    }
    console.log(`========================================`);
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
