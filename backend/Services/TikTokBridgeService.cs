using System.Collections.Concurrent;
using System.Diagnostics;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;

namespace TikFinityBackend.Services;

/// <summary>
/// Manages the Node.js TikTok bridge process and forwards TikTok LIVE events
/// to connected Socket.IO clients via the SocketManager.
/// </summary>
public class TikTokBridgeService : BackgroundService
{
    private readonly ILogger<TikTokBridgeService> _logger;
    private readonly SocketManager _socketManager;
    private readonly IServiceProvider _serviceProvider;
    private Process? _nodeProcess;
    private ClientWebSocket? _bridgeWs;
    private readonly SemaphoreSlim _bridgeLock = new(1, 1);
    private volatile bool _connected;
    private volatile bool _connecting;
    private volatile string? _currentUsername;
    private volatile string? _lastConnectionError;
    private long _lastErrorAtUnixMs;
    private CancellationTokenSource? _connectWatchdogCts;
    private readonly object _watchdogLock = new();
    private int _viewerCount;
    private int _peakViewerCount;
    private int _likeCount;
    private int _giftCount;
    private int _diamondCount;
    private int _followerCount;
    private int _shareCount;
    private int _bridgePort = 5288;

    // ── Top Gifter / Top Liker aggregation ──
    private readonly ConcurrentDictionary<string, GiftUserData> _topGifters = new();
    private readonly ConcurrentDictionary<string, LikeUserData> _topLikers = new();

    private record GiftUserData(string Username, string Nickname, string ProfilePictureUrl, string UserId, int TotalAmount);
    private record LikeUserData(string Username, string Nickname, string ProfilePictureUrl, string UserId, int TotalAmount);

    // ── Ranking (all-time user spend tracking) ──
    private readonly ConcurrentDictionary<string, RankingUserData> _rankingUsers = new();
    private record RankingUserData(string Username, string Nickname, string ProfilePictureUrl, string UserId, int TotalAmount, int TotalRewardAmount);

    // ── Last events tracking (lastx widget) ──
    private readonly ConcurrentDictionary<string, LastEventData> _lastEvents = new();
    private record LastEventData(string Name, string ProfilePictureUrl);

    // ── Top gift tracking (topg widget) ──
    private string _topGiftUsername = "";
    private string _topGiftPictureUrl = "";
    private int _topGiftCount = 0;
    private string _topGiftTitle = "";

    // ── Goal tracking ──
    // Per-event counters drive built-in goal types (follows/likes/shares/...).
    private int _subscriberCount;
    private int _customGoal1;
    // Dynamic goal config loaded from DB; refreshed by GoalsController on CRUD.
    private List<GoalConfig> _goalConfigs = new();
    private record GoalConfig(int Id, string Name, string Type, int Target);
    private bool _goalsLoaded;

    // ── Gift counter (gcounter widget) ──
    private readonly ConcurrentDictionary<string, GiftCounterData> _giftCounters = new();
    private record GiftCounterData(int Current, bool Reached);

    // ── Timer state ──
    private volatile string _timerState = "stopped"; // stopped, running, paused
    private DateTime _timerStartedAt;
    private int _timerDurationMs;
    private int _timerElapsedBeforePauseMs;

    public bool IsConnectedToTikTok => _connected;
    public bool IsConnecting => _connecting;
    public string? CurrentUsername => _currentUsername;
    public string? LastConnectionError => _lastConnectionError;
    public long LastErrorAtUnixMs => Interlocked.Read(ref _lastErrorAtUnixMs);

    public TikTokBridgeService(
        ILogger<TikTokBridgeService> logger,
        SocketManager socketManager,
        IServiceProvider serviceProvider)
    {
        _logger = logger;
        _socketManager = socketManager;
        _serviceProvider = serviceProvider;
    }

    private static string ResolveBridgePath()
    {
        var envPath = Environment.GetEnvironmentVariable("TIKFINITY_BRIDGE_PATH");
        if (!string.IsNullOrWhiteSpace(envPath) && File.Exists(Path.Combine(envPath, "index.js")))
            return Path.GetFullPath(envPath);

        var exeDir = AppContext.BaseDirectory;
        var cwd = Directory.GetCurrentDirectory();

        // Ordered: published exe (sibling of exe), dev (sibling of backend/), VS bin/Debug, electron resources.
        var candidates = new[]
        {
            Path.Combine(exeDir, "tiktok-bridge"),
            Path.Combine(cwd, "..", "tiktok-bridge"),
            Path.Combine(cwd, "tiktok-bridge"),
            Path.Combine(exeDir, "..", "tiktok-bridge"),
        };

        foreach (var candidate in candidates)
        {
            var resolved = Path.GetFullPath(candidate);
            if (File.Exists(Path.Combine(resolved, "index.js")))
                return resolved;
        }

        return Path.GetFullPath(Path.Combine(exeDir, "tiktok-bridge"));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            await StartNodeProcess(stoppingToken);
            await Task.Delay(2000, stoppingToken);
            await ConnectToBridge(stoppingToken);
            await ReceiveLoop(stoppingToken);
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
            // Normal shutdown - ignore
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[TikTok Bridge] ExecuteAsync failed");
        }
    }

    private Task StartNodeProcess(CancellationToken ct)
    {
        var bridgePath = ResolveBridgePath();
        var indexPath = Path.Combine(bridgePath, "index.js");
        if (!File.Exists(indexPath))
        {
            _logger.LogWarning("[TikTok Bridge] index.js not found at {Path}, bridge disabled", indexPath);
            return Task.CompletedTask;
        }

        _logger.LogInformation("[TikTok Bridge] Starting Node.js bridge from {Path}", bridgePath);

        _nodeProcess = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = "node",
                Arguments = "index.js",
                WorkingDirectory = bridgePath,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true,
                Environment = { ["BRIDGE_PORT"] = _bridgePort.ToString() }
            }
        };

        _nodeProcess.OutputDataReceived += (_, e) =>
        {
            if (!string.IsNullOrEmpty(e.Data))
            {
                _logger.LogInformation("[Bridge] {Data}", e.Data);
                // Parse actual port from bridge output (may differ if preferred port was busy)
                if (e.Data.Contains("listening on ws://"))
                {
                    var match = System.Text.RegularExpressions.Regex.Match(e.Data, @":(\d+)$");
                    if (match.Success && int.TryParse(match.Groups[1].Value, out var actualPort))
                    {
                        if (actualPort != _bridgePort)
                        {
                            _logger.LogInformation("[TikTok Bridge] Bridge using port {Port} (preferred was {Preferred})", actualPort, _bridgePort);
                        }
                        _bridgePort = actualPort;
                    }
                }
            }
        };
        _nodeProcess.ErrorDataReceived += (_, e) =>
        {
            if (string.IsNullOrEmpty(e.Data)) return;
            // Suppress the multi-line ASCII art banner Eulerstream prints to stderr
            // ("+--- SIGN SERVER MESSAGE ---+" / "| You have reached the rate limit |").
            // It's a 4-line block of "+", "|", whitespace that flooded the logs and
            // mis-rendered as a UI banner before we tightened the bundle's denylist.
            var trimmed = e.Data.TrimStart();
            if (trimmed.StartsWith("+-") || (trimmed.StartsWith("|") && trimmed.EndsWith("|") && !trimmed.Contains("rate limit", StringComparison.OrdinalIgnoreCase) && !trimmed.Contains("Sign up", StringComparison.OrdinalIgnoreCase)))
            {
                _logger.LogDebug("[Bridge ERR-banner] {Data}", e.Data);
                return;
            }
            _logger.LogWarning("[Bridge ERR] {Data}", e.Data);
        };

        try
        {
            _nodeProcess.Start();
            _nodeProcess.BeginOutputReadLine();
            _nodeProcess.BeginErrorReadLine();
            _logger.LogInformation("[TikTok Bridge] Node.js process started (PID: {Pid})", _nodeProcess.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[TikTok Bridge] Failed to start Node.js process");
        }

        return Task.CompletedTask;
    }

    private async Task<bool> ConnectToBridge(CancellationToken ct)
    {
        await _bridgeLock.WaitAsync(ct);
        try
        {
            return await ConnectToBridgeInternalAsync(ct);
        }
        finally
        {
            _bridgeLock.Release();
        }
    }

    private async Task ReceiveLoop(CancellationToken ct)
    {
        var socket = await GetBridgeSocketAsync(ct);
        if (socket == null)
            return;

        var buffer = new byte[65536];

        while (!ct.IsCancellationRequested)
        {
            try
            {
                if (socket.State != WebSocketState.Open)
                {
                    break;
                }

                var result = await socket.ReceiveAsync(buffer, ct);
                if (result.MessageType == WebSocketMessageType.Close) break;

                var json = Encoding.UTF8.GetString(buffer, 0, result.Count);
                await HandleBridgeMessage(json);
            }
            catch (OperationCanceledException) { break; }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[TikTok Bridge] Receive error");
                // Try to reconnect
                await Task.Delay(3000, ct);
                if (!await ConnectToBridge(ct))
                {
                    break;
                }

                socket = await GetBridgeSocketAsync(ct);
                if (socket == null)
                {
                    break;
                }
            }
        }
    }

    private async Task<ClientWebSocket?> GetBridgeSocketAsync(CancellationToken ct)
    {
        await _bridgeLock.WaitAsync(ct);
        try
        {
            return _bridgeWs;
        }
        finally
        {
            _bridgeLock.Release();
        }
    }

    private async Task<bool> SendBridgeCommandAsync(object payload, string actionName, CancellationToken ct, bool allowReconnect = true)
    {
        await _bridgeLock.WaitAsync(ct);
        try
        {
            if (_bridgeWs == null || _bridgeWs.State != WebSocketState.Open)
            {
                if (!allowReconnect)
                {
                    _logger.LogWarning("[TikTok] Bridge WS not open (state={State}), cannot send {Action}",
                        _bridgeWs == null ? "null" : _bridgeWs.State.ToString(), actionName);
                    return false;
                }

                _logger.LogWarning("[TikTok] Bridge WS not open (state={State}), attempting reconnect...",
                    _bridgeWs == null ? "null" : _bridgeWs.State.ToString());

                if (!await ConnectToBridgeInternalAsync(ct))
                {
                    return false;
                }
            }

            if (_bridgeWs == null || _bridgeWs.State != WebSocketState.Open)
            {
                _logger.LogError("[TikTok] Bridge reconnect failed, cannot send {Action}", actionName);
                return false;
            }

            var cmd = JsonSerializer.Serialize(payload);
            await _bridgeWs.SendAsync(Encoding.UTF8.GetBytes(cmd), WebSocketMessageType.Text, true, ct);
            return true;
        }
        finally
        {
            _bridgeLock.Release();
        }
    }

    private async Task<bool> ConnectToBridgeInternalAsync(CancellationToken ct)
    {
        if (_bridgeWs?.State == WebSocketState.Open)
        {
            return true;
        }

        // Close any existing connection first to prevent leaks
        if (_bridgeWs != null)
        {
            try
            {
                if (_bridgeWs.State == WebSocketState.Open || _bridgeWs.State == WebSocketState.CloseReceived)
                    await _bridgeWs.CloseAsync(WebSocketCloseStatus.NormalClosure, "Reconnecting", CancellationToken.None);
                _bridgeWs.Dispose();
            }
            catch { }
            _bridgeWs = null;
        }

        for (int attempt = 0; attempt < 10; attempt++)
        {
            ClientWebSocket? candidate = null;
            try
            {
                candidate = new ClientWebSocket();
                await candidate.ConnectAsync(new Uri($"ws://127.0.0.1:{_bridgePort}"), ct);
                _bridgeWs = candidate;
                _logger.LogInformation("[TikTok Bridge] Connected to bridge WebSocket");
                return true;
            }
            catch
            {
                _logger.LogDebug("[TikTok Bridge] Bridge not ready, retrying ({Attempt}/10)...", attempt + 1);
                try { candidate?.Dispose(); } catch { }
                if (attempt < 9)
                {
                    await Task.Delay(1000, ct);
                }
            }
        }

        _logger.LogError("[TikTok Bridge] Could not connect to bridge after 10 attempts");
        return false;
    }

    private async Task HandleBridgeMessage(string json)
    {
        try
        {
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            var eventName = root.GetProperty("event").GetString() ?? "";
            var data = root.GetProperty("data");

            _logger.LogInformation("[Bridge MSG] event={EventName}", eventName);

            switch (eventName)
            {
                case "connected":
                    CancelConnectWatchdog();
                    _connected = true;
                    _connecting = false;
                    _lastConnectionError = null;
                    _currentUsername = data.TryGetProperty("username", out var un) ? un.GetString() : null;
                    _logger.LogInformation("[TikTok] Connected to @{Username}", _currentUsername);

                    // Reset stats
                    _viewerCount = 0; _likeCount = 0; _giftCount = 0; _diamondCount = 0; _followerCount = 0;
                    _subscriberCount = 0; _customGoal1 = 0;
                    _topGifters.Clear();
                    _topLikers.Clear();
                    _rankingUsers.Clear();
                    _lastEvents.Clear();
                    _topGiftUsername = ""; _topGiftPictureUrl = ""; _topGiftCount = 0; _topGiftTitle = "";

                    // Notify frontend
                    await _socketManager.BroadcastEvent("channelStatus", new
                    {
                        connected = true,
                        channelId = 1,
                        channelName = _currentUsername,
                        status = "connected",
                        tiktokUsername = _currentUsername
                    });
                    await _socketManager.BroadcastEvent("status", new { connected = true, tiktok = true, connecting = false });
                    break;

                case "disconnected":
                case "streamEnd":
                    CancelConnectWatchdog();
                    _connected = false;
                    _connecting = false;
                    var reason = eventName == "streamEnd" ? "Stream ended" : "Disconnected";
                    _logger.LogInformation("[TikTok] {Reason} from @{Username}", reason, _currentUsername);
                    _currentUsername = null;

                    await _socketManager.BroadcastEvent("channelStatus", new
                    {
                        connected = false,
                        channelId = 1,
                        status = "disconnected"
                    });
                    await _socketManager.BroadcastEvent("status", new { connected = false, tiktok = false, connecting = false });
                    await _socketManager.BroadcastEvent("stats", new { viewers = 0, likes = 0, gifts = 0, diamonds = 0, followers = 0 });
                    break;

                case "connectFailed":
                    CancelConnectWatchdog();
                    var msg = data.TryGetProperty("message", out var m) ? m.GetString() : "Connection failed";
                    var failedUsername = data.TryGetProperty("username", out var failedUser) ? failedUser.GetString() : _currentUsername;
                    _connected = false;
                    _connecting = false;
                    _lastConnectionError = msg;
                    Interlocked.Exchange(ref _lastErrorAtUnixMs, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
                    if (!string.IsNullOrWhiteSpace(failedUsername))
                    {
                        _currentUsername = failedUsername;
                    }
                    _logger.LogWarning("[TikTok] Connection failed: {Message}", msg);
                    // Broadcast disconnected (resets topbar from "Connecting..." → idle)
                    // AND connectFailed (lets the bundle render its native "Connection
                    // Failed" popup). The previous suppressBridgeBanner script that was
                    // hiding these banners has been removed — we want the user to see
                    // failures clearly now.
                    await _socketManager.BroadcastEvent("channelStatus", new
                    {
                        connected = false,
                        channelId = 1,
                        channelName = failedUsername,
                        status = "disconnected",
                        tiktokUsername = failedUsername,
                        username = failedUsername
                    });
                    await _socketManager.BroadcastEvent("status", new { connected = false, tiktok = false, connecting = false });
                    await _socketManager.BroadcastEvent("connectFailed", new
                    {
                        username = failedUsername,
                        message = msg ?? "Connection failed"
                    });
                    break;

                case "connecting":
                    _connecting = true;
                    // Keep _lastConnectionError set — clearing it here would erase
                    // the message before the popup poller has a chance to read it.
                    // It is reset on a successful "connected" event instead.
                    await _socketManager.BroadcastEvent("status", new { connected = false, tiktok = false, connecting = true });
                    break;

                case "chat":
                case "gift":
                case "like":
                case "share":
                case "follow":
                case "member":
                case "subscribe":
                case "emote":
                case "envelope":
                case "questionNew":
                case "liveIntro":
                    // Forward event directly to frontend
                    await _socketManager.BroadcastEventRaw(eventName, data.GetRawText());

                    // ── Outbound webhooks (fire-and-forget) ──
                    try
                    {
                        using var hookScope = _serviceProvider.CreateScope();
                        var webhooks = hookScope.ServiceProvider.GetService<WebhookService>();
                        if (webhooks != null) await webhooks.DispatchAsync(eventName, data);
                    }
                    catch (Exception ex) { _logger.LogDebug(ex, "[Webhooks] dispatch failed for {Event}", eventName); }

                    // ── Chat command bot ──
                    if (eventName == "chat")
                    {
                        try
                        {
                            using var scope = _serviceProvider.CreateScope();
                            var chatBot = scope.ServiceProvider.GetService<ChatBotService>();
                            if (chatBot != null)
                            {
                                var chatUser = data.TryGetProperty("uniqueId", out var cu) ? cu.GetString() ?? "" : "";
                                var chatNick = data.TryGetProperty("nickname", out var cn) ? cn.GetString() ?? "" : "";
                                var chatPic = data.TryGetProperty("profilePictureUrl", out var cp) ? cp.GetString() ?? "" : "";
                                var chatUserId = data.TryGetProperty("userId", out var cui) ? cui.GetString() ?? "" : "";
                                var chatComment = data.TryGetProperty("comment", out var cc) ? cc.GetString() ?? "" : "";
                                await chatBot.OnChatAsync(chatUser, chatNick, chatPic, chatUserId, chatComment);
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex, "[ChatBot] OnChatAsync failed");
                        }
                    }

                    // ── Activity-feed dock data (forward all events) ──
                    if (eventName is "chat" or "gift" or "follow" or "share" or "subscribe" or "member" or "envelope")
                    {
                        await _socketManager.BroadcastEventRaw("dockData",
                            JsonSerializer.Serialize(new { type = eventName, payload = JsonSerializer.Deserialize<object>(data.GetRawText()) }));
                    }

                    // Update stats + forward derived widget events
                    if (eventName == "gift")
                    {
                        _giftCount++;
                        var diamonds = 0;
                        if (data.TryGetProperty("diamondCount", out var dc))
                        {
                            diamonds = dc.GetInt32();
                            _diamondCount += diamonds;
                        }

                        // coin-jar:gift widget event
                        var giftPic = data.TryGetProperty("giftPictureUrl", out var gp) ? gp.GetString() : "";
                        var giftName = data.TryGetProperty("giftName", out var gn) ? gn.GetString() : "";
                        var repeatCount = data.TryGetProperty("repeatCount", out var rc) ? rc.GetInt32() : 1;
                        var giftUser = data.TryGetProperty("uniqueId", out var gu) ? gu.GetString() : "";
                        var giftNick = data.TryGetProperty("nickname", out var gnn) ? gnn.GetString() : "";
                        var giftProfilePicUrl = data.TryGetProperty("profilePictureUrl", out var gppl) ? gppl.GetString() : "";
                        await _socketManager.BroadcastEvent("coin-jar:gift", new
                        {
                            giftPictureUrl = giftPic,
                            value = diamonds,
                            repeatCount,
                            giftName,
                            username = giftUser,
                            nickname = giftNick,
                            profilePictureUrl = giftProfilePicUrl
                        });

                        // ── Top Gifter aggregation ──
                        var giftUserId = data.TryGetProperty("userId", out var gui) ? gui.GetString() ?? "" : "";
                        var giftNickname = data.TryGetProperty("nickname", out var gnk) ? gnk.GetString() ?? "" : "";
                        var giftProfilePic = data.TryGetProperty("profilePictureUrl", out var gpp) ? gpp.GetString() ?? "" : "";
                        if (!string.IsNullOrEmpty(giftUser))
                        {
                            _topGifters.AddOrUpdate(giftUser,
                                _ => new GiftUserData(giftUser, giftNickname, giftProfilePic, giftUserId, diamonds),
                                (_, existing) => existing with
                                {
                                    Nickname = !string.IsNullOrEmpty(giftNickname) ? giftNickname : existing.Nickname,
                                    ProfilePictureUrl = !string.IsNullOrEmpty(giftProfilePic) ? giftProfilePic : existing.ProfilePictureUrl,
                                    TotalAmount = existing.TotalAmount + diamonds
                                });

                            var topGifterList = _topGifters.Values
                                .OrderByDescending(x => x.TotalAmount)
                                .Take(20)
                                .Select(x => new { totalAmount = x.TotalAmount, username = x.Username, nickname = x.Nickname, profilePictureUrl = x.ProfilePictureUrl, userId = x.UserId })
                                .ToArray();
                            await _socketManager.BroadcastEvent("updateTopGifter", topGifterList);

                            // ── Ranking (updateRanking) — same data as topGifter ──
                            _rankingUsers.AddOrUpdate(giftUser,
                                _ => new RankingUserData(giftUser, giftNickname, giftProfilePic, giftUserId, diamonds, diamonds),
                                (_, existing) => existing with
                                {
                                    Nickname = !string.IsNullOrEmpty(giftNickname) ? giftNickname : existing.Nickname,
                                    ProfilePictureUrl = !string.IsNullOrEmpty(giftProfilePic) ? giftProfilePic : existing.ProfilePictureUrl,
                                    TotalAmount = existing.TotalAmount + diamonds,
                                    TotalRewardAmount = existing.TotalRewardAmount + diamonds
                                });
                            var rankingList = _rankingUsers.Values
                                .OrderByDescending(x => x.TotalAmount)
                                .Take(20)
                                .Select(x => new { totalAmount = x.TotalAmount, username = x.Username, nickname = x.Nickname, profilePictureUrl = x.ProfilePictureUrl, userId = x.UserId, totalRewardAmount = x.TotalRewardAmount })
                                .ToArray();
                            await _socketManager.BroadcastEvent("updateRanking", rankingList);

                            // ── Top Gift (topg + tops widgets — topGiftData) ──
                            if (diamonds > _topGiftCount)
                            {
                                _topGiftCount = diamonds;
                                _topGiftUsername = giftUser;
                                _topGiftPictureUrl = giftPic ?? "";
                                _topGiftTitle = giftName ?? "";
                            }
                            await _socketManager.BroadcastEvent("topGiftData", new
                            {
                                topGift = new { giftPictureUrl = _topGiftPictureUrl, username = _topGiftUsername, title = _topGiftTitle, count = _topGiftCount },
                                topStreaker = new { giftPictureUrl = _topGiftPictureUrl, username = _topGiftUsername, title = _topGiftTitle, count = _topGiftCount }
                            });

                            // ── Transaction viewer (newTransaction) ──
                            await _socketManager.BroadcastEvent("newTransaction", new
                            {
                                userId = giftUserId, username = giftUser,
                                thumbnailUrl = giftProfilePic, amount = (double)diamonds,
                                show = true, description = $"Gift: {giftName}"
                            });

                            // ── Last event (lastx) ──
                            _lastEvents["gift"] = new LastEventData(giftNickname ?? giftUser, giftProfilePic ?? "");
                            await BroadcastLastEvents();

                            // ── Gift counter (gcounter widget — giftGoalStatus) ──
                            await UpdateGiftCounters(data);

                            // ── Goal recompute (gifts/diamonds/gift_specific goals) ──
                            await BroadcastGoalStatus();

                            // ── Points (per_coin × diamondCount × multipliers) ──
                            try
                            {
                                using var pointsScope = _serviceProvider.CreateScope();
                                var points = pointsScope.ServiceProvider.GetService<PointsService>();
                                if (points != null)
                                {
                                    var defaultChannelId = await pointsScope.ServiceProvider
                                        .GetRequiredService<AppDbContext>()
                                        .Channels.OrderBy(c => c.ChannelId).Select(c => c.ChannelId).FirstOrDefaultAsync();
                                    if (defaultChannelId > 0)
                                    {
                                        var isSubscriber = data.TryGetProperty("isSubscriber", out var ssub) && ssub.GetBoolean();
                                        await points.AwardForGiftAsync(defaultChannelId, giftUser, diamonds, isSubscriber);
                                    }
                                }
                            }
                            catch (Exception ex) { _logger.LogDebug(ex, "[Points] gift award failed"); }

                            // ── Wheel of Actions trigger ──
                            // Load wheels from widget_wheelofactions_wheels setting,
                            // match the incoming giftId against each wheel's trigger,
                            // pick a random segment (weighted by chance), emit onSpinWheel.
                            try
                            {
                                await TryTriggerWheelOfActionsAsync(data, giftUser, giftNickname, giftProfilePic, giftPic ?? "", giftName ?? "", repeatCount, diamonds);
                            }
                            catch (Exception ex) { _logger.LogDebug(ex, "[WheelOfActions] trigger failed"); }
                        }
                    }
                    else if (eventName == "like")
                    {
                        if (data.TryGetProperty("totalLikeCount", out var lc))
                            _likeCount = lc.GetInt32();

                        // onLikeReceived widget event (likefountain)
                        var likeCount = data.TryGetProperty("likeCount", out var lkc) ? lkc.GetInt32() : 1;
                        var likePic = data.TryGetProperty("profilePictureUrl", out var lp) ? lp.GetString() : "";
                        var likeUserId = data.TryGetProperty("userId", out var lui) ? lui.GetString() : "";
                        await _socketManager.BroadcastEvent("onLikeReceived", new
                        {
                            likeCount,
                            profilePictureUrl = likePic,
                            userId = likeUserId
                        });

                        // ── Top Liker aggregation ──
                        var likeUser = data.TryGetProperty("uniqueId", out var lku) ? lku.GetString() ?? "" : "";
                        var likeNickname = data.TryGetProperty("nickname", out var lkn) ? lkn.GetString() ?? "" : "";
                        if (!string.IsNullOrEmpty(likeUser))
                        {
                            _topLikers.AddOrUpdate(likeUser,
                                _ => new LikeUserData(likeUser, likeNickname, likePic, likeUserId, likeCount),
                                (_, existing) => existing with
                                {
                                    Nickname = !string.IsNullOrEmpty(likeNickname) ? likeNickname : existing.Nickname,
                                    ProfilePictureUrl = !string.IsNullOrEmpty(likePic) ? likePic : existing.ProfilePictureUrl,
                                    TotalAmount = existing.TotalAmount + likeCount
                                });

                            var topLikerList = _topLikers.Values
                                .OrderByDescending(x => x.TotalAmount)
                                .Take(20)
                                .Select(x => new { totalAmount = x.TotalAmount, username = x.Username, nickname = x.Nickname, profilePictureUrl = x.ProfilePictureUrl, userId = x.UserId })
                                .ToArray();
                            await _socketManager.BroadcastEvent("updateTopLiker", topLikerList);
                        }

                        // ── Goal recompute (likes goals) ──
                        await BroadcastGoalStatus();
                    }
                    else if (eventName == "follow")
                    {
                        _followerCount++;
                        // ── Last follow (lastx) ──
                        var followUser = data.TryGetProperty("uniqueId", out var fu) ? fu.GetString() ?? "" : "";
                        var followNick = data.TryGetProperty("nickname", out var fn) ? fn.GetString() ?? "" : "";
                        var followPic = data.TryGetProperty("profilePictureUrl", out var fp) ? fp.GetString() ?? "" : "";
                        if (!string.IsNullOrEmpty(followUser))
                        {
                            _lastEvents["follow"] = new LastEventData(followNick ?? followUser, followPic);
                            await BroadcastLastEvents();
                        }
                        // ── Goal recompute (follow goals) ──
                        await BroadcastGoalStatus();
                    }
                    else if (eventName == "share")
                    {
                        _shareCount++;
                        var shareUser = data.TryGetProperty("uniqueId", out var su) ? su.GetString() ?? "" : "";
                        var shareNick = data.TryGetProperty("nickname", out var sn) ? sn.GetString() ?? "" : "";
                        var sharePic = data.TryGetProperty("profilePictureUrl", out var sp) ? sp.GetString() ?? "" : "";
                        if (!string.IsNullOrEmpty(shareUser))
                        {
                            _lastEvents["share"] = new LastEventData(shareNick ?? shareUser, sharePic);
                            await BroadcastLastEvents();

                            // ── Points (per_share × multipliers) ──
                            try
                            {
                                using var pointsScope = _serviceProvider.CreateScope();
                                var points = pointsScope.ServiceProvider.GetService<PointsService>();
                                if (points != null)
                                {
                                    var defaultChannelId = await pointsScope.ServiceProvider
                                        .GetRequiredService<AppDbContext>()
                                        .Channels.OrderBy(c => c.ChannelId).Select(c => c.ChannelId).FirstOrDefaultAsync();
                                    if (defaultChannelId > 0)
                                    {
                                        var isSubscriber = data.TryGetProperty("isSubscriber", out var ssub) && ssub.GetBoolean();
                                        await points.AwardForShareAsync(defaultChannelId, shareUser, isSubscriber);
                                    }
                                }
                            }
                            catch (Exception ex) { _logger.LogDebug(ex, "[Points] share award failed"); }
                        }
                        // ── Goal recompute (share goals) ──
                        await BroadcastGoalStatus();
                    }
                    else if (eventName == "subscribe")
                    {
                        _subscriberCount++;
                        var subUser = data.TryGetProperty("uniqueId", out var sbu) ? sbu.GetString() ?? "" : "";
                        var subNick = data.TryGetProperty("nickname", out var sbn) ? sbn.GetString() ?? "" : "";
                        var subPic = data.TryGetProperty("profilePictureUrl", out var sbp) ? sbp.GetString() ?? "" : "";
                        if (!string.IsNullOrEmpty(subUser))
                        {
                            _lastEvents["subscribe"] = new LastEventData(subNick ?? subUser, subPic);
                            await BroadcastLastEvents();
                        }
                        // ── Goal status update (subscriber goal) ──
                        await BroadcastGoalStatus();
                    }
                    else if (eventName == "member")
                    {
                        var memberUser = data.TryGetProperty("uniqueId", out var mu) ? mu.GetString() ?? "" : "";
                        var memberNick = data.TryGetProperty("nickname", out var mn) ? mn.GetString() ?? "" : "";
                        var memberPic = data.TryGetProperty("profilePictureUrl", out var mp) ? mp.GetString() ?? "" : "";
                        if (!string.IsNullOrEmpty(memberUser))
                        {
                            _lastEvents["member"] = new LastEventData(memberNick ?? memberUser, memberPic);
                            await BroadcastLastEvents();
                        }
                    }
                    break;

                case "roomUser":
                    if (data.TryGetProperty("viewerCount", out var vc))
                    {
                        _viewerCount = vc.GetInt32();
                        if (_viewerCount > _peakViewerCount) _peakViewerCount = _viewerCount;
                    }
                    await _socketManager.BroadcastEventRaw(eventName, data.GetRawText());
                    // Stats update
                    await _socketManager.BroadcastEvent("stats", new
                    {
                        viewers = _viewerCount,
                        likes = _likeCount,
                        gifts = _giftCount,
                        diamonds = _diamondCount,
                        followers = _followerCount
                    });
                    // updateViewerCount widget event (viewercount widget)
                    await _socketManager.BroadcastEvent("updateViewerCount", new
                    {
                        viewerCount = _viewerCount
                    });
                    break;

                case "error":
                    var errMsg = data.TryGetProperty("message", out var em) ? em.GetString() : "Unknown error";
                    if (!_connected)
                    {
                        _connecting = false;
                        _lastConnectionError = errMsg;
                    }
                    _logger.LogWarning("[TikTok] Bridge error: {Message}", errMsg);
                    break;

                default:
                    _logger.LogDebug("[TikTok] Unhandled bridge event: {Event}", eventName);
                    break;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[TikTok Bridge] Error handling message");
        }
    }

    /// <summary>
    /// Connect to a TikTok LIVE stream by username.
    /// Called from the Socket.IO handler when the frontend requests a connection.
    /// </summary>
    private long _lastConnectAtUnixMs;
    private const int ConnectDebounceMs = 8000;

    public async Task ConnectToTikTok(string username)
    {
        _logger.LogInformation("[TikTok] ConnectToTikTok called: username={Username}, bridgeWs={State}, connected={Connected}, connecting={Connecting}",
            username, _bridgeWs == null ? "null" : _bridgeWs.State.ToString(), _connected, _connecting);

        username = username.Trim().TrimStart('@');
        if (string.IsNullOrWhiteSpace(username))
        {
            return;
        }

        // Connect dedup. Bundle's browserbridge re-issues connect commands
        // whenever its internal state lags ours, so we have to be aggressive:
        //   • Already connected to the same user  → drop, no time limit.
        //   • Already connecting to the same user → drop.
        //   • Recent attempt for the same user (<8s) → drop, even if it failed.
        //   • Different username → ALLOW (real channel switch).
        var nowMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var sinceLast = nowMs - Interlocked.Read(ref _lastConnectAtUnixMs);
        var sameUser = string.Equals(_currentUsername, username, StringComparison.OrdinalIgnoreCase);
        if (sameUser && _connected)
        {
            _logger.LogInformation("[TikTok] Drop connect: already connected to @{Username}", username);
            return;
        }
        if (sameUser && _connecting)
        {
            _logger.LogInformation("[TikTok] Drop connect: already connecting to @{Username}", username);
            return;
        }
        if (sameUser && sinceLast < ConnectDebounceMs)
        {
            _logger.LogInformation("[TikTok] Debounced connect for @{Username} (sinceLast={MsAgo}ms after fail)",
                username, sinceLast);
            return;
        }
        Interlocked.Exchange(ref _lastConnectAtUnixMs, nowMs);

        _connected = false;
        _connecting = true;
        _lastConnectionError = null;
        _currentUsername = username;
        // Don't broadcast "connecting" status — bundle's browserbridge would try its own
        // connect flow (popup → timeout → error). Only broadcast when actually connected/disconnected.
        // Frontend polls /api/tiktok/status instead.

        var sent = await SendBridgeCommandAsync(new { action = "connect", username }, "connect", CancellationToken.None);
        if (!sent)
        {
            _connecting = false;
            _connected = false;
            _lastConnectionError ??= "Bridge not connected";
            Interlocked.Exchange(ref _lastErrorAtUnixMs, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
            _logger.LogError("[TikTok] Bridge reconnect failed, cannot connect to @{Username}", username);
            return;
        }

        _logger.LogInformation("[TikTok] Sent connect command for @{Username}", username);
        StartConnectWatchdog(username);
    }

    /// <summary>
    /// Safety net: if the bridge sends `connecting` but never replies with
    /// `connected`/`connectFailed` within 30s (e.g. node process froze, WS
    /// dropped, native lib hung past its own timeout), force-fire a
    /// connectFailed so the UI doesn't sit on a permanent spinner.
    /// </summary>
    private void StartConnectWatchdog(string username)
    {
        CancelConnectWatchdog();
        var cts = new CancellationTokenSource();
        lock (_watchdogLock) { _connectWatchdogCts = cts; }

        _ = Task.Run(async () =>
        {
            try
            {
                await Task.Delay(TimeSpan.FromSeconds(30), cts.Token);
            }
            catch (OperationCanceledException) { return; }

            if (!_connecting || _connected) return;

            _logger.LogWarning("[TikTok] Connect watchdog tripped — bridge silent for 30s on @{Username}", username);
            _connected = false;
            _connecting = false;
            _lastConnectionError = "Bridge timed out (no response in 30s). Try again or restart the app.";
            Interlocked.Exchange(ref _lastErrorAtUnixMs, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());

            try
            {
                await _socketManager.BroadcastEvent("status", new { connected = false, tiktok = false, connecting = false });
                await _socketManager.BroadcastEvent("connectFailed", new
                {
                    username,
                    message = _lastConnectionError
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[TikTok] Watchdog broadcast failed");
            }
        }, cts.Token);
    }

    private void CancelConnectWatchdog()
    {
        CancellationTokenSource? old;
        lock (_watchdogLock) { old = _connectWatchdogCts; _connectWatchdogCts = null; }
        if (old != null)
        {
            try { old.Cancel(); old.Dispose(); } catch { }
        }
    }

    /// <summary>
    /// Disconnect from the current TikTok LIVE stream.
    /// </summary>
    public async Task DisconnectFromTikTok()
    {
        CancelConnectWatchdog();
        _connecting = false;
        _connected = false;
        _lastConnectionError = null;

        var sent = await SendBridgeCommandAsync(new { action = "disconnect" }, "disconnect", CancellationToken.None, allowReconnect: false);
        if (sent)
        {
            _logger.LogInformation("[TikTok] Sent disconnect command");
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        // Disconnect from TikTok
        try { await DisconnectFromTikTok(); } catch { }

        // Close bridge WebSocket
        try
        {
            await _bridgeLock.WaitAsync(cancellationToken);
            try
            {
                if (_bridgeWs?.State == WebSocketState.Open)
                    await _bridgeWs.CloseAsync(WebSocketCloseStatus.NormalClosure, "Shutting down", CancellationToken.None);
            }
            finally
            {
                _bridgeLock.Release();
            }
        }
        catch { }

        // Kill Node.js process
        try
        {
            if (_nodeProcess != null && !_nodeProcess.HasExited)
            {
                _nodeProcess.Kill(true);
                _logger.LogInformation("[TikTok Bridge] Node.js process killed");
            }
        }
        catch { }

        await base.StopAsync(cancellationToken);
    }

    // ── Wheel of Actions: match incoming gift to a configured wheel, then
    // emit onSpinWheel with a random winner segment. Wheels are stored as
    // JSON in DynamicSettings under key `widget_wheelofactions_wheels` (one
    // per channel). Each wheel has shape:
    //   { enabled, name, trigger: { type:"gift", giftId }, segments:[{id,text,color,chance?}] }
    private static readonly Random _wheelRandom = new();
    private async Task TryTriggerWheelOfActionsAsync(
        JsonElement giftData,
        string? giftUser, string? giftNickname, string? giftProfilePic,
        string giftPictureUrl, string giftName, int repeatCount, int diamonds)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var channelId = await db.Channels.OrderBy(c => c.ChannelId).Select(c => c.ChannelId).FirstOrDefaultAsync();
        if (channelId <= 0) return;

        var wheelsSetting = await db.DynamicSettings
            .Where(d => d.ChannelId == channelId && d.Key == "widget_wheelofactions_wheels")
            .Select(d => d.Value)
            .FirstOrDefaultAsync();
        if (string.IsNullOrWhiteSpace(wheelsSetting) || wheelsSetting == "[]") return;

        List<JsonElement> wheels;
        try
        {
            using var doc = JsonDocument.Parse(wheelsSetting);
            if (doc.RootElement.ValueKind != JsonValueKind.Array) return;
            wheels = doc.RootElement.EnumerateArray().Select(e => e.Clone()).ToList();
        }
        catch { return; }

        var incomingGiftId = giftData.TryGetProperty("giftId", out var gid) ? gid.ToString() : "";

        foreach (var wheel in wheels)
        {
            // Skip disabled wheels.
            if (wheel.TryGetProperty("enabled", out var en) && en.ValueKind == JsonValueKind.False) continue;

            // Check trigger.giftId matches incoming giftId.
            if (!wheel.TryGetProperty("trigger", out var trig)) continue;
            var triggerGiftId = trig.TryGetProperty("giftId", out var tg) ? tg.ToString() : "";
            if (string.IsNullOrEmpty(triggerGiftId) || triggerGiftId != incomingGiftId) continue;

            // Pull segments. Each segment may have `chance` weight; default 1.
            if (!wheel.TryGetProperty("segments", out var segsEl) || segsEl.ValueKind != JsonValueKind.Array) continue;
            var segments = segsEl.EnumerateArray().ToList();
            if (segments.Count == 0) continue;

            int winnerIndex;
            var weights = segments
                .Select(s => s.TryGetProperty("chance", out var c) && c.TryGetDouble(out var cv) ? Math.Max(0.0001, cv) : 1.0)
                .ToList();
            var total = weights.Sum();
            var pick = _wheelRandom.NextDouble() * total;
            winnerIndex = 0;
            double cumulative = 0;
            for (int i = 0; i < weights.Count; i++)
            {
                cumulative += weights[i];
                if (pick <= cumulative) { winnerIndex = i; break; }
            }

            var wheelName = wheel.TryGetProperty("name", out var nm) ? nm.GetString() ?? "" : "";

            var payload = new
            {
                user = new { username = giftUser ?? "", profilePictureUrl = giftProfilePic ?? "" },
                activation = new
                {
                    type = "gift",
                    giftPictureUrl,
                    giftName,
                    repeatCount,
                    value = diamonds
                },
                wheelName,
                segments = segments.Select(s => new
                {
                    id = s.TryGetProperty("id", out var sid) ? sid.ToString() : "0",
                    text = s.TryGetProperty("text", out var st) ? st.GetString() ?? "" : "",
                    color = s.TryGetProperty("color", out var sc) ? sc.GetString() ?? "#cccccc" : "#cccccc"
                }).ToArray(),
                winnerSegmentIndex = winnerIndex,
                spinDuration = 10000,
                showBase = "true",
                playSound = "true",
                announceDuration = 3000,
                waitDuration = 1000
            };

            await _socketManager.BroadcastEvent("onSpinWheel", payload);
            _logger.LogInformation("[WheelOfActions] Spun wheel '{Name}' for gift {GiftId} → segment {Idx}",
                wheelName, incomingGiftId, winnerIndex);
            break; // First matching wheel wins; don't double-spin per gift.
        }
    }

    // ── Helper: broadcast last events for lastx widget ──
    private async Task BroadcastLastEvents()
    {
        var payload = new Dictionary<string, object>();
        foreach (var (key, val) in _lastEvents)
        {
            payload[key] = new { name = val.Name, profilePictureUrl = val.ProfilePictureUrl };
        }
        await _socketManager.BroadcastEvent("setLastX", payload);
    }

    // Public entrypoint so other parts of the host (e.g. the Socket.IO login
    // handler) can trigger a goalStatus broadcast right after a widget
    // connects. Without this, a freshly-connected goal widget shows empty
    // values until the next gift/follower event happens to fire.
    public Task EmitInitialGoalStatusAsync() => BroadcastGoalStatus();

    // ── Helper: broadcast goal status for goal widget ──
    //
    // Builds payload from dynamic Goal records (loaded from DB) plus the legacy
    // "subscriberGoal"/"customGoal1" keys some older widget templates expect.
    private async Task BroadcastGoalStatus()
    {
        if (!_goalsLoaded) await EnsureGoalsLoaded();

        var payload = new Dictionary<string, object>();
        foreach (var g in _goalConfigs)
        {
            var current = GetCurrentForGoalType(g.Type);
            payload[$"goal{g.Id}"] = new
            {
                id = g.Id,
                current,
                target = g.Target,
                title = string.IsNullOrEmpty(g.Name) ? g.Type : g.Name,
                type = g.Type,
                percent = g.Target > 0 ? Math.Round(100.0 * current / g.Target, 1) : 0,
                reached = g.Target > 0 && current >= g.Target
            };
        }

        // Legacy keys — old goal.html templates read these directly.
        payload["subscriberGoal"] = new { current = _subscriberCount, target = 100, title = "Subscriber Goal" };
        payload["customGoal1"] = new { current = _customGoal1, target = 100, title = "Custom Goal" };

        await _socketManager.BroadcastEvent("goalStatus", payload);
    }

    private int GetCurrentForGoalType(string type)
    {
        if (string.IsNullOrEmpty(type)) return 0;

        // gift_specific:<giftId> — count of repeated gifts for one specific gift
        if (type.StartsWith("gift_specific:", StringComparison.OrdinalIgnoreCase))
        {
            var giftId = type["gift_specific:".Length..];
            return _giftCounters.TryGetValue(giftId, out var counter) ? counter.Current : 0;
        }

        return type.ToLowerInvariant() switch
        {
            "follows" or "follow" or "followers" => _followerCount,
            "likes" or "like" => _likeCount,
            "shares" or "share" => _shareCount,
            "subscribe" or "subscribers" or "subs" => _subscriberCount,
            "gifts" or "gift" or "gifts_count" => _giftCount,
            "diamonds" or "coins" => _diamondCount,
            "viewers" or "viewer" => _viewerCount,
            "viewers_peak" or "peak" => _peakViewerCount,
            _ => 0
        };
    }

    private async Task EnsureGoalsLoaded()
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            // Local mode: pick the first channel. Multi-tenant deployments need a
            // per-channel cache, but the desktop clone runs as a single user.
            var channelId = await db.Channels
                .OrderBy(c => c.ChannelId)
                .Select(c => (int?)c.ChannelId)
                .FirstOrDefaultAsync();
            if (channelId.HasValue)
            {
                await LoadGoalsForChannelAsync(channelId.Value);
            }
            _goalsLoaded = true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "[Goals] Initial load failed; using empty config");
            _goalsLoaded = true;
        }
    }

    private async Task LoadGoalsForChannelAsync(int channelId)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var loaded = await db.Goals
            .Where(g => g.ChannelId == channelId && g.Enabled)
            .Select(g => new GoalConfig(g.Id, g.Name, g.Type, g.Target))
            .ToListAsync();
        _goalConfigs = loaded;
        _logger.LogInformation("[Goals] Loaded {Count} active goals for channel {ChannelId}", loaded.Count, channelId);
    }

    /// <summary>
    /// Persist a system notification so the user sees it in the bell icon.
    /// Used for connection success/failure and other important state changes.
    /// </summary>
    private async Task PersistNotification(string subject, string body, string category = "announcements")
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var channelId = await db.Channels
                .OrderBy(c => c.ChannelId)
                .Select(c => (int?)c.ChannelId)
                .FirstOrDefaultAsync();
            if (!channelId.HasValue) return;

            db.Notifications.Add(new TikFinityBackend.Models.Notification
            {
                ChannelId = channelId.Value,
                Subject = subject,
                Body = body,
                Category = category,
                DataJson = JsonSerializer.Serialize(new
                {
                    title = subject,
                    category,
                    sender = "TikFinity",
                    avatarUrl = "/favicon.ico"
                }),
                CreatedAt = DateTime.UtcNow
            });
            await db.SaveChangesAsync();
            // Tell the bundle to refresh the bell badge.
            await _socketManager.BroadcastEvent("notificationsUpdated", new { });
        }
        catch (Exception ex)
        {
            _logger.LogDebug(ex, "[Notif] persist failed");
        }
    }

    /// <summary>
    /// Reload goals from DB and rebroadcast. Called by GoalsController when goals
    /// are added/edited/deleted.
    /// </summary>
    public async Task RefreshGoalConfig(int channelId)
    {
        await LoadGoalsForChannelAsync(channelId);
        _goalsLoaded = true;
        await BroadcastGoalStatus();
    }

    /// <summary>
    /// Reset all in-memory aggregates (top gifters/likers/ranking/last events/
    /// counters). Used by ResetController when a streamer wants a fresh session.
    /// </summary>
    public async Task ResetAggregates()
    {
        _topGifters.Clear();
        _topLikers.Clear();
        _rankingUsers.Clear();
        _lastEvents.Clear();
        _giftCounters.Clear();
        _topGiftCount = 0;
        _topGiftUsername = "";
        _topGiftPictureUrl = "";
        _topGiftTitle = "";
        _viewerCount = 0;
        _peakViewerCount = 0;
        _likeCount = 0;
        _giftCount = 0;
        _diamondCount = 0;
        _followerCount = 0;
        _shareCount = 0;
        _subscriberCount = 0;
        _customGoal1 = 0;

        await _socketManager.BroadcastEvent("updateTopGifter", Array.Empty<object>());
        await _socketManager.BroadcastEvent("updateTopLiker", Array.Empty<object>());
        await _socketManager.BroadcastEvent("updateRanking", Array.Empty<object>());
        await BroadcastGoalStatus();
        await BroadcastGiftGoalStatus();
        await _socketManager.BroadcastEvent("stats", new
        {
            viewers = 0,
            likes = 0,
            gifts = 0,
            diamonds = 0,
            followers = 0
        });
    }

    // ── Helper: update gift counters for gcounter widget ──
    private async Task UpdateGiftCounters(JsonElement data)
    {
        var giftId = data.TryGetProperty("giftId", out var gi) ? gi.ToString() : "";
        var diamonds = data.TryGetProperty("diamondCount", out var dc) ? dc.GetInt32() : 0;
        var repeatCount = data.TryGetProperty("repeatCount", out var rc) ? rc.GetInt32() : 1;
        if (string.IsNullOrEmpty(giftId)) return;

        // Update counter for this gift (keyed by giftId)
        _giftCounters.AddOrUpdate(giftId,
            _ => new GiftCounterData(repeatCount, false),
            (_, existing) => existing with { Current = existing.Current + repeatCount });

        await BroadcastGiftGoalStatus();
    }

    private async Task BroadcastGiftGoalStatus()
    {
        var status = new Dictionary<string, object>();
        var config = new Dictionary<string, object>();

        foreach (var (giftId, counter) in _giftCounters)
        {
            status[$"gc{giftId}"] = new { current = counter.Current, reached = counter.Reached };
        }

        await _socketManager.BroadcastEvent("giftGoalStatus", new { status, config });
    }

    // ── Public methods for WidgetController ──

    /// <summary>Broadcast a timer update to all widget clients.</summary>
    public async Task BroadcastTimerUpdate(object timerState)
    {
        await _socketManager.BroadcastEvent("timerUpdate", timerState);
    }

    /// <summary>Start/stop/pause/resume the timer.</summary>
    public async Task SetTimerState(string action, int durationMs = 0)
    {
        switch (action)
        {
            case "start":
                _timerState = "running";
                _timerStartedAt = DateTime.UtcNow;
                _timerDurationMs = durationMs > 0 ? durationMs : _timerDurationMs;
                _timerElapsedBeforePauseMs = 0;
                break;
            case "pause":
                if (_timerState == "running")
                {
                    _timerState = "paused";
                    _timerElapsedBeforePauseMs += (int)(DateTime.UtcNow - _timerStartedAt).TotalMilliseconds;
                }
                break;
            case "resume":
                if (_timerState == "paused")
                {
                    _timerState = "running";
                    _timerStartedAt = DateTime.UtcNow;
                }
                break;
            case "stop":
                _timerState = "stopped";
                _timerElapsedBeforePauseMs = 0;
                break;
        }

        await _socketManager.BroadcastEvent("timerUpdate", new
        {
            state = _timerState,
            durationMs = _timerDurationMs,
            elapsedMs = _timerState == "running"
                ? _timerElapsedBeforePauseMs + (int)(DateTime.UtcNow - _timerStartedAt).TotalMilliseconds
                : _timerElapsedBeforePauseMs,
            startedAt = _timerStartedAt.ToString("o")
        });
    }

    /// <summary>Show user score in userinfo widget.</summary>
    public async Task ShowUserScore(string userId, string username)
    {
        var thumbnailUrl = "";
        var totalAmount = 0;
        var rank = 0;

        if (_rankingUsers.TryGetValue(username, out var rankData))
        {
            thumbnailUrl = rankData.ProfilePictureUrl;
            totalAmount = rankData.TotalAmount;
        }

        // Calculate rank
        var sorted = _rankingUsers.Values.OrderByDescending(x => x.TotalAmount).ToList();
        for (int i = 0; i < sorted.Count; i++)
        {
            if (sorted[i].Username == username) { rank = i + 1; break; }
        }

        await _socketManager.BroadcastEvent("showUserScore", new
        {
            userId, username, totalAmount, level = totalAmount / 100,
            rank, thumbnailUrl
        });
    }

    /// <summary>
    /// Resolve a best-effort profile picture URL from current live caches.
    /// Used by legacy widget avatar fallback route (/img/user/{channelId}/{userId}).
    /// </summary>
    public string? GetProfilePictureUrlByUserId(string? userId)
    {
        if (string.IsNullOrWhiteSpace(userId)) return null;

        foreach (var entry in _rankingUsers.Values)
        {
            if (string.Equals(entry.UserId, userId, StringComparison.Ordinal) &&
                !string.IsNullOrWhiteSpace(entry.ProfilePictureUrl))
            {
                return entry.ProfilePictureUrl;
            }
        }

        foreach (var entry in _topGifters.Values)
        {
            if (string.Equals(entry.UserId, userId, StringComparison.Ordinal) &&
                !string.IsNullOrWhiteSpace(entry.ProfilePictureUrl))
            {
                return entry.ProfilePictureUrl;
            }
        }

        foreach (var entry in _topLikers.Values)
        {
            if (string.Equals(entry.UserId, userId, StringComparison.Ordinal) &&
                !string.IsNullOrWhiteSpace(entry.ProfilePictureUrl))
            {
                return entry.ProfilePictureUrl;
            }
        }

        return null;
    }

    /// <summary>Broadcast arbitrary widget event (for WidgetController pass-through).</summary>
    public async Task BroadcastWidgetEvent(string eventName, object data)
    {
        await _socketManager.BroadcastEvent(eventName, data);
    }

    /// <summary>Broadcast raw JSON widget event.</summary>
    public async Task BroadcastWidgetEventRaw(string eventName, string json)
    {
        await _socketManager.BroadcastEventRaw(eventName, json);
    }

    /// <summary>Reset coin jar.</summary>
    public async Task ResetCoinJar()
    {
        await _socketManager.BroadcastEvent("coin-jar:reset", new { });
    }
}
