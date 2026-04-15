const https = require('https');
const fs = require('fs');
const path = require('path');

const LOG_FILE = 'missing_assets.log';
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');

if (!fs.existsSync(LOG_FILE)) {
    console.log('No missing_assets.log found. Nothing to download.');
    process.exit(0);
}

const rawLog = fs.readFileSync(LOG_FILE, 'utf8');
const urls = rawLog.split(/\n|\\n/).map(u => u.trim()).filter(u => u.startsWith('http'));

// Filter for static non-API assets belonging to TikFinity
const assetsToDownload = urls.filter(u => {
    try {
        const parsed = new URL(u);
        return parsed.hostname.includes('zerody.one') && !parsed.pathname.includes('/api/');
    } catch {
        return false;
    }
});

const uniqueUrls = [...new Set(assetsToDownload)];
console.log(`Found ${uniqueUrls.length} unique missing assets to download.`);

async function downloadAsset(urlStr) {
    return new Promise((resolve) => {
        try {
            const url = new URL(urlStr);
            const urlPath = url.pathname === '/' ? '/index.html' : url.pathname;
            const dest = path.join(DOWNLOAD_DIR, urlPath);

            if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
                // console.log(`[SKIP] Already exists: ${urlPath}`);
                return resolve();
            }

            fs.mkdirSync(path.dirname(dest), { recursive: true });

            https.get(urlStr, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
                if (res.statusCode === 200) {
                    const w = fs.createWriteStream(dest);
                    res.pipe(w);
                    w.on('finish', () => {
                        console.log(`[DOWNLOADED] ${urlPath}`);
                        resolve();
                    });
                    w.on('error', (err) => {
                        console.error(`[FS ERROR] ${urlPath}: ${err.message}`);
                        resolve();
                    });
                } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    // Follow Redirect once
                    downloadAsset(new URL(res.headers.location, urlStr).href).then(resolve);
                } else {
                    console.log(`[FAILED] HTTP ${res.statusCode}: ${urlPath}`);
                    resolve();
                }
            }).on('error', (err) => {
                console.error(`[NET ERROR] ${urlPath}: ${err.message}`);
                resolve();
            });
        } catch (err) {
            console.error(`[ERR] Parsing URL ${urlStr}: ${err.message}`);
            resolve();
        }
    });
}

async function start() {
    for (const u of uniqueUrls) {
        await downloadAsset(u);
    }
    console.log('All missing assets downloaded.');
}

start();
