# Fix Plan — Stability Pass (2026-05-13)

> Don't add features. Fix what's broken without breaking anything else.
> Smoke test after each fix.

## Known Issues

### Issue A: Logout button không trigger
**Symptom:** Click "Đăng xuất" in profile dropdown → nothing happens. No login window. No app restart.

**Root cause hypothesis (most likely):**
Bundle's dropdown item contains icon emoji + label, e.g. `<span>🔚</span><span>Đăng xuất</span>`.
`textContent` of the row = `"🔚 Đăng xuất"` (or similar).
Current regex `/^\s*(...|đăng[\s-]?xuất)\s*$/i` requires the ENTIRE text to be one of the logout phrases — fails on emoji prefix.

**Files:**
- [Program.cs:2084-2142](../backend/Program.cs#L2084) — `tameAccountDropdown` intercept
- [main.js:785](../electron/main.js#L785) — `ipcMain.handle('auth:logout', ...)`
- [main.js:820](../electron/main.js#L820) — `performLogout()`

**Fix:**
1. Make `LOGOUT_RE` more lenient — strip leading emoji/icon chars before testing
2. Add fallback: support clicks on icon-only descendants (walk down too)
3. Add diagnostic log at every step so next time we know which link breaks

**Risk:** Touches injected JS. Smoke test API unaffected. Manual test required.

---

### Issue B: Ctrl+Shift+R → "missingExtension" connect error
**Symptom:** After hard reload, bundle tries to connect TikTok again → bridge fails with `missingExtension` (eulerstream signing failure).

**Root cause hypothesis:**
- Backend's `_connected = true` state persists across renderer reload (backend not killed)
- Bundle reloads, doesn't know backend state, calls `/api/tiktok/connect` again
- Bridge sees stale connection, tries new connection, hits eulerstream rate-limit / signing failure

**Files:**
- [TikTokBridgeService.cs:945](../backend/Services/TikTokBridgeService.cs#L945) — `ConnectToTikTok` entry point
- [TikTokBridgeService.cs:967](../backend/Services/TikTokBridgeService.cs#L967) — "already connected" short-circuit
- [Program.cs:tfConnectErrorPopup](../backend/Program.cs#L1680) — auto-poll status

**Fix:**
1. Verify `ConnectToTikTok` returns early without bridge call when same user already connected
2. On renderer reload, bundle should detect existing connection via `/api/tiktok/status` and skip re-connect
3. Add `tfReconnectDetector` in injected JS: on app boot, if `status.connected=true && status.username matches setting`, skip auto-connect chain

**Risk:** Touches bridge service logic. Smoke `03-connect-disconnect` will verify normal flow.

---

### Issue C: Reload mask 1s timing too long for fast reloads
**Symptom:** Some reload chains finish in <500ms, mask still shows for full 1000ms duration → feels laggy

**Files:**
- [Program.cs:reloadMask](../backend/Program.cs) — `1000ms` hide debounce

**Fix:** Reduce to 500ms. Test reload chain visually.

**Risk:** Low — pure CSS timing.

---

## Order of Operations

1. **Issue A** (logout) first — affects user trust the most
2. **Issue B** (reconnect) next — fixes the most common failure path
3. **Issue C** (mask timing) last — nice-to-have polish

After each: run smoke tests, verify visually in Electron, commit/document.

## Rules

- **One commit per fix** — easier to revert if a fix introduces regression
- **Smoke after each** — `powershell.exe -File smoke\run-all.ps1`
- **Touch Program.cs?** → MUST chạy smoke (architect rule)
- **No new features** — only stability

---

## Issue D: Switch profile reload chain (8-12 reloads)

**Symptom:** Click switch profile → bundle calls `location.reload()` in chain (8-12 times). User sees flicker. Overlay only masks symptom.

**Root cause:**
- Bundle (obfuscated `app.js`) calls `location.reload()` repeatedly after switch profile
- Existing guard in `Program.cs` tracks counter in JS memory → wiped on every full reload → guard never engages effectively
- Each reload triggers a fresh "first poll" / "first hydrate" → cascades into more state-shake

**Phase 1: Persistent guard (quick patch, ships immediately)**
- Replace in-memory counter with `sessionStorage` marker
- Hook `location.reload` BEFORE bundle loads
- Track:
  - First reload of a chain: allow + increment counter
  - 2nd+ reload within 5s: BLOCK (preventDefault doesn't apply, but we throw/cancel)
- Marker auto-expires after 10s or when `/api/me` returns expected profile
- Overlay still shows but for max 1 visible reload, not 8

**Phase 2: Override switchProfile (proper fix)**
- Intercept bundle's switch profile click before it calls reload
- Call backend `/api/me?profileId=X` (or equivalent) directly via fetch
- Re-hydrate localStorage + cookies with new profile
- Fire bundle's reactive event (`storage` event simulated, or custom hook) to update UI
- Skip `location.reload()` entirely
- Falls back to Phase 1 reload if hydration fails

**Phase 3: Cleanup**
- `preload.js:37` hardcoded `setting_channelid='1'` → read from backend
- `preload.js:49` hardcoded cookie `tf_channelid=1` → read from backend
- Dedupe `hydrateFromApi` calls in `Program.cs:3377/3447/3449`

**Files:**
- [Program.cs:BuildIndexHtml](../backend/Program.cs#L1585) — inject persistent reload guard
- [preload.js:37,49](../electron/preload.js#L37) — channelid hardcode
- [Program.cs:3377+](../backend/Program.cs#L3377) — hydrateFromApi duplicates

**Risk:** Phase 1 is low risk (sessionStorage only). Phase 2 medium (intercepting bundle behavior). Phase 3 needs careful migration so existing users don't lose state.
