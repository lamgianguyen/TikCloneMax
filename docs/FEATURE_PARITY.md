# TikFinity Feature Parity — Backlog

Đối chiếu giữa **TikFinity gốc (zerody)** và **TikCloneMax**. Mỗi mục:
**Tech cần** • **Độ khó** • **Thời gian ước** • **Khả thi** • **Phụ thuộc bên ngoài**.

> Cập nhật: 2026-05-04
> Backend: .NET 9 + EF Core + SQLite (port 5285)
> Bridge: Node.js `tiktok-live-connector` (port 5288)
> Auth gate: TikfinityServer `https://localhost:8443` (vừa thêm)

---

## 0. Master priority table

Tier 1 = phải có để clone "feel like Tikfinity", Tier 2 = quan trọng nhưng có thể delay, Tier 3 = nice-to-have / niche.

| # | Tính năng | Tier | Khó | Thời gian | Khả thi | Cần ngoài |
|---|---|---|---|---|---|---|
| 1 | AggregateService (TopGifter/Liker/Ranking) | **T1** | Easy | 2-3h | ✅ 100% | — |
| 2 | GoalService (gift/like/follow goals) | **T1** | Easy-Med | 3-4h | ✅ 100% | — |
| 3 | TimerService (countdown/elapsed) | **T1** | Easy | 2-3h | ✅ 100% | — |
| 4 | OBS WebSocket client | **T1** | Med | 4-6h | ✅ 100% | OBS-WS plugin (user cài) |
| 5 | Subscriber Bonus + Level multipliers | **T1** | Easy | 2-3h | ✅ 100% | — |
| 6 | Reset Points endpoint | **T1** | Trivial | 30m | ✅ 100% | — |
| 7 | Import/Export full settings | **T1** | Easy | 1-2h | ✅ 100% | — |
| 8 | TTS Web Speech API (frontend) | **T2** | Trivial | 1-2h | ✅ 100% | — |
| 9 | ChatBot executor (display-only) | **T2** | Easy | 2-3h | ✅ 100% | — |
| 10 | WebhookService | **T2** | Med | 4-6h | ✅ 100% | — |
| 11 | Spotify (now-playing display) | **T2** | High | 6-8h | ⚠️ user phải có Spotify Premium + Dev App | Spotify API |
| 12 | Spotify queue add (song request) | **T2** | High | +4h | ⚠️ Premium-only API | Spotify API |
| 13 | MediaShare (YouTube link queue) | **T2** | Med | 6-8h | ✅ 100% | YouTube oEmbed (public) |
| 14 | TTS ElevenLabs/Azure/Google | T3 | High | 6-10h/provider | ⚠️ user cần API key + billing | TTS provider |
| 15 | Patreon OAuth | T3 | Med-High | 6-10h | ⚠️ TikfinityServer cần callback URL public | Patreon Dev App |
| 16 | Discord webhook output | T3 | Easy | 2h | ✅ 100% | Discord webhook URL (user) |
| 17 | YouTube Live Chat | T3 | High | 12-16h | ⚠️ YouTube Data API quota | Google Dev Console |
| 18 | Minecraft mod bridge (HTTP API only) | T3 | Med | 4-6h backend | ⚠️ user cần install Minecraft mod | Minecraft Forge/Fabric mod (riêng) |
| 19 | ChatBot send tới TikTok chat thật | T3 | **Very High** | 20+h | ❌ rất rủi ro | Cần TikTok session + anti-bot signing |

**Tổng Tier 1 = ~16-22h** → 2-3 ngày làm việc full → có thể coi là MVP "feel-real".

---

## 1. AggregateService 🎯

**Mô tả:** Track real-time top users theo diamond (gifter), like (liker), combined score (ranking).
Hiện 3 widget `topgifter.html` / `topliker.html` / `ranking.html` không nhận data.

**Cần:**
- Service `IAggregateService` với 3 leaderboard (gifter/liker/ranking)
- Subscribe `OnGiftReceived` / `OnLikeReceived` từ `TikTokBridgeService`
- `ConcurrentDictionary<string, UserScore>` cho fast update
- Periodic emit `updateTopGifter` / `updateTopLiker` / `updateRanking` qua Socket.IO mỗi 2-5s
- Reset endpoint `POST /api/aggregates/reset?type=gifter|liker|ranking|all`
- Persist optional (nhớ giữa stream session) — hoặc reset mỗi lần mở app

**Difficulty:** Easy. 2-3h.
**Khả thi:** ✅ 100%, hoàn toàn dùng dữ liệu sẵn có.

---

## 2. GoalService 🎯

**Mô tả:** Track tiến độ goal (e.g., "1000 diamonds", "100 likes", "10 follows", "5 specific gift X").
Widget `goal.html` cần `goalStatus`/`giftGoalStatus`.

**Cần:**
- CRUD endpoint `/api/goals` (model `Goal` đã có)
- Goal types: `diamonds_total`, `likes_count`, `follows_count`, `gift_specific:{giftId}`, `viewers_peak`, `subs_count`
- Subscribe events, increment matching goals
- Emit `goalStatus` { goalId, current, target, percent } mỗi khi tăng
- Reset/complete logic

**Difficulty:** Easy-Med. 3-4h.
**Khả thi:** ✅ 100%.

---

## 3. TimerService ⏱️

**Mô tả:** Countdown / elapsed timer. Có thể trigger từ chat command hoặc Action.
Widget `timer.html` cần `timerUpdate`.

**Cần:**
- TimerItem model đã có
- Operations: `start(timerId, durationSec)`, `stop`, `pause`, `extend`, `reset`
- `IHostedService` tick mỗi 1s, emit `timerUpdate` khi state thay đổi
- Persist remaining time để resume sau crash (optional)
- Endpoint `POST /api/widget/timer/{action}` đã có sẵn — chỉ cần wire executor

**Difficulty:** Easy. 2-3h.
**Khả thi:** ✅ 100%.

---

## 4. OBS WebSocket Client 🎬

**Mô tả:** Connect tới OBS Studio (port 4455 mặc định) để switch scene, toggle source theo TikTok event.

**Cần:**
- NuGet: `OBSStudioClient` hoặc `OBS.WebSocket.NET` hoặc viết tay (OBS-WS v5 protocol document hoá tốt)
- Service `IObsService` với connect / disconnect / get-scenes / set-scene / toggle-source
- Endpoint: `POST /api/obs/connect`, `GET /api/obs/scenes`, `POST /api/obs/scene`
- UI: settings page nhập host:port + password (websocket auth)
- Wire vào ActionsController — khi action.target = "obs.scene-change", gọi service

**Difficulty:** Med. 4-6h.
**Khả thi:** ✅ 100%, chỉ cần user cài plugin OBS-WS (đã built-in OBS 28+).
**Phụ thuộc:** OBS user phải bật plugin.

---

## 5. Subscriber Bonus + Level Settings 🎚️

**Mô tả:** Multiply điểm khi user là subscriber TikTok / đạt level X.

**Cần:**
- TikTok event payload đã có `subscribe` event với `subMonth`
- DynamicSetting key: `points_subscriber_multiplier`, `points_level_thresholds`, etc.
- PointsService apply multiplier khi addPoints(userId, amount)
- Level config: array `[{level: 1, threshold: 100}, ...]`

**Difficulty:** Easy. 2-3h.
**Khả thi:** ✅ 100%.

---

## 6. Reset Points endpoint 🔄

**Mô tả:** Trang Setup có nút "Reset Points" — clear toàn bộ điểm tích luỹ.

**Cần:**
- `DELETE /api/points` hoặc `POST /api/points/reset`
- Clear DynamicSetting key prefix `points_user_*`
- Audit log record

**Difficulty:** Trivial. 30m.

---

## 7. Import/Export full settings 📦

**Mô tả:** Export toàn bộ setting + actions + commands ra JSON, import lại.

**Cần:**
- `GET /api/backup/export` → JSON dump của DynamicSetting + ActionItem + ChatCommand + Sound + Goal + Overlay + Widget + TimerItem
- `POST /api/backup/import` → validate + replace
- Endpoint `POST /backup` đã có (chỉ ghi 1-way, chưa export)

**Difficulty:** Easy. 1-2h.

---

## 8. TTS Web Speech API 🗣️

**Mô tả:** Đọc chat / event message qua browser native speech.

**Cần:**
- Frontend module — không cần backend (browser tự xử lý)
- Inject vào `Program.cs:BuildIndexHtml()`: hook chat event → `speechSynthesis.speak()`
- Voice picker UI + setting (language, rate, pitch, volume)
- Filter: skip emote / spam / blocked words

**Difficulty:** Trivial. 1-2h.
**Khả thi:** ✅ 100%, chrome built-in.

---

## 9. ChatBot executor (display-only) 🤖

**Mô tả:** Khi chat khớp pattern → hiện reply trên overlay (không gửi lại TikTok chat).

**Cần:**
- ChatCommand model đã có (`pattern`, `response`, `cooldown`, `enabled`)
- Service `IChatBotService` subscribe `OnChatReceived`
- Pattern matcher: `exact`, `startsWith`, `regex`, `contains`
- Cooldown per-user / per-command (in-memory dict)
- Emit Socket.IO `bot:say` event → widget `commandinfo.html` hiển thị

**Difficulty:** Easy. 2-3h.
**Khả thi:** ✅ 100% (display-only).
**Không khả thi:** real send vào TikTok chat — cần TikTok session + anti-bot signing, rủi ro cao.

---

## 10. WebhookService 🪝

**Mô tả:** POST tới URL ngoài khi có event (gift, follow, like, custom).

**Cần:**
- Model: `Webhook { Id, Name, Url, EventTypes[], Headers, Enabled, RetryPolicy }`
- CRUD endpoint
- Service subscribe event bus → fire matching webhooks với HttpClient
- Retry với exponential backoff + dead letter
- Filter rules (e.g., chỉ fire khi diamond >= 100)

**Difficulty:** Med. 4-6h.
**Khả thi:** ✅ 100%.

---

## 11. Spotify now-playing display 🎵

**Mô tả:** Hiển thị track đang phát trên Spotify ở overlay widget.

**Cần:**
- Spotify Developer App (user tự đăng ký https://developer.spotify.com)
- OAuth 2.0 PKCE flow — redirect URI = `http://localhost:5285/api/spotify/callback`
- Endpoint: `/api/spotify/connect` → mở browser OAuth
- Refresh token store (DynamicSetting encrypted)
- Polling `/me/player/currently-playing` mỗi 5s
- Emit `spotify:now-playing` Socket.IO event

**Difficulty:** High. 6-8h.
**Khả thi:** ⚠️ Có. **Phụ thuộc:** user phải có **Spotify Premium** (free không lấy now-playing được tin cậy) + tự đăng ký Spotify Dev App.

---

## 12. Spotify song request queue 🎵

**Mô tả:** Viewer chat `!song <link Spotify>` → add vào queue → admin approve → enqueue.

**Cần:** Như mục 11 + endpoint `POST /me/player/queue` (cần Premium).
**Thêm:** 4h.
**Khả thi:** ⚠️ Premium-only.

---

## 13. MediaShare (YouTube link queue) 📺

**Mô tả:** Viewer chat link YouTube/Twitch clip → display queue → play khi approve.

**Cần:**
- URL parser (YouTube videoId, Twitch clip slug)
- YouTube oEmbed (public, không cần API key) hoặc YouTube Data API (cho duration)
- Queue model + CRUD
- Widget player embed
- Auto-skip / max length filter

**Difficulty:** Med. 6-8h.
**Khả thi:** ✅ 100% (oEmbed free).

---

## 14. TTS Cloud (ElevenLabs / Azure / Google) 🗣️☁️

**Mô tả:** Voice chất lượng studio thay cho Web Speech API.

**Cần:**
- API key (user nhập trong settings — encrypted)
- Backend HTTP client gọi provider, cache audio (FileResult hoặc base64)
- Voice list endpoint (load từ provider)
- Throttle (Eleven free 10k chars/tháng)

**Difficulty:** High per provider. 6-10h mỗi provider.
**Khả thi:** ⚠️ user cần tài khoản + thanh toán.

---

## 15. Patreon OAuth 🎉

**Mô tả:** Login Patreon → check tier → unlock Pro / show patron list.

**Cần:**
- Patreon Developer App → callback URL public (`https://your-tikfinityserver.com/api/patreon/callback`) → **TikfinityServer** giữ flow này, không phải clone local
- Token exchange + refresh
- Patron list endpoint
- Tier mapping config

**Difficulty:** Med-High. 6-10h.
**Khả thi:** ⚠️ TikfinityServer phải có public URL (ngrok/cloud). **Local clone không làm trực tiếp được.**

---

## 16. Discord webhook output 💬

**Mô tả:** Forward gift/follow event tới Discord channel.

**Cần:**
- User dán Discord webhook URL vào setting
- Forward gift/follow/etc. với template message + embed
- Throttle (Discord rate limit 5/s)

**Difficulty:** Easy. 2h.
**Khả thi:** ✅ 100%.

---

## 17. YouTube Live Chat 📺

**Mô tả:** Bridge thêm — người dùng đang stream cả TikTok + YouTube → unified chat.

**Cần:**
- Google Cloud project + YouTube Data API v3 (quota mặc định 10k/day)
- OAuth 2.0
- LiveChat polling endpoint mỗi ~5s
- Emit chung event `chat` với `source: 'youtube'`

**Difficulty:** High. 12-16h.
**Khả thi:** ⚠️ Quota YouTube Data API hạn chế.

---

## 18. Minecraft mod bridge ⛏️

**Mô tả:** Gift/follow TikTok → spawn mob/give item trong Minecraft của streamer.

**Cần:**
- Minecraft mod riêng (Forge/Fabric, viết bằng Java) — **dự án độc lập**
- Backend chỉ cần expose endpoint `POST /api/minecraft/command` với danh sách action
- Mod poll backend hoặc backend push qua WebSocket

**Difficulty:** Backend Med (4-6h), Mod Very High (40+h).
**Khả thi:** Backend ✅. Mod = dự án riêng — gợi ý chỉ public protocol spec, để cộng đồng viết mod.

---

## 19. ChatBot send TikTok chat ❌

**Không khả thi**. Cần:
- TikTok account session cookies + signing API key (anti-bot)
- Bypass rate limit
- Có thể bị ban account

**Đề xuất:** chỉ làm display-only (mục 9).

---

## Phụ thuộc bên ngoài tóm gọn

| Tính năng | Cần đăng ký |
|---|---|
| Spotify | https://developer.spotify.com (free, ~5 phút) |
| Patreon | https://docs.patreon.com (free) — và TikfinityServer phải public |
| YouTube | https://console.cloud.google.com (free quota) |
| ElevenLabs | https://elevenlabs.io (free 10k chars/tháng) |
| Azure TTS | https://azure.microsoft.com (5h free/tháng tier free) |
| Google Cloud TTS | https://cloud.google.com (4M chars free/tháng) |
| Discord webhook | tự tạo trong server Discord (free) |
| OBS WebSocket | OBS Studio 28+ built-in (free) |
| Code signing cert | ~$200/năm (Sectigo / DigiCert) |

---

## Khả thi 100% offline (không cần internet ngoài)

1. AggregateService
2. GoalService
3. TimerService
4. Subscriber Bonus
5. Reset Points
6. Import/Export
7. TTS Web Speech
8. ChatBot display-only
9. WebhookService (user tự config URL)
10. MediaShare (oEmbed YouTube — public)
11. OBS WebSocket (local network)
12. Discord webhook (user tự config)

→ **12/19 việc làm 100% local được**, không phụ thuộc tài khoản cloud.

---

## Sprint plan đề xuất

### Sprint 1 — MVP "feel real" (Tier 1, ~16-22h, 2-3 ngày)
- AggregateService (3 leaderboard)
- GoalService
- TimerService  
- OBS WebSocket client
- Subscriber Bonus
- Reset Points endpoint
- Import/Export GET/POST
- Wire 3 widget sẵn (`topgifter`/`topliker`/`ranking`/`goal`/`timer`) với Socket.IO event mới

**Output:** widget hoạt động real-time, OBS auto-scene-change, points system đầy đủ.

### Sprint 2 — Plugin & Bot (Tier 2, ~14-18h, 2 ngày)
- TTS Web Speech API frontend
- ChatBot executor display-only
- WebhookService + Discord output
- MediaShare (YouTube oEmbed)

**Output:** TTS đọc chat, command bot reply, webhook tới Discord, song queue.

### Sprint 3 — Cloud integrations (Tier 2-3, ~16-24h, 3 ngày)
- Spotify connect + now-playing + queue
- TTS ElevenLabs (chỉ provider có chất lượng cao nhất)
- YouTube Live Chat (optional)

**Output:** Spotify widget, TTS chất lượng cao.

### Sprint 4 — Niche & Polish (Tier 3)
- Patreon OAuth (cần TikfinityServer setup)
- Minecraft bridge protocol
- TTS Azure/Google
- Code signing setup

---

## Việc cần user quyết định

1. **Spotify dev app** — tôi không tự đăng ký được, user phải tạo App trên https://developer.spotify.com và cung cấp clientId. Hoặc skip Spotify hẳn.
2. **TikfinityServer URL public** — Patreon callback cần URL public. Nếu chưa có domain, dùng ngrok / cloudflare tunnel khi setup.
3. **Code signing cert** — quyết định mua hay không. Nếu không, accept SmartScreen warning.
4. **Sprint priority** — bắt đầu Sprint 1 luôn, hay làm 1 service một lần để thấy kết quả từng bước?

---

## Tổng quan khả thi

| Loại | Việc | Tổng thời gian |
|---|---|---|
| **100% làm được, không phụ thuộc cloud** | 12 mục | ~30-45h |
| **Làm được, cần user đăng ký dev app** | 5 mục (Spotify, Patreon, YouTube, ElevenLabs, Azure) | ~30-45h |
| **Quá phức tạp / rủi ro** | 1 mục (TikTok chat send thật) | bỏ qua |

→ **Toàn bộ 90% feature TikFinity gốc clone được** trong 2-3 tuần làm việc full-time.
