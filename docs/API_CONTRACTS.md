# API Contracts — Captured From Real TikFinity Server

> **Đây là tài liệu cấu trúc đầy đủ của mọi request/response mà bundle TikFinity gốc thực hiện.**
> Trích xuất từ 4 phiên HAR capture (`captures/tikfinity.zerody.{one,two,three,four}.har`, tổng 427 MB) → 6,071 raw entries → 228 unique endpoints → 26 API endpoints chính được document đầy đủ shape + sample dưới đây.

## Tại sao tài liệu này tồn tại

Project clone TikFinity dùng lại bundle obfuscated của họ (`downloads/combo/app.js` 3.9 MB + `modules.js` 1.3 MB). Bundle gọi 26 API endpoint khác nhau khi boot + sử dụng. Backend local của mình phải trả response **đúng shape** ở từng endpoint; sai một field thường gây:

- `settings.restore` reload loop (~2.5s/reload, vô hạn)
- UI flicker / modal trống / widget không render
- Avatar/nickname không lên
- Profile switch loop 8-12 reload

Khi không biết shape gốc → đoán → trật → vá → đoán → trật. Tài liệu này cho phép so trực tiếp shape backend local với shape server thật.

## Pipeline tạo ra tài liệu này

```
1. Capture HAR: Chrome DevTools → Network → "Save all as HAR with content"
   - 4 sessions × 1-5 phút mỗi session, click khắp tính năng
   - Tổng 427 MB HAR, ~6,071 request
2. Merge + dedupe: scripts/decompile/merge-har.js
   - Bỏ static assets (.css, .js, .png, fonts)
   - Bỏ 3rd-party (PostHog, Sentry, GA, Cloudflare RUM)
   - Dedupe theo (method, host, path), keep newest
   - Output: 228 unique endpoints, 13 categories
3. Generate shape: scripts/decompile/extract-contracts.js
   - Recursive type tree, max depth 6, max 40 fields/level
   - Sample body (full nếu < 4 KB, truncated nếu lớn)
   - Output: file này
4. Bundle decompile: webcrack downloads/combo/{app,modules}.js
   - Output: decompiled/{app,modules}/deobfuscated.js (~1 MB readable)
   - Mục đích: đọc trực tiếp logic Vue bundle thay vì đoán qua stack trace
5. Live instrumentation: blockScript.txt section §72-138
   - Off-by-default IIFE wrap fetch + XHR
   - Bật trong DevTools: localStorage.setItem("tf-instrument","1")
   - Dump: window.__tfDumpCallLog()
```

## Cách sử dụng tài liệu này

1. **Khi sửa 1 handler backend**: tìm endpoint tương ứng trong table TL;DR → đọc section chi tiết → copy shape sang local response. Đảm bảo MỌI field bundle expect đều có.

2. **Khi mock 1 feature mới**: copy section sample response, paste vào route handler, thay value mock. Bundle sẽ không biết khác biệt.

3. **Khi UI bị lỗi**: tìm endpoint mà widget/modal đó gọi → diff response shape gốc vs backend local → fix mismatch.

4. **Khi thêm feature mà chưa biết shape**: bật instrumentation, trigger feature 1 lần, dump call log, xem URL + body. Thường đủ để code mà không cần capture HAR mới.

---

## TL;DR — Toàn bộ endpoint catalogue

| # | Method | Path | Host | Body bytes | Auth | Status |
|---:|---|---|---|---:|:---:|:---:|
| 1 | GET | `/api/init` | `tikfinity.zerody.one` | 48 | — | 200 |
| 2 | POST | `/api/login` | `tikfinity.zerody.one` | 0 | — | 200 |
| 3 | POST | `/api/me` | `tikfinity.zerody.one` | 54,720 | — | 200 |
| 4 | GET | `/api/rest/action` | `tikfinity.zerody.one` | 3,768 | — | 200 |
| 5 | POST | `/api/updateSettings` | `tikfinity.zerody.one` | 29 | — | 200 |
| 6 | POST | `/api/executeAction` | `tikfinity.zerody.one` | 29 | — | 200 |
| 7 | PUT | `/api/rest/transaction` | `tikfinity.zerody.one` | 833 | — | 200 |
| 8 | GET | `/api/notifications/list` | `tikfinity.zerody.one` | 0 | — | 200 |
| 9 | GET | `/api/notifications/preferences` | `tikfinity.zerody.one` | 42 | — | 200 |
| 10 | GET | `/api/getAllGifts` | `tikfinity.zerody.one` | 0 | — | 200 |
| 11 | GET | `/api/getChannelEmotes` | `tikfinity.zerody.one` | 2,901 | — | 200 |
| 12 | GET | `/api/getLiveChannels` | `tikfinity.zerody.one` | 12,173 | — | 200 |
| 13 | GET | `/api/getGlobalTransactions` | `tikfinity.zerody.one` | 2,932 | — | 200 |
| 14 | GET | `/api/getChannelUserCount` | `tikfinity.zerody.one` | 42 | — | 200 |
| 15 | GET | `/api/odata/channeluser` | `tikfinity.zerody.one` | 13,796 | — | 200 |
| 16 | GET | `/api/odata/transaction` | `tikfinity.zerody.one` | 5,587 | — | 200 |
| 17 | POST | `/api/usage/log` | `tikfinity.zerody.one` | 29 | — | 200 |
| 18 | POST | `/api/logError` | `tikfinity.zerody.one` | 0 | — | 200 |
| 19 | GET | `/api/pro/tazapay/methods` | `tikfinity.zerody.one` | 71 | — | 200 |
| 20 | POST | `/api/tts/auth-token` | `tikfinity.zerody.one` | 391 | — | 200 |
| 21 | GET | `/api/tts/user` | `tts.tikfinity.com` | 474 | — | 200 |
| 22 | GET | `/api/tts/voices` | `tts.tikfinity.com` | 27,338 | — | 200 |
| 23 | POST | `/api/tts/generate` | `tts.tikfinity.com` | 624 | — | 201 |
| 24 | GET | `/api/sounds/trending` | `myinstantsapi.zerody.one` | 4,865 | — | 200 |
| 25 | POST | `/api/backup` | `myinstantsbackup.zerody.one` | 338 | — | 200 |

Ghi chú table:
- **Body bytes** = response body size (server gốc trả). Có thể so với backend local: nếu local trả 0 B mà gốc trả 13 KB, là thiếu data.
- **Auth** = "Bearer" tức là bundle gắn Authorization header (token đọc từ localStorage `setting_loginaccesstoken` hoặc cookie `tf_login_token`).
- **Status** = HTTP status response gốc. 200 = OK, 201 = Created, 204 = No Content (preflight), v.v.

---

## 1. GET `/api/init`

- **Host**: `tikfinity.zerody.one`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `48`
- **Bearer auth required**: no
- **Captured at**: `2026-05-21T17:05:37.601Z`

### Response shape (recursive type tree)

```
{
  status: number = 200
  message: string = "OK"
  countryCode: string = "VN"
}
```

### Sample response (real data, full)

```json
{
  "status": 200,
  "message": "OK",
  "countryCode": "VN"
}
```

---

## 2. POST `/api/login`

- **Host**: `tikfinity.zerody.one`
- **Method**: `POST`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `0`
- **Bearer auth required**: no
- **Captured at**: `2026-05-21T16:36:20.159Z`

### Response shape (recursive type tree)

_(empty body)_

---

## 3. POST `/api/me`

- **Host**: `tikfinity.zerody.one`
- **Method**: `POST`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `54,720`
- **Bearer auth required**: no
- **Captured at**: `2026-05-21T17:05:40.862Z`

### Response shape (recursive type tree)

```
{
  status: number = 200
  message: string = "OK"
  channel: {
    ownerUserId: string = "6831911003812840449"
    channelId: number = 3048148
    channelName: string = "buivinhphuchotboykeokeo"
    channelSignature: string = "jmVkwDvK0u"
    sub: string = "social:nguyenlg13112000@gmail.com"
    email: string = "nguyenlg13112000@gmail.com"
    affId: null
    agencyId: null
    agencyAffiliateId: null
    profileId: number = 1
    proExpireAt: null
    proExpireSetBy: null
    locale: string = "VN"
    isChatbotApproved: boolean = false
    challengeRunning: boolean = false
    challengeName: null
    signupAuthProvider: string = "social"
    challengeStartAt: null
    dynamicSettings: {
      widget_socialmediarotator_animation: string = "fade"
      widget_coinjar_xoffset: string = "0"
      widget_goalshares_backgroundcolor: string = "rgba(23, 189, 128, 0.6)"
      widget_quiz_fonttype: string = "Exo 2"
      webcam_pure_animation: string = "true"
      widget_wheelofactions_wheels: string = "[]"
      textboxcoinamount: string = "5"
      radiogroupttscommenttypes: string = "0"
      textboxttstest: string = "This is a test!"
      goal_viewer_value: string = "100"
      widget_topliker_usernamecolor: string = "#3e9bde"
      widget_webcam_blackwhite_fontlinespacing: string = "50"
      widget_firework_soundvolume: string = "80"
      widget_wheelofactions_waitduration: string = "1"
      talking_chroma_animation: string = "true"
      checkboxchatcmdgetpointsenabled: string = "true"
      widget_talking_pixelart_animation: string = "true"
      widget_lastxfollower_backgroundcolor: string = "rgba(40, 40, 40, 0.8)"
      widget_wheel_soundenabled: string = "true"
      widget_webcam_pure_fonttype: string = "Exo 2"
      widget_chat_slideeffect: string = "true"
      widget_goalcoins_layout: string = "simple"
      widget_chat_usernameglowcolornormal: string = "#ffffff"
      widget_webcam_pixelworld_animation: string = "true"
      widget_goalcoins_percentagecolor: string = "#ddf0e9"
      widget_goalcustom3_huefilter: string = "0"
      widget_myactions_fonttype: string = "Roboto"
      widget_talking_pixelworld_fontlinespacing: string = "50"
      widget_goalcustom1_saturationfilter: string = "50"
      widget_talking_sakura_variation: string = "blank"
      widget_talking_champion_fontlinespacing: string = "50"
      widget_cannon_intensity: string = "50"
      widget_coinmatch_hideafter: string = "15"
      widget_songrequests_usernameglow: string = "false"
      widget_lastxlike_enablebackground: string = "false"
      widget_overlay_chroma_huefilter: string = "0"
      widget_coinmatch_enablesnipemode: string = "false"
      widget_chat_showchatnormal: string = "true"
      widget_gcounter1_fontlinespacing: string = "50"
      widget_lastxfollower_enablebackground: string = "false"
      ... +1195 more keys
    }
    dynamicProfileSettings: null
    halvingLastExecutionAt: null
    catchApplied: boolean = false
    catchEnabled: boolean = false
    catchEnabledInGrid: boolean = true
    catchEnabledAt: null
    catchProEnabled: boolean = false
    catchProEnabledAt: null
    catchRandom: number = 5
    isCatchAdmin: boolean = false
    userAgent: string = "<111-char string>"
    customInfoText: null
    lastActivityAt: string = "2026-05-21T17:05:45.938Z"
    patreonUserId: null
    discordUsername: null
    bmcEmail: null
    lmSubscriptionId: null
    monthlyEarnings: number = 5849
    monthlyEarningsMax: number = 12601
    streamGifter: number = 17
    streamGifterMax: number = 168
    ... +19 more keys
  }
  channeluser: {
    userId: string = "6831911003812840449"
    id: number = 581862504
    channelId: number = 3048148
    username: string = "buivinhphuchotboykeokeo"
    nickname: null
    thumbnailUrl: string = "<124-char string>"
    totalAmount: number = 0
    totalRewardAmount: number = 0
    challengeStartAmount: number = 0
    challengeStartRewardAmount: number = 0
    archivedAmount: number = 0
    archivedRewardAmount: number = 0
    lastUpsertAt: string = "2026-05-21T17:05:45.956Z"
    createdAt: string = "2026-05-21T16:37:29.000Z"
    updatedAt: string = "2026-05-21T17:05:45.956Z"
  }
  userFeatures: {
    isPro: boolean = false
    proInfo: null
  }
  profile: null
  cookieAuth: boolean = false
  wsAuthToken: string = "b1aee2351e7a8fd205a8196d2caaa6a5"
  discordVerifyToken: string = "7584ea2ead333edfe790b12436cb02e9"
  channelId: number = 3048148
  countryCode: string = "VN"
  overloadSettings: {
    enabled: boolean = false
    suffixIds: array<number = 0>[10]
    minAccountAge: number = 5
    updatedAt: string = "2025-10-03T00:13:25.872Z"
  }
  activePromotions: array<empty>[0]
  mobileVoucherCode: null
  performanceDebugInfo: {
    cid: number = 3048148
    step1: number = 22
    step2: number = 10
    step3: number = 13
    step4: number = 6
    step5: number = 0
    step6: number = 0
    step7: number = 15
    total: number = 66
  }
  isTrialAvailable: boolean = false
  hasActiveTrial: boolean = false
  trialEnded: boolean = false
  trialInfo: null
  subscription: null
  featureBaseToken: string = "<224-char string>"
  discordHasProRole: boolean = false
}
```

### Sample response (truncated head — full 54,720 B available in HAR)

```json
{
  "status": 200,
  "message": "OK",
  "channel": {
    "ownerUserId": "6831911003812840449",
    "channelId": 3048148,
    "channelName": "buivinhphuchotboykeokeo",
    "channelSignature": "jmVkwDvK0u",
    "sub": "social:nguyenlg13112000@gmail.com",
    "email": "nguyenlg13112000@gmail.com",
    "affId": null,
    "agencyId": null,
    "agencyAffiliateId": null,
    "profileId": 1,
    "proExpireAt": null,
    "proExpireSetBy": null,
    "locale": "VN",
    "isChatbotApproved": false,
    "challengeRunning": false,
    "challengeName": null,
    "signupAuthProvider": "social",
    "challengeStartAt": null,
    "dynamicSettings": {
      "widget_socialmediarotator_animation": "fade",
      "widget_coinjar_xoffset": "0",
      "widget_goalshares_backgroundcolor": "rgba(23, 189, 128, 0.6)",
      "widget_quiz_fonttype": "Exo 2",
      "webcam_pure_animation": "true",
      "widget_wheelofactions_wheels": "[]",
      "textboxcoinamount": "5",
      "radiogroupttscommenttypes": "0",
      "textboxttstest": "This is a test!",
      "goal_viewer_value": "100",
      "widget_topliker_usernamecolor": "#3e9bde",
      "widget_webcam_blackwhite_fontlinespacing": "50",
      "widget_firework_soundvolume": "80",
      "widget_wheelofactions_waitduration": "1",
      "talking_chroma_animation": "true",
      "checkboxchatcmdgetpointsenabled": "true",
      "widget_talking_pixelart_animation": "true",
      "widget_lastxfollower_backgroundcolor": "rgba(40, 40, 40, 0.8)",
      "widget_wheel_soundenabled": "true",
      "widget_webcam_pure_fonttype": "Exo 2",
      "widget_chat_slideeffect": "true",
      "widget_goalcoins_layout": "simple",
      "widget_chat_usernameglowcolornormal": "#ffffff",
      "widget_webcam_pixelworld_animation": "true",
      "widget_goalcoins_percentagecolor": "#ddf0e9",
      "widget_goalcustom3_huefilter": "0",
      "widget_myactions_fonttype": "Roboto",
      "widget_talking_pixelworld_fontlinespacing": "50",
      "widget_goalcustom1_saturationfilter": "50",
      "widget_talking_sakura_variation": "blank",
      "widget_talking_champion_fontlinespacing": "50",
      "widget_cannon_intensity": "50",
      "widget_coinmatch_hideafter": "15",
      "widget_songrequests_usernameglow": "false",
      "widget_lastxlike_enablebackground": "false",
      "widget_overlay_chroma_huefilter": "0",
      "widget_coinmatch_enablesnipemode": "false",
      "widget_chat_showchatnormal": "true",
      "widget_gcounter1_fontlinespacing": "50",
      "widget_lastxfollower_enablebackground": "false",
      "widget_topliker_showheartsymbol": "true",
      "widget_tops_giftopacity": "90",
      "resetcustomgoalsonnewbccheckbox": "true",
      "webcam_pixelworld_animation": "true",
      "widget_gcounter2_titleeffect": "none",
      "widget_memory_fontsize": "50",
      "widget_firework_soundenabled": "true",
      "widget_fallingsnow_fontletterspacing": "50",
      "widget_topliker_fontsize": "50",
      "widget_goalfollows_percentagecolor": "#ddf0e9",
      "widget_lastxchatter_enableborder": "true",
      "widget_webcam_pixelart_animation": "true",
      "talking_military_animation": "true",
      "widget_webcam_sakura_fontsize": "50",
      "checkboxqueuekeystrokes": "true",
      "widget_overlay_blackwhite_saturationfilter": "100",
      "widget_lastxfollower_usernamewave": "false",
  ... (1285 more lines truncated for brevity)
```

_Full payload available at `routes-generated/tikfinity.zerody.four.merged.endpoints.json` — search `"pathname":"/api/me"`._

---

## 4. GET `/api/rest/action`

- **Host**: `tikfinity.zerody.one`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `3,768`
- **Bearer auth required**: no
- **Query example**: `?channelId=3048148&profileId=1&pageSize=5000`
- **Captured at**: `2026-05-21T17:05:41.968Z`

### Response shape (recursive type tree)

```
{
  status: number = 200
  message: string = "OK"
  arrayKey: string = "actions"
  actions: array<{
    id: number = 100268337
    channelId: number = 3048148
    profileId: number = 1
    name: string = "Follow Alert"
    screenId: number = 1
    duration: number = 5
    amountToAdd: number = 0
    imageUrl: null
    audioUrl: null
    videoUrl: null
    animationUrl: string = "/assets/lotties/11438-starburst-animation.json"
    webhookUrl: null
    text: string = "Thanks for following!"
    textToSpeech: null
    message: null
    obsSceneId: null
    obsSourceId: null
    snapCamEffectId: null
    mcCmd: null
    keystrokes: null
    thirdPartyAction: null
    customGoalConfig: null
    voicemodVoiceConfig: null
    streamerbotActionId: null
    timerSeconds: null
    enableFadeEffect: boolean = true
    dynamicConfig: {
      enableStreaks: boolean = false
      skipOnNext: boolean = false
      mediaSoundVolume: number = 100
      cooldown: number = 0
      userCooldown: number = 0
      animationUrlOriginalFilename: string = " starburst animation"
      isImported: boolean = true
    }
    isDeleted: boolean = false
    createdAt: string = "2026-05-08T02:49:45.000Z"
    updatedAt: string = "2026-05-08T02:49:45.000Z"
  }>[4]
  pageSize: number = 4
  page: number = 0
  orderType: string = "DESC"
  orderColumn: string = "id"
  hasNext: boolean = false
}
```

### Sample response (real data, full)

```json
{
  "status": 200,
  "message": "OK",
  "arrayKey": "actions",
  "actions": [
    {
      "id": 100268337,
      "channelId": 3048148,
      "profileId": 1,
      "name": "Follow Alert",
      "screenId": 1,
      "duration": 5,
      "amountToAdd": 0,
      "imageUrl": null,
      "audioUrl": null,
      "videoUrl": null,
      "animationUrl": "/assets/lotties/11438-starburst-animation.json",
      "webhookUrl": null,
      "text": "Thanks for following!",
      "textToSpeech": null,
      "message": null,
      "obsSceneId": null,
      "obsSourceId": null,
      "snapCamEffectId": null,
      "mcCmd": null,
      "keystrokes": null,
      "thirdPartyAction": null,
      "customGoalConfig": null,
      "voicemodVoiceConfig": null,
      "streamerbotActionId": null,
      "timerSeconds": null,
      "enableFadeEffect": true,
      "dynamicConfig": {
        "enableStreaks": false,
        "skipOnNext": false,
        "mediaSoundVolume": 100,
        "cooldown": 0,
        "userCooldown": 0,
        "animationUrlOriginalFilename": " starburst animation",
        "isImported": true
      },
      "isDeleted": false,
      "createdAt": "2026-05-08T02:49:45.000Z",
      "updatedAt": "2026-05-08T02:49:45.000Z"
    },
    {
      "id": 100268336,
      "channelId": 3048148,
      "profileId": 1,
      "name": "Gift Alert",
      "screenId": 1,
      "duration": 5,
      "amountToAdd": 0,
      "imageUrl": null,
      "audioUrl": "https://www.myinstants.com/media/sounds/gold-coins.mp3",
      "videoUrl": null,
      "animationUrl": "https://ynassets.younow.com/gifts/live/LEVEL_RAIN/gift_LEVEL_RAIN_full_lottie.json?1",
      "webhookUrl": null,
      "text": "Thanks for {repeatcount}x {giftname}!",
      "textToSpeech": null,
      "message": null,
      "obsSceneId": null,
      "obsSourceId": null,
      "snapCamEffectId": null,
      "mcCmd": null,
      "keystrokes": null,
      "thirdPartyAction": null,
      "customGoalConfig": null,
      "voicemodVoiceConfig": null,
      "streamerbotActionId": null,
      "timerSeconds": null,
      "enableFadeEffect": true,
      "dynamicConfig": {
        "enableStreaks": false,
        "skipOnNext": false,
        "mediaSoundVolume": 100,
        "cooldown": 0,
        "userCooldown": 0,
        "animationUrlOriginalFilename": "LEVEL_RAIN",
        "audioUrlOriginalFilename": "Falling Coins",
        "isImported": true
      },
      "isDeleted": false,
      "createdAt": "2026-05-08T02:49:45.000Z",
      "updatedAt": "2026-05-08T02:49:45.000Z"
    },
    {
      "id": 100268335,
      "channelId": 3048148,
      "profileId": 1,
      "name": "Like Alert",
      "screenId": 1,
      "duration": 5,
      "amountToAdd": 0,
      "imageUrl": null,
      "audioUrl": null,
      "videoUrl": null,
      "animationUrl": "https://ynassets.younow.com/gifts/live/LIKE_STORM/gift_LIKE_STORM_full_lottie.json?1",
      "webhookUrl": null,
      "text": "Thanks for {totallikecount} Likes!",
      "textToSpeech": null,
      "message": null,
      "obsSceneId": null,
      "obsSourceId": null,
      "snapCamEffectId": null,
      "mcCmd": null,
      "keystrokes": null,
      "thirdPartyAction": null,
      "customGoalConfig": null,
      "voicemodVoiceConfig": null,
      "streamerbotActionId": null,
      "timerSeconds": null,
      "enableFadeEffect": true,
      "dynamicConfig": {
        "enableStreaks": false,
        "skipOnNext": false,
        "mediaSoundVolume": 100,
        "cooldown": 0,
        "userCooldown": 0,
        "animationUrlOriginalFilename": "LIKE_STORM",
        "isImported": true
      },
      "isDeleted": false,
      "createdAt": "2026-05-08T02:49:45.000Z",
      "updatedAt": "2026-05-08T02:49:45.000Z"
    },
    {
      "id": 100268334,
      "channelId": 3048148,
      "profileId": 1,
      "name": "Sub Alert",
      "screenId": 1,
      "duration": 12,
      "amountToAdd": 0,
      "imageUrl": null,
      "audioUrl": "https://www.myinstants.com/media/sounds/notification_alert.mp3",
      "videoUrl": null,
      "animationUrl": "https://ynassets.younow.com/gifts/live/MAKE_IT_RAIN/gift_MAKE_IT_RAIN_full_lottie.json?1",
      "webhookUrl": null,
      "text": "Thanks for subscribing!",
      "textToSpeech": null,
      "message": null,
      "obsSceneId": null,
      "obsSourceId": null,
      "snapCamEffectId": null,
      "mcCmd": null,
      "keystrokes": null,
      "thirdPartyAction": null,
      "customGoalConfig": null,
      "voicemodVoiceConfig": null,
      "streamerbotActionId": null,
      "timerSeconds": null,
      "enableFadeEffect": true,
      "dynamicConfig": {
        "enableStreaks": false,
        "skipOnNext": false,
        "mediaSoundVolume": 100,
        "cooldown": 0,
        "userCooldown": 0,
        "animationUrlOriginalFilename": "MAKE_IT_RAIN",
        "audioUrlOriginalFilename": "Notification Alert",
        "isImported": true
      },
      "isDeleted": false,
      "createdAt": "2026-05-08T02:49:45.000Z",
      "updatedAt": "2026-05-08T02:49:45.000Z"
    }
  ],
  "pageSize": 4,
  "page": 0,
  "orderType": "DESC",
  "orderColumn": "id",
  "hasNext": false
}
```

---

## 5. POST `/api/updateSettings`

- **Host**: `tikfinity.zerody.one`
- **Method**: `POST`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `29`
- **Bearer auth required**: no
- **Captured at**: `2026-05-21T16:37:25.990Z`

### Response shape (recursive type tree)

```
{
  status: number = 200
  message: string = "OK"
}
```

### Sample response (real data, full)

```json
{
  "status": 200,
  "message": "OK"
}
```

---

## 6. POST `/api/executeAction`

- **Host**: `tikfinity.zerody.one`
- **Method**: `POST`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `29`
- **Bearer auth required**: no
- **Captured at**: `2026-05-21T16:37:58.201Z`

### Response shape (recursive type tree)

```
{
  status: number = 200
  message: string = "OK"
}
```

### Sample response (real data, full)

```json
{
  "status": 200,
  "message": "OK"
}
```

---

## 7. PUT `/api/rest/transaction`

- **Host**: `tikfinity.zerody.one`
- **Method**: `PUT`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `833`
- **Bearer auth required**: no
- **Captured at**: `2026-05-21T16:37:58.198Z`

### Response shape (recursive type tree)

```
{
  status: number = 200
  message: string = "OK"
  transaction: {
    userId: string = "7133010870766879771"
    isDeleted: boolean = false
    id: number = 1507172606
    amount: number = 1
    isReward: boolean = true
    isManual: boolean = false
    description: string = "Hoa hồng (x1) - 1 Coins"
    channelId: number = 3048148
    isDuringChallenge: boolean = false
    updatedAt: string = "2026-05-21T16:38:03.259Z"
    createdAt: string = "2026-05-21T16:38:03.259Z"
  }
  channeluser: {
    userId: string = "7133010870766879771"
    challengeStartAmount: number = 0
    challengeStartRewardAmount: number = 0
    archivedAmount: number = 0
    archivedRewardAmount: number = 0
    id: number = 581862856
    channelId: number = 3048148
    username: string = "bn1589"
    nickname: string = "‧₊˚ ☁️⋅♡ nhi ⋆"
    totalAmount: number = 1
    totalRewardAmount: number = 1
    lastUpsertAt: {
      fn: string = "NOW"
      args: array<empty>[0]
    }
    thumbnailUrl: string = "<113-char string>"
    updatedAt: string = "2026-05-21T16:38:03.274Z"
    createdAt: string = "2026-05-21T16:38:03.274Z"
  }
}
```

### Sample response (real data, full)

```json
{
  "status": 200,
  "message": "OK",
  "transaction": {
    "userId": "7133010870766879771",
    "isDeleted": false,
    "id": 1507172606,
    "amount": 1,
    "isReward": true,
    "isManual": false,
    "description": "Hoa hồng (x1) - 1 Coins",
    "channelId": 3048148,
    "isDuringChallenge": false,
    "updatedAt": "2026-05-21T16:38:03.259Z",
    "createdAt": "2026-05-21T16:38:03.259Z"
  },
  "channeluser": {
    "userId": "7133010870766879771",
    "challengeStartAmount": 0,
    "challengeStartRewardAmount": 0,
    "archivedAmount": 0,
    "archivedRewardAmount": 0,
    "id": 581862856,
    "channelId": 3048148,
    "username": "bn1589",
    "nickname": "‧₊˚ ☁️⋅♡ nhi ⋆",
    "totalAmount": 1,
    "totalRewardAmount": 1,
    "lastUpsertAt": {
      "fn": "NOW",
      "args": []
    },
    "thumbnailUrl": "p16-common.tiktokcdn.com/tos-alisg-avt-0068/5616ae57d8daa96fd6b77a1aff73970c~tplv-tiktokx-cropcenter:100:100.webp",
    "updatedAt": "2026-05-21T16:38:03.274Z",
    "createdAt": "2026-05-21T16:38:03.274Z"
  }
}
```

---

## 8. GET `/api/notifications/list`

- **Host**: `tikfinity.zerody.one`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `0`
- **Bearer auth required**: no
- **Query example**: `?limit=50&archived=false&{}`
- **Captured at**: `2026-05-21T17:06:46.821Z`

### Response shape (recursive type tree)

_(empty body)_

---

## 9. GET `/api/notifications/preferences`

- **Host**: `tikfinity.zerody.one`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `42`
- **Bearer auth required**: no
- **Query example**: `?{}`
- **Captured at**: `2026-05-21T16:25:43.697Z`

### Response shape (recursive type tree)

```
{
  status: number = 200
  message: string = "OK"
  inApp: boolean = true
}
```

### Sample response (real data, full)

```json
{
  "status": 200,
  "message": "OK",
  "inApp": true
}
```

---

## 10. GET `/api/getAllGifts`

- **Host**: `tikfinity.zerody.one`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `0`
- **Bearer auth required**: no
- **Query example**: `?lang=vi-VN&room_id=7642359674616007440`
- **Captured at**: `2026-05-21T17:06:48.211Z`

### Response shape (recursive type tree)

_(empty body)_

---

## 11. GET `/api/getChannelEmotes`

- **Host**: `tikfinity.zerody.one`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `2,901`
- **Bearer auth required**: no
- **Query example**: `?uniqueId=buivinhphuchotboykeokeo`
- **Captured at**: `2026-05-21T17:05:42.022Z`

### Response shape (recursive type tree)

```
{
  status: number = 200
  message: string = "OK"
  emotes: array<{
    emoteId: string = "7747176548099968655"
    packageId: null
    imageUrl: string = "https://p16-webcast.tiktokcdn.com/webcast-va/qingzhu.png~tplv-obj.image"
    sourceId: number = 4
  }>[16]
}
```

### Sample response (real data, full)

```json
{
  "status": 200,
  "message": "OK",
  "emotes": [
    {
      "emoteId": "7747176548099968655",
      "packageId": null,
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-va/qingzhu.png~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7747176548099968699",
      "packageId": null,
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-va/gogogo.png~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7747176548099968612",
      "packageId": null,
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-va/taptap.png~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7747176548093415022",
      "packageId": null,
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-va/applause.png~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7747176548096691833",
      "packageId": null,
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-va/joinclub.png~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7747176548090138211",
      "packageId": null,
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-va/shareice.png~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7747176548099968644",
      "packageId": null,
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-va/call.png~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7747176548099968666",
      "packageId": null,
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-va/shine.png~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7747176548099968677",
      "packageId": null,
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-va/heart.png~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7747176548099968688",
      "packageId": null,
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-va/eyecontact.png~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7588513026916928274",
      "packageId": "fansclub",
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-sg/sub_21c4630bb4971ebd30e97bcd5796446fa6f2781a46c1931a3a86e1bc5d3d6f7e_1766838383464914~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7613217643420502785",
      "packageId": "fansclub",
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-sg/sub_86c2ad46afbd9f1ab1dfbbf19adbb79fa117a3fbd7da198ea59c235a4327d3ed_1772590393720019~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7618063784451918613",
      "packageId": "fansclub",
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-sg/sub_8ddb589eeb3afeee174c97c35a2cab9360c0bcdfb8d916ecd1fd3b27f4e53684_1773718726973334~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7618063784452016917",
      "packageId": "fansclub",
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-sg/sub_dcb2ad2b8fa997a6831df1dc0d6f5c09ef258908b98011efa8c5c4ecb867183e_1773718727060868~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7628909434715392775",
      "packageId": "fansclub",
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-sg/sub_029c014a4c5a68ed3bfad98cbfd331b6c472c55f0044b09b7d00a90060c341a1_1776243951993394~tplv-obj.image",
      "sourceId": 4
    },
    {
      "emoteId": "7628909564229880594",
      "packageId": "fansclub",
      "imageUrl": "https://p16-webcast.tiktokcdn.com/webcast-sg/sub_a8b100c751f74ee12606174bddf05c054db726a8860b547cda6312864cc6d58a_1776243951937988~tplv-obj.image",
      "sourceId": 4
    }
  ]
}
```

---

## 12. GET `/api/getLiveChannels`

- **Host**: `tikfinity.zerody.one`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `12,173`
- **Bearer auth required**: no
- **Query example**: `?limit=60`
- **Captured at**: `2026-05-21T16:25:47.707Z`

### Response shape (recursive type tree)

```
{
  status: number = 200
  message: string = "OK"
  liveChannelCount: number = 16959
  liveChannels: array<{
    ownerUserId: string = "7166551771426391066"
    channelId: number = 875775
    channelName: string = "holyfather_official"
    lastSeenAt: string = "2026-05-21T16:22:51.831Z"
    countryCode: string = "PH"
    viewerCount: number = 3487
    activeFeatures: array<empty>[0]
    activeWidgets: array<empty>[0]
  }>[60]
}
```

### Sample response (truncated head — full 12,173 B available in HAR)

```json
{
  "status": 200,
  "message": "OK",
  "liveChannelCount": 16959,
  "liveChannels": [
    {
      "ownerUserId": "7166551771426391066",
      "channelId": 875775,
      "channelName": "holyfather_official",
      "lastSeenAt": "2026-05-21T16:22:51.831Z",
      "countryCode": "PH",
      "viewerCount": 3487,
      "activeFeatures": [],
      "activeWidgets": []
    },
    {
      "ownerUserId": "6886848309249098758",
      "channelId": 239449,
      "channelName": "kaokorrl",
      "lastSeenAt": "2026-05-21T16:23:48.250Z",
      "countryCode": "FR",
      "viewerCount": 3361,
      "activeFeatures": [],
      "activeWidgets": []
    },
    {
      "ownerUserId": "6886848309249098758",
      "channelId": 116814,
      "channelName": "kaokorrl",
      "lastSeenAt": "2026-05-21T16:23:49.127Z",
      "countryCode": "GB",
      "viewerCount": 3354,
      "activeFeatures": [],
      "activeWidgets": []
    },
    {
      "ownerUserId": "6588917882217627653",
      "channelId": 2245410,
      "channelName": "semi_mf",
      "lastSeenAt": "2026-05-21T16:23:52.641Z",
      "countryCode": "DE",
      "viewerCount": 3351,
      "activeFeatures": [],
      "activeWidgets": []
    },
    {
      "ownerUserId": "7607817410859205648",
      "channelId": 2912021,
      "channelName": "trade.ical18",
      "lastSeenAt": "2026-05-21T16:23:51.634Z",
      "countryCode": "ID",
      "viewerCount": 3059,
      "activeFeatures": [],
      "activeWidgets": []
    },
    {
      "ownerUserId": "7429199710106584095",
      "channelId": 2569988,
      "channelName": "movietunez",
      "lastSeenAt": "2026-05-21T16:23:49.701Z",
      "countryCode": "US",
      "viewerCount": 2246,
      "activeFeatures": [],
      "activeWidgets": []
    },
    {
      "ownerUserId": "6812209490383111173",
      "channelId": 1704264,
      "channelName": "assoullagaming",
      "lastSeenAt": "2026-05-21T16:23:53.477Z",
      "countryCode": "IT",
      "viewerCount": 2231,
      "activeFeatures": [],
      "activeWidgets": []
    },
    {
      "ownerUserId": "7434785308812657671",
      "channelId": 1451963,
      "channelName": "radiomasalalu.com",
      "lastSeenAt": "2026-05-21T16:23:47.084Z",
  ... (527 more lines truncated for brevity)
```

_Full payload available at `routes-generated/tikfinity.zerody.four.merged.endpoints.json` — search `"pathname":"/api/getLiveChannels"`._

---

## 13. GET `/api/getGlobalTransactions`

- **Host**: `tikfinity.zerody.one`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `2,932`
- **Bearer auth required**: no
- **Captured at**: `2026-05-21T17:05:38.289Z`

### Response shape (recursive type tree)

```
(not JSON — first 400 chars)
eyJzdGF0dXMiOjIwMCwibWVzc2FnZSI6Ik9LIiwiZ2xvYmFsVHJhbnNhY3Rpb25zIjpbeyJ0cmFuc2FjdGlvbklkIjoxNTA3MzYzMzU5LCJjaGFubmVsTmFtZSI6ImFtYTU1XzIyIiwidXNlcm5hbWUiOiJlZGR5c290bzAiLCJuaWNrbmFtZSI6IkVkZHkiLCJ1c2VySWQiOiI2NzcyNTUwMjg5OTUxNjcxMzAxIiwiY2hhbm5lbElkIjoxNjk5NjUzLCJhbW91bnQiOjEsImRlc2NyaXB0aW9uIjoiVGUgYWRvcm8gKHgxKSAtIDEgQ29pbnMifSx7InRyYW5zYWN0aW9uSWQiOjE1MDczNjM0OTAsImNoYW5uZWxOYW1lIjoiamF5Yy5oaWhp
```

### Sample response (real data, full)

```
eyJzdGF0dXMiOjIwMCwibWVzc2FnZSI6Ik9LIiwiZ2xvYmFsVHJhbnNhY3Rpb25zIjpbeyJ0cmFuc2FjdGlvbklkIjoxNTA3MzYzMzU5LCJjaGFubmVsTmFtZSI6ImFtYTU1XzIyIiwidXNlcm5hbWUiOiJlZGR5c290bzAiLCJuaWNrbmFtZSI6IkVkZHkiLCJ1c2VySWQiOiI2NzcyNTUwMjg5OTUxNjcxMzAxIiwiY2hhbm5lbElkIjoxNjk5NjUzLCJhbW91bnQiOjEsImRlc2NyaXB0aW9uIjoiVGUgYWRvcm8gKHgxKSAtIDEgQ29pbnMifSx7InRyYW5zYWN0aW9uSWQiOjE1MDczNjM0OTAsImNoYW5uZWxOYW1lIjoiamF5Yy5oaWhpIiwidXNlcm5hbWUiOiJwaG9tYWlxdWUyNDM0Iiwibmlja25hbWUiOiLwn4+g8J2Ru/CdkpbwnZKa8J2ShsyCzIHwnZKVIPCfjYAiLCJ1c2VySWQiOiI3MDIyMTk1NDA5MDI0OTkyMjU3IiwiY2hhbm5lbElkIjozMDgyMjgwLCJhbW91bnQiOjUsImRlc2NyaXB0aW9uIjoiUm9zZSAoeDUpIC0gNSBDb2lucyJ9LHsidHJhbnNhY3Rpb25JZCI6MTUwNzM2MzUzMiwiY2hhbm5lbE5hbWUiOiJydWdhZGl4eCIsInVzZXJuYW1lIjoiX2Z1dGJvbF9ib3hlby5saXZlIiwibmlja25hbWUiOiLwn6SpMTAwJSBSRUFMIE1BRFJJRCDwn5KAIiwi
```

---

## 14. GET `/api/getChannelUserCount`

- **Host**: `tikfinity.zerody.one`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `42`
- **Bearer auth required**: no
- **Query example**: `?channelId=2228412`
- **Captured at**: `2026-05-21T16:25:43.141Z`

### Response shape (recursive type tree)

```
{
  status: number = 200
  message: string = "OK"
  count: number = 2646
}
```

### Sample response (real data, full)

```json
{
  "status": 200,
  "message": "OK",
  "count": 2646
}
```

---

## 15. GET `/api/odata/channeluser`

- **Host**: `tikfinity.zerody.one`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `13,796`
- **Bearer auth required**: no
- **Query example**: `?%24orderby=totalAmount%20desc&%24skip=40&%24top=20&%24filter=channelId%20eq%202228412`
- **Captured at**: `2026-05-21T16:26:23.041Z`

### Response shape (recursive type tree)

```
(not JSON — first 400 chars)
eyJ2YWx1ZSI6W3siaWQiOjU3MDIzNjQwNSwiY2hhbm5lbElkIjoyMjI4NDEyLCJ1c2VySWQiOiI2NjIzMzIyMTA0ODgyNzI0ODY2IiwidXNlcm5hbWUiOiJzdWJiZWthMTIiLCJuaWNrbmFtZSI6IlN1YmJla2EgUmFl8J+Hs/Cfh7Xwn4ev8J+HteKYmO+4jzExOjExIiwidGh1bWJuYWlsVXJsIjoicDE2LWNvbW1vbi50aWt0b2tjZG4uY29tL3Rvcy1hbGlzZy1hdnQtMDA2OC85ZTdkNzMwN2NjODAzODc5YzhlNWQyZTg0OGEyODFkYX50cGx2LXRpa3Rva3gtY3JvcGNlbnRlcjoxMDA6MTAwLndlYnAiLCJ0b3RhbEFtb3VudCI6MTgu
```

### Sample response (truncated head — full 13,796 B available in HAR)

```
eyJ2YWx1ZSI6W3siaWQiOjU3MDIzNjQwNSwiY2hhbm5lbElkIjoyMjI4NDEyLCJ1c2VySWQiOiI2NjIzMzIyMTA0ODgyNzI0ODY2IiwidXNlcm5hbWUiOiJzdWJiZWthMTIiLCJuaWNrbmFtZSI6IlN1YmJla2EgUmFl8J+Hs/Cfh7Xwn4ev8J+HteKYmO+4jzExOjExIiwidGh1bWJuYWlsVXJsIjoicDE2LWNvbW1vbi50aWt0b2tjZG4uY29tL3Rvcy1hbGlzZy1hdnQtMDA2OC85ZTdkNzMwN2NjODAzODc5YzhlNWQyZTg0OGEyODFkYX50cGx2LXRpa3Rva3gtY3JvcGNlbnRlcjoxMDA6MTAwLndlYnAiLCJ0b3RhbEFtb3VudCI6MTguMzIsInRvdGFsUmV3YXJkQW1vdW50IjoxLjMyLCJjaGFsbGVuZ2VTdGFydEFtb3VudCI6MCwiY2hhbGxlbmdlU3RhcnRSZXdhcmRBbW91bnQiOjAsImFyY2hpdmVkQW1vdW50IjowLCJhcmNoaXZlZFJld2FyZEFtb3VudCI6MCwibGFzdFVwc2VydEF0IjoiMjAyNi0wNS0wN1QwOToxNToxNi4wMDBaIiwiY3JlYXRlZEF0IjoiMjAyNi0wNS0wN1QwOTowNjowMS4wMDBaIiwidXBkYXRlZEF0IjoiMjAyNi0wNS0wN1QwOToxNToxNi4wMDBaIn0seyJpZCI6NTcwMjM1ODkyLCJjaGFubmVsSWQiOjIyMjg0MTIsInVzZXJJZCI6Ijc0MzE3
```

_Full payload available at `routes-generated/tikfinity.zerody.four.merged.endpoints.json` — search `"pathname":"/api/odata/channeluser"`._

---

## 16. GET `/api/odata/transaction`

- **Host**: `tikfinity.zerody.one`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `5,587`
- **Bearer auth required**: no
- **Query example**: `?%24orderby=createdAt%20desc&%24top=20&%24filter=(channelId%20eq%202228412)%20and%20(isDeleted%20eq%200)%20and%20(isDuringChallenge%20eq%20false)`
- **Captured at**: `2026-05-21T16:25:43.277Z`

### Response shape (recursive type tree)

```
{
  value: array<{
    id: number = 1383422608
    channelId: number = 2228412
    userId: string = "6830418461840606209"
    amount: number = 3
    isReward: number = 0
    isManual: number = 0
    isDeleted: number = 0
    isDuringChallenge: number = 0
    description: string = "Action 'Gift Alert'"
    createdAt: string = "2026-05-07T10:03:32.000Z"
    updatedAt: string = "2026-05-07T10:03:32.000Z"
    username: string = "25200h"
  }>[20]
}
```

### Sample response (real data, full)

```json
{
  "value": [
    {
      "id": 1383422608,
      "channelId": 2228412,
      "userId": "6830418461840606209",
      "amount": 3,
      "isReward": 0,
      "isManual": 0,
      "isDeleted": 0,
      "isDuringChallenge": 0,
      "description": "Action 'Gift Alert'",
      "createdAt": "2026-05-07T10:03:32.000Z",
      "updatedAt": "2026-05-07T10:03:32.000Z",
      "username": "25200h"
    },
    {
      "id": 1383422579,
      "channelId": 2228412,
      "userId": "6830418461840606209",
      "amount": 0.01,
      "isReward": 1,
      "isManual": 0,
      "isDeleted": 0,
      "isDuringChallenge": 0,
      "description": "Heart Me (x1) - 1 Coins",
      "createdAt": "2026-05-07T10:03:32.000Z",
      "updatedAt": "2026-05-07T10:03:32.000Z",
      "username": "25200h"
    },
    {
      "id": 1383422554,
      "channelId": 2228412,
      "userId": "6830418461840606209",
      "amount": 3,
      "isReward": 0,
      "isManual": 0,
      "isDeleted": 0,
      "isDuringChallenge": 0,
      "description": "Action 'Gift Alert'",
      "createdAt": "2026-05-07T10:03:31.000Z",
      "updatedAt": "2026-05-07T10:03:31.000Z",
      "username": "25200h"
    },
    {
      "id": 1383422458,
      "channelId": 2228412,
      "userId": "6793221749989016577",
      "amount": 3,
      "isReward": 0,
      "isManual": 0,
      "isDeleted": 0,
      "isDuringChallenge": 0,
      "description": "Action 'Gift Alert'",
      "createdAt": "2026-05-07T10:03:30.000Z",
      "updatedAt": "2026-05-07T10:03:30.000Z",
      "username": "hphan3006"
    },
    {
      "id": 1383422429,
      "channelId": 2228412,
      "userId": "7045524428197479425",
      "amount": 0.52,
      "isReward": 1,
      "isManual": 0,
      "isDeleted": 0,
      "isDuringChallenge": 0,
      "description": "Chat Minute",
      "createdAt": "2026-05-07T10:03:29.000Z",
      "updatedAt": "2026-05-07T10:03:29.000Z",
      "username": "anhhthhuu"
    },
    {
      "id": 1383422405,
      "channelId": 2228412,
      "userId": "7045524428197479425",
      "amount": 3,
      "isReward": 0,
      "isManual": 0,
      "isDeleted": 0,
      "isDuringChallenge": 0,
      "description": "Action 'Gift Alert'",
      "createdAt": "2026-05-07T10:03:29.000Z",
      "updatedAt": "2026-05-07T10:03:29.000Z",
      "username": "anhhthhuu"
    },
    {
      "id": 1383422395,
      "channelId": 2228412,
      "userId": "7145702792005583874",
      "amount": 3,
      "isReward": 0,
      "isManual": 0,
      "isDeleted": 0,
      "isDuringChallenge": 0,
      "description": "Action 'Gift Alert'",
      "createdAt": "2026-05-07T10:03:29.000Z",
      "updatedAt": "2026-05-07T10:03:29.000Z",
      "username": "ngoanh926"
    },
    {
      "id": 1383422242,
      "channelId": 2228412,
      "userId": "7259758381329679365",
      "amount": 3,
      "isReward": 0,
      "isManual": 0,
      "isDeleted": 0,
      "isDuringChallenge": 0,
      "description": "Action 'Gift Alert'",
      "createdAt": "2026-05-07T10:03:26.000Z",
      "updatedAt": "2026-05-07T10:03:26.000Z",
      "username": "gaoiu591"
    },
    {
      "id": 1383422221,
      "channelId": 2228412,
      "userId": "7259758381329679365",
      "amount": 0.01,
      "isReward": 1,
      "isManual": 0,
      "isDeleted": 0,
      "isDuringChallenge": 0,
      "description": "Heart Me (x1) - 1 Coins",
      "createdAt": "2026-05-07T10:03:26.000Z",
      "updatedAt": "2026-05-07T10:03:26.000Z",
      "username": "gaoiu591"
    },
    {
      "id": 1383422057,
      "channelId": 2228412,
      "userId": "6654394413920763905",
      "amount": 3,
      "isReward": 0,
      "isManual": 0,
      "isDeleted": 0,
      "isDuringChallenge": 0,
      "description": "Action 'Gift Alert'",
      "createdAt": "2026-05-07T10:03:23.000Z",
      "updatedAt": "2026-05-07T10:03:23.000Z",
      "username": "bubblebubblepum"
    },
    {
      "id": 1383422001,
      "channelId": 2228412,
      "userId": "6856620638741758978",
      "amount": 3,
      "isReward": 0,
      "isManual": 0,
      "isDeleted": 0,
      "isDuringChallenge": 0,
      "description": "Action 'Gift Alert'",
      "createdAt": "2026-05-07T10:03:22.000Z",
      "updatedAt": "2026-05-07T10:03:22.000Z",
      "username": "duoqnn_"
    },
    {
      "id": 1383421929,
      "channelId": 2228412,
      "userId": "7275337369434817541",
      "amount": 0.52,
      "isReward": 1,
      "isManual": 0,
      "isDeleted": 0,
      "isDuringChallenge": 0,
      "description": "Chat Minute",
      "createdAt": "2026-05-07T10:03:21.000Z",
      "updatedAt": "2026-05-07T10:03:21.000Z",
      "username": "17trngkhnhlinh"
    },
    {
      "id": 1383421848,
      "channelId": 2228412,
      "userId": "6806576279724246018",
      "amount": 0.52,
      "isReward": 1,
      "isManual": 0,
      "isDeleted": 0,
      "isDuringChallenge": 0,
      "description": "Chat Minute",
      "createdAt": "2026-05-07T10:03:19.000Z",
      "updatedAt": "2026-05-07T10:03:19.000Z",
      "username": "tuongdii2608"
    },
    {
      "id": 1383421845,
      "channelId": 2228412,
      "userId": "6854420702515446786",
      "amount": 0.52,
      "isReward": 1,
      "isManual": 0,
      "isDeleted": 0,
      "isDuringChallenge": 0,
      "description": "Chat Minute",
      "createdAt": "2026-05-07T10:03:19.000Z",
      "updatedAt": "2026-05-07T10:03:19.000Z",
      "username": "lighter.._"
    },
    {
      "id": 1383421840,
  ... (84 more lines truncated for brevity)
```

---

## 17. POST `/api/usage/log`

- **Host**: `tikfinity.zerody.one`
- **Method**: `POST`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `29`
- **Bearer auth required**: no
- **Captured at**: `2026-05-21T16:25:43.737Z`

### Response shape (recursive type tree)

```
{
  status: number = 200
  message: string = "OK"
}
```

### Sample response (real data, full)

```json
{
  "status": 200,
  "message": "OK"
}
```

---

## 18. POST `/api/logError`

- **Host**: `tikfinity.zerody.one`
- **Method**: `POST`
- **Status**: `200`
- **Content-Type**: `text/plain`
- **Body bytes**: `0`
- **Bearer auth required**: no
- **Query example**: `?origin=widget`
- **Captured at**: `2026-05-21T16:26:48.506Z`

### Response shape (recursive type tree)

_(empty body)_

---

## 19. GET `/api/pro/tazapay/methods`

- **Host**: `tikfinity.zerody.one`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `71`
- **Bearer auth required**: no
- **Captured at**: `2026-05-21T17:05:41.918Z`

### Response shape (recursive type tree)

```
{
  status: number = 200
  message: string = "OK"
  cached: boolean = true
  country: string = "VN"
  methods: array<empty>[0]
}
```

### Sample response (real data, full)

```json
{
  "status": 200,
  "message": "OK",
  "cached": true,
  "country": "VN",
  "methods": []
}
```

---

## 20. POST `/api/tts/auth-token`

- **Host**: `tikfinity.zerody.one`
- **Method**: `POST`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `391`
- **Bearer auth required**: no
- **Captured at**: `2026-05-21T17:05:41.926Z`

### Response shape (recursive type tree)

```
{
  status: number = 200
  message: string = "OK"
  ttsAuthToken: string = "<344-char string>"
}
```

### Sample response (real data, full)

```json
{
  "status": 200,
  "message": "OK",
  "ttsAuthToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMDQ4MTQ4Iiwic3Vic2NyaXB0aW9uRW5hYmxlZCI6ZmFsc2UsInN1YnNjcmlwdGlvblBlcmlvZERheXMiOjMwLCJzdWJzY3JpcHRpb25QZXJpb2RDcmVkaXRzIjowLCJzdWJzY3JpcHRpb25QZXJpb2RFeHBpcmVzQXQiOiIyMDI2LTA2LTAxVDAwOjAwOjAwLjAwMFoiLCJpYXQiOjE3NzkzODMxNDYsImV4cCI6MTc3OTQ2OTU0Nn0.blPGQR07-184F3w9P8PYHDNMHQdc_9Rsc7oPWgrC-VQ"
}
```

---

## 21. GET `/api/tts/user`

- **Host**: `tts.tikfinity.com`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `474`
- **Bearer auth required**: no
- **Captured at**: `2026-05-21T16:26:09.393Z`

### Response shape (recursive type tree)

```
{
  statusCode: number = 200
  message: string = "Success"
  data: {
    id: number = 79681
    createdAt: string = "2026-05-20T01:37:19.388Z"
    updatedAt: string = "2026-05-21T08:18:00.000Z"
    userId: string = "2228412"
    quota: {
      exceeded: boolean = true
      currentUsageMode: string = "free"
      currentUsageCurrency: string = "requests"
      subscriptionCreditsRemaining: number = 0
      subscriptionCreditsTotal: number = 0
      purchasedCreditsRemaining: number = 0
      purchasedCreditsTotal: number = 0
      freeRequestsRemaining: number = 0
      freeRequestsTotal: number = 25
      nextResetAt: string = "2026-05-22T00:00:00.000Z"
      nextResetSeconds: number = 27225
    }
  }
}
```

### Sample response (real data, full)

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 79681,
    "createdAt": "2026-05-20T01:37:19.388Z",
    "updatedAt": "2026-05-21T08:18:00.000Z",
    "userId": "2228412",
    "quota": {
      "exceeded": true,
      "currentUsageMode": "free",
      "currentUsageCurrency": "requests",
      "subscriptionCreditsRemaining": 0,
      "subscriptionCreditsTotal": 0,
      "purchasedCreditsRemaining": 0,
      "purchasedCreditsTotal": 0,
      "freeRequestsRemaining": 0,
      "freeRequestsTotal": 25,
      "nextResetAt": "2026-05-22T00:00:00.000Z",
      "nextResetSeconds": 27225
    }
  }
}
```

---

## 22. GET `/api/tts/voices`

- **Host**: `tts.tikfinity.com`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `27,338`
- **Bearer auth required**: no
- **Captured at**: `2026-05-21T16:26:09.393Z`

### Response shape (recursive type tree)

```
{
  statusCode: number = 200
  message: string = "Success"
  data: {
    voices: array<{
      vendorId: string = "ttsm"
      voiceId: string = "8393d2bc-88d4-4fd1-a4ac-074b4bae94ba"
      voiceName: string = "Vera"
      languageCode: string = "en-us"
      gender: string = "female"
      vendorSpecificAttributes: {
        metadata: string = "EN-US|Female"
      }
      displayName: string = "Vera"
    }>[120]
  }
}
```

### Sample response (truncated head — full 27,338 B available in HAR)

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "voices": [
      {
        "vendorId": "ttsm",
        "voiceId": "8393d2bc-88d4-4fd1-a4ac-074b4bae94ba",
        "voiceName": "Vera",
        "languageCode": "en-us",
        "gender": "female",
        "vendorSpecificAttributes": {
          "metadata": "EN-US|Female"
        },
        "displayName": "Vera"
      },
      {
        "vendorId": "ttsm",
        "voiceId": "98800f7e-05bf-4064-a8d2-cd12ee18496c",
        "voiceName": "Alpha",
        "languageCode": "en-us",
        "gender": "male",
        "vendorSpecificAttributes": {
          "metadata": "EN-US|Male"
        },
        "displayName": "Alpha"
      },
      {
        "vendorId": "ttsm",
        "voiceId": "9af5e3d0-b4b2-44eb-9580-849d8d36a30e",
        "voiceName": "Leader",
        "languageCode": "en-us",
        "gender": "male",
        "vendorSpecificAttributes": {
          "metadata": "EN-US|Male"
        },
        "displayName": "Leader"
      },
      {
        "vendorId": "ttsm",
        "voiceId": "5dbb63c3-1179-4704-90cf-8dbe0d9b33ab",
        "voiceName": "Mentor",
        "languageCode": "en-us",
        "gender": "male",
        "vendorSpecificAttributes": {
          "metadata": "EN-US|Male"
        },
        "displayName": "Mentor"
      },
      {
        "vendorId": "ttsm",
        "voiceId": "7cbd44df-08ac-4234-bc95-836e0ae6b22c",
        "voiceName": "Tentacle",
        "languageCode": "en-us",
        "gender": "male",
        "vendorSpecificAttributes": {
          "metadata": "EN-US|Male"
        },
        "displayName": "Tentacle"
      },
      {
        "vendorId": "ttsm",
        "voiceId": "7e0ee786-b660-47ce-8de7-02fd49698efc",
        "voiceName": "Star",
        "languageCode": "en-us",
        "gender": "male",
        "vendorSpecificAttributes": {
          "metadata": "EN-US|Male"
        },
        "displayName": "Patrick Star"
      },
      {
        "vendorId": "ttsm",
        "voiceId": "8153e703-4cfb-4716-8a92-ba19cc7f0228",
        "voiceName": "Micro",
        "languageCode": "en-us",
        "gender": "male",
        "vendorSpecificAttributes": {
          "metadata": "EN-US|Male"
        },
  ... (1617 more lines truncated for brevity)
```

_Full payload available at `routes-generated/tikfinity.zerody.four.merged.endpoints.json` — search `"pathname":"/api/tts/voices"`._

---

## 23. POST `/api/tts/generate`

- **Host**: `tts.tikfinity.com`
- **Method**: `POST`
- **Status**: `201`
- **Content-Type**: `application/json`
- **Body bytes**: `624`
- **Bearer auth required**: no
- **Captured at**: `2026-05-21T16:37:54.138Z`

### Response shape (recursive type tree)

```
{
  statusCode: number = 201
  message: string = "Success"
  data: {
    result: {
      fromCache: boolean = false
      audioUrl: string = "https://storage.tts.monster/tts/374191649728175.wav"
      engineType: null
      generationDurationMs: number = 3219
    }
    user: {
      id: number = 90912
      createdAt: string = "2026-05-20T03:49:36.865Z"
      updatedAt: string = "2026-05-21T16:38:02.000Z"
      userId: string = "3048148"
      quota: {
        exceeded: boolean = false
        currentUsageMode: string = "free"
        currentUsageCurrency: string = "requests"
        subscriptionCreditsRemaining: number = 0
        subscriptionCreditsTotal: number = 0
        purchasedCreditsRemaining: number = 0
        purchasedCreditsTotal: number = 0
        freeRequestsRemaining: number = 6
        freeRequestsTotal: number = 25
        nextResetAt: string = "2026-05-22T00:00:00.000Z"
        nextResetSeconds: number = 26517
      }
    }
  }
}
```

### Sample response (real data, full)

```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "result": {
      "fromCache": false,
      "audioUrl": "https://storage.tts.monster/tts/374191649728175.wav",
      "engineType": null,
      "generationDurationMs": 3219
    },
    "user": {
      "id": 90912,
      "createdAt": "2026-05-20T03:49:36.865Z",
      "updatedAt": "2026-05-21T16:38:02.000Z",
      "userId": "3048148",
      "quota": {
        "exceeded": false,
        "currentUsageMode": "free",
        "currentUsageCurrency": "requests",
        "subscriptionCreditsRemaining": 0,
        "subscriptionCreditsTotal": 0,
        "purchasedCreditsRemaining": 0,
        "purchasedCreditsTotal": 0,
        "freeRequestsRemaining": 6,
        "freeRequestsTotal": 25,
        "nextResetAt": "2026-05-22T00:00:00.000Z",
        "nextResetSeconds": 26517
      }
    }
  }
}
```

---

## 24. GET `/api/sounds/trending`

- **Host**: `myinstantsapi.zerody.one`
- **Method**: `GET`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `4,865`
- **Bearer auth required**: no
- **Query example**: `?region=US&language=en&page=1&q=&clientVersion=2`
- **Captured at**: `2026-05-21T16:26:13.909Z`

### Response shape (recursive type tree)

```
{
  fromCache: boolean = true
  sounds: array<{
    name: string = "FAHHHHHHHHHHHHHH"
    url: string = "https://www.myinstants.com/media/sounds/fahhhhhhhhhhhhhh.mp3"
    soundId: string = "fahhhhhhhhhhhhhh.mp3"
  }>[36]
}
```

### Sample response (real data, full)

```json
{
  "fromCache": true,
  "sounds": [
    {
      "name": "FAHHHHHHHHHHHHHH",
      "url": "https://www.myinstants.com/media/sounds/fahhhhhhhhhhhhhh.mp3",
      "soundId": "fahhhhhhhhhhhhhh.mp3"
    },
    {
      "name": "VINE BOOM SOUND",
      "url": "https://www.myinstants.com/media/sounds/vine-boom.mp3",
      "soundId": "vine-boom.mp3"
    },
    {
      "name": "FAAAH",
      "url": "https://www.myinstants.com/media/sounds/faaah.mp3",
      "soundId": "faaah.mp3"
    },
    {
      "name": "Fart",
      "url": "https://www.myinstants.com/media/sounds/dry-fart.mp3",
      "soundId": "dry-fart.mp3"
    },
    {
      "name": "rizz sound effect",
      "url": "https://www.myinstants.com/media/sounds/rizz-sound-effect.mp3",
      "soundId": "rizz-sound-effect.mp3"
    },
    {
      "name": "Anime Wow",
      "url": "https://www.myinstants.com/media/sounds/anime-wow-sound-effect.mp3",
      "soundId": "anime-wow-sound-effect.mp3"
    },
    {
      "name": "Among Us role reveal sound",
      "url": "https://www.myinstants.com/media/sounds/among-us-role-reveal-sound.mp3",
      "soundId": "among-us-role-reveal-sound.mp3"
    },
    {
      "name": "Fahhh",
      "url": "https://www.myinstants.com/media/sounds/fahhh_KcgAXfs.mp3",
      "soundId": "fahhh_KcgAXfs.mp3"
    },
    {
      "name": "Chicken on tree screaming",
      "url": "https://www.myinstants.com/media/sounds/chicken-on-tree-screaming.mp3",
      "soundId": "chicken-on-tree-screaming.mp3"
    },
    {
      "name": "Your phone lingoging",
      "url": "https://www.myinstants.com/media/sounds/your-phone-lingoging.mp3",
      "soundId": "your-phone-lingoging.mp3"
    },
    {
      "name": "Michael Jackson Hee Hee",
      "url": "https://www.myinstants.com/media/sounds/michael-jackson-hee-hee.mp3",
      "soundId": "michael-jackson-hee-hee.mp3"
    },
    {
      "name": "rip my granny loud asf",
      "url": "https://www.myinstants.com/media/sounds/rip-my-granny-loud-asf.mp3",
      "soundId": "rip-my-granny-loud-asf.mp3"
    },
    {
      "name": "SpongeBob Fail",
      "url": "https://www.myinstants.com/media/sounds/spongebob-fail.mp3",
      "soundId": "spongebob-fail.mp3"
    },
    {
      "name": "Fart Button",
      "url": "https://www.myinstants.com/media/sounds/perfect-fart.mp3",
      "soundId": "perfect-fart.mp3"
    },
    {
      "name": "Bone Crack",
      "url": "https://www.myinstants.com/media/sounds/bone-crack.mp3",
      "soundId": "bone-crack.mp3"
    },
    {
      "name": "I've Got This FAAAAAAAAAHHHHH",
      "url": "https://www.myinstants.com/media/sounds/ive-got-this-faaaaaaaaahhhhh.mp3",
      "soundId": "ive-got-this-faaaaaaaaahhhhh.mp3"
    },
    {
      "name": "( ͠° ͟ʖ ͡°) sussy?",
      "url": "https://www.myinstants.com/media/sounds/deg-deg-sussy.mp3",
      "soundId": "deg-deg-sussy.mp3"
    },
    {
      "name": "Taco Bell Bong",
      "url": "https://www.myinstants.com/media/sounds/taco-bell-bong-sfx.mp3",
      "soundId": "taco-bell-bong-sfx.mp3"
    },
    {
      "name": "dun dun dunnnnnnnn",
      "url": "https://www.myinstants.com/media/sounds/dun-dun-dun-sound-effect-brass_8nFBccR.mp3",
      "soundId": "dun-dun-dun-sound-effect-brass_8nFBccR.mp3"
    },
    {
      "name": "Dexter meme",
      "url": "https://www.myinstants.com/media/sounds/dexter-meme.mp3",
      "soundId": "dexter-meme.mp3"
    },
    {
      "name": "Apple Pay",
      "url": "https://www.myinstants.com/media/sounds/applepay.mp3",
      "soundId": "applepay.mp3"
    },
    {
      "name": "Fears to Fathom Notification Sound",
      "url": "https://www.myinstants.com/media/sounds/fears-to-fathom-notification-sound.mp3",
      "soundId": "fears-to-fathom-notification-sound.mp3"
    },
    {
      "name": "BRUH",
      "url": "https://www.myinstants.com/media/sounds/movie_1.mp3",
      "soundId": "movie_1.mp3"
    },
    {
      "name": "romanceeeeeeeeeeeeee",
      "url": "https://www.myinstants.com/media/sounds/romanceeeeeeeeeeeeee.mp3",
      "soundId": "romanceeeeeeeeeeeeee.mp3"
    },
    {
      "name": "Hub Intro Sound",
      "url": "https://www.myinstants.com/media/sounds/hub-intro-sound.mp3",
      "soundId": "hub-intro-sound.mp3"
    },
    {
      "name": "yeah boiii i i i",
      "url": "https://www.myinstants.com/media/sounds/yeah-boiii-i-i-i.mp3",
      "soundId": "yeah-boiii-i-i-i.mp3"
    },
    {
      "name": "a few moments later sponge bob sfx fun",
      "url": "https://www.myinstants.com/media/sounds/a-few-moments-later-sponge-bob-sfx-fun.mp3",
      "soundId": "a-few-moments-later-sponge-bob-sfx-fun.mp3"
    },
    {
      "name": "Sad Violin (the meme one)",
      "url": "https://www.myinstants.com/media/sounds/tf_nemesis.mp3",
      "soundId": "tf_nemesis.mp3"
    },
    {
      "name": "Metal pipe clang",
      "url": "https://www.myinstants.com/media/sounds/metal-pipe-clang.mp3",
      "soundId": "metal-pipe-clang.mp3"
    },
    {
      "name": "Error SOUNDSS",
      "url": "https://www.myinstants.com/media/sounds/error_CDOxCYm.mp3",
      "soundId": "error_CDOxCYm.mp3"
    },
    {
      "name": "indian song",
      "url": "https://www.myinstants.com/media/sounds/indian-song.mp3",
      "soundId": "indian-song.mp3"
    },
    {
      "name": "What a good boy",
      "url": "https://www.myinstants.com/media/sounds/what-a-good-boy.mp3",
      "soundId": "what-a-good-boy.mp3"
    },
    {
      "name": "Smoke Detector Beep",
      "url": "https://www.myinstants.com/media/sounds/smoke-detector-beep.mp3",
      "soundId": "smoke-detector-beep.mp3"
    },
    {
      "name": "We are Charlie Kirk phone",
      "url": "https://www.myinstants.com/media/sounds/we-are-charlie-kirk-phone.mp3",
      "soundId": "we-are-charlie-kirk-phone.mp3"
    },
    {
      "name": "Звук фотоаппарата",
      "url": "https://www.myinstants.com/media/sounds/zvuk-fotoapparata.mp3",
      "soundId": "zvuk-fotoapparata.mp3"
    },
    {
      "name": "The Undertaker Bell",
      "url": "https://www.myinstants.com/media/sounds/undertakers-bell_2UwFCIe.mp3",
      "soundId": "undertakers-bell_2UwFCIe.mp3"
    }
  ]
}
```

---

## 25. POST `/api/backup`

- **Host**: `myinstantsbackup.zerody.one`
- **Method**: `POST`
- **Status**: `200`
- **Content-Type**: `application/json`
- **Body bytes**: `338`
- **Bearer auth required**: no
- **Captured at**: `2026-05-21T16:26:42.687Z`

### Response shape (recursive type tree)

```
{
  results: {
    gold-coins.mp3: string = "exists_status_200"
    notification_alert.mp3: string = "exists_status_200"
  }
  fileUrls: {
    gold-coins.mp3: string = "<81-char string>"
    notification_alert.mp3: string = "<89-char string>"
  }
  errors: {
  }
}
```

### Sample response (real data, full)

```json
{
  "results": {
    "gold-coins.mp3": "exists_status_200",
    "notification_alert.mp3": "exists_status_200"
  },
  "fileUrls": {
    "gold-coins.mp3": "https://b2files.zerody.one/file/tikfinity-prod-2/useruploads/22/ab/gold-coins.mp3",
    "notification_alert.mp3": "https://b2files.zerody.one/file/tikfinity-prod-2/useruploads/49/75/notification_alert.mp3"
  },
  "errors": {}
}
```

---

## Phụ lục A: Tất cả 228 unique endpoints (không chỉ /api/)

Catalogue đầy đủ kèm preview body từng endpoint (~120 widget HTML pages, socket.io handshake, OData, telemetry beacons đã loại):

- File: `routes-generated/tikfinity.zerody.four.merged.shapes.md`
- Raw JSON tooling-friendly: `routes-generated/tikfinity.zerody.four.merged.endpoints.json`
- Express router stub auto-gen (mount tạm vào index.js): `routes-generated/tikfinity.zerody.four.merged.js`

## Phụ lục B: Hosts mapping

Bundle gốc gọi 8 host khác nhau. Local clone phải rewrite hoặc proxy:

| Host gốc | Vai trò | Status local |
|---|---|---|
| `tikfinity.zerody.one` | Main APIs (162 endpoints) | ✅ Bundle rewrite → `localhost:5285` qua `middleware/index-html.js` |
| `tikfinity-auth-service.zerody.one` | Login + JWT mint | ⚠️ Stub local hoặc proxy 5194 |
| `tts.tikfinity.com` | TTS catalog + user + generate | ✅ Mock trong `blockScript.txt` (`tfHandleTtsTikfinityCom`) |
| `tikfinity-tts-api.zerody.one` | Alt TTS API path | ⚠️ Bundle có 2 đường gọi TTS, đường này chưa handle |
| `tikfinity-cws-{03,04,05}.zerody.one` | TikTok WebSocket per-region | ❌ Bundle's `connectorHost=""` đã disable |
| `myinstantsapi.zerody.one` | Sound library trending | ✅ `/myinstants-proxy/` |
| `myinstantsbackup.zerody.one` | Sound upload backup | ⚠️ Chưa handle |
| `ph.tikfinity.com` + gtag/sentry/featurebase | Telemetry | ✅ `shouldBlockUrl` chặn |

## Phụ lục C: 22 trường top-level của `/api/me` (most important endpoint)

`/api/me` là endpoint hydrate state chính (58 KB response). Bundle dùng nó để dựng MỌI thứ trong UI: topbar, sidebar, profile chip, widgets, modals. Một field thiếu hoặc sai type ở đây thường gây `settings.restore` reload loop hoặc UI lỗi không rõ nguyên nhân.

| Field | Type | Bundle dùng cho | Caching rule |
|---|---|---|---|
| `status` | number | error check (200=OK) | — |
| `message` | string | error display fallback | — |
| `channelId` | number | localStorage `setting_channelid` | — |
| `channel` | object (~46 fields) | topbar, profile chip, sidebar, isPro check | — |
| `channeluser` | object (~15 fields) | per-viewer state (totalAmount, etc.) | — |
| `profile` | object/null | active per-channel profile | — |
| `subscription` | object/null | isPro gate trên mọi widget | — |
| `userFeatures` | object | feature flags (`isPro`, `proInfo`) | — |
| `wsAuthToken` | string | Socket.IO authentication | **MUST cache per channelId** |
| `featureBaseToken` | string | feedback widget | **MUST cache per (channelId, channelName)** |
| `discordVerifyToken` | string | Discord connect | — |
| `discordHasProRole` | boolean | Discord Pro badge | — |
| `cookieAuth` | boolean | auth-bridge hint | — |
| `countryCode` | string | language flag topbar | — |
| `overloadSettings` | object | rate-limit config | — |
| `performanceDebugInfo` | object | metrics (noop ok) | — |
| `activePromotions` | array | promo banner | — |
| `mobileVoucherCode` | object/null | mobile voucher modal | — |
| `isTrialAvailable` | boolean | trial banner | — |
| `hasActiveTrial` | boolean | trial banner | — |
| `trialEnded` | boolean | trial banner | — |
| `trialInfo` | object/null | trial banner detail | — |

**Trap đã từng gặp** (xem [SKILL.md](../superpowers/skills/bundle-integration/SKILL.md#3-six-traps-that-recurrently-break-the-ui)):

- Mint `wsAuthToken` mới mỗi request → `iat` đổi → bundle thấy session change → reload loop
- Mint `featureBaseToken` không phụ thuộc `channelName` → switch profile → mismatch → loop
- Thiếu một field trong `channel.dynamicSettings` mà bundle cached → `settings.restore` POST lại → backend response không khớp → loop

## Phụ lục D: HAR captures dùng để tạo tài liệu này

| File | Size | Đóng góp |
|---|---:|---|
| `captures/tikfinity.zerody.one.har` | 64.6 MB | 136 unique endpoints sau dedupe |
| `captures/tikfinity.zerody.two.har` | 23.1 MB | +2 endpoints |
| `captures/tikfinity.zerody.three.har` | 317.1 MB | +36 endpoints |
| `captures/tikfinity.zerody.four.har` | 89.6 MB | +54 endpoints (gồm `/api/login`, `/api/updateSettings`, `/api/executeAction`, `/api/tts/generate`, `/api/voice/generate`) |

Mỗi capture mất ~3-5 phút thao tác Chrome DevTools + click qua các tính năng. Tổng effort capture: ~20-30 phút clicking.

## Phụ lục E: Files được sinh ra tự động

| File | Generated by | Vai trò |
|---|---|---|
| `docs/API_CONTRACTS.md` (file này) | `scripts/decompile/extract-contracts.js` | Shape + sample mỗi endpoint chính |
| `docs/BUNDLE_CALL_FLOW.md` | hand-written | Boot sequence, flow per feature |
| `routes-generated/*.merged.{js,shapes.md,endpoints.json}` | `scripts/decompile/merge-har.js` | 228-endpoint catalogue, Express stubs |
| `decompiled/{app,modules}/deobfuscated.js` | `npx webcrack downloads/combo/<file>.js -o decompiled/<name>/` | Readable Vue source 945 KB |
| `superpowers/skills/bundle-integration/SKILL.md` | hand-written | Skill agent đọc trước khi sửa code bundle-adjacent |

## Phụ lục F: Re-generate khi bundle update

Khi `downloads/combo/{app,modules}.js` thay đổi (TikFinity gốc push bundle mới), phải:

```bash
# 1. Capture HAR mới từ TikFinity gốc (tikfinity.zerody.one)
#    DevTools → Network → Preserve log + Disable cache → trigger features → Save all as HAR
mv ~/Downloads/tikfinity.zerody.one.har captures/

# 2. Re-merge & re-extract contracts
node --max-old-space-size=6144 scripts/decompile/merge-har.js
node scripts/decompile/extract-contracts.js

# 3. Re-decompile bundle
npx webcrack downloads/combo/modules.js -o decompiled/modules
npx webcrack downloads/combo/app.js -o decompiled/app

# 4. Verify
git diff docs/API_CONTRACTS.md     # field nào server gốc đã đổi shape?
git diff decompiled/modules/deobfuscated.js   # function nào bundle đã thêm?

# 5. Update local handlers theo diff
```

---

_File này auto-sinh từ HAR captures. Edit script `scripts/decompile/extract-contracts.js` để đổi format. Không edit file này trực tiếp — sẽ bị overwrite lần re-run kế._