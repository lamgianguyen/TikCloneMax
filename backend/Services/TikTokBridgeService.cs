using System.Collections.Concurrent;
using System.Diagnostics;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading;

namespace TikFinityBackend.Services;

/// <summary>
/// Manages the Node.js TikTok bridge process and forwards TikTok LIVE events
/// to connected Socket.IO clients via the SocketManager.
/// </summary>
public class TikTokBridgeService : BackgroundService
{
    private readonly ILogger<TikTokBridgeService> _logger;
    private readonly SocketManager _socketManager;
    private Process? _nodeProcess;
    private ClientWebSocket? _bridgeWs;
    private readonly SemaphoreSlim _bridgeLock = new(1, 1);
    private volatile bool _connected;
    private volatile bool _connecting;
    private volatile string? _currentUsername;
    private volatile string? _lastConnectionError;
    private int _viewerCount;
    private int _likeCount;
    private int _giftCount;
    private int _diamondCount;
    private int _followerCount;
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
    private int _subscriberCount;
    private int _customGoal1;

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

    public TikTokBridgeService(ILogger<TikTokBridgeService> logger, SocketManager socketManager)
    {
        _logger = logger;
        _socketManager = socketManager;
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
        var bridgePath = Path.Combine(Directory.GetCurrentDirectory(), "..", "tiktok-bridge");
        if (!Directory.Exists(bridgePath))
            bridgePath = Path.Combine(Directory.GetCurrentDirectory(), "tiktok-bridge");

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
            if (!string.IsNullOrEmpty(e.Data))
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
                    var msg = data.TryGetProperty("message", out var m) ? m.GetString() : "Connection failed";
                    var failedUsername = data.TryGetProperty("username", out var failedUser) ? failedUser.GetString() : _currentUsername;
                    _connected = false;
                    _connecting = false;
                    _lastConnectionError = msg;
                    if (!string.IsNullOrWhiteSpace(failedUsername))
                    {
                        _currentUsername = failedUsername;
                    }
                    _logger.LogWarning("[TikTok] Connection failed: {Message}", msg);
                    // Broadcast only a clean "disconnected" status. We deliberately do NOT
                    // broadcast `connectFailed` because the obfuscated bundle renders its
                    // message as a persistent red banner across the top of the app.
                    // Clients can poll /api/tiktok/status if they want the last error.
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
                    break;

                case "connecting":
                    _connecting = true;
                    _lastConnectionError = null;
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
                        await _socketManager.BroadcastEvent("coin-jar:gift", new
                        {
                            giftPictureUrl = giftPic,
                            value = diamonds,
                            repeatCount,
                            giftName,
                            username = giftUser
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
                    }
                    else if (eventName == "share")
                    {
                        var shareUser = data.TryGetProperty("uniqueId", out var su) ? su.GetString() ?? "" : "";
                        var shareNick = data.TryGetProperty("nickname", out var sn) ? sn.GetString() ?? "" : "";
                        var sharePic = data.TryGetProperty("profilePictureUrl", out var sp) ? sp.GetString() ?? "" : "";
                        if (!string.IsNullOrEmpty(shareUser))
                        {
                            _lastEvents["share"] = new LastEventData(shareNick ?? shareUser, sharePic);
                            await BroadcastLastEvents();
                        }
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
                        _viewerCount = vc.GetInt32();
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
    public async Task ConnectToTikTok(string username)
    {
        _logger.LogInformation("[TikTok] ConnectToTikTok called: username={Username}, bridgeWs={State}",
            username, _bridgeWs == null ? "null" : _bridgeWs.State.ToString());

        username = username.Trim().TrimStart('@');
        if (string.IsNullOrWhiteSpace(username))
        {
            return;
        }

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
            _logger.LogError("[TikTok] Bridge reconnect failed, cannot connect to @{Username}", username);
            return;
        }

        _logger.LogInformation("[TikTok] Sent connect command for @{Username}", username);
    }

    /// <summary>
    /// Disconnect from the current TikTok LIVE stream.
    /// </summary>
    public async Task DisconnectFromTikTok()
    {
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

    // ── Helper: broadcast goal status for goal widget ──
    private async Task BroadcastGoalStatus()
    {
        await _socketManager.BroadcastEvent("goalStatus", new
        {
            subscriberGoal = new { current = _subscriberCount, target = 100, title = "Subscriber Goal" },
            customGoal1 = new { current = _customGoal1, target = 100, title = "Custom Goal" }
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
