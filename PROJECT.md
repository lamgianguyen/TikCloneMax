# TikFinity Clone — Project Documentation

## Tổng quan

Clone của TikFinity — desktop app quản lý TikTok LIVE stream với widget overlay, event tracking, và tự động hoá. Backend Node.js phục vụ frontend Vue 3 (obfuscated) từ memory cache, kết nối TikTok LIVE in-process qua `tiktok-live-connector`. Đóng gói thành installer Windows bằng Electron + electron-builder.

**Local URL**: `http://localhost:5285`

---

## Cấu trúc thư mục

```
TikCloneMax/
├── backend-node/                Node 20 + Express server (~5800 LOC)
│   ├── src/
│   │   ├── index.js             Entry point + router wiring + boot sequence
│   │   ├── config.js            PORT/HOST/JWT_SECRET/AUTH_HOST/FRONTEND_PATH/DATA_DIR
│   │   ├── logger.js            pino (pretty in dev, JSON in prod)
│   │   ├── middleware/
│   │   │   ├── auth.js              JWT + cookie token extraction
│   │   │   ├── index-html.js        Bundle injection (~180 KB of HTML/JS spliced)
│   │   │   └── spa-fallback.js      Vue Router fallback for client-side routes
│   │   ├── routes/                  17 routers (replaces 23 C# controllers)
│   │   │   ├── me.js                /me /loginChannel /switchProfile /setAffiliate
│   │   │   ├── auth.js              /v1/auth/sso-bridge + /v1/code/* + /v1/flow/* stubs
│   │   │   ├── key-auth.js          /auth/key-login → TikfinityServer (Serial Key)
│   │   │   ├── settings.js          /updateSettings /getOverlayConfig /modules
│   │   │   ├── config.js            /getAppConfig /getSystemConfig /getTranslations /init
│   │   │   ├── actions.js           /rest/action CRUD
│   │   │   ├── sounds.js            /sounds /rest/sound CRUD
│   │   │   ├── tts.js               /tts/generate (TikTok TTS proxy)
│   │   │   ├── goals.js             /goals CRUD + /goals/:id/reset
│   │   │   ├── points.js            /points/leaderboard /points/user/:name
│   │   │   ├── commands.js          /commands CRUD + /commands/test/:id
│   │   │   ├── widget.js            /widget/* (timer, coinjar, wheel, coindrop, actions/test, broadcast)
│   │   │   ├── data.js              /odata/* /rest/transaction /getAllGifts /getAllAnimations /usage/log
│   │   │   ├── notifications.js     /notifications/list /markRead /clear
│   │   │   ├── backup.js            /backup/export /backup/import
│   │   │   ├── reset.js             /reset/aggregates /reset/points /reset/goals /reset/all
│   │   │   ├── seed.js              /seed /seed/status (ingest downloads/api/*)
│   │   │   ├── pro.js               /pro/* (status/upgrade/stripe stubs)
│   │   │   ├── upload.js            /uploadFile /uploadMedia /uploads/list /uploads/delete
│   │   │   ├── webhooks.js          /webhooks CRUD + /webhooks/test/:id
│   │   │   ├── obs.js               /obs/* (lazy obs-websocket-js)
│   │   │   ├── tikfinity-import.js  /import/tikfinity (one-shot Pro config import)
│   │   │   └── tiktok.js            /tiktok/status /tiktok/connect /tiktok/disconnect /tiktok/stats
│   │   ├── services/
│   │   │   ├── socket-manager.js    Socket.IO v4 broadcast wrapper
│   │   │   ├── jwt.js               HS256 token mint/validate (7-day for access, 30-day for featurebase)
│   │   │   ├── widget-settings-cache.js  Merged defaults + DB overrides, per-channel cache
│   │   │   ├── widget-defaults.js   ~200 default keys (slider scale, colors, fonts, ...)
│   │   │   ├── tiktok-bridge.js     Embedded tiktok-live-connector + event forwarding
│   │   │   ├── chat-bot.js          Chat command matcher with cooldown
│   │   │   ├── aggregates.js        Top gifters/likers/ranking/lastEvents/topGift
│   │   │   ├── webhooks.js          Outbound dispatch + Discord embed builder
│   │   │   └── points.js            Per-viewer balance (stored as DynamicSettings rows)
│   │   ├── db/
│   │   │   ├── conn.js              better-sqlite3 singleton (WAL, foreign_keys, busy_timeout)
│   │   │   ├── seed.js              Idempotent boot seed (default channel + welcome notifs)
│   │   │   ├── models/              Hand-written prepared-stmt models (lazy)
│   │   │   └── migrations/          Knex migrations (run once at boot)
│   │   └── templates/               13 static blocks spliced into served index.html
│   ├── knexfile.js
│   └── package.json
├── electron/                    Electron shell (~1200 LOC)
│   ├── main.js                  Spawns backend-node via ELECTRON_RUN_AS_NODE
│   ├── splash.html              Splash window during backend boot
│   ├── login.html               TikfinityServer Serial Key entry
│   ├── wsserver.js              Desktop API WebSocket (port 21213) for Streamerbot
│   ├── auth-store.js            Persists JWT + Serial Key locally
│   ├── build.bat                Production build (npm install → rebuild → stage → electron-builder)
│   └── package.json             electron-builder config
├── downloads/                   Obfuscated TikFinity frontend bundle (~150 MB)
│   ├── index.html               Vue 3 SPA — injected JS by middleware/index-html.js
│   ├── combo/                   Vue 3 bundle (app.js, modules.js, ui.css, modules.css)
│   ├── js/                      JS modules (init, navigation, tf-connect, lib-bundle, tts, ...)
│   ├── widget/                  30+ widget HTML files (cannon, chat, gifts, firework, ...)
│   └── css/, assets/, img/, sounds/
├── docs/
│   ├── MIGRATION_PLAN.md        Migration tracking doc (now archived)
│   └── FEATURE_PARITY.md        Endpoint-by-endpoint parity check
├── package.json                 Root npm scripts (web / desktop / build)
├── setup.bat                    First-time dev setup
├── start_desktop.bat            Dev launch (Electron + backend)
├── start.bat                    Production launch (Electron-only, expects pre-built backend)
└── build-app.bat                Production installer build (delegates to electron/build.bat)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node 20 + Express 4 |
| Database | better-sqlite3 (sync) + Knex (migrations only) — SQLite file in `<userData>/tikfinity-data/tikfinity.db` |
| Frontend | Vue 3 (obfuscated bundle) + jQuery (lib-bundle) |
| Realtime | Socket.IO v4 (server + client) |
| TikTok | `tiktok-live-connector` v2.1.1-beta1, embedded in-process |
| Auth | jsonwebtoken (HS256, 7-day) + bcryptjs |
| Desktop | Electron 33 + electron-builder (NSIS + portable) |
| Logger | pino |
| Validation | zod |

---

## Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────┐
│                  Browser (Vue 3 obfuscated)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │ Main App │  │ Widgets  │  │tf-connect│  │ Navigation │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────────┘ │
│       │              │             │                        │
│       └──────────────┴─────────────┘                        │
│                Socket.IO + REST API                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│           Node backend  (port 5285)                          │
│                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐ │
│  │ Express       │  │ Socket.IO     │  │ Static Files    │ │
│  │ Routers       │  │ Manager       │  │ (downloads/)    │ │
│  └───────┬───────┘  └───────┬───────┘  └─────────────────┘ │
│          │                  │                                │
│  ┌───────┴──────────────────┴───────┐                       │
│  │  TikTok bridge service           │                       │
│  │  (tiktok-live-connector in-proc) │                       │
│  └──────────────────────────────────┘                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
              TikTok LIVE servers (Eulerstream signing)
```

---

## Luồng kết nối TikTok LIVE

```
1. User nhập username → Bấm "Kết nối với TikTok LIVE"
2. tf-connect.js → POST /api/tiktok/connect { username }
3. routes/tiktok.js → bridge.connect(username, channelId)
4. services/tiktok-bridge.js:
   - new TikTokLiveConnection(username, ctorOpts)
   - Promise.race([connection.connect(), 25s timeout])
5. Khi connected:
   - Bridge wires 'connected', 'chat', 'gift', 'like', 'follow', ... handlers
   - Each handler:
     a. Broadcasts via socket-manager (widget-scoped)
     b. Bumps goal counters (services/aggregates + db/models/goals)
     c. Awards points (services/points)
     d. Fires webhooks (services/webhooks)
     e. Runs chat-bot matcher (services/chat-bot)
6. tf-connect.js poll GET /api/tiktok/status → updateUI('connected')
```

---

## API Endpoints (162 total)

| Family | Examples |
|---|---|
| Identity | `/api/me`, `/api/loginChannel`, `/api/switchProfile`, `/api/setAffiliate` |
| Auth | `/api/v1/auth/sso-bridge`, `/api/auth/key-login`, `/api/auth/logout`, `/api/v1/code/*`, `/api/v1/flow/*` |
| Config | `/api/getAppConfig`, `/api/getSystemConfig`, `/api/init`, `/api/v2/sync`, `/api/getTranslations` |
| Settings | `/api/updateSettings`, `/api/getOverlayConfig`, `/api/modules` |
| Actions | `/api/rest/action` (CRUD) |
| Sounds | `/api/sounds`, `/api/rest/sound` (CRUD) |
| TTS | `/api/tts/generate` |
| Goals | `/api/goals` (CRUD + `/:id/reset`) |
| Points | `/api/points/leaderboard`, `/api/points/user/:username` |
| Commands | `/api/commands` (CRUD + `/test/:id`) |
| Widget | `/api/widget/timer/:op`, `/coinjar/reset`, `/wheel/spin`, `/coindrop/*`, `/coinmatch/*`, `/actions/execute`, `/actions/test`, `/broadcast/:eventName` |
| Data | `/api/odata/transaction`, `/api/rest/transaction`, `/api/getAllGifts`, `/api/getAllAnimations`, `/api/getChannelEmotes`, `/api/usage/log` |
| Notifications | `/api/notifications/list`, `/markRead`, `/markAllRead`, `/clear` |
| Backup | `/api/backup/export`, `/api/backup/import` |
| Reset | `/api/reset/aggregates`, `/reset/points`, `/reset/goals`, `/reset/all` |
| Seed | `/api/seed`, `/api/seed/status` |
| Pro | `/api/pro/status`, `/upgrade`, `/tazapay/methods` |
| Upload | `/api/uploadFile`, `/api/uploadMedia`, `/api/uploads/list`, `/api/uploads/delete` |
| Webhooks | `/api/webhooks` (CRUD + `/test/:id`) |
| OBS | `/api/obs/status`, `/connect`, `/disconnect`, `/scenes`, `/scene`, `/source/toggle` |
| Tikfinity Import | `/api/import/tikfinity`, `/api/import/tikfinity/test` |
| TikTok bridge | `/api/tiktok/status`, `/connect`, `/disconnect`, `/stats`, `/stats/reset` |
| Health | `/api/health` |
| Socket.IO | `/socket.io/` (WS + polling) |
| Fallback | `/api/{**}` → 404 with `[404] Unhandled API: …` log |

---

## Socket.IO Events

### Server → Client

| Event | Source | Payload (sample) |
|-------|--------|------------------|
| `chat` | TikTok LIVE | uniqueId, nickname, comment, isModerator, … |
| `gift` | TikTok LIVE | uniqueId, giftId, giftName, diamondCount, repeatCount, … |
| `like` | TikTok LIVE | uniqueId, likeCount, totalLikeCount |
| `share`, `follow`, `member`, `subscribe`, `emote`, `envelope`, `questionNew`, `roomUser` | TikTok LIVE | (per-event shapes) |
| `connected` / `disconnected` / `streamEnd` / `error` | Bridge | username, roomId, … |
| `widgetSettings` | services/widget-settings-cache | Merged defaults + DB overrides |
| `goalsUpdate` | services/tiktok-bridge | goals list with `current/target/percent` |
| `goalsChanged` | routes/goals | `{ channelId }` (widgets re-fetch) |
| `topGifters`, `topLikers`, `rankingUpdate`, `topGift`, `viewerCount` | services/aggregates | Top N arrays / counter snapshots |
| `pointsReset`, `goalsReset`, `aggregatesReset` | routes/reset | `{ channelId, removed }` |
| `actionsChanged` | routes/me, routes/widget | `{}` (myactions widget re-fetches) |
| `profileChanged` | routes/me | `{ profileId, channelId }` |
| `chatCommandFired` | services/chat-bot | `{ commandId, command, response, username, nickname }` |
| `executeAction` | routes/widget /actions/test | `(actionInfo, context)` (two positional args) |
| `timerState`, `timerAddSeconds` | routes/widget /timer | `{ state, durationMs }` / `{ seconds }` |
| `coinjarReset`, `showUserScore`, `spinWheel`, `onSpinWheel`, `createCoins`, `timeoutCoins`, `collectCoin`, `coin-match:start/update/result/reset`, `showCommands`, `showCustomCommands`, `showCommandResult`, `setPlaylistItems` | routes/widget | Forwarded payload |

### Client → Server

| Event | Source | Payload |
|-------|--------|---------|
| `setContext` | Widget tabs | `{ channelId, appType }` (used for per-channel broadcasts) |

---

## Database Models

Per-channel + per-profile shape unless noted.

| Model | Table | Key fields |
|-------|-------|------------|
| Channel | Channels | ChannelId (PK), ChannelName, Email, Sub (Serial Key), ProfileId (active), AffId, Locale, … |
| Subscription | Subscriptions | ChannelId (FK), IsPro, Plan, Active, ProExpireAt |
| Profile | Profiles | Id, ChannelId, Name, Sort |
| DynamicSetting | DynamicSettings | UNIQUE(ChannelId, ProfileId, Key) |
| ActionItem | Actions | Per-profile event triggers with ConfigJson blob |
| Sound | Sounds | FileName, Url, Volume, Category |
| Goal | Goals | Type (gifts/likes/follows/…), Target, Current |
| ChatCommand | ChatCommands | Command, Response, Cooldown |
| ChannelModule | ChannelModules | ModuleId (actions/tts/sounds/…), Enabled, Sort |
| Transaction | Transactions | Pro upgrades, gift purchases |
| Notification | Notifications | Subject, Body, Category, DataJson, IsRead, IsSeen |
| Overlay | Overlays | OBS browser-source configs (per-channel, NOT per-profile) |
| Widget | Widgets | Embedded widgets metadata |
| Timer | Timers | Countdown configs |
| Webhook | Webhooks | Outbound HTTP hooks (Discord + custom URL) |
| RevokedToken | RevokedTokens | JWT denylist (jti + ExpiresAt) |

---

## Widget System

### Cách hoạt động

1. Widget là file HTML độc lập trong `downloads/widget/`
2. URL: `http://localhost:5285/widget/{name}?cid={channelId}`
3. Kết nối Socket.IO qua SharedWorker (`sharedioworker.js`) hoặc native fallback
4. Gửi `setContext` với `{ channelId, appType: 'widget' }` ngay khi connect
5. Nhận `widgetSettings` từ `services/widget-settings-cache` với toàn bộ config
6. Lắng nghe TikTok events và render animation/overlay

### Pro gating
Bundle expects `isPro: true` ở mọi endpoint (`/api/me`, `/api/getAppConfig`, `widgetSettings`). License gate ở `routes/key-auth.js` đảm bảo user đã pass Serial Key trước khi reach renderer.

---

## Authentication

Trong build local:
- **Serial Key gate** là nguồn xác thực chính. `routes/key-auth.js` proxy đến TikfinityServer ở 127.0.0.1:5194.
- Sau khi license valid, mint local JWT (HS256, 7-day) bound vào default channel.
- Bundle dùng JWT này làm `wsAuthToken` (cached per channel — KHÔNG mint mới mỗi request, vì `iat` thay đổi sẽ trigger reload loop).
- `featureBaseToken` cached per `(channelId, frontendChannelName)` vì frontendChannelName là profile-scoped.

### JWT Claims

| Claim | Value |
|-------|--------|
| `channelId` | Channel ID |
| `channelName` | Channel name |
| `email` | Email |
| `isPro` | `"true"` (string, matches C# format) |
| `jti` | UUID (revocation key) |
| `iss` | `tikfinity-local` |
| `aud` | `tikfinity-bundle` |
| `exp` | iat + 7 days |

---

## Injected JavaScript (middleware/index-html.js)

`buildIndexHtml({channelId, channelName})` thực hiện:

1. **Strip telemetry**: PostHog, Sentry, gtag, contentsquare, featurebase
2. **Rewrite cloud hosts**: `authApiHost`, `myinstantsApiHost`, `connectorHost` → local proxy
3. **Head injection** (after `<head>`):
   - `reloadGuard` — patches `Location.prototype.reload` to enforce sessionStorage cooldown
   - `earlyCss` — hides error popups + loading states
   - `blockScript` — fetch/XHR monkey-patches for auth headers
   - `authScript` — localStorage token bridge with `{{defaultChannelId}}` interpolation
4. **Body injection** (after `<body class="tf-logged-out">`):
   - `ttsVoiceShim`, `guestTopbar`, `loginPopupScript`, `tiktokConnectScript`
   - `ttsScript`, `twemojiScript`, `tiktokSigninGate`, `reloadMask`

Result cached in memory per (channelId, channelName) — re-built only when DB defaults change.

---

## TikTok Bridge (services/tiktok-bridge.js)

### Config

| Env Variable | Default | Mô tả |
|-------------|---------|--------|
| `SIGN_API_KEY` | (none) | Eulerstream paid tier API key |
| `TIKTOK_SESSIONID` | (none) | Authenticated sessionid cookie (optional, skips Eulerstream) |
| `TIKTOK_TT_TARGET_IDC` | (none) | Required with sessionId |
| `PORT` | 5285 | Backend port (HTTP + Socket.IO) |
| `HOST` | 127.0.0.1 | Bind address |
| `TIKMAX_DATA_DIR` | `%APPDATA%/tikfinity-desktop` | Database + uploads location |

### Constructor options

```javascript
{
  processInitialData: true,
  enableExtendedGiftInfo: false,        // Off — fails connect on slow links
  fetchRoomInfoOnConnect: false,         // Off — same reason
  enableRequestPolling: true,
  requestPollingIntervalMs: 2000,
  webClientOptions: { timeout: 10000 },
  wsClientOptions: { timeout: 10000 },
}
```

### Connection lifecycle

1. `bridge.connect(username, channelId)` — idempotent, disconnects prior
2. `connection.connect()` wrapped in 25s timeout via `Promise.race`
3. If `connect()` rejects but events arrived → **soft success** (lib v2 oddity)
4. On disconnect/streamEnd, `_state.connected = false` and broadcast back to clients

---

## Chạy project

```bash
# Backend only (port 5285)
npm run web

# Backend with auto-reload
npm run web:dev

# Desktop (Electron + backend)
npm run desktop
# OR
start_desktop.bat
```

### Production build

```bash
build-app.bat
# Output:
#   electron\dist\TikFinity Setup <ver>.exe   (NSIS installer)
#   electron\dist\TikFinity <ver>.exe         (portable)
```

End users không cần Node.js — Electron's embedded Node runs the backend via `ELECTRON_RUN_AS_NODE=1`.

### Startup sequence

1. Electron main process spawns backend-node child (port 5285, env: PORT/HOST/TIKMAX_DATA_DIR)
2. Backend bootstraps: Knex migrations → seed default channel → warm WidgetSettingsCache → bind Express + Socket.IO
3. Splash window polls `/api/health` until 200, then loads main window pointing at `http://localhost:5285/`
4. `middleware/index-html.js` returns injected HTML
5. Bundle boots, fetches `/api/me` (auth state), `/api/getAppConfig`, opens Socket.IO connection
6. TikTok LIVE connection idle until user clicks "Connect"

---

## Migration notes

This project was originally a .NET 9 backend (16k LOC in `backend/`). Migrated to Node in May 2026. Migration tracking doc: [docs/MIGRATION_PLAN.md](docs/MIGRATION_PLAN.md).

- 23 C# controllers → 17 Node routers (~5800 LOC)
- 14 EF Core models → 17 better-sqlite3 model modules
- 3 EF Core migrations consolidated → 1 Knex migration
- `TikTokBridgeService.cs` (2k LOC, subprocess WebSocket) → `services/tiktok-bridge.js` (~300 LOC, embedded)
- `WidgetSettingsCache.cs` → `services/widget-settings-cache.js` + `services/widget-defaults.js`
- SignalR `Hubs/TikFinityHub.cs` removed (bundle never used it; Socket.IO only)
