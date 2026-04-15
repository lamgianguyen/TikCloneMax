# TikFinity Clone — Project Documentation

## Tổng quan

Clone của TikFinity — ứng dụng quản lý TikTok LIVE stream với widget overlay, event tracking, và tự động hóa. Backend .NET 9 phục vụ frontend Vue 3 (obfuscated) từ memory cache, kết nối TikTok LIVE qua Node.js bridge.

**URL**: `http://localhost:5285`

---

## Cấu trúc thư mục

```
clone/
├── backend/                    # .NET 9 ASP.NET Core server
│   ├── Program.cs              # Entry point + middleware + injected JS (~2000 dòng)
│   ├── Controllers/            # REST API controllers
│   │   ├── AuthController.cs       # Đăng ký / đăng nhập
│   │   ├── MeController.cs         # Thông tin user + channel
│   │   ├── TikTokController.cs     # Connect/disconnect TikTok LIVE
│   │   └── SettingsController.cs   # Cập nhật settings + overlays
│   ├── Services/
│   │   ├── TikTokBridgeService.cs  # Quản lý Node.js bridge process
│   │   ├── SocketManager.cs        # Socket.IO broadcast manager
│   │   ├── JwtService.cs           # JWT token generation/validation
│   │   └── ChannelService.cs       # Channel creation
│   ├── Models/                 # EF Core entities (14 models)
│   ├── Data/
│   │   └── AppDbContext.cs     # SQLite database context
│   ├── Hubs/
│   │   └── TikFinityHub.cs     # SignalR hub (minimal)
│   ├── appsettings.json        # JWT secret, DB connection
│   ├── tikfinity.db            # SQLite database
│   └── TikFinityBackend.csproj # .NET project file
├── downloads/                  # Frontend (served from memory cache)
│   ├── index.html              # Được inject JS bởi Program.cs
│   ├── combo/                  # Vue 3 bundle (obfuscated)
│   │   ├── app.js              # Main Vue app
│   │   ├── modules.js          # Feature modules
│   │   ├── ui.css              # UI framework styles
│   │   └── modules.css         # Module styles
│   ├── js/                     # JavaScript modules
│   │   ├── init.js             # Bootstrap, load scripts
│   │   ├── navigation.js       # Navigation system
│   │   ├── tf-connect.js       # TikTok connect/disconnect logic
│   │   ├── lib-bundle.min.js   # Third-party libs (Vue, jQuery, etc.)
│   │   ├── tts.js              # Text-to-speech
│   │   ├── text-effects.js     # Chat text effects
│   │   └── audiofix.js         # Mobile audio compatibility
│   ├── widget/                 # 30+ widget HTML files
│   │   ├── cannon.html         # Gift cannon animation
│   │   ├── chat.html           # Chat overlay
│   │   ├── gifts.html          # Gift notifications
│   │   ├── firework.html       # Firework animation
│   │   ├── emojify.html        # Emoji rain overlay
│   │   ├── likefountain.html   # Like animation
│   │   ├── goal.html           # Goal progress
│   │   ├── ranking.html        # User ranking
│   │   ├── topgifter.html      # Top gifter list
│   │   ├── topliker.html       # Top liker list
│   │   ├── wheel.html          # Wheel of fortune
│   │   ├── coinjar.html        # Coin jar progress
│   │   ├── coindrop.html       # Falling coins
│   │   ├── activity-feed.html  # Activity log
│   │   ├── viewercount.html    # Viewer counter
│   │   ├── sharedio/           # SharedWorker framework
│   │   │   └── sharedioworker.js
│   │   └── ...                 # 15+ more widgets
│   ├── css/                    # Stylesheets
│   └── assets/, img/, sounds/  # Static assets
├── tiktok-bridge/              # Node.js TikTok LIVE bridge
│   ├── index.js                # WebSocket server + TikTok connector
│   └── package.json            # Dependencies
├── electron/                   # Electron desktop wrapper
├── package.json                # Root npm scripts
└── clone.sln                   # Visual Studio solution
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | .NET 9, ASP.NET Core, Entity Framework Core |
| Database | SQLite (`tikfinity.db`) |
| Frontend | Vue 3 (obfuscated bundle), jQuery |
| Realtime | Socket.IO v4 (custom implementation, không dùng SignalR) |
| TikTok Bridge | Node.js, `tiktok-live-connector` v2.1.1-beta1 |
| Auth | JWT Bearer (30-day tokens) |
| Desktop | Electron (optional) |

---

## Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Vue 3)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │ Main App │  │ Widgets  │  │tf-connect│  │ Navigation │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────────┘ │
│       │              │             │                        │
│       └──────────────┴─────────────┘                        │
│                      │                                      │
│           Socket.IO + REST API                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│              .NET 9 Backend (port 5285)                      │
│                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐ │
│  │ REST API      │  │ Socket.IO     │  │ Static Files    │ │
│  │ Controllers   │  │ Manager       │  │ (Memory Cache)  │ │
│  └───────┬───────┘  └───────┬───────┘  └─────────────────┘ │
│          │                  │                                │
│  ┌───────┴──────────────────┴───────┐                       │
│  │      TikTokBridgeService         │                       │
│  │   (spawns + manages bridge)      │                       │
│  └───────────────┬──────────────────┘                       │
│                  │ WebSocket (port 5288)                     │
└──────────────────┼──────────────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────────────┐
│           Node.js TikTok Bridge (port 5288)                  │
│                                                              │
│  ┌────────────────────────────────────────┐                  │
│  │  tiktok-live-connector v2              │                  │
│  │  (WebSocket + HTTP polling to TikTok)  │                  │
│  └────────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                   │
            TikTok LIVE Servers
```

---

## Luồng kết nối TikTok LIVE

```
1. User nhập username → Bấm "Kết nối với TikTok LIVE"
2. tf-connect.js → POST /api/tiktok/connect { username }
3. TikTokController → TikTokBridgeService.ConnectToTikTok(username)
4. BridgeService → WebSocket message → Node.js bridge
5. Bridge → tiktok-live-connector.connect(username)
   - 3 retries, 30s timeout mỗi lần, 2s delay giữa retries
6. tf-connect.js poll GET /api/tiktok/status mỗi 1s (max 30 lần)
7. Khi connected:
   - Bridge gửi "connected" event → Backend
   - Backend broadcast qua Socket.IO → tất cả clients
   - tf-connect.js nhận status → updateUI('connected')
   - Pinia store: isLive=true, isConnecting=false, channelName=username
```

---

## API Endpoints

| Endpoint | Method | Mô tả |
|----------|--------|--------|
| `/api/auth/register` | POST | Đăng ký tài khoản |
| `/api/auth/login` | POST | Đăng nhập → JWT token |
| `/api/me` | GET/POST | Thông tin user + channel + settings |
| `/api/tiktok/connect` | POST | Kết nối TikTok LIVE |
| `/api/tiktok/disconnect` | POST | Ngắt kết nối |
| `/api/tiktok/status` | GET | Trạng thái kết nối + số client |
| `/api/updateSettings` | POST | Cập nhật settings (key-value) |
| `/api/getOverlayConfig` | GET/POST | Lấy overlay config |
| `/api/switchProfile` | POST | Đổi profile |
| `/api/health` | GET | Health check |
| `/api/{**path}` | ALL | Fallback — trả empty arrays |
| `/socket.io/` | WS/Poll | Socket.IO transport |

---

## Socket.IO Events

### Events từ Backend → Client

| Event | Data | Nguồn |
|-------|------|-------|
| `chat` | uniqueId, nickname, comment, isModerator, ... | TikTok LIVE |
| `gift` | uniqueId, giftId, giftName, diamondCount, repeatCount, ... | TikTok LIVE |
| `like` | uniqueId, likeCount, totalLikeCount | TikTok LIVE |
| `share` | uniqueId, nickname | TikTok LIVE |
| `follow` | uniqueId, nickname | TikTok LIVE |
| `member` | uniqueId, nickname, actionId | TikTok LIVE |
| `subscribe` | uniqueId, nickname, subMonth | TikTok LIVE |
| `emote` | uniqueId, emoteId, emoteImageUrl | TikTok LIVE |
| `envelope` | coins, canOpen, timestamp | TikTok LIVE |
| `questionNew` | uniqueId, questionText | TikTok LIVE |
| `roomUser` | viewerCount, topViewers | TikTok LIVE |
| `coin-jar:gift` | giftPictureUrl, value, repeatCount, giftName | Derived (gift) |
| `onLikeReceived` | likeCount, profilePictureUrl, userId | Derived (like) |
| `updateViewerCount` | viewerCount | Derived (roomUser) |
| `channelStatus` | status object (connected, connecting, tiktok, ...) | Backend |
| `widgetSettings` | isPro, cannon_*, chat_*, firework_*, ... | Backend |
| `loginResult` | userId, channelId, channelName, isPro, ... | Init |
| `stats` | viewers, likes, gifts, diamonds, followers | Backend |

### Events từ Client → Backend

| Event | Data | Mô tả |
|-------|------|-------|
| `login` | appType, token | Widget login request |
| `channelStatus` | (query) | Request status update |

---

## Database Models

| Model | Bảng | Mô tả |
|-------|------|-------|
| `Channel` | Channels | Tài khoản user (ChannelName, Email, ProfileId) |
| `Subscription` | Subscriptions | Pro subscription (isPro, plan, dates) |
| `Profile` | Profiles | Multiple profiles per channel |
| `DynamicSetting` | DynamicSettings | Key-value settings per channel |
| `Sound` | Sounds | Audio alerts |
| `ActionItem` | ActionItems | Event triggers/actions |
| `ChannelModule` | ChannelModules | Module on/off per channel |
| `Transaction` | Transactions | Earnings tracking |
| `Notification` | Notifications | System notifications |
| `Overlay` | Overlays | HTML overlay widgets |
| `Widget` | Widgets | Embedded widgets |
| `ChatCommand` | ChatCommands | Custom chat commands |
| `Goal` | Goals | Goal tracking |
| `TimerItem` | TimerItems | Countdown timers |

---

## Widget System

### Cách hoạt động

1. Widget là file HTML độc lập trong `downloads/widget/`
2. Mở qua URL: `http://localhost:5285/widget/{name}?cid={channelId}`
3. Kết nối Socket.IO qua SharedWorker (`sharedioworker.js`) hoặc native fallback
4. Nhận event `widgetSettings` với config (isPro=true, widget-specific settings)
5. Lắng nghe TikTok events (gift, chat, like, ...) và render animations

### Danh sách Widgets

| Widget | File | Events lắng nghe | Pro-gated |
|--------|------|-------------------|-----------|
| Cannon | cannon.html | gift | Yes |
| Chat | chat.html | chat | Yes |
| Gifts | gifts.html | gift | Yes |
| Firework | firework.html | gift | Yes |
| Emojify | emojify.html | chat, like | Yes |
| Like Fountain | likefountain.html | onLikeReceived | Yes |
| Coin Jar | coinjar.html | coin-jar:gift | No |
| Coin Drop | coindrop.html | gift | Yes |
| Goal | goal.html | gift | No |
| Ranking | ranking.html | gift | No |
| Top Gifter | topgifter.html | updateTopGifter | No |
| Top Liker | topliker.html | updateTopLiker | No |
| Viewer Count | viewercount.html | updateViewerCount | No |
| Activity Feed | activity-feed.html | chat, gift, like, follow, share | No |
| Wheel | wheel.html | spinWheel | Yes |
| Carousel | carousel.html | (timer-based) | No |
| User Info | userinfo.html | (on-demand) | No |

### Widget Settings mặc định

Được inject từ `Program.cs` qua Socket.IO event `widgetSettings`:

```json
{
  "isPro": true,
  "cannon_ballTimeout": 30,
  "cannon_maxBalls": 20,
  "chat_fontSize": 14,
  "chat_showBadges": true,
  "firework_maxFireworks": 5,
  "gifts_hideAfter": 10,
  "emojify_emojiSize": 40,
  "likefountain_randomColor": true,
  "viewercount_textColor": "#ffffff",
  ...
}
```

---

## Authentication

### Luồng Auth

```
1. POST /api/auth/register { username, email, password }
   → Tạo Channel + Subscription (isPro=true) + Profile
   → Trả JWT token

2. POST /api/auth/login { username, password }
   → Verify credentials
   → Trả JWT token (30-day expiry)

3. Token stored: localStorage('authToken')
   → REST: Authorization: Bearer {token}
   → Socket.IO: ?access_token={token}
```

### JWT Claims

| Claim | Mô tả |
|-------|--------|
| `channelId` | ID channel |
| `channelName` | Tên channel |
| `email` | Email |
| `isPro` | Always true (dev mode) |

---

## Injected JavaScript (Program.cs)

`BuildIndexHtml()` inject ~2000 dòng JS vào `index.html`:

| Feature | Mô tả |
|---------|--------|
| PostHog stub | Fake analytics, feature flags (`new-navigation` = true) |
| Sentry stub | Fake error tracking (no-op) |
| Auth bridge | localStorage token management, session object |
| `createNavigation()` | Global function cho Vue bundle (bundle cần nhưng không có) |
| XHR/fetch patches | Intercept API requests, add auth headers |
| Settings page patch | Custom TikTok connect UI trên settings page |
| CSS overrides | Hide error popups, toast errors, loading states |
| TikTok connect hooks | Load `tf-connect.js`, hook `browserbridge` |

---

## TikTok Bridge (Node.js)

### Config

| Env Variable | Default | Mô tả |
|-------------|---------|--------|
| `BRIDGE_PORT` | 5288 | WebSocket port |
| `TIKTOK_CONNECT_TIMEOUT_MS` | 30000 | Timeout per attempt |
| `TIKTOK_MAX_RETRIES` | 3 | Max connection retries |
| `SIGN_API_KEY` | (none) | TikTok signing API key |

### TikTok Connector Options

```javascript
{
  processInitialData: true,
  enableExtendedGiftInfo: true,
  fetchRoomInfoOnConnect: true,
  enableRequestPolling: true,       // Fallback HTTP polling
  requestPollingIntervalMs: 2000,
  webClientOptions: { timeout: 15000 },
  wsClientOptions: { timeout: 15000 }
}
```

### Dependencies

- `tiktok-live-connector` v2.1.1-beta1
- `ws` v8.16.0

---

## Chạy project

```bash
# Web server (development)
cd backend && dotnet run

# Hoặc từ root
npm run web

# Desktop (Electron)
npm run desktop
```

### Startup sequence

1. Kill process cũ trên port 5285 (nếu có)
2. Load toàn bộ file frontend vào memory cache
3. Khởi động Node.js TikTok bridge (port 5288)
4. Mở port 5285, listen on `0.0.0.0`
5. Serve `index.html` với injected JavaScript
6. Chờ WebSocket/polling connections

---

## Lỗi đã biết & đã fix

| # | Lỗi | Nguyên nhân | Fix |
|---|------|------------|-----|
| 1 | Reload loop (13 reloads/10s) | Bundle gọi `location.reload()` sau `updateSettings` | Override `location.reload()` + block XHR |
| 2 | EADDRINUSE port conflict | Zombie node.exe process | Auto port selection (fallback port 0) |
| 3 | `_connected` race condition | Background thread vs API thread | `volatile` keyword |
| 4 | UI hiện "123456" | DOM scanning match nhầm element | Xóa DOM scanning, dùng status bar riêng |
| 5 | Trang trắng khi connect | Bundle Vue handler xóa trang | Capture-phase click + hook browserbridge |
| 6 | "Connection Error" popup | Bundle browserbridge popup | CSS hide + không broadcast "connecting" |
| 7 | "API Error (-1)" toast | Bundle API request bị reject | CSS `.toast-error { display: none }` |
| 8 | Góc phải kẹt "Connecting..." | Backend thiếu `connecting: false` trong broadcast | Thêm `connecting=false` vào tất cả status broadcasts |
| 9 | Widget không nhận socket | Thiếu `widgetSettings` event | Thêm `widgetSettings` vào init + login handler |
| 10 | WebSocket "Unexpected server response: 200" | TikTok anti-bot / signing issue | Đang điều tra |

---

## Aggregate Events (chưa implement)

Các widget events cần logic tổng hợp phía backend (chưa có):

| Event | Widget | Logic cần |
|-------|--------|-----------|
| `updateTopGifter` | topgifter.html | Track + sort top gifters by diamond count |
| `updateTopLiker` | topliker.html | Track + sort top likers |
| `updateRanking` | ranking.html | Combined ranking system |
| `goalStatus` | goal.html | Track progress toward gift/diamond goals |
| `giftGoalStatus` | goal.html | Specific gift goal tracking |
| `timerUpdate` | timer.html | Countdown timer state |
| `spinWheel` | wheel.html | Trigger wheel spin on gift threshold |
