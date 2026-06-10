// qa/modules/chain-tts.test.js — Chain 2: TTS backend functional chain (E2E).
//
// Feature under test: AI-voice auth-token mint + chat delivery to a controlpage
// socket (the controlpage-channelId bug fixed in socket-manager.js:29-50, where a
// controlpage socket that logged in must end up on channelId=defaultChannel(1) so
// the channel-1 `chat` broadcast reaches it — pre-fix it stayed at channelId 0 and
// was filtered out by broadcastToChannel).
//
// Ground truth (verified against current source):
//   * POST /api/tts/auth-token  → backend-node/src/routes/tts.js:110
//       returns {status:200, message:'OK', ttsAuthToken:'<jwt>'}. The JWT payload
//       (middle segment, base64url) carries the ALL-PRO contract (CLAUDE.md §0):
//       subscriptionEnabled:true, subscriptionPeriodCredits:100000.
//       Mounted at /api/tts via app.use('/api/tts', ttsRouter) (index.js:241).
//   * POST /api/_dev/fake-chat?text=..&user=..  → backend-node/src/index.js:104
//       calls sockets.broadcastToChannel('chat', payload, 1) with NO appType →
//       delivered to ALL sockets on channel 1 (incl. controlpage). Returns
//       {status:'ok', emitted:'chat', payload}. Payload shape index.js:107-117:
//       {uniqueId, nickname, userId:'0', comment, ...}.
//
// This is a FUNCTIONAL chain — each step is one result row {id:'chain.tts.<step>'}.
// needsBackend:true → when the backend is down run-all SKIPs the whole module, but
// every step is ALSO guarded (per-step try/catch) so a partial failure is ONE FAIL
// row, never a thrown error out of run().
//
// SKIPPED as client-side-only (annotated below, not headless-testable):
//   * /api/tts/user + /api/tts/voices — NOT backend routes; they are cross-origin
//     tts.tikfinity.com calls intercepted CLIENT-SIDE in the bundle via blockScript
//     fetch/XHR mocks. The headless harness cannot exercise them.
//   * Actual TTS `speak` audio playback is client-side; /api/tts/generate needs a
//     real TikTok sessionid (503 without it, tts.js:157-162). Not exercised here.

const AREA = 'Chain';
const CHANNEL_ID = 1;
const CONNECT_TIMEOUT_MS = 8000; // socket connect + login handshake budget

/** Build a uniform result row (mirrors socket-relay.test.js::row). */
function row(id, name, status, evidence, severity, gate, fixHint) {
  return { id, area: AREA, name, status, evidence, severity, gate, fixHint };
}

/** Close a socket api defensively (never throws). */
function safeClose(api) {
  try {
    if (api && typeof api.close === 'function') api.close();
  } catch (_) {
    /* already closed */
  }
}

/**
 * Decode a JWT's middle (payload) segment from base64url → object.
 * Returns null on any malformed input rather than throwing.
 */
function decodeJwtPayload(jwt) {
  try {
    if (typeof jwt !== 'string') return null;
    const parts = jwt.split('.');
    if (parts.length < 2) return null;
    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4 !== 0) b64 += '=';
    const json = Buffer.from(b64, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (_) {
    return null;
  }
}

/**
 * Step 1 — POST /api/tts/auth-token: assert 200 + correct response shape + the
 * ALL-PRO JWT contract. Emits up to two rows: the HTTP shape, and the decoded
 * JWT pro-claims. Returns { rows, token } so the caller can reuse the token.
 */
async function stepAuthToken(ctx) {
  const { http } = ctx;
  const rows = [];
  let token = null;

  let res;
  try {
    res = await http.post('/api/tts/auth-token', {});
  } catch (err) {
    rows.push(row(
      'chain.tts.auth-token', 'POST /api/tts/auth-token', 'FAIL',
      `request threw: ${err && err.message ? err.message : String(err)}`,
      'HIGH', 'Gate 9a',
      'Verify the /api/tts/auth-token POST handler in backend-node/src/routes/tts.js.'
    ));
    return { rows, token };
  }

  if (res.status === 0) {
    rows.push(row(
      'chain.tts.auth-token', 'POST /api/tts/auth-token', 'SKIP',
      `unreachable: ${res.error || 'no response'}`, 'HIGH', 'Gate 9a'
    ));
    return { rows, token };
  }

  const body = res.json;
  const hasShape = res.status === 200 && body
    && body.status === 200 && body.message === 'OK'
    && typeof body.ttsAuthToken === 'string' && body.ttsAuthToken.length > 0;

  if (!hasShape) {
    rows.push(row(
      'chain.tts.auth-token', 'POST /api/tts/auth-token', 'FAIL',
      `expected {status:200,message:'OK',ttsAuthToken:'<jwt>'} — got HTTP ${res.status} body=${
        body ? JSON.stringify(body).slice(0, 160) : 'non-JSON'}`,
      'HIGH', 'Gate 9a',
      "Handler must return field name 'ttsAuthToken' (camelCase) per tts.js:143-147."
    ));
    return { rows, token };
  }

  token = body.ttsAuthToken;
  rows.push(row(
    'chain.tts.auth-token', 'POST /api/tts/auth-token', 'PASS',
    `200 {status:200,message:'OK',ttsAuthToken:<jwt ${token.length}ch>} (${res.ms}ms)`,
    'HIGH', 'Gate 9a'
  ));

  // ── JWT ALL-PRO contract (CLAUDE.md §0) — decode payload + assert pro claims. ─
  const payload = decodeJwtPayload(token);
  if (!payload) {
    rows.push(row(
      'chain.tts.auth-token.jwt', 'tts auth JWT pro-claims', 'FAIL',
      'ttsAuthToken JWT payload segment did not base64url-decode to JSON',
      'HIGH', 'Gate 9a / §0 ALL-PRO',
      'JWT middle segment must be base64url JSON per tts.js:119-142.'
    ));
  } else {
    const proOk = payload.subscriptionEnabled === true
      && Number(payload.subscriptionPeriodCredits) >= 100000;
    rows.push(row(
      'chain.tts.auth-token.jwt', 'tts auth JWT pro-claims', proOk ? 'PASS' : 'FAIL',
      proOk
        ? `JWT ALL-PRO ✓ subscriptionEnabled=true subscriptionPeriodCredits=${payload.subscriptionPeriodCredits}`
        : `JWT not ALL-PRO — subscriptionEnabled=${payload.subscriptionEnabled} subscriptionPeriodCredits=${payload.subscriptionPeriodCredits} (expected true / ≥100000)`,
      'HIGH', 'Gate 9a / §0 ALL-PRO',
      proOk ? undefined
        : 'TikClone is ALL-PRO by design — JWT payload must set subscriptionEnabled:true + subscriptionPeriodCredits:100000 (tts.js:130-138).'
    ));
  }

  return { rows, token };
}

/**
 * Step 2 — chat delivery to a controlpage socket (the fixed channelId bug).
 * Opens an appType=controlpage socket, subscribes-then-triggers POST
 * /api/_dev/fake-chat, and asserts: (a) the HTTP envelope, (b) the controlpage
 * socket actually RECEIVES the `chat` event with the right payload.
 */
async function stepChatDelivery(ctx) {
  const { http, connectSocket, config } = ctx;
  const budgetMs = (config.THRESHOLDS && config.THRESHOLDS.socketDeliverMs) || 3000;
  const rows = [];

  const text = 'hello-' + Math.random().toString(36).slice(2, 8);
  const user = 'tester-' + Math.random().toString(36).slice(2, 8);

  let socket = null;
  try {
    // Receiver MUST be a controlpage socket — this is the exact regression guard:
    // a controlpage socket that logged in ends up on channelId=defaultChannel(1)
    // (socket-manager.js handleLogin), so the channel-1 chat broadcast reaches it.
    socket = await connectSocket(config.BASE_URL, {
      channelId: CHANNEL_ID,
      appType: 'controlpage',
      timeoutMs: CONNECT_TIMEOUT_MS,
    });

    // Subscribe-then-trigger: register waitFor BEFORE firing the HTTP call. `since`
    // lets the lib look back at events that arrived between `since` and the await,
    // closing the race where the relay beats the listener registration.
    const since = Date.now();
    const waiter = socket.waitFor('chat', budgetMs, since);

    let res;
    try {
      res = await http.post(`/api/_dev/fake-chat?text=${encodeURIComponent(text)}&user=${encodeURIComponent(user)}`, {});
    } catch (err) {
      rows.push(row(
        'chain.tts.fake-chat', 'POST /api/_dev/fake-chat', 'FAIL',
        `request threw: ${err && err.message ? err.message : String(err)}`,
        'HIGH', 'Gate 35 / socket-manager.js:29-50'
      ));
      return { rows };
    }

    // ── 2a. HTTP envelope ─────────────────────────────────────────────────────
    const httpOk = res.status === 200 && res.json
      && res.json.status === 'ok' && res.json.emitted === 'chat';
    rows.push(row(
      'chain.tts.fake-chat', 'POST /api/_dev/fake-chat', httpOk ? 'PASS' : 'FAIL',
      httpOk
        ? `200 {status:'ok',emitted:'chat'} (${res.ms}ms)`
        : `expected {status:'ok',emitted:'chat'} — got HTTP ${res.status} body=${
          res.json ? JSON.stringify(res.json).slice(0, 160) : 'non-JSON'}`,
      'HIGH', 'Gate 35',
      httpOk ? undefined
        : 'Verify the /api/_dev/fake-chat dev helper in backend-node/src/index.js:104 is mounted.'
    ));

    // ── 2b. Socket delivery to the controlpage socket (the regression guard) ──
    const t0 = Date.now();
    const got = await waiter;
    const deliverMs = Date.now() - t0;

    if (got === null || got === undefined) {
      rows.push(row(
        'chain.tts.chat-delivery', 'chat → controlpage socket', 'FAIL',
        `controlpage socket did not receive 'chat' within ${budgetMs}ms (channelId-filter regression?)`,
        'CRITICAL', 'socket-manager.js:29-50',
        'A logged-in controlpage socket must land on channelId=defaultChannel(1) so broadcastToChannel("chat",payload,1) reaches it. Check handleLogin channelId resolution.'
      ));
    } else {
      const payloadOk = typeof got === 'object'
        && got.comment === text && got.uniqueId === user;
      rows.push(row(
        'chain.tts.chat-delivery', 'chat → controlpage socket',
        payloadOk ? 'PASS' : 'FAIL',
        payloadOk
          ? `controlpage received chat {comment:'${text}',uniqueId:'${user}'} in ${deliverMs}ms (budget ${budgetMs}ms)`
          : `chat arrived but payload mismatch — comment='${got && got.comment}' uniqueId='${got && got.uniqueId}' (expected '${text}'/'${user}')`,
        payloadOk ? 'HIGH' : 'CRITICAL', 'socket-manager.js:29-50',
        payloadOk ? undefined
          : 'Payload shape should mirror index.js:107-117 {uniqueId,nickname,userId,comment,...}.'
      ));
    }
  } catch (err) {
    rows.push(row(
      'chain.tts.chat-delivery', 'chat → controlpage socket', 'FAIL',
      `chain step threw: ${err && err.message ? err.message : String(err)}`,
      'CRITICAL', 'socket-manager.js:29-50',
      'Verify the backend Socket.IO server accepts ws on /socket.io/ (EIO=4) and logs in controlpage sockets.'
    ));
  } finally {
    safeClose(socket);
  }

  return { rows };
}

/**
 * Step 3 — annotate the client-side-only legs of the chain as SKIP so the chain's
 * boundary is explicit in the report (these endpoints DON'T exist on our backend;
 * the bundle mocks them client-side via blockScript).
 */
function stepClientSideSkips() {
  return [
    row(
      'chain.tts.user', 'tts/user (client-mock)', 'SKIP',
      "tts/user is a cross-origin tts.tikfinity.com call mocked CLIENT-SIDE in blockScript (tfHandleTtsTikfinityUser) — not a backend route, not headless-testable.",
      'LOW', 'Gate 9b / Gate 25'
    ),
    row(
      'chain.tts.voices', 'tts/voices (client-mock)', 'SKIP',
      "tts/voices is a cross-origin tts.tikfinity.com call mocked CLIENT-SIDE in blockScript (tfHandleTtsTikfinityCom) — not a backend route, not headless-testable.",
      'LOW', 'Gate 9c / Gate 25'
    ),
    row(
      'chain.tts.speak', 'tts speak/generate (client playback)', 'SKIP',
      'Actual TTS audio playback is client-side; /api/tts/generate needs a real TikTok sessionid (503 without it, tts.js:157-162) — not exercised headless.',
      'LOW', 'Gate 14'
    ),
  ];
}

module.exports = {
  name: 'chain-tts',
  area: AREA,
  needsBackend: true,

  async run(ctx) {
    const results = [];

    // ── Step 1: auth-token mint + ALL-PRO JWT contract ──────────────────────────
    try {
      const { rows } = await stepAuthToken(ctx);
      for (const r of rows) results.push(r);
    } catch (err) {
      results.push(row(
        'chain.tts.auth-token', 'POST /api/tts/auth-token', 'FAIL',
        `step crashed: ${err && err.message ? err.message : String(err)}`,
        'HIGH', 'Gate 9a'
      ));
    }

    // ── Step 2: chat delivery to a controlpage socket (the fixed channelId bug) ─
    try {
      const { rows } = await stepChatDelivery(ctx);
      for (const r of rows) results.push(r);
    } catch (err) {
      results.push(row(
        'chain.tts.chat-delivery', 'chat → controlpage socket', 'FAIL',
        `step crashed: ${err && err.message ? err.message : String(err)}`,
        'CRITICAL', 'socket-manager.js:29-50'
      ));
    }

    // ── Step 3: annotate client-side-only legs as SKIP ──────────────────────────
    for (const r of stepClientSideSkips()) results.push(r);

    const pass = results.filter((r) => r.status === 'PASS').length;
    const fail = results.filter((r) => r.status === 'FAIL').length;
    const skip = results.filter((r) => r.status === 'SKIP').length;

    return {
      results,
      metrics: { chain: 'tts', steps: results.length, pass, fail, skip },
    };
  },
};
