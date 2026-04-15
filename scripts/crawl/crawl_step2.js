const https = require('https');
const fs = require('fs');
const path = require('path');

const ORIGIN = 'https://tikfinity.zerody.one';
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
let count = 0;

function httpsGet(urlStr) {
    return new Promise((resolve, reject) => {
        const doReq = (url, retries) => {
            https.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': '*/*'
                }
            }, (res) => {
                if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && retries > 0) {
                    const redir = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
                    res.resume();
                    return doReq(redir, retries - 1);
                }
                const chunks = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), headers: res.headers }));
                res.on('error', reject);
            }).on('error', reject);
        };
        doReq(urlStr, 3);
    });
}

async function download(urlPath) {
    const dest = path.join(DOWNLOAD_DIR, urlPath);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
        return; // already have it
    }
    try {
        const res = await httpsGet(`${ORIGIN}${urlPath}`);
        if (res.status === 200 && res.body.length > 0) {
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.writeFileSync(dest, res.body);
            count++;
            console.log(`[${count}] ${urlPath} (${(res.body.length / 1024).toFixed(1)} KB)`);
            return res.body.toString('utf8');
        } else {
            console.log(`[SKIP] ${urlPath} -> HTTP ${res.status}`);
        }
    } catch (e) {
        console.log(`[ERR] ${urlPath}: ${e.message}`);
    }
}

async function main() {
    console.log('=== Step 2: Download core JS/CSS files ===\n');

    // Critical files from init.js
    const coreFiles = [
        // JS core
        '/js/init.js',
        '/js/guard/obf/trc.js',
        '/js/lib-bundle.min.js',
        '/js/audiofix.js',
        '/combo/app.js',

        // CSS core
        '/combo/modules.css',
        '/combo/ui.css',
        '/css/main.min.css',
        '/css/app.css',
        '/css/text-effects.css',
        '/dx/css/dxdark.css',
        '/dx/js/dxde.js',

        // Font Awesome
        '/fa/css/all.min.css',
        '/fa/webfonts/fa-solid-900.woff2',
        '/fa/webfonts/fa-regular-400.woff2',
        '/fa/webfonts/fa-brands-400.woff2',
        '/fa/webfonts/fa-solid-900.ttf',
        '/fa/webfonts/fa-regular-400.ttf',
        '/fa/webfonts/fa-brands-400.ttf',
    ];

    console.log('--- Core files ---');
    for (const f of coreFiles) {
        await download(f);
    }

    // Now read combo/app.js and combo/modules.css to find module paths
    console.log('\n--- Scanning combo/app.js for module references ---');
    const appJsPath = path.join(DOWNLOAD_DIR, 'combo/app.js');
    if (fs.existsSync(appJsPath)) {
        const appJs = fs.readFileSync(appJsPath, 'utf8');
        console.log(`  combo/app.js size: ${(appJs.length / 1024).toFixed(0)} KB`);

        // Find all referenced paths
        const pathRefs = new Set();
        const patterns = [
            /["'](\/[a-zA-Z0-9_\-/.]+\.(?:js|css|html|png|svg|jpg|woff2?|ttf|gif|webp|mp3|json))["']/g,
            /["']((?:app|combo|js|css|img|static|vue|sounds|fonts)\/[a-zA-Z0-9_\-/.]+)["']/g,
        ];

        for (const pat of patterns) {
            let m;
            while ((m = pat.exec(appJs)) !== null) {
                let p = m[1];
                if (!p.startsWith('/')) p = '/' + p;
                if (!p.includes('..') && p.length < 200) {
                    pathRefs.add(p);
                }
            }
        }

        console.log(`  Found ${pathRefs.size} asset references in combo/app.js`);
        for (const p of pathRefs) {
            await download(p);
        }
    } else {
        console.log('  combo/app.js not found!');
    }

    // Scan lib-bundle for additional refs
    console.log('\n--- Scanning lib-bundle.min.js ---');
    const libPath = path.join(DOWNLOAD_DIR, 'js/lib-bundle.min.js');
    if (fs.existsSync(libPath)) {
        const libJs = fs.readFileSync(libPath, 'utf8');
        console.log(`  lib-bundle.min.js size: ${(libJs.length / 1024).toFixed(0)} KB`);
    }

    // Scan CSS files for font/image refs
    console.log('\n--- Scanning CSS for url() references ---');
    const cssFiles = [
        '/combo/modules.css', '/combo/ui.css',
        '/css/main.min.css', '/css/app.css',
        '/dx/css/dxdark.css'
    ];

    for (const cssFile of cssFiles) {
        const cssPath = path.join(DOWNLOAD_DIR, cssFile);
        if (!fs.existsSync(cssPath)) continue;
        const css = fs.readFileSync(cssPath, 'utf8');
        const urlRefs = css.matchAll(/url\(["']?([^"')]+)["']?\)/g);
        for (const ref of urlRefs) {
            let u = ref[1];
            if (u.startsWith('data:') || u.startsWith('http') || u.startsWith('#')) continue;
            // Resolve relative path
            if (!u.startsWith('/')) {
                const dir = path.dirname(cssFile).replace(/\\/g, '/');
                u = dir + '/' + u;
            }
            u = u.replace(/[?#].*$/, ''); // remove query/hash
            await download(u);
        }
    }

    console.log(`\n=== Step 2 Done! Downloaded ${count} new files ===`);
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
