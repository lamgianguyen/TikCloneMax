# TikFinity Clone - Architecture Guide

## Tổng quan

Desktop app kết nối TikTok LIVE, nhận events real-time (chat, gift, like...), hiển thị overlay cho OBS.

```
Browser (localhost:5285)
    ↕ Socket.IO (WebSocket)
.NET Backend (port 5285)
    ↕ WebSocket (port 5286)
Node.js Bridge (tiktok-live-connector v2)
    ↕ Internet
TikTok LIVE Servers
```

## Files quan trọng

### Frontend (Browser)
| File | Chức năng |
|------|-----------|
| `downloads/js/tf-connect.js` | Xử lý kết nối TikTok: intercept nút Connect, gọi API, hiện toast, cập nhật UI |
| `downloads/js/init.js` | Load scripts (app.js, lib-bundle) |
| `downloads/js/navigation.js` | Top navigation bar |
| `downloads/combo/app.js` | Bundle Vue 3 obfuscated (3.4MB) - UI chính |
| `downloads/widget/*.html` | 50+ overlay widgets cho OBS |

### Backend (.NET 9)
| File | Chức năng |
|------|-----------|
| `backend/Program.cs` | Server chính, Socket.IO handler, inject JS vào HTML |
| `backend/Controllers/TikTokController.cs` | API: `/api/tiktok/connect`, `/disconnect`, `/status` |
| `backend/Controllers/MeController.cs` | API: `/api/me` - thông tin user/channel |
| `backend/Controllers/SettingsController.cs` | API: `/api/updateSettings` |
| `backend/Controllers/ActionsController.cs` | CRUD actions/triggers |
| `backend/Services/TikTokBridgeService.cs` | Quản lý Node.js bridge, forward events |
| `backend/Services/SocketManager.cs` | Broadcast Socket.IO events tới browser |
| `backend/Data/AppDbContext.cs` | SQLite database context |

### Node.js Bridge
| File | Chức năng |
|------|-----------|
| `tiktok-bridge/index.js` | Kết nối TikTok LIVE bằng tiktok-live-connector v2 |
| `tiktok-bridge/package.json` | Dependencies: tiktok-live-connector, ws |

## Flow kết nối TikTok LIVE

### Bước 1: User nhập tên & bấm Connect
```
tf-connect.js
├── document.addEventListener('click', ..., true)  // capturing phase
├── getTikTokUsername(btn)                          // đọc input gần nút
├── showToast('Connecting...', 'info')              // hiện thông báo
├── setBundleBtnState('connecting')                 // disable nút
├── updateNavName(username)                         // cập nhật góc phải
└── fetch('/api/tiktok/connect', {username})        // gọi API
```

### Bước 2: Backend nhận request
```
TikTokController.cs
├── POST /api/tiktok/connect
├── Lưu tiktokname vào DB (DynamicSettings)
├── _bridge.ConnectToTikTok(username)
└── Return {status: "ok", username}
```

### Bước 3: Bridge Service gửi lệnh
```
TikTokBridgeService.cs
├── ConnectToTikTok(username)
├── Check _bridgeWs != null && Open
│   └── Nếu closed → auto-reconnect
├── BroadcastEvent("channelStatus", {connecting: true})
├── BroadcastEvent("status", {connecting: true})
└── _bridgeWs.SendAsync({action: "connect", username})
```

### Bước 4: Node.js bridge kết nối TikTok
```
tiktok-bridge/index.js
├── handleCommand({action: "connect", username})
├── new TikTokLiveConnection(username)
├── connection.connect()
│   ├── Thành công → sendToBackend({event: "connected", roomId})
│   └── Thất bại → sendToBackend({event: "connectFailed", message})
└── Đăng ký event listeners: chat, gift, like, follow...
```

### Bước 5: Events flow ngược về browser
```
TikTok → Node.js Bridge → WebSocket → TikTokBridgeService
    → SocketManager.BroadcastEvent() → Socket.IO → Browser

Events: chat, gift, like, share, follow, member, subscribe,
        emote, envelope, questionNew, roomUser, streamEnd
```

### Bước 6: Frontend cập nhật UI
```
tf-connect.js
├── pollStatus() mỗi 2s kiểm tra /api/tiktok/status
├── Khi connected:
│   ├── showToast('Connected — LIVE!', 'success')
│   ├── setBundleBtnState('connected')
│   ├── updateNavDisplay(username, true)  // góc phải xanh lá
│   └── postMessage({app:'tfbridge', type:'isLiveDetected'})
└── Khi failed:
    ├── showToast(error message, 'warning/error')
    └── setBundleBtnState('failed')
```

## Socket.IO Events (Browser ↔ Backend)

### Backend → Browser
| Event | Data | Khi nào |
|-------|------|---------|
| `loginResult` | channelId, channelName, isPro | WebSocket connect |
| `channelStatus` | connected, username, status | Connect/disconnect TikTok |
| `status` | connected, tiktok, connecting | Status change |
| `chat` | uniqueId, comment, nickname | Có người chat |
| `gift` | uniqueId, giftName, diamondCount | Có người tặng gift |
| `like` | uniqueId, likeCount | Có người like |
| `follow` | uniqueId, nickname | Có người follow |
| `member` | uniqueId, nickname | Có người join |
| `roomUser` | viewerCount, topViewers | Cập nhật viewers |
| `streamEnd` | username, actionId | Stream kết thúc |

### Browser → Backend
| Event | Data | Khi nào |
|-------|------|---------|
| `setUniqueId` | uniqueId | User đặt tên TikTok |
| `login` | token | Xác thực |

## Database (SQLite)

File: `backend/tikfinity.db`

| Table | Chức năng |
|-------|-----------|
| Channels | Account chính (name, email, password) |
| Subscriptions | Pro status |
| Profiles | Stream profiles |
| DynamicSettings | Key-value settings (tiktokname, widgets...) |
| Actions | Triggers (gift → action) |
| Sounds | Sound alerts |
| ChatCommands | !command responses |
| Goals | Progress goals |
| Timers | Interval timers |
| Overlays | Overlay configs |
| Widgets | Widget configs |
| Notifications | In-app notifications |
| Transactions | Payment history |
| ChannelModules | Module enable/disable |

## Overlay Widgets

Browser mở `http://localhost:5285/widget/<name>.html` → kết nối Socket.IO → nhận events → render UI.

Dùng trong OBS: Browser Source → URL = `http://localhost:5285/widget/chat.html`

### Widgets có sẵn
- **chat** — hiển thị chat messages
- **gifts** — hiển thị gift alerts
- **viewercount** — số viewers
- **goal** — progress bar (followers, likes...)
- **ranking** — bảng xếp hạng
- **topgifter** — top người tặng
- **wheel** — vòng quay
- **timer** — đồng hồ đếm ngược
- **cannon, firework, fallingsnow** — effects
- **songrequests** — yêu cầu bài hát
- 40+ widgets khác

## Build Desktop App

```bash
# Build
dotnet publish backend/TikFinityBackend.csproj -c Release -r win-x64 --self-contained -o dist/app
xcopy downloads dist\app\downloads /E /I /Q /Y
xcopy tiktok-bridge dist\app\tiktok-bridge /E /I /Q /Y

# Chạy
dist\start.bat  → mở browser → http://localhost:5285
```

Yêu cầu: Node.js phải cài trên máy (cho tiktok-live-connector).

## Vấn đề đã fix

| Vấn đề | Nguyên nhân | Fix |
|--------|-------------|-----|
| Reload loop | `settings.restore` redirect về `/` | Navigation API block + block `updateSettings` XHR |
| Connect tới @nguyen | Bundle đọc channelName từ store | Click interceptor đọc đúng input |
| Bridge WS null | WebSocket đóng giữa chừng | Auto-reconnect trong ConnectToTikTok |
| isPro undefined | SQLite DB mới trống | `/api/me` fallback về channel 1 |
| challengeRunning error | Vue computed property lỗi | Global error handler suppress |
| tiktok-live-connector fail | v1 cũ, TikTok đổi API | Upgrade lên v2.1.1 |
| trc.js block fetch | Anti-piracy guard chặn requests | Disable trc.js |
| Socket disconnect loop | Server không gửi ping | Thêm server-side ping mỗi 25s |
