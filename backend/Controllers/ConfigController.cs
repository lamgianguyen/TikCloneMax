using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api")]
[AllowAnonymous]
public class ConfigController : BaseApiController
{
    private readonly AppDbContext _db;

    public ConfigController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("getAppConfig")]
    [HttpPost("getAppConfig")]
    [HttpGet("config")]
    [HttpPost("config")]
    public async Task<IActionResult> GetAppConfig()
    {
        var channelId = GetChannelId();
        var channel = channelId > 0
            ? await _db.Channels
                .Include(c => c.Subscription)
                .Include(c => c.Modules)
                .Include(c => c.DynamicSettings)
                .FirstOrDefaultAsync(c => c.ChannelId == channelId)
            : null;

        var isPro = channel?.Subscription?.IsPro ?? true;
        var dynamicSettings = channel?.DynamicSettings?.ToDictionary(d => d.Key, d => d.Value) ?? new Dictionary<string, string>();
        var modules = BuildModules(channel?.Modules);

        return Ok(new
        {
            status = 200,
            message = "OK",
            isPro,
            subscription = new { isPro, plan = channel?.Subscription?.Plan ?? "pro", active = true },
            config = new
            {
                modules = modules.Select(m => new { m.Id, m.Sort }),
                features = isPro ? new[] { "all" } : Array.Empty<string>(),
                settings = dynamicSettings
            },
            modules,
            sounds = Array.Empty<object>(),
            actions = Array.Empty<object>(),
            voices = Array.Empty<object>(),
            events = Array.Empty<object>(),
            gifts = Array.Empty<object>(),
            overlays = Array.Empty<object>(),
            widgets = Array.Empty<object>(),
            commands = Array.Empty<object>(),
            goals = Array.Empty<object>(),
            triggers = Array.Empty<object>(),
            settings = dynamicSettings,
            channelId = channelId > 0 ? channelId : 1,
            version = "1.0.4"
        });
    }

    private static List<ModuleDto> BuildModules(IEnumerable<ChannelModule>? channelModules)
    {
        var merged = DefaultModules().ToDictionary(m => m.Id, StringComparer.OrdinalIgnoreCase);

        if (channelModules != null)
        {
            foreach (var module in channelModules)
            {
                var hasDefault = merged.TryGetValue(module.ModuleId, out var existing);
                var fallback = hasDefault
                    ? existing
                    : new ModuleDto(module.ModuleId, module.Name, module.Sort, module.Enabled);

                merged[module.ModuleId] = new ModuleDto(
                    module.ModuleId,
                    string.IsNullOrWhiteSpace(module.Name) ? fallback.Name : module.Name,
                    hasDefault ? fallback.Sort : (module.Sort > 0 ? module.Sort : fallback.Sort),
                    module.Enabled);
            }
        }

        return merged.Values.OrderBy(m => m.Sort).ToList();
    }

    private static List<ModuleDto> DefaultModules() =>
    [
        new("actions", "Actions & Events", 1, true),
        new("events", "Events", 2, true),
        new("sounds", "Sound Alerts", 3, true),
        new("tts", "Text to Speech", 4, true),
        new("media", "Media Share", 5, true),
        new("timers", "Timers", 6, true),
        new("commands", "Chat Commands", 7, true),
        new("spotify", "Spotify Integration", 8, true),
        new("webhooks", "Webhooks", 9, true),
        new("overlays", "Overlays", 10, true)
    ];

    private record ModuleDto(string Id, string Name, int Sort, bool Enabled);

    [HttpGet("getSystemConfig")]
    [HttpPost("getSystemConfig")]
    public IActionResult GetSystemConfig()
    {
        return Ok(new
        {
            status = 200,
            message = "OK",
            config = new
            {
                modules = new object[]
                {
                    new { id = "actions", sort = 1, enabled = true },
                    new { id = "events", sort = 2, enabled = true },
                    new { id = "sounds", sort = 3, enabled = true },
                    new { id = "tts", sort = 4, enabled = true },
                    new { id = "media", sort = 5, enabled = true },
                    new { id = "timers", sort = 6, enabled = true },
                    new { id = "commands", sort = 7, enabled = true },
                    new { id = "spotify", sort = 8, enabled = true },
                    new { id = "webhooks", sort = 9, enabled = true },
                    new { id = "overlays", sort = 10, enabled = true }
                },
                features = new[] { "all" },
                settings = new { }
            },
            modules = new object[]
            {
                new { id = "actions", sort = 1, enabled = true },
                new { id = "events", sort = 2, enabled = true },
                new { id = "sounds", sort = 3, enabled = true },
                new { id = "tts", sort = 4, enabled = true },
                new { id = "media", sort = 5, enabled = true },
                new { id = "timers", sort = 6, enabled = true },
                new { id = "commands", sort = 7, enabled = true },
                new { id = "spotify", sort = 8, enabled = true },
                new { id = "webhooks", sort = 9, enabled = true },
                new { id = "overlays", sort = 10, enabled = true }
            },
            isPro = true,
            features = new[] { "all" },
            ttsVoices = Array.Empty<object>(),
            languages = new[] { "en", "de", "es", "fr", "pt", "vi" },
            supportedLanguages = new[] { "en", "de", "es", "fr", "pt", "vi" },
            defaultLanguage = "en",
            maxSoundSize = 10485760,
            maxImageSize = 5242880
        });
    }

    [HttpGet("getTranslations")]
    [HttpPost("getTranslations")]
    public IActionResult GetTranslations()
    {
        return Ok(new { status = 200, message = "OK", translations = new { } });
    }

    [HttpGet("init")]
    [HttpPost("init")]
    public IActionResult Init()
    {
        return Ok(new { status = 200, message = "OK", countryCode = "VN" });
    }

    [HttpGet("v2/sync")]
    [HttpPost("v2/sync")]
    public IActionResult Sync()
    {
        return Ok(new
        {
            status = 200,
            message = "OK",
            data = new
            {
                actions = Array.Empty<object>(),
                sounds = Array.Empty<object>(),
                events = Array.Empty<object>(),
                overlays = Array.Empty<object>(),
                commands = Array.Empty<object>(),
                goals = Array.Empty<object>(),
                triggers = Array.Empty<object>(),
                settings = new Dictionary<string, string>()
            },
            syncedAt = DateTime.UtcNow
        });
    }
}
