// qa/modules/chain-settings.test.js — Chain 1: settings-save end-to-end.
//
// Feature: Customize → POST /api/updateSettings → DB persist → live
//   `widgetSettings` broadcast to connected widgets.
//
// This is a FUNCTIONAL CHAIN test: it exercises the whole "đổi setting không ăn"
// bug class in one flow, the same surface backend-node/scripts/test-settings-chain.js
// covers — ported into the QA MODULE CONTRACT (ctx.http + ctx.connectSocket +
// readonly DB read via ctx.config.requireBackend('better-sqlite3')).
//
// Ground truth (verified against current source):
//   * POST /api/updateSettings → 200 {status:200, message:'OK'}        (routes/settings.js:50,98)
//   * handler writes DynamicSettings then widgetSettings.rebuildAndBroadcast (settings.js:85,93)
//   * channel resolves to the DEFAULT channel when unauthed (settings.js:19-23)
//   * the bundle lowercases keys, so we POST the LOWERCASE trap key
//     `widget_cannon_ballsize`; the DB row keeps that raw key, but the broadcast
//     bag carries the prefix-stripped canonical key `cannon_ballSize`
//     (widget-settings-cache.js normalizeKey + DEFAULTS, broadcast at :179).
//   * broadcast is debounced BROADCAST_DEBOUNCE_MS=250ms → wait ≥600ms, allow ≤3s
//     (widget-settings-cache.js:164,176).
//
// Steps emitted (one result row each, id = chain.settings.<step>):
//   chain.settings.socket   — open a widget socket + login (handshake)
//   chain.settings.http     — POST returns 200 {status:200,message:'OK'}
//   chain.settings.db       — DB row widget_cannon_ballsize === posted value
//   chain.settings.broadcast— widget socket receives widgetSettings w/ cannon_ballSize
//
// Every step is independently guarded: a partial failure is ONE FAIL row, never a
// throw out of run(). The socket + DB handles are always closed in finally.

const AREA = 'Chain';
const CHANNEL_ID = 1;
const CONNECT_TIMEOUT_MS = 8000;

// The bundle lowercases settings keys before save → the real POST key is all
// lowercase. The broadcast bag uses the prefix-stripped canonical key.
const KEY_DB = 'widget_cannon_ballsize';
const KEY_WIDGET = 'cannon_ballSize';
// Random value so a stale cache / previous run never produces a false PASS.
const VALUE = String(60 + Math.floor(Math.random() * 39));

// Broadcast is debounced 250ms; settle then verify, with a generous receive race.
const DB_SETTLE_MS = 600;
const BROADCAST_WAIT_MS = 3000;

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
 * Resolve the active channel/profile scope from the SAME db the backend writes.
 * Opens READ-ONLY and closes immediately so we never lock the live backend.
 * Returns { scope, db|null, error|null } — db left open for the caller to reuse
 * for the value read; null when the DB couldn't be opened.
 */
function openScope(config) {
  let Database;
  try {
    Database = config.requireBackend('better-sqlite3');
  } catch (err) {
    return { scope: null, db: null, error: `better-sqlite3 unavailable: ${err && err.message ? err.message : err}` };
  }
  let db;
  try {
    db = new Database(config.DB_PATH, { readonly: true });
  } catch (err) {
    return { scope: null, db: null, error: `open DB failed (${config.DB_PATH}): ${err && err.message ? err.message : err}` };
  }
  try {
    const ch = db
      .prepare('SELECT ChannelId, ProfileId FROM Channels ORDER BY ChannelId LIMIT 1')
      .get();
    const scope = ch
      ? { channelId: ch.ChannelId, profileId: ch.ProfileId }
      : { channelId: CHANNEL_ID, profileId: 1 };
    return { scope, db, error: null };
  } catch (err) {
    safeCloseDb(db);
    return { scope: null, db: null, error: `read Channels failed: ${err && err.message ? err.message : err}` };
  }
}

/** Read one DynamicSettings value (raw key, quoted identifiers). null if absent. */
function dbValue(db, channelId, profileId, key) {
  const r = db
    .prepare('SELECT "Value" FROM "DynamicSettings" WHERE "ChannelId"=? AND "ProfileId"=? AND "Key"=? LIMIT 1')
    .get(channelId, profileId, key);
  return r ? r.Value : null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = {
  name: 'chain-settings',
  area: AREA,
  needsBackend: true,

  async run(ctx) {
    const { config, http, connectSocket } = ctx;
    const results = [];

    let widget = null;
    let db = null;

    try {
      // ── 0. Resolve scope + open the DB read handle (reused for the value read).
      //    A DB failure is NOT fatal: the HTTP + broadcast steps still run; only
      //    the DB-persist step degrades to SKIP with the reason.
      const opened = openScope(config);
      const scope = opened.scope;
      db = opened.db;
      const dbError = opened.error;

      // Snapshot the original value (for cleanup restore) when the DB is readable.
      let original = null;
      if (scope && db) {
        try {
          original = dbValue(db, scope.channelId, scope.profileId, KEY_DB);
        } catch (_) {
          original = null;
        }
      }

      // ── Step 1: open a widget socket + login (handshake). ────────────────────
      try {
        widget = await connectSocket(config.BASE_URL, {
          channelId: CHANNEL_ID,
          appType: 'widget',
          timeoutMs: CONNECT_TIMEOUT_MS,
        });
        results.push(
          row(
            'chain.settings.socket',
            'widget socket login',
            'PASS',
            `widget socket connected + login ok on channelId=${CHANNEL_ID}`,
            'CRITICAL',
            'Gate 35'
          )
        );
      } catch (err) {
        results.push(
          row(
            'chain.settings.socket',
            'widget socket login',
            'FAIL',
            `widget socket connect rejected: ${err && err.message ? err.message : String(err)}`,
            'CRITICAL',
            'Gate 35',
            'Verify the backend Socket.IO server accepts ws on /socket.io/ (EIO=4) and handleLogin sets channelId for appType=widget.'
          )
        );
        // No socket → broadcast step cannot be verified; mark it SKIP and stop the
        // socket-dependent path, but STILL run HTTP + DB so we get partial signal.
      }

      // Subscribe-then-trigger: register the waiter BEFORE the POST so the
      // (post-debounce) broadcast can't beat the listener. waitFor also looks
      // back via `since`, closing the race window either way.
      const since = Date.now();
      const broadcastWaiter = widget
        ? widget.waitFor('widgetSettings', BROADCAST_WAIT_MS, since)
        : null;

      // ── Step 2: POST /api/updateSettings with the lowercase trap key. ────────
      let httpOk = false;
      try {
        const res = await http.post('/api/updateSettings', { [KEY_DB]: VALUE });
        const j = res.json;
        // Contract: 200 with {status:200, message:'OK'} (settings.js:98).
        const bodyOk = j != null && (j.status === 200 || j.message === 'OK');
        if (res.status === 200 && bodyOk) {
          httpOk = true;
          results.push(
            row(
              'chain.settings.http',
              'POST /api/updateSettings',
              'PASS',
              `POST ${KEY_DB}=${VALUE} → 200 {status:${j.status}, message:'${j.message}'} (${res.ms}ms)`,
              'HIGH',
              'Gate 35'
            )
          );
        } else if (res.status === 0) {
          results.push(
            row(
              'chain.settings.http',
              'POST /api/updateSettings',
              'SKIP',
              `unreachable: ${res.error || 'no response'}`,
              'HIGH',
              'Gate 35'
            )
          );
        } else {
          results.push(
            row(
              'chain.settings.http',
              'POST /api/updateSettings',
              'FAIL',
              `POST ${KEY_DB}=${VALUE} → ${res.status} (expected 200 {status:200,message:'OK'}); body=${(res.text || '').slice(0, 120)}`,
              'HIGH',
              'Gate 35',
              'Check routes/settings.js POST /updateSettings — mount at /api (index.js) and resolveChannelId default channel.'
            )
          );
        }
      } catch (err) {
        results.push(
          row(
            'chain.settings.http',
            'POST /api/updateSettings',
            'FAIL',
            `POST threw: ${err && err.message ? err.message : String(err)}`,
            'HIGH',
            'Gate 35'
          )
        );
      }

      // ── Step 3: DB persist — let the write settle, then read the raw row. ─────
      await sleep(DB_SETTLE_MS);
      if (!scope || !db) {
        results.push(
          row(
            'chain.settings.db',
            'DB persist (DynamicSettings)',
            'SKIP',
            `DB read unavailable — ${dbError || 'no scope/handle'}`,
            'HIGH',
            'Gate 35'
          )
        );
      } else if (!httpOk) {
        results.push(
          row(
            'chain.settings.db',
            'DB persist (DynamicSettings)',
            'SKIP',
            'POST did not return 200 — DB persist not meaningful to assert',
            'HIGH',
            'Gate 35'
          )
        );
      } else {
        try {
          const stored = dbValue(db, scope.channelId, scope.profileId, KEY_DB);
          if (String(stored) === VALUE) {
            results.push(
              row(
                'chain.settings.db',
                'DB persist (DynamicSettings)',
                'PASS',
                `row ${KEY_DB} (cid=${scope.channelId},pid=${scope.profileId}) = '${stored}' === posted '${VALUE}'`,
                'HIGH',
                'Gate 35'
              )
            );
          } else {
            results.push(
              row(
                'chain.settings.db',
                'DB persist (DynamicSettings)',
                'FAIL',
                `row ${KEY_DB} = '${stored}' (expected '${VALUE}') — POST did not persist`,
                'HIGH',
                'Gate 35',
                'Check DB_PATH resolution (tikfinity-data/ segment) + dynamicSettings.writeMany + resolveChannelId/resolveProfileId in routes/settings.js.'
              )
            );
          }
        } catch (err) {
          results.push(
            row(
              'chain.settings.db',
              'DB persist (DynamicSettings)',
              'FAIL',
              `DB read threw: ${err && err.message ? err.message : String(err)}`,
              'HIGH',
              'Gate 35'
            )
          );
        }
      }

      // ── Step 4: broadcast — widget must receive widgetSettings w/ the value. ──
      if (!widget) {
        results.push(
          row(
            'chain.settings.broadcast',
            'widgetSettings broadcast',
            'SKIP',
            'no widget socket (handshake failed) — cannot assert broadcast',
            'HIGH',
            'Gate 35'
          )
        );
      } else if (!httpOk) {
        results.push(
          row(
            'chain.settings.broadcast',
            'widgetSettings broadcast',
            'SKIP',
            'POST did not return 200 — broadcast not meaningful to assert',
            'HIGH',
            'Gate 35'
          )
        );
      } else {
        try {
          const payload = await broadcastWaiter;
          if (payload && typeof payload === 'object' && String(payload[KEY_WIDGET]) === VALUE) {
            results.push(
              row(
                'chain.settings.broadcast',
                'widgetSettings broadcast',
                'PASS',
                `widget received widgetSettings with ${KEY_WIDGET}=${payload[KEY_WIDGET]} (matches posted ${VALUE})`,
                'HIGH',
                'Gate 35'
              )
            );
          } else if (payload && typeof payload === 'object') {
            results.push(
              row(
                'chain.settings.broadcast',
                'widgetSettings broadcast',
                'FAIL',
                `widgetSettings arrived but ${KEY_WIDGET}=${payload[KEY_WIDGET]} (expected ${VALUE}) — normalizeKey / case-dup / debounce?`,
                'HIGH',
                'Gate 35',
                'Check widget-settings-cache normalizeKey (widget_ strip → DEFAULTS canonical) + buildMerged case-dup handling.'
              )
            );
          } else {
            results.push(
              row(
                'chain.settings.broadcast',
                'widgetSettings broadcast',
                'FAIL',
                `no widgetSettings received within ${BROADCAST_WAIT_MS}ms after POST (debounce ${250}ms)`,
                'HIGH',
                'Gate 35',
                'Check rebuildAndBroadcast → broadcastToChannel(widgetSettings,...,channelId,"widget") and the socket appType=widget filter.'
              )
            );
          }
        } catch (err) {
          results.push(
            row(
              'chain.settings.broadcast',
              'widgetSettings broadcast',
              'FAIL',
              `broadcast wait threw: ${err && err.message ? err.message : String(err)}`,
              'HIGH',
              'Gate 35'
            )
          );
        }
      }

      // ── Cleanup: restore the original value (best-effort; never affects result).
      if (httpOk) {
        try {
          await http.post('/api/updateSettings', { [KEY_DB]: original != null ? String(original) : '50' });
        } catch (_) {
          /* cleanup best-effort */
        }
      }
    } catch (err) {
      // Defensive: any unexpected throw becomes ONE FAIL row, never propagates.
      results.push(
        row(
          'chain.settings.crash',
          'settings chain',
          'FAIL',
          `chain threw unexpectedly: ${err && err.message ? err.message : String(err)}`,
          'HIGH',
          'Gate 35'
        )
      );
    } finally {
      safeCloseSocket(widget);
      safeCloseDb(db);
    }

    const pass = results.filter((r) => r.status === 'PASS').length;
    const fail = results.filter((r) => r.status === 'FAIL').length;
    const skip = results.filter((r) => r.status === 'SKIP').length;

    return {
      results,
      metrics: { chain: 'settings', steps: results.length, pass, fail, skip },
    };
  },
};
