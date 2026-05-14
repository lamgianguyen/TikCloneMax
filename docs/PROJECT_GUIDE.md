# TikFinity Clone — Project Guide

> File tổng hợp: kiến trúc + database + roadmap. Đọc file này là đủ.

---

## 1. Kiến trúc tổng thể

```
Electron Wrapper (electron/main.js)
    ↓
Browser (localhost:5285)              ← User UI
    ↕ Socket.IO (WebSocket)
.NET Backend (port 5285)              ← API + Socket.IO server
    ↕ WebSocket (port 5288)
Node.js Bridge                        ← tiktok-live-connector v2
    ↕ Internet
TikTok LIVE Servers
```

**Auxiliary:**
- TikfinityServer (port 5194) — auth + Serial Key license validation
- Desktop API WebSocket (port 21213) — external plugins (Streamerbot...)

---

## 2. Files quan trọng

### 2.1 Electron wrapper
| File | Chức năng |
|------|-----------|
| [electron/main.js](../electron/main.js) | Main process: spawn backend, splash, main window, IPC handlers |
| [electron/preload.js](../electron/preload.js) | Bridge auth API tới renderer (`window.TFS`) |
| [electron/splash.html](../electron/splash.html) | Splash screen lúc khởi động |
| [electron/auth-store.js](../electron/auth-store.js) | Lưu Serial Key tại `<userData>/auth.json` |
| [electron/auth-flow.js](../electron/auth-flow.js) | TikTok login flow (BrowserWindow → cookie capture) |
| [electron/state-persistence.js](../electron/state-persistence.js) | Lưu TikTok sessionid tại `<userData>/tiktok-session.json` |

### 2.2 Frontend (bundle obfuscated)
| File | Chức năng |
|------|-----------|
| `downloads/combo/app.js` | Bundle Vue 3 obfuscated (3.4MB) — UI chính |
| `downloads/js/tf-connect.js` | Intercept nút Connect, gọi API, hiện toast |
| `downloads/js/init.js` | Load scripts |
| `downloads/widget/*.html` | 50+ overlay widgets cho OBS |

### 2.3 Backend (.NET 9)
| File | Chức năng |
|------|-----------|
| [backend/Program.cs](../backend/Program.cs) | Server chính, `BuildIndexHtml()` inject ~2000 dòng JS vào HTML |
| [backend/Controllers/](../backend/Controllers/) | API endpoints (TikTok, Me, Settings, Actions, Goals...) |
| [backend/Services/TikTokBridgeService.cs](../backend/Services/TikTokBridgeService.cs) | Quản lý Node.js bridge, forward events |
| [backend/Services/SocketManager.cs](../backend/Services/SocketManager.cs) | Broadcast Socket.IO events tới browser |
| [backend/Services/FeatureGate.cs](../backend/Services/FeatureGate.cs) | Single source of truth cho Stable/Hidden features. Gate cả menu (ConfigController) lẫn route (UnstableFeatureMiddleware) |
| [backend/Services/LocalOnlyAttribute.cs](../backend/Services/LocalOnlyAttribute.cs) | `[LocalOnly]` filter — block non-loopback IPs. Áp dụng cho controllers fire side effects (WidgetController). Override env `TIKMAX_ALLOW_LAN=1` |
| [backend/Data/AppDbContext.cs](../backend/Data/AppDbContext.cs) | SQLite context (EF Core) |

### 2.4 Node.js Bridge
| File | Chức năng |
|------|-----------|
| [tiktok-bridge/index.js](../tiktok-bridge/index.js) | Kết nối TikTok LIVE bằng tiktok-live-connector v2 |
| [tiktok-bridge/package.json](../tiktok-bridge/package.json) | Dependencies |

---

## 3. Flow kết nối TikTok LIVE

```
1. User bấm Connect (tf-connect.js)
   ├── document.addEventListener('click', ..., true)  // capture phase
   ├── getTikTokUsername(btn)
   ├── showToast('Connecting...')
   └── fetch('/api/tiktok/connect', {username})

2. Backend nhận request (TikTokController.cs)
   ├── Lưu tiktokname vào DynamicSettings
   ├── _bridge.ConnectToTikTok(username)
   └── Return {status: "ok"}

3. Bridge Service gửi lệnh (TikTokBridgeService.cs)
   ├── Check WS connection (auto-reconnect nếu closed)
   ├── Broadcast "channelStatus" + "status" {connecting: true}
   └── _bridgeWs.Send({action: "connect", username})

4. Node.js bridge kết nối TikTok (tiktok-bridge/index.js)
   ├── new TikTokLiveConnection(username)
   ├── Read TIKTOK_SESSIONID từ disk (state-persistence)
   ├── connection.connect()
   └── Đăng ký event listeners: chat, gift, like, follow...

5. Events flow ngược về browser
   TikTok → Bridge → WS → BackendService → SocketManager → Browser

6. Frontend update UI (tf-connect.js)
   ├── pollStatus() mỗi 2s
   ├── Toast "Connected — LIVE!"
   └── Update nav avatar góc phải
```

---

## 4. Socket.IO Events

### Backend → Browser
| Event | Data | Khi nào |
|-------|------|---------|
| `loginResult` | channelId, channelName, isPro | WS connect |
| `channelStatus` | connected, username, status | Connect/disconnect |
| `chat` | uniqueId, comment, nickname | Có chat |
| `gift` | uniqueId, giftName, diamondCount | Có gift |
| `like` | uniqueId, likeCount | Có like |
| `follow`, `member`, `share`, `subscribe` | uniqueId, nickname | Tương tác |
| `roomUser` | viewerCount, topViewers | Update viewers |
| `streamEnd` | username | Stream kết thúc |
| `goalStatus` | goalId, current, target | Goal progress |
| `connectFailed` | username, message | Connect lỗi |

### Browser → Backend
| Event | Data |
|-------|------|
| `setUniqueId` | uniqueId |
| `login` | token |

---

## 5. Database (SQLite — `tikfinity.db`)

### 5.1 ERD đơn giản
```
Channel (1) ──┬── (1) Subscription      [Pro/Free, expiry]
              ├── (N) Profile           [Stream profiles]
              ├── (N) DynamicSetting    [key/value: tiktokname, widgets...]
              ├── (N) Sound             [sound alerts]
              ├── (N) ActionItem        [gift→action triggers]
              ├── (N) ChannelModule     [enable/disable modules]
              ├── (N) Transaction       [payment history]
              ├── (N) Notification      [in-app notifications]
              ├── (N) Overlay           [overlay configs]
              ├── (N) Widget            [widget configs]
              ├── (N) ChatCommand       [!cmd → response]
              ├── (N) Goal              [progress goals]
              └── (N) TimerItem         [interval timers]

RevokedToken (no FK)                    [JWT blacklist on logout]
```

### 5.2 Bảng theo nhóm

**Identity / Auth:**
- `Channel` — User account. Unique: `ChannelName`, `Email`, `GoogleId`. Có lockout (`FailedLoginCount`, `LockedUntil`)
- `Subscription` — Pro/Free, `ProExpireAt`
- `RevokedToken` — JWT blacklist (lookup theo `Jti` mỗi request)

**Personalization:**
- `Profile` — Stream profiles, default `ProfileId=1`
- `DynamicSetting` — Key-value generic. Unique `(ChannelId, Key)`. Value max 4000 char
- `ChannelModule` — Bật/tắt module: actions, tts, sounds, media, timers, commands, spotify, webhooks, overlays

**Streamer Tools:**
- `ActionItem` — Trigger reactive (gift/like/follow/share/comment/subscribe)
- `Sound` — Sound alerts
- `ChatCommand` — `!cmd` → response với cooldown
- `Goal` — Progress goals
- `TimerItem` — Interval timers
- `Overlay`, `Widget` — Config JSON

**Billing:**
- `Transaction` — Payment history (status, provider)
- `Notification` — In-app notifications

### 5.3 Migration
- Migrations: `backend/Migrations/`
- Auto-apply lúc boot: `db.Database.Migrate()` ở [Program.cs:165](../backend/Program.cs#L165)
- Lần đầu: tạo file `tikfinity.db`, DB rỗng. Register sẽ tạo Channel + Subscription + Profile + 9 ChannelModule mặc định

### 5.4 Lưu ý
- **DB file** đi kèm exe lúc runtime — deploy server cần mount volume
- **Không có** bảng riêng cho user spend/ranking realtime — aggregate trong RAM (`_topGifters`, `_rankingUsers`)
- **Chưa có** cleanup job cho `RevokedToken`
- `Transaction.Amount` lưu TEXT (SQLite không có decimal native)

---

## 6. Overlay Widgets cho OBS

```
http://localhost:5285/widget/<name>.html
```

Browser source trong OBS → mở URL → Socket.IO kết nối → render real-time.

**Widgets có sẵn:**
- `chat` — chat messages
- `gifts` — gift alerts
- `viewercount` — số viewers
- `goal` — progress bar
- `ranking`, `topgifter`, `topliker` — leaderboards
- `wheel` — vòng quay
- `timer` — countdown
- `cannon`, `firework`, `fallingsnow` — effects
- `songrequests` — yêu cầu bài hát
- 40+ widgets khác

---

## 7. Roadmap — Feature parity với Tikfinity gốc

Support matrix (Stable/Beta/Hidden) + roadmap **canonical** tại **[FEATURE_PARITY.md](FEATURE_PARITY.md)**.

**Tóm tắt:**
- **Stable** (12 features): Actions, Events, Sounds, TTS Web, Timers, Commands, Webhooks, Overlays, Goals, OBS, Backup, Points
- **Hidden** (10 features): Media Share, Spotify, Pro/Payment, ElevenLabs TTS, Patreon, Discord, YouTube Chat, Minecraft, TikTok Send Chat
- **Toggle Hidden**: env `TIKMAX_ENABLE_UNSTABLE=1`

Đổi status feature → sync 2 chỗ: `FEATURE_PARITY.md` + `backend/Services/FeatureGate.cs`.

---

## 8. Build & Deploy

### Dev mode
```bash
# Backend
cd backend && dotnet run

# Electron wrapper
cd electron && npm start

# Bridge (auto-started by backend)
```

### Production build
```bash
# Backend
dotnet publish backend/TikFinityBackend.csproj -c Release -r win-x64 --self-contained -o dist/app

# Copy frontend + bridge
xcopy downloads dist\app\downloads /E /I /Q /Y
xcopy tiktok-bridge dist\app\tiktok-bridge /E /I /Q /Y

# Electron installer
cd electron && npm run build:installer
```

**Yêu cầu runtime:** Node.js cài trên máy user (cho bridge).

---

## 9. Lịch sử fix vấn đề

| Vấn đề | Nguyên nhân | Fix |
|---|---|---|
| Reload loop | `settings.restore` redirect về `/` | Block navigation API + block `updateSettings` XHR |
| Bridge WS null | WebSocket đóng giữa chừng | Auto-reconnect trong `ConnectToTikTok` |
| isPro undefined | DB mới trống | `/api/me` fallback về channel 1 |
| challengeRunning error | Vue computed lỗi | Global error handler suppress |
| tiktok-live-connector fail | v1 cũ, TikTok đổi API | Upgrade v2.1.1 |
| trc.js block fetch | Anti-piracy guard | Disable trc.js |
| Socket disconnect loop | Server không gửi ping | Server-side ping mỗi 25s |
| Bridge không đọc cookie | Env không propagate qua spawn | Bridge đọc file trực tiếp từ `<APPDATA>/tikfinity-desktop/tiktok-session.json` |
| Reload mask giật | Sidebar/topbar lộ ra | Add `tf-reloading` class trên `<html>` → ẩn mọi thứ ngoài mask |
| `/api/getAppConfig` 500 | `ToDictionary` throw vì DynamicSettings có duplicate `Key` (composite unique gồm cả `ProfileId`) | `GroupBy(d => d.Key).ToDictionary(g => g.Key, g => g.First().Value)` |
| Auth gate force login khi TFS server down | STRICT mode reject mọi entry nếu server unreachable | Cho phép offline entry nếu user có TikTok session đã lưu (`SERVER_UNREACHABLE_OFFLINE` reason) |
| Unstable features lộ trong menu | Module list trả ra full 10 modules dù backend chưa implement (media, spotify) | Thêm `FeatureGate` — filter modules ở `ConfigController` + middleware `UnstableFeatureMiddleware` block route `/api/pro/*`, `/api/spotify/*`, `/api/media/*` |
| TTS error "Voice or Language not supported" | Web Speech voices load async, bundle picks voice từ empty list rồi cache | Inject `ttsVoiceShim` ở `BuildIndexHtml` — patch `SpeechSynthesisUtterance.voice` setter để fallback voice match-by-language, intercept `speak()` để auto-set voice khi bundle quên |
| TTS bundle gọi `tikfinity-tts-api.zerody.one` (commercial proxy Tikfinity, cần Pro account) | Bundle hardcode endpoint Tikfinity | Backend proxy `/api/tts/generate` (TtsController.cs) call thẳng TikTok TTS API `api16-normal-c-useast1a.tiktokv.com` với sessionid sẵn có. `ttsVoiceShim` intercept fetch/XHR/Audio.src redirect URL về local proxy |
| Connect fail hiện 2 popup chồng lên | Custom centered popup + bundle's native modal cùng fire | `suppressBundleConnFailedModal` MutationObserver match text "Failed to access your LIVE stream" → hide bundle modal, giữ custom popup (có nút Login TikTok) |
| Logout button không trigger | LOGOUT_RE regex strict, không match khi label có emoji prefix (🔚 Đăng xuất) | `normalizeLabel()` strip non-letter chars ở 2 đầu trước khi test regex. Thêm diagnostic log để debug nhanh lần sau |
| Ctrl+Shift+R → "missingExtension" connect error | Bridge `connectToTikTok` luôn `disconnectFromTikTok()` đầu vào, kể cả khi đã connect cùng user → fresh connect attempt thường fail vì eulerstream rate-limit | Bridge skip reconnect khi `currentUsername === requested username`, chỉ re-emit `connected` event cho backend biết |
| Reload mask hiện quá lâu (1.8s) cho reload chain ngắn | Debounce hide timer = 1800ms | Giảm xuống 800ms — vẫn cover reload chain nhưng không lag khi single reload |
| Switch profile fire 8-12 lần reload | Bundle's app.js gọi `location.reload()` chain. Guard in-memory bị reset mỗi reload | `reloadGuard` script inject SỚM NHẤT vào body. Counter lưu sessionStorage (survive reload). 2nd+ reload trong 8s → block. Limit visible reload = 1 |
| Preload hardcode `channelid='1'` gây state-shake | preload.js không biết real channelId, gán '1' rồi bundle phải re-hydrate | `fetchBundleJwt` snapshot `channelId`/`profileId`/`channelName` từ `/api/me` → pass vào renderer seed → preload set đúng giá trị thay vì hardcode |
| `hydrateFromApi` gọi 3 lần liên tiếp (boot + applyAuthState + DOMContentLoaded) | Mỗi call apply session payload mới → UI shake | Dedupe: chia sẻ in-flight promise + 1.5s cooldown sau khi xong |
| **WidgetController `[AllowAnonymous]` + bind LAN + CORS mở** → bất kỳ ai trong mạng fire được webhook/Streamer.bot/Minecraft/keystroke | Architect review xác nhận: nguy hiểm cho khách thật | Thêm `[LocalOnly]` attribute (loopback IP check) cho WidgetController; bind `127.0.0.1` mặc định (env `TIKMAX_ALLOW_LAN=1` để opt-in LAN); CORS chỉ allow `localhost`/`127.0.0.1` origins. Cùng env var control cả 3 |
| Profile switch xong preload vẫn seed profile cũ | `cachedInitialApiState` trong Electron main chỉ fetch 1 lần lúc boot, không refresh khi switch | `refreshInitialApiState()` async helper, gọi trên `did-start-navigation` event. Cache update song song khi renderer reload — preload IPC sẽ nhận state mới ở lần load tiếp theo |
| `ConfigController.getAppConfig` leak settings giữa profiles | Load all DynamicSettings + GroupBy key (không filter ProfileId) | Filter `.Where(d => d.ProfileId == activeProfileId)` trước GroupBy. `activeProfileId` đọc từ Channel |
| `WidgetController.TestAction` không scope ProfileId | Query chỉ `ChannelId && Enabled`, fire nhầm action của profile khác | Bổ sung `&& a.ProfileId == GetProfileId()` |
| `getSystemConfig` quảng cáo `media`/`spotify` dù FeatureGate đã ẩn | Hardcoded module list, không qua gate | Dùng chung `DefaultModules()` + filter `_featureGate.IsModuleHidden(m.Id)` |
| `main.js` còn gọi `hideReloadMask()` đã bị xóa → runtime crash khi reload | Dead reference từ phiên bản BrowserWindow mask trước | Xóa call — in-bundle mask tự hide qua `scheduleHide()` |
| Preload sync IPC seed có thể trả profileId stale ngay sau reload (race với `refreshInitialApiState`) | `cachedInitialApiState` có thể chưa fetch xong khi preload gọi `sendSync` | Main vẫn return cache sync, NHƯNG sau khi refresh xong push `auth:seed-updated` event; preload listen + re-apply localStorage → bundle thấy giá trị mới trong <200ms |
| LocalOnly chỉ check loopback IP → web page trên cùng máy vẫn POST được tới `localhost:5285` (browser CSRF) | Browser cho cross-origin POST tới localhost, request đến từ 127.0.0.1 nên qua IP check | Thêm Origin/Referer check: nếu set mà không match `localhost`/`127.0.0.1` → 403. Non-browser callers (Electron, curl, server-to-server) không có Origin → cho qua |

---

## 10. Override bundle (không decompile)

Vì bundle obfuscated, dùng 3 cách "patch xung quanh":

### 10.1 Inject JS/CSS qua `BuildIndexHtml()` (`Program.cs`)
- Đã làm: `tiktokSigninGate`, `reloadMask`, `guestTopbar`, login UI
- Monkey-patch: `window.fetch`, `XMLHttpRequest`, `localStorage`

### 10.2 Backend replace API responses
- Bundle gọi `/api/me` → backend trả data đã modify
- Bundle gọi `/api/feature-flags` → backend control flag
- Cách clean nhất

### 10.3 CSS override + DOM manipulation
- Hide elements: `display: none !important`
- Intercept clicks bằng capture-phase listener (chạy trước Vue handler)

**Không làm được:**
- Decompile Vue components (obfuscated)
- Rewrite component logic

---

## 10.5 Security Model

**Default posture: localhost-only.**

| Concern | Default | Override |
|---|---|---|
| Backend bind address | `127.0.0.1:5285` | `TIKMAX_ALLOW_LAN=1` → `0.0.0.0:5285` |
| CORS origins | `localhost` + `127.0.0.1` only | `TIKMAX_ALLOW_LAN=1` → any origin |
| Mutation endpoints (WidgetController) | `[LocalOnly]` (loopback IP check) | `TIKMAX_ALLOW_LAN=1` bypasses |
| Hidden features (media/spotify/pro) | Blocked at menu + route | `TIKMAX_ENABLE_UNSTABLE=1` |

**Why**: WidgetController fires side effects (webhooks, OBS commands, keystrokes, Streamer.bot). Exposing on LAN = anyone in network can trigger. Single env var (`TIKMAX_ALLOW_LAN`) opts ALL three (bind / CORS / LocalOnly) together for OBS-on-different-machine scenarios.

**Trust boundary**: TikfinityServer (Serial Key) gate at app startup → user is authenticated. Inside app, no per-request JWT for widget endpoints — local-only is the boundary.

---

## 11. Feature Gating

Single source of truth: [backend/Services/FeatureGate.cs](../backend/Services/FeatureGate.cs).

**2 layer:**
1. **Menu hide** — `ConfigController.GetAppConfig()` filter modules theo `FeatureGate.IsModuleHidden()` → bundle không render menu item
2. **Route block** — `UnstableFeatureMiddleware` mount sớm trong pipeline ([Program.cs:498](../backend/Program.cs#L498)) → trả 404 cho `/api/pro/*`, `/api/spotify/*`, `/api/media/*`

**Bật unstable cho dev:**
```bash
# Windows
set TIKMAX_ENABLE_UNSTABLE=1
# hoặc trong appsettings.Development.json
{ "Feature": { "EnableUnstable": true } }
```

**Khi thêm/đổi status:**
1. Update bảng tại [FEATURE_PARITY.md §0](FEATURE_PARITY.md)
2. Update `HiddenModuleIds` hoặc `HiddenRoutePrefixes` trong `FeatureGate.cs`
3. Chạy smoke test (xem §12) để verify

---

## 12. Smoke Tests

Tests tại [smoke/](../smoke/). PowerShell 5+ (Windows-native).

| Test | Check |
|---|---|
| `01-boot.ps1` | `/api/health` respond 200 trong 30s |
| `02-me-status.ps1` | `/api/me` có channelId, `/api/tiktok/status` ok, unstable modules bị hidden |
| `03-connect-disconnect.ps1` | Bridge accept connect → disconnect → settle về disconnected state |

**Chạy:**
```powershell
powershell.exe -NoProfile -File smoke\run-all.ps1
```

**Mandatory chạy trước khi sửa:**
- [Program.cs](../backend/Program.cs) (especially `BuildIndexHtml`)
- [electron/preload.js](../electron/preload.js) auth seed
- [MeController.cs](../backend/Controllers/MeController.cs)
- [ConfigController.cs](../backend/Controllers/ConfigController.cs)
- [FeatureGate.cs](../backend/Services/FeatureGate.cs)

**Convention test mới:** `NN-name.ps1`, source `common.ps1`, exit 0 = pass.
