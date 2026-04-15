const https = require('https');
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://tikfinity.zerody.one';
const DIR = './downloads';

const missingFiles = [
    '/dx/css/icons/dxicons.woff2',
    '/dx/css/icons/dxicons.woff',
    '/dx/css/icons/dxicons.ttf',
    '/js/guard/obf/trc.js',
    '/api/getChannelUserCount?channelId=2228412'
];

missingFiles.forEach(file => {
    const url = new URL(DOMAIN + file);
    const uPath = url.pathname;
    const dest = path.join(DIR, uPath);

    fs.mkdirSync(path.dirname(dest), { recursive: true });

    https.get(url.href, res => {
        if (res.statusCode === 200) {
            const w = fs.createWriteStream(dest);
            res.pipe(w);
            w.on('finish', () => console.log('Downloaded', uPath));
        } else {
            console.log('Failed', uPath, res.statusCode);
        }
    });
});
