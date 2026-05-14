using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api")]
[AllowAnonymous]
public class SettingsController : BaseApiController
{
    private readonly AppDbContext _db;
    private readonly WidgetSettingsCache _settingsCache;

    public SettingsController(AppDbContext db, WidgetSettingsCache settingsCache)
    {
        _db = db;
        _settingsCache = settingsCache;
    }

    [HttpPost("updateSettings")]
    public async Task<IActionResult> UpdateSettings([FromBody] System.Text.Json.JsonElement body)
    {
        var channelId = GetChannelId();
        if (channelId <= 0)
            return Ok(new { status = 200, message = "OK" });

        var settings = new Dictionary<string, string>();

        // Accept both {"key":"value",...} and [{"key":"k","value":"v"},...] formats
        if (body.ValueKind == System.Text.Json.JsonValueKind.Object)
        {
            foreach (var prop in body.EnumerateObject())
            {
                settings[prop.Name] = prop.Value.ValueKind == System.Text.Json.JsonValueKind.String
                    ? prop.Value.GetString() ?? ""
                    : prop.Value.GetRawText();
            }
        }
        else if (body.ValueKind == System.Text.Json.JsonValueKind.Array)
        {
            foreach (var item in body.EnumerateArray())
            {
                if (item.ValueKind == System.Text.Json.JsonValueKind.Object)
                {
                    var k = item.TryGetProperty("key", out var kv) ? kv.GetString() :
                            item.TryGetProperty("Key", out var kv2) ? kv2.GetString() :
                            item.TryGetProperty("name", out var kv3) ? kv3.GetString() : null;
                    var v = item.TryGetProperty("value", out var vv) ? (vv.ValueKind == System.Text.Json.JsonValueKind.String ? vv.GetString() : vv.GetRawText()) :
                            item.TryGetProperty("Value", out var vv2) ? (vv2.ValueKind == System.Text.Json.JsonValueKind.String ? vv2.GetString() : vv2.GetRawText()) : "";
                    if (!string.IsNullOrEmpty(k)) settings[k] = v ?? "";
                }
            }
        }

        if (settings.Count == 0)
            return Ok(new { status = 200, message = "OK" });

        var profileId = GetProfileId();
        var existing = await _db.DynamicSettings
            .Where(d => d.ChannelId == channelId && d.ProfileId == profileId)
            .ToDictionaryAsync(d => d.Key, d => d);

        foreach (var (key, value) in settings)
        {
            if (existing.TryGetValue(key, out var setting))
            {
                setting.Value = value;
            }
            else
            {
                _db.DynamicSettings.Add(new DynamicSetting
                {
                    ChannelId = channelId,
                    ProfileId = profileId,
                    Key = key,
                    Value = value
                });
            }
        }

        await _db.SaveChangesAsync();

        // Rebuild cache and broadcast to all connected widget clients
        await _settingsCache.RebuildAndBroadcast(channelId);

        return Ok(new { status = 200, message = "OK" });
    }

    [HttpGet("getOverlayConfig")]
    [HttpPost("getOverlayConfig")]
    public async Task<IActionResult> GetOverlayConfig()
    {
        var channelId = GetChannelId();
        var overlays = await _db.Overlays
            .Where(o => o.ChannelId == channelId)
            .OrderBy(o => o.Sort)
            .Select(o => new { o.Id, o.Name, o.Type, o.ConfigJson, o.Enabled, o.Sort })
            .ToListAsync();

        return Ok(new { status = 200, message = "OK", overlays, widgets = Array.Empty<object>() });
    }

    [HttpGet("modules")]
    [HttpPost("modules")]
    public async Task<IActionResult> GetModules()
    {
        var channelId = GetChannelId();
        if (channelId > 0)
        {
            var modules = await _db.ChannelModules
                .Where(m => m.ChannelId == channelId)
                .OrderBy(m => m.Sort)
                .ToListAsync();

            if (modules.Count > 0)
                return Ok(BuildModules(modules));
        }

        return Ok(BuildModules(null));
    }

    private static object[] BuildModules(IEnumerable<ChannelModule>? channelModules)
    {
        var defaults = new Dictionary<string, (string Name, int Sort, bool Enabled)>(StringComparer.OrdinalIgnoreCase)
        {
            ["actions"] = ("Actions & Events", 1, true),
            ["events"] = ("Events", 2, true),
            ["sounds"] = ("Sound Alerts", 3, true),
            ["tts"] = ("Text to Speech", 4, true),
            ["media"] = ("Media Share", 5, true),
            ["timers"] = ("Timers", 6, true),
            ["commands"] = ("Chat Commands", 7, true),
            ["spotify"] = ("Spotify Integration", 8, true),
            ["webhooks"] = ("Webhooks", 9, true),
            ["overlays"] = ("Overlays", 10, true)
        };

        if (channelModules != null)
        {
            foreach (var module in channelModules)
            {
                var hasDefault = defaults.TryGetValue(module.ModuleId, out var existing);
                var fallback = hasDefault
                    ? existing
                    : (module.Name, module.Sort, module.Enabled);

                defaults[module.ModuleId] = (
                    string.IsNullOrWhiteSpace(module.Name) ? fallback.Name : module.Name,
                    hasDefault ? fallback.Sort : (module.Sort > 0 ? module.Sort : fallback.Sort),
                    module.Enabled
                );
            }
        }

        return defaults
            .OrderBy(pair => pair.Value.Sort)
            .Select(pair => (object)new
            {
                id = pair.Key,
                name = pair.Value.Name,
                sort = pair.Value.Sort,
                enabled = pair.Value.Enabled
            })
            .ToArray();
    }
}
