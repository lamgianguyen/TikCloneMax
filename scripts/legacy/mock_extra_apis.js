const fs = require('fs');
const path = require('path');

const NEW_APIS = [
    { path: 'api/notifications', data: [] },
    { path: 'api/usage', data: { status: 200, history: [] } },
    { path: 'api/init', data: { status: 200, ready: true } },
    { path: 'api/getLiveChannels', data: [] },
    { path: 'api/getGlobalTransactions', data: [] },
    { path: 'api/pro', data: { status: 200, users: [] } },
    { path: 'api/logError', data: { status: 200 } },
    { path: 'api/odata', data: { value: [] } },
    { path: 'api/updateSettings', data: { status: 200 } }
];

NEW_APIS.forEach(api => {
    const p = path.join(__dirname, 'downloads', api.path);
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(p, JSON.stringify(api.data, null, 2));
    console.log('Generated mock for:', api.path);
});
