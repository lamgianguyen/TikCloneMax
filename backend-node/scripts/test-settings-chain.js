// test-settings-chain.js — end-to-end test of the overlay settings chain.
//
//   frontend POST /api/updateSettings  ->  DB persist  ->  socket broadcast  ->  widget receives
//
// Catches the whole "doi setting khong an" bug class in ONE command. Verified to
// catch BOTH confirmed root causes:
//   * RC1 (probe-path): reads the SAME DB file the running backend writes to,
//     resolved exactly like src/config.js (TIKMAX_DATA_DIR first, then APPDATA).
//     The old harness hardcoded .../tikfinity-desktop/tikfinity.db (missing the
//     tikfinity-data/ segment) -> read a stale 172KB file -> false FAIL.
//   * RC2 (key casing): POSTs the EXACT lowercase key the real bundle sends.
//     The bundle lowercases every settings key before save (settings.set,
//     decompiled/app/deobfuscated.js:68305) so it POSTs widget_cannon_ballsize
//     (all lowercase), NOT mixed-case widget_cannon_ballSize. Using mixed case
//     inserts a duplicate case-variant row that normalizeKey collapses onto the
//     same canonical key, and last-write-wins in buildMerged can shadow it.
//
// Dependency-free: speaks raw Engine.IO v4 + Socket.IO v4 over ws (already a dep
// of the backend). No socket.io-client needed.
//
// Requires the backend RUNNING (Electron app started -> port 5285).
//
//   node backend-node/scripts/test-settings-chain.js
//
// Exit 0 = PASS, 1 = FAIL (a step broke), 2 = harness error (backend down, etc).

const path = require("path");
const http = require("http");
const Database = require("better-sqlite3");
const WebSocket = require("ws");

const PORT = Number(process.env.TF_PORT) || 5285;

function resolveDbPath() {
  if (process.env.TIKMAX_DATA_DIR) return path.join(process.env.TIKMAX_DATA_DIR, "tikfinity.db");
  if (process.env.APPDATA) return path.join(process.env.APPDATA, "tikfinity-desktop", "tikfinity-data", "tikfinity.db");
  return path.resolve(__dirname, "..", "data", "tikfinity.db");
}
const DB_PATH = resolveDbPath();

const KEY_DB = "widget_cannon_ballsize";
const KEY_WIDGET = "cannon_ballSize";
const VALUE = String(60 + Math.floor(Math.random() * 39));

function fail(code, msg) { console.error("[harness] " + msg); process.exit(code); }

function httpPost(pathname, bodyObj) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bodyObj);
    const req = http.request(
      { host: "127.0.0.1", port: PORT, path: pathname, method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) } },
      (res) => { let d = ""; res.on("data", (c) => (d += c)); res.on("end", () => resolve({ status: res.statusCode, body: d })); }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function openDb() { return new Database(DB_PATH, { readonly: true }); }
function activeScope() {
  const db = openDb();
  const ch = db.prepare("SELECT ChannelId, ProfileId FROM Channels ORDER BY ChannelId LIMIT 1").get();
  db.close();
  return ch ? { channelId: ch.ChannelId, profileId: ch.ProfileId } : { channelId: 1, profileId: 1 };
}
function dbValue(channelId, profileId, key) {
  const db = openDb();
  const row = db.prepare(`SELECT "Value" FROM "DynamicSettings" WHERE "ChannelId"=? AND "ProfileId"=? AND "Key"=? LIMIT 1`)
    .get(channelId, profileId, key);
  db.close();
  return row ? row.Value : null;
}

function widgetSocket(onWidgetSettings) {
  const url = "ws://127.0.0.1:" + PORT + "/socket.io/?EIO=4&transport=websocket";
  const ws = new WebSocket(url);
  const state = { connected: false, loggedIn: false };
  ws.on("message", (buf) => {
    const s = buf.toString();
    if (s[0] === "0") { ws.send("40"); return; }
    if (s === "2") { ws.send("3"); return; }
    if (s.startsWith("40")) {
      state.connected = true;
      ws.send("42" + JSON.stringify(["login", { channelId: 1, appType: "widget" }]));
      return;
    }
    if (s.startsWith("42")) {
      try {
        const arr = JSON.parse(s.slice(2));
        const name = arr[0], payload = arr[1];
        if (name === "loginResult") state.loggedIn = true;
        if (name === "widgetSettings" && payload && typeof payload === "object") onWidgetSettings(payload);
      } catch (e) {}
    }
  });
  return { ws, state };
}

(async () => {
  const scope = activeScope();
  console.log("[harness] DB_PATH = " + DB_PATH);
  console.log("[harness] active channelId=" + scope.channelId + " profileId=" + scope.profileId);

  const original = dbValue(scope.channelId, scope.profileId, KEY_DB);

  const res = { dbPersist: false, broadcast: false, gotValue: null };
  let resolveBroadcast;
  const broadcastP = new Promise((r) => (resolveBroadcast = r));
  const sock = widgetSocket((s) => {
    if (String(s[KEY_WIDGET]) === VALUE) { res.broadcast = true; res.gotValue = s[KEY_WIDGET]; resolveBroadcast(); }
  });
  const ws = sock.ws, state = sock.state;
  ws.on("error", (e) => console.error("[harness] ws error:", e && e.message));

  await new Promise((r) => { const t = setInterval(() => { if (state.loggedIn) { clearInterval(t); r(); } }, 50); setTimeout(() => { clearInterval(t); r(); }, 4000); });
  if (!state.loggedIn) { try { ws.close(); } catch (e) {} fail(2, "widget socket never logged in (backend down on port " + PORT + "?)"); }

  let resp;
  try { resp = await httpPost("/api/updateSettings", { [KEY_DB]: VALUE }); }
  catch (e) { try { ws.close(); } catch (x) {} fail(2, "POST failed: " + e.message); }
  console.log("[test] POST /api/updateSettings " + KEY_DB + "=" + VALUE + " -> HTTP " + resp.status);

  await new Promise((r) => setTimeout(r, 600));
  res.dbPersist = String(dbValue(scope.channelId, scope.profileId, KEY_DB)) === VALUE;

  await Promise.race([broadcastP, new Promise((r) => setTimeout(r, 3000))]);

  try { await httpPost("/api/updateSettings", { [KEY_DB]: original != null ? original : "50" }); } catch (e) {}
  try { ws.close(); } catch (e) {}

  console.log("");
  console.log("=== SETTINGS CHAIN TEST (cannon_ballSize=" + VALUE + ") ===");
  console.log("  1. DB persist  (POST wrote " + KEY_DB + ")         : " + (res.dbPersist ? "PASS" : "FAIL - POST khong luu DB (check DB_PATH / resolveChannelId)"));
  console.log("  2. Broadcast   (widget nhan " + KEY_WIDGET + "=" + VALUE + ") : " + (res.broadcast ? "PASS" : "FAIL - widget khong nhan (got: " + res.gotValue + "; check normalizeKey / case-dup / appType filter)"));
  const ok = res.dbPersist && res.broadcast;
  console.log("  RESULT: " + (ok ? "PASS - settings chain chay end-to-end" : "FAIL - settings KHONG an, xem step nao FAIL"));
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error("[harness] error", e); process.exit(2); });
