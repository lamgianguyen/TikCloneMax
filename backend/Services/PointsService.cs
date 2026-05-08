using System.Globalization;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;

namespace TikFinityBackend.Services;

/// <summary>
/// Channel-points economy. Each TikTok event (gift / share / chat-minute) maps
/// to a delta defined in DynamicSetting. Subscribers and high-level users get
/// configurable multipliers. Per-user balances persist as DynamicSetting rows
/// keyed "points_user_{username}" so they survive restarts and are visible to
/// the existing leaderboard widgets without an extra schema.
///
/// Settings keys read by this service (defaults in parens):
///   points.per_coin                (1)        — per diamond from gifts
///   points.per_share               (3)        — per share event
///   points.per_chat_minute         (0.5)      — per minute of active chat
///   points.subscriber_multiplier   (2)        — multiplier when uniqueIsSubscriber=true
///   points.level_thresholds        ("100,500,1000,5000")
///   points.level_multipliers       ("1,1.2,1.5,2,3")
/// </summary>
public sealed class PointsService
{
    private readonly ILogger<PointsService> _logger;
    private readonly IServiceProvider _serviceProvider;

    public PointsService(ILogger<PointsService> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    public async Task<double> AwardForGiftAsync(int channelId, string username, int diamondCount, bool isSubscriber)
    {
        if (diamondCount <= 0 || string.IsNullOrEmpty(username)) return 0;
        var cfg = await LoadConfig(channelId);
        var basePoints = diamondCount * cfg.PerCoin;
        var totalAfter = await ApplyMultipliedPoints(channelId, username, basePoints, isSubscriber, cfg);
        return totalAfter;
    }

    public async Task<double> AwardForShareAsync(int channelId, string username, bool isSubscriber)
    {
        if (string.IsNullOrEmpty(username)) return 0;
        var cfg = await LoadConfig(channelId);
        return await ApplyMultipliedPoints(channelId, username, cfg.PerShare, isSubscriber, cfg);
    }

    public async Task<double> AwardForChatMinuteAsync(int channelId, string username, int minutes, bool isSubscriber)
    {
        if (minutes <= 0 || string.IsNullOrEmpty(username)) return 0;
        var cfg = await LoadConfig(channelId);
        var basePoints = minutes * cfg.PerChatMinute;
        return await ApplyMultipliedPoints(channelId, username, basePoints, isSubscriber, cfg);
    }

    /// <summary>Read current points balance for a user (0 if not set).</summary>
    public async Task<double> GetBalanceAsync(int channelId, string username)
    {
        if (string.IsNullOrEmpty(username)) return 0;
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var key = PointsKeyFor(username);
        var row = await db.DynamicSettings
            .Where(s => s.ChannelId == channelId && s.Key == key)
            .Select(s => s.Value)
            .FirstOrDefaultAsync();
        return ParseDouble(row);
    }

    /// <summary>Manually set balance (admin tooling, /api/reset/points uses this path).</summary>
    public async Task SetBalanceAsync(int channelId, string username, double value)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var key = PointsKeyFor(username);
        var existing = await db.DynamicSettings
            .FirstOrDefaultAsync(s => s.ChannelId == channelId && s.Key == key);
        if (existing != null) existing.Value = value.ToString("0.##", CultureInfo.InvariantCulture);
        else db.DynamicSettings.Add(new DynamicSetting
        {
            ChannelId = channelId,
            Key = key,
            Value = value.ToString("0.##", CultureInfo.InvariantCulture)
        });
        await db.SaveChangesAsync();
    }

    private async Task<double> ApplyMultipliedPoints(int channelId, string username, double basePoints, bool isSubscriber, PointsConfig cfg)
    {
        if (basePoints <= 0) return await GetBalanceAsync(channelId, username);

        var current = await GetBalanceAsync(channelId, username);
        var subMultiplier = isSubscriber ? cfg.SubscriberMultiplier : 1.0;
        var levelMultiplier = ResolveLevelMultiplier(current, cfg);

        var awarded = basePoints * subMultiplier * levelMultiplier;
        var next = current + awarded;
        await SetBalanceAsync(channelId, username, next);
        _logger.LogDebug("[Points] {Username} +{Awarded} (base={Base}, sub={Sub}, lvl={Lvl}) = {Total}",
            username, awarded, basePoints, subMultiplier, levelMultiplier, next);
        return next;
    }

    private static double ResolveLevelMultiplier(double currentBalance, PointsConfig cfg)
    {
        if (cfg.LevelThresholds.Length == 0 || cfg.LevelMultipliers.Length == 0) return 1.0;
        // Walk thresholds; each crossed threshold uses the next multiplier slot.
        var index = 0;
        foreach (var threshold in cfg.LevelThresholds)
        {
            if (currentBalance >= threshold) index++;
            else break;
        }
        index = Math.Min(index, cfg.LevelMultipliers.Length - 1);
        return cfg.LevelMultipliers[index];
    }

    private async Task<PointsConfig> LoadConfig(int channelId)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var rows = await db.DynamicSettings
            .Where(s => s.ChannelId == channelId && s.Key.StartsWith("points."))
            .ToDictionaryAsync(s => s.Key, s => s.Value);

        return new PointsConfig
        {
            PerCoin = ReadDouble(rows, "points.per_coin", 1.0),
            PerShare = ReadDouble(rows, "points.per_share", 3.0),
            PerChatMinute = ReadDouble(rows, "points.per_chat_minute", 0.5),
            SubscriberMultiplier = ReadDouble(rows, "points.subscriber_multiplier", 2.0),
            LevelThresholds = ReadDoubleArray(rows, "points.level_thresholds", new[] { 100.0, 500.0, 1000.0, 5000.0 }),
            LevelMultipliers = ReadDoubleArray(rows, "points.level_multipliers", new[] { 1.0, 1.2, 1.5, 2.0, 3.0 })
        };
    }

    private static double ReadDouble(IDictionary<string, string> rows, string key, double fallback)
    {
        if (!rows.TryGetValue(key, out var raw)) return fallback;
        return ParseDouble(raw, fallback);
    }

    private static double[] ReadDoubleArray(IDictionary<string, string> rows, string key, double[] fallback)
    {
        if (!rows.TryGetValue(key, out var raw) || string.IsNullOrWhiteSpace(raw)) return fallback;
        var parts = raw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var parsed = new List<double>(parts.Length);
        foreach (var p in parts)
        {
            if (double.TryParse(p, NumberStyles.Float, CultureInfo.InvariantCulture, out var v))
            {
                parsed.Add(v);
            }
        }
        return parsed.Count > 0 ? parsed.ToArray() : fallback;
    }

    private static double ParseDouble(string? raw, double fallback = 0.0)
    {
        if (string.IsNullOrWhiteSpace(raw)) return fallback;
        return double.TryParse(raw, NumberStyles.Float, CultureInfo.InvariantCulture, out var v) ? v : fallback;
    }

    private static string PointsKeyFor(string username) =>
        $"points_user_{username.Trim().ToLowerInvariant()}";

    private sealed class PointsConfig
    {
        public double PerCoin { get; init; }
        public double PerShare { get; init; }
        public double PerChatMinute { get; init; }
        public double SubscriberMultiplier { get; init; }
        public double[] LevelThresholds { get; init; } = Array.Empty<double>();
        public double[] LevelMultipliers { get; init; } = Array.Empty<double>();
    }
}
