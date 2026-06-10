// qa/modules/socket-relay.test.js — L2 Socket relay verification.
//
// Ground truth: backend-node/src/services/socket-manager.js. The bundle wraps
// EVERY client emit as an envelope:
//   socketiowrapper.io.emit("distributeEvent", eventName, payload)   (app/deobfuscated.js:70903)
// The backend's `distributeEvent` handler (socket-manager.js:136) unwraps it:
//   socket.on('distributeEvent', (eventName, payload) => {
//     if (!RELAYABLE_DISTRIBUTE.has(eventName)) return;     // whitelist gate
//     const cid = socket.data.channelId;
//     if (cid > 0) broadcastToChannel(eventName, payload, cid, 'widget');
//   });
// → eventName + payload are TWO separate positional args, relayed to sockets with
//   matching channelId AND appType==='widget'. So the sender emits exactly:
//     sender.emit('distributeEvent', spec.event, spec.payload)
//   which the lib serializes as 42["distributeEvent", spec.event, spec.payload] →
//   arrives as eventName=spec.event, payload=spec.payload. Arg order confirmed.
//
// This module connects a RECEIVER (appType=widget) + SENDER (appType=controlpage)
// on channelId=1, subscribes-then-triggers (waitFor registered before emit; the
// lib's waitFor also looks back via `since`, so it is race-free), and asserts the
// inner event is (or is NOT, for the negative spec) relayed within budget.

const AREA = 'L2 Socket';
const CHANNEL_ID = 1;
const CONNECT_TIMEOUT_MS = 8000; // socket connect+login handshake budget

/** Build a uniform result row. */
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
 * Run one relay spec end-to-end. Connects a fresh receiver+sender pair so a
 * crash in one spec never leaks state into the next. Always closes both sockets.
 *
 * @returns {{ result: object, deliverMs: number|null }}
 */
async function runRelaySpec(ctx, spec) {
  const { config, connectSocket } = ctx;
  const budgetMs = (config.THRESHOLDS && config.THRESHOLDS.socketDeliverMs) || 3000;
  const positive = spec.expectRelay === true;

  let receiver = null;
  let sender = null;
  try {
    // Receiver first so it is fully logged-in before the sender triggers.
    receiver = await connectSocket(config.BASE_URL, {
      channelId: CHANNEL_ID,
      appType: 'widget',
      timeoutMs: CONNECT_TIMEOUT_MS,
    });
    sender = await connectSocket(config.BASE_URL, {
      channelId: CHANNEL_ID,
      appType: 'controlpage',
      timeoutMs: CONNECT_TIMEOUT_MS,
    });

    // Subscribe-then-trigger: register waitFor BEFORE emitting. `since` lets the
    // lib look back at events that arrived between `since` and the await, closing
    // the race window where the relay beats the listener registration.
    const since = Date.now();
    const waiter = receiver.waitFor(spec.event, budgetMs, since);

    // gốc envelope — two positional args: inner event name + payload.
    sender.emit('distributeEvent', spec.event, spec.payload);

    const t0 = Date.now();
    const got = await waiter;
    const deliverMs = Date.now() - t0;

    if (positive) {
      if (got !== null && got !== undefined) {
        return {
          result: row(
            spec.id,
            spec.event,
            'PASS',
            `event '${spec.event}' relayed to widget in ${deliverMs}ms (budget ${budgetMs}ms)`,
            spec.severity || 'HIGH',
            spec.gate
          ),
          deliverMs,
        };
      }
      return {
        result: row(
          spec.id,
          spec.event,
          'FAIL',
          `event '${spec.event}' not relayed to widget within ${budgetMs}ms`,
          spec.severity || 'HIGH',
          spec.gate,
          'Add the event to RELAYABLE_DISTRIBUTE in backend-node/src/services/socket-manager.js, or check broadcastToChannel appType/channelId filter.'
        ),
        deliverMs: null,
      };
    }

    // Negative spec: event is NOT whitelisted → must NOT arrive.
    if (got === null || got === undefined) {
      return {
        result: row(
          spec.id,
          spec.event,
          'PASS',
          `non-whitelisted event '${spec.event}' correctly NOT relayed within ${budgetMs}ms`,
          spec.severity || 'LOW',
          spec.gate
        ),
        deliverMs: null,
      };
    }
    return {
      result: row(
        spec.id,
        spec.event,
        'FAIL',
        `non-whitelisted event '${spec.event}' LEAKED through to widget (RELAYABLE_DISTRIBUTE too permissive)`,
        spec.severity || 'HIGH',
        spec.gate,
        'Remove this event from RELAYABLE_DISTRIBUTE in backend-node/src/services/socket-manager.js — it must not be relayed.'
      ),
      deliverMs: null,
    };
  } catch (err) {
    // A thrown spec = one FAIL result + continue (never propagate).
    return {
      result: row(
        spec.id,
        spec.event,
        'FAIL',
        `relay test threw: ${err && err.message ? err.message : String(err)}`,
        spec.severity || 'HIGH',
        spec.gate
      ),
      deliverMs: null,
    };
  } finally {
    safeClose(sender);
    safeClose(receiver);
  }
}

module.exports = {
  name: 'socket-relay',
  area: AREA,
  needsBackend: true,

  async run(ctx) {
    const { config, connectSocket, registry } = ctx;
    const results = [];
    const deliverSamples = []; // { event, ms } for positive relays that delivered

    // ── 1. Handshake — one controlpage socket must connect + login ──────────
    let handshakeOk = false;
    let probe = null;
    try {
      probe = await connectSocket(config.BASE_URL, {
        channelId: CHANNEL_ID,
        appType: 'controlpage',
        timeoutMs: CONNECT_TIMEOUT_MS,
      });
      handshakeOk = true;
      results.push(
        row(
          'sock.handshake',
          'socket handshake',
          'PASS',
          `controlpage socket connected + login ok on channelId=${CHANNEL_ID}`,
          'CRITICAL',
          'Gate 35'
        )
      );
    } catch (err) {
      results.push(
        row(
          'sock.handshake',
          'socket handshake',
          'FAIL',
          `socket connect rejected: ${err && err.message ? err.message : String(err)}`,
          'CRITICAL',
          'Gate 35',
          'Verify the backend Socket.IO server is up and accepting ws on /socket.io/ (EIO=4).'
        )
      );
    } finally {
      safeClose(probe);
    }

    const specs = (registry && Array.isArray(registry.socket) ? registry.socket : []);

    // ── 2. If the handshake failed, the backend is not accepting ws — SKIP all
    //       relay specs (with evidence) rather than hanging on every connect. ──
    if (!handshakeOk) {
      for (const spec of specs) {
        results.push(
          row(
            spec.id,
            spec.event,
            'SKIP',
            'socket handshake failed — backend not accepting ws',
            spec.severity || 'LOW',
            spec.gate
          )
        );
      }
      return {
        results,
        metrics: { relayTested: 0, avgDeliverMs: null, slowestEvent: null },
      };
    }

    // ── 3. Relay tests — sequential so we never hold a swarm of open sockets. ─
    for (const spec of specs) {
      // eslint-disable-next-line no-await-in-loop
      const { result, deliverMs } = await runRelaySpec(ctx, spec);
      results.push(result);
      if (spec.expectRelay === true && typeof deliverMs === 'number') {
        deliverSamples.push({ event: spec.event, ms: deliverMs });
      }
    }

    // ── 4. Metrics ──────────────────────────────────────────────────────────
    const relayTested = specs.length;
    let avgDeliverMs = null;
    let slowestEvent = null;
    if (deliverSamples.length > 0) {
      const sum = deliverSamples.reduce((acc, s) => acc + s.ms, 0);
      avgDeliverMs = Math.round(sum / deliverSamples.length);
      slowestEvent = deliverSamples.reduce((slow, s) => (s.ms > slow.ms ? s : slow)).event;
    }

    return {
      results,
      metrics: { relayTested, avgDeliverMs, slowestEvent },
    };
  },
};
