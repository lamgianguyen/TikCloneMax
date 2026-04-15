const fs = require('fs');
const path = require('path');

// Read all unique APIs from both the log and current downloads
const missingLog = fs.readFileSync('missing_assets.log', 'utf8');
const urls = missingLog.split('\n').filter(u => u.includes('/api/'));
let apiPaths = urls.map(u => new URL(u).pathname);

// Add existing ones from downloads/api that might be broken
function getExistingApis(dir) {
    let res = [];
    if (!fs.existsSync(dir)) return res;
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
            res = res.concat(getExistingApis(full));
        } else if (full.includes('\\api\\') || full.includes('/api/')) {
            const p = full.split('downloads')[1].replace(/\\/g, '/');
            res.push(p);
        }
    }
    return res;
}
apiPaths = [...new Set([...apiPaths, ...getExistingApis('downloads/api')])];

apiPaths.forEach(p => {
    const pth = path.join(__dirname, 'downloads', p);
    const dir = path.dirname(pth);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Exclude the ones we carefully crafted
    if (['/api/me', '/api/modules', '/api/getSystemConfig'].includes(p)) return;

    let data = {
        status: 200,
        isPro: true,
        data: { isPro: true },
        value: [],
        items: [],
        results: [],
        subscription: { isPro: true }
    };

    if (p.includes('/rest/')) {
        data = { status: 200, message: 'OK', arrayKey: 'data', data: [], pageSize: 100, page: 1, hasNext: false };
    }
    if (p.includes('/odata/')) {
        data = { value: [], '@odata.count': 0 };
    }

    fs.writeFileSync(pth, JSON.stringify(data, null, 2));
    console.log('Mocked', p);
});
