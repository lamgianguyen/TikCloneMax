using System.Text.Json;
using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;

namespace TikFinityBackend.Services;

/// <summary>
/// Single source of truth for widget settings.
/// Caches the merged (static defaults + DB overrides) settings JSON string.
/// All widget clients read from here; rebuild + broadcast when settings change.
/// </summary>
public class WidgetSettingsCache
{
    private readonly IServiceProvider _services;
    private readonly SocketManager _socketManager;
    private readonly ILogger<WidgetSettingsCache> _logger;
    private string _cachedJson;
    private readonly ConcurrentDictionary<int, string> _channelCache = new();
    private readonly object _lock = new();

    // ── Static defaults (slider scale: 50 = default/neutral) ──
    public const string StaticDefaults = "{\"isPro\":true"
        // cannon
        + ",\"cannon_ballTimeout\":30,\"cannon_maxBalls\":20,\"cannon_ballSize\":50,\"cannon_intensity\":50,\"cannon_showGiftPictures\":true,\"cannon_showCannon\":true"
        // chat
        + ",\"chat_fontSize\":50,\"chat_showBadges\":true,\"chat_showProfilePictures\":true,\"chat_showPictures\":true,\"chat_hideAfter\":0,\"chat_mini\":false,\"chat_rightAlignment\":true,\"chat_slideEffect\":true,\"chat_autoWidth\":true"
        + ",\"chat_showChatNormal\":true,\"chat_showChatMod\":true,\"chat_showChatSub\":true"
        + ",\"chat_usernameRgb\":true"
        + ",\"chat_usernameColorNormal\":\"#ffffff\",\"chat_usernameColorMod\":\"#5bc0de\",\"chat_usernameColorSub\":\"#f0ad4e\""
        + ",\"chat_commentColorNormal\":\"#ffffff\",\"chat_commentColorMod\":\"#ffffff\",\"chat_commentColorSub\":\"#ffffff\""
        + ",\"chat_backgroundNormal\":\"rgba(0,0,0,0.65)\",\"chat_backgroundMod\":\"rgba(0,0,0,0.65)\",\"chat_backgroundSub\":\"rgba(0,0,0,0.65)\""
        + ",\"chat_usernameEffectNormal\":\"none\",\"chat_usernameEffectMod\":\"none\",\"chat_usernameEffectSub\":\"none\""
        + ",\"chat_usernameWaveNormal\":false,\"chat_usernameWaveMod\":false,\"chat_usernameWaveSub\":false"
        + ",\"chat_usernameGlowNormal\":true,\"chat_usernameGlowMod\":true,\"chat_usernameGlowSub\":true"
        + ",\"chat_usernameGlowColorNormal\":\"#ffffff\",\"chat_usernameGlowColorMod\":\"#5bc0de\",\"chat_usernameGlowColorSub\":\"#e8b461\""
        // firework
        + ",\"firework_maxFireworks\":5,\"firework_minCoins\":1,\"firework_repeatWithCombos\":true,\"firework_showUsername\":true,\"firework_soundEnabled\":true,\"firework_soundVolume\":50"
        // gifts
        + ",\"gifts_hideAfter\":10,\"gifts_minValue\":0,\"gifts_mini\":false,\"gifts_showPictures\":true,\"gifts_slideEffect\":true"
        + ",\"gifts_usernameColor\":\"#ffffff\",\"gifts_commentColor\":\"#cccccc\",\"gifts_backgroundColor\":\"rgba(0,0,0,0.5)\""
        + ",\"gifts_usernameRgb\":true,\"gifts_usernameEffect\":\"none\",\"gifts_usernameGlow\":true,\"gifts_usernameGlowColor\":\"#ffffff\",\"gifts_usernameWave\":false"
        // emojify
        + ",\"emojify_emojiSize\":40,\"emojify_emoteSize\":40,\"emojify_profilePictureSize\":40,\"emojify_opacity\":100,\"emojify_animationDuration\":3,\"emojify_disappearAfter\":5,\"emojify_rotations\":2,\"emojify_showEmojis\":true,\"emojify_showPictures\":true,\"emojify_showSubEmotes\":true"
        // likefountain
        + ",\"likefountain_randomColor\":true,\"likefountain_randomPosition\":true,\"likefountain_showProfilePictures\":true"
        // coindrop
        + ",\"coindrop_soundEnabled\":true,\"coindrop_soundVolume\":50"
        // viewercount
        + ",\"viewercount_textColor\":\"#ffffff\",\"viewercount_backgroundColor\":\"rgba(0,0,0,0.5)\",\"viewercount_borderColor\":\"#ffffff\",\"viewercount_enableBorder\":false,\"viewercount_tiktokText\":false"
        // ranking/topgifter/topliker common
        + ",\"currencyName\":\"Coins\",\"showUserNicknames\":false"
        // topgifter
        + ",\"topgifter_usernameColor\":\"#ffffff\",\"topgifter_rankColor\":\"#aaaaaa\",\"topgifter_pointsColor\":\"#ffcc00\""
        + ",\"topgifter_usernameEffect\":\"none\",\"topgifter_usernameWave\":false,\"topgifter_usernameWaveSpeed\":\"normal\""
        + ",\"topgifter_showTrophy\":true,\"topgifter_showRank\":false,\"topgifter_showCoins\":true"
        + ",\"topgifter_showBoxShadow\":true,\"topgifter_boxShadowColor\":\"rgba(0,0,0,0.5)\""
        + ",\"topgifter_enableBorder\":false,\"topgifter_borderColor\":\"#ffffff\",\"topgifter_rightToLeft\":false"
        // topliker
        + ",\"topliker_usernameColor\":\"#ffffff\",\"topliker_rankColor\":\"#aaaaaa\",\"topliker_pointsColor\":\"#ffcc00\""
        + ",\"topliker_usernameEffect\":\"none\",\"topliker_usernameWave\":false,\"topliker_usernameWaveSpeed\":\"normal\""
        + ",\"topliker_showTrophy\":true,\"topliker_showRank\":false,\"topliker_showLikes\":true"
        + ",\"topliker_showBoxShadow\":true,\"topliker_boxShadowColor\":\"rgba(0,0,0,0.5)\""
        + ",\"topliker_enableBorder\":false,\"topliker_borderColor\":\"#ffffff\",\"topliker_rightToLeft\":false"
        // ranking
        + ",\"ranking_usernameColor\":\"#ffffff\",\"ranking_rankColor\":\"#aaaaaa\",\"ranking_pointsColor\":\"#ffcc00\",\"ranking_levelColor\":\"#aaaaaa\""
        + ",\"ranking_usernameEffect\":\"none\",\"ranking_usernameWave\":false,\"ranking_usernameWaveSpeed\":\"normal\""
        + ",\"ranking_showRank\":false,\"ranking_showLevel\":false"
        + ",\"ranking_showBoxShadow\":true,\"ranking_boxShadowColor\":\"rgba(0,0,0,0.5)\",\"ranking_rightToLeft\":false"
        // wheel
        + ",\"wheel_soundEnabled\":true,\"wheel_soundVolume\":50"
        // font settings (slider scale: 50 = default/neutral, 0-100 range)
        + ",\"chat_fontType\":\"\",\"chat_fontLineSpacing\":50,\"chat_fontLetterSpacing\":50"
        + ",\"gifts_fontType\":\"\",\"gifts_fontSize\":50,\"gifts_fontLineSpacing\":50,\"gifts_fontLetterSpacing\":50"
        + ",\"cannon_fontType\":\"\",\"cannon_fontSize\":50,\"cannon_fontLineSpacing\":50,\"cannon_fontLetterSpacing\":50"
        + ",\"topgifter_fontType\":\"\",\"topgifter_fontSize\":50,\"topgifter_fontLineSpacing\":50,\"topgifter_fontLetterSpacing\":50"
        + ",\"topliker_fontType\":\"\",\"topliker_fontSize\":50,\"topliker_fontLineSpacing\":50,\"topliker_fontLetterSpacing\":50"
        + ",\"ranking_fontType\":\"\",\"ranking_fontSize\":50,\"ranking_fontLineSpacing\":50,\"ranking_fontLetterSpacing\":50"
        + ",\"viewercount_fontType\":\"\",\"viewercount_fontSize\":50,\"viewercount_fontLineSpacing\":50,\"viewercount_fontLetterSpacing\":50"
        + ",\"goal_fontType\":\"\",\"goal_fontSize\":50,\"goal_fontLineSpacing\":50,\"goal_fontLetterSpacing\":50"
        + ",\"timer_fontType\":\"\",\"timer_fontSize\":50,\"timer_fontLineSpacing\":50,\"timer_fontLetterSpacing\":50"
        + ",\"emojify_fontType\":\"\",\"emojify_fontSize\":50,\"emojify_fontLineSpacing\":50,\"emojify_fontLetterSpacing\":50"
        + ",\"gifts_usernameWaveSpeed\":\"normal\""
        + "}";

    public WidgetSettingsCache(
        IServiceProvider services,
        SocketManager socketManager,
        ILogger<WidgetSettingsCache> logger)
    {
        _services = services;
        _socketManager = socketManager;
        _logger = logger;
        _cachedJson = StaticDefaults;
    }

    /// <summary>Get the current merged widget settings JSON string.</summary>
    public string GetJson() => _cachedJson;

    public async Task<string> GetJsonForChannel(int channelId = 1, bool refresh = false)
    {
        if (channelId <= 0)
        {
            return GetJson();
        }

        if (!refresh && _channelCache.TryGetValue(channelId, out var cached))
        {
            return cached;
        }

        var merged = await BuildMergedSettings(channelId);
        _channelCache[channelId] = merged;
        lock (_lock) { _cachedJson = merged; }
        return merged;
    }

    /// <summary>
    /// Rebuild the cache from DB for the given channel, then broadcast to all clients.
    /// Called on startup and whenever POST /api/updateSettings saves new values.
    /// </summary>
    public async Task RebuildAndBroadcast(int channelId = 1)
    {
        var merged = await GetJsonForChannel(channelId, refresh: true);
        await _socketManager.BroadcastEventRawToChannel("widgetSettings", merged, channelId, "widget");
        _logger.LogInformation("[WidgetSettings] Rebuilt and broadcast (channelId={ChannelId})", channelId);
    }

    /// <summary>Rebuild cache from DB without broadcasting.</summary>
    public async Task Rebuild(int channelId = 1)
    {
        try
        {
            var merged = await BuildMergedSettings(channelId);
            _channelCache[channelId] = merged;
            lock (_lock) { _cachedJson = merged; }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "[WidgetSettings] Failed to rebuild from DB, using static defaults");
            _channelCache[channelId] = StaticDefaults;
            lock (_lock) { _cachedJson = StaticDefaults; }
        }
    }

    private async Task<string> BuildMergedSettings(int channelId)
    {
        using var scope = _services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var dbSettings = await db.DynamicSettings
            .Where(d => d.ChannelId == channelId)
            .ToDictionaryAsync(d => d.Key, d => d.Value ?? "");

        return dbSettings.Count > 0 ? MergeSettings(dbSettings) : StaticDefaults;
    }

    private static string MergeSettings(Dictionary<string, string> dbSettings)
    {
        var defaults = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(StaticDefaults)
            ?? new Dictionary<string, JsonElement>();
        var canonicalKeys = defaults.Keys.ToDictionary(
            key => key.ToLowerInvariant(),
            key => key,
            StringComparer.OrdinalIgnoreCase);

        foreach (var (rawKey, value) in dbSettings)
        {
            if (string.IsNullOrEmpty(value)) continue;
            var key = NormalizeSettingKey(rawKey, canonicalKeys);
            if (bool.TryParse(value, out var bv))
                defaults[key] = JsonSerializer.SerializeToElement(bv);
            else if (int.TryParse(value, out var iv))
                defaults[key] = JsonSerializer.SerializeToElement(iv);
            else if (double.TryParse(value, System.Globalization.CultureInfo.InvariantCulture, out var dv))
                defaults[key] = JsonSerializer.SerializeToElement(dv);
            else
                defaults[key] = JsonSerializer.SerializeToElement(value);
        }

        return JsonSerializer.Serialize(defaults);
    }

    private static string NormalizeSettingKey(string key, IReadOnlyDictionary<string, string> canonicalKeys)
    {
        if (canonicalKeys.TryGetValue(key.ToLowerInvariant(), out var canonicalKey))
        {
            return canonicalKey;
        }

        if (key.StartsWith("widget_", StringComparison.OrdinalIgnoreCase))
        {
            var legacyKey = key["widget_".Length..];
            if (canonicalKeys.TryGetValue(legacyKey.ToLowerInvariant(), out canonicalKey))
            {
                return canonicalKey;
            }
        }

        return key;
    }
}
