const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const LOG_FILE = 'tikfinity_traffic.json';
const START_FILE = path.join(__dirname, 'start.json');

const data = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));

const classified = {
    API: [],
    Image: [],
    JavaScript: [],
    CSS: [],
    HTML: [],
    Video: [],
    Other: []
};

const seen = new Set();

data.forEach(entry => {
    if (!entry.url) return;
    try {
        const u = new URL(entry.url);
        // Only zerody.one
        if (!u.hostname.includes('zerody.one')) return;

        const p = u.pathname;

        // Deduplicate by pathname + method
        const key = entry.method + ':' + p;
        if (seen.has(key)) return;
        seen.add(key);

        let category = 'Other';
        if (p.startsWith('/api/')) category = 'API';
        else if (p.startsWith('/img/')) category = 'Image';
        else if (p.endsWith('.png') || p.endsWith('.jpg') || p.endsWith('.jpeg') || p.endsWith('.gif') || p.endsWith('.svg') || p.endsWith('.ico') || p.endsWith('.webp')) category = 'Image';
        else if (p.endsWith('.js')) category = 'JavaScript';
        else if (p.endsWith('.css')) category = 'CSS';
        else if (p.endsWith('.html') || p.endsWith('.htm')) category = 'HTML';
        else if (p.endsWith('.mp4') || p.endsWith('.webm') || p.endsWith('.avi')) category = 'Video';

        const localPath = path.join('downloads', p === '/' ? 'index.html' : p);
        const downloaded = fs.existsSync(path.join(__dirname, localPath));

        const item = {
            method: entry.method,
            path: p,
            fullUrl: entry.url,
            status: entry.responseStatus,
            mimeType: entry.mimeType,
            localFile: downloaded ? localPath : null,
            downloaded: downloaded,
            securityHeaders: {}
        };

        // Extract security-related request headers
        if (entry.requestHeaders) {
            const secHeaders = ['X-Authorization-Token', 'X-Channel-ID', 'X-Channel-Signature',
                'X-Trace-Browser-ID', 'X-Trace-Browser-Digest', 'Cookie', 'Authorization'];
            secHeaders.forEach(h => {
                if (entry.requestHeaders[h]) item.securityHeaders[h] = entry.requestHeaders[h];
            });
        }

        // Extract key response headers
        if (entry.responseHeaders) {
            item.serverInfo = {
                server: entry.responseHeaders['server'],
                xServerName: entry.responseHeaders['x-server-name'],
                xAuthMiddleware: entry.responseHeaders['x-auth-middleware'],
                xAuthRequired: entry.responseHeaders['x-auth-required'],
                xGuard: entry.responseHeaders['x-guard'],
                cacheControl: entry.responseHeaders['cache-control']
            };
        }

        // Include POST data if exists
        if (entry.postData) {
            item.postData = entry.postData;
        }

        classified[category].push(item);
    } catch (err) {
        // skip malformed URLs
    }
});

// Remove empty categories
Object.keys(classified).forEach(k => {
    if (classified[k].length === 0) delete classified[k];
});

// Summary
const summary = {
    totalEntries: data.length,
    uniqueEndpoints: seen.size,
    generatedAt: new Date().toLocaleString(),
    categories: {}
};
Object.keys(classified).forEach(k => {
    summary.categories[k] = classified[k].length;
});

const output = { summary, classified };

fs.writeFileSync(START_FILE, JSON.stringify(output, null, 2));
console.log('\n=== start.json Generated ===');
console.log(`Total Entries: ${summary.totalEntries}`);
console.log(`Unique Endpoints: ${summary.uniqueEndpoints}`);
Object.keys(summary.categories).forEach(k => {
    console.log(`  ${k}: ${summary.categories[k]}`);
});
console.log(`\nSaved to: ${START_FILE}`);
