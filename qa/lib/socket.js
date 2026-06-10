// qa/lib/socket.js — minimal, dependency-free Socket.IO v4 client.
//
// Speaks Engine.IO v4 + Socket.IO v4 framing over `ws` (a backend dep, resolved
// via config.requireBackend). Same approach as backend-node/scripts/
// test-settings-chain.js — no socket.io-client needed.
//
// Framing che-sheet:
//   "0{json}"  EIO open  (has pingInterval/pingTimeout)
//   "40"       SIO connect to default namespace  (client sends, then server "40{sid}")
//   "42[ev,a]" SIO event
//   "2"/"3"    EIO ping/pong
//
// On connect we emit BOTH setContext + login so the backend's channelId filter
// (broadcastToChannel line ~355) routes events to us — control-page sockets that
// never login get channelId=0 and are filtered out (the TTS bug class).

const config = require('./config');

const WebSocket = config.requireBackend('ws');

function connect(base, opts = {}) {
  const { channelId = 1, appType = 'controlpage', timeoutMs = 8000 } = opts;
  const wsUrl = `${base.replace(/^http/, 'ws')}/socket.io/?EIO=4&transport=websocket`;

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const handlers = new Map(); // event -> [cb]
    const recent = []; // ring buffer of {event, args, at} for late waitFor
    let pingTimer = null;

    const fire = (event, args) => {
      recent.push({ event, args, at: Date.now() });
      if (recent.length > 200) recent.shift();
      (handlers.get(event) || []).forEach((cb) => {
        try {
          cb(args[0], ...args.slice(1));
        } catch (_) {
          /* swallow handler error */
        }
      });
    };

    const api = {
      raw: ws,
      on(event, cb) {
        if (!handlers.has(event)) handlers.set(event, []);
        handlers.get(event).push(cb);
        return api;
      },
      emit(event, ...args) {
        try {
          ws.send(`42${JSON.stringify([event, ...args])}`);
        } catch (_) {
          /* socket closing */
        }
        return api;
      },
      // Resolve with the FIRST payload of `event` seen within `ms` (looks back at
      // events that arrived since `since`, so you can subscribe-then-trigger
      // without a race). Resolves null on timeout.
      waitFor(event, ms = 3000, since = 0) {
        const seen = recent.find((r) => r.event === event && r.at >= since);
        if (seen) return Promise.resolve(seen.args[0]);
        return new Promise((res) => {
          const to = setTimeout(() => res(null), ms);
          api.on(event, (payload) => {
            clearTimeout(to);
            res(payload);
          });
        });
      },
      close() {
        try {
          clearInterval(pingTimer);
          ws.close();
        } catch (_) {
          /* already closed */
        }
      },
    };

    const to = setTimeout(() => {
      try {
        ws.close();
      } catch (_) {
        /* noop */
      }
      reject(new Error(`socket connect timeout (${wsUrl})`));
    }, timeoutMs);

    ws.on('message', (raw) => {
      const s = raw.toString();
      const type = s[0];
      if (type === '0') {
        // EIO open → arm ping → request SIO namespace connect
        try {
          const data = JSON.parse(s.slice(1));
          if (data.pingInterval) {
            pingTimer = setInterval(() => {
              try {
                ws.send('2');
              } catch (_) {
                /* noop */
              }
            }, data.pingInterval);
          }
        } catch (_) {
          /* noop */
        }
        ws.send('40');
      } else if (s.startsWith('40')) {
        // SIO connected to default namespace
        clearTimeout(to);
        api.emit('setContext', { channelId, appType });
        api.emit('login', { channelId, appType });
        // small grace so login is processed before caller triggers events
        setTimeout(() => resolve(api), 150);
      } else if (s.startsWith('42')) {
        try {
          const arr = JSON.parse(s.slice(2));
          const [event, ...args] = arr;
          fire(event, args);
        } catch (_) {
          /* malformed frame */
        }
      } else if (type === '2') {
        // server ping → pong
        try {
          ws.send('3');
        } catch (_) {
          /* noop */
        }
      }
    });

    ws.on('error', (e) => {
      clearTimeout(to);
      reject(e);
    });
  });
}

module.exports = { connect };
