const fs = require('fs');
try {
    const data = JSON.parse(fs.readFileSync('./tikfinity_traffic.json', 'utf8'));
    const entries = data.filter(e => e.url.includes('/api/rest/action') && e.responseBody);
    if (entries.length > 0) {
        let bodyStr = entries[0].responseBody;
        if (entries[0].responseBodyIsBase64) {
            bodyStr = Buffer.from(bodyStr, 'base64').toString('utf8');
        }
        console.log(bodyStr.slice(0, 500));
        fs.writeFileSync('rest_sample.json', bodyStr);
        console.log("Saved to rest_sample.json");
    } else {
        console.log("Not found /api/rest/action in traffic log");
    }
} catch (e) {
    console.error(e.message);
}
