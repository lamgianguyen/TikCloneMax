// Tikfinity Pro import CLI.
//
// Capture the three auth headers from a logged-in tikfinity.zerody.one tab
// (DevTools → Network → /api/me → Headers), drop them in CREDS below, then:
//
//   node electron/import-tikfinity.js test       # probe creds, no DB write
//   node electron/import-tikfinity.js import     # full import for profile 1
//   node electron/import-tikfinity.js import 1 2 3   # Pro: multiple profiles
//
// JWTs expire after ~1 hour, so paste fresh values each run.

const http = require('http');

const CREDS = {
  token: process.env.TF_TOKEN || '',
  channelId: parseInt(process.env.TF_CHANNEL_ID || '0', 10),
  signature: process.env.TF_SIGNATURE || ''
};

const CLONE_HOST = '127.0.0.1';
const CLONE_PORT = 5285;

function callClone(path, body) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(body));
    const req = http.request({
      host: CLONE_HOST, port: CLONE_PORT, path, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
    }, (res) => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(buf) }); }
        catch { resolve({ status: res.statusCode, raw: buf }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function assertCreds() {
  if (!CREDS.token || !CREDS.channelId || !CREDS.signature) {
    console.error('Missing creds. Set TF_TOKEN / TF_CHANNEL_ID / TF_SIGNATURE env vars.');
    console.error('Example (PowerShell):');
    console.error('  $env:TF_TOKEN="eyJhbG..."; $env:TF_CHANNEL_ID="3048148"; $env:TF_SIGNATURE="jmVkwDvK0u"');
    console.error('  node electron/import-tikfinity.js test');
    process.exit(1);
  }
}

(async () => {
  const cmd = process.argv[2] || 'test';
  assertCreds();

  if (cmd === 'test') {
    const r = await callClone('/api/import/tikfinity/test', CREDS);
    console.log('Status:', r.status);
    console.log(JSON.stringify(r.json || r.raw, null, 2));
    process.exit(r.status === 200 ? 0 : 1);
  }

  if (cmd === 'import') {
    const profileIds = process.argv.slice(3).map(n => parseInt(n, 10)).filter(n => n > 0);
    const body = { ...CREDS, profileIds: profileIds.length ? profileIds : [1] };
    console.log('Importing profileIds:', body.profileIds.join(','), '...');
    const r = await callClone('/api/import/tikfinity', body);
    console.log('Status:', r.status);
    console.log(JSON.stringify(r.json || r.raw, null, 2));
    process.exit(r.status === 200 ? 0 : 1);
  }

  console.error('Unknown command:', cmd);
  console.error('Use: test | import [profileIds...]');
  process.exit(1);
})();
