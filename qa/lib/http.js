// qa/lib/http.js — dependency-free HTTP client for the QA harness.
//
// Returns a uniform shape so every module reads results the same way:
//   { ok, status, text, json, ms, error }
// `ok` = 2xx. Network failure / timeout → { ok:false, status:0, error, ms }.

const http = require('http');
const https = require('https');
const { URL } = require('url');

function request(method, base, p, body, timeoutMs) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    let u;
    try {
      u = new URL(p, base);
    } catch (_) {
      return resolve({ ok: false, status: 0, error: `bad url: ${p}`, ms: 0 });
    }
    const lib = u.protocol === 'https:' ? https : http;
    const data = body != null ? Buffer.from(JSON.stringify(body)) : null;
    const headers = data
      ? { 'content-type': 'application/json', 'content-length': data.length }
      : {};
    const req = lib.request(
      u,
      { method, headers, timeout: timeoutMs || 10000 },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const ms = Date.now() - t0;
          const text = Buffer.concat(chunks).toString('utf8');
          let json = null;
          try {
            json = JSON.parse(text);
          } catch (_) {
            /* not JSON — leave null */
          }
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            text,
            json,
            ms,
          });
        });
      }
    );
    req.on('error', (e) => resolve({ ok: false, status: 0, error: e.message, ms: Date.now() - t0 }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, status: 0, error: 'timeout', ms: Date.now() - t0 });
    });
    if (data) req.write(data);
    req.end();
  });
}

// Factory: const http = require('./lib/http')(BASE_URL); http.get('/api/health')
module.exports = (base) => ({
  base,
  get: (p, ms) => request('GET', base, p, null, ms),
  post: (p, body, ms) => request('POST', base, p, body, ms),
  put: (p, body, ms) => request('PUT', base, p, body, ms),
  del: (p, ms) => request('DELETE', base, p, null, ms),
  // Quick liveness probe — does NOT throw. Returns true if backend answers.
  async up() {
    const r = await request('GET', base, '/api/tiktok/status', null, 4000);
    return r.status > 0;
  },
});
