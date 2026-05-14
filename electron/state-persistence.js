// Session cookie storage. Stored separately from auth-store.js
// because they have unrelated lifecycles:
//   • auth-store.js     → TikfinityServer Serial Key (license gate)
//   • this file         → platform user sessionid (let bridge bypass Eulerstream)
//
// File location: <userData>/tiktok-session.json
//   {
//     "sessionId": "<32-char hex string>",
//     "username":  "<@ handle, optional>",
//     "savedAt":   "ISO-8601 string",
//     "expiresAt": "ISO-8601 string (~30d after savedAt, best-effort)"
//   }
//
// SECURITY: sessionid is a login token. Treat it like a password —
// never log the value, never include in error messages, never commit.

const fs = require('fs');
const path = require('path');

const FILE_NAME = 'tiktok-session.json';
const DEFAULT_TTL_DAYS = 30;

let storePath = null;

function init(userDataDir) {
    storePath = path.join(userDataDir, FILE_NAME);
}

function load() {
    if (!storePath) throw new Error('session-store: not initialized');
    try {
        if (!fs.existsSync(storePath)) return null;
        const raw = fs.readFileSync(storePath, 'utf-8');
        const data = JSON.parse(raw);
        if (!data || typeof data.sessionId !== 'string' || data.sessionId.length < 8) return null;
        // Best-effort expiry check. We never know the real expiry — the
        // cookie just stops working when the platform invalidates it. The
        // bridge will surface that as a connect failure and the user can
        // sign in again via the tray menu / Setup button.
        if (data.expiresAt) {
            const exp = Date.parse(data.expiresAt);
            if (Number.isFinite(exp) && exp <= Date.now()) return null;
        }
        return data;
    } catch (err) {
        console.warn('[session-store] load failed:', err.message);
        return null;
    }
}

function save(sessionId, username, ttTargetIdc) {
    if (!storePath) throw new Error('session-store: not initialized');
    if (!sessionId || typeof sessionId !== 'string') throw new Error('sessionId required');

    const now = Date.now();
    const expiresAt = new Date(now + DEFAULT_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const payload = {
        sessionId,
        ttTargetIdc: ttTargetIdc || null,
        username: username || null,
        savedAt: new Date(now).toISOString(),
        expiresAt
    };
    fs.writeFileSync(storePath, JSON.stringify(payload, null, 2), 'utf-8');
    return payload;
}

function clear() {
    if (!storePath) return;
    try {
        if (fs.existsSync(storePath)) fs.unlinkSync(storePath);
    } catch (err) {
        console.warn('[session-store] clear failed:', err.message);
    }
}

// Returns { signedIn, hasTtTargetIdc, username?, ageDays? } — safe to expose
// to renderer. NEVER includes the raw sessionId.
//
// `signedIn` only flips true when BOTH sessionid and tt-target-idc are
// present, since the v2 connector throws synchronously without tt-target-idc
// and we'd silently fall back to public Eulerstream signing (rate-limited).
function getStatus() {
    const data = load();
    if (!data) return { signedIn: false, hasTtTargetIdc: false };
    const hasTtTargetIdc = Boolean(data.ttTargetIdc);
    const ageDays = data.savedAt
        ? (Date.now() - Date.parse(data.savedAt)) / (1000 * 60 * 60 * 24)
        : null;
    return {
        signedIn: hasTtTargetIdc,
        hasTtTargetIdc,
        username: data.username || null,
        ageDays: ageDays !== null && Number.isFinite(ageDays) ? Math.round(ageDays) : null
    };
}

module.exports = { init, load, save, clear, getStatus };
