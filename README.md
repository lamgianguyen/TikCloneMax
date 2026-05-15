# TikFinity Clone

Runtime chính là `.NET backend` trong `backend/Program.cs`, được Electron shell wrap thành desktop app.

## Yêu cầu

- **Windows 10/11** (x64)
- **.NET 9 SDK** — https://dotnet.microsoft.com/download
- **Node.js 18+** — https://nodejs.org

## Setup lần đầu trên máy mới

Chạy 1 lần:
```bat
setup.bat
```

Script này sẽ:
1. Kiểm tra `dotnet` + `node` + `npm` đã cài chưa
2. `npm install` trong `electron/` và `tiktok-bridge/`
3. `dotnet build` backend

## Chạy

- **Desktop**: `start_desktop.bat` (hoặc `npm run desktop`)
- **Web only**: `start_project.bat` (hoặc `npm run web`) — backend ở `http://localhost:5285`

## Troubleshooting

- **"Backend không phản hồi"** trên splash → backend chưa build hoặc port 5285 đang bị chiếm. Chạy lại `setup.bat`.
- **"Cannot find module 'electron'"** → chạy `setup.bat` để cài node deps.
- **Reload liên tục** → xóa `%APPDATA%\tikfinity-desktop\` và chạy lại.
- **Auth gate ở 127.0.0.1:5194 không phản hồi** → TikfinityServer chưa chạy. App vẫn vào được với TikTok session offline.

## Cổng dùng

| Port | Service |
|---|---|
| 5285 | Backend HTTP (chính) |
| 5288 | TikTok bridge WebSocket |
| 21213 | Desktop API WebSocket (cho plugin ngoài) |
| 5194 | TikfinityServer (auth gate, optional) |
