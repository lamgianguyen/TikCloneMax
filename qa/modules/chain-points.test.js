// qa/modules/chain-points.test.js — Chain 3: points (PUT transaction → readback
// → leaderboard). Functional end-to-end test of the manual points-grant chain +
// the M-013 userId⇆username identity-map readback (the bug where rest/channeluser
// returned [] so every awarded balance read back 0).
//
// Ground truth (verified against current source):
//   - Manual grant path the bundle uses = PUT /api/rest/transaction
//     (routes/data.js:110), NOT /api/points/user/:username. We test the
//     transaction path as primary.
//   - On grant the backend does getBalance + delta → setBalance
//     (services/points.js:53) and recordIdentity userId→username
//     (points.js:97). Balance stored as DynamicSettings row
//     `points_user_<lowercased username>` @ ProfileId=1, value formatted by
//     formatBalance (integer → plain "1234"). Identity stored as
//     `pointsmeta_<lowercased username>` = JSON {userId,nickname,thumbnailUrl}.
//   - Readback: GET /api/rest/channeluser?userId= resolves via
//     points.getChannelUser → findUsernameByUserId (scans pointsmeta_* rows).
//   - Leaderboard: GET /api/points/leaderboard?limit= (points.js:20),
//     listLeaderboard filters balance>0.
//   - No auth needed: resolveChannelId → channels.findDefault() (cid=1 single-channel).
//
// Each step is wrapped so a partial failure is ONE FAIL row, never a throw.
// run() never throws. The read-only DB handle is always closed in finally.
// A UNIQUE random username per run avoids cross-run collision; cleanup zeroes the
// balance via PUT amount:-<granted> (passes validation since next===0 is not <0).

const AREA = 'Chain';
const CHANNEL_ID = 1;
const GRANT_AMOUNT = 1234; // integer → stored verbatim as "1234"

/** Build a uniform result row (mirrors socket-relay.test.js::row). */
function row(id, name, status, evidence, severity, gate, fixHint) {
  return { id, area: AREA, name, status, evidence, severity, gate, fixHint };
}

/** Resolve a dot/bracket-free nested value defensively (no throw). */
function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Read the active {channelId, profileId} once from the live DB, exactly like
 * test-settings-chain.js::activeScope. READ-ONLY + always closed. Returns the
 * cid=1 default if the DB can't be opened (the route resolves the same default).
 */
function activeScope(config) {
  let db = null;
  try {
    const Database = config.requireBackend('better-sqlite3');
    db = new Database(config.DB_PATH, { readonly: true });
    const ch = db
      .prepare('SELECT ChannelId, ProfileId FROM Channels ORDER BY ChannelId LIMIT 1')
      .get();
    if (ch) return { channelId: ch.ChannelId, profileId: ch.ProfileId, dbOk: true };
    return { channelId: CHANNEL_ID, profileId: 1, dbOk: true };
  } catch (err) {
    return {
      channelId: CHANNEL_ID,
      profileId: 1,
      dbOk: false,
      dbError: err && err.message ? err.message : String(err),
    };
  } finally {
    try {
      if (db) db.close();
    } catch (_) {
      /* already closed */
    }
  }
}

/** Read a single DynamicSettings Value (read-only, always closes). null on miss/error. */
function dbValue(config, channelId, profileId, key) {
  let db = null;
  try {
    const Database = config.requireBackend('better-sqlite3');
    db = new Database(config.DB_PATH, { readonly: true });
    const r = db
      .prepare(
        'SELECT "Value" FROM "DynamicSettings" WHERE "ChannelId"=? AND "ProfileId"=? AND "Key"=? LIMIT 1'
      )
      .get(channelId, profileId, key);
    return r ? r.Value : null;
  } catch (_) {
    return null;
  } finally {
    try {
      if (db) db.close();
    } catch (_) {
      /* noop */
    }
  }
}

module.exports = {
  name: 'chain-points',
  area: AREA,
  needsBackend: true,

  async run(ctx) {
    const { http, config } = ctx;
    const results = [];

    // Unique-per-run identity so concurrent/repeat runs never collide.
    const rand = Math.random().toString(36).slice(2, 8);
    const username = `qa_pts_${rand}`; // already lowercase → DB key = points_user_qa_pts_<rand>
    const userId = `99${Date.now()}`; // numeric-string userId, unique per run
    const nickname = 'QA Viewer';
    const balanceKey = `points_user_${username}`;
    const metaKey = `pointsmeta_${username}`;

    const scope = activeScope(config);
    const { channelId, profileId } = scope;
    let granted = false; // track whether we owe a cleanup deduction

    // ── Step 1: PUT /api/rest/transaction — manual grant ─────────────────────
    try {
      const res = await http.put('/api/rest/transaction', {
        userId,
        username,
        nickname,
        amount: GRANT_AMOUNT,
        isManual: true,
      });
      if (res.status === 0) {
        results.push(
          row('chain.points.grant', 'PUT rest/transaction', 'SKIP',
            `unreachable: ${res.error || 'no response'}`, 'HIGH', 'Chain3')
        );
      } else if (res.status !== 200) {
        results.push(
          row('chain.points.grant', 'PUT rest/transaction', 'FAIL',
            `PUT /api/rest/transaction → ${res.status} (expected 200)`, 'HIGH', 'Chain3',
            'Check routes/data.js:110 PUT /rest/transaction is mounted via app.use("/api", dataRouter).')
        );
      } else {
        const j = res.json || {};
        const ok =
          j.preBalanceValidationPassed === true &&
          j.transaction && num(j.transaction.amount) === GRANT_AMOUNT &&
          j.channeluser && num(j.channeluser.totalAmount) === GRANT_AMOUNT &&
          num(j.channeluser.totalRewardAmount) === GRANT_AMOUNT;
        if (ok) {
          granted = true;
          results.push(
            row('chain.points.grant', 'PUT rest/transaction', 'PASS',
              `grant ${GRANT_AMOUNT} → preBalanceValidationPassed, transaction.amount + channeluser.totalAmount/totalRewardAmount = ${GRANT_AMOUNT}`,
              'HIGH', 'Chain3')
          );
        } else {
          // Even on shape mismatch, a 200 likely means the balance was written —
          // mark granted so cleanup still fires.
          granted = j.preBalanceValidationPassed === true;
          results.push(
            row('chain.points.grant', 'PUT rest/transaction', 'FAIL',
              `200 but shape mismatch: preBalanceValidationPassed=${j.preBalanceValidationPassed}, transaction.amount=${j.transaction && j.transaction.amount}, channeluser.totalAmount=${j.channeluser && j.channeluser.totalAmount}, totalRewardAmount=${j.channeluser && j.channeluser.totalRewardAmount}`,
              'HIGH', 'Chain3',
              'routes/data.js:146 must return preBalanceValidationPassed:true + transaction.amount + channeluser.totalAmount/totalRewardAmount.')
          );
        }
      }
    } catch (err) {
      results.push(
        row('chain.points.grant', 'PUT rest/transaction', 'FAIL',
          `step threw: ${err && err.message ? err.message : String(err)}`, 'HIGH', 'Chain3')
      );
    }

    // ── Step 2: DB persist — balance + identity rows ─────────────────────────
    // Only assert persistence when the grant actually succeeded — otherwise a
    // degraded run (backend reachable for DB but the grant step failed) would
    // emit a misleading FAIL for an absent row.
    if (!granted) {
      results.push(
        row('chain.points.db', 'DB persist (balance + identity)', 'SKIP',
          'grant step did not confirm → nothing expected in DB', 'MEDIUM', 'Chain3')
      );
    } else if (!scope.dbOk) {
      results.push(
        row('chain.points.db', 'DB persist (balance + identity)', 'SKIP',
          `DB unreadable: ${scope.dbError || 'unknown'} (path=${config.DB_PATH})`, 'MEDIUM', 'Chain3')
      );
    } else {
      try {
        const balVal = dbValue(config, channelId, profileId, balanceKey);
        const metaVal = dbValue(config, channelId, profileId, metaKey);
        let metaUserId = null;
        if (metaVal) {
          try { metaUserId = (JSON.parse(metaVal) || {}).userId; } catch (_) { metaUserId = null; }
        }
        const balOk = String(balVal) === String(GRANT_AMOUNT);
        const metaOk = metaVal != null && String(metaUserId) === String(userId);
        if (balOk && metaOk) {
          results.push(
            row('chain.points.db', 'DB persist (balance + identity)', 'PASS',
              `${balanceKey}=${balVal} and ${metaKey}.userId=${metaUserId} (cid=${channelId} pid=${profileId})`,
              'MEDIUM', 'Chain3')
          );
        } else {
          results.push(
            row('chain.points.db', 'DB persist (balance + identity)', 'FAIL',
              `${balanceKey}=${balVal} (want ${GRANT_AMOUNT}); ${metaKey}.userId=${metaUserId} (want ${userId})`,
              'MEDIUM', 'Chain3',
              'services/points.js setBalance writes points_user_<username>@ProfileId=1; recordIdentity writes pointsmeta_<username> JSON.userId.')
          );
        }
      } catch (err) {
        results.push(
          row('chain.points.db', 'DB persist (balance + identity)', 'FAIL',
            `DB read threw: ${err && err.message ? err.message : String(err)}`, 'MEDIUM', 'Chain3')
        );
      }
    }

    // ── Step 3: readback by userId (the M-013 fix) ───────────────────────────
    try {
      const res = await http.get(
        `/api/rest/channeluser?userId=${encodeURIComponent(userId)}`
      );
      if (res.status === 0) {
        results.push(
          row('chain.points.readback.userid', 'GET rest/channeluser?userId', 'SKIP',
            `unreachable: ${res.error || 'no response'}`, 'HIGH', 'Chain3 (M-013)')
        );
      } else if (res.status !== 200) {
        results.push(
          row('chain.points.readback.userid', 'GET rest/channeluser?userId', 'FAIL',
            `→ ${res.status} (expected 200)`, 'HIGH', 'Chain3 (M-013)')
        );
      } else {
        const list = (res.json && Array.isArray(res.json.channelusers)) ? res.json.channelusers : [];
        const cu = list[0];
        const ok = cu && num(cu.totalAmount) === GRANT_AMOUNT && cu.username === username;
        if (ok) {
          results.push(
            row('chain.points.readback.userid', 'GET rest/channeluser?userId', 'PASS',
              `userId=${userId} → channelusers[0]={username:${cu.username}, totalAmount:${cu.totalAmount}}`,
              'HIGH', 'Chain3 (M-013)')
          );
        } else {
          results.push(
            row('chain.points.readback.userid', 'GET rest/channeluser?userId', 'FAIL',
              `userId=${userId} → ${list.length} row(s); got ${cu ? `{username:${cu.username}, totalAmount:${cu.totalAmount}}` : 'none'} (want totalAmount ${GRANT_AMOUNT})`,
              'HIGH', 'Chain3 (M-013)',
              'rest/channeluser?userId must resolve via points.getChannelUser → findUsernameByUserId scanning pointsmeta_* (data.js:185 / points.js:189). Empty [] = the M-013 regression returned.')
          );
        }
      }
    } catch (err) {
      results.push(
        row('chain.points.readback.userid', 'GET rest/channeluser?userId', 'FAIL',
          `step threw: ${err && err.message ? err.message : String(err)}`, 'HIGH', 'Chain3 (M-013)')
      );
    }

    // ── Step 4: readback by username (alt resolution path) ───────────────────
    try {
      const res = await http.get(
        `/api/rest/channeluser?username=${encodeURIComponent(username)}`
      );
      if (res.status === 0) {
        results.push(
          row('chain.points.readback.username', 'GET rest/channeluser?username', 'SKIP',
            `unreachable: ${res.error || 'no response'}`, 'MEDIUM', 'Chain3')
        );
      } else if (res.status !== 200) {
        results.push(
          row('chain.points.readback.username', 'GET rest/channeluser?username', 'FAIL',
            `→ ${res.status} (expected 200)`, 'MEDIUM', 'Chain3')
        );
      } else {
        const list = (res.json && Array.isArray(res.json.channelusers)) ? res.json.channelusers : [];
        const cu = list[0];
        const ok = cu && num(cu.totalAmount) === GRANT_AMOUNT && cu.username === username;
        if (ok) {
          results.push(
            row('chain.points.readback.username', 'GET rest/channeluser?username', 'PASS',
              `username=${username} → totalAmount:${cu.totalAmount}`, 'MEDIUM', 'Chain3')
          );
        } else {
          results.push(
            row('chain.points.readback.username', 'GET rest/channeluser?username', 'FAIL',
              `username=${username} → ${list.length} row(s); got ${cu ? `totalAmount:${cu.totalAmount}` : 'none'} (want ${GRANT_AMOUNT})`,
              'MEDIUM', 'Chain3',
              'rest/channeluser?username resolves via points.getChannelUser (data.js:185 / points.js:189).')
          );
        }
      }
    } catch (err) {
      results.push(
        row('chain.points.readback.username', 'GET rest/channeluser?username', 'FAIL',
          `step threw: ${err && err.message ? err.message : String(err)}`, 'MEDIUM', 'Chain3')
      );
    }

    // ── Step 5: OData channeluser grid ───────────────────────────────────────
    try {
      const res = await http.get('/api/odata/channeluser');
      if (res.status === 0) {
        results.push(
          row('chain.points.odata', 'GET odata/channeluser', 'SKIP',
            `unreachable: ${res.error || 'no response'}`, 'LOW', 'Chain3')
        );
      } else if (res.status !== 200) {
        results.push(
          row('chain.points.odata', 'GET odata/channeluser', 'FAIL',
            `→ ${res.status} (expected 200)`, 'LOW', 'Chain3')
        );
      } else {
        const value = (res.json && Array.isArray(res.json.value)) ? res.json.value : [];
        const count = res.json ? res.json['@odata.count'] : undefined;
        const mine = value.find((v) => v && v.username === username && num(v.totalAmount) === GRANT_AMOUNT);
        if (mine && num(count) >= 1) {
          results.push(
            row('chain.points.odata', 'GET odata/channeluser', 'PASS',
              `value[] contains {username:${username}, totalAmount:${GRANT_AMOUNT}}, @odata.count=${count}`,
              'LOW', 'Chain3')
          );
        } else {
          results.push(
            row('chain.points.odata', 'GET odata/channeluser', 'FAIL',
              `value has ${value.length} row(s), @odata.count=${count}; viewer ${username}@${GRANT_AMOUNT} ${mine ? 'present' : 'MISSING'}`,
              'LOW', 'Chain3',
              'data.js:174 odata/channeluser → points.listChannelUsers; ensure value[] + @odata.count surface the balance.')
          );
        }
      }
    } catch (err) {
      results.push(
        row('chain.points.odata', 'GET odata/channeluser', 'FAIL',
          `step threw: ${err && err.message ? err.message : String(err)}`, 'LOW', 'Chain3')
      );
    }

    // ── Step 6: leaderboard ──────────────────────────────────────────────────
    try {
      const res = await http.get('/api/points/leaderboard?limit=500');
      if (res.status === 0) {
        results.push(
          row('chain.points.leaderboard', 'GET points/leaderboard', 'SKIP',
            `unreachable: ${res.error || 'no response'}`, 'LOW', 'Chain3')
        );
      } else if (res.status !== 200) {
        results.push(
          row('chain.points.leaderboard', 'GET points/leaderboard', 'FAIL',
            `→ ${res.status} (expected 200)`, 'LOW', 'Chain3')
        );
      } else {
        const lb = (res.json && Array.isArray(res.json.leaderboard)) ? res.json.leaderboard : [];
        const mine = lb.find((x) => x && x.username === username && num(x.balance) === GRANT_AMOUNT);
        if (mine) {
          results.push(
            row('chain.points.leaderboard', 'GET points/leaderboard', 'PASS',
              `leaderboard[] contains {username:${username}, balance:${GRANT_AMOUNT}} (${lb.length} entries)`,
              'LOW', 'Chain3')
          );
        } else {
          results.push(
            row('chain.points.leaderboard', 'GET points/leaderboard', 'FAIL',
              `leaderboard has ${lb.length} entr${lb.length === 1 ? 'y' : 'ies'}; ${username}@${GRANT_AMOUNT} MISSING`,
              'LOW', 'Chain3',
              'points.js:20 listLeaderboard filters balance>0 over points_user_* rows.')
          );
        }
      }
    } catch (err) {
      results.push(
        row('chain.points.leaderboard', 'GET points/leaderboard', 'FAIL',
          `step threw: ${err && err.message ? err.message : String(err)}`, 'LOW', 'Chain3')
      );
    }

    // ── Client-side-only parts (annotated SKIP) ──────────────────────────────
    results.push(
      row('chain.points.clientside', '!points / wheel / transfer (bundle-side)', 'SKIP',
        'The !points chat-command read + wheel-spin / transfer cost-checks are bundle-side (decompiled/modules:4205/9256/14684). They consume the SAME endpoints asserted in steps 3-6, so the backend contract IS covered here; the client logic itself is not headless-testable.',
        'LOW', 'Chain3')
    );

    // ── Cleanup: zero the balance via PUT amount:-granted ────────────────────
    // (next===0 is not <0, so validation passes). DB is opened READ-ONLY by the
    // harness, so cleanup must go through HTTP — there is no row-delete here.
    if (granted) {
      try {
        const res = await http.put('/api/rest/transaction', {
          userId,
          username,
          nickname,
          amount: -GRANT_AMOUNT,
          isManual: true,
        });
        const cleaned = res.status === 200 && res.json && res.json.preBalanceValidationPassed === true;
        results.push(
          row('chain.points.cleanup', 'cleanup (zero balance)', cleaned ? 'PASS' : 'SKIP',
            cleaned
              ? `deducted ${GRANT_AMOUNT} → balance 0 (leaderboard filters balance>0 so the viewer drops off)`
              : `cleanup deduction did not confirm (HTTP ${res.status}); row ${balanceKey} may linger at ${GRANT_AMOUNT} — harmless, unique-per-run username avoids collision`,
            'LOW', 'Chain3')
        );
      } catch (err) {
        results.push(
          row('chain.points.cleanup', 'cleanup (zero balance)', 'SKIP',
            `cleanup threw: ${err && err.message ? err.message : String(err)} — unique-per-run username avoids cross-run collision`,
            'LOW', 'Chain3')
        );
      }
    } else {
      results.push(
        row('chain.points.cleanup', 'cleanup (zero balance)', 'SKIP',
          'no grant confirmed → nothing to clean up', 'LOW', 'Chain3')
      );
    }

    return {
      results,
      metrics: {
        username,
        userId,
        grantAmount: GRANT_AMOUNT,
        dbReadable: scope.dbOk === true,
      },
    };
  },
};
