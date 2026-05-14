using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using TikFinityBackend.Data;
using TikFinityBackend.Hubs;
using TikFinityBackend.Models;
using TikFinityBackend.Services;

// --- Kill any existing process on port 5285 ---
try
{
    var netstat = new System.Diagnostics.Process
    {
        StartInfo = new System.Diagnostics.ProcessStartInfo("netstat", "-ano")
        { RedirectStandardOutput = true, UseShellExecute = false, CreateNoWindow = true }
    };
    netstat.Start();
    var output = netstat.StandardOutput.ReadToEnd();
    netstat.WaitForExit();
    foreach (var line in output.Split('\n'))
    {
        if (line.Contains(":5285") && line.Contains("LISTENING"))
        {
            var pid = line.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries).LastOrDefault();
            if (int.TryParse(pid, out var p) && p != Environment.ProcessId)
            {
                try { System.Diagnostics.Process.GetProcessById(p).Kill(); Console.WriteLine($"[BOOT] Killed old process on port 5285 (PID {p})"); }
                catch { }
            }
        }
    }
}
catch { }

var builder = WebApplication.CreateBuilder(args);

// --- Listen on loopback only by default (safer). Set TIKMAX_ALLOW_LAN=1 to
//     bind 0.0.0.0 for OBS-on-different-machine scenarios. ---
var allowLan = Environment.GetEnvironmentVariable("TIKMAX_ALLOW_LAN");
var bindHost = (allowLan == "1" || string.Equals(allowLan, "true", StringComparison.OrdinalIgnoreCase))
    ? "0.0.0.0"
    : "127.0.0.1";
builder.WebHost.UseUrls($"http://{bindHost}:5285");

// --- Frontend path resolution (handles dev, published exe, and Visual Studio) ---
string ResolveFrontendPath()
{
    // Allowed env override (deployment)
    var envPath = Environment.GetEnvironmentVariable("TIKFINITY_FRONTEND_PATH");
    if (!string.IsNullOrWhiteSpace(envPath) && File.Exists(Path.Combine(envPath, "index.html")))
        return Path.GetFullPath(envPath);

    var contentRoot = builder.Environment.ContentRootPath;
    var exeDir = AppContext.BaseDirectory;

    // Candidate locations, ordered from most-specific to fallback:
    var candidates = new[]
    {
        // Published self-contained exe: downloads/ sits next to the exe (build-app.bat layout)
        Path.Combine(exeDir, "downloads"),
        // Dev: dotnet run from backend/, downloads/ is sibling of backend/
        Path.Combine(contentRoot, "..", "downloads"),
        // VS: bin/Debug/net9.0 → walk up 4 levels to repo root
        Path.Combine(contentRoot, "..", "..", "..", "..", "downloads"),
        // Electron packaged: process.resourcesPath/downloads
        Path.Combine(exeDir, "..", "downloads"),
    };

    foreach (var candidate in candidates)
    {
        var resolved = Path.GetFullPath(candidate);
        if (File.Exists(Path.Combine(resolved, "index.html")))
            return resolved;
    }

    // Last resort: return the most expected location even if missing, so the warning is clear
    return Path.GetFullPath(Path.Combine(exeDir, "downloads"));
}

var frontendPath = ResolveFrontendPath();
Console.WriteLine($"[BOOT] Frontend path: {frontendPath}");
if (!File.Exists(Path.Combine(frontendPath, "index.html")))
    Console.WriteLine($"[BOOT][WARN] index.html not found at the resolved frontend path. Set TIKFINITY_FRONTEND_PATH or place 'downloads/' next to the executable.");

// --- EF Core + SQLite ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
           // Stream Profiles introduced ProfileId columns on Actions, Sounds,
           // Goals, ChatCommands, DynamicSettings. Schema applied via runtime
           // ALTER TABLE on first boot (see EnsureProfileColumns). EF model
           // diff would otherwise abort startup with PendingModelChangesWarning.
           .ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning)));

// --- Services ---
builder.Services.AddScoped<ChannelService>();
builder.Services.AddSingleton<JwtService>();
builder.Services.AddSingleton<PasswordHasher>();
builder.Services.AddSingleton<TokenRevocationService>();
builder.Services.AddSingleton<LoginRateLimiter>();

// --- Response compression ---
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.MimeTypes = new[]
    {
        "text/html", "text/css", "application/javascript", "application/json",
        "image/svg+xml", "text/plain", "application/xml"
    };
});

// --- Authentication ---
var jwtSecret = builder.Configuration["Jwt:Secret"];
if (string.IsNullOrWhiteSpace(jwtSecret) || jwtSecret.Length < 32)
{
    throw new InvalidOperationException(
        "Jwt:Secret is missing or too short (min 32 chars). " +
        "Configure it in appsettings.json, environment variable Jwt__Secret, or user secrets.");
}
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "TikFinityBackend";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "TikFinityFrontend";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(1)
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(token) && path.StartsWithSegments("/hub"))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            var jti = context.Principal?.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti)?.Value;
            var revocation = context.HttpContext.RequestServices.GetRequiredService<TokenRevocationService>();
            if (revocation.IsRevoked(jti))
            {
                context.Fail("Token has been revoked");
            }
            return Task.CompletedTask;
        }
    };
})
;

// --- CORS ---
// Default: only allow same-host origins (localhost/127.0.0.1). With AllowCredentials,
// browsers reject "*" origin anyway, so we whitelist localhost variants.
// Set TIKMAX_ALLOW_LAN=1 to additionally accept any origin (legacy behavior),
// which is needed for OBS Browser Source on a different machine.
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var allowLanCors = Environment.GetEnvironmentVariable("TIKMAX_ALLOW_LAN");
        var corsOpen = allowLanCors == "1" || string.Equals(allowLanCors, "true", StringComparison.OrdinalIgnoreCase);

        if (corsOpen)
        {
            policy.SetIsOriginAllowed(_ => true)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
        else
        {
            policy.SetIsOriginAllowed(origin =>
            {
                if (string.IsNullOrEmpty(origin)) return true; // same-origin / non-browser
                return origin.StartsWith("http://localhost:", StringComparison.OrdinalIgnoreCase)
                    || origin.StartsWith("http://127.0.0.1:", StringComparison.OrdinalIgnoreCase)
                    || origin.Equals("http://localhost", StringComparison.OrdinalIgnoreCase)
                    || origin.Equals("http://127.0.0.1", StringComparison.OrdinalIgnoreCase);
            })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        }
    });
});

// --- TikTok Bridge ---
builder.Services.AddSingleton<SocketManager>();
builder.Services.AddSingleton<WidgetSettingsCache>();
builder.Services.AddSingleton<ChatBotService>();
builder.Services.AddSingleton<PointsService>();
builder.Services.AddHttpClient("webhooks");
builder.Services.AddSingleton<WebhookService>();
builder.Services.AddSingleton<ObsService>();
builder.Services.AddSingleton<FeatureGate>();
builder.Services.AddHostedService<TikTokBridgeService>();

// --- HTTP client for license server ---
builder.Services.AddHttpClient();

// --- Controllers + SignalR ---
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddOpenApi();

var app = builder.Build();

// --- Auto-migrate database + get default channel info ---
int defaultChannelId = 1;
string defaultChannelName = "user";
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    // Stream Profiles: add ProfileId column to per-profile tables if missing.
    // Idempotent — checks PRAGMA table_info first to avoid SQLite's
    // ALTER-TABLE-ADD-COLUMN-already-exists error.
    EnsureProfileColumns(db);

    var ch = db.Channels.OrderBy(c => c.ChannelId).FirstOrDefault();
    if (ch != null) { defaultChannelId = ch.ChannelId; defaultChannelName = ch.ChannelName; }

    // Stream Profiles: preserve the user's last active profile across restarts.
    //
    // Previously we reset Channels.ProfileId → 1 on every boot to side-step a
    // suspected bundle bug (Pinia init hardcoded to streamProfileId: 1). That
    // was destructive — every restart silently moved the user back to profile
    // 1 regardless of what they last worked in.
    //
    // The renderer seed path (main.js refreshInitialApiState → preload.js
    // applySeed → localStorage 'setting_profileid') now feeds the bundle the
    // correct profileId from /api/me at boot, so the workaround is no longer
    // load-bearing.
    //
    // Residual risk: if the bundle's Pinia store really does ignore
    // localStorage and force streamProfileId: 1 at init, the dropdown will
    // briefly show "Profile 1" while DB has e.g. 2 — first profile-dropdown
    // click resynchronizes (POST /api/me writes back through MeController).
    // No data is lost in either case.
    if (ch != null && ch.ProfileId <= 0)
    {
        Console.WriteLine($"[BOOT] Normalizing invalid Channels.ProfileId {ch.ProfileId} -> 1");
        ch.ProfileId = 1;
        db.SaveChanges();
    }

    // Seed welcome notifications once per channel so the bell isn't empty on
    // first run. Real Tikfinity does the same — bell shows team announcements.
    if (ch != null && !db.Notifications.Any(n => n.ChannelId == ch.ChannelId))
    {
        var seedNotifs = new[]
        {
            new TikFinityBackend.Models.Notification
            {
                ChannelId = ch.ChannelId,
                Subject = "TikFinity Team",
                Category = "announcements",
                Body = "Chào mừng đến với TikFinity Local! Mọi tính năng Pro đã được mở khoá nhờ Serial Key của bạn. Hãy kết nối tài khoản TikTok LIVE và thử các widget overlay trong OBS.",
                DataJson = System.Text.Json.JsonSerializer.Serialize(new {
                    title = "✨ Chào mừng đến với TikFinity Local",
                    category = "announcements",
                    sender = "TikFinity Team",
                    avatarUrl = "/favicon.ico"
                }),
                CreatedAt = DateTime.UtcNow
            },
            new TikFinityBackend.Models.Notification
            {
                ChannelId = ch.ChannelId,
                Subject = "Hướng dẫn nhanh",
                Category = "tips",
                Body = "Mở OBS → thêm Browser source → URL: http://localhost:5285/widget/chat?cid=1 (hoặc cannon, gifts, firework, wheel...). Tất cả widget chạy real-time qua Socket.IO khi bạn LIVE.",
                DataJson = System.Text.Json.JsonSerializer.Serialize(new {
                    title = "📺 Cách thêm widget vào OBS",
                    category = "tips",
                    sender = "TikFinity Team",
                    avatarUrl = "/favicon.ico"
                }),
                CreatedAt = DateTime.UtcNow.AddMinutes(-1)
            },
            new TikFinityBackend.Models.Notification
            {
                ChannelId = ch.ChannelId,
                Subject = "Streamer.bot ready",
                Category = "announcements",
                Body = "Plugin Desktop API đang lắng nghe ở 127.0.0.1:21213. Cấu hình Streamer.bot trỏ tới đó là sub được mọi event TikTok (gift, follow, like, share...).",
                DataJson = System.Text.Json.JsonSerializer.Serialize(new {
                    title = "🔌 Streamer.bot plugin sẵn sàng",
                    category = "announcements",
                    sender = "TikFinity Team",
                    avatarUrl = "/favicon.ico"
                }),
                CreatedAt = DateTime.UtcNow.AddMinutes(-2)
            }
        };
        db.Notifications.AddRange(seedNotifs);
        db.SaveChanges();
        Console.WriteLine($"[BOOT] Seeded {seedNotifs.Length} welcome notifications for channel {ch.ChannelId}");
    }

    // Auto-seed default actions (Gift Alert, Like Alert, Sub Alert) if none exist
    var bootProfileId = ch != null && ch.ProfileId > 0 ? ch.ProfileId : 1;
    if (ch != null && !db.Actions.Any(a => a.ChannelId == ch.ChannelId && a.ProfileId == bootProfileId))
    {
        try
        {
            var exeDir2 = AppContext.BaseDirectory;
            var contentRoot2 = builder.Environment.ContentRootPath;
            var actionFileCandidates = new[]
            {
                Path.Combine(exeDir2, "downloads", "api", "rest", "action"),
                Path.Combine(contentRoot2, "..", "downloads", "api", "rest", "action"),
                Path.Combine(contentRoot2, "..", "..", "..", "..", "downloads", "api", "rest", "action"),
            };
            string? actionFilePath = null;
            foreach (var c in actionFileCandidates)
            {
                var r = Path.GetFullPath(c);
                if (File.Exists(r)) { actionFilePath = r; break; }
            }
            if (actionFilePath != null)
            {
                var actionJson = await File.ReadAllTextAsync(actionFilePath);
                var actionDoc = System.Text.Json.JsonDocument.Parse(actionJson);
                if (actionDoc.RootElement.TryGetProperty("actions", out var actionsEl))
                {
                    int sort = 0;
                    foreach (var a in actionsEl.EnumerateArray())
                    {
                        var aName = a.TryGetProperty("name", out var n) ? n.GetString() ?? "Action" : "Action";
                        db.Actions.Add(new TikFinityBackend.Models.ActionItem
                        {
                            ChannelId = ch.ChannelId,
                            ProfileId = ch.ProfileId > 0 ? ch.ProfileId : 1,
                            Name = aName,
                            Type = a.TryGetProperty("type", out var t) ? t.GetString() ?? "" : "",
                            ConfigJson = a.GetRawText(),
                            Enabled = true,
                            Sort = sort++,
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                    db.SaveChanges();
                    Console.WriteLine($"[BOOT] Seeded {sort} default actions for channel {ch.ChannelId}");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[BOOT][WARN] Could not seed default actions: {ex.Message}");
        }
    }

    // Ensure Follow Alert + default Events exist for first-run onboarding.
    // Events are stored as JSON string in DynamicSettings key "events".
    if (ch != null)
    {
        try
        {
            using var seedTx = db.Database.BeginTransaction();

            var hasFollowAlert = db.Actions.Any(a =>
              a.ChannelId == ch.ChannelId
              && a.ProfileId == bootProfileId
              && a.Name != null
              && a.Name.ToLower() == "follow alert");

            if (!hasFollowAlert)
            {
                var nextSort = db.Actions
                    .Where(a => a.ChannelId == ch.ChannelId && a.ProfileId == bootProfileId)
                    .Select(a => (int?)a.Sort)
                    .Max() ?? 0;

                db.Actions.Add(new TikFinityBackend.Models.ActionItem
                {
                    ChannelId = ch.ChannelId,
                    ProfileId = ch.ProfileId > 0 ? ch.ProfileId : 1,
                    Name = "Follow Alert",
                    Type = "manual",
                    ConfigJson = "{\"screenId\":1,\"duration\":5,\"text\":\"Thanks for following!\",\"animationUrl\":\"/assets/lotties/11438-starburst-animation.json\",\"enableFadeEffect\":true}",
                    Enabled = true,
                    Sort = nextSort + 1,
                    CreatedAt = DateTime.UtcNow
                });

                db.SaveChanges();
                Console.WriteLine($"[BOOT] Added default Follow Alert action for channel {ch.ChannelId}");
            }

            var eventsRow = db.DynamicSettings
                .FirstOrDefault(d => d.ChannelId == ch.ChannelId && d.ProfileId == bootProfileId && d.Key == "events");

            var currentEvents = eventsRow?.Value?.Trim();
            var shouldSeedEvents = string.IsNullOrWhiteSpace(currentEvents)
              || currentEvents == "[]"
              || currentEvents == "{}"
              || string.Equals(currentEvents, "null", StringComparison.OrdinalIgnoreCase);

            if (shouldSeedEvents)
            {
                var channelActions = db.Actions
                    .Where(a => a.ChannelId == ch.ChannelId && a.ProfileId == bootProfileId)
                    .Select(a => new { a.Id, a.Name })
                    .ToList();

                int? FindActionId(string name) => channelActions
                    .Where(a => string.Equals(a.Name, name, StringComparison.OrdinalIgnoreCase))
                    .Select(a => (int?)a.Id)
                    .FirstOrDefault();

                var subActionId = FindActionId("Sub Alert");
                var giftActionId = FindActionId("Gift Alert");
                var likeActionId = FindActionId("Like Alert");
                var followActionId = FindActionId("Follow Alert");

                if (subActionId.HasValue && giftActionId.HasValue && likeActionId.HasValue && followActionId.HasValue)
                {
                    var defaultEvents = new object[]
                    {
                        new
                        {
                            whichUserId = 1,
                            triggerTypeId = 10,
                            active = true,
                            actionIds = new[] { subActionId.Value },
                            actionRandomIds = Array.Empty<int>(),
                            id = Guid.NewGuid().ToString(),
                            isImported = true
                        },
                        new
                        {
                            whichUserId = 1,
                            triggerTypeId = 7,
                            active = true,
                            minLikesAmount = 100,
                            actionIds = new[] { likeActionId.Value },
                            actionRandomIds = Array.Empty<int>(),
                            id = Guid.NewGuid().ToString(),
                            isImported = true
                        },
                        new
                        {
                            whichUserId = 1,
                            triggerTypeId = 3,
                            active = true,
                            minBarsAmount = 1,
                            actionIds = new[] { giftActionId.Value },
                            actionRandomIds = Array.Empty<int>(),
                            id = Guid.NewGuid().ToString(),
                            isImported = true
                        },
                        new
                        {
                            whichUserId = 1,
                            triggerTypeId = 9,
                            active = true,
                            actionIds = new[] { followActionId.Value },
                            actionRandomIds = Array.Empty<int>(),
                            id = Guid.NewGuid().ToString(),
                            isImported = true
                        }
                    };

                    var eventsJson = System.Text.Json.JsonSerializer.Serialize(defaultEvents);

                    if (eventsRow == null)
                    {
                        db.DynamicSettings.Add(new TikFinityBackend.Models.DynamicSetting
                        {
                            ChannelId = ch.ChannelId,
                            ProfileId = ch.ProfileId > 0 ? ch.ProfileId : 1,
                            Key = "events",
                            Value = eventsJson
                        });
                    }
                    else
                    {
                        eventsRow.Value = eventsJson;
                    }

                    db.SaveChanges();
                    Console.WriteLine($"[BOOT] Seeded default events for channel {ch.ChannelId}");
                }
                else
                {
                    Console.WriteLine("[BOOT][WARN] Skip default event seed because one or more actions are missing");
                }
            }

            seedTx.Commit();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[BOOT][WARN] Could not seed onboarding action/events: {ex.Message}");
        }
    }
}

// =============================================
// Widget settings: centralized in WidgetSettingsCache service
// Initialize cache from DB on startup
// =============================================
var settingsCache = app.Services.GetRequiredService<WidgetSettingsCache>();
await settingsCache.Rebuild(defaultChannelId);

// =============================================
// MIDDLEWARE PIPELINE
// =============================================

app.UseDeveloperExceptionPage(); // Show detailed errors
app.UseWebSockets(); // Required for Socket.IO WebSocket transport
app.UseResponseCompression();

// Feature gating — block hidden/unstable routes early so they look like 404
app.UseMiddleware<UnstableFeatureMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// --- Socket.IO/Engine.IO v4 protocol handler ---
var pollingSessions = new System.Collections.Concurrent.ConcurrentDictionary<string, int>();
var socketManager = app.Services.GetRequiredService<SocketManager>();
var tikTokBridge = app.Services.GetServices<IHostedService>().OfType<TikTokBridgeService>().FirstOrDefault();

app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value ?? "";
    if (!path.StartsWith("/socket.io")) { await next(); return; }

    if (context.Request.Method == "OPTIONS")
    {
        context.Response.Headers["Access-Control-Allow-Origin"] = "*";
        context.Response.Headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS";
        context.Response.Headers["Access-Control-Allow-Headers"] = "*";
        context.Response.StatusCode = 200;
        return;
    }

    var query = context.Request.Query;
    var sid = query["sid"].FirstOrDefault();
    var transport = query["transport"].FirstOrDefault() ?? "polling";

    // === WebSocket transport ===
    if (transport == "websocket" && context.WebSockets.IsWebSocketRequest)
    {
        var ws = await context.WebSockets.AcceptWebSocketAsync();
        var buf = new byte[65536];
        var wsSid = $"ws-{Guid.NewGuid():N}"[..20];

        async Task WsSend(string data) =>
            await ws.SendAsync(Encoding.UTF8.GetBytes(data),
                System.Net.WebSockets.WebSocketMessageType.Text, true, CancellationToken.None);

        if (sid != null)
        {
            // === Upgrade from polling to WebSocket ===
            var result = await ws.ReceiveAsync(buf, CancellationToken.None);
            var msg = Encoding.UTF8.GetString(buf, 0, result.Count);
            if (msg == "2probe")
            {
                await WsSend("3probe");
                result = await ws.ReceiveAsync(buf, CancellationToken.None);
            }
            // Register upgraded connection in SocketManager
            socketManager.AddConnection(sid, ws);
        }
        else
        {
            // === Direct WebSocket connection ===
            await WsSend($"0{{\"sid\":\"{wsSid}\",\"upgrades\":[],\"pingInterval\":25000,\"pingTimeout\":20000,\"maxPayload\":1000000}}");

            var result = await ws.ReceiveAsync(buf, CancellationToken.None);
            if (result.MessageType == System.Net.WebSockets.WebSocketMessageType.Close) return;

            await WsSend($"40{{\"sid\":\"{wsSid}\"}}");

            // Register in SocketManager
            socketManager.AddConnection(wsSid, ws);

            // Always send authenticated loginResult ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â auth state is controlled by /api/me + localStorage
            // Check auth state from cookie
            var loginToken = context.Request.Cookies["tf_login_token"] ?? "";
            var isAuthenticated = !string.IsNullOrEmpty(loginToken) && loginToken.Length >= 10;

            var cid = isAuthenticated ? defaultChannelId : 0;
            var cname = isAuthenticated ? defaultChannelName : "";
            var ttConn = isAuthenticated && tikTokBridge?.IsConnectedToTikTok == true;
            var ttUser = isAuthenticated ? (tikTokBridge?.CurrentUsername ?? "") : "";
            var mergedWidgetSettings = settingsCache.GetJson();

            if (isAuthenticated)
            {
                var channelJson = $"{{\"channelId\":{cid},\"channelName\":\"{cname}\",\"isPro\":true,\"challengeRunning\":false,\"challengeName\":null,\"challengeStartAt\":null,\"isChatbotApproved\":false,\"catchApplied\":false,\"catchEnabled\":false,\"catchEnabledInGrid\":true,\"halvingLastExecutionAt\":null,\"proExpireAt\":null,\"proExpireSetBy\":null,\"banReason\":null,\"upgradeIntent\":null,\"trialStartedAt\":null,\"trialExpiresAt\":null,\"subscription\":{{\"isPro\":true,\"plan\":\"pro\",\"active\":true}},\"userFeatures\":{{\"isPro\":true,\"proInfo\":{{\"plan\":\"pro\",\"active\":true}}}}}}";
                var userFeaturesJson = $"{{\"isPro\":true,\"proInfo\":{{\"plan\":\"pro\",\"active\":true}}}}";
                var subscriptionJson = $"{{\"isPro\":true,\"plan\":\"pro\",\"active\":true}}";

                await WsSend($"42[\"loginResult\",{{\"status\":\"ok\",\"channelId\":{cid},\"channelName\":\"{cname}\",\"isPro\":true,\"authenticated\":true,\"channel\":{channelJson},\"userFeatures\":{userFeaturesJson},\"subscription\":{subscriptionJson}}}]");

                string[] initEvents =
                [
                    $"42[\"connected\",{{\"status\":\"ok\",\"channelId\":{cid},\"channelName\":\"{cname}\",\"isPro\":true,\"authenticated\":true,\"channel\":{channelJson},\"userFeatures\":{userFeaturesJson},\"subscription\":{subscriptionJson}}}]",
                    $"42[\"ready\",{{\"status\":\"ok\",\"channelId\":{cid}}}]",
                    $"42[\"init\",{{\"status\":\"ok\",\"channelId\":{cid},\"isPro\":true,\"userFeatures\":{userFeaturesJson},\"subscription\":{subscriptionJson}}}]",
                    $"42[\"welcome\",{{\"status\":\"ok\",\"channelId\":{cid},\"channelName\":\"{cname}\"}}]",
                    $"42[\"channelStatus\",{{\"connected\":{(ttConn ? "true" : "false")},\"channelId\":{cid},\"channelName\":\"{(ttConn && !string.IsNullOrEmpty(ttUser) ? ttUser : cname)}\",\"status\":\"{(ttConn ? "connected" : "disconnected")}\",\"tiktokUsername\":\"{ttUser}\"}}]",
                    $"42[\"status\",{{\"connected\":{(ttConn ? "true" : "false")},\"tiktok\":{(ttConn ? "true" : "false")},\"connecting\":false}}]",
                    "42[\"stats\",{\"viewers\":0,\"likes\":0,\"gifts\":0,\"diamonds\":0,\"followers\":0}]",
                    "42[\"globalStats\",{\"viewers\":0,\"channels\":0}]",
                    $"42[\"config\",{{\"debug\":false,\"channelId\":{cid}}}]",
                    $"42[\"widgetSettings\",{mergedWidgetSettings}]"
                ];
                foreach (var evt in initEvents)
                {
                    await WsSend(evt);
                    await Task.Delay(5);
                }
            }
            else
            {
                // Not logged in — send unauthenticated guest session
                var guestChannelJson = "{\"channelId\":0,\"channelName\":\"\",\"isPro\":false,\"dynamicSettings\":{},\"profiles\":[],\"subscription\":{\"isPro\":false,\"plan\":\"\",\"active\":false},\"userFeatures\":{\"isPro\":false,\"proInfo\":{\"plan\":\"\",\"active\":false}}}";
                var guestUserFeatures = "{\"isPro\":false,\"proInfo\":{\"plan\":\"\",\"active\":false}}";
                var guestSubscription = "{\"isPro\":false,\"plan\":\"\",\"active\":false}";

                await WsSend($"42[\"loginResult\",{{\"status\":\"ok\",\"channelId\":0,\"channelName\":\"\",\"isPro\":false,\"authenticated\":false,\"channel\":{guestChannelJson},\"userFeatures\":{guestUserFeatures},\"subscription\":{guestSubscription}}}]");

                string[] guestEvents =
                [
                    $"42[\"connected\",{{\"status\":\"ok\",\"channelId\":0,\"channelName\":\"\",\"isPro\":false,\"authenticated\":false,\"channel\":{guestChannelJson},\"userFeatures\":{guestUserFeatures},\"subscription\":{guestSubscription}}}]",
                    "42[\"ready\",{\"status\":\"ok\",\"channelId\":0}]",
                    $"42[\"init\",{{\"status\":\"ok\",\"channelId\":0,\"isPro\":false,\"userFeatures\":{guestUserFeatures},\"subscription\":{guestSubscription}}}]",
                    "42[\"welcome\",{\"status\":\"ok\",\"channelId\":0,\"channelName\":\"\"}]",
                    "42[\"channelStatus\",{\"connected\":false,\"channelId\":0,\"channelName\":\"\",\"status\":\"disconnected\",\"tiktokUsername\":\"\"}]",
                    "42[\"status\",{\"connected\":false,\"tiktok\":false,\"connecting\":false}]",
                    "42[\"stats\",{\"viewers\":0,\"likes\":0,\"gifts\":0,\"diamonds\":0,\"followers\":0}]",
                    "42[\"globalStats\",{\"viewers\":0,\"channels\":0}]",
                    "42[\"config\",{\"debug\":false,\"channelId\":0}]",
                    $"42[\"widgetSettings\",{mergedWidgetSettings}]"
                ];
                foreach (var evt in guestEvents)
                {
                    await WsSend(evt);
                    await Task.Delay(5);
                }
            }
        }

        var activeSid = sid ?? wsSid;

        // === Keep alive + event handling loop ===
        // Server must send ping ("2") every pingInterval ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â client responds with pong ("3")
        var pingCts = new CancellationTokenSource();
        _ = Task.Run(async () =>
        {
            try
            {
                while (!pingCts.Token.IsCancellationRequested && ws.State == System.Net.WebSockets.WebSocketState.Open)
                {
                    await Task.Delay(25000, pingCts.Token);
                    if (ws.State == System.Net.WebSockets.WebSocketState.Open)
                        await WsSend("2"); // Engine.IO ping
                }
            }
            catch { }
        });

        try
        {
            while (ws.State == System.Net.WebSockets.WebSocketState.Open)
            {
                var result2 = await ws.ReceiveAsync(buf, CancellationToken.None);
                if (result2.MessageType == System.Net.WebSockets.WebSocketMessageType.Close) break;
                var clientMsg = Encoding.UTF8.GetString(buf, 0, result2.Count);

                if (clientMsg == "2") // EIO ping ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ pong
                {
                    await WsSend("3");
                }
                else if (clientMsg.StartsWith("42"))
                {
                    // Parse Socket.IO event: 42[optionalAckId]["eventName",data]
                    var bracketIdx = clientMsg.IndexOf('[');
                    string? ackIdStr = null;

                    if (bracketIdx > 2)
                    {
                        ackIdStr = clientMsg[2..bracketIdx];
                        if (!int.TryParse(ackIdStr, out _)) ackIdStr = null;
                    }

                    // Parse the event
                    var jsonPart = clientMsg[bracketIdx..];
                    try
                    {
                        using var eventDoc = System.Text.Json.JsonDocument.Parse(jsonPart);
                        var arr = eventDoc.RootElement;
                        if (arr.ValueKind == System.Text.Json.JsonValueKind.Array && arr.GetArrayLength() >= 1)
                        {
                            var eventName = arr[0].GetString() ?? "";
                            var eventData = arr.GetArrayLength() > 1 ? arr[1] : default;

                            var isNoisyEvent = string.Equals(eventName, "reportWidgetState", StringComparison.OrdinalIgnoreCase)
                              || string.Equals(eventName, "distributeEvent", StringComparison.OrdinalIgnoreCase);
                            if (!isNoisyEvent)
                            {
                              Console.WriteLine($"[SIO] Event: {eventName}");
                            }

                            if (eventName == "login" && eventData.ValueKind == System.Text.Json.JsonValueKind.Object)
                            {
                                var requestedChannelId = defaultChannelId;
                                if (eventData.TryGetProperty("channelId", out var loginChannelId)
                                    && loginChannelId.ValueKind == System.Text.Json.JsonValueKind.Number
                                    && loginChannelId.TryGetInt32(out var parsedChannelId)
                                    && parsedChannelId > 0)
                                {
                                    requestedChannelId = parsedChannelId;
                                }

                                var appType = eventData.TryGetProperty("appType", out var at)
                                    ? at.GetString() ?? ""
                                    : "";

                                socketManager.UpdateClientContext(activeSid, requestedChannelId, appType);

                                if (string.Equals(appType, "widget", StringComparison.OrdinalIgnoreCase))
                                {
                                    var widgetSettingsJson = await settingsCache.GetJsonForChannel(requestedChannelId);
                                    await WsSend($"42[\"widgetSettings\",{widgetSettingsJson}]");

                                    // Push current goal/aggregate state immediately so the widget has
                                    // data to render before any new gift/follower event arrives. Without
                                    // this a freshly-loaded /widget/goal page sits empty until something
                                    // changes in the bridge.
                                    try { await tikTokBridge.EmitInitialGoalStatusAsync(); }
                                    catch (Exception emitEx) { Console.WriteLine($"[SIO] EmitInitialGoalStatus failed: {emitEx.Message}"); }

                                    // Same for top gifters / likers / ranking / stats / lastX —
                                    // freshly-opened topgifter/topliker/ranking/lastx widgets
                                    // would otherwise sit blank until the next gift/like event.
                                    try { await tikTokBridge.EmitInitialAggregateStateAsync(); }
                                    catch (Exception emitEx) { Console.WriteLine($"[SIO] EmitInitialAggregateState failed: {emitEx.Message}"); }
                                }
                            }

                            // Route TikTok connection events
                            await HandleClientEvent(eventName, eventData, tikTokBridge);
                        }
                    }
                    catch { /* Malformed event, ignore */ }

                    // Send ack if client expects callback
                    if (ackIdStr != null)
                    {
                        await WsSend($"43{ackIdStr}[{{\"status\":\"ok\"}}]");
                    }
                }
                else if (clientMsg == "41") // SIO disconnect
                {
                    break;
                }
            }
        }
        catch { /* Client disconnected */ }
        finally { pingCts.Cancel(); }

        socketManager.RemoveConnection(activeSid);
        if (sid != null) pollingSessions.TryRemove(sid, out _);
        return;
    }

    // === Polling transport ===
    context.Response.ContentType = "text/plain; charset=UTF-8";
    context.Response.Headers["Access-Control-Allow-Origin"] = "*";

    if (context.Request.Method == "GET" && string.IsNullOrEmpty(sid))
    {
        var newSid = Guid.NewGuid().ToString("N")[..20];
        pollingSessions[newSid] = 0;
        await context.Response.WriteAsync(
            $"0{{\"sid\":\"{newSid}\",\"upgrades\":[\"websocket\"],\"pingInterval\":25000,\"pingTimeout\":20000,\"maxPayload\":1000000}}");
        return;
    }

    if (context.Request.Method == "POST" && !string.IsNullOrEmpty(sid))
    {
        using var reader = new StreamReader(context.Request.Body);
        var body = await reader.ReadToEndAsync();

        if (body.StartsWith("42"))
        {
            var bracketIdx = body.IndexOf('[');
            string? ackIdStr = null;
            if (bracketIdx > 2)
            {
                ackIdStr = body[2..bracketIdx];
                if (!int.TryParse(ackIdStr, out _)) ackIdStr = null;
            }
            // Parse and handle events from polling too
            var jsonPart = body[bracketIdx..];
            try
            {
                using var eventDoc = System.Text.Json.JsonDocument.Parse(jsonPart);
                var arr = eventDoc.RootElement;
                if (arr.ValueKind == System.Text.Json.JsonValueKind.Array && arr.GetArrayLength() >= 1)
                {
                    var eventName = arr[0].GetString() ?? "";
                    var eventData = arr.GetArrayLength() > 1 ? arr[1] : default;
                    var isNoisyPollingEvent = string.Equals(eventName, "reportWidgetState", StringComparison.OrdinalIgnoreCase)
                      || string.Equals(eventName, "distributeEvent", StringComparison.OrdinalIgnoreCase);
                    if (!isNoisyPollingEvent)
                    {
                      Console.WriteLine($"[SIO-Poll] Event: {eventName}");
                    }
                    await HandleClientEvent(eventName, eventData, tikTokBridge);
                }
            }
            catch { }
        }

        await context.Response.WriteAsync("ok");
        return;
    }

    if (context.Request.Method == "GET" && !string.IsNullOrEmpty(sid))
    {
        var phase = pollingSessions.GetOrAdd(sid, 0);
        var sep = "\x1e";

        if (phase == 0)
        {
            pollingSessions[sid] = 1;

            // Check auth state from cookie (polling) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â auth state controlled by /api/me + localStorage
            var pLoginToken = context.Request.Cookies["tf_login_token"] ?? "";
            var pIsAuth = !string.IsNullOrEmpty(pLoginToken) && pLoginToken.Length >= 10;

            var pCid = pIsAuth ? defaultChannelId : 0;
            var pCname = pIsAuth ? defaultChannelName : "";
            var pTtConn = pIsAuth && tikTokBridge?.IsConnectedToTikTok == true;
            var pTtUser = pIsAuth ? (tikTokBridge?.CurrentUsername ?? "") : "";
            var pMergedSettings = settingsCache.GetJson();

            string payload;
            if (pIsAuth)
            {
                var pChannelJson = $"{{\"channelId\":{pCid},\"channelName\":\"{pCname}\",\"isPro\":true,\"challengeRunning\":false,\"challengeName\":null,\"challengeStartAt\":null,\"isChatbotApproved\":false,\"catchApplied\":false,\"catchEnabled\":false,\"catchEnabledInGrid\":true,\"halvingLastExecutionAt\":null,\"proExpireAt\":null,\"proExpireSetBy\":null,\"banReason\":null,\"upgradeIntent\":null,\"trialStartedAt\":null,\"trialExpiresAt\":null,\"subscription\":{{\"isPro\":true,\"plan\":\"pro\",\"active\":true}},\"userFeatures\":{{\"isPro\":true,\"proInfo\":{{\"plan\":\"pro\",\"active\":true}}}}}}";
                var pUserFeaturesJson = $"{{\"isPro\":true,\"proInfo\":{{\"plan\":\"pro\",\"active\":true}}}}";
                var pSubscriptionJson = $"{{\"isPro\":true,\"plan\":\"pro\",\"active\":true}}";
                payload = $"40{{\"sid\":\"{sid}\"}}"
                    + sep + $"42[\"loginResult\",{{\"status\":\"ok\",\"channelId\":{pCid},\"channelName\":\"{pCname}\",\"isPro\":true,\"authenticated\":true,\"channel\":{pChannelJson},\"userFeatures\":{pUserFeaturesJson},\"subscription\":{pSubscriptionJson}}}]"
                    + sep + $"42[\"connected\",{{\"status\":\"ok\",\"channelId\":{pCid},\"channelName\":\"{pCname}\",\"isPro\":true,\"authenticated\":true,\"channel\":{pChannelJson},\"userFeatures\":{pUserFeaturesJson},\"subscription\":{pSubscriptionJson}}}]"
                    + sep + $"42[\"ready\",{{\"status\":\"ok\",\"channelId\":{pCid}}}]"
                    + sep + $"42[\"init\",{{\"status\":\"ok\",\"channelId\":{pCid},\"isPro\":true,\"userFeatures\":{pUserFeaturesJson},\"subscription\":{pSubscriptionJson}}}]"
                    + sep + $"42[\"welcome\",{{\"status\":\"ok\",\"channelId\":{pCid},\"channelName\":\"{pCname}\"}}]"
                    + sep + $"42[\"channelStatus\",{{\"connected\":{(pTtConn ? "true" : "false")},\"channelId\":{pCid},\"channelName\":\"{(pTtConn && !string.IsNullOrEmpty(pTtUser) ? pTtUser : pCname)}\",\"status\":\"{(pTtConn ? "connected" : "disconnected")}\",\"tiktokUsername\":\"{pTtUser}\"}}]"
                    + sep + $"42[\"status\",{{\"connected\":{(pTtConn ? "true" : "false")},\"tiktok\":{(pTtConn ? "true" : "false")},\"connecting\":false}}]"
                    + sep + "42[\"stats\",{\"viewers\":0,\"likes\":0,\"gifts\":0,\"diamonds\":0,\"followers\":0}]"
                    + sep + "42[\"globalStats\",{\"viewers\":0,\"channels\":0}]"
                    + sep + $"42[\"config\",{{\"debug\":false,\"channelId\":{pCid}}}]"
                    + sep + $"42[\"widgetSettings\",{pMergedSettings}]";
            }
            else
            {
                var pGuestChannel = "{\"channelId\":0,\"channelName\":\"\",\"isPro\":false,\"dynamicSettings\":{},\"profiles\":[],\"subscription\":{\"isPro\":false,\"plan\":\"\",\"active\":false},\"userFeatures\":{\"isPro\":false,\"proInfo\":{\"plan\":\"\",\"active\":false}}}";
                var pGuestFeatures = "{\"isPro\":false,\"proInfo\":{\"plan\":\"\",\"active\":false}}";
                var pGuestSub = "{\"isPro\":false,\"plan\":\"\",\"active\":false}";
                payload = $"40{{\"sid\":\"{sid}\"}}"
                    + sep + $"42[\"loginResult\",{{\"status\":\"ok\",\"channelId\":0,\"channelName\":\"\",\"isPro\":false,\"authenticated\":false,\"channel\":{pGuestChannel},\"userFeatures\":{pGuestFeatures},\"subscription\":{pGuestSub}}}]"
                    + sep + $"42[\"connected\",{{\"status\":\"ok\",\"channelId\":0,\"channelName\":\"\",\"isPro\":false,\"authenticated\":false,\"channel\":{pGuestChannel},\"userFeatures\":{pGuestFeatures},\"subscription\":{pGuestSub}}}]"
                    + sep + "42[\"ready\",{\"status\":\"ok\",\"channelId\":0}]"
                    + sep + $"42[\"init\",{{\"status\":\"ok\",\"channelId\":0,\"isPro\":false,\"userFeatures\":{pGuestFeatures},\"subscription\":{pGuestSub}}}]"
                    + sep + "42[\"welcome\",{\"status\":\"ok\",\"channelId\":0,\"channelName\":\"\"}]"
                    + sep + "42[\"channelStatus\",{\"connected\":false,\"channelId\":0,\"channelName\":\"\",\"status\":\"disconnected\",\"tiktokUsername\":\"\"}]"
                    + sep + "42[\"status\",{\"connected\":false,\"tiktok\":false,\"connecting\":false}]"
                    + sep + "42[\"stats\",{\"viewers\":0,\"likes\":0,\"gifts\":0,\"diamonds\":0,\"followers\":0}]"
                    + sep + "42[\"globalStats\",{\"viewers\":0,\"channels\":0}]"
                    + sep + "42[\"config\",{\"debug\":false,\"channelId\":0}]"
                    + sep + $"42[\"widgetSettings\",{pMergedSettings}]";
            }
            await context.Response.WriteAsync(payload);
        }
        else
        {
            await context.Response.WriteAsync("6");
        }
        return;
    }

    context.Response.StatusCode = 200;
    await context.Response.WriteAsync("ok");
});

// --- Handle client Socket.IO events (TikTok connect/disconnect, etc.) ---
static async Task HandleClientEvent(string eventName, System.Text.Json.JsonElement eventData, TikTokBridgeService? bridge)
{
    if (bridge == null) return;

    // The frontend sends various event names (possibly obfuscated).
    // We match common patterns for TikTok connection events.
    // Also handle explicit REST-style events.
    var nameLower = eventName.ToLowerInvariant();

    if (nameLower == "distributeevent")
    {
      if (TryExtractDistributedEvent(eventData, out var nestedEventName, out var nestedPayloadJson))
      {
        await bridge.BroadcastWidgetEventRaw(nestedEventName, nestedPayloadJson);
      }
      return;
    }

    // Connect to TikTok - match various possible event names
    if (nameLower.Contains("settiktok") || nameLower.Contains("connecttiktok") ||
        nameLower.Contains("setlive") || nameLower.Contains("connectlive") ||
        nameLower == "connect" || nameLower == "setusername")
    {
        var username = TryExtractUsername(eventData);
        if (!string.IsNullOrEmpty(username))
        {
            await bridge.ConnectToTikTok(username);
            return;
        }
    }

    // Disconnect from TikTok
    if (nameLower.Contains("disconnecttiktok") || nameLower.Contains("disconnectlive") ||
        nameLower == "disconnect" || nameLower == "stoplive")
    {
        await bridge.DisconnectFromTikTok();
        return;
    }
}

  static bool TryExtractDistributedEvent(System.Text.Json.JsonElement data, out string eventName, out string payloadJson)
  {
    eventName = string.Empty;
    payloadJson = "{}";

    if (data.ValueKind != System.Text.Json.JsonValueKind.Object)
    {
      return false;
    }

    foreach (var eventNameKey in new[] { "eventName", "event", "name", "type" })
    {
      if (data.TryGetProperty(eventNameKey, out var candidate)
        && candidate.ValueKind == System.Text.Json.JsonValueKind.String)
      {
        var value = candidate.GetString();
        if (!string.IsNullOrWhiteSpace(value) && IsSafeSocketEventName(value))
        {
          eventName = value;
          break;
        }
      }
    }

    if (string.IsNullOrWhiteSpace(eventName))
    {
      return false;
    }

    foreach (var payloadKey in new[] { "data", "payload", "eventData", "args" })
    {
      if (data.TryGetProperty(payloadKey, out var payloadCandidate))
      {
        payloadJson = payloadCandidate.ValueKind == System.Text.Json.JsonValueKind.Undefined
          ? "{}"
          : payloadCandidate.GetRawText();
        return true;
      }
    }

    payloadJson = "{}";
    return true;
  }

  static bool IsSafeSocketEventName(string eventName)
  {
    if (string.IsNullOrWhiteSpace(eventName) || eventName.Length > 128)
    {
      return false;
    }

    foreach (var c in eventName)
    {
      var isAllowed = (c >= 'a' && c <= 'z')
        || (c >= 'A' && c <= 'Z')
        || (c >= '0' && c <= '9')
        || c == ':' || c == '_' || c == '-' || c == '.';

      if (!isAllowed)
      {
        return false;
      }
    }

    return true;
  }

static void EnsureProfileColumns(TikFinityBackend.Data.AppDbContext db)
{
    // SQLite-only: add ProfileId column to per-profile tables when missing.
    var tables = new[] { "Actions", "Sounds", "Goals", "ChatCommands", "DynamicSettings" };
    foreach (var table in tables)
    {
        try
        {
            var hasColumn = false;
            using (var cmd = db.Database.GetDbConnection().CreateCommand())
            {
                if (db.Database.GetDbConnection().State != System.Data.ConnectionState.Open)
                    db.Database.GetDbConnection().Open();
                cmd.CommandText = $"PRAGMA table_info(\"{table}\")";
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    if (string.Equals(reader.GetString(1), "ProfileId", StringComparison.Ordinal))
                    {
                        hasColumn = true;
                        break;
                    }
                }
            }
            if (!hasColumn)
            {
                db.Database.ExecuteSqlRaw($"ALTER TABLE \"{table}\" ADD COLUMN \"ProfileId\" INTEGER NOT NULL DEFAULT 1");
                Console.WriteLine($"[BOOT] Added ProfileId column to {table}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[BOOT][WARN] EnsureProfileColumns({table}) failed: {ex.Message}");
        }
    }

    // DynamicSettings: drop legacy unique(ChannelId, Key) index and recreate as
    // unique(ChannelId, ProfileId, Key). Without this, saving the same setting
    // key in two different profiles hits a UNIQUE constraint violation.
    try
    {
        var hasOldIndex = false;
        using (var cmd = db.Database.GetDbConnection().CreateCommand())
        {
            cmd.CommandText = "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='DynamicSettings' AND name='IX_DynamicSettings_ChannelId_Key'";
            var r = cmd.ExecuteScalar();
            hasOldIndex = r != null;
        }
        if (hasOldIndex)
        {
            db.Database.ExecuteSqlRaw("DROP INDEX IF EXISTS \"IX_DynamicSettings_ChannelId_Key\"");
            Console.WriteLine("[BOOT] Dropped legacy index IX_DynamicSettings_ChannelId_Key");
        }
        var hasNewIndex = false;
        using (var cmd = db.Database.GetDbConnection().CreateCommand())
        {
            cmd.CommandText = "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='DynamicSettings' AND name='IX_DynamicSettings_ChannelId_ProfileId_Key'";
            var r = cmd.ExecuteScalar();
            hasNewIndex = r != null;
        }
        if (!hasNewIndex)
        {
            db.Database.ExecuteSqlRaw("CREATE UNIQUE INDEX \"IX_DynamicSettings_ChannelId_ProfileId_Key\" ON \"DynamicSettings\" (\"ChannelId\", \"ProfileId\", \"Key\")");
            Console.WriteLine("[BOOT] Created index IX_DynamicSettings_ChannelId_ProfileId_Key");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[BOOT][WARN] DynamicSettings index migration failed: {ex.Message}");
    }
}

static string? TryExtractUsername(System.Text.Json.JsonElement data)
{
    if (data.ValueKind == System.Text.Json.JsonValueKind.String)
        return data.GetString();

    if (data.ValueKind == System.Text.Json.JsonValueKind.Object)
    {
        // Try common field names
        foreach (var field in new[] { "username", "uniqueId", "tiktokUsername", "tiktok_username", "user", "name", "channelName" })
        {
            if (data.TryGetProperty(field, out var val) && val.ValueKind == System.Text.Json.JsonValueKind.String)
            {
                var s = val.GetString();
                if (!string.IsNullOrEmpty(s)) return s;
            }
        }
    }

    return null;
}

// --- Request logging (non-static) ---
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value ?? "";
  var isTikTokStatusPoll = string.Equals(path, "/api/tiktok/status", StringComparison.OrdinalIgnoreCase);
    if (!path.StartsWith("/socket.io") &&
        !path.StartsWith("/combo") && !path.StartsWith("/js/") && !path.StartsWith("/css/") &&
        !path.StartsWith("/img/") && !path.StartsWith("/fa/") && !path.StartsWith("/dx/") &&
        !path.StartsWith("/vue/") && !path.StartsWith("/widget/") && !path.StartsWith("/assets/") &&
    !path.StartsWith("/config/") && path != "/" && path != "/favicon.ico" && !isTikTokStatusPoll)
    {
        Console.WriteLine($"[REQ] {context.Request.Method} {path} {context.Request.QueryString}");
    }
    await next();
});

// --- Block noise (sentry, analytics, ads) ---
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value ?? "";
    if (path.StartsWith("/2l68") || path.StartsWith("/g/") || path == "/g" ||
        path.StartsWith("/pagead") || path.StartsWith("/cdn-cgi") ||
        path.StartsWith("/sentry") || path.StartsWith("/rum"))
    {
        context.Response.StatusCode = 200;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("[]");
        return;
    }
    var host = context.Request.Host.Host;
    if (host.Contains("sentry") || host.Contains("contentsquare"))
    {
        context.Response.StatusCode = 200;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("[]");
        return;
    }
    await next();
});

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// All API endpoints are now handled by controllers (reading from DB).
// No cached JSON middleware needed.

// --- API controllers (only reached for authenticated users or non-cached endpoints) ---
app.MapControllers();
app.MapHub<TikFinityHub>("/hub/tikfinity");

// --- Health check ---
app.MapGet("/api/health", () => new { status = "ok", service = "TikFinity Backend", version = "1.0.0" });

// Legacy widget avatar fallback path used by userinfo and a few old overlays.
// Resolve avatar from live TikTok caches when possible, else serve nothumb.
app.MapGet("/img/user/{channelId}/{userId}", (
  string channelId,
  string userId,
  HttpContext context) =>
{
  var bridgeService = context.RequestServices
    .GetServices<IHostedService>()
    .OfType<TikTokBridgeService>()
    .FirstOrDefault();

  if (bridgeService is null)
  {
    return Results.NotFound();
  }

  var avatarUrl = bridgeService.GetProfilePictureUrlByUserId(userId);
  if (!string.IsNullOrWhiteSpace(avatarUrl) &&
    Uri.TryCreate(avatarUrl, UriKind.Absolute, out var uri) &&
    (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
  {
    return Results.Redirect(avatarUrl, permanent: false);
  }

  var nothumbPath = Path.Combine(frontendPath, "img", "nothumb.webp");
  if (File.Exists(nothumbPath))
  {
    context.Response.Headers.CacheControl = "public, max-age=3600";
    return Results.File(nothumbPath, "image/webp");
  }

  return Results.NotFound();
});

// --- Boot endpoints the bundle's setAppConfig() expects ---
// /appconfig is normally skipped (tfPageloadData.appConfig exists in index.html),
// but serve empty JSON as safety net so jQuery doesn't get HTML from SPA fallback.
app.MapGet("/appconfig", () => Results.Json(new { modules = Array.Empty<object>(), languages = Array.Empty<object>() }));
// /appinit returns 404 on real site too, but our SPA fallback would serve HTML.
app.MapGet("/appinit", () => Results.Json(new { locale = "en" }));

// --- MyInstants proxy (forward to zerody's myinstants API locally) ---
app.Map("/myinstants-proxy/{**path}", async (string path, HttpContext ctx) =>
{
    using var http = new HttpClient();
    http.Timeout = TimeSpan.FromSeconds(10);
    http.DefaultRequestHeaders.Add("User-Agent", "TikFinity/1.0");
    var qs = ctx.Request.QueryString;
    var url = $"https://myinstantsapi.zerody.one/{path}{qs}";
    try
    {
        Console.WriteLine($"[MyInstants Proxy] {url}");
        var resp = await http.GetAsync(url);
        var body = await resp.Content.ReadAsStringAsync();
        ctx.Response.ContentType = resp.Content.Headers.ContentType?.ToString() ?? "application/json";
        ctx.Response.StatusCode = (int)resp.StatusCode;
        await ctx.Response.WriteAsync(body);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[MyInstants Proxy] Error: {ex.Message}");
        ctx.Response.StatusCode = 502;
        await ctx.Response.WriteAsJsonAsync(new { status = 502, message = "Proxy error", error = ex.Message });
    }
});

// --- API fallback for any remaining unhandled API paths ---
app.MapFallback("/api/{**path}", async (string path, HttpContext context, AppDbContext db, ILoggerFactory loggerFactory) =>
{
    var logger = loggerFactory.CreateLogger("ApiFallback");
    logger.LogWarning("[API Fallback] Unhandled route: /api/{Path}", path);

    var claimChannelId = context.User?.FindFirst("channelId")?.Value;
    Channel? channel = null;
    if (int.TryParse(claimChannelId, out var authenticatedChannelId) && authenticatedChannelId > 0)
    {
        channel = await db.Channels
            .Include(c => c.Subscription)
            .Include(c => c.Profiles)
            .Include(c => c.DynamicSettings)
            .FirstOrDefaultAsync(c => c.ChannelId == authenticatedChannelId);
    }

    var channelId = channel?.ChannelId ?? 0;
    var channelName = channel?.ChannelName ?? "";
    var isPro = channel?.Subscription?.IsPro ?? (channelId > 0);
    var locale = channel?.Locale ?? "VN";
    var tiktokUsername = "";
    var dynamicSettings = channel?.DynamicSettings?
        .ToDictionary(x => x.Key, x => x.Value ?? "", StringComparer.OrdinalIgnoreCase)
        ?? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

    if (dynamicSettings.TryGetValue("setting_tiktokname", out var storedTikTokName))
    {
        tiktokUsername = storedTikTokName ?? "";
    }

    var safeChannel = new
    {
        channelId = channelId,
        channelName = string.IsNullOrEmpty(tiktokUsername) ? channelName : tiktokUsername,
        accountChannelName = channelName,
        tiktokUsername = tiktokUsername,
        channelSignature = channel?.ChannelSignature ?? "",
        email = channel?.Email ?? "",
        locale = locale,
        dynamicSettings = dynamicSettings,
        dynamicProfileSettings = Array.Empty<object>(),
        challengeRunning = channel?.ChallengeRunning ?? false,
        challengeName = channel?.ChallengeName,
        challengeStartAt = channel?.ChallengeStartAt,
        isChatbotApproved = channel?.IsChatbotApproved ?? false,
        catchApplied = false,
        catchEnabled = false,
        catchEnabledInGrid = true,
        halvingLastExecutionAt = (DateTime?)null,
        proExpireAt = (DateTime?)null,
        proExpireSetBy = (string?)null,
        banReason = (string?)null,
        upgradeIntent = (string?)null,
        trialStartedAt = (DateTime?)null,
        trialExpiresAt = (DateTime?)null,
        profiles = channel?.Profiles
            .Select(p => new { p.Id, p.Name, p.Sort })
            .ToArray() ?? Array.Empty<object>()
    };

    return Results.Json(new
    {
        status = 200,
        message = "OK",
        channelId = channelId,
        channelName = channelName,
        accountChannelName = channelName,
        tiktokUsername = tiktokUsername,
        isPro = isPro,
        challengeRunning = channel?.ChallengeRunning ?? false,
        channel = safeChannel,
        userFeatures = new { isPro = isPro, proInfo = new { plan = isPro ? "pro" : "free", active = isPro } },
        subscription = new { isPro = isPro, plan = isPro ? "pro" : "free", active = isPro },
        value = Array.Empty<object>(),
        items = Array.Empty<object>(),
        results = Array.Empty<object>(),
        list = Array.Empty<object>(),
        sounds = Array.Empty<object>(),
        actions = Array.Empty<object>(),
        triggers = Array.Empty<object>(),
        events = Array.Empty<object>(),
        gifts = Array.Empty<object>(),
        emotes = Array.Empty<object>(),
        channels = Array.Empty<object>(),
        users = Array.Empty<object>(),
        overlays = Array.Empty<object>(),
        widgets = Array.Empty<object>(),
        commands = Array.Empty<object>(),
        goals = Array.Empty<object>(),
        voices = Array.Empty<object>(),
        data = Array.Empty<object>(),
        profiles = Array.Empty<object>(),
        notifications = Array.Empty<object>(),
        dynamicProfileSettings = Array.Empty<object>(),
        payloads = Array.Empty<object>(),
        result = Array.Empty<object>(),
        item = Array.Empty<object>(),
        payload = Array.Empty<object>(),
        records = Array.Empty<object>(),
        features = Array.Empty<object>(),
        config = new { },
        total = 0,
        count = 0
    });
});

// =============================================
// FRONTEND SERVING - IN-MEMORY CACHE (like Node.js start_server.js)
// =============================================

// Pre-load ALL frontend files into memory at startup (same as Node.js Map cache)
var memoryCache = new Dictionary<string, byte[]>(StringComparer.OrdinalIgnoreCase);
var bootStart = DateTime.Now;

void PreloadFiles(string dir, string prefix)
{
    if (!Directory.Exists(dir)) return;
    foreach (var f in Directory.GetFiles(dir))
    {
        var key = "/" + (string.IsNullOrEmpty(prefix) ? Path.GetFileName(f) : prefix + "/" + Path.GetFileName(f));
        try { memoryCache[key] = File.ReadAllBytes(f); } catch { }
    }
    foreach (var d in Directory.GetDirectories(dir))
    {
        var dirName = Path.GetFileName(d);
        if (dirName == "api") continue; // API cache handled separately
        var sub = string.IsNullOrEmpty(prefix) ? dirName : prefix + "/" + dirName;
        PreloadFiles(d, sub);
    }
}
PreloadFiles(frontendPath, "");
var bootMs = (DateTime.Now - bootStart).TotalMilliseconds;
Console.WriteLine($"[BOOT] Loaded {memoryCache.Count} files into memory in {bootMs:F0}ms");

// Pre-build index.html with injected scripts (in memory)
var indexHtmlBytes = BuildIndexHtml(frontendPath, defaultChannelId, defaultChannelName);

// Widget path rewrite map
var widgetRewriteMap = new Dictionary<string, string>
{
    ["sharedio/sharedio.js"] = "/widget/sharedio/sharedio.js",
    ["sharedio/sharedioworker.js"] = "/widget/sharedio/sharedioworker.js",
    ["socketioclient.js"] = "/widget/socketioclient.js",
    ["mediawrapper.js"] = "/widget/mediawrapper.js",
};

// Serve /uploads/* from disk directly (NOT memory cache).
// User-uploaded files are dropped here at runtime by UploadController, so
// we can't use the boot-time memory cache. UseStaticFiles handles ETag,
// Range, MIME-by-extension and a sensible browser cache header.
{
    var uploadsRoot = Path.GetFullPath(Path.Combine(frontendPath, "uploads"));
    Directory.CreateDirectory(uploadsRoot);
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsRoot),
        RequestPath = "/uploads",
        ServeUnknownFileTypes = false,
        OnPrepareResponse = ctx =>
        {
            ctx.Context.Response.Headers["Cache-Control"] = "public, max-age=86400";
        }
    });
}

// Serve ALL static files from memory cache (instant, no disk I/O)
app.Use(async (context, next) =>
{
    if (context.Request.Method != "GET") { await next(); return; }

    var reqPath = context.Request.Path.Value ?? "";
    var normalizedReqPath = reqPath.Length > 1 && reqPath.EndsWith("/") ? reqPath.TrimEnd('/') : reqPath;

    // Skip API/hub/socket.io paths
    if (reqPath.StartsWith("/api/") || reqPath.StartsWith("/hub/") || reqPath.StartsWith("/socket.io")) { await next(); return; }

    // Root path ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ index.html
    if (reqPath == "/" || reqPath == "")
    {
        context.Response.ContentType = "text/html; charset=utf-8";
        context.Response.Headers.CacheControl = "no-cache";
        await context.Response.Body.WriteAsync(indexHtmlBytes);
        return;
    }

    // Try direct memory cache hit
    byte[]? data = null;
    var servedPath = reqPath;
    if (memoryCache.TryGetValue(reqPath, out var directData))
    {
        data = directData;
    }
    else if (normalizedReqPath != reqPath && memoryCache.TryGetValue(normalizedReqPath, out directData))
    {
        data = directData;
        servedPath = normalizedReqPath;
    }

    if (data != null)
    {
        var ext = Path.GetExtension(servedPath).ToLower();
        context.Response.ContentType = ResolveMime(servedPath, data);
        // /combo/ JS files must never be cached - obfuscated bundle changes without filename changes
        context.Response.Headers.CacheControl = servedPath.StartsWith("/combo/")
            ? "no-cache, no-store, must-revalidate"
            : ext is ".js" or ".css" ? "public, max-age=86400" : "public, max-age=3600";
        context.Response.Headers["X-Served-From"] = "memory";
        await context.Response.Body.WriteAsync(data);
        return;
    }

    // Extensionless URL -> prefer the .html sibling first (it's the canonical
    // widget version — usually newer and updated for OBS overlay use, e.g.
    // `chat.html` has background:transparent while `chat/index.html` doesn't).
    // Fall back to /index.html if the .html sibling doesn't exist.
    if (string.IsNullOrEmpty(Path.GetExtension(normalizedReqPath)))
    {
        var firstLookup = normalizedReqPath + ".html";
        var secondLookup = normalizedReqPath + "/index.html";

        if (memoryCache.TryGetValue(firstLookup, out var firstData))
        {
            context.Response.StatusCode = 200;
            context.Response.ContentType = "text/html; charset=utf-8";
            context.Response.Headers["X-Served-From"] = firstLookup.EndsWith("/index.html") ? "memory-index" : "memory-html";
            await context.Response.Body.WriteAsync(MaybeInjectWidgetCss(normalizedReqPath, firstData));
            return;
        }

        if (memoryCache.TryGetValue(secondLookup, out var secondData))
        {
            context.Response.StatusCode = 200;
            context.Response.ContentType = "text/html; charset=utf-8";
            context.Response.Headers["X-Served-From"] = secondLookup.EndsWith("/index.html") ? "memory-index" : "memory-html";
            await context.Response.Body.WriteAsync(MaybeInjectWidgetCss(normalizedReqPath, secondData));
            return;
        }
    }

    // Widget path rewrite: /widget/myactions/sharedio/sharedio.js ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ /widget/sharedio/sharedio.js
    if (normalizedReqPath.StartsWith("/widget/"))
    {
        var parts = normalizedReqPath.TrimStart('/').Split('/');
        if (parts.Length >= 3)
        {
            var relativePart = string.Join("/", parts[2..]);
            if (widgetRewriteMap.TryGetValue(relativePart, out var mapped) && memoryCache.TryGetValue(mapped, out var mappedData))
            {
                context.Response.ContentType = ResolveMime(mapped, mappedData);
                context.Response.Headers["X-Served-From"] = "memory-rewrite";
                await context.Response.Body.WriteAsync(mappedData);
                return;
            }
            // Try shared widget assets
            var sharedKey = "/widget/" + relativePart;
            if (memoryCache.TryGetValue(sharedKey, out var sharedData))
            {
                context.Response.ContentType = ResolveMime(sharedKey, sharedData);
                context.Response.Headers["X-Served-From"] = "memory-shared";
                await context.Response.Body.WriteAsync(sharedData);
                return;
            }
        }
    }

    await next();
});

// Dedicated /logout handler - clears auth and redirects to home
app.MapGet("/logout", (HttpContext ctx) =>
{
    var next = ctx.Request.Query["next"].ToString();
    string safeNext;
    if (string.IsNullOrWhiteSpace(next))
    {
        safeNext = "/";
    }
    else if (Uri.TryCreate(next, UriKind.Absolute, out var abs))
    {
        if (abs.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase))
        {
            safeNext = abs.PathAndQuery + abs.Fragment;
        }
        else
        {
            safeNext = "/";
        }
    }
    else if (next.StartsWith("/"))
    {
        safeNext = next;
    }
    else
    {
        safeNext = "/";
    }

    var html = """
    <!DOCTYPE html><html><head><title>Logging out...</title></head><body>
    <script>
    try {
      localStorage.removeItem('setting_loginaccesstoken');
      localStorage.removeItem('setting_loginaccesstokenprovider');
      localStorage.removeItem('setting_pendinglogin');
      localStorage.removeItem('setting_channelid');
      localStorage.removeItem('setting_channelname');
      localStorage.removeItem('setting_tiktokname');
      localStorage.removeItem('setting_email');
      localStorage.removeItem('setting_owneruserid');
      localStorage.removeItem('setting_featurebasetoken');
      localStorage.removeItem('setting_dynamicsettings');
      localStorage.removeItem('setting_channelsignature');
      localStorage.removeItem('setting_ispro');
      localStorage.removeItem('setting_locale');
      sessionStorage.clear();
      var authCookies = [
        'tf_login_token',
        'tf_channelid',
        'tf_channelname',
        'tf_ispro',
        'tf_locale',
        'tf_tiktokname',
        'tf_email',
        'tf_channelsignature',
        'tf_owneruserid',
        'tf_featurebasetoken',
        'tf_pendinglogin'
      ];
      authCookies.forEach(function(name) {
        document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        document.cookie = name + '=; path=/; max-age=0; SameSite=Lax';
      });
    } catch(e) {}
    window.location.href = '__TF_LOGOUT_NEXT__';
    </script>
    </body></html>
    """;
    html = html.Replace("__TF_LOGOUT_NEXT__", safeNext.Replace("'", "%27"));
    ctx.Response.ContentType = "text/html; charset=utf-8";
    return ctx.Response.WriteAsync(html);
});

// SPA fallback — serve index.html only for SPA-style routes (extensionless or
// .html). Static asset paths (.svg, .png, .css, .js, etc.) that 404 must STAY
// 404 so the browser shows a broken-image icon instead of receiving HTML and
// failing to decode it as the requested type.
//
// Without this guard, requests like /img/flags/vi.svg returned a 200+HTML body,
// the bundle's <img> tags then silently failed to render → broken icons all
// over the language picker, Pro tiers list, etc.
var spaFallbackExtensions = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "", ".html", ".htm" };

app.Use(async (context, next) =>
{
    await next();

    if (context.Response.StatusCode != 404 || context.Response.HasStarted) return;
    if (context.Request.Path.StartsWithSegments("/api") ||
        context.Request.Path.StartsWithSegments("/hub") ||
        context.Request.Path.StartsWithSegments("/socket.io") ||
      context.Request.Path.StartsWithSegments("/img") ||
        context.Request.Path.StartsWithSegments("/widget")) return;

    var path = context.Request.Path.Value ?? "";
    var ext = Path.GetExtension(path);
    if (!spaFallbackExtensions.Contains(ext)) return;  // real asset → keep 404

    context.Response.StatusCode = 200;
    context.Response.ContentType = "text/html; charset=utf-8";
    await context.Response.Body.WriteAsync(indexHtmlBytes);
});

Console.WriteLine($"\n==============================================");
Console.WriteLine($" TikFinity Backend + Frontend Server");
Console.WriteLine($"==============================================");
Console.WriteLine($"  Local:    http://localhost:5285");
Console.WriteLine($"  Bind:     http://{bindHost}:5285" + (bindHost == "0.0.0.0" ? " (LAN exposed via TIKMAX_ALLOW_LAN)" : ""));
Console.WriteLine($"  API:      http://localhost:5285/api/*");
Console.WriteLine($"  Frontend: http://localhost:5285/");
Console.WriteLine($"==============================================\n");

app.Run();

// =============================================
// HELPERS
// =============================================

static byte[] BuildIndexHtml(string frontendPath, int defaultChannelId = 1, string defaultChannelName = "user")
{
    var indexPath = Path.Combine(frontendPath, "index.html");
    if (!File.Exists(indexPath))
    {
        Console.WriteLine("[WARN] index.html not found at: " + indexPath);
        return Encoding.UTF8.GetBytes("<html><body><h1>Frontend not found</h1><p>Place files in downloads/ folder</p></body></html>");
    }

    var html = File.ReadAllText(indexPath);
    html = html.Replace("<script src=\"https://t.contentsquare.net/uxa/19b56fd959e33.js\"></script>", "", StringComparison.OrdinalIgnoreCase);
    html = Regex.Replace(html, @"<script>\(\(o,i\)=>.*?posthog\.init\(.*?</script>", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);
    html = Regex.Replace(html, @"<script>\(\(e,t\)=>\{let a=""featurebase-sdk"".*?</script>", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);
    html = Regex.Replace(html, @"<script\s+type=""module"">\s*import\s+\*\s+as\s+Sentry\s+from\s+['""][^'""]*@sentry/browser[^'""]*['""];.*?</script>", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);
    html = Regex.Replace(html, @"<script>function gTag\(e\).*?</script>", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);
    html = Regex.Replace(html, @"<noscript><iframe src=""https://www\.googletagmanager\.com/ns\.html\?id=[^""]+"" height=""0"" width=""0"" style=""display:none;visibility:hidden""></iframe></noscript>", "", RegexOptions.IgnoreCase);

    var blockScript = """
    <script>
    (function(){
      // One-time cleanup: purge the legacy hardcoded dev token so users
      // who previously had auto-login fall back to the real login flow.
      try {
        var legacy = 'tf_local_dev_token_2024';
        var existing = localStorage.getItem('setting_loginaccesstoken');
        if (existing === legacy) {
          localStorage.removeItem('setting_loginaccesstoken');
          localStorage.removeItem('setting_loginaccesstokenprovider');
          localStorage.removeItem('setting_pendinglogin');
          localStorage.removeItem('setting_channelid');
          localStorage.removeItem('setting_channelname');
          localStorage.removeItem('setting_ispro');
          document.cookie = 'tf_login_token=; path=/; max-age=0';
          document.cookie = 'tf_channelid=; path=/; max-age=0';
          document.cookie = 'tf_channelname=; path=/; max-age=0';
          document.cookie = 'tf_ispro=; path=/; max-age=0';
        }
      } catch(e) {}

      // Hide the top-of-app "Connection failed" / "Error while connecting" banner
      // that the obfuscated bundle renders whenever a TikTok connect attempt
      // fails. The styles target the bundle's notification bars (colors `bg-red*`,
      // role=alert, etc.) and the observer below force-removes any banner whose
      // text matches our denylist.
      //
      // We persist the same error in the notification bell instead, so the user
      // can review it on demand without a flickering full-width red strip.
      // Note: previously had a `suppressBridgeBanner` observer here that hid
      // every connection-error banner (and a `data-tf-hide-account` CSS rule).
      // Removed to restore the bundle's native popup behaviour — when a
      // TikTok connect attempt fails the user now sees the standard
      // "Connection Failed" dialog like the original Tikfinity. Only keep
      // the dropdown-account-row hide rule, since logout still routes
      // through electron's external Serial Key flow.
      (function bridgeBannerStyles(){
        var style = document.createElement('style');
        style.textContent = '[data-tf-hide-account="1"] { display:none !important; }';
        (document.head || document.documentElement).appendChild(style);
      })();

      // Bundle natively shows its own "Connection Failed" modal on connectFailed,
      // which duplicates our centered popup (the one with "Login TikTok" button).
      // Watch for the bundle's modal and hide it. Match by signature text so we
      // don't accidentally hide legit modals.
      (function suppressBundleConnFailedModal(){
        var SIGNATURE = /Failed to access your LIVE stream/i;
        function hideIfBundleModal(node) {
          if (!node || node.nodeType !== 1) return;
          if (node.id && node.id.indexOf('tf-') === 0) return;
          if (node.closest && node.closest('[id^="tf-"]')) return;
          var text = (node.textContent || '').trim();
          if (text.length > 0 && text.length < 600 && SIGNATURE.test(text)) {
            node.style.setProperty('display', 'none', 'important');
          }
        }
        var mo = new MutationObserver(function(muts){
          for (var i=0; i<muts.length; i++) {
            var m = muts[i];
            for (var j=0; j<m.addedNodes.length; j++) hideIfBundleModal(m.addedNodes[j]);
          }
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });
        // Also scan current DOM in case modal renders before observer attaches
        document.querySelectorAll('div, section').forEach(hideIfBundleModal);
      })();

      // ──────────────────────────────────────────────────────────────────────
      // window.getAllGifts shim — bundle's settings dialog (Wheel of Actions
      // trigger dropdown, gift counter setup) calls window.getAllGifts() to
      // populate the gift picker. The original Tikfinity cloud injected this
      // from the server; we serve a static catalog from /api/tiktok/gifts.
      // The function MUST exist before the bundle boots, otherwise the wheel
      // list grid skips rendering entirely.
      // ──────────────────────────────────────────────────────────────────────
      (function tfGiftCatalog(){
        var cache = null, inflight = null;
        window.getAllGifts = function() {
          if (cache) return Promise.resolve(cache);
          if (inflight) return inflight;
          inflight = fetch('/api/tiktok/gifts', { cache: 'no-store' })
            .then(function(r){ return r.ok ? r.json() : []; })
            .then(function(list){ cache = Array.isArray(list) ? list : (list && list.gifts) || []; return cache; })
            .catch(function(){ cache = []; return cache; });
          return inflight;
        };
        // Some bundle paths read window.getAllGiftsCached synchronously — give
        // them a sane shape so they don't throw before the Promise resolves.
        window.getAllGiftsCached = function() { return cache || []; };
      })();

      // ──────────────────────────────────────────────────────────────────────
      // Friendly TikTok-connect feedback. Polls /api/tiktok/status every 1s.
      //   - connecting → top-right "Connecting to @user..." toast (sticky)
      //   - connected (rising edge) → "Connected!" success toast (auto-dismiss)
      //   - lastErrorAt advances → centre error modal
      //   - connecting >25s with no resolution → force timeout error modal
      // ──────────────────────────────────────────────────────────────────────
      (function tfConnectErrorPopup(){
        var lastShownAt = 0;
        var firstPollDone = false;
        var prevConnecting = false;
        var prevConnected = false;
        var connectStartedAt = 0;
        var lastPopupShownTime = 0;  // Debounce: don't spam popups
        var WATCHDOG_MS = 25000;
        var POPUP_DEBOUNCE_MS = 5000;  // Min 5s between error popups
        var STARTUP_GRACE_MS = 10000;  // Don't show errors in first 10s
        var pageLoadTime = Date.now();
        window.__tfPopup = { ready: true, polls: 0, lastState: null };
        console.log('[tf-popup] script loaded');

        function ensureStyles() {
          if (document.getElementById('tf-connect-popup-styles')) return;
          var s = document.createElement('style');
          s.id = 'tf-connect-popup-styles';
          s.textContent = [
            '#tf-connect-popup-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:2147483646;display:flex;align-items:center;justify-content:center;animation:tfFadeIn .15s ease-out;}',
            '#tf-connect-popup{background:#1a1a2e;color:#fff;border-radius:12px;padding:24px 28px;width:min(420px,92vw);box-shadow:0 16px 48px rgba(0,0,0,.5);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;animation:tfPop .18s cubic-bezier(.2,.9,.3,1.1);}',
            '#tf-connect-popup .tfp-icon{width:48px;height:48px;display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 14px;}',
            '#tf-connect-popup h3{margin:0 0 10px;font-size:18px;text-align:center;font-weight:700;}',
            '#tf-connect-popup p{margin:0 0 6px;font-size:14px;color:#b8b8c8;text-align:left;line-height:1.5;word-break:break-word;}',
            '#tf-connect-popup button{display:block;width:100%;padding:10px;border:0;border-radius:6px;background:#e91e63;color:#fff;font-size:14px;font-weight:600;cursor:pointer;}',
            '#tf-connect-popup button:hover{background:#c2185b;}',
            '#tf-connect-toast{position:fixed;top:18px;right:18px;z-index:2147483645;background:#1a1a2e;color:#fff;border-radius:10px;padding:12px 16px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;box-shadow:0 8px 24px rgba(0,0,0,.4);display:flex;align-items:center;gap:10px;min-width:240px;max-width:320px;animation:tfSlideIn .2s ease-out;}',
            '#tf-connect-toast.success{background:#16331f;border:1px solid #2d6e3d;}',
            '#tf-connect-toast.connecting{background:#1a1a2e;border:1px solid #3a3a55;}',
            '#tf-connect-toast .tft-spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.2);border-top-color:#e91e63;border-radius:50%;animation:tfSpin .8s linear infinite;flex-shrink:0;}',
            '#tf-connect-toast .tft-check{color:#4ade80;font-weight:700;font-size:16px;flex-shrink:0;}',
            '#tf-user-status{display:block;font-size:11px;font-weight:600;line-height:1.1;margin-top:2px;letter-spacing:.2px;}',
            '#tf-user-status.live{color:#42a5f5;}',
            '#tf-user-status.disconnected{color:#ef5350;}',
            '#tf-user-status.connecting{color:#fbc02d;}',
            '@keyframes tfBlink{0%,100%{opacity:1}50%{opacity:.3}}',
            '@keyframes tfFadeIn{from{opacity:0}to{opacity:1}}',
            '@keyframes tfPop{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}',
            '@keyframes tfSlideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}',
            '@keyframes tfSpin{to{transform:rotate(360deg)}}'
          ].join('');
          (document.head || document.documentElement).appendChild(s);
        }

        function removeToast() {
          var t = document.getElementById('tf-connect-toast');
          if (t) t.remove();
        }

        // Find the native status text node under the username avatar in the
        // bundle's topbar. Bundle renders "Connecting..." / "Disconnected" /
        // "LIVE" there itself when it gets the right state; we just locate
        // it by walking up from any text matching those phrases and remember
        // the element so we can keep updating it.
        var cachedStatusEl = null;
        function findStatusEl() {
          if (cachedStatusEl && document.body.contains(cachedStatusEl)) return cachedStatusEl;
          // Walk all elements; find one whose textContent (trimmed) is the
          // exact bundle status word and whose parent looks like the topbar
          // user pill (small element inside a dropdown trigger).
          var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null);
          var n;
          while ((n = walker.nextNode())) {
            if (n.children.length !== 0) continue;
            var t = (n.textContent || '').trim();
            if (t === 'Connecting...' || t === 'Connecting…' || t === 'Disconnected' || t === 'LIVE') {
              cachedStatusEl = n;
              return n;
            }
          }
          return null;
        }

        // Find the username element in the topbar by exact text match. Bundle
        // renders the @ handle there in a small <span>; we walk all elements
        // with no children and match the text. Cached so we don't re-scan
        // every poll.
        var cachedUserEl = null;
        function findUserEl(username) {
          if (cachedUserEl && document.body.contains(cachedUserEl) &&
              (cachedUserEl.textContent || '').trim() === username) return cachedUserEl;
          if (!username) return null;
          var els = document.body.querySelectorAll('span, div, a, p, button');
          for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el.children.length !== 0) continue;
            var t = (el.textContent || '').trim();
            if (t === username || t === '@' + username) {
              // Avoid picking up the input field's @username if any.
              if (el.closest('input, textarea')) continue;
              // Only accept if inside the topbar (small viewport offset).
              var rect = el.getBoundingClientRect();
              if (rect.top < 80 && rect.right > window.innerWidth - 400) {
                cachedUserEl = el;
                return el;
              }
            }
          }
          return null;
        }

        function setStatusPill(state, username) {
          ensureStyles();

          var nativeEl = findStatusEl();
          var ownEl = document.getElementById('tf-user-status');

          // PREFER bundle's native status text node when it exists. The bundle
          // re-renders that node automatically based on its own state, so we
          // just hijack the text. Remove our injected sibling to avoid double.
          if (nativeEl) {
            if (ownEl) ownEl.remove();
            if (state === 'live') {
              nativeEl.textContent = 'LIVE';
              nativeEl.style.color = '#42a5f5';
            } else if (state === 'connecting') {
              nativeEl.textContent = 'Connecting...';
              nativeEl.style.color = '#fbc02d';
            } else {
              nativeEl.textContent = 'Disconnected';
              nativeEl.style.color = '#ef5350';
            }
            return;
          }

          // Fallback: no native node yet (bundle never rendered status text).
          // Inject our own sibling under the username so user always sees state.
          var userEl = findUserEl(username);
          if (!userEl) return;

          if (!ownEl) {
            ownEl = document.createElement('span');
            ownEl.id = 'tf-user-status';
            if (userEl.parentNode) {
              if (userEl.nextSibling) userEl.parentNode.insertBefore(ownEl, userEl.nextSibling);
              else userEl.parentNode.appendChild(ownEl);
            }
          } else if (ownEl.previousSibling !== userEl && userEl.parentNode) {
            if (userEl.nextSibling) userEl.parentNode.insertBefore(ownEl, userEl.nextSibling);
            else userEl.parentNode.appendChild(ownEl);
          }

          ownEl.className = state;
          if (state === 'live') ownEl.textContent = 'LIVE';
          else if (state === 'connecting') ownEl.textContent = 'Connecting...';
          else ownEl.textContent = 'Disconnected';
        }

        function showToast(kind, text) {
          ensureStyles();
          removeToast();
          var t = document.createElement('div');
          t.id = 'tf-connect-toast';
          t.className = kind;
          var ico = document.createElement('span');
          if (kind === 'success') { ico.className = 'tft-check'; ico.textContent = '✓'; }
          else { ico.className = 'tft-spinner'; }
          var msg = document.createElement('span');
          msg.textContent = text;
          t.appendChild(ico);
          t.appendChild(msg);
          (document.body || document.documentElement).appendChild(t);
          return t;
        }

        function showPopup(message, username) {
          ensureStyles();
          var existing = document.getElementById('tf-connect-popup-overlay');
          if (existing) existing.remove();

          var overlay = document.createElement('div');
          overlay.id = 'tf-connect-popup-overlay';

          var box = document.createElement('div');
          box.id = 'tf-connect-popup';

          var icon = document.createElement('div');
          icon.className = 'tfp-icon';
          icon.textContent = '📡';

          var msg = message || 'Unable to connect to TikTok LIVE.';
          var isOffline = /offline|not.*live|live has ended/i.test(msg);
          // Short error code for the "Details:" line — match Tikfinity gốc.
          var detailCode = msg;
          if (/rate.*limit|429/i.test(msg)) detailCode = 'rateLimited';
          else if (/missing.*extension|missingextension/i.test(msg)) detailCode = 'missingExtension';
          else if (/timed?.*out|timeout/i.test(msg)) detailCode = 'connectTimeout';
          else if (/not.*found|user.*not.*exist/i.test(msg)) detailCode = 'userNotFound';
          else if (/ip.*block|403/i.test(msg)) detailCode = 'ipBlocked';
          else if (isOffline) detailCode = 'LIVE has ended';

          var title = document.createElement('h3');
          title.textContent = isOffline ? 'Your stream is offline' : 'Failed to access your LIVE stream!';

          var body = document.createElement('p');
          if (isOffline && username) {
            body.innerHTML =
              'Unable to connect to your TikTok channel <b>@' + username + '</b> because your TikTok LIVE stream is currently offline!<br><br>' +
              'Please start your stream and click the connect button again. ' +
              'Note that you can also set up TikFinity while you are offline.<br><br>' +
              'If you have any questions, please contact support.';
          } else {
            body.innerHTML =
              'Please make sure that the username entered under "Setup" corresponds to your TikTok profile @ handle.';
          }

          var details = document.createElement('p');
          details.style.cssText = 'font-size:13px;color:#aaa;margin:14px 0 18px;text-align:left;';
          details.innerHTML = 'Error Details: <span style="color:#42a5f5;font-weight:600;">' + detailCode + '</span>';

          // For session-class failures (rate-limit, missingExtension, IP block,
          // generic init failure) the most likely fix is a fresh TikTok login,
          // since that gives the bridge sessionid + tt-target-idc and lets it
          // skip Eulerstream signing entirely. Show a primary "Login TikTok"
          // button alongside OK in those cases.
          var sessionFixable = /rateLimited|missingExtension|ipBlocked|connectTimeout|INIT_FAILED|UNCAUGHT|missing.*extension|rate.*limit|init failed|bridge error|tt-target-idc/i.test(msg + ' ' + detailCode);
          var canSignIn = !!(window.TFS && typeof window.TFS.tiktokSignIn === 'function');

          var btnRow = document.createElement('div');
          btnRow.style.cssText = 'display:flex;gap:10px;';

          var btn = document.createElement('button');
          btn.type = 'button';
          btn.textContent = 'OK';
          btn.style.cssText = 'flex:1;';
          btn.addEventListener('click', function(){ overlay.remove(); });

          if (sessionFixable && canSignIn) {
            var loginBtn = document.createElement('button');
            loginBtn.type = 'button';
            loginBtn.textContent = 'Login TikTok';
            loginBtn.style.cssText = 'flex:1;background:#1e88e5;';
            loginBtn.addEventListener('mouseover', function(){ loginBtn.style.background = '#1976d2'; });
            loginBtn.addEventListener('mouseout', function(){ loginBtn.style.background = '#1e88e5'; });
            loginBtn.addEventListener('click', async function(){
              loginBtn.disabled = true;
              loginBtn.textContent = 'Opening login…';
              try {
                await window.TFS.tiktokSignIn();
              } catch (err) { /* surfaced by next connect attempt */ }
              overlay.remove();
            });
            btnRow.appendChild(loginBtn);
          }
          btnRow.appendChild(btn);
          overlay.addEventListener('click', function(e){ if (e.target === overlay) overlay.remove(); });
          document.addEventListener('keydown', function escClose(e){
            if (e.key === 'Escape' && document.getElementById('tf-connect-popup-overlay')) {
              overlay.remove();
              document.removeEventListener('keydown', escClose);
            }
          });

          box.appendChild(icon);
          box.appendChild(title);
          box.appendChild(body);
          box.appendChild(details);
          box.appendChild(btnRow);
          overlay.appendChild(box);
          (document.body || document.documentElement).appendChild(overlay);
        }

        async function poll() {
          try {
            var r = await fetch('/api/tiktok/status', { cache: 'no-store' });
            if (!r.ok) return;
            var s = await r.json();
            var at = Number(s && s.lastErrorAt) || 0;
            var connecting = Boolean(s && s.connecting);
            var connected = Boolean(s && s.connected);
            var username = (s && (s.failedUsername || s.username)) || '';
            window.__tfPopup.polls++;
            window.__tfPopup.lastState = { at, connecting, connected, username, lastShownAt, firstPollDone };

            // First poll: adopt error baseline so a stale error from before
            // page load doesn't trigger an immediate popup. Mark firstPollDone
            // so subsequent errors (even the first real one) trigger the popup.
            if (!firstPollDone) {
              firstPollDone = true;
              lastShownAt = at;
              prevConnecting = connecting;
              prevConnected = connected;
              return;
            }

            // Rising edge: connect just kicked off → start watchdog timer.
            if (connecting && !prevConnecting) {
              connectStartedAt = Date.now();
            }

            // Persistent corner status pill: live / connecting / disconnected.
            if (connected) setStatusPill('live', username);
            else if (connecting) setStatusPill('connecting', username);
            else setStatusPill('disconnected', username);

            removeToast();

            // SUPPRESS popups during startup grace period (first 10s)
            var isInGracePeriod = (Date.now() - pageLoadTime) < STARTUP_GRACE_MS;

            // New error from the bridge → centre modal (with debounce + grace period).
            if (at > 0 && at !== lastShownAt && !isInGracePeriod) {
              var timeSinceLastPopup = Date.now() - lastPopupShownTime;
              
              // Only show popup if enough time has passed since last one (debounce)
              if (timeSinceLastPopup >= POPUP_DEBOUNCE_MS) {
                console.log('[tf-popup] firing error popup, lastError=', s.lastError);
                lastShownAt = at;
                lastPopupShownTime = Date.now();
                removeToast();
                showPopup(s.lastError, username);
              }
            }

            // Watchdog: connect hung for >25s with no error/success.
            if (connecting && connectStartedAt > 0 && (Date.now() - connectStartedAt) > WATCHDOG_MS) {
              connectStartedAt = 0;
              removeToast();
              showPopup('Connection timed out. The TikTok bridge did not respond. Please check your network and try again.', username);
            }

            prevConnecting = connecting;
            prevConnected = connected;
            if (!connecting) connectStartedAt = 0;
          } catch (e) {}
        }

        // Poll every 1s for snappy feedback during connect.
        function start() {
          setStatusPill('disconnected', null);
          setInterval(poll, 1000);
          poll();
        }
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', start);
        } else {
          start();
        }
      })();

      // Hide the bundle's persistent red top banner — our centred popup
      // replaces it. The bundle's native "Connection Failed" toast also
      // gets neutralised by removing nodes whose text matches the noise.
      (function suppressBridgeBanner(){
        var DENY = /^(connection failed|connectfailed|econnreset|econnrefused|etimedout|enotfound|disconnected)$/i;
        function hideIfMatch(node) {
          if (!node || node.nodeType !== 1) return;
          // Never touch our own injected UI (pill, popup, toast).
          if (node.id && node.id.indexOf('tf-') === 0) return;
          if (node.closest && node.closest('[id^="tf-"]')) return;
          var text = (node.textContent || '').trim();
          if (!text || text.length > 240) return;
          if (DENY.test(text) || /tiktok\.eulerstream\.com|axios.*error|handleRequestError/i.test(text)) {
            node.style.setProperty('display', 'none', 'important');
          }
        }
        var mo = new MutationObserver(function(muts){
          for (var i=0; i<muts.length; i++) {
            var m = muts[i];
            for (var j=0; j<m.addedNodes.length; j++) hideIfMatch(m.addedNodes[j]);
          }
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });
      })();

      // ──────────────────────────────────────────────────────────────────────
      // Tame the bundle's profile-dropdown account items.
      //   • Sign Out / Đăng xuất / Log Out  → INTERCEPT click → IPC `auth:logout`
      //   • Connect TikTok Account / My Profile / Switch Account / etc → HIDE
      //
      // Vue delegates events at `document` level, so a row-level capture-phase
      // listener loses the race. Instead we install a SINGLE document-level
      // `mousedown` capture listener — mousedown fires before click, and the
      // capture phase from document-down means we run before any framework
      // handler attached lower in the tree.
      //
      // Kept untouched: Language picker, Roadmap, Feature Request, Pro upgrade.
      // ──────────────────────────────────────────────────────────────────────
      (function tameAccountDropdown(){
        // Match logout labels even with icon prefixes (🔚, →, etc) or trailing
        // chevrons. Strip non-letter chars from edges before testing.
        var LOGOUT_RE = /^(sign[\s-]?out|log[\s-]?out|đăng[\s-]?xuất)$/i;
        function normalizeLabel(s) {
          if (!s) return '';
          // Trim, then strip leading/trailing non-letter (emoji, icons, arrows, etc)
          return String(s).trim()
            .replace(/^[^\p{L}]+/u, '')
            .replace(/[^\p{L}]+$/u, '')
            .trim();
        }
        var HIDE_RE = /^(connect tiktok account|kết nối tài khoản tiktok|my profile|hồ sơ của tôi|switch account|đổi tài khoản|sign in|log[\s-]?in|đăng[\s-]?nhập|create account|tạo tài khoản)$/i;
        var seen = new WeakSet();

        function isHideableMenuRow(node) {
          if (!node || node.nodeType !== 1) return false;
          return node.tagName === 'A' ||
                 node.tagName === 'LI' ||
                 node.tagName === 'BUTTON' ||
                 (node.getAttribute && node.getAttribute('role') === 'menuitem') ||
                 (node.classList && (
                   node.classList.contains('menu-item') ||
                   node.classList.contains('dropdown-item') ||
                   node.classList.contains('v-list-item')
                 ));
        }

        function rowOf(el) {
          var row = el;
          for (var i=0; i<8 && row; i++) {
            if (isHideableMenuRow(row)) return row;
            row = row.parentElement;
          }
          return null;
        }

        function findClickableLogout(target) {
          // Walk up the DOM looking for a node whose normalized text matches.
          var el = target;
          for (var i=0; i<8 && el && el.nodeType === 1; i++) {
            var raw = (el.textContent || '').trim();
            if (raw && raw.length <= 60) {
              var norm = normalizeLabel(raw);
              if (norm && LOGOUT_RE.test(norm)) return el;
            }
            el = el.parentElement;
          }
          return null;
        }

        function fireLogout(e) {
          var hit = findClickableLogout(e.target);
          if (!hit) return;
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          console.log('[tfs] Logout intercepted (text="' + hit.textContent.trim() + '")');
          try {
            if (window.TFS && typeof window.TFS.logout === 'function') {
              console.log('[tfs] calling window.TFS.logout()');
              var p = window.TFS.logout();
              if (p && typeof p.then === 'function') {
                p.then(function(){ console.log('[tfs] logout IPC resolved'); })
                 .catch(function(err){ console.error('[tfs] logout IPC rejected', err); });
              }
            } else {
              console.error('[tfs] window.TFS.logout missing — preload.js not loaded?');
            }
          } catch (err) { console.error('[tfs] logout invoke threw', err); }
        }

        // Document-level capture listeners — beat any framework delegation.
        // Hooking BOTH mousedown and click belt-and-suspenders since some
        // libraries fire on either.
        document.addEventListener('mousedown', fireLogout, true);
        document.addEventListener('click', fireLogout, true);

        // Hide path for non-logout account items.
        function check(el) {
          if (!el || el.nodeType !== 1 || seen.has(el)) return;
          var tag = el.tagName;
          if (tag !== 'A' && tag !== 'BUTTON' && tag !== 'LI' && tag !== 'DIV' && tag !== 'SPAN') return;
          var text = (el.textContent || '').trim();
          if (!text || text.length > 60) return;
          var norm = normalizeLabel(text);
          if (norm && HIDE_RE.test(norm)) {
            var row = rowOf(el);
            if (!row) return;
            row.setAttribute('data-tf-hide-account', '1');
            seen.add(row);
          }
        }
        function sweep(root) {
          if (!root || root.nodeType !== 1) return;
          check(root);
          root.querySelectorAll && root.querySelectorAll('a, button, li, [role="menuitem"], .menu-item, .dropdown-item, .v-list-item').forEach(check);
        }
        var mo2 = new MutationObserver(function(muts){
          for (var i=0; i<muts.length; i++) {
            for (var j=0; j<muts[i].addedNodes.length; j++) sweep(muts[i].addedNodes[j]);
          }
        });
        mo2.observe(document.documentElement, { childList: true, subtree: true });
        sweep(document.body);
      })();

      // Clamp noisy TikTok-bridge error dumps before they hit any UI toast.
      // The obfuscated bundle occasionally renders a raw axios error object,
      // producing a wall of JSON at the top of the screen. We keep the first
      // sentence and drop the rest.
      (function shortenBridgeErrors(){
        function shorten(msg) {
          if (typeof msg !== 'string') return msg;
          if (msg.length <= 240) return msg;
          var firstLine = msg.split(/\r?\n/)[0];
          if (firstLine.length > 200) firstLine = firstLine.slice(0, 197) + '...';
          return firstLine;
        }
        var origError = console.error.bind(console);
        console.error = function() {
          var args = Array.prototype.map.call(arguments, shorten);
          return origError.apply(console, args);
        };
        window.__tfShortenError = shorten;
      })();

      // PATCH: _injectModules calls $.getScript('/combo/modules.js') but fails because
      // it's a babel async-generator scope issue in the obfuscated bundle.
      // We inject window._injectModules as a lazy dynamic loader — it fires AFTER app.js
      // has run (so window.localization is already defined by then).
      // Pre-define globals as stubs BEFORE modules.js loads (fallback if modules.js fails)
      window.setup = new Proxy({inputValues:{},options:{}}, {
        get: function(t,p) { if (p in t) return t[p]; if (p==='then') return undefined; return function(){}; },
        set: function(t,p,v) { t[p]=v; return true; }
      });
      window.obsdocks = { init: function(){}, stretchIframe: function(){} };
      window.obsoverlays = { stretchIframe: function(){}, init: function(){} };
      window.start = { showItems: function(){}, init: function(){}, refreshRecentTransactions: function(){} };
      window.transaction = { init: function(){} };
      window.crossconnect = { subscribe: function(){}, init: function(){} };
      window.trial = { init: function(){} };
      window.pro = { init: function(){} };
      window.yearlyUpgrade = { init: function(){} };

      // Load modules.js lazily — it defines page templates and content.
      // appConfig.modules stays empty so moduleinjector.load() loop is skipped.
      window._injectModules = function() {
        return new Promise(function(resolve) {
          if (document.querySelector('script[src*="modules.js"]')) { resolve(); return; }
          var s = document.createElement('script');
          s.src = '/combo/modules.js';
          s.onload = resolve;
          s.onerror = resolve;
          document.head.appendChild(s);
        });
      };

      // Intercept Vue.createApp to inject errorHandler — prevents "Oh no!" crash screen
      Object.defineProperty(window, 'Vue', {
        configurable: true,
        set: function(v) {
          delete window.Vue;
          window.Vue = v;
          if (v && v.createApp) {
            var _origCreate = v.createApp;
            v.createApp = function() {
              var app = _origCreate.apply(this, arguments);
              var _origHandler = app.config.errorHandler;
              app.config.errorHandler = function(err) {
                var msg = (err && err.message) || String(err);
                if (_isKnownError(msg)) {
                  console.warn('[TF-GUARD] Suppressed Vue error:', msg);
                  return;
                }
                if (_origHandler) return _origHandler.apply(this, arguments);
                console.error('[Vue]', err);
              };
              return app;
            };
          }
        }
      });

      // SWITCH-PROFILE LOADING OVERLAY: bundle's switchProfile triggers a
      // bootstrap chain (8-12 reloads in quick succession). Instead of trying
      // to block the reloads (which can leave the bundle in a broken state),
      // we paint a fullscreen loading overlay that covers all the flicker.
      // After 3s without further reloads, the overlay fades out.
      window.__tfShowSwitchOverlay = function() {
        try {
          if (document.getElementById('tf-switch-overlay')) return;
          var ov = document.createElement('div');
          ov.id = 'tf-switch-overlay';
          var sp = document.createElement('div');
          sp.id = 'tf-switch-overlay-spinner';
          var tx = document.createElement('div');
          tx.id = 'tf-switch-overlay-text';
          tx.textContent = 'Switching profile...';
          ov.appendChild(sp);
          ov.appendChild(tx);
          (document.body || document.documentElement).appendChild(ov);
        } catch(e) {}
      };
      window.__tfHideSwitchOverlay = function() {
        try {
          // Clear the localStorage trigger so the next page load won't re-show
          // the overlay. We're past the switch flicker — bundle has settled.
          try { localStorage.removeItem('__tf_post_switch_ts'); } catch(e) {}
          var ov = document.getElementById('tf-switch-overlay');
          if (!ov) return;
          ov.classList.add('tf-fade-out');
          setTimeout(function() { if (ov && ov.parentNode) ov.parentNode.removeChild(ov); }, 500);
        } catch(e) {}
      };
      // On each page load, check if we're in a post-switch window. If so,
      // paint the overlay immediately so the user sees a clean loading state
      // instead of the bundle's UI flickering through its bootstrap chain.
      try {
        var _postSwitchTs = parseInt(localStorage.getItem('__tf_post_switch_ts') || '0', 10) || 0;
        if (_postSwitchTs > 0 && (Date.now() - _postSwitchTs) < 8000) {
          if (document.body) {
            window.__tfShowSwitchOverlay();
          } else {
            document.addEventListener('DOMContentLoaded', window.__tfShowSwitchOverlay, { once: true });
          }
          // If this page survives 3s without another reload, the bundle has
          // settled — fade out the overlay.
          setTimeout(window.__tfHideSwitchOverlay, 3000);
        }
      } catch(e) {}

      // Capture the original reload BEFORE the persistent reloadGuard patches
      // the prototype. authSuccess() uses window.__tfOrigReload to bypass that
      // guard when fulfilling a real login reload.
      // NOTE: We intentionally do NOT wrap window.location.reload here anymore.
      // The previous in-memory _navCalls wrapper conflicted with the sessionStorage
      // reloadGuard: it set an own-property on location that shadowed the prototype
      // patch, AND its 30s setTimeout would restore the ORIGINAL (unguarded) reload,
      // leaving the bundle free to loop. The sessionStorage reloadGuard handles loop
      // detection persistently across reloads.
      try {
        window.__tfOrigReload = window.location.reload.bind(window.location);

        // Separate counter for the Navigation API guard — Vue Router does 1–2
        // same-pathname pushState calls during init (allowed), but the bundle
        // also fires location.replace('/') in a tight loop on settings
        // mismatch (must be blocked). Allow up to 3 same-path navs per 5s,
        // block from the 4th onwards. Counter window is rolling so legit
        // user navigation later still works.
        if (window.navigation) {
          var _navApiCalls = [];
          window.navigation.addEventListener('navigate', function(e) {
            try {
              var dest = new URL(e.destination.url);
              var current = new URL(window.location.href);
              if (dest.origin !== current.origin || dest.pathname !== current.pathname) return;
              var now = Date.now();
              _navApiCalls = _navApiCalls.filter(function(t) { return now - t < 5000; });
              _navApiCalls.push(now);
              if (_navApiCalls.length > 3) {
                console.warn('[TF-GUARD] Blocked nav-API loop (#' + _navApiCalls.length + ')');
                e.preventDefault();
              }
            } catch(ex) {}
          });
        }
      } catch(e) {}

      // Suppress known bundle errors ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â not critical (Pinia store populates after Socket.IO connects)
      // window.onerror returning true suppresses the red console error in Chrome
      // Fix: bundle reads xhr.responseText when responseType='json' which throws InvalidStateError
      try {
        var _rtDesc = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText');
        if (_rtDesc && _rtDesc.get) {
          Object.defineProperty(XMLHttpRequest.prototype, 'responseText', {
            get: function() {
              if (this.responseType === 'json') {
                try { return typeof this.response === 'string' ? this.response : JSON.stringify(this.response); }
                catch(e) { return ''; }
              }
              return _rtDesc.get.call(this);
            },
            configurable: true
          });
        }
      } catch(e) {}

      var _suppressPatterns = [
        'is not defined', 'is not a function',
        'Cannot read properties of undefined', 'Cannot read properties of null',
        'challengeRunning', 'Unexpected end of JSON',
        'checkLimit', 'responseText', 'isInViewport',
        'onChannelContextChanged', 'injectModules'
      ];
      function _isKnownError(msg) {
        if (typeof msg !== 'string') return false;
        for (var i = 0; i < _suppressPatterns.length; i++) {
          if (msg.indexOf(_suppressPatterns[i]) >= 0) return true;
        }
        return false;
      }

      // CAPTURE-PHASE error listeners — fire BEFORE the app's own handlers, can't be overwritten
      window.addEventListener('error', function(e) {
        var msg = (e.message || (e.error && e.error.message) || '');
        if (_isKnownError(msg)) {
          e.preventDefault();
          e.stopImmediatePropagation();
          console.warn('[TF-GUARD] Suppressed:', msg);
          return false;
        }
      }, true);
      window.addEventListener('unhandledrejection', function(e) {
        var msg = (e.reason && e.reason.message) ? e.reason.message : String(e.reason || '');
        if (_isKnownError(msg)) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }, true);

      // Lock window.onerror via defineProperty so the app can't overwrite our suppressor
      var _appOnerror = null;
      Object.defineProperty(window, 'onerror', {
        get: function() {
          return function(msg, src, line, col, err) {
            if (_isKnownError(typeof msg === 'string' ? msg : '')) return true;
            if (_appOnerror) return _appOnerror.call(window, msg, src, line, col, err);
          };
        },
        set: function(fn) { _appOnerror = fn; },
        configurable: true
      });

      // Auto-dismiss splash screen after 6 seconds — app hangs on "Loading your account"
      // because there's no real TikFinity backend to respond
      setTimeout(function() {
        var splash = document.getElementById('splashScreen');
        if (splash && splash.style.display !== 'none') {
          splash.style.display = 'none';
          document.body.classList.remove('hidden');
          // Also try showing main content areas
          var pages = document.getElementById('pages');
          if (pages) pages.classList.remove('hidden');
          var nav = document.getElementById('navigation-app');
          if (nav) nav.classList.remove('hidden');
          console.log('[TF-GUARD] Auto-dismissed splash screen');
        }
      }, 6000);

      // Periodically ensure session.userFeatures.isPro stays true (for Pro dialog fix)
      setInterval(function(){
        try {
          if (window.session) {
            if (window.session.userFeatures && !window.session.userFeatures.isPro) {
              window.session.userFeatures.isPro = true;
              if (window.session.userFeatures.proInfo) {
                window.session.userFeatures.proInfo.plan = 'pro';
                window.session.userFeatures.proInfo.active = true;
              }
            }
            if (window.session.subscription && !window.session.subscription.isPro) {
              window.session.subscription.isPro = true;
              window.session.subscription.plan = 'pro';
              window.session.subscription.active = true;
            }
          }
        } catch(e){}
      }, 2000);

      // DEBUG: spy on localStorage to catch who clears the auth token
      (function(){
        var _origRemove = localStorage.removeItem.bind(localStorage);
        var _origSet = localStorage.setItem.bind(localStorage);
        localStorage.removeItem = function(key) {
          if (key === 'setting_loginaccesstoken') {
            console.warn('[TF-SPY] localStorage.removeItem("setting_loginaccesstoken") called!', new Error().stack);
          }
          return _origRemove(key);
        };
        localStorage.setItem = function(key, value) {
          if (key === 'setting_loginaccesstoken' && (!value || value.length < 5)) {
            console.warn('[TF-SPY] localStorage.setItem("setting_loginaccesstoken", EMPTY) called!', new Error().stack);
          }
          return _origSet(key, value);
        };
        var _origClear = localStorage.clear.bind(localStorage);
        localStorage.clear = function() {
          console.warn('[TF-SPY] localStorage.clear() called!', new Error().stack);
          return _origClear();
        };
      })();
      window.__SENTRY__={hub:{getClient:function(){return null}}};
      window.Sentry={init:function(){},captureException:function(){},captureMessage:function(){},configureScope:function(){}};
      (function(){
        function noop(){}
        function returnFalse(){return false;}
        function returnEmptyString(){return '';}
        function returnNull(){return null;}
        function returnEmptyArray(){return [];}
        function returnEmptyObject(){return {};}
        function returnResolvedFalse(){return Promise.resolve(false);}
        function returnUnsubscribe(){return noop;}
        var posthog = window.posthog || {};
        posthog.__loaded = true;
        posthog._i = Array.isArray(posthog._i) ? posthog._i : [];
        posthog.people = posthog.people || {};

        [
          'init',
          'capture',
          'identify',
          'reset',
          'calculateEventProperties',
          'register',
          'register_once',
          'register_for_session',
          'unregister',
          'unregister_for_session',
          'reloadFeatureFlags',
          'updateEarlyAccessFeatureEnrollment',
          'renderSurvey',
          'displaySurvey',
          'setPersonProperties',
          'group',
          'resetGroups',
          'setPersonPropertiesForFlags',
          'resetPersonPropertiesForFlags',
          'setGroupPropertiesForFlags',
          'resetGroupPropertiesForFlags',
          'alias',
          'set_config',
          'startSessionRecording',
          'stopSessionRecording',
          'captureException',
          'loadToolbar',
          'createPersonProfile',
          'opt_in_capturing',
          'opt_out_capturing',
          'clear_opt_in_out_capturing',
          'debug',
          'captureTraceFeedback',
          'captureTraceMetric'
        ].forEach(function(name){
          posthog[name] = noop;
        });

        [
          'set',
          'set_once',
          'unset',
          'increment',
          'append',
          'union',
          'track_charge',
          'clear_charges',
          'delete_user'
        ].forEach(function(name){
          posthog.people[name] = noop;
        });

        var _featureFlags = {
          'new-navigation': true,
          'new-navigation-design': true
        };
        var _featureFlagPayloads = {};
        posthog.getFeatureFlag = function(flag) {
          var result = _featureFlags.hasOwnProperty(flag) ? _featureFlags[flag] : null;
          console.log('[TF-DEBUG] posthog.getFeatureFlag("' + flag + '") =>', result);
          return result;
        };
        posthog.getFeatureFlagPayload = function(flag) {
          return _featureFlagPayloads.hasOwnProperty(flag) ? _featureFlagPayloads[flag] : null;
        };
        posthog.isFeatureEnabled = function(flag) {
          return _featureFlags.hasOwnProperty(flag) ? !!_featureFlags[flag] : false;
        };
        posthog.getEarlyAccessFeatures = returnEmptyArray;
        posthog.getSurveys = returnEmptyArray;
        posthog.getActiveMatchingSurveys = returnEmptyArray;
        posthog.canRenderSurvey = returnFalse;
        posthog.canRenderSurveyAsync = returnResolvedFalse;
        posthog.get_distinct_id = returnEmptyString;
        posthog.getGroups = returnEmptyObject;
        posthog.get_session_id = returnEmptyString;
        posthog.get_session_replay_url = returnEmptyString;
        posthog.sessionRecordingStarted = returnFalse;
        posthog.get_property = returnNull;
        posthog.getSessionProperty = returnNull;
        posthog.has_opted_in_capturing = returnFalse;
        posthog.has_opted_out_capturing = returnFalse;
        posthog.get_explicit_consent_status = returnNull;
        posthog.is_capturing = returnFalse;
        posthog.getPageViewId = returnEmptyString;
        posthog.on = returnUnsubscribe;
        posthog.onFeatureFlags = function(cb) {
          try { if (typeof cb === 'function') setTimeout(function(){ cb(Object.keys(_featureFlags), _featureFlags); }, 0); } catch(e){}
          return noop;
        };
        posthog.onSurveysLoaded = returnUnsubscribe;
        posthog.onSessionId = returnUnsubscribe;

        window.posthog = posthog;
      })();
      window.Featurebase=function(){};
      window.gTag=function(){};
      window.dataLayer=window.dataLayer||[];
      if(typeof window.dataLayer.push!=='function'){window.dataLayer.push=function(){return 0;};}
      /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Navigation bridge ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
         Our app.js (prod-3-0) has VueNavigation component but exports it as
         a module (VueNavigation.default) instead of setting window.createNavigation.
         The real app.js (prod-3-7) does: window.createNavigation = (props) => Vue.createApp(component, props)
         We bridge that gap here by defining createNavigation to use VueNavigation.default
         once the bundle has loaded.
      */
      window.createNavigation = function(props) {
        /* VueNavigation is defined by the bundle's IIFE: var VueNavigation = (function(exports, Vue){...})({}, Vue)
           It sets VueNavigation.default = the Vue component.
           The legacy bundle calls createNavigation().mount('navigation-app'), so we normalize the mount target
           and lazily wait for VueNavigation if the bundle invokes us a little too early. */
        var app = null;
        var pendingMountTarget = null;
        var pendingMountTimer = null;
        var mountAttemptCount = 0;
        var proxy = null;

        function ensureLayoutVisible() {
          try {
            if (!document.body.hasAttribute('data-new-navigation-design')) {
              document.body.setAttribute('data-new-navigation-design', 'true');
            }
            var navRoot = document.getElementById('navigation-app');
            if (navRoot) {
              navRoot.classList.remove('hidden');
              if (navRoot.style.display === 'none') navRoot.style.display = '';
            }
            var pagesRoot = document.getElementById('pages');
            if (pagesRoot) {
              pagesRoot.classList.remove('hidden');
              if (pagesRoot.style.display === 'none') pagesRoot.style.display = '';
            }
          } catch (e) {}
        }

        function normalizeMountTarget(target) {
          if (!target) return target;
          if (target.nodeType === 1) return target;
          var raw = String(target);
          var trimmed = raw.trim();
          if (!trimmed) return trimmed;
          var byId = document.getElementById(trimmed.replace(/^#/, ''));
          if (byId) return byId;
          if (/^[#.\[]/.test(trimmed)) return trimmed;
          return trimmed;
        }

        function clearPendingMount() {
          if (pendingMountTimer) {
            clearInterval(pendingMountTimer);
            pendingMountTimer = null;
          }
        }

        function ensureApp() {
          if (app) return app;
          if (typeof VueNavigation === 'undefined' || !VueNavigation['default'] || typeof Vue === 'undefined' || !Vue.createApp) {
            return null;
          }

          console.log('[TF-DEBUG] createNavigation: using real VueNavigation component');
          app = Vue.createApp(VueNavigation['default'], props || {});
          if (typeof VueNavigation['setup'] === 'function') {
            try { VueNavigation['setup'](app); } catch (e) { console.warn('[TF-DEBUG] VueNavigation.setup error:', e); }
          }
          return app;
        }

        function mountRealApp(target) {
          var realApp = ensureApp();
          if (!realApp) return false;

          ensureLayoutVisible();

          if (realApp.__tfMounted) {
            return true;
          }

          var normalizedTarget = normalizeMountTarget(target);
          if (!normalizedTarget) {
            return false;
          }

          try {
            realApp.mount(normalizedTarget);
            realApp.__tfMounted = true;
            realApp.__tfMountTarget = normalizedTarget;
            clearPendingMount();
            ensureLayoutVisible();
            return true;
          } catch (e) {
            console.warn('[TF-DEBUG] createNavigation.mount failed:', e);
            return false;
          }
        }

        proxy = {
          mount: function(target) {
            pendingMountTarget = target;
            ensureLayoutVisible();

            if (mountRealApp(target)) {
              return app;
            }

            clearPendingMount();
            mountAttemptCount = 0;
            pendingMountTimer = setInterval(function() {
              mountAttemptCount += 1;
              if (mountRealApp(pendingMountTarget)) {
                return;
              }
              if (mountAttemptCount >= 120) {
                clearPendingMount();
                console.warn('[TF-DEBUG] createNavigation: timed out waiting for VueNavigation');
              }
            }, 50);

            return proxy;
          },
          unmount: function() {
            clearPendingMount();
            if (app && app.__tfMounted && typeof app.unmount === 'function') {
              try { app.unmount(); } catch (e) { console.warn('[TF-DEBUG] createNavigation.unmount failed:', e); }
              app.__tfMounted = false;
            }
          }
        };

        return proxy;
      };

      /* Safety net: ensure data-new-navigation-design is set and old sidebar is hidden */
      setTimeout(function(){
        try {
          if (!document.body.hasAttribute('data-new-navigation-design')) {
            document.body.setAttribute('data-new-navigation-design', 'true');
          }
          var pg = document.getElementById('pages');
          if (pg) { pg.classList.remove('hidden'); if (pg.style.display === 'none') pg.style.display = ''; }
        } catch(e) {}
      }, 3000);

      function normalizeTikTokName(value){
        return String(value||'').trim().replace(/^@+/,'');
      }
      function readStorage(key,fallbackValue){
        try{
          var value=localStorage.getItem(key);
          return value===null||typeof value==='undefined'?fallbackValue:value;
        }catch(e){
          return fallbackValue;
        }
      }
      function readCookie(name){
        try{
          var escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
          var match=document.cookie.match(new RegExp('(?:^|;\\s*)'+escaped+'=([^;]*)'));
          return match?decodeURIComponent(match[1]):'';
        }catch(e){
          return '';
        }
      }
      function getForcedTikTokName(){
        var value=normalizeTikTokName(
          window.__tfLastTikTokConnectName||
          readStorage('setting_tiktokname','')||
          readCookie('tf_tiktokname')||
          ''
        );
        return value||'';
      }
      function hasForcedTikTokWindow(){
        try{
          return !!window.__tfForceTikTokNameUntil&&Date.now()<window.__tfForceTikTokNameUntil;
        }catch(e){
          return false;
        }
      }
      function escapeRegExp(value){
        return String(value||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      }
      function shouldBlockUrl(rawUrl){
        if(!rawUrl)return false;
        var blockedFragments=['sentry','contentsquare','pagead','googletagmanager','google-analytics','ph.tikfinity.com','featurebase.app'];
        try{
          var parsed=new URL(rawUrl,window.location.origin);
          var full=(parsed.origin+parsed.pathname).toLowerCase();
          if(parsed.hostname.toLowerCase()==='ph.tikfinity.com')return true;
          if(full.indexOf('/i/v0/e/')>=0&&parsed.hostname.toLowerCase().indexOf('tikfinity.com')>=0)return true;
          for(var i=0;i<blockedFragments.length;i++){
            if(full.indexOf(blockedFragments[i])>=0)return true;
          }
          return false;
        }catch(e){
          var lowered=String(rawUrl).toLowerCase();
          for(var j=0;j<blockedFragments.length;j++){
            if(lowered.indexOf(blockedFragments[j])>=0)return true;
          }
          return false;
        }
      }
      function needsAuth(rawUrl){
        if(!rawUrl)return false;
        try{
          var parsed=new URL(rawUrl,window.location.origin);
          return parsed.origin===window.location.origin&&(parsed.pathname==='/api'||parsed.pathname.indexOf('/api/')===0||parsed.pathname.indexOf('/hub')===0);
        }catch(e){
          return false;
        }
      }
      function looksLikeTikTokConnectRequest(rawUrl, payload){
        if(!hasForcedTikTokWindow())return false;
        var hay=(String(rawUrl||'')+' '+String(payload||'')).toLowerCase();
        return hay.indexOf('api-live')>=0||
          hay.indexOf('room_id')>=0||
          hay.indexOf('uniqueid')>=0||
          hay.indexOf('tiktok')>=0||
          hay.indexOf('connect')>=0||
          hay.indexOf('channelname')>=0||
          hay.indexOf('username')>=0;
      }
      function rewriteTikTokConnectString(value, rawUrl){
        if(typeof value!=='string'||!looksLikeTikTokConnectRequest(rawUrl,value))return value;
        var forced=getForcedTikTokName();
        if(!forced)return value;
        var account=normalizeTikTokName(readStorage('setting_channelname',''));
        var next=String(value);
        ['testuser',account].forEach(function(source){
          if(!source||source===forced)return;
          var escaped=escapeRegExp(source);
          next=next.replace(new RegExp('@'+escaped+'\\b','gi'),'@'+forced);
          next=next.replace(new RegExp('(\"(?:username|uniqueId|tiktokUsername|channelName)\"\\s*:\\s*\")'+escaped+'(\"?)','gi'),'$1'+forced+'$2');
          next=next.replace(new RegExp('((?:username|uniqueId|tiktokUsername|channelName)=)'+escaped+'\\b','gi'),'$1'+forced);
        });
        return next;
      }
      function rewriteKnownRemoteUrl(rawUrl){
        if(!rawUrl||typeof rawUrl!=='string')return rawUrl;
        try{
          var parsed=new URL(rawUrl,window.location.origin);
          if(parsed.origin===window.location.origin)return rawUrl;
          if(parsed.hostname.toLowerCase()==='auth.zerody.one'){
            return parsed.pathname+parsed.search+parsed.hash;
          }
          var lowerHost=parsed.hostname.toLowerCase();
          if(lowerHost==='myinstantsapi.zerody.one'){
            return '/myinstants-proxy'+parsed.pathname+parsed.search+parsed.hash;
          }
          if(lowerHost.endsWith('.zerody.one')&&!lowerHost.startsWith('tikfinity-cws')&&(parsed.pathname==='/api'||parsed.pathname.indexOf('/api/')===0)){
            return parsed.pathname+parsed.search+parsed.hash;
          }
        }catch(e){}
        return rawUrl;
      }
      var _sendBeacon=navigator.sendBeacon&&navigator.sendBeacon.bind(navigator);
      if(_sendBeacon){
        navigator.sendBeacon=function(url,data){
          if(shouldBlockUrl(url))return true;
          return _sendBeacon(url,data);
        };
      }
      var _appendChild=Node.prototype.appendChild;
      Node.prototype.appendChild=function(node){
        try{
          var src=node&&node.tagName==='SCRIPT'?(node.src||node.getAttribute('src')||''):'';
          if(src&&shouldBlockUrl(src))return node;
        }catch(e){}
        return _appendChild.apply(this,arguments);
      };
      var _insertBefore=Node.prototype.insertBefore;
      Node.prototype.insertBefore=function(node,referenceNode){
        try{
          var src=node&&node.tagName==='SCRIPT'?(node.src||node.getAttribute('src')||''):'';
          if(src&&shouldBlockUrl(src))return node;
        }catch(e){}
        return _insertBefore.apply(this,arguments);
      };
      try{
        var scriptSrcDescriptor=Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,'src');
        if(scriptSrcDescriptor&&scriptSrcDescriptor.configurable&&scriptSrcDescriptor.set){
          Object.defineProperty(HTMLScriptElement.prototype,'src',{
            configurable:true,
            enumerable:scriptSrcDescriptor.enumerable,
            get:function(){return scriptSrcDescriptor.get.call(this);},
            set:function(value){
              if(shouldBlockUrl(value)){
                this.setAttribute('data-tf-blocked-src',String(value||''));
                return value;
              }
              return scriptSrcDescriptor.set.call(this,value);
            }
          });
        }
      }catch(e){}
      var _open=XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open=function(m,u){
        this._tfMethod=String(m||'').toUpperCase();
        this._tfUrl=rewriteKnownRemoteUrl(u);
        this._tfHasAuth=false;
        if(shouldBlockUrl(this._tfUrl)){this._blocked=true;return;}
        arguments[1]=this._tfUrl;
        return _open.apply(this,arguments);
      };
      var _setRequestHeader=XMLHttpRequest.prototype.setRequestHeader;
      XMLHttpRequest.prototype.setRequestHeader=function(name,value){
        if(name&&String(name).toLowerCase()==='authorization')this._tfHasAuth=true;
        return _setRequestHeader.apply(this,arguments);
      };
      var _send=XMLHttpRequest.prototype.send;
      function _markProfileSwitchIfApplicable(method, url, body) {
        try {
          if (method !== 'POST' || !url || !/\/api\/me(\?|$)/.test(url)) return;
          if (typeof body !== 'string' || body.indexOf('profileId') < 0) return;
          var parsed = JSON.parse(body);
          if (parsed && typeof parsed.profileId === 'number' && parsed.profileId > 0) {
            localStorage.setItem('__tf_post_switch_ts', String(Date.now()));
            // Show overlay immediately — user gets instant feedback before
            // the reload fires, and the overlay persists across page reloads
            // because each page re-injects it from the localStorage flag.
            if (window.__tfShowSwitchOverlay) window.__tfShowSwitchOverlay();
            console.log('[TF-Switch] profileId=' + parsed.profileId + ' overlay shown');
          }
        } catch(e) {}
      }
      XMLHttpRequest.prototype.send=function(body){
        if(this._blocked)return;
        _markProfileSwitchIfApplicable(this._tfMethod, this._tfUrl, body);
        // BLOCK updateSettings XHR ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â silently drop, no callback, no reload
        body=rewriteTikTokConnectString(body,this._tfUrl);
        try{
          var token=(window.__tfReadAccessToken ? window.__tfReadAccessToken() : '') || localStorage.getItem('setting_loginaccesstoken');
          if(token&&!this._tfHasAuth&&needsAuth(this._tfUrl)){
            _setRequestHeader.call(this,'Authorization','Bearer '+token);
            this._tfHasAuth=true;
          }
        }catch(e){}
        arguments[0]=body;
        return _send.apply(this,arguments);
      };
      var _fetch=window.fetch;
      window.fetch=function(url,opts){
        var rawUrl=typeof url==='string'?url:(url&&url.url)||'';
        rawUrl=rewriteKnownRemoteUrl(rawUrl);
        if(typeof url==='string')url=rawUrl;
        if(shouldBlockUrl(rawUrl))return Promise.resolve(new Response('',{status:200}));
        // Block updateSettings via fetch ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â never resolve (prevents settings.restore reload)
        try{
          var token=(window.__tfReadAccessToken ? window.__tfReadAccessToken() : '') || localStorage.getItem('setting_loginaccesstoken');
          var nextOpts=Object.assign({},opts||{});
          if(typeof nextOpts.body==='string'){
            nextOpts.body=rewriteTikTokConnectString(nextOpts.body,rawUrl);
          }
          _markProfileSwitchIfApplicable(String((nextOpts.method||'GET')).toUpperCase(), rawUrl, nextOpts.body);
          if(token&&needsAuth(rawUrl)){
            var headers=new Headers(nextOpts.headers||(url&&url.headers)||undefined);
            if(!headers.has('Authorization'))headers.set('Authorization','Bearer '+token);
            nextOpts.headers=headers;
            return _fetch.call(this,url,nextOpts);
          }
          return _fetch.call(this,url,nextOpts);
        }catch(e){}
        return _fetch.apply(this,arguments);
      };
    })();
    </script>
    """;

    var authScript = $$"""
    <script>
    (function(){
      var defaultChannelId = "{{defaultChannelId}}";
      var defaultChannelName = "{{defaultChannelName}}";
      var authCookieMap = {
        setting_loginaccesstoken: 'tf_login_token',
        setting_channelid: 'tf_channelid',
        setting_channelname: 'tf_channelname',
        setting_ispro: 'tf_ispro',
        setting_locale: 'tf_locale',
        setting_tiktokname: 'tf_tiktokname',
        setting_email: 'tf_email',
        setting_channelsignature: 'tf_channelsignature',
        setting_owneruserid: 'tf_owneruserid',
        setting_featurebasetoken: 'tf_featurebasetoken',
        setting_pendinglogin: 'tf_pendinglogin'
      };

      function readCookie(name) {
        try {
          var escaped = String(name || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          var match = document.cookie.match(new RegExp('(?:^|;\\s*)' + escaped + '=([^;]*)'));
          return match ? decodeURIComponent(match[1]) : '';
        } catch (e) {
          return '';
        }
      }

      function writeCookie(name, value) {
        try {
          document.cookie = String(name) + '=' + encodeURIComponent(String(value || '')) + '; path=/; max-age=' + (60 * 60 * 24 * 30) + '; SameSite=Lax';
        } catch (e) {}
      }

      function clearCookie(name) {
        try {
          document.cookie = String(name) + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        } catch (e) {}
      }

      function readPersistedValue(key, fallbackValue) {
        var value = fallbackValue;
        try {
          value = localStorage.getItem(key);
        } catch (e) {}
        if (value === null || typeof value === 'undefined' || value === '') {
          var cookieName = authCookieMap[key];
          if (cookieName) {
            var cookieValue = readCookie(cookieName);
            if (cookieValue !== '') {
              return cookieValue;
            }
          }
          return fallbackValue;
        }
        return value;
      }

      function persistValue(key, value) {
        try {
          if (value !== null && typeof value !== 'undefined') {
            localStorage.setItem(key, String(value));
          }
        } catch (e) {}
        var cookieName = authCookieMap[key];
        if (cookieName && value !== null && typeof value !== 'undefined') {
          writeCookie(cookieName, value);
        }
      }

      function clearPersistedAuth() {
        [
          'setting_loginaccesstoken',
          'setting_loginaccesstokenprovider',
          'setting_pendinglogin',
          'setting_channelid',
          'setting_channelname',
          'setting_tiktokname',
          'setting_email',
          'setting_owneruserid',
          'setting_featurebasetoken',
          'setting_dynamicsettings',
          'setting_channelsignature',
          'setting_ispro',
          'setting_locale'
        ].forEach(function(key) {
          try { localStorage.removeItem(key); } catch (e) {}
          if (authCookieMap[key]) {
            clearCookie(authCookieMap[key]);
          }
        });
      }
      window.__tfClearPersistedAuth = clearPersistedAuth;

      function readStorage(key, fallbackValue) {
        return readPersistedValue(key, fallbackValue);
      }
      window.__tfReadPersistedValue = readPersistedValue;
      window.__tfPersistValue = persistValue;

      function readAccessToken() {
        return readStorage('setting_loginaccesstoken', '');
      }
      window.__tfReadAccessToken = readAccessToken;

      window.__tfGetAuthHeaders = function(extraHeaders) {
        var headers = Object.assign({}, extraHeaders || {});
        var token = readAccessToken();
        if (token) {
          headers.Authorization = 'Bearer ' + token;
        }
        return headers;
      };

      function writeStoredBasics(channelId, channelName, isPro, locale, signature) {
        if (channelId) persistValue('setting_channelid', String(channelId));
        if (channelName) persistValue('setting_channelname', String(channelName));
        if (typeof isPro !== 'undefined') persistValue('setting_ispro', isPro ? 'true' : 'false');
        if (locale) persistValue('setting_locale', String(locale));
        if (signature) persistValue('setting_channelsignature', String(signature));
      }

      function readStoredJson(key, fallbackValue) {
        try {
          var raw = localStorage.getItem(key);
          if (!raw) return fallbackValue;
          var parsed = JSON.parse(raw);
          return parsed && typeof parsed === 'object' ? parsed : fallbackValue;
        } catch (e) {
          return fallbackValue;
        }
      }

      function parsePositiveInt(value, fallbackValue) {
        var parsed = parseInt(String(value == null ? '' : value), 10);
        return parsed > 0 ? parsed : fallbackValue;
      }

      function toBase64Url(value) {
        try {
          return btoa(unescape(encodeURIComponent(String(value))))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, '');
        } catch (e) {
          return '';
        }
      }

      function buildPseudoJwt(payload) {
        var header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        var body = toBase64Url(JSON.stringify(payload || {}));
        if (!header || !body) return '';
        return header + '.' + body + '.local';
      }

      function buildFeaturebaseToken(channelName, channelId, email) {
        var stored = readStorage('setting_featurebasetoken', '');
        if (stored) return stored;
        return buildPseudoJwt({
          name: channelName || 'user',
          email: email || '',
          userId: String(channelId || '0'),
          iat: Math.floor(Date.now() / 1000)
        });
      }

      function buildSafeDynamicSettings(baseSettings, channelName, featurebaseToken, ownerUserId) {
        var settings = Object.assign({
          events: '[]',
          timer: '[]',
          soundsdatasource: '[]',
          widget_wheelofactions_wheels: '[]',
          wheelcustomsegments: '[]',
          widget_socialmediarotator_socials: '[]',
          'FBVisitedChangelogsTracker-tikfinity': '{"shownChangelogs":[],"unviewedChangelogs":[]}',
          featurebaseIdentifyData: '{}'
        }, baseSettings || {});

        if (!settings.profilechannelname && channelName) {
          settings.profilechannelname = channelName;
        }
        if (!settings.textboxchannelname && channelName) {
          settings.textboxchannelname = '@' + channelName;
        }
        if (!settings.owneruserid) {
          settings.owneruserid = ownerUserId || '';
        }
        if (!settings.featurebaseGlobalAuth && featurebaseToken) {
          settings.featurebaseGlobalAuth = JSON.stringify({
            organization: 'tikfinity',
            jwt: featurebaseToken
          });
        }

        return settings;
      }

      function buildFallbackPayload() {
        var token = readStorage('setting_loginaccesstoken', '');
        var storedChannelId = readStorage('setting_channelid', '');
        var storedChannelName = readStorage('setting_channelname', '');
        var hasStoredIdentity = !!storedChannelId || !!storedChannelName || readStorage('setting_pendinglogin', '') === '1';
        var channelId = readStorage('setting_channelid', String(defaultChannelId || '1'));
        var profileId = parsePositiveInt(readStorage('setting_profileid', '1'), 1);
        var accountChannelName = readStorage('setting_channelname', defaultChannelName || 'user');
        var tiktokName = readStorage('setting_tiktokname', '');
        var locale = readStorage('setting_locale', 'VN');
        var signature = readStorage('setting_channelsignature', '');
        var email = readStorage('setting_email', '');
        var isPro = readStorage('setting_ispro', 'true') !== 'false';
        var channelName = tiktokName || accountChannelName;
        var featureBaseToken = buildFeaturebaseToken(channelName, channelId, email);
        var dynamicSettings = buildSafeDynamicSettings(
          readStoredJson('setting_dynamicsettings', {}),
          channelName,
          featureBaseToken,
          readStorage('setting_owneruserid', '')
        );

        return {
          status: 200,
          message: 'OK',
          channelId: channelId,
          profileId: profileId,
          isPro: isPro,
          channelName: channelName,
          accountChannelName: accountChannelName,
          tiktokUsername: tiktokName,
          channel: {
            ChannelId: channelId,
            channelId: channelId,
            ProfileId: profileId,
            profileId: profileId,
            ChannelName: channelName,
            channelName: channelName,
            AccountChannelName: accountChannelName,
            accountChannelName: accountChannelName,
            TiktokUsername: tiktokName,
            tiktokUsername: tiktokName,
            ChannelSignature: signature,
            channelSignature: signature,
            Email: email,
            email: email,
            Locale: locale,
            locale: locale,
            dynamicSettings: dynamicSettings,
            dynamicProfileSettings: [],
            challengeRunning: false,
            challengeName: null,
            challengeStartAt: null,
            isChatbotApproved: false,
            catchApplied: false,
            catchEnabled: false,
            catchEnabledInGrid: true,
            catchEnabledAt: null,
            catchProEnabled: false,
            catchProEnabledAt: null,
            catchRandom: 5,
            isCatchAdmin: false,
            halvingLastExecutionAt: null,
            customInfoText: null,
            patreonUserId: null,
            discordUsername: null,
            bmcEmail: null,
            lmSubscriptionId: null,
            monthlyEarnings: 0,
            monthlyEarningsMax: 0,
            streamGifter: 0,
            streamGifterMax: 0,
            lastActiveProDate: null,
            firstActiveProDate: null,
            lastActiveProInfo: null,
            proCanceledAt: null,
            banReason: null,
            upgradeIntent: null,
            upgradeIntentUpdatedAt: null,
            paymentMethodSelected: null,
            paymentMethodSelectedAt: null,
            specialProOfferPrice: null,
            trialStartedAt: null,
            trialExpiresAt: null,
            trialOfferNotificationSentAt: null,
            profiles: [],
            proExpireAt: null,
            proExpireSetBy: null
          },
          channeluser: null,
          userFeatures: { isPro: isPro, proInfo: { plan: isPro ? 'pro' : 'free', active: isPro } },
          profile: null,
          cookieAuth: !!readStorage('setting_loginaccesstoken', ''),
          wsAuthToken: readStorage('setting_loginaccesstoken', ''),
          discordVerifyToken: signature,
          countryCode: locale,
          overloadSettings: { enabled: false, suffixIds: [0,1,2,3,4,5,6,7,8,9], minAccountAge: 5 },
          activePromotions: [],
          mobileVoucherCode: '',
          isTrialAvailable: false,
          hasActiveTrial: false,
          trialEnded: false,
          trialInfo: null,
          featureBaseToken: featureBaseToken,
          subscription: { isPro: isPro, plan: isPro ? 'pro' : 'free', active: isPro }
        };
      }

      function applySessionPayload(payload) {
        if (!payload) return;

        // If the API returned unauthenticated response (channelId=0), don't write to localStorage
        if (payload.channelId === 0 && !payload.wsAuthToken) {
          window.session = window.session || {};
          window.session.channelId = 0;
          window.session.channelName = '';
          var _guestChannel = { channelId: 0, channelName: '', challengeRunning: false, challengeName: null, challengeStartAt: null, dynamicSettings: {}, profiles: [], subscription: { isPro: false, plan: '', active: false }, userFeatures: { isPro: false, proInfo: { plan: '', active: false } } };
          window.session.channel = _guestChannel;
          window.session.me = _guestChannel;
          window.session.userFeatures = _guestChannel.userFeatures;
          window.session.subscription = _guestChannel.subscription;
          window.tfPageloadData = window.tfPageloadData || {};
          window.tfPageloadData.me = { channelId: 0, channelName: '', isPro: false, channel: _guestChannel, userFeatures: _guestChannel.userFeatures, subscription: _guestChannel.subscription };
          return;
        }

        var channel = payload.channel || {};
        var channelId = payload.channelId || channel.channelId || channel.ChannelId || readStorage('setting_channelid', String(defaultChannelId || '1'));
        var accountChannelName =
          channel.accountChannelName ||
          channel.AccountChannelName ||
          payload.accountChannelName ||
          readStorage('setting_channelname', defaultChannelName || 'user');
        var tiktokName =
          channel.tiktokUsername ||
          channel.TiktokUsername ||
          payload.tiktokUsername ||
          (channel.dynamicSettings && channel.dynamicSettings.setting_tiktokname) ||
          readStorage('setting_tiktokname', '');
        var channelName = tiktokName || channel.channelName || channel.ChannelName || payload.channelName || accountChannelName;
        var activeProfileId = parsePositiveInt(
          channel.profileId ||
          channel.ProfileId ||
          payload.profileId ||
          readStorage('setting_profileid', '1'),
          1
        );
        var signature = channel.channelSignature || channel.ChannelSignature || readStorage('setting_channelsignature', '');
        var locale = channel.locale || channel.Locale || payload.countryCode || readStorage('setting_locale', 'VN');
        var isPro = typeof payload.isPro === 'boolean'
          ? payload.isPro
          : !!(payload.subscription && payload.subscription.isPro) ||
            !!(payload.userFeatures && payload.userFeatures.isPro) ||
            true;

        writeStoredBasics(channelId, accountChannelName || channelName, isPro, locale, signature);
        try {
          persistValue('setting_profileid', String(activeProfileId));
          sessionStorage.setItem('setting_channelid', String(channelId));
          sessionStorage.setItem('setting_profileid', String(activeProfileId));
          if (tiktokName) persistValue('setting_tiktokname', String(tiktokName));
          if ((channel.Email || channel.email)) persistValue('setting_email', String(channel.Email || channel.email));
          if ((channel.OwnerUserId || channel.ownerUserId)) persistValue('setting_owneruserid', String(channel.OwnerUserId || channel.ownerUserId));
          if (payload.featureBaseToken) persistValue('setting_featurebasetoken', String(payload.featureBaseToken));
        } catch (e) {}
        if (tiktokName) {
          try { window.__tfLastTikTokConnectName = String(tiktokName); } catch (e) {}
        }

        var dynamicSettings = buildSafeDynamicSettings(
          channel.dynamicSettings || {},
          channelName,
          payload.featureBaseToken || buildFeaturebaseToken(channelName, channelId, channel.Email || channel.email || readStorage('setting_email', '')),
          channel.OwnerUserId || channel.ownerUserId || readStorage('setting_owneruserid', '')
        );
        try {
          localStorage.setItem('setting_dynamicsettings', JSON.stringify(dynamicSettings));
        } catch (e) {}

        window.session = window.session || {};
        window.session.channelId = channelId;
        window.session.profileId = activeProfileId;
        window.session.channelName = channelName;
        window.session.accountChannelName = accountChannelName || channelName;
        window.session.tiktokUsername = tiktokName || '';
        window.session.featureBaseToken = payload.featureBaseToken || buildFeaturebaseToken(channelName, channelId, channel.Email || channel.email || readStorage('setting_email', ''));
        window.session.me = Object.assign({
          challengeRunning: false,
          challengeName: null,
          challengeStartAt: null,
          ChallengeRunning: false,
          ChallengeName: null,
          ChallengeStartAt: null
        }, channel, {
          ChannelId: channelId,
          channelId: channelId,
          ProfileId: activeProfileId,
          profileId: activeProfileId,
          ChannelName: channelName,
          channelName: channelName,
          AccountChannelName: accountChannelName || channelName,
          accountChannelName: accountChannelName || channelName,
          TiktokUsername: tiktokName || '',
          tiktokUsername: tiktokName || '',
          ChannelSignature: signature,
          channelSignature: signature,
          Locale: locale,
          locale: locale,
          dynamicSettings: dynamicSettings,
          profiles: channel.profiles || []
        });
        window.session.channel = window.session.me;
        window.session.channeluser = payload.channeluser || null;
        window.session.userFeatures = payload.userFeatures || { isPro: isPro, proInfo: { plan: 'local', active: true } };
        window.session.profile = payload.profile || null;
        window.session.subscription = payload.subscription || { isPro: isPro, plan: 'local', active: true };
        window.session.cookieAuth = !!payload.cookieAuth;
        window.session.wsAuthToken = payload.wsAuthToken || '';
        window.session.discordVerifyToken = payload.discordVerifyToken || '';
        window.session.countryCode = payload.countryCode || locale || 'VN';

        window.tfPageloadData = window.tfPageloadData || {};
        window.tfPageloadData.me = Object.assign({}, payload, {
          profileId: activeProfileId,
          channelName: channelName,
          accountChannelName: accountChannelName || channelName,
          tiktokUsername: tiktokName || '',
          channel: window.session.me
        });
      }

      // Dedupe hydrate calls — bootAuthBridge / __tfApplyAuthState / DOMContentLoaded
      // all kick this off in the same tick. Sharing the in-flight promise (plus
      // a short cooldown after success) prevents three back-to-back /api/me hits
      // that each apply a fresh session payload, causing visible state shake.
      var _hydrateInflight = null;
      var _hydrateLastDoneAt = 0;
      var HYDRATE_COOLDOWN_MS = 1500;

      function hydrateFromApi() {
        if (!window.fetch) return Promise.resolve(buildFallbackPayload());

        // Share in-flight promise
        if (_hydrateInflight) return _hydrateInflight;

        // Cooldown — recent hydrate result is still fresh
        if (Date.now() - _hydrateLastDoneAt < HYDRATE_COOLDOWN_MS) {
          return Promise.resolve(window.session || buildFallbackPayload());
        }

        // No auth token → don't call API, use guest fallback
        var _authToken = readStorage('setting_loginaccesstoken', '');
        if (!_authToken || _authToken.length < 10) {
          console.log('[TF-Auth] No auth token, skipping API hydrate');
          var _guestPayload = buildFallbackPayload();
          applySessionPayload(_guestPayload);
          return Promise.resolve(_guestPayload);
        }

        _hydrateInflight = window.fetch('/api/me', {
          method: 'GET',
          credentials: 'same-origin',
          headers: window.__tfGetAuthHeaders()
        })
        .then(function(response) {
          if (!response || !response.ok) throw new Error('me_failed');
          return response.json();
        })
        .then(function(data) {
          applySessionPayload(data);
          return data;
        })
        .catch(function(error) {
          console.warn('[TF-Auth] Safe hydrate fallback:', error && error.message ? error.message : error);
          var fallback = buildFallbackPayload();
          applySessionPayload(fallback);
          return fallback;
        })
        .then(function(result) {
          _hydrateLastDoneAt = Date.now();
          _hydrateInflight = null;
          return result;
        });

        return _hydrateInflight;
      }

      function bootAuthBridge() {
        applySessionPayload(buildFallbackPayload());
        hydrateFromApi();
      }

      // Only auto-populate defaults if user has a valid auth token
      try {
        var hasToken = readStorage('setting_loginaccesstoken', '');
        if (hasToken && hasToken.length > 10 && !readStorage('setting_channelid', '')) {
          persistValue('setting_channelid', String(defaultChannelId || '1'));
          persistValue('setting_channelname', defaultChannelName || 'user');
          persistValue('setting_ispro', 'true');
          persistValue('setting_locale', 'VN');
        }
      } catch (e) {}

      window.__tfApplyAuthState = function(data, user) {
        // Remove tf-logged-out → hides guest topbar, shows Vue topbar
        document.body.classList.remove('tf-logged-out');
        try {
          if (data && data.accessToken) persistValue('setting_loginaccesstoken', data.accessToken);
          persistValue('setting_pendinglogin', '1');
          persistValue('setting_channelid', String((data && data.channelId) || readStorage('setting_channelid', String(defaultChannelId || '1'))));
          persistValue('setting_channelname', (data && data.channelName) || user || readStorage('setting_channelname', defaultChannelName || 'user'));
          if (data && data.email) persistValue('setting_email', data.email);
          persistValue('setting_ispro', data && data.isPro === false ? 'false' : 'true');
          persistValue('setting_locale', 'VN');
        } catch (e) {}

        applySessionPayload(buildFallbackPayload());
        return hydrateFromApi();
      };

      window.__tfClearAuthState = function() {
        try {
          window.session = window.session || {};
          window.session.channelId = 0;
          window.session.channelName = '';
          window.session.accountChannelName = '';
          window.session.tiktokUsername = '';
          window.session.featureBaseToken = '';
          window.session.me = { channelId: 0, channelName: '', challengeRunning: false, challengeName: null, challengeStartAt: null, dynamicSettings: {}, profiles: [] };
          window.session.channel = window.session.me;
          window.session.channeluser = null;
          window.session.userFeatures = { isPro: false, proInfo: { plan: 'free', active: false } };
          window.session.subscription = { isPro: false, plan: 'free', active: false };
          window.session.profile = null;
          window.session.wsAuthToken = '';
          window.session.discordVerifyToken = '';
        } catch (e) {}
      };

      // Check if user has a valid token → toggle tf-logged-out class early
      try {
        var _earlyToken = readStorage('setting_loginaccesstoken', '');
        if (_earlyToken && _earlyToken.length > 10) {
          document.body.classList.remove('tf-logged-out');
          console.log('[TF-Auth] Token found, removing tf-logged-out');
        } else {
          console.log('[TF-Auth] No token, staying in guest mode');
        }
      } catch (e) {}

      // Set session data IMMEDIATELY (synchronous)
      try {
        var _earlyPayload = buildFallbackPayload();
        console.log('[TF-Auth] Early init: channelId=' + _earlyPayload.channelId);
        applySessionPayload(_earlyPayload);
      } catch (e) { console.warn('[TF-Auth] Early session init error:', e); }

      // Then hydrate from API async (updates session after API response)
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { hydrateFromApi(); }, { once: true });
      } else {
        setTimeout(function() { hydrateFromApi(); }, 0);
      }
    })();
    </script>
    """;

    // Custom login/register popup (matches TikFinity dark theme)
    var loginPopupScript = """
    <style>
      /* Hide Google login button and original auth popup */
      .btnLoginGoogle, .btn-google-login, [data-pageid="google"],
      .menuitemain[data-pageid="google"], a[href*="google"] .menuitem-icon,
      .dx-popup-wrapper.authPopup, #buttonLoginWithGoogle { display: none !important; }

      /* Custom auth popup - matches TikFinity dx.dark theme */
      #customLoginOverlay {
        display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.65); z-index: 99999; justify-content: center; align-items: center;
      }
      #customLoginOverlay.show { display: flex; }
      #customLoginBox {
        background: #2a2a2a; border: 1px solid #444; border-radius: 8px; padding: 28px 32px; width: 380px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6); color: #dedede; font-family: 'Outfit', 'Segoe UI', sans-serif;
      }
      #customLoginBox h2 {
        margin: 0 0 20px; text-align: center; font-size: 20px; font-weight: 600;
        color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px;
      }
      #customLoginBox h2::before {
        content: ''; display: inline-block; width: 28px; height: 28px;
        background: url('/img/tikfinity.png') center/contain no-repeat;
      }

      /* Tabs */
      .auth-tabs { display: flex; margin-bottom: 20px; border-bottom: 1px solid #444; }
      .auth-tab {
        flex: 1; padding: 10px; text-align: center; cursor: pointer; font-size: 13px;
        font-weight: 600; color: #7c7c7c; border-bottom: 2px solid transparent; margin-bottom: -1px;
        transition: color 0.2s, border-color 0.2s;
      }
      .auth-tab:hover { color: #dedede; }
      .auth-tab.active { color: #1ca8dd; border-bottom-color: #1ca8dd; }

      /* Form panels */
      .auth-panel { display: none; }
      .auth-panel.active { display: block; }

      #customLoginBox .field { margin-bottom: 14px; }
      #customLoginBox label { display: block; margin-bottom: 5px; font-size: 12px; color: #7c7c7c; text-transform: uppercase; letter-spacing: 0.5px; }
      #customLoginBox input {
        width: 100%; padding: 9px 12px; border: 1px solid #444; border-radius: 4px;
        background: #212121; color: #dedede; font-size: 14px; outline: none; box-sizing: border-box;
        font-family: inherit; transition: border-color 0.2s;
      }
      #customLoginBox input:focus { border-color: #1ca8dd; }
      #customLoginBox input::placeholder { color: #4d4d4d; }
      .auth-submit-btn {
        width: 100%; padding: 10px; border: none; border-radius: 4px; cursor: pointer;
        background: #1ca8dd; color: #fff;
        font-size: 14px; font-weight: 600; margin-top: 8px; transition: background 0.2s;
        font-family: inherit;
      }
      .auth-submit-btn:hover { background: #1997c6; }
      .auth-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .auth-error { color: #d9534f; font-size: 13px; margin-top: 10px; text-align: center; display: none; }
      .auth-success { color: #5cb85c; font-size: 13px; margin-top: 10px; text-align: center; display: none; }
      .auth-close {
        position: absolute; top: 12px; right: 16px; background: none; border: none;
        color: #7c7c7c; font-size: 20px; cursor: pointer; line-height: 1;
      }
      .auth-close:hover { color: #dedede; }
    </style>

    <div id="customLoginOverlay">
      <div id="customLoginBox" style="position:relative;">
        <button class="auth-close" onclick="document.getElementById('customLoginOverlay').classList.remove('show')">&times;</button>
        <h2>TikFinity</h2>
        <div style="text-align:center; color:#7c7c7c; font-size:13px; margin:-10px 0 18px;">Đăng nhập bằng Serial Key</div>

        <!-- KEY LOGIN -->
        <div id="panelLogin" class="auth-panel active">
          <div class="field">
            <label>Serial Key <span style="color:#d9534f;">*</span></label>
            <input type="text" id="loginUser" placeholder="XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX" autocomplete="off" autocapitalize="characters" spellcheck="false" style="font-family:monospace; letter-spacing:1px; text-transform:uppercase;" />
          </div>
          <div class="field">
            <label>Key Code <span style="color:#7c7c7c; text-transform:none;">(tùy chọn)</span></label>
            <input type="text" id="loginPass" placeholder="Bỏ trống nếu key chưa có code" autocomplete="off" autocapitalize="characters" spellcheck="false" style="font-family:monospace; letter-spacing:1px; text-transform:uppercase;" />
          </div>
          <button class="auth-submit-btn" id="loginBtn" onclick="doLogin()">Kích hoạt &amp; Đăng nhập</button>
          <div class="auth-error" id="loginError"></div>
          <div class="auth-success" id="loginSuccess"></div>
          <div style="text-align:center; color:#7c7c7c; font-size:11px; margin-top:18px; line-height:1.6;">
            Chưa có Serial Key? Liên hệ admin để mua/gia hạn gói TikFinity Pro.
          </div>
        </div>
      </div>
    </div>

    <script>
    function switchAuthTab(_tab) { /* legacy stub — only key-login panel exists */ }

    function readPersistedUiValue(key, fallbackValue) {
      try {
        if (window.__tfReadPersistedValue) {
          return window.__tfReadPersistedValue(key, fallbackValue);
        }
      } catch (e) {}
      try {
        var value = localStorage.getItem(key);
        return (value === null || typeof value === 'undefined' || value === '') ? fallbackValue : value;
      } catch (e) {
        return fallbackValue;
      }
    }

    function persistUiValue(key, value) {
      try {
        if (window.__tfPersistValue) {
          window.__tfPersistValue(key, value);
          return;
        }
      } catch (e) {}
      try {
        if (value !== null && typeof value !== 'undefined') {
          localStorage.setItem(key, String(value));
        }
      } catch (e) {}
    }

    function authSuccess(data, user) {
      try {
        var overlay = document.getElementById('customLoginOverlay');
        if (overlay) overlay.classList.remove('show');
        ['loginSuccess', 'regSuccess', 'loginError', 'regError'].forEach(function(id) {
          var el = document.getElementById(id);
          if (el) {
            el.textContent = '';
            el.style.display = 'none';
          }
        });
      } catch (e) {}
      if (data && data.accessToken) persistUiValue('setting_loginaccesstoken', data.accessToken);
      persistUiValue('setting_loginaccesstokenprovider', 'authapi');
      persistUiValue('setting_pendinglogin', '1');
      persistUiValue('setting_channelid', String(data.channelId || '1'));
      persistUiValue('setting_channelname', data.channelName || user);
      persistUiValue('setting_ispro', data && data.isPro === false ? 'false' : 'true');
      persistUiValue('setting_locale', 'VN');
      var finish = function() {
        // Clear pending login flag before reload to prevent loop
        try { localStorage.removeItem('setting_pendinglogin'); } catch(e) {}
        // Reset the reload-guard counter so the bundle can do its bootstrap reload on the new page.
        // Without this, if count >= MAX_VISIBLE was already reached, the bundle's first post-login
        // reload attempt would be blocked, causing the UI to stay in a stale state.
        try { if (window.TFS && window.TFS.__reloadGuard) window.TFS.__reloadGuard.reset(); } catch(e) {}
        // Use original reload to bypass the guard (guard blocks bundle's settings.restore, not auth)
        window.__tfAuthReloading = true;
        var doReload = window.__tfOrigReload || window.location.reload.bind(window.location);
        setTimeout(function() { doReload(); }, 300);
      };
      if (window.__tfApplyAuthState) {
        Promise.resolve(window.__tfApplyAuthState(data, user)).then(finish, finish);
      } else {
        finish();
      }
    }

    function doLogin() {
      var keyId = (document.getElementById('loginUser').value || '').trim().toUpperCase();
      var keyCode = (document.getElementById('loginPass').value || '').trim().toUpperCase();
      var btn = document.getElementById('loginBtn');
      var errDiv = document.getElementById('loginError');
      var okDiv = document.getElementById('loginSuccess');
      errDiv.style.display = 'none'; okDiv.style.display = 'none';

      if (!keyId) {
        errDiv.textContent = 'Vui lòng nhập Serial Key';
        errDiv.style.display = 'block';
        return;
      }

      btn.disabled = true; btn.textContent = 'Đang xác thực...';

      var body = { keyId: keyId };
      if (keyCode) body.keyCode = keyCode;

      fetch('/api/auth/key-login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      .then(function(r) { return r.json().then(function(d){ return { status: r.status, body: d }; }); })
      .then(function(res) {
        var data = res.body || {};
        if (res.status >= 200 && res.status < 300 && data.status === 'ok' && data.accessToken) {
          if (data.license) {
            try {
              localStorage.setItem('setting_license_keyid', data.license.keyId || keyId);
              if (data.license.expiredAt) localStorage.setItem('setting_license_expires_at', data.license.expiredAt);
              if (typeof data.license.daysLeft === 'number') localStorage.setItem('setting_license_days_left', String(data.license.daysLeft));
            } catch(e) {}
          }
          okDiv.textContent = data.license && data.license.daysLeft != null
            ? 'Kích hoạt thành công — còn ' + data.license.daysLeft + ' ngày'
            : 'Đăng nhập thành công';
          okDiv.style.display = 'block';
          authSuccess(data, data.channelName || keyId);
        } else {
          var msg = data.message || 'Serial Key không hợp lệ';
          if (data.reason === 'UNREACHABLE')   msg = 'Không kết nối được tới license server.';
          else if (data.reason === 'TIMEOUT')  msg = 'License server không phản hồi (timeout).';
          else if (data.reason === 'EXPIRED')  msg = 'Serial Key đã hết hạn' + (data.expiredAt ? ' từ ' + new Date(data.expiredAt).toLocaleDateString('vi-VN') : '') + '.';
          else if (data.reason === 'DISABLED') msg = 'Serial Key đã bị khóa.';
          else if (data.reason === 'NOT_ACTIVATED') msg = 'Serial Key chưa được kích hoạt.';
          else if (data.reason === 'NOT_FOUND') msg = 'Serial Key không tồn tại.';
          errDiv.textContent = msg;
          errDiv.style.display = 'block';
          btn.disabled = false; btn.textContent = 'Kích hoạt & Đăng nhập';
        }
      })
      .catch(function(e) {
        errDiv.textContent = 'Lỗi kết nối tới backend';
        errDiv.style.display = 'block';
        btn.disabled = false; btn.textContent = 'Kích hoạt & Đăng nhập';
      });
    }

    // Enter key to submit
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && document.getElementById('customLoginOverlay').classList.contains('show')) {
        doLogin();
      }
    });

    (function(){
      function readUiAccessToken() {
        try {
          if (window.__tfReadAccessToken) {
            var bridgeToken = window.__tfReadAccessToken() || '';
            if (bridgeToken) return bridgeToken;
          }
        } catch (e) {}
        return readPersistedUiValue('setting_loginaccesstoken', '');
      }

      function isLoggedIn() {
        var token = readUiAccessToken();
        return !!token && token.length > 10;
      }
      function hasStoredAuthIdentity() {
        try {
          var token = readPersistedUiValue('setting_loginaccesstoken', '');
          if (!!token && token.length > 10) return true;
          if (readPersistedUiValue('setting_pendinglogin', '') === '1') return true;
        } catch (e) {}
        return false;
      }
      function hasAuthenticatedUiState() {
        return isLoggedIn() || hasStoredAuthIdentity();
      }
      function getChannelName() {
        try {
          var session = window.session || {};
          return session.accountChannelName ||
            session.channelName ||
            (session.me && (session.me.accountChannelName || session.me.AccountChannelName || session.me.channelName || session.me.ChannelName)) ||
            readPersistedUiValue('setting_channelname', '') ||
            '';
        } catch (e) {
          return readPersistedUiValue('setting_channelname', '');
        }
      }

      function normalizeText(value) {
        var text = (value || '').toLowerCase();
        if (typeof text.normalize === 'function') {
          text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
        return text
          .replace(/\u0111/g, 'd')
          .replace(/[^a-z0-9]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      function pushCandidate(list, node) {
        if (!node || list.indexOf(node) >= 0) return;
        list.push(node);
      }

      function hasLegacyAuthButtons(root) {
        if (!root || !root.querySelectorAll) return false;
        var matched = false;
        root.querySelectorAll('button, a, .dx-button, .dx-button-text, [role="button"]').forEach(function(el) {
          if (matched) return;
          var txt = normalizeText(el.textContent || el.getAttribute('aria-label') || '');
          if (txt.indexOf('google') >= 0 || txt.indexOf('e mail') >= 0 || txt.indexOf('email') >= 0) {
            matched = true;
          }
        });
        return matched;
      }

      function getSetupPage() {
        return document.querySelector('.page[data-pageid="setup"]') || document.body;
      }

      function findSettingsAuthCandidates() {
        var setupPage = getSetupPage();
        var candidates = [];
        setupPage.querySelectorAll('.dx-fieldset, .dx-box-item, .dx-item-content, .dx-field-item-content, .dx-form-group, .dx-layout-manager .dx-item, .greyBackgroundSection').forEach(function(node) {
          pushCandidate(candidates, node);
        });
        setupPage.querySelectorAll('button, a, .dx-button-text, [role="button"]').forEach(function(el) {
          var txt = normalizeText(el.textContent || el.getAttribute('aria-label') || '');
          if (txt.indexOf('google') >= 0 || txt.indexOf('e mail') >= 0 || txt.indexOf('email') >= 0) {
            pushCandidate(candidates,
              el.closest('.dx-fieldset') ||
              el.closest('.dx-box-item') ||
              el.closest('.dx-item-content') ||
              el.closest('.dx-field-item-content') ||
              el.parentElement);
          }
        });
        return candidates;
      }

      function resolveLegacySettingsRoot(node) {
        if (!node) return null;
        return node.closest('.greyBackgroundSection') ||
          node.closest('.dx-fieldset') ||
          node.closest('.dx-box-item') ||
          node.closest('.dx-item-content') ||
          node.closest('.dx-field-item-content') ||
          node.closest('.setupConnected') ||
          node.closest('.setupUnconnected') ||
          node.parentElement;
      }

      function findLegacySetupLoginRoots() {
        var setupPage = getSetupPage();
        var roots = [];
        ['#buttonLoginWithEmail', '#buttonLoginWithGoogle', '#loginPopup'].forEach(function(selector) {
          pushCandidate(roots, resolveLegacySettingsRoot(setupPage.querySelector(selector)));
        });
        setupPage.querySelectorAll(
          '.setupUnconnected.loginSection .greyBackgroundSection, ' +
          '.setupUnconnected.loginSection .dx-fieldset, ' +
          '.setupUnconnected.loginSection'
        ).forEach(function(node) {
          pushCandidate(roots, resolveLegacySettingsRoot(node));
        });
        return roots;
      }

      function findLegacySetupConnectedRoots() {
        var setupPage = getSetupPage();
        var roots = [];
        ['#textboxChannelName', '#manualConnectButtonSetup', '#invalidUsernameHint'].forEach(function(selector) {
          pushCandidate(roots, resolveLegacySettingsRoot(setupPage.querySelector(selector)));
        });
        setupPage.querySelectorAll(
          '.setupConnected #setup-basic, ' +
          '.setupConnected .greyBackgroundSection, ' +
          '.setupConnected .dx-fieldset'
        ).forEach(function(node) {
          pushCandidate(roots, resolveLegacySettingsRoot(node));
        });
        return roots;
      }

      function hideLegacySetupPlaceholders(scope) {
        var root = scope && scope.querySelectorAll ? scope : getSetupPage();
        root.querySelectorAll('#buttonLoginWithEmail, #buttonLoginWithGoogle, #loginPopup, .btnLoginGoogle, .btn-google-login').forEach(function(el) {
          el.style.display = 'none';
          el.dataset.tfPatched = '1';
        });
      }

      function hideLegacyGoogleUi() {
        document.querySelectorAll('.btnLoginGoogle, .btn-google-login, [data-pageid="google"], .menuitemain[data-pageid="google"], #buttonLoginWithGoogle').forEach(function(el) {
          el.style.display = 'none';
          el.dataset.tfPatched = '1';
        });
      }

      function normalizeTikTokName(value) {
        return String(value || '').trim().replace(/^@+/, '');
      }

      function syncCookie(name, value) {
        try {
          document.cookie = name + '=' + encodeURIComponent(String(value || '')) + '; path=/; SameSite=Lax';
        } catch (e) {}
      }

      function syncSettingsLikeStores(username) {
        if (!username) return;
        try {
          [window.settings, window.tfSettings, window.appSettings].forEach(function(store) {
            if (!store) return;
            ['channelName', 'tiktokUsername', 'username', 'uniqueId'].forEach(function(key) {
              try {
                if (typeof store.set === 'function') {
                  store.set(key, username);
                } else if (typeof store.setValue === 'function') {
                  store.setValue(key, username);
                } else {
                  store[key] = username;
                }
              } catch (e) {}
            });
            try {
              if (typeof store.save === 'function') store.save();
            } catch (e) {}
          });
        } catch (e) {}
      }

      function getLastTikTokName() {
        var sources = [
          window.__tfLastTikTokConnectName,
          (function() {
            var input = document.getElementById('tfTiktokName');
            return input ? input.value : '';
          })(),
          window.session && (window.session.tiktokUsername || window.session.channelName),
          window.tfPageloadData && window.tfPageloadData.me && (
            window.tfPageloadData.me.tiktokUsername ||
          window.tfPageloadData.me.channelName ||
          (window.tfPageloadData.me.channel && (window.tfPageloadData.me.channel.tiktokUsername || window.tfPageloadData.me.channel.channelName))
        ),
        (function() {
            return readPersistedUiValue('setting_tiktokname', '');
        })()
      ];

        for (var i = 0; i < sources.length; i++) {
          var username = normalizeTikTokName(sources[i]);
          if (username) return username;
        }

        return '';
      }

      function startForcedTikTokNameWindow(durationMs) {
        try {
          window.__tfForceTikTokNameUntil = Date.now() + (durationMs || 90000);
        } catch (e) {}
      }

      function hasForcedTikTokNameWindow() {
        try {
          return !!window.__tfForceTikTokNameUntil && Date.now() < window.__tfForceTikTokNameUntil;
        } catch (e) {
          return false;
        }
      }

      function syncTikTokRuntimeName(username) {
        username = normalizeTikTokName(username);
        if (!username) return '';

        startForcedTikTokNameWindow(90000);
        try { window.__tfLastTikTokConnectName = username; } catch (e) {}
        try { localStorage.setItem('setting_tiktokname', username); } catch (e) {}
        syncCookie('tf_tiktokname', username);

        try {
          window.session = window.session || {};
          window.session.channelName = username;
          window.session.tiktokUsername = username;

          if (window.session.me) {
            window.session.me.ChannelName = username;
            window.session.me.channelName = username;
            window.session.me.TiktokUsername = username;
            window.session.me.tiktokUsername = username;
            window.session.me.dynamicSettings = window.session.me.dynamicSettings || {};
            window.session.me.dynamicSettings.setting_tiktokname = username;
          }

          if (window.session.channel) {
            window.session.channel.ChannelName = username;
            window.session.channel.channelName = username;
            window.session.channel.TiktokUsername = username;
            window.session.channel.tiktokUsername = username;
            window.session.channel.dynamicSettings = window.session.channel.dynamicSettings || {};
            window.session.channel.dynamicSettings.setting_tiktokname = username;
          }
        } catch (e) {}

        try {
          window.tfPageloadData = window.tfPageloadData || {};
          window.tfPageloadData.me = window.tfPageloadData.me || {};
          window.tfPageloadData.me.channelName = username;
          window.tfPageloadData.me.tiktokUsername = username;
          window.tfPageloadData.me.channel = window.tfPageloadData.me.channel || {};
          window.tfPageloadData.me.channel.ChannelName = username;
          window.tfPageloadData.me.channel.channelName = username;
          window.tfPageloadData.me.channel.TiktokUsername = username;
          window.tfPageloadData.me.channel.tiktokUsername = username;
          window.tfPageloadData.me.channel.dynamicSettings = window.tfPageloadData.me.channel.dynamicSettings || {};
          window.tfPageloadData.me.channel.dynamicSettings.setting_tiktokname = username;
        } catch (e) {}

        syncSettingsLikeStores(username);
        return username;
      }

      function patchDialogPayload(value, username) {
        if (!username || value === null || typeof value === 'undefined') return value;
        if (typeof value === 'string') return replaceConnectionErrorText(value, username);
        if (Array.isArray(value)) {
          return value.map(function(item) { return patchDialogPayload(item, username); });
        }
        if (typeof value === 'object') {
          var clone = Array.isArray(value) ? value.slice() : Object.assign({}, value);
          ['title', 'message', 'messageHtml', 'html', 'text', 'content', 'messageText'].forEach(function(key) {
            if (typeof clone[key] === 'string') {
              clone[key] = replaceConnectionErrorText(clone[key], username);
            }
          });
          if (Array.isArray(clone.buttons)) {
            clone.buttons = clone.buttons.map(function(btn) {
              if (!btn || typeof btn !== 'object') return btn;
              var nextBtn = Object.assign({}, btn);
              if (typeof nextBtn.text === 'string') {
                nextBtn.text = replaceConnectionErrorText(nextBtn.text, username);
              }
              return nextBtn;
            });
          }
          return clone;
        }
        return value;
      }

      function hookDevExpressDialogs() {
        var dialog = window.DevExpress && window.DevExpress.ui && window.DevExpress.ui.dialog;
        if (!dialog) return false;
        if (dialog.__tfHooked) return true;

        ['alert', 'confirm'].forEach(function(methodName) {
          var original = dialog[methodName];
          if (typeof original !== 'function') return;
          dialog[methodName] = function(message, title) {
            var username = getLastTikTokName();
            return original.call(this, patchDialogPayload(message, username), patchDialogPayload(title, username));
          };
        });

        if (typeof dialog.custom === 'function') {
          var originalCustom = dialog.custom;
          dialog.custom = function(options) {
            return originalCustom.call(this, patchDialogPayload(options, getLastTikTokName()));
          };
        }

        dialog.__tfHooked = true;
        return true;
      }

      function hookSettingsStore() {
        var hooked = false;
        [window.settings, window.tfSettings, window.appSettings].forEach(function(store) {
          if (!store || store.__tfHooked || typeof store.get !== 'function') return;

          var originalGet = store.get.bind(store);
          var originalSet = typeof store.set === 'function' ? store.set.bind(store) : null;

          store.get = function(key) {
            var normalizedKey = String(key || '').toLowerCase();
            if (hasForcedTikTokNameWindow() &&
                (normalizedKey === 'channelname' ||
                 normalizedKey === 'channel_name' ||
                 normalizedKey === 'username' ||
                 normalizedKey === 'tiktokusername' ||
                 normalizedKey === 'uniqueid' ||
                 normalizedKey === 'screenname')) {
              var forcedUsername = getLastTikTokName();
              if (forcedUsername) return forcedUsername;
            }
            return originalGet.apply(this, arguments);
          };

          if (originalSet) {
            store.set = function(key, value) {
              var normalizedKey = String(key || '').toLowerCase();
              if (hasForcedTikTokNameWindow() &&
                  (normalizedKey === 'channelname' ||
                   normalizedKey === 'channel_name' ||
                   normalizedKey === 'username' ||
                   normalizedKey === 'tiktokusername' ||
                   normalizedKey === 'uniqueid' ||
                   normalizedKey === 'screenname')) {
                var forcedUsername = getLastTikTokName();
                if (forcedUsername) value = forcedUsername;
              }
              return originalSet.call(this, key, value);
            };
          }

          store.__tfHooked = true;
          hooked = true;
        });
        return hooked;
      }

      function replaceConnectionErrorText(text, username) {
        if (!text) return text;

        var handle = '@' + username;
        var next = String(text);
        next = next.replace(/@testuser\b/gi, handle);
        next = next.replace(/(Unable to connect to your TikTok channel\s+)@[A-Za-z0-9._-]+/gi, '$1' + handle);
        next = next.replace(/(We were unable to find your TikTok channel\s+)@[A-Za-z0-9._-]+/gi, '$1' + handle);
        next = next.replace(/(your TikTok channel\s+)@[A-Za-z0-9._-]+/gi, '$1' + handle);

        if (/^@?[A-Za-z0-9._-]{2,}$/.test(next.trim()) && next.toLowerCase().indexOf(username.toLowerCase()) < 0) {
          next = handle;
        }

        return next;
      }

      function patchConnectionErrorPopup(root) {
        var username = getLastTikTokName();
        if (!username || !root || !root.querySelectorAll) return;

        root.querySelectorAll('.dx-overlay-wrapper, .dx-popup-wrapper, .dx-overlay-content, .dx-dialog').forEach(function(wrapper) {
          var titleEl = wrapper.querySelector('.dx-popup-title, .dx-dialog-title, .dx-toolbar-label');
          var bodyText = wrapper.textContent || '';
          var titleText = normalizeText(titleEl ? titleEl.textContent : '');
          var normalizedBody = normalizeText(bodyText);
          var isConnectionPopup =
            titleText.indexOf('connection error') >= 0 ||
            normalizedBody.indexOf('unable to connect to your tiktok channel') >= 0 ||
            normalizedBody.indexOf('unable to find your tiktok channel') >= 0;

          if (!isConnectionPopup) return;

          if (titleEl) {
            var replacedTitle = replaceConnectionErrorText(titleEl.textContent, username);
            if (replacedTitle !== titleEl.textContent) {
              titleEl.textContent = replacedTitle;
            }
          }

          wrapper.querySelectorAll('*').forEach(function(el) {
            if (el.children && el.children.length > 0) return;
            var original = el.textContent || '';
            if (!original) return;
            if (!/@?[A-Za-z0-9._-]+/.test(original) &&
                original.indexOf('Unable to connect to your TikTok channel') < 0 &&
                original.indexOf('We were unable to find your TikTok channel') < 0 &&
                original.indexOf('testuser') < 0) {
              return;
            }

            var replaced = replaceConnectionErrorText(original, username);
            if (replaced !== original) {
              el.textContent = replaced;
            }
          });
        });
      }

      window.__tfSyncTikTokName = syncTikTokRuntimeName;
      window.__tfGetLastTikTokName = getLastTikTokName;
      window.__tfPatchConnectionErrorPopup = patchConnectionErrorPopup;
      window.__tfStartForcedTikTokNameWindow = startForcedTikTokNameWindow;
      window.__tfRequireLogin = false;

      window.__tfOpenLogin = function(tab) {
        var overlay = document.getElementById('customLoginOverlay');
        if (!overlay) return;
        try { switchAuthTab(tab === 'register' ? 'register' : 'login'); } catch (e) {}
        overlay.classList.add('show');
      };

      // Local mode does not force auth, so only show the popup when explicitly requested.
      function checkShowLogin() {
        if (!window.__tfRequireLogin || isLoggedIn()) return;
        window.__tfOpenLogin('login');
      }
      window.__customLoginReady = true;
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function(){ setTimeout(checkShowLogin, 2000); });
      } else {
        setTimeout(checkShowLogin, 2000);
      }

      // ========== HEADER: leave bundle visuals untouched ==========
      function patchHeader() {
        return;
        var channelName = getChannelName();
        if (!hasAuthenticatedUiState()) return;
        if (!channelName) channelName = readPersistedUiValue('setting_channelname', '') || 'Account';
        // Find header area: look for text containing "Login", "New User", "create account" etc.
        var allEls = document.querySelectorAll('.header-right *, .dx-toolbar-after *, .toolbar-right *, [class*="header"] *, [class*="toolbar"] *, [class*="topbar"] *, [class*="nav"] *');
        if (!allEls.length) allEls = document.querySelectorAll('*');
        allEls.forEach(function(el) {
          if (el.children && el.children.length === 0) {
            var t = normalizeText(el.textContent || '');
            var rawText = (el.textContent || '').trim();
            // Replace "New User", "Login", etc. with actual channel name (only in header area, top < 80px)
            if (t === 'new user' || t === 'login' || t === 'dang nhap' || t === 'sign in') {
              var rect = el.getBoundingClientRect();
              if (rect.top < 80 && rect.top > 0) {
                el.textContent = channelName;
                el.style.color = '#dedede';
                el.dataset.tfPatched = '1';
                return;
              }
            }
            if (t === 'or create account' || t === 'hoac tao tai khoan' || t === 'disconnected') {
              var rect2 = el.getBoundingClientRect();
              if (rect2.top < 80 && rect2.top > 0) {
                el.textContent = 'Disconnected';
                el.style.color = '#d9534f';
                el.style.fontSize = '11px';
                el.dataset.tfPatched = '1';
                return;
              }
            }
          }
        });
      }

      // ========== SETTINGS PAGE: keep only one visible auth/connect surface ==========
      var _settingsPatched = false;
      function patchSettingsPage() {
        patchLegacySetupPage();
        return;
        // Only patch ONCE ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â avoid MutationObserver loop
        if (_settingsPatched) return;

        patchLegacySetupPage();
        var currentAuthState = hasAuthenticatedUiState() ? 'loggedin' : 'loggedout';

        if (currentAuthState === 'loggedin') {
          var _setupPage = getSetupPage();
          var _allFieldsets = _setupPage.querySelectorAll('.dx-fieldset, .greyBackgroundSection, .dx-box-item, .dx-item-content');
          var _replaced = false;
          _allFieldsets.forEach(function(el) {
            if (_replaced) return;
            if (el.dataset.tfPatched === '1') { _replaced = true; return; }
            if (el.querySelector('[data-tf-connect-section="1"]')) { _replaced = true; return; }
            var _t = el.textContent || '';
            var _hasLogin = (_t.indexOf('sign in') >= 0 || _t.indexOf('Sign in') >= 0 || _t.indexOf('Please sign in') >= 0 || _t.indexOf('create a free account') >= 0);
            var _hasForm = el.querySelector('#ilLoginUser') || el.querySelector('input[placeholder*="username"]') || el.querySelector('input[placeholder*="email"]');
            var _hasBundle = (_t.indexOf('Login or Signup') >= 0 || _t.indexOf('E-Mail') >= 0);
            if (_hasLogin || _hasForm || _hasBundle) {
              el.dataset.tfAuthState = 'loggedin';
              el.dataset.tfPatched = '1';
              el.innerHTML = buildLoggedInSection();
              _replaced = true;
              _settingsPatched = true;
            }
          });
          if (_replaced) return;
        }

        if (_settingsPatched) return;
        findSettingsAuthCandidates().forEach(function(root) {
          if (!root || _settingsPatched) return;
          if (root.querySelector('[data-tf-connect-section="1"]')) { _settingsPatched = true; return; }
          if (root.dataset.tfAuthState === currentAuthState) return;
          var txtNormalized = normalizeText(root.textContent || '');
          var hasLoginTextNormalized = (txtNormalized.indexOf('login') >= 0 ||
              txtNormalized.indexOf('sign in') >= 0 ||
              txtNormalized.indexOf('dang nhap') >= 0 ||
              txtNormalized.indexOf('create a free account') >= 0 ||
              txtNormalized.indexOf('tao tai khoan') >= 0 ||
              txtNormalized.indexOf('register') >= 0);
          var hasLegacyProvidersNormalized = (txtNormalized.indexOf('e mail') >= 0 ||
              txtNormalized.indexOf('email') >= 0 ||
              txtNormalized.indexOf('google') >= 0 ||
              txtNormalized.indexOf('username') >= 0 ||
              txtNormalized.indexOf('password') >= 0 ||
              hasLegacyAuthButtons(root));
          var hasRequiredNoticeNormalized = txtNormalized.indexOf('required') >= 0 || txtNormalized.indexOf('bat buoc') >= 0;
          // Also detect our own custom inline login form
          var hasInlineLoginForm = root.querySelector('#ilLoginUser') || root.querySelector('#ilLoginPass');

          if ((hasLoginTextNormalized && hasLegacyProvidersNormalized) || (hasRequiredNoticeNormalized && hasLegacyProvidersNormalized) || hasInlineLoginForm) {
            root.dataset.tfAuthState = currentAuthState;
            if (currentAuthState === 'loggedin') {
              root.dataset.tfPatched = '1';
              root.innerHTML = buildLoggedInSection();
              _settingsPatched = true;
            }
          }
        });

        if (_settingsPatched) return;
        var fieldsets = getSetupPage().querySelectorAll('.dx-fieldset');
        fieldsets.forEach(function(fs) {
          if (fs.dataset.tfAuthState === currentAuthState) return;
          if (fs.querySelector('#tfTiktokName') || fs.querySelector('[data-tf-connect-section="1"]')) return;
          var txt = fs.textContent || '';
          var hasLoginText = (txt.indexOf('sign in') >= 0 || txt.indexOf('Sign in') >= 0 ||
              txt.indexOf('create a free account') >= 0 || txt.indexOf('tÃƒÂ¡Ã‚ÂºÃ‚Â¡o tÃƒÆ’Ã‚Â i khoÃƒÂ¡Ã‚ÂºÃ‚Â£n') >= 0 ||
              txt.indexOf('Ãƒâ€žÃ¢â‚¬ËœÃƒâ€žÃ†â€™ng nhÃƒÂ¡Ã‚ÂºÃ‚Â­p') >= 0 || txt.indexOf('Login') >= 0 || txt.indexOf('login') >= 0);
          var hasAuthButtons = (txt.indexOf('E-Mail') >= 0 || txt.indexOf('Google') >= 0 ||
              txt.indexOf('e-mail') >= 0 || txt.indexOf('Username') >= 0 || txt.indexOf('Password') >= 0);
          var hasInlineLoginForm = fs.querySelector('#ilLoginUser') || fs.querySelector('#ilLoginPass');

          if (hasLoginText || hasAuthButtons || hasInlineLoginForm) {
            fs.dataset.tfAuthState = currentAuthState;
            if (currentAuthState === 'loggedin') {
              fs.dataset.tfPatched = '1';
              fs.innerHTML = buildLoggedInSection();
            }
            // When logged out, let the bundle show its own Login UI
          }
        });

        // Also check for "Login" section headers (dx-fieldset-header) near auth content
        if (!fieldsets.length) {
          getSetupPage().querySelectorAll('.dx-item-content, .dx-box-item').forEach(function(el) {
            if (el.dataset.tfPatched) return;
            if (el.querySelector('#tfTiktokName') || el.querySelector('[data-tf-connect-section="1"]')) return;
            var txt = el.textContent || '';
            if ((txt.indexOf('sign in') >= 0 || txt.indexOf('create a free account') >= 0) &&
                (txt.indexOf('E-Mail') >= 0 || txt.indexOf('Google') >= 0 || txt.indexOf('Login') >= 0)) {
              if (hasAuthenticatedUiState()) {
                el.dataset.tfPatched = '1';
                el.innerHTML = '<div class="dx-fieldset">' + buildLoggedInSection() + '</div>';
              }
              // When logged out, let the bundle show its own Login UI
            }
          });
        }

        // Direct fallback: if our inline login form exists and user is logged in, replace it
        if (currentAuthState === 'loggedin') {
          var inlineForm = getSetupPage().querySelector('#ilLoginUser') || getSetupPage().querySelector('#ilLoginPass');
          if (inlineForm) {
            // Walk up to find a suitable container to replace
            var container = inlineForm.closest('.dx-fieldset') || inlineForm.closest('.dx-box-item') || inlineForm.closest('.dx-item-content') || inlineForm.closest('.greyBackgroundSection');
            if (!container) {
              // Try going up from the form's wrapper div
              var wrapper = inlineForm.closest('div[style]');
              while (wrapper && wrapper.parentElement && wrapper.parentElement !== getSetupPage()) {
                if (wrapper.parentElement.classList.contains('dx-fieldset') || wrapper.parentElement.classList.contains('dx-box-item')) {
                  container = wrapper.parentElement;
                  break;
                }
                wrapper = wrapper.parentElement;
              }
              if (!container) container = inlineForm.parentElement.parentElement || inlineForm.parentElement;
            }
            if (container && container.dataset.tfAuthState !== 'loggedin') {
              container.dataset.tfAuthState = 'loggedin';
              container.dataset.tfPatched = '1';
              container.innerHTML = buildLoggedInSection();
            }
          }

          // Also find the bundle's own login form (with "Login or Signup" buttons)
          var bundleLoginBtns = getSetupPage().querySelectorAll('button, .dx-button');
          bundleLoginBtns.forEach(function(btn) {
            var btnTxt = (btn.textContent || '').trim();
            if (btnTxt.indexOf('Login or Signup') >= 0 || btnTxt.indexOf('Ãƒâ€žÃ‚ÂÃƒâ€žÃ†â€™ng nhÃƒÂ¡Ã‚ÂºÃ‚Â­p') >= 0) {
              var loginContainer = btn.closest('.dx-fieldset') || btn.closest('.dx-box-item') || btn.closest('.greyBackgroundSection');
              if (loginContainer && loginContainer.dataset.tfAuthState !== 'loggedin') {
                loginContainer.dataset.tfAuthState = 'loggedin';
                loginContainer.dataset.tfPatched = '1';
                loginContainer.innerHTML = buildLoggedInSection();
              }
            }
          });
        }

        // Bundle's own connect UI handles TikTok connection
      }

      function patchLegacySetupPage() {
        var setupPage = getSetupPage();
        var channelName = getChannelName();
        var loginRoots = findLegacySetupLoginRoots();
        var connectedRoots = findLegacySetupConnectedRoots();
        var loginContainers = setupPage.querySelectorAll('.setupUnconnected.loginSection, .setupUnconnected');
        var connectedContainers = setupPage.querySelectorAll('.setupConnected');

        if (hasAuthenticatedUiState()) {
          loginContainers.forEach(function(node) {
            node.style.display = 'none';
          });
          connectedContainers.forEach(function(node) {
            node.style.display = '';
          });
          loginRoots.forEach(function(root) {
            if (!root || root.dataset.tfLegacyHidden === '1') return;
            root.style.display = 'none';
            root.dataset.tfLegacyHidden = '1';
          });
          // Show bundle's own connected UI (has TikTok name input + Connect button)
          connectedRoots.forEach(function(root) {
            if (!root) return;
            root.style.display = '';
          });
        } else {
          connectedContainers.forEach(function(node) {
            node.style.display = 'none';
          });
          loginContainers.forEach(function(node) {
            node.style.display = '';
          });
          connectedRoots.forEach(function(root) {
            if (!root || root.dataset.tfLegacyHidden === '1') return;
            root.style.display = 'none';
            root.dataset.tfLegacyHidden = '1';
          });
          loginRoots.forEach(function(root) {
            if (!root || root.dataset.tfAuthState === 'loggedout') return;
            root.style.display = '';
            root.dataset.tfAuthState = 'loggedout';
            root.dataset.tfPatched = '1';
            root.innerHTML = buildSetupLoginSection();
          });

          // Fallback: if no legacy login roots found AND no login form exists yet,
          // inject login form at the top of the settings page
          if (!document.getElementById('ilLoginUser')) {
            console.log('[TF-Auth] No login form found, injecting at top of setup page');
            var loginDiv = document.createElement('div');
            loginDiv.id = 'tf-injected-login';
            loginDiv.className = 'greyBackgroundSection';
            loginDiv.style.cssText = 'margin:16px 24px;padding:20px 24px;background:#1e1e2d;border-radius:8px;border:1px solid #333;';
            loginDiv.innerHTML = buildSetupLoginSection();
            // Find first content area in setup page
            var firstContent = setupPage.querySelector('.dx-fieldset, .greyBackgroundSection, .dx-scrollable-content > div');
            if (firstContent && firstContent.parentNode) {
              firstContent.parentNode.insertBefore(loginDiv, firstContent);
            } else if (setupPage !== document.body) {
              setupPage.insertBefore(loginDiv, setupPage.firstChild);
            }
          }
        }

        // When logged in, remove injected login form and show logged-in section
        if (hasAuthenticatedUiState()) {
          var injectedLogin = document.getElementById('tf-injected-login');
          if (injectedLogin) injectedLogin.remove();
          // Show "Signed in as X" + Logout if not already present
          if (!document.getElementById('tf-loggedin-section')) {
            var loggedInDiv = document.createElement('div');
            loggedInDiv.id = 'tf-loggedin-section';
            loggedInDiv.style.cssText = 'margin:16px 24px;';
            loggedInDiv.innerHTML = buildLoggedInSection();
            var firstContent2 = setupPage.querySelector('.dx-fieldset, .greyBackgroundSection, .dx-scrollable-content > div');
            if (firstContent2 && firstContent2.parentNode) {
              firstContent2.parentNode.insertBefore(loggedInDiv, firstContent2);
            } else if (setupPage !== document.body) {
              setupPage.insertBefore(loggedInDiv, setupPage.firstChild);
            }
          }
        } else {
          var loggedInSection = document.getElementById('tf-loggedin-section');
          if (loggedInSection) loggedInSection.remove();
        }

        hideLegacySetupPlaceholders(setupPage);
        // Bundle's own connect UI handles TikTok connection
      }

      function buildLoggedInSection() {
        var name = getChannelName();
        return '<div class="dx-fieldset" data-tf-connect-section="1" style="padding:16px 24px;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;">' +
            '<div style="color:#7c7c7c;font-size:13px;">Signed in as <span style="color:#dedede;font-weight:600;">' + name + '</span></div>' +
            '<button onclick="doLogout()" style="padding:6px 16px;border:1px solid #555;border-radius:4px;background:transparent;color:#d9534f;font-size:12px;cursor:pointer;font-family:inherit;">Logout</button>' +
          '</div>' +
        '</div>';
        // Connect UI (input + button) is handled by tf-connect.js
      }

      function isActuallyVisible(el) {
        if (!el) return false;
        try {
          var style = window.getComputedStyle(el);
          if (!style) return false;
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
          if (!el.offsetParent && style.position !== 'fixed') return false;
          var rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        } catch (e) {
          return false;
        }
      }

      // Custom connect UI functions removed ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â bundle's own UI + browserbridge hook handles TikTok connection

      function buildSetupLoginSection() {
        return '<h3 class="blueheading noTopMarginHeader">Login</h3>' + buildLoginFormSection();
      }

      function buildLoginFormSection() {
        var S = 'font-family:Outfit,sans-serif;';
        var inputS = 'width:100%;padding:9px 12px;border:1px solid #444;border-radius:4px;background:#212121;color:#dedede;font-size:14px;box-sizing:border-box;outline:none;font-family:inherit;';
        var labelS = 'display:block;margin-bottom:4px;font-size:12px;color:#7c7c7c;text-transform:uppercase;letter-spacing:0.5px;';
        var btnS = 'width:100%;padding:10px;border:none;border-radius:4px;background:#1ca8dd;color:#fff;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;';
        return '<div style="max-width:380px;'+S+'">' +
          '<div style="margin-bottom:12px;font-size:13px;color:#7c7c7c;">Please sign in or create a free account to continue. <span style="color:#d9534f;">(Required!)</span></div>' +
          '<div style="display:flex;margin-bottom:16px;border-bottom:1px solid #444;">' +
            '<div class="il-tab active" onclick="switchInlineTab(\'login\')" style="flex:1;padding:8px;text-align:center;cursor:pointer;font-weight:600;color:#1ca8dd;border-bottom:2px solid #1ca8dd;margin-bottom:-1px;">Login</div>' +
            '<div class="il-tab" onclick="switchInlineTab(\'register\')" style="flex:1;padding:8px;text-align:center;cursor:pointer;font-weight:600;color:#7c7c7c;border-bottom:2px solid transparent;margin-bottom:-1px;">Register</div>' +
          '</div>' +
          '<div id="ilLogin">' +
            '<div style="margin-bottom:12px;"><label style="'+labelS+'">Username / Email</label>' +
            '<input type="text" id="ilLoginUser" placeholder="Enter username or email" style="'+inputS+'" /></div>' +
            '<div style="margin-bottom:12px;"><label style="'+labelS+'">Password</label>' +
            '<input type="password" id="ilLoginPass" placeholder="Enter password" style="'+inputS+'" /></div>' +
            '<button onclick="doInlineLogin()" style="'+btnS+'">Login</button>' +
            '<div id="ilLoginMsg" style="font-size:13px;margin-top:8px;text-align:center;"></div>' +
          '</div>' +
          '<div id="ilRegister" style="display:none;">' +
            '<div style="margin-bottom:10px;"><label style="'+labelS+'">Username</label>' +
            '<input type="text" id="ilRegUser" placeholder="Choose a username" style="'+inputS+'" /></div>' +
            '<div style="margin-bottom:10px;"><label style="'+labelS+'">Email</label>' +
            '<input type="email" id="ilRegEmail" placeholder="Enter email" style="'+inputS+'" /></div>' +
            '<div style="margin-bottom:10px;"><label style="'+labelS+'">Password</label>' +
            '<input type="password" id="ilRegPass" placeholder="Create a password" style="'+inputS+'" /></div>' +
            '<div style="margin-bottom:10px;"><label style="'+labelS+'">Confirm Password</label>' +
            '<input type="password" id="ilRegPass2" placeholder="Confirm password" style="'+inputS+'" /></div>' +
            '<button onclick="doInlineRegister()" style="'+btnS+'">Create Account</button>' +
            '<div id="ilRegMsg" style="font-size:13px;margin-top:8px;text-align:center;"></div>' +
          '</div>' +
        '</div>';
      }

      // window.connectTikTokLive removed ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â browserbridge hook handles connection

      // ========== MutationObserver: watch for DOM changes ==========
      var _patching = false;
      var _mainObs = null;

      function _readAuth() {
        try { return localStorage.getItem('setting_loginaccesstoken') || ''; } catch(e) { return ''; }
      }

      function patchNavForAuthState() {
        var token = _readAuth();
        var isLoggedIn = token && token.length >= 10;
        console.log('[TF-Auth] patchNavForAuthState: isLoggedIn=' + isLoggedIn + ', token=' + (token ? token.substring(0,10) + '...' : 'null') + ', body.tf-logged-out=' + document.body.classList.contains('tf-logged-out'));

        // Toggle body class for CSS rules
        if (isLoggedIn) {
          document.body.classList.remove('tf-logged-out');
        } else {
          document.body.classList.add('tf-logged-out');
        }
        console.log('[TF-Auth] body classes after toggle: ' + document.body.className);

        if (isLoggedIn) {
          // Clean up guest patches
          if (window.__tfGuestTextInterval) {
            clearInterval(window.__tfGuestTextInterval);
            window.__tfGuestTextInterval = null;
            console.log('[TF-Auth] Cleaned up guest text interval (logged in)');
          }
          // Restore nav text: replace "Login"→channelName only. Don't inject
          // "PRO" into the secondary line — original Tikfinity doesn't show
          // a hardcoded PRO badge there. Let the bundle render whatever it
          // computes from session.subscription / session.userFeatures.
          var channelNameForNav = '';
          try { channelNameForNav = window.session && (window.session.accountChannelName || window.session.channelName) || ''; } catch(e) {}
          if (!channelNameForNav) {
            try { channelNameForNav = localStorage.getItem('setting_channelname') || ''; } catch(e) {}
          }
          if (channelNameForNav) {
            var nav = document.getElementById('navigation-app');
            if (nav) {
              var leafEls = nav.querySelectorAll('span, div, p, a');
              for (var i = 0; i < leafEls.length; i++) {
                var el = leafEls[i];
                if (el.children && el.children.length > 0) continue;
                var txt = (el.textContent || '').trim();
                var rect = el.getBoundingClientRect();
                if (rect.top > 80 || rect.top < 0 || rect.right < window.innerWidth - 350) continue;
                if (txt === 'Login' || txt === 'New User' || txt === 'new user') {
                  el.textContent = channelNameForNav;
                  el.style.cursor = '';
                }
              }
              // Restore avatar
              var imgs = nav.querySelectorAll('img');
              for (var j = 0; j < imgs.length; j++) {
                if (imgs[j].dataset.tfOrigSrc) {
                  imgs[j].src = imgs[j].dataset.tfOrigSrc;
                  delete imgs[j].dataset.tfOrigSrc;
                }
              }
            }
          }
          return;
        }

        // === GUEST STATE: 3 mechanisms ===
        console.log('[TF-Auth] Applying guest state mechanisms...');

        // 1. Document-level event blocker using mouse coordinates (simple, reliable)
        if (!window.__tfGuestEventsBlocked) {
          window.__tfGuestEventsBlocked = true;
          console.log('[TF-Auth] Registering document-level event blockers');
          ['mousedown','pointerdown','click','mouseup','pointerup'].forEach(function(evtType) {
            document.addEventListener(evtType, function(e) {
              if (!document.body.classList.contains('tf-logged-out')) return;
              // Block clicks in the profile area: top 65px, rightmost 220px of screen
              var x = e.clientX, y = e.clientY;
              var threshold = window.innerWidth - 220;
              if (y >= 0 && y < 65 && x > threshold) {
                console.log('[TF-Auth] BLOCKED ' + evtType + ' at (' + x + ',' + y + ') threshold=' + threshold + ' innerWidth=' + window.innerWidth);
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                if (evtType === 'click') navigateToLogin();
              }
            }, true); // capture phase = fires FIRST, before Vue
          });
        }

        // 2. Guest topbar is now a separate static HTML element (no DOM patching needed)

        // 3. Dropdown killer: watch for new elements and hide dropdown-like ones
        if (!window.__tfGuestDropdownObs) {
          window.__tfGuestDropdownObs = new MutationObserver(function(mutations) {
            if (!document.body.classList.contains('tf-logged-out')) return;
            for (var m = 0; m < mutations.length; m++) {
              for (var n = 0; n < mutations[m].addedNodes.length; n++) {
                var node = mutations[m].addedNodes[n];
                if (node.nodeType !== 1) continue;
                // Check if this looks like a dropdown/popup near top-right
                setTimeout(function(nd) {
                  if (!document.body.classList.contains('tf-logged-out')) return;
                  var r = nd.getBoundingClientRect();
                  if (r.top > 30 && r.top < 400 && r.right > window.innerWidth - 350 &&
                      r.width > 100 && r.height > 80) {
                    var text = (nd.textContent || '');
                    if (text.indexOf('Roadmap') >= 0 || text.indexOf('Feature Request') >= 0 ||
                        text.indexOf('PRO') >= 0 || text.indexOf('TikTok') >= 0 ||
                        text.indexOf('Vietnamese') >= 0) {
                      nd.style.display = 'none';
                      nd.style.visibility = 'hidden';
                      nd.style.pointerEvents = 'none';
                    }
                  }
                }.bind(null, node), 0);
              }
            }
          });
          window.__tfGuestDropdownObs.observe(document.body, { childList: true, subtree: true });
        }
      }

      function navigateToLogin() {
        console.log('[TF-Auth] navigateToLogin() called');
        window.location.hash = '#/tiktok/setup';
        setTimeout(function() {
          patchAll();
          var attempts = 0;
          var tryFocus = function() {
            var inp = document.getElementById('ilLoginUser');
            if (inp) {
              inp.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(function() { inp.focus(); }, 200);
            } else if (attempts < 10) {
              attempts++;
              setTimeout(tryFocus, 300);
            }
          };
          tryFocus();
        }, 300);
      }
      // Expose globally so guest topbar can call it
      window.navigateToLogin = navigateToLogin;

      function applyGuestTextPatch() {
        if (!document.body.classList.contains('tf-logged-out')) return;
        var nav = document.getElementById('navigation-app');
        if (!nav) return;
        var topbar = nav.querySelector('.topbar');
        if (!topbar) return;

        // Find right section (last direct child of topbar)
        var topbarChildren = topbar.children;
        var rightSection = topbarChildren[topbarChildren.length - 1];
        if (!rightSection || rightSection.dataset.tfGuestCleaned === 'true') return;

        var children = rightSection.children;
        for (var c = 0; c < children.length; c++) {
          var child = children[c];
          // Mark connect button hidden (CSS handles display:none)
          if (child.hasAttribute && child.hasAttribute('data-tf-connect-button')) {
            child.classList.add('tf-guest-hidden');
          }
          // Mark empty div.relative (no visible content)
          if (child.classList && child.classList.contains('relative')) {
            var txt = (child.textContent || '').trim();
            if (!txt && !child.querySelector('img, i, svg, a')) {
              child.classList.add('tf-guest-hidden');
            }
          }
        }

        // Mark separators adjacent to hidden elements
        for (var s = 0; s < children.length; s++) {
          var sep = children[s];
          var cn = sep.className || '';
          if (cn.indexOf('w-px') >= 0 && cn.indexOf('h-6') >= 0) {
            var prev = s > 0 ? children[s - 1] : null;
            var next = s < children.length - 1 ? children[s + 1] : null;
            if ((prev && prev.classList && prev.classList.contains('tf-guest-hidden')) ||
                (next && next.classList && next.classList.contains('tf-guest-hidden'))) {
              sep.classList.add('tf-guest-hidden');
            }
          }
        }
        rightSection.dataset.tfGuestCleaned = 'true';
      }

      function closeGuestDropdown() {
        if (!document.body.classList.contains('tf-logged-out')) return;
        // Search entire document for dropdown-like elements
        var allEls = document.querySelectorAll('div');
        for (var k = 0; k < allEls.length; k++) {
          var r = allEls[k].getBoundingClientRect();
          if (r.top > 30 && r.top < 400 && r.right > window.innerWidth - 350 &&
              r.width > 120 && r.height > 100) {
            var style = window.getComputedStyle(allEls[k]);
            var pos = style.position;
            if (pos === 'absolute' || pos === 'fixed') {
              var text = (allEls[k].textContent || '');
              if (text.indexOf('Roadmap') >= 0 || text.indexOf('Feature Request') >= 0 ||
                  text.indexOf('Vietnamese') >= 0) {
                allEls[k].style.display = 'none';
              }
            }
          }
        }
      }

      function injectNavLogout() {
        // Add logout button to navigation bar if not already present
        if (document.getElementById('tf-nav-logout')) return;
        var nav = document.getElementById('navigation-app');
        if (!nav) return;
        // Find the right area in nav (look for the LIVE button area or last flex child)
        var rightArea = nav.querySelector('.right-side, .nav-actions, .nav-right');
        if (!rightArea) {
          // Try finding the container with the LIVE button
          var liveBtn = nav.querySelector('[class*="live"], [class*="Live"]');
          rightArea = liveBtn ? liveBtn.parentElement : null;
        }
        if (!rightArea) {
          // Fallback: find the rightmost flex container in the nav header
          var header = nav.querySelector('header, .header, nav, [class*="header"]');
          if (header) {
            var children = header.children;
            rightArea = children.length > 0 ? children[children.length - 1] : null;
          }
        }
        if (!rightArea) return;
        var btn = document.createElement('a');
        btn.id = 'tf-nav-logout';
        btn.href = '#';
        btn.textContent = 'Logout';
        btn.style.cssText = 'margin-left:12px;padding:4px 12px;border:1px solid #555;border-radius:4px;color:#d9534f;font-size:12px;cursor:pointer;text-decoration:none;white-space:nowrap;';
        btn.onclick = function(e) { e.preventDefault(); doLogout(); };
        rightArea.appendChild(btn);
      }

      function patchAll() {
        if (_patching) return;
        _patching = true;
        console.log('[TF-Auth] patchAll() called');
        // Disconnect observer to prevent re-triggering while we modify DOM
        if (_mainObs) try { _mainObs.disconnect(); } catch(e) {}
        try {
          hideLegacyGoogleUi();
          hookSettingsStore();
          hookDevExpressDialogs();
          patchSettingsPage();
          patchConnectionErrorPopup(document.body);
          injectNavLogout();
          console.log('[TF-Auth] About to call patchNavForAuthState()');
          patchNavForAuthState();
          console.log('[TF-Auth] patchNavForAuthState() completed');
        } catch(e) { console.error('[TF-Auth] patchAll ERROR:', e.message, e.stack); }
        _patching = false;
        // Reconnect observer after a short delay
        if (_mainObs) {
          setTimeout(function() {
            try { _mainObs.observe(document.body, { childList: true, subtree: true }); } catch(e) {}
          }, 200);
        }
      }
      window.__tfPatchAll = patchAll;

      // Initial patch attempts (wait for SPA to render)
      setTimeout(patchAll, 2000);
      setTimeout(patchAll, 4000);
      setTimeout(patchAll, 7000);

      // Hooks only (no DOM changes) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â safe to repeat
      setInterval(function() {
        hookSettingsStore();
        hookDevExpressDialogs();
      }, 5000);

      // Observer for SPA navigation / re-renders
      if (window.MutationObserver) {
        var patchTimeout = null;
        _mainObs = new MutationObserver(function(mutations) {
          // Only check added nodes for login popups (lightweight)
          mutations.forEach(function(m) {
            m.addedNodes.forEach(function(node) {
              if (node.nodeType === 1) {
                var popup = node.querySelector ? node.querySelector('.dx-popup-title') : null;
                var popupTitle = normalizeText(popup ? popup.textContent : '');
                if (popup && (popupTitle.indexOf('login') >= 0 || popupTitle.indexOf('dang nhap') >= 0 || popupTitle.indexOf('sign in') >= 0
                  || popupTitle.indexOf('connection error') >= 0 || popupTitle.indexOf('loi ket noi') >= 0)) {
                  var wrapper = node.closest('.dx-overlay-wrapper') || node;
                  wrapper.style.display = 'none';
                }
                // Also check body text for connection error popups
                var popupRoot = node.closest('.dx-overlay-wrapper, .dx-popup-wrapper') || node;
                var bodyText = normalizeText(popupRoot.textContent || '');
                if (bodyText.indexOf('unable to connect to your tiktok') >= 0 || bodyText.indexOf('unable to find your tiktok') >= 0) {
                  popupRoot.style.display = 'none';
                }
                patchConnectionErrorPopup(popupRoot);
                // Auto-dismiss TikFinity Pro popup (user is already Pro)
                if (popupTitle.indexOf('tikfinity pro') >= 0 || bodyText.indexOf('tikfinity pro') >= 0
                    || bodyText.indexOf('pro_only') >= 0 || bodyText.indexOf('danh rieng cho thanh vien') >= 0
                    || bodyText.indexOf('only for tikfinity pro') >= 0) {
                  console.log('[TF-PRO] Auto-dismissing Pro dialog');
                  var proWrapper = node.closest('.dx-overlay-wrapper, .dx-popup-wrapper') || node;
                  // Try clicking OK/Close button first
                  var okBtn = proWrapper.querySelector('.dx-button-has-text, .dx-popup-bottom .dx-button, .dx-dialog-button-ok');
                  if (okBtn) { okBtn.click(); }
                  // Also hide the wrapper entirely
                  proWrapper.style.display = 'none';
                  // Remove the backdrop overlay if present
                  var shade = proWrapper.previousElementSibling;
                  if (shade && shade.classList && shade.classList.contains('dx-overlay-shader')) {
                    shade.style.display = 'none';
                  }
                }
              }
            });
          });

          // Debounce full patchAll: only run once per 2s
          if (patchTimeout) return;
          patchTimeout = setTimeout(function() {
            patchTimeout = null;
            patchAll();
          }, 2000);
        });
        setTimeout(function(){ _mainObs.observe(document.body, { childList: true, subtree: true }); }, 1000);
      }
    })();

    function switchInlineTab(tab) {
      var tabs = document.querySelectorAll('.il-tab');
      if (tab === 'login') {
        tabs[0].style.color = '#1ca8dd'; tabs[0].style.borderBottomColor = '#1ca8dd';
        tabs[1].style.color = '#7c7c7c'; tabs[1].style.borderBottomColor = 'transparent';
        document.getElementById('ilLogin').style.display = 'block';
        document.getElementById('ilRegister').style.display = 'none';
      } else {
        tabs[1].style.color = '#1ca8dd'; tabs[1].style.borderBottomColor = '#1ca8dd';
        tabs[0].style.color = '#7c7c7c'; tabs[0].style.borderBottomColor = 'transparent';
        document.getElementById('ilLogin').style.display = 'none';
        document.getElementById('ilRegister').style.display = 'block';
      }
    }

    function doInlineLogin() {
      var user = document.getElementById('ilLoginUser').value.trim();
      var pass = document.getElementById('ilLoginPass').value;
      var msg = document.getElementById('ilLoginMsg');
      if (!user || !pass) { msg.style.color='#d9534f'; msg.textContent='Please fill in all fields'; return; }
      msg.style.color='#7c7c7c'; msg.textContent='Logging in...';
      fetch('/api/v1/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:user,password:pass}) })
      .then(function(r){return r.json();})
      .then(function(d){
        if(d.status==='ok'&&d.accessToken){ msg.textContent=''; authSuccess(d,user); }
        else { msg.style.color='#d9534f'; msg.textContent=d.message||'Login failed'; }
      }).catch(function(){ msg.style.color='#d9534f'; msg.textContent='Connection error'; });
    }

    function doInlineRegister() {
      var user = document.getElementById('ilRegUser').value.trim();
      var email = document.getElementById('ilRegEmail').value.trim();
      var pass = document.getElementById('ilRegPass').value;
      var pass2 = document.getElementById('ilRegPass2').value;
      var msg = document.getElementById('ilRegMsg');
      if (!user||!email||!pass) { msg.style.color='#d9534f'; msg.textContent='Please fill in all fields'; return; }
      if (pass!==pass2) { msg.style.color='#d9534f'; msg.textContent='Passwords do not match'; return; }
      msg.style.color='#7c7c7c'; msg.textContent='Creating account...';
      fetch('/api/v1/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:user,email:email,password:pass}) })
      .then(function(r){return r.json();})
      .then(function(d){
        if(d.status==='ok'&&d.accessToken){ msg.textContent=''; authSuccess(d,user); }
        else { msg.style.color='#d9534f'; msg.textContent=d.message||'Registration failed'; }
      }).catch(function(){ msg.style.color='#d9534f'; msg.textContent='Connection error'; });
    }

    function doLogout() {
      console.log('[TF-Auth] doLogout() called');
      // 1. Clear all auth data (cookies + localStorage)
      if (window.__tfClearPersistedAuth) {
        window.__tfClearPersistedAuth();
      } else {
        localStorage.removeItem('setting_loginaccesstoken');
        localStorage.removeItem('setting_loginaccesstokenprovider');
        localStorage.removeItem('setting_pendinglogin');
        localStorage.removeItem('setting_channelid');
        localStorage.removeItem('setting_channelname');
        localStorage.removeItem('setting_tiktokname');
        localStorage.removeItem('setting_email');
        localStorage.removeItem('setting_owneruserid');
        localStorage.removeItem('setting_featurebasetoken');
        localStorage.removeItem('setting_dynamicsettings');
        localStorage.removeItem('setting_channelsignature');
        localStorage.removeItem('setting_ispro');
      }
      if (window.__tfClearAuthState) window.__tfClearAuthState();
      // 2. Clear in-memory state
      try {
        if (window.tfPageloadData) {
          window.tfPageloadData.me = {
            channelId: 0, channelName: '', accountChannelName: '', tiktokUsername: '',
            channel: { channelId: 0, channelName: '', dynamicSettings: {}, profiles: [] },
            isPro: false, authenticated: false,
            userFeatures: { isPro: false }, subscription: { isPro: false, plan: '', active: false }
          };
        }
      } catch (e) {}
      // 3. Notify server
      fetch('/api/v1/auth/logout', {method:'POST'}).catch(function(){});
      // 4. Full reload — Socket.IO will reconnect without cookie → guest session
      window.location.reload();
    }
    </script>
    """;

    // Full TikTok connect/disconnect logic ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â independent of bundle
    var tiktokConnectScript = """
    <script src="/js/tf-connect.js"></script>
    """;

    // Override tfPageloadData: redirect all zerody.one hosts to local server
    html = html.Replace("authApiHost:\"https://auth.zerody.one/\"", "authApiHost:\"\"");
    html = html.Replace("myinstantsApiHost:\"https://myinstantsapi.zerody.one/\"", "myinstantsApiHost:\"/myinstants-proxy/\"");
    html = html.Replace("connectorHost:\"https://tikfinity-cws-{instance}.zerody.one/\"", "connectorHost:\"\"");

    // Early CSS: unhide navigation-app and suppress toast errors
    var earlyCss = """
    <style id="tf-nav-early">
      /* Paint a dark canvas from the very first frame so the multiple
         bootstrap reloads (and switchProfile-triggered location.reload())
         don't flash white between renders. Matches Electron's
         backgroundColor #212121 used in main.js. */
      html { background: #1c1d22 !important; }
      body { background: #1c1d22 !important; color: #e5e7eb; }

      /* Switch-profile loading overlay — covers viewport during the bundle's
         reload chain (typically 8-12 reloads) so the user sees a clean
         loading state instead of UI flicker. Removed after 3s of stability. */
      #tf-switch-overlay {
        position: fixed; inset: 0;
        background: #1c1d22;
        z-index: 2147483647;
        display: flex; align-items: center; justify-content: center; flex-direction: column;
        opacity: 1; transition: opacity 400ms ease-out;
        pointer-events: all;
      }
      #tf-switch-overlay.tf-fade-out { opacity: 0; pointer-events: none; }
      #tf-switch-overlay-spinner {
        width: 56px; height: 56px;
        border: 4px solid rgba(255,255,255,0.08);
        border-top-color: #4dabf7;
        border-radius: 50%;
        animation: tf-switch-spin 800ms linear infinite;
      }
      #tf-switch-overlay-text {
        margin-top: 22px;
        color: #cbd5e0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
        font-size: 13px;
        letter-spacing: 0.5px;
        opacity: 0.85;
      }
      @keyframes tf-switch-spin { to { transform: rotate(360deg); } }
      html, body { width: 100% !important; min-height: 100vh !important; overflow-x: hidden !important; }
      #navigation-app.hidden, #pages.hidden { display: block !important; }
      /* Don't force min-height 100vh on inner page containers — bundle's home
         page can be short (just Welcome text) and a forced viewport-height
         leaves a black gap between topbar and Welcome footer. Let content
         flow naturally. */
      #navigation-app, #pages { width: 100% !important; max-width: 100vw !important; }
      /* Some bundle pages (Overlays gallery, Goals) put two wide cards side
         by side that overflow the viewport on narrower windows. Confine
         horizontal scroll to the inner page container so the body stays
         clean and the topbar doesn't bounce sideways. */
      #pages .page.pageenabled { display: block !important; opacity: 1 !important; visibility: visible !important; max-width: 100% !important; overflow-x: auto !important; }

      /* === GUEST STATE (tf-logged-out) === */
      /* Hide dropdowns/popups in profile area */
      body.tf-logged-out #navigation-app [class*="dropdown"],
      body.tf-logged-out #navigation-app [class*="Dropdown"],
      body.tf-logged-out #navigation-app [class*="popover"],
      body.tf-logged-out #navigation-app [class*="Popover"] {
        display: none !important;
        pointer-events: none !important;
      }
      /* === TWO TOPBARS: guest (static) vs logged-in (Vue) === */
      #tf-guest-topbar { display: none; position: fixed; top: 0; left: 0; right: 0; height: 48px; z-index: 10000; }
      body.tf-logged-out #tf-guest-topbar { display: block !important; }
      body.tf-logged-out #navigation-app .topbar { visibility: hidden !important; }
    </style>
    """;
    // NOTE: <head> injection is deferred until after `reloadGuard` is declared
    // below — see the html.Replace("<head>", ...) line that runs right before
    // the <body> injection. The guard must be the FIRST script in <head>,
    // BEFORE the bundle's own app.js, so it can patch Location.prototype.reload
    // before any bundle script captures the original reload reference. If we
    // injected the guard into <body> (as it was previously), the bundle's
    // <head> scripts would have already cached the original reload, bypassing
    // the guard entirely — that's what caused the reload loop to persist.
    // Inject custom login popup + TikTok connect hook right after <body>
    // Guest topbar: exact copy from tikfinity.zerody.one (logged-out state)
    // Shown via CSS when body.tf-logged-out, hides Vue topbar underneath
    var guestTopbar = """
    <div id="tf-guest-topbar">
      <div class="topbar bg-white/10 backdrop-blur-lg px-4 py-2 flex items-center pointer-events-auto relative z-2 overflow-visible">
        <div class="absolute z-0 h-full left-0 top-0 w-64 bg-[linear-gradient(92deg,rgba(212,53,85,0.14)_0%,rgba(48,46,46,0.00)_100%)] pointer-events-none"></div>
        <div class="absolute h-full right-0 top-0 w-32 bg-[linear-gradient(270deg,#343333_0%,rgba(52,51,51,0)_100%)] pointer-events-none"></div>
        <img src="/img/navigation/topbar-corner-left.svg" alt="" class="absolute left-0 top-full pointer-events-none">
        <img src="/img/navigation/topbar-corner-right.svg" alt="" class="absolute right-0 top-full pointer-events-none">
        <div class="flex items-center shrink-0 min-w-0 relative z-1">
          <a href="/" class="hover:scale-105 transition-all duration-200 shrink-0 relative"><img src="/img/tikfinity.png" alt="TikFinity Logo" class="size-8 tf-logo"></a>
          <div role="button" tabindex="0" class="search-trigger ml-6 flex items-center justify-between bg-[#222222] border border-white/8 rounded-lg p-2 cursor-pointer hover:border-white/12 overflow-hidden" style="opacity:1;width:15rem;margin-left:1.5rem;padding:0.5rem;"><div class="flex items-center gap-2"><i class="fa-solid fa-search text-sm"></i><span class="text-white/50 text-sm">Tìm kiếm</span></div><div class="flex items-center gap-2"><div class="flex items-center justify-center bg-white/16 rounded-md text-[10px] px-1.5 py-1 gap-1 border border-white/4"><i class="fa-solid fa-command"></i><span class="font-medium">K</span></div></div></div>
          <div class="flex items-center gap-2 text-sm mr-4 ml-8"><span class="flex gap-2 items-center text-white/50"><i class="fa-home fa-regular"></i><span class="truncate">Bắt đầu</span></span><span>/</span><span class="truncate">Bắt đầu</span><span class="bg-white/10 text-white/50 rounded-lg px-2 py-1 text-xs font-bold">10</span></div>
        </div>
        <div class="flex-1 min-w-0 flex items-center justify-center overflow-hidden relative z-1"></div>
        <div class="flex items-center gap-2.5 shrink-0 min-w-0 relative z-1">
          <div class="flex items-center gap-1">
            <div class="relative"><div class="relative cursor-pointer text-white/70 rounded-md px-2 py-2.5 hover:bg-white/6 hover:text-white group transition-all duration-200" tabindex="0" role="button"><i class="fa-regular fa-bell text-lg"></i></div></div>
            <div class="relative"><div class="relative cursor-pointer text-white/70 rounded-md px-2 py-2.5 hover:bg-white/6 hover:text-white transition-all duration-200" tabindex="0" role="button"><i class="fa-regular fa-question-circle text-lg"></i></div></div>
          </div>
          <div class="h-6 w-px bg-white/8"></div>
          <div class="relative" id="tf-guest-profile-btn" style="cursor:pointer;" onclick="event.preventDefault();event.stopPropagation();if(window.navigateToLogin)window.navigateToLogin();else{window.location.hash='#/tiktok/setup';setTimeout(function(){var i=document.getElementById('ilLoginUser');if(i){i.scrollIntoView({behavior:'smooth',block:'center'});i.focus();}},1000);}">
            <div class="px-2 py-1 rounded-md hover:bg-white/6 transition-all duration-200 flex gap-2 items-center cursor-pointer select-none h-10" role="button" tabindex="0">
              <div class="profile-avatar-wrap relative flex justify-center items-center w-10 h-10 shrink-0"><img src="/img/nothumb.webp" alt="Profile" class="size-8 rounded-full relative z-0"></div>
              <div class="flex flex-col"><span class="text-sm">Login</span><span class="text-xs text-white/70"> or create account</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script>
    (function() {
      var btn = document.getElementById('tf-guest-profile-btn');
      if (btn) btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (window.navigateToLogin) window.navigateToLogin();
        else window.location.hash = '#/tiktok/setup';
      });
    })();
    </script>
    """;
    // Web Speech API TTS hook — listens for chat / bot:say socket events and reads them aloud
    // through the browser's native synthesizer. Settings are read from localStorage so the
    // bundle's existing settings UI can drive enable/voice/rate/pitch without backend changes.
    // TTS shim: redirect Tikfinity's commercial TTS API to our local proxy.
    // The bundle hardcodes <c>tikfinity-tts-api.zerody.one</c> with their cid+token.
    // We intercept fetch() and audio src= to route those calls to /api/tts/generate,
    // which proxies TikTok's own TTS endpoint using the user's saved sessionid.
    //
    // Also keeps the Web Speech fallback patches so bundle's voice setter
    // never crashes when SpeechSynthesisUtterance picks an unloaded voice.
    var ttsVoiceShim = """
    <script>
    (function() {
      // ── 1. Redirect Tikfinity TTS API → our local proxy ──────────────
      var TIKFINITY_TTS_HOST = 'tikfinity-tts-api.zerody.one';
      function rewriteTtsUrl(url) {
        try {
          if (typeof url !== 'string') return url;
          if (url.indexOf(TIKFINITY_TTS_HOST) === -1) return url;
          var u = new URL(url, location.origin);
          var voice = u.searchParams.get('voice') || 'en_us_002';
          var text = u.searchParams.get('text') || '';
          return location.origin + '/api/tts/generate?voice=' + encodeURIComponent(voice) + '&text=' + encodeURIComponent(text);
        } catch (e) { return url; }
      }

      // Intercept fetch (most modern clients)
      var origFetch = window.fetch;
      if (origFetch) {
        window.fetch = function(input, init) {
          if (typeof input === 'string') {
            input = rewriteTtsUrl(input);
          } else if (input && input.url && input.url.indexOf(TIKFINITY_TTS_HOST) !== -1) {
            input = new Request(rewriteTtsUrl(input.url), input);
          }
          return origFetch(input, init);
        };
      }

      // Intercept XHR (legacy clients)
      var OrigXhrOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url) {
        arguments[1] = rewriteTtsUrl(url);
        return OrigXhrOpen.apply(this, arguments);
      };

      // Intercept Audio.src = X (some TTS code does `new Audio(url)`)
      var OrigAudio = window.Audio;
      window.Audio = function(src) {
        if (typeof src === 'string') src = rewriteTtsUrl(src);
        return new OrigAudio(src);
      };
      window.Audio.prototype = OrigAudio.prototype;

      var audioSrcDesc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
      if (audioSrcDesc && audioSrcDesc.set) {
        var origSrcSetter = audioSrcDesc.set;
        Object.defineProperty(HTMLMediaElement.prototype, 'src', {
          get: audioSrcDesc.get,
          set: function(v) { origSrcSetter.call(this, rewriteTtsUrl(v)); },
          configurable: true
        });
      }

      // ── 2. Web Speech voice fallback (for bundle's local TTS path) ───
      if (!window.speechSynthesis) return;

      // Eager voice load — Chromium's Web Speech API needs a kick to
      // populate getVoices() synchronously. Without this, the bundle's
      // first call returns [] and it caches an empty list.
      function loadVoices() {
        var vs = speechSynthesis.getVoices();
        if (vs && vs.length > 0) return vs;
        return [];
      }
      loadVoices();
      speechSynthesis.addEventListener('voiceschanged', function() {
        window.__tfVoicesReady = true;
        console.log('[TTS shim] voices loaded:', speechSynthesis.getVoices().length);
      });

      // Patch SpeechSynthesisUtterance so .voice = X falls back gracefully
      // when X isn't in the current voices list. Also auto-pick a voice
      // for the requested lang if none is set.
      var OrigUtt = window.SpeechSynthesisUtterance;
      var voiceDesc = Object.getOwnPropertyDescriptor(OrigUtt.prototype, 'voice');
      if (voiceDesc && voiceDesc.set) {
        var origSetter = voiceDesc.set;
        Object.defineProperty(OrigUtt.prototype, 'voice', {
          get: voiceDesc.get,
          set: function(v) {
            try {
              var all = speechSynthesis.getVoices();
              if (v && all.length && !all.includes(v)) {
                // Requested voice not in current list — find by name
                var byName = v.name ? all.find(function(x){ return x.name === v.name; }) : null;
                v = byName || all.find(function(x){ return (this.lang || '').slice(0,2) === (x.lang || '').slice(0,2); }, this) || all[0];
              }
              origSetter.call(this, v);
            } catch (e) {
              try { origSetter.call(this, null); } catch (e2) {}
            }
          },
          configurable: true
        });
      }

      // Intercept speak() to ensure a voice is set when bundle forgets to
      var origSpeak = speechSynthesis.speak.bind(speechSynthesis);
      speechSynthesis.speak = function(utt) {
        try {
          if (utt && !utt.voice) {
            var all = speechSynthesis.getVoices();
            if (all && all.length) {
              var lang = (utt.lang || 'en-US').toLowerCase().slice(0, 2);
              utt.voice = all.find(function(x){ return (x.lang || '').toLowerCase().slice(0,2) === lang; }) || all[0];
              if (!utt.lang && utt.voice) utt.lang = utt.voice.lang;
            }
          }
        } catch (e) { console.warn('[TTS shim] speak prep failed', e); }
        return origSpeak(utt);
      };
    })();
    </script>
    """;

    var ttsScript = """
    <script>
    (function() {
      if (!window.speechSynthesis) return;
      var SETTINGS_KEY = 'tf_tts_settings';

      function getSettings() {
        try {
          var raw = localStorage.getItem(SETTINGS_KEY);
          if (raw) return JSON.parse(raw);
        } catch (e) {}
        return { enabled: false, voice: '', rate: 1, pitch: 1, volume: 1, lang: 'vi-VN', readChat: true, readBot: true, maxLen: 200 };
      }
      function saveSettings(s) {
        try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (e) {}
      }

      function speak(text) {
        var s = getSettings();
        if (!s.enabled || !text) return;
        text = String(text).slice(0, s.maxLen || 200);
        // Strip emoji-only and trivial messages
        if (!/[\p{L}\p{N}]/u.test(text)) return;

        var utt = new SpeechSynthesisUtterance(text);
        utt.lang = s.lang || 'vi-VN';
        utt.rate = Math.max(0.1, Math.min(10, s.rate || 1));
        utt.pitch = Math.max(0, Math.min(2, s.pitch || 1));
        utt.volume = Math.max(0, Math.min(1, s.volume || 1));

        if (s.voice) {
          var voices = speechSynthesis.getVoices();
          var match = voices.find(function(v) { return v.name === s.voice; });
          if (match) utt.voice = match;
        }
        try { window.speechSynthesis.speak(utt); } catch (e) {}
      }

      // Hook the bundle's socket so we don't need a separate connection.
      function attach(io) {
        if (!io || io.__tfTtsAttached) return;
        io.__tfTtsAttached = true;
        if (typeof io.on === 'function') {
          io.on('chat', function(d) {
            var s = getSettings();
            if (!s.readChat) return;
            var msg = d && (d.comment || d.message);
            if (msg) speak(msg);
          });
          io.on('bot:say', function(d) {
            var s = getSettings();
            if (!s.readBot) return;
            var resp = d && d.response;
            if (resp) speak(resp);
          });
        }
      }

      // Wait for the bundle's socket instance.
      var attempts = 0;
      var poll = setInterval(function() {
        attempts++;
        if (window.__tfSocket || (window.io && window.io.connect)) {
          attach(window.__tfSocket);
        }
        if (attempts > 100) clearInterval(poll);
      }, 200);

      // Also expose on window so a settings panel can poke it.
      window.tfTts = {
        get: getSettings,
        set: function(patch) { saveSettings(Object.assign(getSettings(), patch)); },
        speak: speak,
        voices: function() {
          return (speechSynthesis.getVoices() || []).map(function(v) {
            return { name: v.name, lang: v.lang, default: v.default };
          });
        }
      };
    })();
    </script>
    """;

    // Twemoji polyfill — Windows' Segoe UI Emoji renders flag emojis (🇻🇳 🇺🇸 🇩🇪)
    // as 2-letter country codes in colored capsules instead of actual flag images.
    // Inject Twemoji to replace ALL emoji characters with inline SVG so the
    // language picker and other emoji-bearing UIs look like Tikfinity gốc.
    var twemojiScript = """
    <script src="/twemoji/twemoji.min.js"></script>
    <script>
    (function() {
      // Local Twemoji set served from /twemoji/svg/ — works offline, no CDN/WARP issues.
      var BASE = '/twemoji/';
      function applyTwemoji() {
        if (!window.twemoji) return false;
        try {
          window.twemoji.parse(document.body, {
            folder: 'svg', ext: '.svg', base: BASE,
            className: 'twemoji'
          });
        } catch (e) { console.warn('[twemoji] parse failed:', e); }
        return true;
      }
      // Style the inline twemoji <img> so it sits inline with text and has a
      // sensible default size matching the surrounding font.
      var style = document.createElement('style');
      style.textContent =
        'img.twemoji { height: 1em; width: 1em; margin: 0 0.05em 0 0.1em; vertical-align: -0.1em; display: inline-block; }';
      document.head.appendChild(style);

      // Initial parse + re-parse on every Vue mutation so dynamically rendered
      // emojis (language dropdown items, gift names, chat messages) get converted.
      function start() {
        applyTwemoji();
        var pending = false;
        new MutationObserver(function() {
          if (pending) return;
          pending = true;
          setTimeout(function() { pending = false; applyTwemoji(); }, 200);
        }).observe(document.body, { childList: true, subtree: true });
      }
      // twemoji loads async — wait until ready
      var tries = 0;
      var iv = setInterval(function() {
        tries++;
        if (window.twemoji) { clearInterval(iv); start(); }
        else if (tries > 50) clearInterval(iv);
      }, 100);
    })();
    </script>
    """;

    // TikTok sign-in gate. Intercepts Connect button clicks in capture phase
    // — if there's no saved TikTok session cookie, pops a confirm modal asking
    // the user to sign in. Yes opens the inline TikTok login window via the
    // electron preload (window.TFS.tiktokSignIn), saves the cookie, and
    // re-emits the Connect click so the bundle continues normally.
    var tiktokSigninGate = """
    <style id="tf-signin-style">
      .tf-signin-overlay {
        position: fixed; inset: 0; z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.55);
        font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      }
      .tf-signin-card {
        width: min(92vw, 460px);
        background: #2a2a2a;
        border: 1px solid #3a3a3a;
        border-radius: 4px;
        padding: 20px 22px 18px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.55);
        color: #f0f0f0;
      }
      .tf-signin-card h3 {
        margin: 0 0 12px;
        font-size: 15px;
        font-weight: 600;
        color: #ffffff;
      }
      .tf-signin-card p {
        margin: 0 0 8px;
        font-size: 13px;
        line-height: 1.55;
        color: #c8c8c8;
      }
      .tf-signin-card p + p { margin-bottom: 22px; }
      .tf-signin-actions {
        display: flex; justify-content: flex-end; gap: 10px;
      }
      .tf-signin-btn {
        appearance: none;
        cursor: pointer;
        padding: 7px 26px;
        min-width: 80px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 500;
        background: #3a3a3a;
        color: #f0f0f0;
        border: 1px solid #4a4a4a;
        transition: background 0.12s ease, border-color 0.12s ease;
      }
      .tf-signin-btn:hover {
        background: #454545;
        border-color: #5a5a5a;
      }
      .tf-signin-btn[disabled] { opacity: 0.5; cursor: progress; }
    </style>
    <script>
    (function() {
      if (!window.TFS || typeof window.TFS.tiktokSignIn !== 'function') {
        // Running outside Electron (browser dev) — skip the gate so the
        // bundle's normal Connect flow runs untouched.
        return;
      }

      function isConnectButton(el) {
        if (!el || el.nodeType !== 1) return false;
        if (el.tagName !== 'BUTTON' && el.getAttribute('role') !== 'button' && !el.classList.contains('dx-button')) return false;
        if (el.closest('nav, aside, [role="navigation"], .sidebar, .menu, .dropdown')) return false;
        var text = (el.textContent || '').trim().toLowerCase().replace(/\s+/g, ' ');
        if (text.length > 120) return false;

        // Fast-path for known exact labels.
        if (text === 'connect to tiktok live'
            || text === 'kết nối với tiktok live'
            || text === 'kết nối tiktok live') {
          return true;
        }

        // Robust matching for localized/variant labels from the obfuscated bundle.
        var hasConnectVerb = /\bconnect\b|\bkết nối\b/.test(text);
        var hasTikTok = text.indexOf('tiktok') >= 0;
        var hasTarget = /\blive\b|\btài khoản\b|\baccount\b/.test(text);
        if (hasConnectVerb && hasTikTok && hasTarget) return true;

        // Some controls use stable IDs even when label text changes.
        var id = String(el.id || '').toLowerCase();
        if (id.indexOf('manualconnectbuttonsetup') >= 0) return true;
        if (id.indexOf('connect') >= 0 && id.indexOf('tiktok') >= 0) return true;

        return false;
      }

      function findButton(target) {
        var el = target;
        for (var i = 0; i < 6 && el; i++) {
          if (isConnectButton(el)) return el;
          el = el.parentElement;
        }
        return null;
      }

      function showModal() {
        return new Promise(function(resolve) {
          var overlay = document.createElement('div');
          overlay.className = 'tf-signin-overlay';
          overlay.innerHTML =
            '<div class="tf-signin-card" role="dialog" aria-modal="true" aria-labelledby="tf-signin-title">' +
              '<h3 id="tf-signin-title">TikTok Login required</h3>' +
              '<p>To connect to TikTok LIVE you need to log in to your TikTok account.</p>' +
              '<p>Do you want to log in now?</p>' +
              '<div class="tf-signin-actions">' +
                '<button type="button" class="tf-signin-btn" data-tf-signin="yes">Yes</button>' +
                '<button type="button" class="tf-signin-btn" data-tf-signin="no">No</button>' +
              '</div>' +
            '</div>';
          document.body.appendChild(overlay);

          var yesBtn = overlay.querySelector('[data-tf-signin="yes"]');
          var noBtn = overlay.querySelector('[data-tf-signin="no"]');
          var done = false;

          function finish(result) {
            if (done) return; done = true;
            try { overlay.remove(); } catch (e) {}
            resolve(result);
          }

          noBtn.addEventListener('click', function() { finish({ ok: false, cancelled: true }); });
          overlay.addEventListener('click', function(e) {
            if (e.target === overlay) finish({ ok: false, cancelled: true });
          });

          yesBtn.addEventListener('click', async function() {
            yesBtn.disabled = true;
            noBtn.disabled = true;
            yesBtn.textContent = 'Đang mở…';
            try {
              var r = await window.TFS.tiktokSignIn();
              finish(r || { ok: false });
            } catch (err) {
              finish({ ok: false, error: err && err.message ? err.message : String(err) });
            }
          });
        });
      }

      var clickInProgress = false;

      document.addEventListener('click', async function(e) {
        if (clickInProgress) return;
        var btn = findButton(e.target);
        if (!btn) return;

        // Re-emitted programmatic click after sign-in succeeds — let it through.
        if (btn.dataset.tfSigninPassthrough === '1') {
          delete btn.dataset.tfSigninPassthrough;
          return;
        }

        // Ignore synthetic clicks fired by the bundle during boot/reload.
        // Only real user clicks should open the TikTok auth prompt.
        if (!e.isTrusted) return;

        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        clickInProgress = true;

        try {
          var status = await window.TFS.tiktokGetStatus();
          if (status && status.signedIn) {
            // Already have a saved sessionid — re-emit the click so the
            // bundle's own handler runs.
            btn.dataset.tfSigninPassthrough = '1';
            btn.click();
            return;
          }
          var result = await showModal();
          if (result && result.ok) {
            btn.dataset.tfSigninPassthrough = '1';
            btn.click();
          }
        } catch (err) {
          console.error('[tf-signin] gate error:', err);
        } finally {
          clickInProgress = false;
        }
      }, true); // capture phase — runs before Vue's delegated handler
    })();
    </script>
    """;

    var reloadMask = """
    <style id="tf-reload-hide-all">
      html.tf-reloading > body > *:not(#tf-reload-mask) {
        visibility: hidden !important;
      }
    </style>
    <style id="tf-reload-mask-style">
      #tf-reload-mask {
        display: none;
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: #212121;
        background-image:
          radial-gradient(circle at 30% 20%, rgba(255, 0, 80, 0.15) 0%, transparent 45%),
          radial-gradient(circle at 80% 80%, rgba(0, 242, 234, 0.10) 0%, transparent 45%),
          linear-gradient(160deg, #1a1a1a 0%, #212121 100%);
        z-index: 2147483647;
        opacity: 0;
        transition: opacity 150ms ease-out;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      #tf-reload-mask.active {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 1;
        visibility: visible !important;
      }
      #tf-reload-mask .mask-inner {
        text-align: center;
        color: #fff;
      }
      #tf-reload-mask .mask-title {
        font-size: 22px;
        font-weight: 700;
        letter-spacing: 0.5px;
        background: linear-gradient(90deg, #ff0050, #00f2ea);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 4px;
      }
      #tf-reload-mask .mask-subtitle {
        font-size: 11px;
        color: #9aa0a6;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        margin-bottom: 24px;
      }
      #tf-reload-mask .mask-spinner {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.12);
        border-top-color: #ff0050;
        border-radius: 50%;
        animation: tf-spin 0.8s linear infinite;
        margin-bottom: 16px;
      }
      @keyframes tf-spin { to { transform: rotate(360deg); } }
      #tf-reload-mask .mask-progress-bar {
        width: 240px;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
        margin: 8px auto 0;
      }
      #tf-reload-mask .mask-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff0050, #00f2ea);
        width: 0%;
        transition: width 250ms ease-out;
      }
      #tf-reload-mask .mask-progress-text {
        font-size: 12px;
        color: #c4c7c5;
        margin-top: 10px;
        letter-spacing: 0.2px;
      }
    </style>
    <div id="tf-reload-mask">
      <div class="mask-inner">
        <div class="mask-title">TikFinity</div>
        <div class="mask-subtitle">Local Stream Studio</div>
        <div class="mask-spinner"></div>
        <div class="mask-progress-bar">
          <div id="tf-reload-fill" class="mask-progress-fill"></div>
        </div>
        <div id="tf-reload-text" class="mask-progress-text">0/10</div>
      </div>
    </div>
    <script>
      (function() {
        const mask = document.getElementById('tf-reload-mask');
        const fill = document.getElementById('tf-reload-fill');
        const text = document.getElementById('tf-reload-text');
        const TOTAL = 10;
        const STORAGE_KEY = 'tf-reload-step';
        const STORAGE_TIME_KEY = 'tf-reload-time';
        const RESET_AFTER_MS = 4000;
        let endTimer = null;

        function getStep() {
          const t = parseInt(sessionStorage.getItem(STORAGE_TIME_KEY) || '0', 10);
          if (!t || Date.now() - t > RESET_AFTER_MS) {
            sessionStorage.removeItem(STORAGE_KEY);
            sessionStorage.removeItem(STORAGE_TIME_KEY);
            return 0;
          }
          return parseInt(sessionStorage.getItem(STORAGE_KEY) || '0', 10);
        }

        function render(step) {
          if (!mask) return;
          const pct = Math.min(100, (step / TOTAL) * 100);
          fill.style.width = pct + '%';
          text.textContent = step + '/' + TOTAL;
          mask.classList.add('active');
          document.documentElement.classList.add('tf-reloading');
        }

        function hide() {
          if (!mask) return;
          mask.classList.remove('active');
          document.documentElement.classList.remove('tf-reloading');
          sessionStorage.removeItem(STORAGE_KEY);
          sessionStorage.removeItem(STORAGE_TIME_KEY);
        }

        function scheduleHide() {
          if (endTimer) clearTimeout(endTimer);
          const t = parseInt(sessionStorage.getItem(STORAGE_TIME_KEY) || '0', 10);
          if (!t) {
            hide();
            return;
          }
          const age = Date.now() - t;
          const remaining = Math.max(0, RESET_AFTER_MS - age);
          endTimer = setTimeout(() => {
            hide();
          }, remaining + 50);
        }

        function showMask() {
          const current = getStep();
          const next = Math.min(TOTAL, current + 1);
          sessionStorage.setItem(STORAGE_KEY, String(next));
          sessionStorage.setItem(STORAGE_TIME_KEY, String(Date.now()));
          render(next);
          scheduleHide();
        }

        // On page load: if we're mid-chain, hide everything immediately
        // and render mask. The class is added on <html> so it applies before
        // any bundle content paints.
        const stored = getStep();
        if (stored > 0) {
          document.documentElement.classList.add('tf-reloading');
          render(stored);
          scheduleHide();
        }

        window.TFS = window.TFS || {};
        window.TFS.__reloadMask = { show: showMask, hide: hide };
      })();
    </script>
    """;

    // ── Persistent reload guard (Phase 1 of switch-profile fix) ──
    // Bundle calls location.reload() in chain (8-12 times) on switch profile.
    // Previous in-memory guard reset on each reload. Use sessionStorage so the
    // counter survives the chain, and BLOCK 2nd+ reload within 8s.
    //
    // Must be the FIRST script in <body> so it patches location.reload before
    // any bundle module loads (and possibly stashes its own reference).
    var reloadGuard = """
    <script>
    (function() {
      var KEY_PREFIX = 'tf-reload-lock:';
      var TIME_SUFFIX = ':time';
      var LOCK_TTL_MS = 60000;
      var MAX_VISIBLE = 1;

      function readStableScopeValue(key) {
        try {
          var localValue = localStorage.getItem(key);
          var sessionValue = sessionStorage.getItem(key);
          if (localValue) {
            if (sessionValue !== localValue) {
              sessionStorage.setItem(key, localValue);
            }
            return String(localValue);
          }
          if (sessionValue) {
            return String(sessionValue);
          }
        } catch (_) {}
        return '';
      }

      function getProfileScope() {
        var channelId = readStableScopeValue('setting_channelid') || 'unknown-channel';
        var profileId = readStableScopeValue('setting_profileid') || 'unknown-profile';
        return channelId + ':' + profileId;
      }

      function getScopeKey(targetUrl) {
        var path = location.pathname;
        try {
          if (targetUrl) {
            var parsed = new URL(String(targetUrl), location.href);
            path = parsed.pathname || location.pathname;
          }
        } catch (_) {}
        return KEY_PREFIX + getProfileScope() + ':' + path;
      }

      function readCount(targetUrl) {
        var key = getScopeKey(targetUrl);
        var timeKey = key + TIME_SUFFIX;
        var t = parseInt(sessionStorage.getItem(timeKey) || '0', 10);
        if (!t || Date.now() - t > LOCK_TTL_MS) {
          sessionStorage.removeItem(key);
          sessionStorage.removeItem(timeKey);
          return 0;
        }
        return parseInt(sessionStorage.getItem(key) || '0', 10);
      }

      function bumpCount(targetUrl) {
        var key = getScopeKey(targetUrl);
        var timeKey = key + TIME_SUFFIX;
        var c = readCount(targetUrl) + 1;
        sessionStorage.setItem(key, String(c));
        sessionStorage.setItem(timeKey, String(Date.now()));
        return c;
      }

      // Bundle uses location.reload(), location.href = X, location.assign(),
      // and location.replace() interchangeably for "refresh state" actions.
      // Wrap all four so the chain is capped no matter which path bundle picks.
      function shouldAllowNavigation(targetUrl) {
        var current = readCount(targetUrl);
        if (current >= MAX_VISIBLE) {
          console.warn('[reload-guard] BLOCKED nav #' + (current + 1) + ' scope=' + getScopeKey(targetUrl) + ' target=' + targetUrl);
          return false;
        }
        bumpCount(targetUrl);
        console.log('[reload-guard] ALLOW nav #' + (current + 1) + ' scope=' + getScopeKey(targetUrl) + (targetUrl ? ' target=' + targetUrl : ''));
        return true;
      }

      var Lp = Object.getPrototypeOf(location) || Location.prototype;
      var origReload = location.reload.bind(location);
      var origAssign = location.assign.bind(location);
      var origReplace = location.replace.bind(location);

      function guardedReload() {
        if (!shouldAllowNavigation(location.href)) return;
        return origReload();
      }
      function guardedAssign(url) {
        if (!shouldAllowNavigation(url)) return;
        return origAssign(url);
      }
      function guardedReplace(url) {
        if (!shouldAllowNavigation(url)) return;
        return origReplace(url);
      }

      try {
        Object.defineProperty(Lp, 'reload', { configurable: true, writable: true, value: guardedReload });
        Object.defineProperty(Lp, 'assign', { configurable: true, writable: true, value: guardedAssign });
        Object.defineProperty(Lp, 'replace', { configurable: true, writable: true, value: guardedReplace });
      } catch (e) {
        try {
          location.reload = guardedReload;
          location.assign = guardedAssign;
          location.replace = guardedReplace;
        } catch (e2) {
          console.warn('[reload-guard] could not install:', e2 && e2.message);
        }
      }
      // An earlier script (blockScript injected in head) may have set window.location.reload
      // as an own property, which shadows the prototype patch above.
      // Force-override the own property so our guard is always in the call path.
      try { location.reload = guardedReload; } catch(e) {}
      try { location.assign = guardedAssign; } catch(e) {}
      try { location.replace = guardedReplace; } catch(e) {}

      // location.href = X is a separate path — intercept the setter.
      // Same-document hash changes don't trigger full reload, so we only guard
      // navigations whose target differs from current pathname.
      try {
        var hrefDesc = Object.getOwnPropertyDescriptor(Lp, 'href');
        if (hrefDesc && hrefDesc.set) {
          var origHrefSetter = hrefDesc.set;
          Object.defineProperty(Lp, 'href', {
            configurable: true,
            get: hrefDesc.get,
            set: function(v) {
              try {
                var newUrl = String(v);
                // Same-page hash navigation → allow without counting
                if (newUrl.indexOf('#') !== -1) {
                  var basePart = newUrl.split('#')[0];
                  if (!basePart || basePart === location.href.split('#')[0]) {
                    return origHrefSetter.call(this, v);
                  }
                }
                if (!shouldAllowNavigation(newUrl)) return;
                return origHrefSetter.call(this, v);
              } catch (e) {
                return origHrefSetter.call(this, v);
              }
            }
          });
        }
      } catch (e) { console.warn('[reload-guard] href setter hook failed:', e && e.message); }

      // Diagnostic surface for debugging
      window.TFS = window.TFS || {};
      window.TFS.__reloadGuard = {
        currentCount: function(targetUrl) { return readCount(targetUrl); },
        reset: function() {
          var key = getScopeKey();
          sessionStorage.removeItem(key);
          sessionStorage.removeItem(key + TIME_SUFFIX);
        }
      };
    })();
    </script>
    """;

    // Inject the reload guard as the FIRST thing after <head>, before any
    // bundle scripts. See note above the deferred <head> comment.
    html = html.Replace("<head>", "<head>" + reloadGuard + earlyCss + blockScript + authScript, StringComparison.OrdinalIgnoreCase);
    html = html.Replace("<body>", "<body class=\"tf-logged-out\">" + ttsVoiceShim + guestTopbar + loginPopupScript + tiktokConnectScript + ttsScript + twemojiScript + tiktokSigninGate + reloadMask, StringComparison.OrdinalIgnoreCase);
    return Encoding.UTF8.GetBytes(html);
}

/// <summary>
/// For widget HTML responses, inject a small CSS shim that forces transparent
/// background + 0 margin on body. Many widget templates default to a white
/// browser background, which looks ugly in OBS overlays. Injects right after
/// the opening &lt;head&gt; so no widget-specific style overrides our defaults
/// (any subsequent rule with higher specificity still wins).
/// </summary>
static byte[] MaybeInjectWidgetCss(string reqPath, byte[] original)
{
    if (!reqPath.StartsWith("/widget/", StringComparison.OrdinalIgnoreCase)) return original;

    const string overlayCss = """
<style id="tf-widget-overlay-shim">
  html, body { background: transparent !important; margin: 0 !important; padding: 0 !important; }
</style>
""";

    var html = System.Text.Encoding.UTF8.GetString(original);
    var headIdx = html.IndexOf("<head", StringComparison.OrdinalIgnoreCase);
    if (headIdx < 0) return original;
    var headEnd = html.IndexOf('>', headIdx);
    if (headEnd < 0) return original;
    var injected = html.Substring(0, headEnd + 1) + overlayCss + html.Substring(headEnd + 1);
    return System.Text.Encoding.UTF8.GetBytes(injected);
}

static string GetMime(string filePath)
{
    var ext = Path.GetExtension(filePath).ToLower();
    return ext switch
    {
        ".js" or ".mjs" => "application/javascript",
        ".css" => "text/css",
        ".html" or ".htm" => "text/html",
        ".json" => "application/json",
        ".svg" => "image/svg+xml",
        ".png" => "image/png",
        ".jpg" or ".jpeg" => "image/jpeg",
        ".gif" => "image/gif",
        ".webp" => "image/webp",
        ".ico" => "image/x-icon",
        ".woff" => "font/woff",
        ".woff2" => "font/woff2",
        ".ttf" => "font/ttf",
        ".mp3" => "audio/mpeg",
        ".mp4" => "video/mp4",
        ".wav" => "audio/wav",
        _ => "application/octet-stream"
    };
}

static string ResolveMime(string filePath, byte[] data)
{
    var ext = Path.GetExtension(filePath).ToLowerInvariant();
    if (string.IsNullOrEmpty(ext) && LooksLikeHtml(data))
    {
        return "text/html; charset=utf-8";
    }

    var mime = GetMime(filePath);
    return mime == "text/html" ? "text/html; charset=utf-8" : mime;
}

static bool LooksLikeHtml(byte[] data)
{
    var limit = Math.Min(data.Length, 256);
    for (var i = 0; i < limit; i++)
    {
        var ch = (char)data[i];
        if (ch == '<')
        {
            return true;
        }

        if (!char.IsWhiteSpace(ch))
        {
            return false;
        }
    }

    return false;
}
