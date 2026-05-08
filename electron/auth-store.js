// Auth token storage for TikfinityServer integration.
//
// Persists in <userData>/auth.json. Layout:
//   {
//     "type":  "key" | "user",
//     "token": "<JWT or session token from TikfinityServer>",
//     "keyId": "TKFN-XXX-...",       // when type="key"
//     "username": "admin",            // when type="user"
//     "expiresAt": "ISO-8601 string",
//     "lastValidatedAt": "ISO-8601 string"
//   }
//
// "Offline grace period" lets a user open the app while TikfinityServer is
// unreachable as long as their last successful validation is within
// OFFLINE_GRACE_DAYS and the license itself has not expired.

const fs = require('fs');
const path = require('path');

const OFFLINE_GRACE_DAYS = 7;

let authFilePath = null;

function init(userDataDir) {
    authFilePath = path.join(userDataDir, 'auth.json');
}

function load() {
    if (!authFilePath) throw new Error('auth-store: not initialized');
    try {
        if (!fs.existsSync(authFilePath)) return null;
        const raw = fs.readFileSync(authFilePath, 'utf-8');
        const data = JSON.parse(raw);
        if (!data || !data.token) return null;
        return data;
    } catch (err) {
        console.warn('[auth-store] load failed:', err.message);
        return null;
    }
}

function save(data) {
    if (!authFilePath) throw new Error('auth-store: not initialized');
    try {
        const payload = {
            ...data,
            lastValidatedAt: data.lastValidatedAt || new Date().toISOString()
        };
        fs.writeFileSync(authFilePath, JSON.stringify(payload, null, 2), 'utf-8');
        return payload;
    } catch (err) {
        console.error('[auth-store] save failed:', err.message);
        throw err;
    }
}

function clear() {
    if (!authFilePath) return;
    try {
        if (fs.existsSync(authFilePath)) fs.unlinkSync(authFilePath);
    } catch (err) {
        console.warn('[auth-store] clear failed:', err.message);
    }
}

// Decide whether a stored auth record lets the user into the app right now.
// Returns { ok: bool, reason?: string, offline?: bool }.
function evaluate(data) {
    if (!data) return { ok: false, reason: 'NO_TOKEN' };
    const now = Date.now();

    // License/account expiry from server.
    if (data.expiresAt) {
        const exp = Date.parse(data.expiresAt);
        if (Number.isFinite(exp) && exp <= now) {
            return { ok: false, reason: 'EXPIRED' };
        }
    }

    // Offline grace: only matters if caller already determined server is unreachable
    // and falls back to evaluating against the cached record.
    if (data.lastValidatedAt) {
        const last = Date.parse(data.lastValidatedAt);
        if (Number.isFinite(last)) {
            const ageDays = (now - last) / (1000 * 60 * 60 * 24);
            return {
                ok: true,
                offline: ageDays >= 0 && ageDays > 1,           // older than 1d → likely offline-cached
                offlineExceeded: ageDays > OFFLINE_GRACE_DAYS    // beyond grace period
            };
        }
    }

    return { ok: true };
}

module.exports = { init, load, save, clear, evaluate, OFFLINE_GRACE_DAYS };
