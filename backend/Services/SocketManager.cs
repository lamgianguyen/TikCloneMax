using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

namespace TikFinityBackend.Services;

/// <summary>
/// Manages all active Socket.IO WebSocket connections.
/// Allows broadcasting TikTok LIVE events to all connected frontend clients.
/// </summary>
public class SocketManager
{
    private sealed class ClientInfo
    {
        public int ChannelId { get; set; }
        public string AppType { get; set; } = "";
    }

    private readonly ConcurrentDictionary<string, WebSocket> _connections = new();
    private readonly ConcurrentDictionary<string, ClientInfo> _clientInfo = new();
    private readonly ILogger<SocketManager> _logger;

    public SocketManager(ILogger<SocketManager> logger)
    {
        _logger = logger;
    }

    public int ConnectionCount => _connections.Count;

    public void AddConnection(string sessionId, WebSocket ws)
    {
        _connections[sessionId] = ws;
        _clientInfo.TryAdd(sessionId, new ClientInfo());
        _logger.LogInformation("[SocketManager] Client connected: {Sid} (total: {Count})", sessionId, _connections.Count);
    }

    public void RemoveConnection(string sessionId)
    {
        _connections.TryRemove(sessionId, out _);
        _clientInfo.TryRemove(sessionId, out _);
        _logger.LogInformation("[SocketManager] Client disconnected: {Sid} (total: {Count})", sessionId, _connections.Count);
    }

    public void UpdateClientContext(string sessionId, int channelId, string? appType)
    {
        _clientInfo.AddOrUpdate(
            sessionId,
            _ => new ClientInfo
            {
                ChannelId = channelId,
                AppType = appType ?? ""
            },
            (_, existing) =>
            {
                existing.ChannelId = channelId;
                existing.AppType = appType ?? "";
                return existing;
            });
    }

    /// <summary>
    /// Broadcast a Socket.IO event to all connected clients.
    /// Serializes data to JSON automatically.
    /// </summary>
    public async Task BroadcastEvent(string eventName, object data)
    {
        var json = JsonSerializer.Serialize(data);
        await BroadcastEventRaw(eventName, json);
    }

    /// <summary>
    /// Broadcast a Socket.IO event with pre-serialized JSON data.
    /// </summary>
    public async Task BroadcastEventRaw(string eventName, string jsonData)
    {
        await BroadcastEventRaw(eventName, jsonData, null);
    }

    public async Task BroadcastEventRawToChannel(string eventName, string jsonData, int channelId, string? appType = null)
    {
        await BroadcastEventRaw(
            eventName,
            jsonData,
            info => info.ChannelId == channelId
                && (string.IsNullOrEmpty(appType) || string.Equals(info.AppType, appType, StringComparison.OrdinalIgnoreCase)));
    }

    private async Task BroadcastEventRaw(string eventName, string jsonData, Func<ClientInfo, bool>? filter)
    {
        var encodedEventName = JsonSerializer.Serialize(eventName);
        var frame = $"42[{encodedEventName},{jsonData}]";
        var bytes = Encoding.UTF8.GetBytes(frame);
        var deadSessions = new List<string>();

        foreach (var (sid, ws) in _connections)
        {
            try
            {
                if (filter != null)
                {
                    if (!_clientInfo.TryGetValue(sid, out var info) || !filter(info))
                    {
                        continue;
                    }
                }

                if (ws.State == WebSocketState.Open)
                {
                    await ws.SendAsync(bytes, WebSocketMessageType.Text, true, CancellationToken.None);
                }
                else
                {
                    deadSessions.Add(sid);
                }
            }
            catch
            {
                deadSessions.Add(sid);
            }
        }

        // Clean up dead connections
        foreach (var sid in deadSessions)
        {
            _connections.TryRemove(sid, out _);
            _clientInfo.TryRemove(sid, out _);
        }
    }

    /// <summary>
    /// Send a Socket.IO event to a specific client.
    /// </summary>
    public async Task SendEvent(string sessionId, string eventName, object data)
    {
        if (!_connections.TryGetValue(sessionId, out var ws)) return;
        if (ws.State != WebSocketState.Open) return;

        var json = JsonSerializer.Serialize(data);
        var encodedEventName = JsonSerializer.Serialize(eventName);
        var frame = $"42[{encodedEventName},{json}]";
        var bytes = Encoding.UTF8.GetBytes(frame);

        try
        {
            await ws.SendAsync(bytes, WebSocketMessageType.Text, true, CancellationToken.None);
        }
        catch
        {
            _connections.TryRemove(sessionId, out _);
        }
    }
}
