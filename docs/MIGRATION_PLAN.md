# Migration Plan: C# Backend → Node.js Backend

> Tracking doc for migrating `backend/` (.NET 9) to `backend-node/` (Node 20 + Express).
> Bundle (`downloads/`), Electron shell, and TikfinityServer auth (cloud) are NOT in scope — they stay as-is.

## Current state (codebase snapshot, 2026-05-15)

- ~16,000 lines C# (.cs files only, excluding migrations)
- 23 controllers exposing **162 HTTP endpoints**
- 14 services
- 16 EF Core models + DbContext + 3 migrations
- SignalR Hubs (1 file) — bundle does NOT use; only Socket.IO via `SocketManager`
- `Program.cs` is 6,169 lines, ~90% of which is `BuildIndexHtml()` injecting HTML/JS/CSS into the served bundle
- `Services/TikTokBridgeService.cs` is 2,044 lines wrapping the separate `tiktok-bridge/` Node process via WebSocket

## Tech stack target

| Layer | Choice | Rationale |
|---|---|---|
| Runtime | Node.js 20 LTS | Ships with Electron, stable |
| Framework | Express 4 | Mature, broad ecosystem |
| DB driver | better-sqlite3 (sync) | Fastest, no async overhead |
| Migrations | Knex (schema only) | Versioned migrations |
| Real-time | socket.io v4 | Bundle uses Socket.IO client |
| Auth/JWT | jsonwebtoken + bcrypt | Direct port of JwtService.cs |
| TikTok | tiktok-live-connector (direct, no spawn) | Already proven, in-process |
| Logger | pino | Fast, structured |
| Validation | zod | Body validation |
| Module | CommonJS | Electron compat |

## Folder structure (target)

```
backend-node/
├─ package.json
├─ knexfile.js
├─ src/
│  ├─ index.js                # entry: starts express + socket.io + tiktok
│  ├─ config.js               # env, ports, paths
│  ├─ db/
│  │  ├─ conn.js              # singleton better-sqlite3 instance
│  │  ├─ migrations/          # SQL migration files
│  │  └─ models/              # row helpers (one per table)
│  ├─ routes/                 # one router per controller
│  ├─ services/
│  ├─ middleware/
│  └─ templates/              # injection partials (extracted from BuildIndexHtml)
└─ scripts/                   # migrate, seed
```

## Phases

| # | Name | Effort | Status |
|---|---|---|---|
| 0 | Setup & architecture | 2h | ✅ done |
| 1 | Core infrastructure (DB / JWT / Socket.IO / index.html) | 3h | ✅ done |
| 2a | Port core endpoints (Me, Auth, Settings, Config) | 4h | ✅ done |
| 2b | Port stream features (Actions, Sounds, TTS, Goals, Points, ChatCommands) | 4h | ✅ done |
| 2c | Port widget + data (Widget, Data, Notifications, Backup, Reset, Seed) | 3h | ✅ done |
| 2d | Port misc (Pro, KeyAuth, Upload, Webhooks, Obs, TikfinityImport) | 2h | ✅ done |
| 3 | TikTok bridge in-process via tiktok-live-connector + aggregates + chat-bot | 3h | ✅ done |
| 4 | Migrate Electron main.js (spawn node instead of dotnet) | 2h | ✅ done |
| 5 | End-to-end testing + stabilization (26/26 integration routes green) | 4h | ✅ done |
| 6 | Packaging (electron-builder NSIS) | 3h | ✅ done (2026-05-26 C# fully retired, dist artifacts purged) |
| | **Total** | **30h** | |

## Ports & processes after migration

| Port | Service | Notes |
|---|---|---|
| 5285 | Node backend (Express) | Bundle's HTTP target, same port as before |
| 5194 | TikfinityServer (cloud, NOT in repo) | Auth gate, called from `routes/auth.js` |
| 21213 | Desktop API WebSocket (`wsserver.js`) | Unchanged, lives in `electron/` |
| ~~5288~~ | ~~tiktok-bridge WebSocket~~ | **REMOVED** — bridge now in-process |

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Response JSON shape mismatch breaks bundle | Test each endpoint with `curl` against C# original |
| Reload loop returns due to dynamicSettings drift | Match wsAuthToken + featurebaseToken caching exactly |
| `socket.io` version incompat with bundle's client | Verify in Phase 1; downgrade if needed |
| `better-sqlite3` native binary fails on package | Use electron-rebuild in postinstall |
| TikfinityServer (5194) endpoint contract drifts | Document the calls in `routes/auth.js` JSDoc |

## Fallback strategy

- **If Phase 2 takes too long**: leave a few C# controllers in place, proxy them from Node via HTTP.
- **If Phase 3 unstable**: keep `tiktok-bridge/` as separate process, only migrate the rest.
- **If Phase 6 packaging fails**: ship as portable zip extract.

## Decision log

- **2026-05-15** — Decided to migrate. Reasons: smaller footprint for customer machines, single language (JS), use best TikTok lib natively.
- **2026-05-15** — Folder: `backend-node/` alongside `backend/`. Branch `node-js-backend`. Bundle/Electron unchanged.
- **2026-05-15** — Phases 0–5 complete. 26-route integration smoke green. All 23 C# controllers ported to 17 Node routers (some merged: `data.js` covers `Data`, `auth.js` covers `Auth` stubs, etc.). TikTok bridge embedded via `tiktok-live-connector` — no subprocess.
- **2026-05-15** — Electron `main.js` now spawns Node backend via `ELECTRON_RUN_AS_NODE` when packaged, plain `node` in dev. `build.bat` runs `@electron/rebuild` on `better-sqlite3` so the native binding matches Electron's Node ABI. `extraResources` ships `backend-node/` + `downloads/` to `resources/`.
- **2026-05-26** — Phase 6 closed. C# backend fully retired. `electron/dist/` artifacts (~595 MB containing stale `appsettings.json` with hardcoded JWT secret) purged — see security task #2. Packaging now produces NSIS + portable from Node-only sources. `.gitignore` line 11 (`electron/dist/`) confirmed in place to prevent regressions.

## Build flow (Node backend)

```bash
# Dev
cd backend-node && npm install
TIKMAX_DATA_DIR=$(pwd)/data PORT=5285 node src/index.js

# Production package
cd electron && build.bat
# Output: electron/dist/TikFinity Setup *.exe (NSIS) + portable .exe
```

## Removed in Node port

- `tiktok-bridge/` subprocess (now in-process via `tiktok-live-connector`)
- Port 5288 (bridge WS) — kept in `freeOurPorts` cleanup list for backwards compatibility with old installs
- All `.NET 9` / `dotnet` references in `electron/main.js` and `build.bat`
