# TikFinity Clone — Database Design

SQLite, EF Core 9. File: `tikfinity.db` (cạnh exe lúc runtime).
Migrations: [backend/Migrations/](../backend/Migrations).
Schema được EF auto-migrate lúc boot ([Program.cs:165](../backend/Program.cs#L165)).

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
| **RevokedToken** | JWT blacklist (logout) | Không FK Channel. Lookup theo `Jti` mỗi request ở [Program.cs:121-130](../backend/Program.cs#L121). Index `ExpiresAt` để clean up |

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

## 3. Indexes & Constraints (cấu hình ở [AppDbContext.cs:26-184](../backend/Data/AppDbContext.cs#L26))

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
| `20260317022209_InitialCreate_SQLite` | 2026-03-17 | Schema gốc |
| `20260422094051_AuthHardening_2026_04_22` | 2026-04-22 | Thêm `FailedLoginCount`, `LockedUntil`, `RevokedToken` table, hardening cho [LoginRateLimiter](../backend/Services/LoginRateLimiter.cs) |

Tự apply lúc boot: `db.Database.Migrate()` ([Program.cs:165](../backend/Program.cs#L165)).

---

## 5. Lifecycle dữ liệu

1. **Boot lần đầu**: SQLite tạo file `tikfinity.db`, EF chạy migrations, DB rỗng (chưa có channel nào)
2. **Register** ([AuthController:44](../backend/Controllers/AuthController.cs#L44)): tạo `Channel` + `Subscription` (free) + `Profile` default + 9 `ChannelModule` mặc định
3. **Login** ([AuthController:98](../backend/Controllers/AuthController.cs#L98)): kiểm `LockedUntil`, hash compare, reset `FailedLoginCount`. Sinh JWT có `jti` claim
4. **Logout** ([AuthController:175](../backend/Controllers/AuthController.cs#L175)): insert `RevokedToken` với `Jti` của token hiện tại + `ExpiresAt` = exp claim
5. **Mỗi request authenticated**: middleware kiểm `IsRevoked(jti)` ([TokenRevocationService](../backend/Services/TokenRevocationService.cs))
6. **Settings change**: ghi vào `DynamicSetting` (key-value), cache merged JSON ở [WidgetSettingsCache](../backend/Services/WidgetSettingsCache.cs), broadcast Socket.IO event

---

## 6. Lưu ý vận hành

- **DB file** đi kèm exe lúc runtime. Khi deploy lên server, mount volume giữ `tikfinity.db` để không mất data lúc redeploy
- **Chưa có** bảng riêng cho user spend/ranking realtime — đang aggregate **trong RAM** ở [TikTokBridgeService](../backend/Services/TikTokBridgeService.cs) (`_topGifters`, `_rankingUsers`, …). Restart = reset
- **Chưa có** cleanup job cho `RevokedToken` — index `ExpiresAt` đã sẵn sàng nhưng cần background service xoá row có `ExpiresAt < now`
- `Transaction.Amount` lưu kiểu `TEXT` (workaround SQLite không có decimal native) — convert ở app layer
