using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;

namespace TikFinityBackend.Services;

/// <summary>
/// Watches incoming TikTok chat messages and executes registered ChatCommand
/// patterns. Display-only — broadcasts the response via Socket.IO so overlay
/// widgets (commandinfo.html) can render it. Does not send messages back into
/// TikTok chat (would require an authenticated TikTok session + anti-bot signing).
/// </summary>
public sealed class ChatBotService
{
    private readonly ILogger<ChatBotService> _logger;
    private readonly SocketManager _socketManager;
    private readonly IServiceProvider _serviceProvider;

    private List<CommandConfig> _commands = new();
    private bool _loaded;

    // Per-user cooldowns: key = "{commandId}|{userId}", value = epoch ms when next allowed.
    private readonly ConcurrentDictionary<string, long> _cooldowns = new();

    private sealed record CommandConfig(int Id, string Pattern, string Response, int CooldownSeconds);

    public ChatBotService(
        ILogger<ChatBotService> logger,
        SocketManager socketManager,
        IServiceProvider serviceProvider)
    {
        _logger = logger;
        _socketManager = socketManager;
        _serviceProvider = serviceProvider;
    }

    /// <summary>Reload commands for a channel from DB. Called by ChatCommandsController on CRUD.</summary>
    public async Task RefreshAsync(int channelId)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        _commands = await db.ChatCommands
            .Where(c => c.ChannelId == channelId && c.Enabled)
            .OrderBy(c => c.Sort)
            .Select(c => new CommandConfig(c.Id, c.Command, c.Response, c.Cooldown))
            .ToListAsync();
        _loaded = true;
        _logger.LogInformation("[ChatBot] Loaded {Count} active commands for channel {ChannelId}", _commands.Count, channelId);
    }

    /// <summary>
    /// Called by TikTokBridgeService for each incoming chat event. Matches the
    /// message against registered commands and broadcasts a response if any
    /// command matches and is off-cooldown for the speaker.
    /// </summary>
    public async Task OnChatAsync(string username, string nickname, string profilePictureUrl, string userId, string comment)
    {
        if (string.IsNullOrWhiteSpace(comment)) return;
        if (!_loaded) await EnsureLoadedAsync();
        if (_commands.Count == 0) return;

        var match = FindMatch(comment);
        if (match is null) return;

        var key = $"{match.Id}|{userId}";
        var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        if (_cooldowns.TryGetValue(key, out var nextAllowed) && nextAllowed > now)
        {
            return; // user is still on cooldown for this command
        }

        if (match.CooldownSeconds > 0)
        {
            _cooldowns[key] = now + match.CooldownSeconds * 1000L;
        }

        var response = ExpandTemplate(match.Response, username, nickname, comment);
        await _socketManager.BroadcastEvent("bot:say", new
        {
            commandId = match.Id,
            command = match.Pattern,
            user = new { username, nickname, profilePictureUrl, userId },
            response,
            timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
        });

        // Also fire showCommandResult so the existing commandinfo widget displays it.
        await _socketManager.BroadcastEvent("showCommandResult", new
        {
            command = match.Pattern,
            result = response,
            user = nickname
        });
    }

    private CommandConfig? FindMatch(string comment)
    {
        var trimmed = comment.Trim();
        foreach (var cmd in _commands)
        {
            if (string.IsNullOrWhiteSpace(cmd.Pattern)) continue;
            // Default: prefix-style command (e.g., "!hello" matches "!hello world")
            if (trimmed.StartsWith(cmd.Pattern, StringComparison.OrdinalIgnoreCase))
            {
                // Match either exact "!hello" or "!hello " (avoid "!hellofoo")
                if (trimmed.Length == cmd.Pattern.Length ||
                    char.IsWhiteSpace(trimmed[cmd.Pattern.Length]))
                {
                    return cmd;
                }
            }
        }
        return null;
    }

    private static string ExpandTemplate(string template, string username, string nickname, string comment)
    {
        if (string.IsNullOrEmpty(template)) return "";
        return template
            .Replace("{user}", nickname, StringComparison.OrdinalIgnoreCase)
            .Replace("{username}", username, StringComparison.OrdinalIgnoreCase)
            .Replace("{nickname}", nickname, StringComparison.OrdinalIgnoreCase)
            .Replace("{message}", comment, StringComparison.OrdinalIgnoreCase);
    }

    private async Task EnsureLoadedAsync()
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var channelId = await db.Channels
                .OrderBy(c => c.ChannelId)
                .Select(c => (int?)c.ChannelId)
                .FirstOrDefaultAsync();
            if (channelId.HasValue) await RefreshAsync(channelId.Value);
            _loaded = true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "[ChatBot] Initial load failed");
            _loaded = true;
        }
    }
}
