using OBSWebsocketDotNet;
using OBSWebsocketDotNet.Communication;
using OBSWebsocketDotNet.Types;

namespace TikFinityBackend.Services;

/// <summary>
/// Wrapper around obs-websocket-dotnet (OBS WebSocket v5 protocol). Handles
/// connect/disconnect, scene listing, scene switching, and source visibility
/// toggles. Connection state is broadcast to renderer clients via
/// <see cref="SocketManager"/> as "obs:status" / "obs:scene-changed".
/// </summary>
public sealed class ObsService : IDisposable
{
    private readonly ILogger<ObsService> _logger;
    private readonly SocketManager _socketManager;
    private readonly OBSWebsocket _obs;

    public ObsService(ILogger<ObsService> logger, SocketManager socketManager)
    {
        _logger = logger;
        _socketManager = socketManager;
        _obs = new OBSWebsocket();

        _obs.Connected += OnConnected;
        _obs.Disconnected += OnDisconnected;
        _obs.CurrentProgramSceneChanged += OnSceneChanged;
    }

    public bool IsConnected => _obs.IsConnected;

    /// <summary>
    /// Connect to an OBS Studio instance running with obs-websocket plugin v5.
    /// Uses the format `ws://host:port` (default: `ws://localhost:4455`).
    /// </summary>
    public Task ConnectAsync(string url, string? password)
    {
        if (_obs.IsConnected)
        {
            _logger.LogInformation("[OBS] Already connected — disconnecting first");
            _obs.Disconnect();
        }

        _logger.LogInformation("[OBS] Connecting to {Url}", url);
        // ConnectAsync is fire-and-forget on this lib; OnConnected fires on success.
        _obs.ConnectAsync(url, password ?? "");
        return Task.CompletedTask;
    }

    public void Disconnect()
    {
        if (_obs.IsConnected) _obs.Disconnect();
    }

    /// <summary>List every scene OBS knows about.</summary>
    public IReadOnlyList<string> GetScenes()
    {
        if (!_obs.IsConnected) return Array.Empty<string>();
        try
        {
            var resp = _obs.GetSceneList();
            return resp.Scenes.Select(s => s.Name).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "[OBS] GetScenes failed");
            return Array.Empty<string>();
        }
    }

    public string? GetCurrentScene()
    {
        if (!_obs.IsConnected) return null;
        try { return _obs.GetCurrentProgramScene(); }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "[OBS] GetCurrentScene failed");
            return null;
        }
    }

    public bool SetCurrentScene(string sceneName)
    {
        if (!_obs.IsConnected || string.IsNullOrWhiteSpace(sceneName)) return false;
        try
        {
            _obs.SetCurrentProgramScene(sceneName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "[OBS] SetCurrentScene({Scene}) failed", sceneName);
            return false;
        }
    }

    public IReadOnlyList<SceneItemSummary> GetSceneItems(string sceneName)
    {
        if (!_obs.IsConnected) return Array.Empty<SceneItemSummary>();
        try
        {
            var items = _obs.GetSceneItemList(sceneName);
            return items
                .Select(i =>
                {
                    bool enabled;
                    try { enabled = _obs.GetSceneItemEnabled(sceneName, i.ItemId); }
                    catch { enabled = true; }
                    return new SceneItemSummary(i.ItemId, i.SourceName, enabled);
                })
                .ToList();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "[OBS] GetSceneItems({Scene}) failed", sceneName);
            return Array.Empty<SceneItemSummary>();
        }
    }

    public bool SetSceneItemEnabled(string sceneName, int sceneItemId, bool enabled)
    {
        if (!_obs.IsConnected) return false;
        try
        {
            _obs.SetSceneItemEnabled(sceneName, sceneItemId, enabled);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "[OBS] SetSceneItemEnabled failed");
            return false;
        }
    }

    public bool ToggleSceneItem(string sceneName, string sourceName)
    {
        if (!_obs.IsConnected) return false;
        try
        {
            var items = _obs.GetSceneItemList(sceneName);
            var item = items.FirstOrDefault(i => string.Equals(i.SourceName, sourceName, StringComparison.OrdinalIgnoreCase));
            if (item == null) return false;
            var current = _obs.GetSceneItemEnabled(sceneName, item.ItemId);
            _obs.SetSceneItemEnabled(sceneName, item.ItemId, !current);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "[OBS] ToggleSceneItem failed");
            return false;
        }
    }

    private void OnConnected(object? sender, EventArgs e)
    {
        _logger.LogInformation("[OBS] Connected");
        _ = _socketManager.BroadcastEvent("obs:status", new { connected = true });
    }

    private void OnDisconnected(object? sender, ObsDisconnectionInfo info)
    {
        _logger.LogInformation("[OBS] Disconnected (code={Code})", info?.WebsocketDisconnectionInfo?.CloseStatus);
        _ = _socketManager.BroadcastEvent("obs:status", new
        {
            connected = false,
            reason = info?.DisconnectReason
        });
    }

    private void OnSceneChanged(object? sender, OBSWebsocketDotNet.Types.Events.ProgramSceneChangedEventArgs e)
    {
        _logger.LogDebug("[OBS] Scene changed → {Scene}", e.SceneName);
        _ = _socketManager.BroadcastEvent("obs:scene-changed", new { scene = e.SceneName });
    }

    public void Dispose()
    {
        try
        {
            _obs.Connected -= OnConnected;
            _obs.Disconnected -= OnDisconnected;
            _obs.CurrentProgramSceneChanged -= OnSceneChanged;
            if (_obs.IsConnected) _obs.Disconnect();
        }
        catch { /* best-effort cleanup */ }
    }
}

public sealed record SceneItemSummary(int Id, string Name, bool Enabled);
