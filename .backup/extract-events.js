// Pull all string literals from the bundle that look like socket event names.
// Bundle is heavily minified so we cast a wide net and filter by relevance.
const fs = require('fs');
const path = require('path');

const targets = [
    'c:/Users/nguyenlg/Documents/TikMax/TikCloneMax/downloads/combo/app.js',
    'c:/Users/nguyenlg/Documents/TikMax/TikCloneMax/downloads/combo/modules.js'
];

// Known TikTok-live event names + connection-status keywords we expect.
const KEYWORDS = [
    'chat', 'gift', 'like', 'share', 'member', 'follow', 'subscribe',
    'roomUser', 'connected', 'disconnected', 'streamEnd', 'connectFailed',
    'connecting', 'channelStatus', 'tiktok', 'live', 'webcast', 'envelope',
    'questionNew', 'emote', 'liveIntro', 'rankingUpdate', 'topGifters',
    'channel', 'status', 'authStateChanged', 'currentChannel', 'isLive',
    'streamLive', 'liveStatus'
];

for (const file of targets) {
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, 'utf8');
    console.log(`\n=== ${path.basename(file)} (${src.length} bytes) ===`);

    const re = /["'`]([a-zA-Z][a-zA-Z0-9_:.\-]{2,40})["'`]/g;
    const counts = new Map();
    let m;
    while ((m = re.exec(src))) {
        const s = m[1];
        if (counts.has(s)) counts.set(s, counts.get(s) + 1);
        else counts.set(s, 1);
    }

    const matched = [...counts.entries()].filter(([s]) => {
        const lower = s.toLowerCase();
        return KEYWORDS.some(k => lower.includes(k.toLowerCase()));
    }).sort((a, b) => b[1] - a[1]);

    console.log(`  ${matched.length} strings match keywords:`);
    for (const [s, n] of matched.slice(0, 80)) console.log(`    ${s.padEnd(40)} x${n}`);
}
