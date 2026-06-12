// qa/lib/http.js — dependency-free HTTP client for the QA harness.
//
// Returns a uniform shape so every module reads results the same way:
//   { ok, status, text, json, ms, error }
// `ok` = 2xx. Network failure / timeout → { ok:false, status:0, error, ms }.

const http = require('http');
const https = require('https');
const { URL } = require('url');

const MAX_REDIRECTS = 3;

// One round-trip. Resolves the raw response (status/headers/text/json) WITHOUT
// the ok flag — the redirect loop in request() decides whether to follow.
function requestOnce(method, urlObj, data, headers, timeoutMs) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const lib = urlObj.protocol === 'https:' ? https : http;
    const req = lib.request(
      urlObj,
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
          resolve({ status: res.statusCode, headers: res.headers, text, json, ms });
        });
      }
    );
    req.on('error', (e) => resolve({ status: 0, error: e.message, ms: Date.now() - t0 }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, error: 'timeout', ms: Date.now() - t0 });
    });
    if (data) req.write(data);
    req.end();
  });
}

// Follows same-origin redirects (the dir-served widgets answer 301/302 → real
// index.html — browsers/OBS follow these, so the harness must too or it FAILs a
// healthy widget on the redirect body's tiny byte count).
async function request(method, base, p, body, timeoutMs) {
  const t0 = Date.now();
  let u;
  try {
    u = new URL(p, base);
  } catch (_) {
    return { ok: false, status: 0, error: `bad url: ${p}`, ms: 0 };
  }
  let curMethod = method;
  let data = body != null ? Buffer.from(JSON.stringify(body)) : null;
  for (let hop = 0; ; hop += 1) {
    const headers = data
      ? { 'content-type': 'application/json', 'content-length': data.length }
      : {};
    const r = await requestOnce(curMethod, u, data, headers, timeoutMs);
    if (r.status === 0) {
      return { ok: false, status: 0, error: r.error, ms: Date.now() - t0 };
    }
    const isRedirect = r.status === 301 || r.status === 302 || r.status === 303
      || r.status === 307 || r.status === 308;
    const loc = r.headers && r.headers.location;
    if (isRedirect && loc && hop < MAX_REDIRECTS) {
      let next = null;
      try { next = new URL(loc, u); } catch (_) { next = null; }
      // Only follow within the same origin (loopback widget serving). Cross-origin
      // redirects are treated as the terminal response.
      if (next && next.origin === u.origin) {
        u = next;
        // 303 always → GET; 301/302 coerce non-GET to GET (browser behaviour);
        // 307/308 preserve method + body.
        if (r.status === 303
          || ((r.status === 301 || r.status === 302) && curMethod !== 'GET' && curMethod !== 'HEAD')) {
          curMethod = 'GET';
          data = null;
        }
        continue;
      }
    }
    return {
      ok: r.status >= 200 && r.status < 300,
      status: r.status,
      text: r.text,
      json: r.json,
      ms: Date.now() - t0,
    };
  }
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
