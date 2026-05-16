# TikFinity Node Backend

Node.js backend. Serves the bundled TikFinity frontend at
`http://localhost:5285`, handles auth, DB, Socket.IO, and TikTok LIVE event
forwarding (via `tiktok-live-connector` in-process — no subprocess hop).

Originally ported from a .NET 9 backend; see [`../docs/MIGRATION_PLAN.md`](../docs/MIGRATION_PLAN.md) for the migration history.

## Requirements

- Node.js 20 LTS (or newer)
- Windows 10/11 (matches existing Electron host; should also run on macOS/Linux)

## Setup

```bash
cd backend-node
npm install
npm run migrate          # apply DB schema
npm start                # listen on http://127.0.0.1:5285
```

## Layout

```
backend-node/
├─ src/
│  ├─ index.js              entry — Express + Socket.IO
│  ├─ config.js             ports, paths, secrets (env-driven)
│  ├─ logger.js             pino instance
│  ├─ db/
│  │  ├─ conn.js            singleton better-sqlite3 handle
│  │  ├─ migrations/        Knex JS migrations (consolidated from C# EF)
│  │  └─ models/            row helpers (one file per table)
│  ├─ routes/               one Express router per feature family
│  ├─ services/             jwt, sockets, tiktok-bridge, webhooks, etc.
│  ├─ middleware/           auth, index-html injection, spa-fallback
│  └─ templates/            static JS/CSS spliced into served index.html
└─ scripts/                 migrate, seed
```

## Ports

| Port  | Purpose                                | Notes                                |
|-------|----------------------------------------|--------------------------------------|
| 5285  | This server (Express + Socket.IO)      | Bundle's HTTP target                 |
| 21213 | Desktop API WebSocket                  | Lives in `electron/wsserver.js`      |
| 5194  | TikfinityServer (cloud auth)           | External; we only call out to it     |
| ~~5288~~ | ~~tiktok-bridge WS~~                | **Removed** — bridge is in-process   |

## Env vars

| Name | Default | Notes |
|---|---|---|
| `PORT` | `5285` | Listen port |
| `HOST` | `127.0.0.1` | Listen host |
| `TIKMAX_DATA_DIR` | `%APPDATA%/tikfinity-desktop` | DB + user data dir |
| `TIKFINITY_AUTH_HOST` | `http://127.0.0.1:5194` | TikfinityServer (cloud auth) |
| `TIKMAX_JWT_SECRET` | dev fallback | HS256 secret for bundle JWTs |
| `SIGN_API_KEY` | empty (free Eulerstream) | TikTok signing API key for the in-process bridge |
| `LOG_LEVEL` | `info` | `trace` / `debug` / `info` / `warn` / `error` |

## Production build

For end users, this package is bundled inside the Electron app via
`electron/build.bat`. Better-sqlite3 is rebuilt against Electron's Node ABI
so it loads cleanly when Electron runs us with `ELECTRON_RUN_AS_NODE=1`.
See [`../electron/build.bat`](../electron/build.bat).
