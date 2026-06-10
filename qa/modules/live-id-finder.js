// qa/modules/live-id-finder.js — discover a LIVE TikTok account + its roomId so
// real-event tests can run when the user happens to be streaming. This is a
// BEST-EFFORT discovery module: being offline / rate-limited is the normal case,
// so it SKIPs (never FAILs) when no live room is found. Only a genuine harness
// bug (e.g. our own code throwing unexpectedly) would surface as a FAIL via the
// orchestrator's module-crash guard.
//
// ── Liveness signal ──────────────────────────────────────────────────────────
//   A live account has a fetchable roomId; an offline account fails with
//   "Failed to retrieve Room ID from all sources". This mirrors tiktok-bridge.js,
//   where `account.isLive` gates on `_state.roomId`.
//
// ── Two strategies ───────────────────────────────────────────────────────────
//   A (preferred, zero extra cost): if the backend is UP, GET /api/tiktok/status.
//      If it reports a connected + live account, that account IS our live id —
//      report it without touching TikTok at all.
//   B (probe): use the backend's installed `tiktok-live-connector` directly.
//      For each candidate username (capped), call `fetchRoomId()` — a PURE HTTP
//      lookup that resolves the room id WITHOUT opening a WebSocket or
//      subscribing to the event stream. First roomId found wins.
//
// ── Reuse ────────────────────────────────────────────────────────────────────
//   `findLive(ctx)` returns `{username, roomId}` | null with no result objects,
//   so other QA modules (or future real-event tests) can call it directly.
//   The found id is also persisted to RESULTS_DIR/live-id.json.
//
// Dependency-free except the backend dep resolved via config.requireBackend.
// Hard time bound: ≤3 candidates × ≤8s probe ≈ ≤24s worst case. Every connector
// instance is disconnected in a finally — no leaked WS / sockets.

const fs = require('fs');
const path = require('path');

const AREA = 'Live';
const NAME = 'live-id-finder';

// Bound total runtime: cap candidates + per-candidate timeout.
const MAX_CANDIDATES = 3;
const PER_CANDIDATE_TIMEOUT_MS = 8000;
const STATUS_HTTP_TIMEOUT_MS = 4000;
const EVIDENCE_MAX = 200;

function clip(str) {
  const s = String(str == null ? '' : str).replace(/\s+/g, ' ').trim();
  return s.length > EVIDENCE_MAX ? s.slice(0, EVIDENCE_MAX - 1) + '…' : s;
}

function result(id, status, evidence, severity, fixHint) {
  // Matches the harness result shape used across qa/modules/*.
  return { id, area: AREA, name: NAME, status, evidence, severity: severity || 'LOW', fixHint };
}

// Persist the discovered live id so other modules / future runs can reuse it.
// Best-effort: a write failure must never break the run.
function writeLiveId(config, payload) {
  try {
    fs.mkdirSync(config.RESULTS_DIR, { recursive: true });
    const file = path.join(config.RESULTS_DIR, 'live-id.json');
    fs.writeFileSync(file, JSON.stringify(payload, null, 2));
    return file;
  } catch (_) {
    return null;
  }
}

// Race a promise against a timeout. Resolves to the promise's value, or rejects
// with a timeout Error after `ms`. Used to bound each per-candidate probe.
function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timeout after ${ms}ms (${label})`)), ms);
    timer.unref?.();
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// Resolve the connector constructor defensively. Versions differ in export
// shape, so feature-detect: prefer the documented `TikTokLiveConnection`, fall
// back to the legacy `WebcastPushConnection`. Returns the ctor or null.
function resolveConnector(config) {
  let mod;
  try {
    mod = config.requireBackend('tiktok-live-connector');
  } catch (_) {
    return null; // not installed / unresolvable
  }
  if (!mod) return null;
  if (typeof mod.TikTokLiveConnection === 'function') return mod.TikTokLiveConnection;
  if (typeof mod.WebcastPushConnection === 'function') return mod.WebcastPushConnection;
  if (typeof mod === 'function') return mod;
  return null;
}

// Probe ONE username for a live roomId WITHOUT subscribing to events.
//
// Strategy: construct the connector and call `fetchRoomId()` — a pure HTTP
// lookup (no WebSocket, no event stream). Feature-detect the method name across
// versions. NB: we deliberately attach NO 'error' listener — the connector's
// handleError() no-ops when listenerCount('error') < 1, so an unhandled 'error'
// event can never crash the process here.
//
// Returns { roomId } on success, or null when the account is offline / the probe
// fails / times out. NEVER throws — every path is wrapped + the connection is
// always disconnected in finally.
async function probeUsername(Connector, username) {
  let conn = null;
  try {
    // Minimal, fast options. fetchRoomInfoOnConnect/event polling are irrelevant
    // here because we never connect() — we only do the HTTP roomId lookup.
    conn = new Connector(username, {
      processInitialData: false,
      enableExtendedGiftInfo: false,
      fetchRoomInfoOnConnect: false,
      enableRequestPolling: false,
      webClientOptions: { timeout: PER_CANDIDATE_TIMEOUT_MS },
    });
  } catch (_) {
    return null; // constructor shape mismatch / invalid username
  }

  try {
    let roomId = null;

    if (typeof conn.fetchRoomId === 'function') {
      // Preferred (v2): pure HTTP room-id resolution.
      roomId = await withTimeout(
        Promise.resolve().then(() => conn.fetchRoomId(username)),
        PER_CANDIDATE_TIMEOUT_MS,
        `fetchRoomId @${username}`
      );
    } else if (typeof conn.fetchRoomInfo === 'function') {
      // Fallback: derive roomId from room info.
      const info = await withTimeout(
        Promise.resolve().then(() => conn.fetchRoomInfo()),
        PER_CANDIDATE_TIMEOUT_MS,
        `fetchRoomInfo @${username}`
      );
      roomId = (info && (info.id_str || info.roomId || info.id)) || null;
    } else {
      // Last-ditch: read a roomId getter if one exists (older builds).
      try { roomId = conn.roomId || null; } catch (_) { roomId = null; }
    }

    if (!roomId) return null;
    const roomIdStr = String(roomId).trim();
    if (!roomIdStr) return null;

    // Optional refine: if fetchIsLive is available, a `false` here means the
    // account has a (stale) room but is NOT broadcasting → treat as offline.
    // Any error in this step is ignored (the roomId itself is the contract).
    if (typeof conn.fetchIsLive === 'function') {
      try {
        const live = await withTimeout(
          Promise.resolve().then(() => conn.fetchIsLive()),
          PER_CANDIDATE_TIMEOUT_MS,
          `fetchIsLive @${username}`
        );
        if (live === false) return null;
      } catch (_) {
        /* indeterminate — keep the roomId as our best-effort live signal */
      }
    }

    return { roomId: roomIdStr };
  } catch (_) {
    // "Failed to retrieve Room ID" / network error / timeout → offline. Not a bug.
    return null;
  } finally {
    if (conn) {
      try { conn.removeAllListeners?.(); } catch (_) { /* ignore */ }
      try {
        const d = conn.disconnect?.();
        if (d && typeof d.then === 'function') d.catch(() => {});
      } catch (_) { /* ignore */ }
    }
  }
}

// Strategy A: ask the running backend whether its connected account is live.
// Returns { username, roomId, source:'backend' } | null (no result objects).
async function findLiveViaBackend(ctx) {
  if (!ctx.backendUp) return null;
  let r;
  try {
    r = await ctx.http.get('/api/tiktok/status', STATUS_HTTP_TIMEOUT_MS);
  } catch (_) {
    return null;
  }
  const s = r && r.json;
  if (!s || typeof s !== 'object') return null;
  if (s.connected === true && s.isLive === true) {
    const roomId = s.roomId || (s.account && s.account.roomId) || null;
    const username = s.username || s.tiktok || (s.account && s.account.username) || '';
    if (roomId) return { username: String(username || ''), roomId: String(roomId), source: 'backend' };
  }
  return null;
}

// ── Reusable helper ──────────────────────────────────────────────────────────
// Returns { username, roomId } for the first live account found, or null.
// Tries Strategy A (backend) first, then Strategy B (probe candidates). Emits no
// result objects and never throws — safe for other modules to call directly.
async function findLive(ctx) {
  // Strategy A — backend already knows.
  try {
    const viaBackend = await findLiveViaBackend(ctx);
    if (viaBackend) return { username: viaBackend.username, roomId: viaBackend.roomId };
  } catch (_) { /* fall through to probing */ }

  // Strategy B — probe candidate usernames directly.
  const Connector = resolveConnector(ctx.config);
  if (!Connector) return null;

  const candidates = Array.isArray(ctx.registry && ctx.registry.liveCandidates)
    ? ctx.registry.liveCandidates.filter((u) => typeof u === 'string' && u.trim())
    : [];

  for (const raw of candidates.slice(0, MAX_CANDIDATES)) {
    const username = raw.trim().replace(/^@+/, '');
    const hit = await probeUsername(Connector, username);
    if (hit) return { username, roomId: hit.roomId };
  }
  return null;
}

// ── Module entrypoint ────────────────────────────────────────────────────────
async function run(ctx) {
  const results = [];
  const metrics = { probed: 0, liveFound: false, liveUsername: null, source: null };

  // ── Strategy A: backend status ──────────────────────────────────────────────
  if (ctx.backendUp) {
    let statusResp = null;
    try {
      statusResp = await ctx.http.get('/api/tiktok/status', STATUS_HTTP_TIMEOUT_MS);
    } catch (_) {
      statusResp = null;
    }
    const s = statusResp && statusResp.json;
    if (s && typeof s === 'object') {
      if (s.connected === true && s.isLive === true) {
        const roomId = s.roomId || (s.account && s.account.roomId) || null;
        const username = String(s.username || s.tiktok || (s.account && s.account.username) || '');
        if (roomId) {
          const foundAt = new Date().toISOString();
          writeLiveId(ctx.config, { username, roomId: String(roomId), foundAt, source: 'backend' });
          metrics.liveFound = true;
          metrics.liveUsername = username;
          metrics.source = 'backend';
          results.push(
            result(
              'live.current',
              'PASS',
              clip(`@${username} is LIVE roomId=${roomId} (from /api/tiktok/status)`),
              'LOW'
            )
          );
          return { results, metrics };
        }
      } else if (s.connected === true) {
        // Connected account exists but isn't broadcasting — informational only.
        const username = String(s.username || s.tiktok || '');
        results.push(
          result(
            'live.current',
            'SKIP',
            clip(`connected account @${username || '?'} not currently broadcasting`),
            'LOW'
          )
        );
      }
    }
  }

  // ── Strategy B: probe candidates via tiktok-live-connector ──────────────────
  const Connector = resolveConnector(ctx.config);
  if (!Connector) {
    results.push(
      result(
        'live.connector',
        'SKIP',
        'tiktok-live-connector not installed (could not resolve via backend node_modules)',
        'LOW'
      )
    );
    return { results, metrics };
  }

  const candidates = Array.isArray(ctx.registry && ctx.registry.liveCandidates)
    ? ctx.registry.liveCandidates.filter((u) => typeof u === 'string' && u.trim())
    : [];
  const toProbe = candidates.slice(0, MAX_CANDIDATES);

  for (const raw of toProbe) {
    const username = raw.trim().replace(/^@+/, '');
    metrics.probed += 1;
    let hit = null;
    try {
      hit = await probeUsername(Connector, username);
    } catch (_) {
      hit = null; // defensive — probeUsername already swallows everything
    }
    if (hit) {
      const foundAt = new Date().toISOString();
      writeLiveId(ctx.config, { username, roomId: hit.roomId, foundAt, source: 'probe' });
      metrics.liveFound = true;
      metrics.liveUsername = username;
      metrics.source = 'probe';
      results.push(
        result(
          `live.${username}`,
          'PASS',
          clip(`@${username} is LIVE roomId=${hit.roomId} (probed via tiktok-live-connector)`),
          'LOW'
        )
      );
      // First live wins — stop probing the rest (time bound + we have what we need).
      return { results, metrics };
    }
    // Offline candidate → SKIP, not a failure.
    results.push(
      result(`live.${username}`, 'SKIP', clip(`@${username} offline / no live room`), 'LOW')
    );
  }

  // ── Nothing live anywhere → single informational summary SKIP ───────────────
  // Being offline is normal — this is NOT a suite failure.
  if (!metrics.liveFound) {
    results.push(
      result(
        'live.summary',
        'SKIP',
        clip(`no live id found (probed ${metrics.probed} candidate${metrics.probed === 1 ? '' : 's'})`),
        'LOW',
        'normal when no candidate is streaming — re-run while a candidate is LIVE to enable real-event tests'
      )
    );
  }

  return { results, metrics };
}

module.exports = {
  name: NAME,
  area: AREA,
  needsBackend: false, // uses tiktok-live-connector directly OR backend /api/tiktok/status
  run,
  findLive,
};
