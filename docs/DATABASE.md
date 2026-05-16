# TikFinity Clone — Database Design

SQLite via `better-sqlite3`. File: `<userData>/tikfinity-data/tikfinity.db` at runtime
(when packaged) or `backend-node/data/tikfinity.db` in dev.
Migrations: [backend-node/src/db/migrations/](../backend-node/src/db/migrations).
Schema applied via Knex at boot from `backend-node/src/index.js::bootstrapDb()`.

---

## 1. ERD tổng quan

```mermaid
erDiagram
    Channel ||--o| Subscription      : "1:1"
    Channel ||--o{ Profile           : "1:N"
    Channel ||--o{ DynamicSetting    : "1:N (key/value)"
    Channel ||--o{ Sound             : "1:N"
    Channel ||--o{ ActionItem        : "1:N"
    Channel ||--o{ ChannelModule     : "1:N (unique ChannelId+ModuleId)"
    Channel ||--o{ Transaction       : "1:N"
    Channel ||--o{ Notification      : "1:N"
    Channel ||--o{ Overlay           : "1:N"
    Channel ||--o{ Widget            : "1:N"
    Channel ||--o{ ChatCommand       : "1:N"
    Channel ||--o{ Goal              : "1:N"
    Channel ||--o{ TimerItem         : "1:N"
    RevokedToken }o..|| Channel      : "JTI blacklist (no FK)"

    Channel {
        int    ChannelId PK
        string ChannelName UK
        string Email UK
        string GoogleId UK_nullable
        string PasswordHash
        string Sub
        string AvatarUrl
        string Locale
        int    ProfileId
        bool   IsChatbotApproved
        bool   ChallengeRunning
        string ChallengeName
        string SignupAuthProvider
        string AffId
        string AgencyId
        datetime CreatedAt
        datetime UpdatedAt
        datetime LastLoginAt
        string LastLoginIp
        int    FailedLoginCount
        datetime LockedUntil
    }

    Subscription {
        int    Id PK
        int    ChannelId FK
        bool   IsPro
        string Plan
        bool   Active
        datetime ProExpireAt
        string ProExpireSetBy
        datetime CreatedAt
        datetime UpdatedAt
    }

    Profile {
        int    Id PK
        int    ChannelId FK
        string Name
        int    Sort
    }

    DynamicSetting {
        int    Id PK
        int    ChannelId FK
        string Key
        string Value
    }

    Sound {
        int    Id PK
        int    ChannelId FK
        string Name
        string FileName
        string Url
        int    Volume
        bool   Enabled
        int    Sort
        string Category
        datetime CreatedAt
    }

    ActionItem {
        int    Id PK
        int    ChannelId FK
        string Name
        string Type
        string TriggerValue
        string ConfigJson
        bool   Enabled
        int    Sort
        datetime CreatedAt
    }

    ChannelModule {
        int    Id PK
        int    ChannelId FK
        string ModuleId
        string Name
        bool   Enabled
        int    Sort
    }

    Transaction {
        int    Id PK
        int    ChannelId FK
        string TransactionId UK
        string Type
        decimal Amount
        string Currency
        string Status
        string PaymentMethod
        string PaymentProvider
        string ExternalId
        datetime CreatedAt
    }

    Notification {
        int    Id PK
        int    ChannelId FK
        string Subject
        string Body
        string Category
        string DataJson
        bool   IsRead
        bool   IsSeen
        string TransactionId
        datetime CreatedAt
    }

    Overlay {
        int    Id PK
        int    ChannelId FK
        string Name
        string Type
        string ConfigJson
        bool   Enabled
        int    Sort
        datetime CreatedAt
    }

    Widget {
        int    Id PK
        int    ChannelId FK
        string Name
        string Type
        string ConfigJson
        bool   Enabled
        int    Sort
        datetime CreatedAt
    }

    ChatCommand {
        int    Id PK
        int    ChannelId FK
        string Command
        string Response
        int    Cooldown
        bool   Enabled
        int    Sort
        datetime CreatedAt
    }

    Goal {
        int    Id PK
        int    ChannelId FK
        string Name
        string Type
        int    Target
        int    Current
        bool   Enabled
        datetime CreatedAt
    }

    TimerItem {
        int    Id PK
        int    ChannelId FK
        string Name
        int    IntervalSeconds
        string ActionJson
        bool   Enabled
        int    Sort
        datetime CreatedAt
    }

    RevokedToken {
        int    Id PK
        string Jti UK
        int    ChannelId
        datetime RevokedAt
        datetime ExpiresAt
    }
```

---

## 2. Bảng theo nhóm chức năng

### 2.1 Identity / Auth (cốt lõi)

| Table | Vai trò | Ghi chú |
|---|---|---|
| **Channel** | User account + profile streamer. PK: `ChannelId` | Unique: `ChannelName`, `Email` (filter `<> ''`), `GoogleId` (filter NOT NULL). Có lockout: `FailedLoginCount` + `LockedUntil` cho rate-limit login |
| **Subscription** | Pro/Free plan, expiry | 1:1 với Channel. Cascade delete |
| **RevokedToken** | JWT blacklist (logout) | Không FK Channel. Lookup theo `Jti` mỗi request ở [middleware/auth.js](../backend-node/src/middleware/auth.js). Index `ExpiresAt` để clean up |

### 2.2 Personalization

| Table | Vai trò |
|---|---|
| **Profile** | Streamer có nhiều profile cho từng kênh stream. Default `ProfileId=1` |
| **DynamicSetting** | Key-value generic: `tiktokname`, `points_currency`, `widget_xxx`, v.v. Unique `(ChannelId, Key)`. Value max 4000 char |
| **ChannelModule** | Bật/tắt module: `actions`, `tts`, `sounds`, `media`, `timers`, `commands`, `spotify`, `webhooks`, `overlays`. Unique `(ChannelId, ModuleId)` |

### 2.3 Streamer Tools

| Table | Vai trò |
|---|---|
| **ActionItem** | Trigger reactive: `Type` = `gift/like/follow/share/comment/subscribe`. `ConfigJson` chứa cấu hình hành động |
| **Sound** | Sound alert (file/url/volume/category) |
| **ChatCommand** | `!cmd` → `Response`, có `Cooldown` (giây) |
| **Goal** | Mục tiêu progress (`Type` = `follows/likes/shares/custom`) với `Current/Target` |
| **TimerItem** | Interval timer chạy `ActionJson` mỗi `IntervalSeconds` |
| **Overlay** | Overlay scene config |
| **Widget** | Widget config (chat, gift, wheel, …) — `ConfigJson` cho từng widget |

### 2.4 Billing / Notification

| Table | Vai trò |
|---|---|
| **Transaction** | Payment history. `TransactionId` UK (Guid). `Status` = `pending/completed/failed/refunded`. `PaymentProvider` = `stripe/vnpay/paypal/...` |
| **Notification** | In-app notification. `IsRead` vs `IsSeen` riêng biệt. `DataJson` payload tự do |

---

## 3. Indexes & Constraints (cấu hình ở [migrations/20260515000001_initial.js](../backend-node/src/db/migrations/20260515000001_initial.js))

| Bảng | Index | Loại |
|---|---|---|
| Channel | `GoogleId` | Unique (filter `IS NOT NULL`) |
| Channel | `Email` | Unique (filter `<> ''`) |
| Channel | `ChannelName` | Unique |
| RevokedToken | `Jti` (max 64) | Unique |
| RevokedToken | `ExpiresAt` | Index (cho clean up job) |
| DynamicSetting | `(ChannelId, Key)` | Unique composite |
| ChannelModule | `(ChannelId, ModuleId)` | Unique composite |
| Transaction | `TransactionId` | Unique |

**Cascade delete**: tất cả 1:N từ Channel → child tables đều `OnDelete(Cascade)`. Xoá Channel → xoá hết settings/sounds/actions/...

---

## 4. Migration history

| Migration | Date | Mô tả |
|---|---|---|
| `20260515000001_initial.js` | 2026-05-15 | Consolidated initial migration: all 16 tables + indexes + AuthHardening cols + ProfileId on per-profile tables (replaced 3 C# EF migrations during the Node port) |

Tự apply lúc boot bằng Knex: `knex.migrate.latest()` ở [index.js::bootstrapDb()](../backend-node/src/index.js).

---

## 5. Lifecycle dữ liệu

1. **Boot lần đầu**: SQLite tạo file `tikfinity.db`, Knex chạy migrations, [db/seed.js](../backend-node/src/db/seed.js) tạo default channel + welcome notifications
2. **Serial Key login** ([routes/key-auth.js](../backend-node/src/routes/key-auth.js)): proxy đến TikfinityServer ở 127.0.0.1:5194, sau đó upsert `Subscription` (Pro)
3. **Local JWT mint** ([services/jwt.js](../backend-node/src/services/jwt.js)): sinh access token (HS256, 7-day) có `jti` claim
4. **Logout** ([routes/auth.js](../backend-node/src/routes/auth.js)): insert `RevokedToken` với `Jti` của token hiện tại + `ExpiresAt` = exp claim
5. **Mỗi request authenticated**: middleware kiểm `IsRevoked(jti)` ([middleware/auth.js](../backend-node/src/middleware/auth.js))
6. **Settings change**: ghi vào `DynamicSetting` (key-value), cache merged JSON ở [services/widget-settings-cache.js](../backend-node/src/services/widget-settings-cache.js), broadcast Socket.IO event

---

## 6. Lưu ý vận hành

- **DB file** sống ở `<userData>/tikfinity-data/` (mỗi user Windows một bản). App update không đụng vào — installer chỉ ghi vào `Program Files`
- **Chưa có** bảng riêng cho user spend/ranking realtime — đang aggregate **trong RAM** ở [services/aggregates.js](../backend-node/src/services/aggregates.js) (`topGifters`, `topLikers`, `ranking`, …). Restart = reset
- **Chưa có** cleanup job cho `RevokedToken` — index `ExpiresAt` đã sẵn sàng nhưng cần background service xoá row có `ExpiresAt < now`
- `Transaction.Amount` lưu kiểu `TEXT` (workaround SQLite không có decimal native) — convert ở app layer
