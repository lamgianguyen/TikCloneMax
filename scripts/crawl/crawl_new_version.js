const https = require('https');
const fs = require('fs');
const path = require('path');

const ORIGIN = 'https://tikfinity.zerody.one';
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
const BACKUP_DIR = path.join(__dirname, 'downloads_backup_' + Date.now());

// ====== HELPERS ======

function httpsGet(urlStr, followRedirects = 3) {
    return new Promise((resolve, reject) => {
        const doRequest = (url, remaining) => {
            https.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
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
                res.on('end', () => resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: Buffer.concat(chunks)
                }));
                res.on('error', reject);
            }).on('error', reject);
        };
        doRequest(urlStr, followRedirects);
    });
}

function saveToDisk(urlPath, buffer) {
    const dest = path.join(DOWNLOAD_DIR, urlPath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buffer);
    console.log(`  [SAVED] ${urlPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

async function downloadAndSave(urlStr) {
    try {
        const parsed = new URL(urlStr);
        const urlPath = parsed.pathname === '/' ? '/index.html' : parsed.pathname;
        const dest = path.join(DOWNLOAD_DIR, urlPath);

        // Skip if already downloaded in this session
        if (downloadedPaths.has(urlPath)) return;

        const res = await httpsGet(urlStr);
        if (res.status !== 200) {
            console.log(`  [SKIP] ${urlPath} -> HTTP ${res.status}`);
            return;
        }

        saveToDisk(urlPath, res.body);
        downloadedPaths.add(urlPath);
        return res.body.toString('utf8');
    } catch (err) {
        console.log(`  [ERROR] ${urlStr}: ${err.message}`);
    }
}

const downloadedPaths = new Set();

// ====== MAIN ======

async function main() {
    console.log('=== TikFinity New Version Crawler ===\n');

    // Step 1: Backup old index.html
    const oldIndex = path.join(DOWNLOAD_DIR, 'index.html');
    if (fs.existsSync(oldIndex)) {
        const backupPath = path.join(DOWNLOAD_DIR, 'index_old_backup.html');
        fs.copyFileSync(oldIndex, backupPath);
        console.log('[BACKUP] index.html -> index_old_backup.html\n');
    }

    // Step 2: Download new index.html
    console.log('[1/5] Downloading index.html...');
    const indexRes = await httpsGet(ORIGIN);
    if (indexRes.status !== 200) {
        console.error(`Failed to fetch index.html: HTTP ${indexRes.status}`);
        process.exit(1);
    }
    const indexHtml = indexRes.body.toString('utf8');
    saveToDisk('/index.html', indexRes.body);
    downloadedPaths.add('/index.html');

    // Extract version
    const versionMatch = indexHtml.match(/appVersion['":\s]+"?([^"',\s]+)/);
    console.log(`  Version found: ${versionMatch ? versionMatch[1] : 'unknown'}\n`);

    // Step 3: Extract and download all referenced assets from index.html
    console.log('[2/5] Extracting and downloading assets from index.html...');
    const assetUrls = new Set();

    // Find script src
    const scriptMatches = indexHtml.matchAll(/src=["']([^"']+)["']/g);
    for (const m of scriptMatches) assetUrls.add(m[1]);

    // Find link href (css, icons, fonts)
    const linkMatches = indexHtml.matchAll(/href=["']([^"']+)["']/g);
    for (const m of linkMatches) assetUrls.add(m[1]);

    // Find url() in inline styles
    const urlMatches = indexHtml.matchAll(/url\(["']?([^"')]+)["']?\)/g);
    for (const m of urlMatches) assetUrls.add(m[1]);

    // Filter to local/zerody assets only
    const localAssets = [...assetUrls].filter(u => {
        if (u.startsWith('data:') || u.startsWith('blob:') || u.startsWith('#')) return false;
        if (u.startsWith('http') && !u.includes('zerody.one')) return false;
        return true;
    });

    console.log(`  Found ${localAssets.length} asset references`);

    for (const asset of localAssets) {
        const fullUrl = asset.startsWith('http') ? asset : `${ORIGIN}${asset.startsWith('/') ? '' : '/'}${asset}`;
        await downloadAndSave(fullUrl);
    }

    // Step 4: Extract module info from tfPageloadData and download module files
    console.log('\n[3/5] Extracting and downloading module files...');

    // Parse module definitions from the pageload data
    const moduleRegex = /\{id:"([^"]+)"[^}]*hasHtml:(!0|true)[^}]*hasJs:(!0|true)[^}]*hasCss:(!0|true)/g;
    const modules = [];
    let match;
    while ((match = moduleRegex.exec(indexHtml)) !== null) {
        modules.push(match[1]);
    }

    // Also try alternate pattern
    const moduleRegex2 = /id:"([^"]+)"/g;
    const allIds = [];
    while ((match = moduleRegex2.exec(indexHtml)) !== null) {
        allIds.push(match[1]);
    }

    // Known TikFinity modules
    const knownModules = [
        'start', 'setup', 'chatbot', 'chatcommands', 'tts',
        'actionsandevents', 'sounds', 'goals', 'overlays',
        'songrequests', 'points', 'livechannels', 'about',
        'faq', 'contact', 'promotions', 'challenges', 'likeathon',
        'timers', 'luckywheel', 'pointsreduction', 'tools',
        'api', 'minigames', 'leaderboard', 'polls'
    ];

    const allModules = [...new Set([...modules, ...knownModules])];
    console.log(`  Found/known modules: ${allModules.join(', ')}`);

    // Try common module paths
    const modulePaths = ['/app/modules/', '/modules/', '/static/modules/', '/vue/modules/', '/app/'];

    for (const mod of allModules) {
        for (const basePath of modulePaths) {
            for (const ext of ['html', 'js', 'css']) {
                const urlPath = `${basePath}${mod}.${ext}`;
                const fullUrl = `${ORIGIN}${urlPath}`;
                try {
                    const res = await httpsGet(fullUrl);
                    if (res.status === 200 && res.body.length > 0) {
                        saveToDisk(urlPath, res.body);
                        downloadedPaths.add(urlPath);

                        // If it's HTML or JS, scan for more asset references
                        if (ext !== 'css' || true) {
                            const content = res.body.toString('utf8');
                            const innerUrls = content.matchAll(/(?:src|href|url\()=?["']?([^"'\s)]+\.(?:js|css|png|jpg|svg|woff2?|ttf|gif|webp|mp3))/gi);
                            for (const iu of innerUrls) {
                                const innerUrl = iu[1].startsWith('http') ? iu[1] : `${ORIGIN}${iu[1].startsWith('/') ? '' : '/'}${iu[1]}`;
                                if (innerUrl.includes('zerody.one') || !iu[1].startsWith('http')) {
                                    await downloadAndSave(innerUrl);
                                }
                            }
                        }
                    }
                } catch (e) { /* skip */ }
            }
        }
    }

    // Step 5: Download common static directories
    console.log('\n[4/5] Downloading common static assets...');

    const commonPaths = [
        '/favicon.ico',
        '/css/app.css',
        '/css/main.css',
        '/js/app.js',
        '/js/main.js',
        '/js/vendor.js',
        '/js/chunk-vendors.js',
        '/img/logo.png',
        '/img/logo.svg',
    ];

    for (const p of commonPaths) {
        await downloadAndSave(`${ORIGIN}${p}`);
    }

    // Step 6: Scan JS files for additional asset URLs
    console.log('\n[5/5] Scanning downloaded JS/CSS for additional references...');

    function scanDir(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                scanDir(fullPath);
            } else if (/\.(js|css|html)$/i.test(entry.name)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const refs = content.matchAll(/["'](\/?(?:img|css|js|fonts|static|assets|sounds|vue|app)\/[^"'\s)]+)["']/g);
                    for (const ref of refs) {
                        const refPath = ref[1].startsWith('/') ? ref[1] : `/${ref[1]}`;
                        if (!downloadedPaths.has(refPath) && !refPath.includes('..')) {
                            // Don't re-download, just note it
                        }
                    }
                } catch (e) { /* binary file, skip */ }
            }
        }
    }
    scanDir(DOWNLOAD_DIR);

    console.log(`\n=== Done! Downloaded ${downloadedPaths.size} files ===`);
    console.log('Start server with: node start_server.js');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
