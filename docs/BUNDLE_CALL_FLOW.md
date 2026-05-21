# Bundle Call-Flow Reference

Mapping mỗi UI surface trong TikFinity bundle ↔ API calls cần thiết ↔ data shape.
Tổng hợp từ HAR capture (4 sessions, 6,071 requests → 228 unique endpoints) +
decompiled Vue source (`decompiled/modules/deobfuscated.js` 945 KB).

**Mục đích**: thay vì debug từng gate, đọc file này để biết bundle expect cái gì
ở mỗi flow → fix shape là xong.

---

## 0. Hosts mapping

Bundle gốc gọi nhiều host khác nhau. Local clone phải rewrite hoặc proxy:

| Host gốc | Vai trò | Status local |
|---|---|---|
| `tikfinity.zerody.one` | Main app + most APIs | ✅ Rewrite → localhost:5285 |
| `tikfinity-auth-service.zerody.one` | Login + JWT | ⚠️ Stub local hoặc proxy 5194 |
| `tts.tikfinity.com` | TTS catalog + generate | ✅ Mock trong blockScript |
| `tikfinity-tts-api.zerody.one` | TTS API alternative path | ⚠️ Chưa có |
| `tikfinity-cws-{03,04,05}.zerody.one` | TikTok WebSocket per-region | ❌ Bundle dùng connectorHost="" |
| `myinstantsapi.zerody.one` | Sound library (trending) | ✅ `/myinstants-proxy/` |
| `myinstantsbackup.zerody.one` | Sound backup uploads | ⚠️ Chưa có |
| `ph.tikfinity.com` | PostHog telemetry | ✅ Block trong `shouldBlockUrl` |

---

## 1. Boot sequence

```
                 ┌─────────────────────────────────────────────────────┐
   1. GET /     │ index.html (lang-detected: /, /vi, /de, /es)         │
                 └────────────┬────────────────────────────────────────┘
                              │
   2. <head> injection fires: reloadGuard, earlyCss, blockScript,
      authScript (writes window.token, window.session, defineProperty
      on tfPageloadData so the bundle gets pre-baked i18n + voice
      catalog before its own init reads them)
                              │
   3. Bundle Vue mount        │
                              ▼
   4. GET   /api/init               48 B    boot flags
   5. POST  /api/me                 58 KB   FULL hydrate — see §1.1
   6. GET   /api/getAppConfig       (cached fixture)
   7. GET   /api/getAllGifts        885 KB  TikTok gift catalog
   8. GET   /api/getChannelEmotes   9.5 KB  channel emote pack
   9. GET   /api/rest/action        3 KB    user-defined actions list
   10. GET  /api/notifications/list 13 KB   bell-icon notifications
   11. GET  /api/notifications/preferences  42 B
   12. GET  /api/getGlobalTransactions      3 KB     Pro upgrade list
   13. GET  /api/getLiveChannels    12 KB   sidebar live indicators
   14. GET  /api/odata/channeluser  14 KB   recent viewers (OData)
   15. GET  /api/odata/transaction  5.6 KB  recent gifts (OData)
   16. GET  /api/pro/tazapay/methods 71 B   Pro payment options
   17. POST /api/usage/log          29 B    "I'm online" beacon
   18. GET  /socket.io/?EIO=4...    WS handshake → real-time chat/gift/like
```

**Implication**: nếu /api/me sai shape, mọi step sau bị ảnh hưởng (UI hydrate từ
nó). Fix /api/me trước là ưu tiên #1.

### 1.1 `/api/me` 22 top-level fields (bundle ăn hết)

| Field | Type | Bundle xài cho |
|---|---|---|
| `status` | number | 200 = OK |
| `message` | string | error display fallback |
| `channelId` | number | localStorage `setting_channelid` |
| `channel` | object | full channel record — TopBar, profile chip, sidebar |
| `channeluser` | object | per-viewer state |
| `profile` | object | active profile (per-channel) |
| `subscription` | object | isPro gate trên mọi widget |
| `userFeatures` | object | feature flags (`proInfo`, etc.) |
| `wsAuthToken` | string | Socket.IO authentication (MUST cache per channel) |
| `featureBaseToken` | string | Feedback widget (MUST cache per channelName) |
| `discordVerifyToken` | string | Discord connect |
| `discordHasProRole` | boolean | Discord Pro badge |
| `cookieAuth` | boolean | hint for auth-bridge |
| `countryCode` | string | language flag in topbar |
| `overloadSettings` | object | rate-limit config |
| `performanceDebugInfo` | object | metrics block (mostly noop) |
| `activePromotions` | array | promo banner |
| `mobileVoucherCode` | object/null | mobile voucher modal |
| `isTrialAvailable` | boolean | trial banner |
| `hasActiveTrial` | boolean | trial banner |
| `trialEnded` | boolean | trial banner |
| `trialInfo` | object/null | trial banner detail |

**Bao nhiêu trong số này backend local đã đúng shape?** → diff với captured payload
(file: `routes-generated/tikfinity.zerody.four.merged.endpoints.json`, search
`"pathname":"/api/me"`) để tìm field còn missing/wrong type.

---

## 2. Login flow

```
   User mở app (chưa có JWT)
            │
            ▼
   POST /api/login                    request body: { email, password } or { key }
            │
            ▼  (auth-service trả 200 + Set-Cookie tf_login_token)
   POST /api/me                       sau khi cookie có → bundle hydrate state
            │
            ▼
   Main app render (xem boot sequence §1)
```

**Captured**: `POST tikfinity.zerody.one/api/login` 200, body 0 B (auth chuyển qua
cookie Set-Cookie từ response header). Auth-service thật ở
`tikfinity-auth-service.zerody.one` (2 hits trong file four).

**Local**: hiện dùng Serial Key gate qua `/api/auth/key-login` → mint JWT.
Bundle gọi `/api/login` thì hiện trả 404. **Action**: thêm alias
`POST /api/login` mapping vào `key-login`.

---

## 3. Connect TikTok Live

```
   User nhập @username trên Setup page
            │
            ▼
   POST /api/tiktok/connect        body: { username }
            │     (200, fire-and-forget)
            │
            ▼  Backend bridge: TikTokLiveConnection.connect()
            │   → cross-origin WS to tikfinity-cws-XX.zerody.one (or direct
            │     to TikTok if no proxy)
            │
            ▼
   Socket.IO server-side broadcasts events:
   `connected`, `chat`, `gift`, `like`, `follow`, `share`, `member`, ...
            │
            ▼  Bundle widgets listen:
            │   - tf-connect.js polls GET /api/tiktok/status (15s)
            │   - widgets receive socket events directly
            ▼
   GET /api/tiktok/account          owner avatar + nickname + roomId
                                    → topbar chip + LIVE button render
```

**Captured**: KHÔNG có call connect trong 4 HAR sessions (user chưa click).
Bridge logic local đã đầy đủ. UI binding cần `account.avatarUrl` để render.

---

## 4. Voice picker modal (TTS)

5 gates đã document trong [CLAUDE.md §14](../CLAUDE.md). Sequence từ HAR:

```
   User mở Settings → TTS tab → bấm Voice Picker
            │
            ▼
   POST /api/tts/auth-token         391 B  → { ttsAuthToken: "<JWT>" }
            │
            ▼  bundle gắn Authorization: Bearer <JWT>
            │
            ▼
   GET  tts.tikfinity.com/api/tts/user        474 B  → quota info
            │
            ▼
   GET  tts.tikfinity.com/api/tts/voices      27 KB  → catalog 118 voices
            │
            ▼  bundle parse → fill modal AI/Pro/Singing/Free tabs
            │
            ▼  User chọn voice + nhập text → bấm "Generate"
            │
            ▼
   POST tts.tikfinity.com/api/tts/generate    624 B  request
   GET  tikfinity-tts-api.zerody.one/api/voice/generate  28 KB  audio binary
            │
            ▼
   Audio play trong modal preview
```

**Local status**: gate 1-3 đã pass (catalog show). Gate 4 (generate audio)
hiện trả 503 dev stub. Có data thật 624 B + 28 KB để mock đúng shape.

---

## 5. Switch profile

```
   User click avatar chip → menu → chọn profile khác
            │
            ▼
   POST /api/me                     body: { profileId: N }
            │   (server: SaveChanges + broadcast actionsChanged + profileChanged)
            │
            ▼  Bundle nhận response → settings.restore → location.reload chain
            │  (≈ 8-12 reload trong ≤ 1s)
            │
            ▼  reloadGuard cap MAX_VISIBLE=1 + chain limiter
            │
            ▼  App boot lại với profileId mới → §1 sequence
```

**Sensitive**: cả wsAuthToken VÀ featureBaseToken phải **cache theo
(channelId, frontendChannelName)** — nếu mint mới mỗi request, `iat` thay đổi →
bundle re-detect session → reload loop vô hạn. Documented trong CLAUDE.md.

---

## 6. Widget data flow

```
   Bundle iframe loads /widget/<name>?cid=<channelId>
            │
            ▼
   Widget HTML download (cached, ~5-20 KB each)
            │
            ▼  Widget script connects Socket.IO via SharedWorker
            │   (downloads/widget/sharedio/sharedioworker.js)
            │
            ▼
   emit `setContext` { channelId, appType: 'widget' }
            │
            ▼  Server: socketManager.join per-channel room
            │
            ▼  Server pushes `widgetSettings` event (full ~200-key bag)
            │
            ▼  Widget renders idle state
            │
            ▼  TikTok events arrive via bridge → broadcast in room
            │   → widget renders animation/overlay
```

**31 widget pages** captured: activity-feed, cannon, carousel, chat, coindrop,
coinjar, coinmatch, commandinfo, emojify, fallingsnow, firework, gifts, goal,
lastx, likefountain, myactions, ranking, socialmediarotator, songrequests,
streambuddies, timer, topgifter, topliker, transactionviewer, userinfo,
viewercount, vite/src/activity-feed/, webcam, wheel, wheelofactions.

Widget cần data từ Socket.IO event chứ KHÔNG poll REST. Lỗi widget rỗng thường
là Socket.IO không bind đúng channel hoặc bundle chưa gọi `setContext`.

---

## 7. Settings save / executeAction

```
   User toggle 1 setting trong UI
            │
            ▼
   POST /api/updateSettings         body: { key, value, channelId, profileId }
            │   (server: write DynamicSettings + RebuildAndBroadcast)
            │
            ▼  Server broadcast `widgetSettings` event → mọi widget refresh

   User click "Test action" button
            │
            ▼
   POST /api/executeAction          body: { actionId, ... }
            │   (server: run action + emit `executeAction` socket event)
            │
            ▼  Widget myactions receives `executeAction` → render
```

**Captured**: POST `/api/updateSettings` 29 B response (just `{status:200}`).
POST `/api/executeAction` 29 B response. Body shape rất gọn.

---

## 8. OData queries (top viewers / transactions)

```
   /api/odata/channeluser           14 KB envelope
   /api/odata/transaction           5.6 KB envelope
```

Bundle gọi với query string OData chuẩn:
`?$top=20&$skip=0&$orderby=updatedAt desc&$filter=channelId eq 1&$count=true`.

Response shape:
```json
{
  "@odata.context": "$metadata#ChannelUsers",
  "@odata.count": 1234,
  "value": [...]
}
```

**Local**: backend hiện có `/api/odata/transaction` nhưng `channeluser` cần
verify envelope khớp. Bundle parse `value` array — nếu wrap khác, top-viewers
widget trống.

---

## 9. Sound library

```
   User mở Sound modal → tab "Trending"
            │
            ▼
   GET  myinstantsapi.zerody.one/api/sounds/trending    4.9 KB
            │   (cross-origin với Authorization)
            ▼
   List 50 sounds → user click play / drag-drop
```

**Local**: bundle gốc đã được rewrite `myinstantsApiHost` → `/myinstants-proxy/`
trong index-html.js. Cần backend handle path đó.

---

## 10. Critical fields gây UI bug (priority fix)

### A. wsAuthToken không cache
**Symptom**: app reload mỗi /api/me call
**Root cause**: mỗi mint mới đẻ `iat` mới → bundle thấy session change
**Fix**: cache `_wsAuthTokenCache.get(channelId)` (đã có trong code)

### B. featureBaseToken không cache theo channel name
**Symptom**: switch profile → reload loop
**Root cause**: bundle so token với localStorage, mint khác → mismatch
**Fix**: cache `(channelId, frontendChannelName)` (đã có)

### C. settings.restore POST /api/me với channelName
**Symptom**: reload mỗi 2.5s khi /api/me trả response thiếu field
**Root cause**: bundle's settings.restore POST lại với cached state,
backend không hiểu, response sai shape → bundle reload
**Fix**: swallow request trong blockScript (`isMeSettingsRestorePost`)

### D. Avatar URL không reach window.session.me.avatarUrl
**Symptom**: topbar chip trống / hiện placeholder
**Root cause**: bundle bind `window.session.me.avatarUrl`, server không trả
**Fix**: bridge broadcast `tiktokAccount` event → blockScript syncer ghi
vào window.session

### E. SSR fallback block render visible
**Symptom**: "dư khúc trống ở trên" → user phải scroll
**Root cause**: `<div id="pageSSRContent">` SEO fallback không bị hide
**Fix**: thêm `#pageSSRContent { display: none !important; }` vào earlyCss

---

## 11. Things HAR CANNOT see (need separate capture)

| Item | How to capture |
|---|---|
| Socket.IO WS frames (chat/gift/like) | DevTools Network → click socket.io row → "Messages" tab |
| TikTok Live signing requests | Bundle gọi `tikfinity-cws-XX` host khi connect Live → HAR capture lúc đó |
| Backend → frontend Socket.IO push | Server-side log; hoặc instrument client `io.on(...)` listener |

---

## 12. Files reference

| File | Vai trò |
|---|---|
| `routes-generated/tikfinity.zerody.four.merged.shapes.md` | 228 endpoint catalog, preview body |
| `routes-generated/tikfinity.zerody.four.merged.endpoints.json` | Raw data — diff với backend response |
| `routes-generated/tikfinity.zerody.four.merged.js` | Express stub router (mount tạm) |
| `decompiled/modules/deobfuscated.js` | Vue app source 945 KB readable |
| `backend-node/src/templates/blockScript.txt` | Inject script + instrumentation |
| `captures/*.har` | Source data (gitignored) |

---

## 13. Suggested integration order

1. **Diff /api/me** (current local vs captured) → fill missing fields → giải quyết 80% UI bug
2. **Mount auto-generated stub router** as last fallback in `index.js` → bundle có response cho mọi endpoint missing → giảm 404 spam
3. **Update voice-catalog.json** từ captured 27 KB → voice picker khớp 100%
4. **Update getAllGifts** từ captured 885 KB → gift cannon / activity feed đúng tên/icon
5. **Verify OData envelope** cho channeluser + transaction
6. **Stub /api/login** alias key-login → bundle login flow pass
7. **Mock /api/tts/generate** trả audio binary từ captured shape → preview button hoạt động
8. **Capture WS frames riêng** cho chat/gift để verify Socket.IO event shape

Mỗi step tốn 10-60 phút, không phải mò.
