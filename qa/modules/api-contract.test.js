// qa/modules/api-contract.test.js — L1 backend HTTP API contract verification.
//
// Ground truth: backend-node/src/routes/*.js (OUR backend defines these shapes).
// This module executes the declarative specs in qa/registry.js (`api`, plus the
// opt-in `mutating` list when ctx.mutating is true) and a small internal
// EXTRA_ENDPOINTS list of additional SAFE read-only GETs confirmed to exist
// (verified against docs/COMPLETE_ENDPOINT_INDEX.md, docs/API_CONTRACTS.md, and
// the route files). The registry stays the diff-able core; EXTRA covers breadth
// without bloating the source-of-truth.
//
// Per spec, PASS requires BOTH:
//   1. res.status matches expect.status (a number OR an array of acceptable codes)
//   2. every dot-path in expect.jsonHas (if present) EXISTS in res.json
//      (value !== undefined — getPath() resolves nested keys).
//
// Failure modes are graceful: a per-endpoint try/catch turns any thrown error
// into ONE FAIL row and keeps going; res.status === 0 (network down) → SKIP.
// run() never throws.

const AREA = 'L1 API';

// ── EXTRA_ENDPOINTS — additional SAFE read-only GETs ─────────────────────────
// Every entry below is a GET handler verified in backend-node/src/routes/*.js
// with a STABLE response shape (mount prefixes from backend-node/src/index.js):
//   /api/goals            goals.js     router.get('/')        → {status, message, goals:[]}
//   /api/commands         commands.js  router.get('/')        → {status, message, commands:[]}
//   /api/rest/action      actions.js   router.get('/action')  → {status, actions:[], arrayKey}
//   /api/points/leaderboard points.js  router.get('/leaderboard') → {status, total, leaderboard:[]}
//   /api/sounds           sounds.js    router.get('/sounds')  → {status, sounds:[], data:[]}
//   /api/notifications/list notifications.js router.all('/list') → {status, message, notifications:[]}
//   /api/notifications/count notifications.js router.all('/count') → {status, count, unread}
//   /api/getSystemConfig  config.js    router.all(...)        → {status, config, isPro, modules}
//   /api/getAppConfig     config.js    router.all(...)        → {settings, channelId, version}
//   /api/odata/transaction data.js     router.get(...)        → {value:[]}
//   /api/odata/channeluser data.js     router.get(...)        → {value:[], '@odata.count'}
//   /api/getAllAnimations data.js      router.all(...)        → bundle fixture (array)
// All are non-destructive reads. channelId resolves to the default channel when
// no auth (findDefault → cid=1), so these return 2xx even on a fresh DB.
const EXTRA_ENDPOINTS = [
  { id: 'api.goals', method: 'GET', path: '/api/goals',
    expect: { status: 200, jsonHas: ['goals'] }, severity: 'MEDIUM' },
  { id: 'api.commands', method: 'GET', path: '/api/commands',
    expect: { status: 200, jsonHas: ['commands'] }, severity: 'MEDIUM' },
  { id: 'api.actions', method: 'GET', path: '/api/rest/action',
    expect: { status: 200, jsonHas: ['actions'] }, severity: 'MEDIUM' },
  { id: 'api.points.leaderboard', method: 'GET', path: '/api/points/leaderboard',
    expect: { status: 200, jsonHas: ['leaderboard'] }, severity: 'LOW' },
  { id: 'api.sounds', method: 'GET', path: '/api/sounds',
    expect: { status: 200, jsonHas: ['sounds'] }, severity: 'MEDIUM' },
  { id: 'api.notifications.list', method: 'GET', path: '/api/notifications/list',
    expect: { status: 200, jsonHas: ['notifications'] }, severity: 'LOW' },
  { id: 'api.notifications.count', method: 'GET', path: '/api/notifications/count',
    expect: { status: 200, jsonHas: ['count'] }, severity: 'LOW' },
  { id: 'api.config.system', method: 'GET', path: '/api/getSystemConfig',
    expect: { status: 200, jsonHas: ['isPro', 'config'] }, severity: 'MEDIUM' },
  { id: 'api.config.app', method: 'GET', path: '/api/getAppConfig',
    expect: { status: 200, jsonHas: ['channelId'] }, severity: 'LOW' },
  { id: 'api.odata.transaction', method: 'GET', path: '/api/odata/transaction',
    expect: { status: 200, jsonHas: ['value'] }, severity: 'LOW' },
  { id: 'api.odata.channeluser', method: 'GET', path: '/api/odata/channeluser',
    expect: { status: 200, jsonHas: ['value'] }, severity: 'LOW' },
  { id: 'api.animations.all', method: 'GET', path: '/api/getAllAnimations',
    expect: { status: 200 }, severity: 'LOW' },
];

/** Build a uniform result row (mirrors socket-relay.test.js::row). */
function row(id, name, status, evidence, severity, gate, fixHint) {
  return { id, area: AREA, name, status, evidence, severity, gate, fixHint };
}

/**
 * Resolve a dot-path against an object: getPath({a:{b:{c:1}}}, 'a.b.c') === 1.
 * Returns undefined if any segment is missing or the root is not an object.
 * Tolerates literal dotted keys at the top level (e.g. '@odata.count') by also
 * checking the whole path as a single key first.
 */
function getPath(obj, dotPath) {
  if (obj == null || typeof obj !== 'object') return undefined;
  if (Object.prototype.hasOwnProperty.call(obj, dotPath)) return obj[dotPath];
  const parts = String(dotPath).split('.');
  let cur = obj;
  for (const part of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[part];
  }
  return cur;
}

/** True if `status` matches `expect` (a number OR an array of acceptable codes). */
function statusMatches(status, expect) {
  if (Array.isArray(expect)) return expect.includes(status);
  return status === expect;
}

/** Human-readable form of the expected status for evidence strings. */
function expectStr(expect) {
  return Array.isArray(expect) ? expect.join('|') : String(expect);
}

/**
 * Merge registry specs with EXTRA_ENDPOINTS, de-duped by `path` (registry wins —
 * it is the curated source of truth, so its severity/gate/jsonHas take priority).
 */
function buildSpecList(registry, includeMutating) {
  const apiSpecs = registry && Array.isArray(registry.api) ? registry.api : [];
  const mutSpecs = includeMutating && registry && Array.isArray(registry.mutating)
    ? registry.mutating
    : [];
  const merged = [];
  const seenPaths = new Set();
  for (const spec of [...apiSpecs, ...mutSpecs, ...EXTRA_ENDPOINTS]) {
    if (!spec || typeof spec.path !== 'string') continue;
    if (seenPaths.has(spec.path)) continue;
    seenPaths.add(spec.path);
    merged.push(spec);
  }
  return merged;
}

/**
 * Execute one spec against the HTTP client. Returns { rows, ms } where rows is
 * an array of result objects (1 normally, +1 LOW perf row when very slow).
 * Never throws — a thrown call becomes a single FAIL row.
 */
async function runSpec(ctx, spec) {
  const { http, config } = ctx;
  const httpBudgetMs = (config.THRESHOLDS && config.THRESHOLDS.httpMs) || 1500;
  const method = String(spec.method || 'GET').toLowerCase();
  const expectStatus = (spec.expect && spec.expect.status !== undefined)
    ? spec.expect.status
    : 200;
  const jsonHas = (spec.expect && Array.isArray(spec.expect.jsonHas))
    ? spec.expect.jsonHas
    : [];
  const label = `${String(spec.method || 'GET').toUpperCase()} ${spec.path}`;

  let res;
  try {
    const fn = http[method];
    if (typeof fn !== 'function') {
      return {
        rows: [row(spec.id, label, 'FAIL',
          `unsupported method '${spec.method}'`, spec.severity || 'MEDIUM', spec.gate)],
        ms: 0,
      };
    }
    // post/put take a body; get/del do not. The http client tolerates extra args.
    res = (method === 'post' || method === 'put')
      ? await fn(spec.path, spec.body)
      : await fn(spec.path);
  } catch (err) {
    return {
      rows: [row(spec.id, label, 'FAIL',
        `request threw: ${err && err.message ? err.message : String(err)}`,
        spec.severity || 'MEDIUM', spec.gate)],
      ms: 0,
    };
  }

  const ms = typeof res.ms === 'number' ? res.ms : 0;

  // ── Network down / unreachable → SKIP (backend likely not running). ─────────
  if (res.status === 0) {
    return {
      rows: [row(spec.id, label, 'SKIP',
        `unreachable: ${res.error || 'no response'}`, spec.severity || 'MEDIUM', spec.gate)],
      ms: 0,
    };
  }

  // ── Status check ────────────────────────────────────────────────────────────
  if (!statusMatches(res.status, expectStatus)) {
    return {
      rows: [row(spec.id, label, 'FAIL',
        `${label} → ${res.status} (expected ${expectStr(expectStatus)})`,
        spec.severity || 'MEDIUM', spec.gate,
        `Check the handler in backend-node/src/routes for ${spec.path} — wrong status or unmounted route.`)],
      ms,
    };
  }

  // ── JSON field presence check ───────────────────────────────────────────────
  if (jsonHas.length > 0) {
    const missing = jsonHas.filter((p) => getPath(res.json, p) === undefined);
    if (missing.length > 0) {
      const detail = res.json == null
        ? 'response body was not JSON'
        : `missing field${missing.length > 1 ? 's' : ''} ${missing.join(', ')}`;
      return {
        rows: [row(spec.id, label, 'FAIL',
          `${label} → ${res.status} but ${detail}`,
          spec.severity || 'MEDIUM', spec.gate,
          `Ensure the handler for ${spec.path} returns ${missing.join(', ')} in its JSON body.`)],
        ms,
      };
    }
  }

  // ── PASS (note ms when over budget; add a separate LOW perf FAIL if >2x). ────
  const slow = ms > httpBudgetMs;
  const evidence = slow
    ? `${label} → ${res.status} ok (slow ${ms}ms > budget ${httpBudgetMs}ms)`
    : `${label} → ${res.status} ok (${ms}ms)`;
  const rows = [row(spec.id, label, 'PASS', evidence, spec.severity || 'MEDIUM', spec.gate)];

  if (ms > httpBudgetMs * 2) {
    rows.push(row(`${spec.id}.perf`, `${label} perf`, 'FAIL',
      `slow ${ms}ms (>2x budget ${httpBudgetMs}ms)`, 'LOW', spec.gate,
      `Profile the handler for ${spec.path}; ${ms}ms is over double the ${httpBudgetMs}ms budget.`));
  }

  return { rows, ms };
}

module.exports = {
  name: 'api-contract',
  area: AREA,
  needsBackend: true,

  async run(ctx) {
    const { registry, mutating } = ctx;
    const results = [];
    const timings = []; // { path, ms } for endpoints that actually responded

    const specs = buildSpecList(registry, mutating === true);

    // Sequential: keeps backend load light + makes timings comparable. A thrown
    // spec is already swallowed inside runSpec, so the loop can never break out.
    for (const spec of specs) {
      // eslint-disable-next-line no-await-in-loop
      const { rows, ms } = await runSpec(ctx, spec);
      for (const r of rows) results.push(r);
      // Only count timings for specs that produced a real PASS/FAIL (not SKIP).
      const headStatus = rows[0] && rows[0].status;
      if ((headStatus === 'PASS' || headStatus === 'FAIL') && ms > 0) {
        timings.push({ path: spec.path, ms });
      }
    }

    // ── Metrics ───────────────────────────────────────────────────────────────
    const slowest = [...timings].sort((a, b) => b.ms - a.ms).slice(0, 3);
    const avgMs = timings.length > 0
      ? Math.round(timings.reduce((acc, t) => acc + t.ms, 0) / timings.length)
      : null;

    return {
      results,
      metrics: {
        endpointsTested: specs.length,
        slowest,
        avgMs,
      },
    };
  },
};
