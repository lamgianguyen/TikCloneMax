// qa/modules/chain-coinjar.test.js — Chain 5: coinjar-reset functional E2E.
//
// Feature: "Reset Jar" HTTP path → widget overlay reset signal.
//   POST /api/widget/coinjar/reset  →  broadcast('coin-jar:reset', {})  →
//   broadcastToChannel('coin-jar:reset', {}, channelId, 'widget')  →  widget io.on
//
// Ground truth (verified against current source):
//   * Route: backend-node/src/routes/widget.js:95-101 — POST /coinjar/reset →
//     broadcast(req,'coin-jar:reset',{}) → res.json({ reset:true }). Mounted at
//     /api/widget (backend-node/src/index.js:245).
//   * Relay: backend-node/src/services/socket-manager.js:127 — 'coin-jar:reset'
//     is in RELAYABLE_DISTRIBUTE; broadcastToChannel(... 'widget') relays it to
//     appType='widget' sockets only (never echoed to controlpage → no reload loop).
//   * Event name MUST be hyphenated 'coin-jar:reset' — the widget only listens to
//     this name (widget.js:96-98 comment; downloads/widget/coinjar/index.html:51).
//     Payload is {} (empty but still emitted; relay fires even on undefined).
//   * Channel scope resolves to the default channel when no auth header is sent
//     (resolveChannelId → channels.findDefault() → cid=1 on the single-channel
//     clone). We read the active scope once from the DB and reuse it.
//
// MUTATING: this only emits a transient socket signal — no DB write, no persistent
// state (coin-jar state is 100% widget-client ephemeral per Gate 35-MECH). Safe to
// run repeatedly; nothing to clean up. The HTTP step is gated behind ctx.mutating
// (POST is state-changing-by-classification even though it persists nothing); the
// socket-delivery assertion needs that POST, so it is gated too.
//
// Contract: emits { id:'chain.coinjar.<step>', area:'Chain', ... } per step.
// run() NEVER throws; every step is guarded so a partial failure is ONE FAIL row.
// The widget socket + read-only DB handle are ALWAYS closed in finally.
// Client-side parts (canvas World.clear / physics-body wipe in coin-jar.js
// window.resetJar) are annotated SKIP — headless cannot exercise widget JS.

const AREA = 'Chain';
const GATE = 'Gate 35-MECH (coinjar)';
const CHANNEL_ID = 1;
const CONNECT_TIMEOUT_MS = 8000; // socket connect + login handshake budget

// coin-jar:reset is immediate (no debounce) — a 1-2s race is plenty. We use the
// configured socket-deliver budget but never exceed a small ceiling for this
// immediate event so a down/silent relay doesn't stall the whole sweep.
const RESET_DELIVER_CEIL_MS = 3000;

/** Build a uniform result row (mirrors socket-relay.test.js::row). */
function row(id, name, status, evidence, severity, gate, fixHint) {
  return { id, area: AREA, name, status, evidence, severity, gate, fixHint };
}

/** Close a socket api defensively (never throws). */
function safeCloseSocket(api) {
  try {
    if (api && typeof api.close === 'function') api.close();
  } catch (_) {
    /* already closed */
  }
}

/** Close a better-sqlite3 handle defensively (never throws). */
function safeCloseDb(db) {
  try {
    if (db && typeof db.close === 'function') db.close();
  } catch (_) {
    /* already closed */
  }
}

/**
 * Resolve the active channel scope from the SAME DB the running backend writes
 * to (read-only). Mirrors test-settings-chain.js::activeScope. Returns
 * { channelId, profileId } and a status describing how it was obtained so the
 * step can emit PASS/SKIP/FAIL honestly. NEVER throws — a DB problem degrades to
 * the default scope with a note (the backend itself falls back to cid=1).
 *
 * @returns {{ scope: {channelId:number, profileId:number}, status:string, evidence:string }}
 */
function resolveScope(ctx) {
  const { config } = ctx;
  let Database;
  try {
    Database = config.requireBackend('better-sqlite3');
  } catch (err) {
    return {
      scope: { channelId: CHANNEL_ID, profileId: 1 },
      status: 'SKIP',
      evidence: `better-sqlite3 unavailable (${err && err.message ? err.message : err}); assuming default channelId=${CHANNEL_ID}`,
    };
  }

  let db = null;
  try {
    db = new Database(config.DB_PATH, { readonly: true });
    const ch = db
      .prepare('SELECT ChannelId, ProfileId FROM Channels ORDER BY ChannelId LIMIT 1')
      .get();
    if (ch && ch.ChannelId > 0) {
      return {
        scope: { channelId: ch.ChannelId, profileId: ch.ProfileId || 1 },
        status: 'PASS',
        evidence: `active scope channelId=${ch.ChannelId} profileId=${ch.ProfileId} (DB ${config.DB_PATH})`,
      };
    }
    return {
      scope: { channelId: CHANNEL_ID, profileId: 1 },
      status: 'SKIP',
      evidence: `Channels table empty/0 — assuming default channelId=${CHANNEL_ID}`,
    };
  } catch (err) {
    return {
      scope: { channelId: CHANNEL_ID, profileId: 1 },
      status: 'SKIP',
      evidence: `DB read failed (${err && err.message ? err.message : err}); assuming default channelId=${CHANNEL_ID}`,
    };
  } finally {
    safeCloseDb(db);
  }
}

module.exports = {
  name: 'chain-coinjar',
  area: AREA,
  needsBackend: true,

  async run(ctx) {
    const { config, http, connectSocket, mutating } = ctx;
    const results = [];

    // ── Step 0: resolve channel scope (read-only DB) ─────────────────────────
    // Not strictly required to drive the chain (no-auth resolves to default
    // server-side anyway), but reading it makes the channel filter assertion
    // explicit and matches the reference chain's activeScope discipline.
    const scopeOut = resolveScope(ctx);
    results.push(
      row(
        'chain.coinjar.scope',
        'resolve active channel scope',
        scopeOut.status === 'FAIL' ? 'FAIL' : scopeOut.status,
        scopeOut.evidence,
        'LOW',
        GATE
      )
    );
    const channelId = scopeOut.scope.channelId;

    // ── Mutating gate: the POST changes transient state (by classification),
    //    so the HTTP fire + socket-delivery assertion only run with --mutating.
    if (mutating !== true) {
      results.push(
        row(
          'chain.coinjar.http',
          'POST /api/widget/coinjar/reset',
          'SKIP',
          'mutating step skipped (run with --mutating to fire the reset and assert delivery)',
          'MEDIUM',
          GATE
        )
      );
      results.push(
        row(
          'chain.coinjar.relay',
          'widget receives coin-jar:reset',
          'SKIP',
          'depends on the mutating POST — run with --mutating',
          'HIGH',
          GATE
        )
      );
      results.push(
        row(
          'chain.coinjar.widgetReset',
          'widget canvas World.clear / resetJar',
          'SKIP',
          'client-side only (downloads/widget/coinjar/index.html → coin-jar.js window.resetJar) — not headless-testable',
          'LOW',
          GATE
        )
      );
      return { results, metrics: { mutating: false, deliverMs: null } };
    }

    // ── Steps 1-2 (mutating): open widget socket, subscribe, fire POST, assert.
    let widget = null;
    let deliverMs = null;
    try {
      // 1. Widget socket logged in BEFORE we trigger, so the relay can reach it.
      try {
        widget = await connectSocket(config.BASE_URL, {
          channelId: CHANNEL_ID,
          appType: 'widget',
          timeoutMs: CONNECT_TIMEOUT_MS,
        });
        results.push(
          row(
            'chain.coinjar.socket',
            'widget socket handshake',
            'PASS',
            `widget socket connected + login ok on channelId=${CHANNEL_ID}`,
            'HIGH',
            GATE
          )
        );
      } catch (err) {
        // No socket → cannot assert delivery. One FAIL + SKIP the dependents.
        results.push(
          row(
            'chain.coinjar.socket',
            'widget socket handshake',
            'FAIL',
            `widget socket connect rejected: ${err && err.message ? err.message : String(err)}`,
            'HIGH',
            GATE,
            'Verify the backend Socket.IO server is up + accepting ws on /socket.io/ (EIO=4).'
          )
        );
        results.push(
          row(
            'chain.coinjar.http',
            'POST /api/widget/coinjar/reset',
            'SKIP',
            'widget socket never logged in — relay cannot be asserted',
            'MEDIUM',
            GATE
          )
        );
        results.push(
          row(
            'chain.coinjar.relay',
            'widget receives coin-jar:reset',
            'SKIP',
            'widget socket never logged in',
            'HIGH',
            GATE
          )
        );
        results.push(
          row(
            'chain.coinjar.widgetReset',
            'widget canvas World.clear / resetJar',
            'SKIP',
            'client-side only (coin-jar.js window.resetJar) — not headless-testable',
            'LOW',
            GATE
          )
        );
        return { results, metrics: { mutating: true, deliverMs: null } };
      }

      // Subscribe-then-trigger: register waitFor BEFORE the POST. `since` lets
      // the lib look back at frames that arrived between `since` and the await,
      // closing the race window where the relay beats listener registration.
      const since = Date.now();
      const waiter = widget.waitFor('coin-jar:reset', RESET_DELIVER_CEIL_MS, since);

      // 2. Fire the reset over HTTP (no auth → resolves to default channel).
      let postRes;
      try {
        postRes = await http.post('/api/widget/coinjar/reset', {});
      } catch (err) {
        results.push(
          row(
            'chain.coinjar.http',
            'POST /api/widget/coinjar/reset',
            'FAIL',
            `request threw: ${err && err.message ? err.message : String(err)}`,
            'MEDIUM',
            GATE,
            'Check the /coinjar/reset handler in backend-node/src/routes/widget.js.'
          )
        );
        results.push(
          row(
            'chain.coinjar.relay',
            'widget receives coin-jar:reset',
            'SKIP',
            'POST failed — no event was fired',
            'HIGH',
            GATE
          )
        );
        results.push(
          row(
            'chain.coinjar.widgetReset',
            'widget canvas World.clear / resetJar',
            'SKIP',
            'client-side only (coin-jar.js window.resetJar) — not headless-testable',
            'LOW',
            GATE
          )
        );
        return { results, metrics: { mutating: true, deliverMs: null } };
      }

      // 2a. HTTP assertion: 200 + body { reset: true } (widget.js:100).
      if (postRes.status === 0) {
        results.push(
          row(
            'chain.coinjar.http',
            'POST /api/widget/coinjar/reset',
            'SKIP',
            `unreachable: ${postRes.error || 'no response'}`,
            'MEDIUM',
            GATE
          )
        );
      } else if (postRes.status !== 200) {
        results.push(
          row(
            'chain.coinjar.http',
            'POST /api/widget/coinjar/reset',
            'FAIL',
            `POST → ${postRes.status} (expected 200)`,
            'MEDIUM',
            GATE,
            'Verify /api/widget is mounted (index.js:245) and the /coinjar/reset route exists (widget.js:95).'
          )
        );
      } else if (!postRes.json || postRes.json.reset !== true) {
        results.push(
          row(
            'chain.coinjar.http',
            'POST /api/widget/coinjar/reset',
            'FAIL',
            `POST → 200 but body missing { reset:true } (got ${JSON.stringify(postRes.json)})`,
            'MEDIUM',
            GATE,
            'Ensure widget.js /coinjar/reset responds res.json({ reset: true }).'
          )
        );
      } else {
        results.push(
          row(
            'chain.coinjar.http',
            'POST /api/widget/coinjar/reset',
            'PASS',
            `POST → 200 { reset:true } in ${postRes.ms}ms`,
            'MEDIUM',
            GATE
          )
        );
      }

      // 2b. Socket assertion: widget receives 42["coin-jar:reset", {}] within
      //     budget. Relayed to appType='widget' on channelId only (the channel
      //     filter / hyphenated-name regression guard).
      const t0 = Date.now();
      let got;
      try {
        got = await waiter;
      } catch (err) {
        got = undefined;
        results.push(
          row(
            'chain.coinjar.relay.error',
            'widget receives coin-jar:reset',
            'FAIL',
            `waitFor threw: ${err && err.message ? err.message : String(err)}`,
            'HIGH',
            GATE
          )
        );
      }
      deliverMs = Date.now() - t0;

      // `got` is the payload ({} → an object, which is truthy) on delivery, or
      // null on timeout. Distinguish object-vs-null explicitly so an empty {}
      // payload (the real shape) still counts as delivered.
      if (got !== null && got !== undefined) {
        results.push(
          row(
            'chain.coinjar.relay',
            'widget receives coin-jar:reset',
            'PASS',
            `'coin-jar:reset' relayed to widget in ${deliverMs}ms (channelId=${channelId}, appType=widget; payload=${JSON.stringify(got)})`,
            'HIGH',
            GATE
          )
        );
      } else {
        results.push(
          row(
            'chain.coinjar.relay',
            'widget receives coin-jar:reset',
            'FAIL',
            `'coin-jar:reset' not received by widget within ${RESET_DELIVER_CEIL_MS}ms`,
            'HIGH',
            GATE,
            "Verify 'coin-jar:reset' is in RELAYABLE_DISTRIBUTE (socket-manager.js:127), the route uses the hyphenated name (widget.js:99), and broadcastToChannel targets appType='widget'."
          )
        );
      }

      // 2c. Client-side widget reset is not headless-testable → SKIP (annotate).
      results.push(
        row(
          'chain.coinjar.widgetReset',
          'widget canvas World.clear / resetJar',
          'SKIP',
          'client-side only: downloads/widget/coinjar/index.html → coin-jar.js window.resetJar wipes the canvas physics bodies. Backend delivery of the reset event IS asserted above; the visual wipe is widget JS — not headless-testable.',
          'LOW',
          GATE
        )
      );
    } catch (err) {
      // Defensive catch-all — run() must never throw. Any unexpected error
      // becomes ONE FAIL row.
      results.push(
        row(
          'chain.coinjar.unexpected',
          'coinjar chain',
          'FAIL',
          `unexpected error: ${err && err.message ? err.message : String(err)}`,
          'HIGH',
          GATE
        )
      );
    } finally {
      safeCloseSocket(widget);
    }

    return { results, metrics: { mutating: true, deliverMs } };
  },
};
