using System.Collections.Concurrent;
using System.Diagnostics;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;

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
    private volatile string? _lastFailedUsername;
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
    public string? LastFailedUsername => _lastFailedUsername;
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
                    _lastFailedUsername = null;
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
                        _lastFailedUsername = failedUsername;
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

                            // ── My Actions dispatch (executeAction → myactions widget) ──
                            // mediawrapper's replaceContextParams uses `if (context.X)` truthy
                            // checks, so 0/""/null leaves `{placeholder}` literal in the text.
                            // Force sensible non-falsy defaults to avoid that.
                            var giftIdStr = data.TryGetProperty("giftId", out var gid) ? gid.ToString() : "";
                            var giftNameForCtx = string.IsNullOrWhiteSpace(giftName) ? "Gift" : giftName;
                            var repeatCountForCtx = Math.Max(1, repeatCount);
                            var giftContext = new
                            {
                                username = giftUser ?? "",
                                nickname = giftNickname ?? giftUser ?? "",
                                giftData = new { value = Math.Max(1, diamonds) },
                                giftName = giftNameForCtx,
                                repeatCount = repeatCountForCtx,
                                likeCount = 0,
                                totalLikeCount = _likeCount,
                                subMonth = 1,
                                commandParams = "",
                                ttsLanguage = "en-US",
                                ttsRandomVoice = "en_us_001",
                                thumbnailUrl = giftProfilePic ?? ""
                            };
                            await TryDispatchActionsAsync(triggerTypeId: 3, giftContext, ev =>
                            {
                                var minBars = ev.TryGetProperty("minBarsAmount", out var mb) && mb.TryGetInt32(out var mbv) ? mbv : 1;
                                if (diamonds < minBars) return false;
                                if (ev.TryGetProperty("giftId", out var gidEl) && gidEl.ValueKind != JsonValueKind.Null)
                                {
                                    var requiredGiftId = gidEl.ToString();
                                    if (!string.IsNullOrEmpty(requiredGiftId) && requiredGiftId != "0" && requiredGiftId != giftIdStr) return false;
                                }
                                return true;
                            });

                            // ── Subathon: extend timer per gift ──
                            await TryApplySubathonAsync("Gift", diamonds);
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

                        // ── My Actions dispatch (executeAction on every Nth like crossing) ──
                        var likeContext = new
                        {
                            username = likeUser,
                            nickname = !string.IsNullOrEmpty(likeNickname) ? likeNickname : likeUser,
                            giftData = new { value = 1 },
                            giftName = "Like",
                            repeatCount = Math.Max(1, likeCount),
                            likeCount = Math.Max(1, likeCount),
                            totalLikeCount = Math.Max(1, _likeCount),
                            subMonth = 1,
                            commandParams = "",
                            ttsLanguage = "en-US",
                            ttsRandomVoice = "en_us_001",
                            thumbnailUrl = likePic ?? ""
                        };
                        var totalLikesNow = _likeCount;
                        await TryDispatchActionsAsync(triggerTypeId: 7, likeContext, ev =>
                        {
                            var min = ev.TryGetProperty("minLikesAmount", out var ml) && ml.TryGetInt32(out var mlv) ? Math.Max(1, mlv) : 100;
                            var eventId = ev.TryGetProperty("id", out var eid) ? eid.GetString() ?? "" : "";
                            if (string.IsNullOrEmpty(eventId)) return false;
                            var crossed = (totalLikesNow / min) * min;
                            if (crossed <= 0) return false;
                            var lastFired = _lastLikeThresholdByEventId.GetValueOrDefault(eventId, 0);
                            if (crossed <= lastFired) return false;
                            _lastLikeThresholdByEventId[eventId] = crossed;
                            return true;
                        });
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

                            // ── My Actions dispatch ──
                            var followContext = new
                            {
                                username = followUser,
                                nickname = !string.IsNullOrEmpty(followNick) ? followNick : followUser,
                                giftData = new { value = 1 },
                                giftName = "Follow",
                                repeatCount = 1,
                                likeCount = 1,
                                totalLikeCount = Math.Max(1, _likeCount),
                                subMonth = 1,
                                commandParams = "",
                                ttsLanguage = "en-US",
                                ttsRandomVoice = "en_us_001",
                                thumbnailUrl = followPic ?? ""
                            };
                            await TryDispatchActionsAsync(triggerTypeId: 9, followContext);

                            // ── Subathon: extend timer on follow ──
                            await TryApplySubathonAsync("Follow");
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

                            // ── My Actions dispatch ──
                            var subMonth = data.TryGetProperty("subMonth", out var smEl) && smEl.TryGetInt32(out var smVal) ? Math.Max(1, smVal) : 1;
                            var subContext = new
                            {
                                username = subUser,
                                nickname = !string.IsNullOrEmpty(subNick) ? subNick : subUser,
                                giftData = new { value = 1 },
                                giftName = "Sub",
                                repeatCount = 1,
                                likeCount = 1,
                                totalLikeCount = Math.Max(1, _likeCount),
                                subMonth,
                                commandParams = "",
                                ttsLanguage = "en-US",
                                ttsRandomVoice = "en_us_001",
                                thumbnailUrl = subPic ?? ""
                            };
                            await TryDispatchActionsAsync(triggerTypeId: 10, subContext);

                            // ── Subathon: extend timer on sub ──
                            await TryApplySubathonAsync("Sub");
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
        _lastFailedUsername = username;
        // Don't broadcast "connecting" status — bundle's browserbridge would try its own
        // connect flow (popup → timeout → error). Only broadcast when actually connected/disconnected.
        // Frontend polls /api/tiktok/status instead.

        var sent = await SendBridgeCommandAsync(new { action = "connect", username }, "connect", CancellationToken.None);
        if (!sent)
        {
            _connecting = false;
            _connected = false;
            _lastConnectionError ??= "Bridge not connected";
            _lastFailedUsername = username;
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
            _lastFailedUsername = username;
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
        var ch = await db.Channels.OrderBy(c => c.ChannelId).Select(c => new { c.ChannelId, c.ProfileId }).FirstOrDefaultAsync();
        if (ch == null || ch.ChannelId <= 0) return;
        var channelId = ch.ChannelId;
        var profileId = ch.ProfileId > 0 ? ch.ProfileId : 1;

        var wheelsSetting = await db.DynamicSettings
            .Where(d => d.ChannelId == channelId && d.ProfileId == profileId && d.Key == "widget_wheelofactions_wheels")
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

    // ── My Actions dispatch ──
    // Match incoming TikTok events against configured Events (DynamicSettings.events),
    // resolve their actionIds to Actions, and emit `executeAction(actionInfo, context)`
    // to the myactions widget. Trigger types we handle:
    //   3  = gift     (filter: minBarsAmount, optional giftId)
    //   7  = like     (filter: every minLikesAmount crossing of totalLikeCount)
    //   9  = follow   (every event)
    //   10 = subscribe (every event)
    private readonly ConcurrentDictionary<string, int> _lastLikeThresholdByEventId = new();
    private static readonly Random _actionRandom = new();

    private async Task TryDispatchActionsAsync(
        int triggerTypeId,
        object context,
        Func<JsonElement, bool>? extraFilter = null)
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var ch = await db.Channels.OrderBy(c => c.ChannelId).Select(c => new { c.ChannelId, c.ProfileId }).FirstOrDefaultAsync();
            if (ch == null || ch.ChannelId <= 0) return;
            var channelId = ch.ChannelId;
            var profileId = ch.ProfileId > 0 ? ch.ProfileId : 1;

            var eventsJson = await db.DynamicSettings
                .Where(d => d.ChannelId == channelId && d.ProfileId == profileId && d.Key == "events")
                .Select(d => d.Value)
                .FirstOrDefaultAsync();
            if (string.IsNullOrWhiteSpace(eventsJson) || eventsJson == "[]") return;

            List<JsonElement> events;
            try
            {
                using var doc = JsonDocument.Parse(eventsJson);
                if (doc.RootElement.ValueKind != JsonValueKind.Array) return;
                events = doc.RootElement.EnumerateArray().Select(e => e.Clone()).ToList();
            }
            catch { return; }

            var matchedActionIds = new List<int>();
            foreach (var ev in events)
            {
                var active = !ev.TryGetProperty("active", out var act) || act.ValueKind != JsonValueKind.False;
                if (!active) continue;

                var tt = ev.TryGetProperty("triggerTypeId", out var ttEl) && ttEl.TryGetInt32(out var ttv) ? ttv : 0;
                if (tt != triggerTypeId) continue;

                if (extraFilter != null && !extraFilter(ev)) continue;

                if (ev.TryGetProperty("actionIds", out var ids) && ids.ValueKind == JsonValueKind.Array)
                {
                    foreach (var idEl in ids.EnumerateArray())
                    {
                        if (idEl.TryGetInt32(out var id) && id > 0) matchedActionIds.Add(id);
                    }
                }

                if (ev.TryGetProperty("actionRandomIds", out var rids) && rids.ValueKind == JsonValueKind.Array)
                {
                    var randomIds = rids.EnumerateArray()
                        .Select(e => e.TryGetInt32(out var v) ? v : 0)
                        .Where(v => v > 0)
                        .ToList();
                    if (randomIds.Count > 0)
                    {
                        matchedActionIds.Add(randomIds[_actionRandom.Next(randomIds.Count)]);
                    }
                }
            }

            if (matchedActionIds.Count == 0) return;

            var distinctIds = matchedActionIds.Distinct().ToList();
            var actions = await db.Actions
                .Where(a => a.ChannelId == channelId && a.ProfileId == profileId && a.Enabled && distinctIds.Contains(a.Id))
                .ToListAsync();

            WebhookService? webhookSvc = scope.ServiceProvider.GetService<WebhookService>();

            foreach (var actionId in matchedActionIds)
            {
                var action = actions.FirstOrDefault(a => a.Id == actionId);
                if (action == null) continue;

                var actionInfo = BuildActionInfo(action);
                if (actionInfo == null) continue;

                await _socketManager.BroadcastEventArgs("executeAction", actionInfo, context);
                _logger.LogInformation("[Actions] Dispatched executeAction id={Id} name={Name} trigger={Trigger}",
                    action.Id, action.Name, triggerTypeId);

                // ── Per-action webhook (action.webhookUrl) ──
                // The action config can specify an outbound webhook to fire
                // every time this action triggers. Discord URLs auto-render
                // as embeds inside FireOneShotAsync.
                var webhookUrl = actionInfo["webhookUrl"]?.GetValue<string>();
                if (!string.IsNullOrWhiteSpace(webhookUrl) && webhookSvc != null)
                {
                    var hookPayload = new
                    {
                        action = new { id = action.Id, name = action.Name, type = action.Type },
                        triggerTypeId,
                        context
                    };
                    _ = webhookSvc.FireOneShotAsync(webhookUrl, hookPayload);
                }

                // ── Streamer.bot HTTP trigger (action.streamerbotActionId) ──
                // User runs Streamer.bot locally with HTTP server enabled
                // (default :7474). When set, POST to /DoAction with the action GUID.
                var sbActionId = actionInfo["streamerbotActionId"]?.GetValue<string>();
                if (!string.IsNullOrWhiteSpace(sbActionId) && webhookSvc != null)
                {
                    var sbHost = Environment.GetEnvironmentVariable("TIKMAX_STREAMERBOT_URL") ?? "http://127.0.0.1:7474";
                    var sbUrl = sbHost.TrimEnd('/') + "/DoAction";
                    var sbBody = new
                    {
                        action = new { id = sbActionId },
                        args = new
                        {
                            tikfinityAction = action.Name,
                            triggerTypeId,
                            username = context is JsonObject ctxObj ? ctxObj["username"]?.GetValue<string>() : null,
                            giftName = context is JsonObject ctxObj2 ? ctxObj2["giftName"]?.GetValue<string>() : null,
                            value = context is JsonObject ctxObj3 ? ctxObj3["giftData"]?["value"]?.GetValue<int>() ?? 0 : 0
                        }
                    };
                    _ = webhookSvc.FireOneShotAsync(sbUrl, sbBody);
                }

                // ── Minecraft RCON (action.mcCmd) ──
                // Send command to local Minecraft server via RCON if user has
                // configured RCON host/password via env vars.
                var mcCmd = actionInfo["mcCmd"]?.GetValue<string>();
                if (!string.IsNullOrWhiteSpace(mcCmd))
                {
                    _ = TryFireMinecraftCommandAsync(mcCmd, context);
                }

                // ── Keystrokes (action.keystrokes) ──
                // Forward to keystroke worker (separate Node process with nut.js)
                // via webhook to localhost. Worker is optional — gracefully no-ops
                // if not running.
                var keystrokes = actionInfo["keystrokes"]?.GetValue<string>();
                if (!string.IsNullOrWhiteSpace(keystrokes) && webhookSvc != null)
                {
                    var ksUrl = Environment.GetEnvironmentVariable("TIKMAX_KEYSTROKE_URL")
                        ?? "http://127.0.0.1:5294/keystroke";
                    _ = webhookSvc.FireOneShotAsync(ksUrl, new { keystrokes });
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogDebug(ex, "[Actions] dispatch failed for trigger={Trigger}", triggerTypeId);
        }
    }

    /// <summary>Public entrypoint so WidgetController.TestAction can verify the Minecraft pipeline.</summary>
    public Task FireMinecraftCommandFromTestAsync(string command) =>
        TryFireMinecraftCommandAsync(command, new JsonObject { ["username"] = "tester", ["giftName"] = "Rose" });

    // ── Minecraft RCON helper ──
    // Reads env vars TIKMAX_MC_RCON_HOST, _PORT, _PASSWORD. If not configured,
    // logs and skips so users without Minecraft don't see errors.
    private static readonly object _mcRconLock = new();
    private async Task TryFireMinecraftCommandAsync(string command, object context)
    {
        var host = Environment.GetEnvironmentVariable("TIKMAX_MC_RCON_HOST");
        var portStr = Environment.GetEnvironmentVariable("TIKMAX_MC_RCON_PORT");
        var password = Environment.GetEnvironmentVariable("TIKMAX_MC_RCON_PASSWORD");
        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(password))
        {
            _logger.LogDebug("[MC RCON] skipped (env vars not set); command was: {Cmd}", command);
            return;
        }
        if (!int.TryParse(portStr, out var port)) port = 25575;

        // Substitute {username}, {giftname} in command.
        if (context is JsonObject ctxObj)
        {
            var user = ctxObj["username"]?.GetValue<string>() ?? "";
            var gift = ctxObj["giftName"]?.GetValue<string>() ?? "";
            command = command.Replace("{username}", user, StringComparison.OrdinalIgnoreCase)
                             .Replace("{giftname}", gift, StringComparison.OrdinalIgnoreCase);
        }

        try
        {
            using var client = new System.Net.Sockets.TcpClient();
            await client.ConnectAsync(host, port);
            using var stream = client.GetStream();

            int reqId = Random.Shared.Next(1, int.MaxValue);

            // Auth packet: type=3
            if (!await SendRconPacketAsync(stream, reqId, 3, password)) return;
            var authRes = await ReadRconPacketAsync(stream);
            if (authRes.id == -1) { _logger.LogWarning("[MC RCON] auth failed for {Host}:{Port}", host, port); return; }

            // Command packet: type=2
            if (!await SendRconPacketAsync(stream, reqId + 1, 2, command)) return;
            var cmdRes = await ReadRconPacketAsync(stream);
            _logger.LogInformation("[MC RCON] {Cmd} → {Resp}", command, cmdRes.body?.Length > 100 ? cmdRes.body[..100] : cmdRes.body);
        }
        catch (Exception ex)
        {
            _logger.LogDebug(ex, "[MC RCON] failed for {Host}:{Port}", host, port);
        }
    }

    private static async Task<bool> SendRconPacketAsync(System.Net.Sockets.NetworkStream stream, int id, int type, string body)
    {
        var bodyBytes = Encoding.UTF8.GetBytes(body);
        var length = 4 + 4 + bodyBytes.Length + 2;
        var buf = new byte[4 + length];
        BitConverter.GetBytes(length).CopyTo(buf, 0);
        BitConverter.GetBytes(id).CopyTo(buf, 4);
        BitConverter.GetBytes(type).CopyTo(buf, 8);
        bodyBytes.CopyTo(buf, 12);
        // last 2 bytes are nulls (already zeroed)
        try { await stream.WriteAsync(buf); return true; }
        catch { return false; }
    }

    private static async Task<(int id, string body)> ReadRconPacketAsync(System.Net.Sockets.NetworkStream stream)
    {
        var lenBuf = new byte[4];
        var n = await stream.ReadAsync(lenBuf.AsMemory(0, 4));
        if (n < 4) return (-1, "");
        var len = BitConverter.ToInt32(lenBuf, 0);
        if (len < 10 || len > 4096) return (-1, "");
        var rest = new byte[len];
        var read = 0;
        while (read < len)
        {
            var r = await stream.ReadAsync(rest.AsMemory(read, len - read));
            if (r == 0) break;
            read += r;
        }
        var id = BitConverter.ToInt32(rest, 0);
        var body = Encoding.UTF8.GetString(rest, 8, Math.Max(0, len - 10));
        return (id, body);
    }

    // Build the actionInfo payload the myactions widget expects. We start from
    // the action's stored ConfigJson (which mirrors the frontend's edit shape),
    // then overlay top-level fields the widget reads directly: id, name,
    // screenId, duration, media URLs, etc.
    private static JsonObject? BuildActionInfo(ActionItem action)
    {
        JsonObject root;
        try
        {
            root = string.IsNullOrWhiteSpace(action.ConfigJson)
                ? new JsonObject()
                : JsonNode.Parse(action.ConfigJson) as JsonObject ?? new JsonObject();
        }
        catch { root = new JsonObject(); }

        root["id"] = action.Id;
        root["channelId"] = action.ChannelId;
        if (!string.IsNullOrWhiteSpace(action.Name)) root["name"] = action.Name;
        if (root["screenId"] is null) root["screenId"] = 1;
        if (root["duration"] is null) root["duration"] = 5;
        if (root["enableFadeEffect"] is null) root["enableFadeEffect"] = true;
        if (root["dynamicConfig"] is null) root["dynamicConfig"] = new JsonObject();

        return root;
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

    // Emit all aggregate state to a freshly-connected widget so it can render
    // with current data instead of waiting for the next event. Covers:
    //   updateTopGifter, updateTopLiker, updateRanking, topGiftData, stats,
    //   updateViewerCount, setLastX
    public async Task EmitInitialAggregateStateAsync()
    {
        try
        {
            var topGifterList = _topGifters.Values
                .OrderByDescending(x => x.TotalAmount)
                .Take(20)
                .Select(x => new { totalAmount = x.TotalAmount, username = x.Username, nickname = x.Nickname, profilePictureUrl = x.ProfilePictureUrl, userId = x.UserId })
                .ToArray();
            await _socketManager.BroadcastEvent("updateTopGifter", topGifterList);

            var topLikerList = _topLikers.Values
                .OrderByDescending(x => x.TotalAmount)
                .Take(20)
                .Select(x => new { totalAmount = x.TotalAmount, username = x.Username, nickname = x.Nickname, profilePictureUrl = x.ProfilePictureUrl, userId = x.UserId })
                .ToArray();
            await _socketManager.BroadcastEvent("updateTopLiker", topLikerList);

            var rankingList = _rankingUsers.Values
                .OrderByDescending(x => x.TotalAmount)
                .Take(20)
                .Select(x => new { totalAmount = x.TotalAmount, username = x.Username, nickname = x.Nickname, profilePictureUrl = x.ProfilePictureUrl, userId = x.UserId, totalRewardAmount = x.TotalRewardAmount })
                .ToArray();
            await _socketManager.BroadcastEvent("updateRanking", rankingList);

            await _socketManager.BroadcastEvent("topGiftData", new
            {
                topGift = new { giftPictureUrl = _topGiftPictureUrl, username = _topGiftUsername, title = _topGiftTitle, count = _topGiftCount },
                topStreaker = new { giftPictureUrl = _topGiftPictureUrl, username = _topGiftUsername, title = _topGiftTitle, count = _topGiftCount }
            });

            await _socketManager.BroadcastEvent("stats", new
            {
                viewers = _viewerCount,
                likes = _likeCount,
                gifts = _giftCount,
                diamonds = _diamondCount,
                followers = _followerCount
            });

            await _socketManager.BroadcastEvent("updateViewerCount", new { viewerCount = _viewerCount });

            await BroadcastLastEvents();
        }
        catch (Exception ex)
        {
            _logger.LogDebug(ex, "[TikTok] EmitInitialAggregateStateAsync failed");
        }
    }

    // ── Helper: broadcast goal status for goal widget ──
    //
    // The bundle's `/widget/goal?metric=likes` widget expects payload:
    //   { config: { goal_likes_title, goal_likes_value, ... per metric },
    //     status: { likes: {current, percentage}, shares: {...}, ... } }
    //
    // Goal targets are saved via `/api/updateSettings` into DynamicSettings as
    // `goal_<metric>_value` / `goal_<metric>_title` etc., NOT into the Goals
    // table (which only stores explicit Goal records the user creates via
    // GoalsController). We pull config from DynamicSettings and compute
    // status against the live aggregate counters.
    private async Task BroadcastGoalStatus()
    {
        if (!_goalsLoaded) await EnsureGoalsLoaded();

        var config = new Dictionary<string, object>();
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var ch = await db.Channels.OrderBy(c => c.ChannelId).Select(c => new { c.ChannelId, c.ProfileId }).FirstOrDefaultAsync();
            if (ch != null && ch.ChannelId > 0)
            {
                var channelId = ch.ChannelId;
                var profileId = ch.ProfileId > 0 ? ch.ProfileId : 1;
                var rows = await db.DynamicSettings
                    .Where(d => d.ChannelId == channelId && d.ProfileId == profileId && d.Key.StartsWith("goal_"))
                    .Select(d => new { d.Key, d.Value })
                    .ToListAsync();
                foreach (var r in rows)
                {
                    config[r.Key] = r.Value ?? "";
                }
            }
        }
        catch (Exception ex) { _logger.LogDebug(ex, "[Goal] config load failed"); }

        var status = new Dictionary<string, object>();
        var metrics = new Dictionary<string, int>
        {
            ["likes"]    = _likeCount,
            ["shares"]   = _shareCount,
            ["follows"]  = _followerCount,
            ["subs"]     = _subscriberCount,
            ["viewer"]   = _viewerCount,
            ["coins"]    = _diamondCount,
            ["points"]   = 0, // wired from PointsService later if needed
            ["custom1"]  = _customGoal1,
            ["custom2"]  = 0,
            ["custom3"]  = 0
        };
        foreach (var (metric, current) in metrics)
        {
            int target = 0;
            if (config.TryGetValue($"goal_{metric}_value", out var t) && int.TryParse(t?.ToString(), out var parsed))
                target = parsed;
            var pct = target > 0 ? Math.Min(100.0, Math.Round(100.0 * current / target, 1)) : 0;
            status[metric] = new { current, percentage = pct, target };
        }

        // Compose legacy `goal{id}` keys too so older widget builds keep working.
        var payload = new Dictionary<string, object>
        {
            ["config"] = config,
            ["status"] = status,
            ["subscriberGoal"] = new { current = _subscriberCount, target = 100, title = "Subscriber Goal" },
            ["customGoal1"]    = new { current = _customGoal1, target = 100, title = "Custom Goal" }
        };
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

    /// <summary>
    /// Subathon helper — add seconds to the running countdown timer. No-op if
    /// the timer is stopped (so we don't accidentally start one mid-stream).
    /// Broadcasts `timerUpdate` so widget reflects new duration immediately.
    /// </summary>
    public async Task AddTimerSecondsAsync(int seconds)
    {
        if (seconds <= 0) return;
        if (_timerState == "stopped") return;
        _timerDurationMs += seconds * 1000;
        await _socketManager.BroadcastEvent("timerUpdate", new
        {
            state = _timerState,
            durationMs = _timerDurationMs,
            elapsedMs = _timerState == "running"
                ? _timerElapsedBeforePauseMs + (int)(DateTime.UtcNow - _timerStartedAt).TotalMilliseconds
                : _timerElapsedBeforePauseMs,
            startedAt = _timerStartedAt.ToString("o"),
            addedSeconds = seconds
        });
    }

    /// <summary>
    /// Read subathon config from DynamicSettings and apply: each event gets
    /// converted to "seconds to add" using its rate. Called from gift, sub,
    /// follow handlers so the timer extends as engagement happens.
    /// Settings keys: `subathon_enabled`, `subathon_secondsPerDiamond`,
    /// `subathon_secondsPerSub`, `subathon_secondsPerFollow`.
    /// </summary>
    private async Task TryApplySubathonAsync(string source, int diamonds = 0)
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var ch = await db.Channels.OrderBy(c => c.ChannelId).Select(c => new { c.ChannelId, c.ProfileId }).FirstOrDefaultAsync();
            if (ch == null || ch.ChannelId <= 0) return;
            var channelId = ch.ChannelId;
            var profileId = ch.ProfileId > 0 ? ch.ProfileId : 1;

            var keys = new[]
            {
                "subathon_enabled",
                $"subathon_secondsPer{source}",
                $"subathon_secondsPer{source}_v2"
            };
            var rows = await db.DynamicSettings
                .Where(d => d.ChannelId == channelId && d.ProfileId == profileId && (
                    d.Key == "subathon_enabled" ||
                    d.Key == $"subathon_secondsPer{source}" ||
                    d.Key == "subathon_secondsPerDiamond"))
                .Select(d => new { d.Key, d.Value })
                .ToListAsync();
            var dict = rows.ToDictionary(r => r.Key, r => r.Value ?? "", StringComparer.OrdinalIgnoreCase);

            var enabled = dict.TryGetValue("subathon_enabled", out var en) && string.Equals(en?.Trim(), "true", StringComparison.OrdinalIgnoreCase);
            if (!enabled) return;

            int secondsToAdd = 0;
            if (string.Equals(source, "Gift", StringComparison.OrdinalIgnoreCase))
            {
                if (dict.TryGetValue("subathon_secondsPerDiamond", out var spd) && int.TryParse(spd, out var perDiamond))
                {
                    secondsToAdd = perDiamond * diamonds;
                }
                else if (dict.TryGetValue("subathon_secondsPerGift", out var spg) && int.TryParse(spg, out var perGift))
                {
                    secondsToAdd = perGift;
                }
            }
            else if (dict.TryGetValue($"subathon_secondsPer{source}", out var v) && int.TryParse(v, out var n))
            {
                secondsToAdd = n;
            }

            if (secondsToAdd > 0)
            {
                await AddTimerSecondsAsync(secondsToAdd);
                _logger.LogInformation("[Subathon] +{Sec}s from {Source} (diamonds={Diamonds})",
                    secondsToAdd, source, diamonds);
            }
        }
        catch (Exception ex) { _logger.LogDebug(ex, "[Subathon] apply failed for {Source}", source); }
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
