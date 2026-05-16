# TikFinity Clone

Runtime chính là **Node.js backend** trong `backend-node/`, được Electron shell wrap thành desktop app. Bundle frontend (Vue 3 đã obfuscate) ở `downloads/`.

## Yêu cầu

### Dev box
- **Windows 10/11** (x64)
- **Node.js 20+** — https://nodejs.org

### Máy khách
- **Chỉ cần installer**. Không cần cài thêm gì (Electron đã đóng gói sẵn Node runtime).

## Setup lần đầu trên máy mới (dev)

Chạy 1 lần:
```bat
setup.bat
```

Script này:
1. Kiểm tra `node` + `npm` đã cài chưa
2. `npm install` trong `backend-node/` (Express, better-sqlite3, socket.io, tiktok-live-connector, …)
3. `npm install` trong `electron/`

## Chạy

| Lệnh | Mô tả |
|---|---|
| `start_desktop.bat` (hoặc `npm run desktop`) | Full app — Electron shell + backend-node |
| `npm run web` | Backend only — http://localhost:5285, không có Electron shell (tiện cho curl test) |
| `npm run web:dev` | Backend only với `node --watch` (auto reload) |

## Build installer cho khách

```bat
build-app.bat
```

Output: `electron\dist\`
- `TikFinity Setup <ver>.exe` — NSIS installer (~150 MB, có shortcut + uninstall)
- `TikFinity <ver>.exe` — portable single-file

Build flow:
1. `npm install --production` trong `backend-node/`
2. `@electron/rebuild` rebuild `better-sqlite3` theo ABI của Electron 33 (vì backend chạy với `ELECTRON_RUN_AS_NODE=1`)
3. Stage `backend-node/` + `downloads/` vào `dist/app/`
4. `electron-builder` đóng gói

## Troubleshooting

- **"Backend không phản hồi"** trên splash → port 5285 đang bị chiếm bởi process khác. Tắt rồi mở lại app (Electron có `freeOurPorts()` tự dọn).
- **"Cannot find module 'better-sqlite3'"** khi packaged → rebuild step bị skip. Chạy lại `build-app.bat`.
- **Reload liên tục** → xóa `%APPDATA%\tikfinity-desktop\tikfinity-data\` (DB user) và mở lại app.
- **Auth gate ở 127.0.0.1:5194 không phản hồi** → TikfinityServer chưa chạy. App vẫn bootable, nhưng `/api/auth/key-login` sẽ trả `UNREACHABLE`.

## Cổng dùng

| Port | Service | Notes |
|---|---|---|
| 5285 | Backend HTTP + Socket.IO | Bundle's HTTP target |
| 21213 | Desktop API WebSocket | Streamerbot plugin endpoint (`electron/wsserver.js`) |
| 5194 | TikfinityServer (NOT in repo) | Auth gate, Serial Key validation |

## Cấu trúc thư mục

```
TikCloneMax/
├── backend-node/       Node backend (Express + Socket.IO + tiktok-live-connector)
│   ├── src/
│   │   ├── index.js    Entry point — wires every router under /api/*
│   │   ├── routes/     17 routers ported from the original 23 C# controllers
│   │   ├── services/   widget-settings-cache, tiktok-bridge, chat-bot, aggregates,
│   │   │               webhooks, points, jwt, socket-manager
│   │   ├── db/         better-sqlite3 conn + models + Knex migrations
│   │   ├── middleware/ auth, index-html injection, SPA fallback
│   │   └── templates/  Static JS/CSS blocks spliced into the served index.html
│   └── knexfile.js
├── electron/           Electron shell (main process + splash + login window)
│   ├── main.js         Spawns backend-node via ELECTRON_RUN_AS_NODE
│   └── build.bat       Production build (rebuild better-sqlite3 → stage → electron-builder)
├── downloads/          Obfuscated TikFinity frontend bundle (~150 MB)
└── docs/               MIGRATION_PLAN.md, FEATURE_PARITY.md
```
