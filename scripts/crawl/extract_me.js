const fs = require('fs');
try {
    const data = JSON.parse(fs.readFileSync('./tikfinity_traffic.json', 'utf8'));
    const meEntry = data.find(e => e.url.includes('/api/me') && e.responseBody);
    if (meEntry) {
        let bodyStr = meEntry.responseBody;
        if (meEntry.responseBodyIsBase64) {
            bodyStr = Buffer.from(bodyStr, 'base64').toString('utf8');
        }
        console.log(bodyStr.slice(0, 1000));
        fs.writeFileSync('me_sample.json', bodyStr);
        console.log("Saved to me_sample.json");
    } else {
        console.log("Not found /api/me in traffic log");
    }
} catch (e) {
    console.error(e.message);
}
