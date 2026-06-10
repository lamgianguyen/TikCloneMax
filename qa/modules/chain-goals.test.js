// qa/modules/chain-goals.test.js — Chain 4 (goals) functional end-to-end test.
//
// Feature: Goal CRUD + `goalsChanged` widget pulse. Exercises the FULL chain the
// real bundle drives, headless:
//   widget socket login  →  GET /api/goals  →  POST create  →  goalsChanged pulse
//   →  DB row (Target)    →  POST update     →  goalsChanged   →  DB row (Target')
//   →  POST /:id/reset    →  goalsChanged    →  DELETE /:id    →  goalsChanged
//   →  DB row gone.
//
// Ground truth (verified against current source):
//   * backend-node/src/routes/goals.js
//       GET  '/'            → { status:200, message:'OK', goals:[...] }        (goals.js:66)
//       POST '/'  (no id)   → create → { status:200, id:newId }               (goals.js:97-107)
//       POST '/'  (with id) → patch  → { status:200, id }                     (goals.js:82-94)
//       POST '/:id/reset'   → Current=0 → { status:200 }                      (goals.js:123-134)
//       DELETE '/:id'       → remove → { status:200 }                         (goals.js:110-121)
//       validation: missing type → 400 {error}; target<=0 → 400 {error}       (goals.js:79-80)
//       every write → broadcastGoalsChanged →
//         broadcastToChannel('goalsChanged', {channelId}, channelId, 'widget') (goals.js:45-47)
//     Mounted at /api/goals via app.use('/api/goals', goalsRouter) (index.js:242).
//   * backend-node/src/db/models/goals.js — Goals table cols
//       ChannelId,ProfileId,Name,Type,Target,Current,Enabled,CreatedAt;
//       Enabled stored 0/1; ordered by Id DESC; ProfileId from Channels.ProfileId.
//
// channelId resolves to the default channel (cid=1, single-channel clone) via
// resolveChannelId → channels.findDefault() (goals.js:17-21). No auth header needed.
//
// MODULE CONTRACT: { name, area, needsBackend, run(ctx) } → { results:[...], metrics }.
// needsBackend:true → run-all SKIPs the whole module when the backend is down.
// Each step ALSO try/caught so a partial failure is ONE FAIL row, never a throw.
// Sockets + DB handles are ALWAYS closed in finally. run() NEVER throws.

const AREA = 'Chain';
const CHANNEL_ID = 1;
const CONNECT_TIMEOUT_MS = 8000; // socket connect+login handshake budget
const GOAL_NAME = 'E2E goal'; // unique-ish marker for our test row
const TARGET_CREATE = 500;
const TARGET_UPDATE = 999;

/** Build a uniform result row (mirrors socket-relay/api-contract row()). */
function row(id, name, status, evidence, severity, gate, fixHint) {
  return { id: `chain.goals.${id}`, area: AREA, name, status, evidence, severity, gate, fixHint };
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
function safeCloseDb(dbh) {
  try {
    if (dbh && typeof dbh.close === 'function') dbh.close();
  } catch (_) {
    /* already closed */
  }
}

/**
 * Read the active channel/profile scope from the LIVE db, read-only, exactly like
 * test-settings-chain.js:62-67. Falls back to {1,1} when the row/db is missing so a
 * scope read never aborts the chain. Returns { scope, dbReadable, note }.
 */
function readScope(config) {
  let Database;
  try {
    Database = config.requireBackend('better-sqlite3');
  } catch (e) {
    return { scope: { channelId: CHANNEL_ID, profileId: 1 }, dbReadable: false, note: `better-sqlite3 unavailable: ${e && e.message ? e.message : e}` };
  }
  let dbh = null;
  try {
    dbh = new Database(config.DB_PATH, { readonly: true });
    const ch = dbh.prepare('SELECT ChannelId, ProfileId FROM Channels ORDER BY ChannelId LIMIT 1').get();
    const scope = ch ? { channelId: ch.ChannelId, profileId: ch.ProfileId } : { channelId: CHANNEL_ID, profileId: 1 };
    return { scope, dbReadable: true, note: null };
  } catch (e) {
    return { scope: { channelId: CHANNEL_ID, profileId: 1 }, dbReadable: false, note: `db open/read failed: ${e && e.message ? e.message : e}` };
  } finally {
    safeCloseDb(dbh);
  }
}

/**
 * Read the Goals row for our test goal (by ChannelId+ProfileId+Name), read-only.
 * Returns { row|null, ok, note }. Never throws.
 */
function readGoalRow(config, scope) {
  let Database;
  try {
    Database = config.requireBackend('better-sqlite3');
  } catch (e) {
    return { row: null, ok: false, note: `better-sqlite3 unavailable: ${e && e.message ? e.message : e}` };
  }
  let dbh = null;
  try {
    dbh = new Database(config.DB_PATH, { readonly: true });
    const r = dbh
      .prepare('SELECT "Id","Name","Type","Target","Current","Enabled","ProfileId" FROM "Goals" WHERE "ChannelId"=? AND "ProfileId"=? AND "Name"=? ORDER BY "Id" DESC LIMIT 1')
      .get(scope.channelId, scope.profileId, GOAL_NAME);
    return { row: r || null, ok: true, note: null };
  } catch (e) {
    return { row: null, ok: false, note: `db read failed: ${e && e.message ? e.message : e}` };
  } finally {
    safeCloseDb(dbh);
  }
}

module.exports = {
  name: 'chain-goals',
  area: AREA,
  needsBackend: true,

  async run(ctx) {
    const { config, http, connectSocket } = ctx;
    const results = [];
    const socketBudgetMs = (config.THRESHOLDS && config.THRESHOLDS.socketDeliverMs) || 3000;

    let widget = null; // widget socket — kept open for the whole chain so each
    //                    write's goalsChanged pulse is observed by the same listener.
    let createdId = 0; // set after a successful create → drives update/reset/delete + cleanup.

    // Resolve scope once up front (read-only). Used for every DB assertion.
    const { scope, dbReadable, note: scopeNote } = readScope(config);

    try {
      // ── Step 0: widget socket login ────────────────────────────────────────
      // The harness connectSocket emits login on the SIO handshake and resolves
      // ~150ms later. We additionally wait for `loginResult` (tolerating its
      // absence — resolve already happened) to mirror test-settings-chain.js.
      try {
        widget = await connectSocket(config.BASE_URL, {
          channelId: CHANNEL_ID,
          appType: 'widget',
          timeoutMs: CONNECT_TIMEOUT_MS,
        });
        // Best-effort confirm login (do not fail the chain if the backend doesn't
        // echo loginResult — the relay assertions below are the real signal).
        await widget.waitFor('loginResult', 1500, 0);
        results.push(row('login', 'widget socket login', 'PASS',
          `widget socket connected + login emitted on channelId=${CHANNEL_ID}`,
          'CRITICAL', 'Gate 35'));
      } catch (err) {
        // No widget socket → broadcast steps can't be asserted, but HTTP+DB steps
        // still run. Mark login FAIL and continue (widget stays null → guarded).
        results.push(row('login', 'widget socket login', 'FAIL',
          `socket connect/login failed: ${err && err.message ? err.message : String(err)}`,
          'CRITICAL', 'Gate 35',
          'Verify backend Socket.IO is up on /socket.io/ (EIO=4) and accepts appType=widget login.'));
        widget = null;
      }

      // ── Step 1: GET /api/goals — list contract ─────────────────────────────
      try {
        const res = await http.get('/api/goals');
        const okStatus = res.status === 200;
        const hasGoals = res.json && Array.isArray(res.json.goals);
        if (okStatus && hasGoals) {
          results.push(row('list', 'GET /api/goals', 'PASS',
            `200 OK, goals[] present (${res.json.goals.length} existing) in ${res.ms}ms`,
            'MEDIUM', 'Chain 4'));
        } else {
          results.push(row('list', 'GET /api/goals', 'FAIL',
            `expected 200 + goals[]; got status=${res.status} goalsIsArray=${hasGoals} body=${(res.text || '').slice(0, 120)}`,
            'MEDIUM', 'Chain 4',
            'Check goals.js router.get("/") returns { status:200, message:"OK", goals:[...] }.'));
        }
      } catch (err) {
        results.push(row('list', 'GET /api/goals', 'FAIL',
          `request threw: ${err && err.message ? err.message : String(err)}`, 'MEDIUM', 'Chain 4'));
      }

      // ── Step 2: validation — missing type → 400, target<=0 → 400 ───────────
      try {
        const noType = await http.post('/api/goals', { target: 100, name: 'should-fail-no-type' });
        const badTarget = await http.post('/api/goals', { type: 'gifts', target: 0, name: 'should-fail-zero-target' });
        if (noType.status === 400 && badTarget.status === 400) {
          results.push(row('validate', 'POST /api/goals validation', 'PASS',
            'missing-type → 400 and target<=0 → 400 (both rejected as expected)',
            'MEDIUM', 'Chain 4'));
        } else {
          results.push(row('validate', 'POST /api/goals validation', 'FAIL',
            `expected 400/400; got missingType=${noType.status} zeroTarget=${badTarget.status}`,
            'MEDIUM', 'Chain 4',
            'Check goals.js:79-80 — `if (!type) 400` and `if (target<=0) 400`.'));
        }
      } catch (err) {
        results.push(row('validate', 'POST /api/goals validation', 'FAIL',
          `request threw: ${err && err.message ? err.message : String(err)}`, 'MEDIUM', 'Chain 4'));
      }

      // ── Step 3: CREATE (POST '/' no id) → {status:200, id} + goalsChanged ───
      try {
        const since = Date.now();
        const waiter = widget ? widget.waitFor('goalsChanged', socketBudgetMs, since) : null;
        const res = await http.post('/api/goals', {
          type: 'gifts', target: TARGET_CREATE, name: GOAL_NAME, enabled: true,
        });
        const okStatus = res.status === 200;
        const newId = res.json && Number(res.json.id);
        if (okStatus && Number.isFinite(newId) && newId > 0) {
          createdId = newId;
          results.push(row('create', 'POST /api/goals create', 'PASS',
            `created goal id=${newId} (target=${TARGET_CREATE}) → 200 in ${res.ms}ms`,
            'HIGH', 'Chain 4'));
        } else {
          results.push(row('create', 'POST /api/goals create', 'FAIL',
            `expected 200 + numeric id; got status=${res.status} id=${res.json && res.json.id} body=${(res.text || '').slice(0, 120)}`,
            'HIGH', 'Chain 4',
            'Check goals.js:97-107 create path returns { status:200, id:newId }.'));
        }

        // goalsChanged pulse (widget-scoped). Only assertable when the socket is up.
        if (waiter) {
          const t0 = Date.now();
          const got = await waiter;
          const ms = Date.now() - t0;
          if (got !== null && got !== undefined) {
            results.push(row('create.broadcast', 'goalsChanged (create)', 'PASS',
              `widget received goalsChanged in ${ms}ms (budget ${socketBudgetMs}ms)`,
              'HIGH', 'Gate 35'));
          } else {
            results.push(row('create.broadcast', 'goalsChanged (create)', 'FAIL',
              `widget did not receive goalsChanged within ${socketBudgetMs}ms after create`,
              'HIGH', 'Gate 35',
              "Check broadcastGoalsChanged → broadcastToChannel('goalsChanged',{channelId},cid,'widget') and RELAYABLE filter / appType=widget."));
          }
        } else {
          results.push(row('create.broadcast', 'goalsChanged (create)', 'SKIP',
            'widget socket not connected — cannot assert goalsChanged pulse', 'LOW', 'Gate 35'));
        }
      } catch (err) {
        results.push(row('create', 'POST /api/goals create', 'FAIL',
          `request threw: ${err && err.message ? err.message : String(err)}`, 'HIGH', 'Chain 4'));
      }

      // ── Step 4: DB persist after create — Target=500 ───────────────────────
      if (createdId > 0) {
        if (dbReadable) {
          const { row: gRow, ok, note } = readGoalRow(config, scope);
          if (ok && gRow && Number(gRow.Target) === TARGET_CREATE && Number(gRow.Id) === createdId) {
            results.push(row('create.db', 'Goals row after create', 'PASS',
              `DB Goals row Id=${gRow.Id} Name='${gRow.Name}' Target=${gRow.Target} Enabled=${gRow.Enabled} ProfileId=${gRow.ProfileId}`,
              'HIGH', 'Chain 4'));
          } else if (ok && gRow) {
            results.push(row('create.db', 'Goals row after create', 'FAIL',
              `row found but mismatched: Id=${gRow.Id} (want ${createdId}) Target=${gRow.Target} (want ${TARGET_CREATE})`,
              'HIGH', 'Chain 4',
              'Check goals model create() writes Target + the route resolveProfileId matches the scope read.'));
          } else {
            results.push(row('create.db', 'Goals row after create', 'FAIL',
              `Goals row not found for Name='${GOAL_NAME}' ChannelId=${scope.channelId} ProfileId=${scope.profileId}${note ? ` (${note})` : ''}`,
              'HIGH', 'Chain 4',
              'Verify DB_PATH resolves to the live DB (config.js) and ProfileId scope matches the route.'));
          }
        } else {
          results.push(row('create.db', 'Goals row after create', 'SKIP',
            `DB not readable — ${scopeNote || 'better-sqlite3/DB_PATH unavailable'}`, 'LOW', 'Chain 4'));
        }
      } else {
        results.push(row('create.db', 'Goals row after create', 'SKIP',
          'create did not return an id — nothing to verify in DB', 'LOW', 'Chain 4'));
      }

      // ── Step 5: UPDATE (POST '/' WITH id) → {status:200, id} + goalsChanged ─
      if (createdId > 0) {
        try {
          const since = Date.now();
          const waiter = widget ? widget.waitFor('goalsChanged', socketBudgetMs, since) : null;
          const res = await http.post('/api/goals', {
            id: createdId, type: 'gifts', target: TARGET_UPDATE, name: GOAL_NAME,
          });
          const okStatus = res.status === 200;
          const echoedId = res.json && Number(res.json.id) === createdId;
          if (okStatus && echoedId) {
            results.push(row('update', 'POST /api/goals update', 'PASS',
              `updated goal id=${createdId} target→${TARGET_UPDATE} → 200 in ${res.ms}ms`,
              'HIGH', 'Chain 4'));
          } else {
            results.push(row('update', 'POST /api/goals update', 'FAIL',
              `expected 200 + id=${createdId}; got status=${res.status} id=${res.json && res.json.id} body=${(res.text || '').slice(0, 120)}`,
              'HIGH', 'Chain 4',
              'Check goals.js:82-94 update path (id>0) patches + returns { status:200, id }.'));
          }

          if (waiter) {
            const t0 = Date.now();
            const got = await waiter;
            const ms = Date.now() - t0;
            if (got !== null && got !== undefined) {
              results.push(row('update.broadcast', 'goalsChanged (update)', 'PASS',
                `widget received 2nd goalsChanged in ${ms}ms (budget ${socketBudgetMs}ms)`,
                'HIGH', 'Gate 35'));
            } else {
              results.push(row('update.broadcast', 'goalsChanged (update)', 'FAIL',
                `widget did not receive goalsChanged within ${socketBudgetMs}ms after update`,
                'HIGH', 'Gate 35',
                "Check broadcastGoalsChanged fires on the update (id>0) path too."));
            }
          } else {
            results.push(row('update.broadcast', 'goalsChanged (update)', 'SKIP',
              'widget socket not connected — cannot assert goalsChanged pulse', 'LOW', 'Gate 35'));
          }
        } catch (err) {
          results.push(row('update', 'POST /api/goals update', 'FAIL',
            `request threw: ${err && err.message ? err.message : String(err)}`, 'HIGH', 'Chain 4'));
        }
      } else {
        results.push(row('update', 'POST /api/goals update', 'SKIP',
          'no created goal id — update skipped', 'LOW', 'Chain 4'));
        results.push(row('update.broadcast', 'goalsChanged (update)', 'SKIP',
          'no created goal id — update broadcast skipped', 'LOW', 'Gate 35'));
      }

      // ── Step 6: DB persist after update — Target=999 ───────────────────────
      if (createdId > 0) {
        if (dbReadable) {
          const { row: gRow, ok, note } = readGoalRow(config, scope);
          if (ok && gRow && Number(gRow.Target) === TARGET_UPDATE) {
            results.push(row('update.db', 'Goals row after update', 'PASS',
              `DB Goals row Id=${gRow.Id} Target=${gRow.Target} (updated from ${TARGET_CREATE})`,
              'HIGH', 'Chain 4'));
          } else {
            results.push(row('update.db', 'Goals row after update', 'FAIL',
              `expected Target=${TARGET_UPDATE}; got ${gRow ? gRow.Target : 'no row'}${note ? ` (${note})` : ''}`,
              'HIGH', 'Chain 4',
              'Check goals model patch() updates Target.'));
          }
        } else {
          results.push(row('update.db', 'Goals row after update', 'SKIP',
            `DB not readable — ${scopeNote || 'better-sqlite3/DB_PATH unavailable'}`, 'LOW', 'Chain 4'));
        }
      } else {
        results.push(row('update.db', 'Goals row after update', 'SKIP',
          'no created goal id — DB update check skipped', 'LOW', 'Chain 4'));
      }

      // ── Step 7: RESET (POST '/:id/reset') → {status:200} + goalsChanged ────
      // Optional reset path: sets Current=0 + broadcasts (goals.js:123-134).
      if (createdId > 0) {
        try {
          const since = Date.now();
          const waiter = widget ? widget.waitFor('goalsChanged', socketBudgetMs, since) : null;
          const res = await http.post(`/api/goals/${createdId}/reset`, {});
          if (res.status === 200) {
            results.push(row('reset', 'POST /api/goals/:id/reset', 'PASS',
              `reset goal id=${createdId} Current→0 → 200 in ${res.ms}ms`,
              'MEDIUM', 'Chain 4'));
          } else {
            results.push(row('reset', 'POST /api/goals/:id/reset', 'FAIL',
              `expected 200; got status=${res.status} body=${(res.text || '').slice(0, 120)}`,
              'MEDIUM', 'Chain 4',
              'Check goals.js:123-134 reset path patches Current=0 + returns { status:200 }.'));
          }
          if (waiter) {
            const got = await waiter;
            if (got !== null && got !== undefined) {
              results.push(row('reset.broadcast', 'goalsChanged (reset)', 'PASS',
                'widget received goalsChanged after reset', 'MEDIUM', 'Gate 35'));
            } else {
              results.push(row('reset.broadcast', 'goalsChanged (reset)', 'FAIL',
                `widget did not receive goalsChanged within ${socketBudgetMs}ms after reset`,
                'MEDIUM', 'Gate 35',
                'Check broadcastGoalsChanged fires on the reset path.'));
            }
          } else {
            results.push(row('reset.broadcast', 'goalsChanged (reset)', 'SKIP',
              'widget socket not connected — cannot assert goalsChanged pulse', 'LOW', 'Gate 35'));
          }
        } catch (err) {
          results.push(row('reset', 'POST /api/goals/:id/reset', 'FAIL',
            `request threw: ${err && err.message ? err.message : String(err)}`, 'MEDIUM', 'Chain 4'));
        }
      } else {
        results.push(row('reset', 'POST /api/goals/:id/reset', 'SKIP',
          'no created goal id — reset skipped', 'LOW', 'Chain 4'));
        results.push(row('reset.broadcast', 'goalsChanged (reset)', 'SKIP',
          'no created goal id — reset broadcast skipped', 'LOW', 'Gate 35'));
      }

      // ── Step 8: DELETE (cleanup) → {status:200} + goalsChanged + row gone ──
      // This is BOTH the delete-path assertion AND cleanup of our test row.
      if (createdId > 0) {
        try {
          const since = Date.now();
          const waiter = widget ? widget.waitFor('goalsChanged', socketBudgetMs, since) : null;
          const res = await http.del(`/api/goals/${createdId}`);
          if (res.status === 200) {
            results.push(row('delete', 'DELETE /api/goals/:id', 'PASS',
              `deleted goal id=${createdId} → 200 in ${res.ms}ms (cleanup)`,
              'HIGH', 'Chain 4'));
          } else {
            results.push(row('delete', 'DELETE /api/goals/:id', 'FAIL',
              `expected 200; got status=${res.status} body=${(res.text || '').slice(0, 120)} — TEST ROW MAY LINGER (id=${createdId})`,
              'HIGH', 'Chain 4',
              'Check goals.js:110-121 delete path removes the row + returns { status:200 }.'));
          }
          if (waiter) {
            const got = await waiter;
            if (got !== null && got !== undefined) {
              results.push(row('delete.broadcast', 'goalsChanged (delete)', 'PASS',
                'widget received goalsChanged after delete', 'MEDIUM', 'Gate 35'));
            } else {
              results.push(row('delete.broadcast', 'goalsChanged (delete)', 'FAIL',
                `widget did not receive goalsChanged within ${socketBudgetMs}ms after delete`,
                'MEDIUM', 'Gate 35',
                'Check broadcastGoalsChanged fires on the delete path.'));
            }
          } else {
            results.push(row('delete.broadcast', 'goalsChanged (delete)', 'SKIP',
              'widget socket not connected — cannot assert goalsChanged pulse', 'LOW', 'Gate 35'));
          }

          // Verify the row is actually gone (cleanup confirmation).
          if (dbReadable) {
            const { row: gRow, ok } = readGoalRow(config, scope);
            if (ok && !gRow) {
              results.push(row('delete.db', 'Goals row gone after delete', 'PASS',
                `no Goals row remains for Name='${GOAL_NAME}' (cleanup verified)`, 'HIGH', 'Chain 4'));
            } else if (ok && gRow) {
              results.push(row('delete.db', 'Goals row gone after delete', 'FAIL',
                `row STILL present after delete: Id=${gRow.Id} — leftover test data`,
                'HIGH', 'Chain 4',
                'Delete did not remove the row; goals model remove() may have failed.'));
            } else {
              results.push(row('delete.db', 'Goals row gone after delete', 'SKIP',
                'DB read failed — cannot confirm cleanup', 'LOW', 'Chain 4'));
            }
          } else {
            results.push(row('delete.db', 'Goals row gone after delete', 'SKIP',
              'DB not readable — cannot confirm cleanup', 'LOW', 'Chain 4'));
          }
        } catch (err) {
          results.push(row('delete', 'DELETE /api/goals/:id', 'FAIL',
            `request threw: ${err && err.message ? err.message : String(err)} — TEST ROW MAY LINGER (id=${createdId})`,
            'HIGH', 'Chain 4'));
        }
      } else {
        results.push(row('delete', 'DELETE /api/goals/:id', 'SKIP',
          'no created goal id — delete/cleanup skipped', 'LOW', 'Chain 4'));
      }

      // ── Client-side-only note (SKIP, documented) ───────────────────────────
      // tiktokBridge.refreshGoals(channelId) is a no-op/optional in-memory cache
      // drop (goals.js:53-57). The goal-widget visual fill (progress bar render)
      // is 100% widget client — not headless-testable here.
      results.push(row('clientside', 'goal-widget visual fill', 'SKIP',
        'goal-widget progress render is client-side (widget HTML); bridge.refreshGoals is an optional cache drop — not headless-testable',
        'LOW', 'Chain 4'));
    } catch (err) {
      // Defensive net — should be unreachable since every step is already guarded.
      results.push(row('chain', 'goals chain', 'FAIL',
        `unexpected chain error: ${err && err.message ? err.message : String(err)}`,
        'HIGH', 'Chain 4'));
    } finally {
      safeCloseSocket(widget);
    }

    // ── Best-effort cleanup safety net ────────────────────────────────────────
    // If DELETE never ran (e.g. createdId set but a throw before step 8) the row
    // could linger. Attempt one more delete, ignoring the outcome, so repeated
    // runs don't accumulate 'E2E goal' rows. Never throws.
    if (createdId > 0 && !results.some((r) => r.id === 'chain.goals.delete' && r.status === 'PASS')) {
      try {
        await http.del(`/api/goals/${createdId}`);
      } catch (_) {
        /* best-effort — nothing else to do */
      }
    }

    const pass = results.filter((r) => r.status === 'PASS').length;
    const fail = results.filter((r) => r.status === 'FAIL').length;
    const skip = results.filter((r) => r.status === 'SKIP').length;

    return {
      results,
      metrics: { steps: results.length, pass, fail, skip, createdId: createdId || null, channelId: scope.channelId },
    };
  },
};
