# Architecture — TikFinity Clone

Bird's-eye view of the runtime. For migration history see [`MIGRATION_PLAN.md`](MIGRATION_PLAN.md). For HTTP shape details see [`API_CONTRACTS.md`](API_CONTRACTS.md). For Vue bundle behavior + UI gates see root [`CLAUDE.md`](../CLAUDE.md).

---

## Process tree

```
electron/main.js                     (Electron host, MAIN process)
├─ BrowserWindow #1                  splash.html → login.html → bundle UI
│  └─ renders downloads/index.html via http://127.0.0.1:5285/
├─ child: backend-node/src/index.js  spawned via ELECTRON_RUN_AS_NODE
│  ├─ HTTP server      :5285 (Express + Socket.IO same port)
│  ├─ TikTok LIVE      in-process via tiktok-live-connector (no subprocess)
│  └─ better-sqlite3   %APPDATA%\tikfinity-desktop\tikfinity.db
├─ child: electron/wsserver.js       Desktop API WebSocket :21213
└─ outbound HTTPS      → TikfinityServer cloud :5194 (Serial Key gate, NOT in repo)
```

| Port | Owner | Role |
|---|---|---|
| 5285 | `backend-node` | Bundle's HTTP target (REST + Socket.IO) |
| 21213 | `electron/wsserver.js` | Desktop API WS (legacy clients, unchanged) |
| 5194 | TikfinityServer cloud | Serial Key validation, NOT bundled |
| ~~5288~~ | ~~tiktok-bridge subprocess~~ | REMOVED — bridge now in-process |

C# `.NET 9` backend was retired 2026-05-26 (Phase 6 done). No `dotnet` runtime is shipped.

---

## Boot sequence

1. **Electron `main.js`** opens splash window, calls `freeOurPorts(...)` (5285, 21213, 5288 legacy) to evict zombies, then `spawn(node, [backend-node/src/index.js], { ELECTRON_RUN_AS_NODE: 1 })`.
2. **`backend-node/src/index.js`** `bootstrapDb()` → Knex `migrate.latest()` (idempotent) → `seed.run()` ensures default Channel + 10 seed Profiles.
3. Express attaches middleware: `cors` → `compression` → `cookieParser` → `express.json` → `optionalAuth` → `[REQ]` access log.
4. 24 routers wire under `/api/*` (see Route map below).
5. `indexHtmlMiddleware` intercepts `GET /` to splice injection payloads into the bundle's `index.html` (see Bundle injection pipeline below).
6. `spaFallback()` catches unknown paths → serves `index.html` for client-side router.
7. `server.listen(5285)` → Socket.IO binds via `sockets.bind(io)` on the same HTTP server.
8. `tikTokBridge.attach(io)` makes `tiktok-live-connector` ready (no auto-connect; bundle triggers via REST + socket).
9. Electron parses `[BOOT] TikFinity Node backend listening` line → loads `http://127.0.0.1:5285/` into BrowserWindow.

---

## Route map (24 routers, ~162 endpoints — full catalog in `COMPLETE_ENDPOINT_INDEX.md`)

| Mount | Router | Surface |
|---|---|---|
| `/api` | `me.js` | `/me`, `/loginChannel`, `/switchProfile`, `/setAffiliate` |
| `/api` | `settings.js` | `/updateSettings`, `/getOverlayConfig`, `/modules` |
| `/api` | `config.js` | `/getAppConfig`, `/config`, `/getSystemConfig`, `/getTranslations`, `/init`, `/v2/sync` |
| `/api` | `auth.js` | `/auth/*`, `/v1/auth/*`, `/v1/flow/*`, `/v1/code/*` |
| `/api/rest` | `actions.js` | `/rest/action` (GET/POST/DELETE) |
| `/api` | `sounds.js` | `/sounds*`, `/rest/sound*` |
| `/api/tts` | `tts.js` | `/tts/generate`, `/tts/user`, `/tts/auth-token` |
| `/api/goals` | `goals.js` | CRUD + `/reset` |
| `/api/points` | `points.js` | `/points/leaderboard`, `/points/user/:name` |
| `/api/commands` | `commands.js` | CRUD + `/test` |
| `/api/widget` | `widget.js` | Per-widget settings (timer, coinjar, wheel, coindrop, actions/test, …) |
| `/api` | `data.js` | `/odata/*`, `/rest/transaction`, `/getAllGifts`, `/usage/log`, … |
| `/api/notifications` | `notifications.js` | `/list`, `/markRead`, `/clear` |
| `/api/backup` | `backup.js` | `/export`, `/import` |
| `/api/reset` | `reset.js` | `/aggregates`, `/points`, `/goals`, `/all` |
| `/api/seed` | `seed.js` | POST import + `/status` |
| `/api/pro` | `pro.js` | `/upgrade`, `/status`, Stripe stubs |
| `/api/auth` | `key-auth.js` | `/key-login` (Serial Key → TikfinityServer :5194) |
| `/api` | `upload.js` | `/uploadFile`, `/uploadMedia`, `/upload`, `/uploads/list`, `/uploads/delete` |
| `/api/webhooks` | `webhooks.js` | CRUD + `/test` |
| `/api/obs` | `obs.js` | `/status`, `/connect`, `/scenes`, … |
| `/api/import` | `tikfinity-import.js` | `/tikfinity`, `/tikfinity/test` |
| `/api/tiktok` | `tiktok.js` | `/status`, `/connect`, `/disconnect`, `/stats` |

After all `/api/*` routers a catch-all returns 404 JSON; non-`/api` paths fall through to `spaFallback()`.

---

## Data layer

**Engine:** better-sqlite3 (synchronous, single connection in `db/conn.js`).
**Migrations:** Knex CLI files in `db/migrations/`. Currently 3:
- `20260515000001_initial.js` — full schema
- `20260526000001_revoked_tokens_fk.js` — FK for JWT revocation
- `20260526000002_composite_profile_indexes.js` — perf indexes

**File:** `%APPDATA%\tikfinity-desktop\tikfinity.db` (override via `TIKMAX_DATA_DIR`). WAL mode on.

**Model layer** (`db/models/`): one helper file per table, all sync, all parameterized via better-sqlite3 prepared statements. Each model exports row-level CRUD; routes compose them.

| Model | Table | Notes |
|---|---|---|
| `channels.js` | `Channels` | One row per TikTok account. `ProfileId` FK → active Stream Profile |
| `profiles.js` | `Profiles` | 10 seed profiles; user-created append on demand |
| `actions.js` | `Actions` | Stream actions (gift/like/follow triggers) |
| `sounds.js` | `Sounds` | Sound library + assignments |
| `goals.js` | `Goals` | Goal targets + progress aggregates |
| `chat-commands.js` | `ChatCommands` | `!cmd` bot triggers |
| `timers.js` | `Timers` | Recurring chat messages |
| `notifications.js` | `Notifications` | In-app notification feed |
| `transactions.js` | `Transactions` | Gift/like ledger (drives leaderboards) |
| `widgets.js` | `Widgets` | OBS widget instances per channel |
| `overlays.js` | `Overlays` | Custom overlay config |
| `webhooks.js` | `Webhooks` | Outbound HTTP hooks per event |
| `subscriptions.js` | `Subscriptions` | TikTok sub events |
| `dynamic-settings.js` | `DynamicSettings` | Bundle's `settings.restore()` snapshot |
| `channel-modules.js` | `ChannelModules` | Feature toggles per channel |
| `revoked-tokens.js` | `RevokedTokens` | JWT blocklist |

---

## Bundle injection pipeline

`indexHtmlMiddleware` (in `middleware/index-html.js`) serves a heavily-patched `downloads/index.html`. Patches are spliced in this order:

1. **`reloadGuard`** — top-of-`<head>` IIFE that counts reloads and forces a hard refresh after N to break loops.
2. **`earlyCss`** (from `templates/earlyCss.txt`) — critical CSS for chip override, page width clamp, overlay container, guest topbar, etc. See `CLAUDE.md` Gates 18, 20, 22, 30d.
3. **`tfPageloadData` JSON injection** — server hands the bundle a localized snapshot keyed by `tf_locale` cookie. Required to avoid 404 on `/config/localization/<lang>.json` (Gate 13).
4. **`blockScript`** (from `templates/blockScript.txt`) — 60+ IIFEs that monkey-patch the Vue bundle at runtime: Pinia store patches (chip + Pro flag), TTS auth bootstrap, profile sync, language switcher wrapper, overlay `show()` trigger, etc. Each IIFE is documented in-file.
5. **`authScript`** (from `templates/authScript.txt`) — `window.token` bootstrap from cookie + WebSocket auth handoff.
6. **`loginPopupScript`** (from `templates/loginPopupScript.txt`) — used by `login.html` only.

If you add a new injection IIFE, append it to `blockScript.txt` and document the gate in `CLAUDE.md`. Order matters — early IIFEs run before Vue mount, late ones run after.

---

## Real-time channels

**Socket.IO** (`services/socket-manager.js`):
- Same HTTP server as Express; namespace `/`.
- Client → `setContext { channelId, appType }` claims session.
- Client → `login { ... }` exchanges Serial Key / channel for session payload.
- Client → `channelStatus` re-emits cached status snapshot.
- Server pushes TikTok events as they arrive (`gift`, `like`, `chat`, `follow`, `share`, `viewerCount`, `member`).

**TikTok LIVE** (`services/tiktok-bridge.js`):
- Single `TikTokLiveConnection` instance per channel.
- `connect()` is idempotent (25s timeout, abort flag, generation token guard).
- Events fan out: aggregate counters → `aggregates.js`, webhooks → `webhooks.js`, chat bot → `chat-bot.js`, points ledger → `points.js`, goal progress → `db/models/goals.js`, socket broadcast → `socket-manager.js`.

**Desktop API WS** (`electron/wsserver.js`, port 21213):
- Legacy clients (e.g., external Tikfinity tools). Unchanged from C# era. Auth via `wsAuthToken` from `/api/me`.

---

## End-to-end data flow (gift event example)

```
TikTok LIVE viewer sends gift
        │
        ▼
tiktok-live-connector raw event
        │
        ▼  services/tiktok-bridge.js handler
        ├─► db/models/transactions.js  INSERT row (idempotent on giftId+timestamp)
        ├─► services/aggregates.js     INCR daily/total counters
        ├─► services/points.js         credit user points
        ├─► db/models/goals.js         advance any active goals → mark complete
        ├─► services/webhooks.js       POST configured webhooks (parallel)
        ├─► services/chat-bot.js       maybe `!thanks` reply via bundle bot
        └─► services/socket-manager.js io.to(channel).emit('gift', payload)
                                                │
                                                ▼
                                       Bundle Vue store reactive update
                                                │
                                                ▼
                                       Activity Feed / Topbar count / Overlay anim
```

---

## Security boundaries

- **JWT signing** — `services/jwt.js`. Secret loaded from `config.js` (env-only, no hardcode after C# retirement). Revocation via `RevokedTokens` table; checked in `middleware/auth.js`.
- **Cookie** — `tf_session` HttpOnly + SameSite=Lax. `tf_locale` (locale preference) is NOT auth — readable by bundle injection.
- **CORS** — `origin: true, credentials: true` (any origin, mirror cookies). Acceptable because backend is bound to 127.0.0.1 only and Electron is the sole client.
- **CSP** — none currently; bundle is local + monkey-patched, traditional CSP would block our IIFEs.
- **Serial Key** — never stored locally. Validated via TikfinityServer :5194 at startup; cleared from memory after JWT issuance.
- **Bundle assets** — served from `downloads/` (static). User uploads land in `data/uploads/` (configurable, default `%APPDATA%\tikfinity-desktop\uploads`).

---

## Where to look when …

| Symptom | Start with |
|---|---|
| UI render bug | `CLAUDE.md` Gates table |
| API shape wrong | `docs/API_CONTRACTS.md` + route file |
| Endpoint missing | `docs/COMPLETE_ENDPOINT_INDEX.md` |
| TikTok event handling | `services/tiktok-bridge.js` |
| Migration / schema | `db/migrations/` + `db/models/` |
| Bundle injection / IIFE | `templates/blockScript.txt` |
| Critical CSS override | `templates/earlyCss.txt` |
| Packaging / build | `electron/build.bat` + `electron/package.json` |
