using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;
using System.Text.Json;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api/seed")]
public class SeedController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private static readonly JsonSerializerOptions JsonOpts = new() { PropertyNameCaseInsensitive = true };

    public SeedController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    /// <summary>
    /// POST /api/seed - Import all crawled JSON data into DB for a given channelId
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> SeedAll([FromQuery] int? channelId)
    {
        var apiDir = Path.Combine(Directory.GetCurrentDirectory(), "..", "downloads", "api");
        if (!Directory.Exists(apiDir))
            return BadRequest(new { status = "error", message = "downloads/api directory not found" });

        // Use provided channelId or find first channel in DB
        int targetChannelId;
        if (channelId.HasValue)
        {
            targetChannelId = channelId.Value;
        }
        else
        {
            var firstChannel = await _db.Channels.OrderBy(c => c.ChannelId).FirstOrDefaultAsync();
            if (firstChannel == null)
                return BadRequest(new { status = "error", message = "No channels in DB. Register first." });
            targetChannelId = firstChannel.ChannelId;
        }

        var channel = await _db.Channels.FindAsync(targetChannelId);
        if (channel == null)
            return NotFound(new { status = "error", message = $"Channel {targetChannelId} not found" });

        var results = new Dictionary<string, object>();

        // 1. Import channel data from /api/me
        var meResult = await ImportChannelData(apiDir, channel);
        results["channel"] = meResult;

        // 2. Import DynamicSettings from /api/me (channel.dynamicSettings)
        var settingsResult = await ImportDynamicSettings(apiDir, targetChannelId);
        results["dynamicSettings"] = settingsResult;

        // 3. Import Actions from /api/rest/action
        var actionsResult = await ImportActions(apiDir, targetChannelId);
        results["actions"] = actionsResult;

        // 4. Import Modules from /api/modules
        var modulesResult = await ImportModules(apiDir, targetChannelId);
        results["modules"] = modulesResult;

        // 5. Import Notifications from /api/notifications/list
        var notifResult = await ImportNotifications(apiDir, targetChannelId);
        results["notifications"] = notifResult;

        // 6. Import Subscription (pro status)
        var subResult = await ImportSubscription(targetChannelId);
        results["subscription"] = subResult;

        await _db.SaveChangesAsync();

        return Ok(new { status = "ok", channelId = targetChannelId, imported = results });
    }

    private async Task<object> ImportChannelData(string apiDir, Channel channel)
    {
        var mePath = Path.Combine(apiDir, "me");
        if (!System.IO.File.Exists(mePath)) return new { skipped = true, reason = "me file not found" };

        var json = await System.IO.File.ReadAllTextAsync(mePath);
        var doc = JsonDocument.Parse(json);
        var ch = doc.RootElement.GetProperty("channel");

        // Update channel fields from crawled data
        if (ch.TryGetProperty("ownerUserId", out var oid)) channel.OwnerUserId = oid.GetString();
        if (ch.TryGetProperty("channelSignature", out var sig)) channel.ChannelSignature = sig.GetString() ?? "";
        if (ch.TryGetProperty("sub", out var sub)) channel.Sub = sub.GetString();
        if (ch.TryGetProperty("locale", out var loc)) channel.Locale = loc.GetString() ?? "VN";
        if (ch.TryGetProperty("profileId", out var pid)) channel.ProfileId = pid.GetInt32();

        _db.Channels.Update(channel);
        return new { updated = true };
    }

    private async Task<object> ImportDynamicSettings(string apiDir, int channelId)
    {
        var mePath = Path.Combine(apiDir, "me");
        if (!System.IO.File.Exists(mePath)) return new { skipped = true };

        var json = await System.IO.File.ReadAllTextAsync(mePath);
        var doc = JsonDocument.Parse(json);
        var ch = doc.RootElement.GetProperty("channel");

        if (!ch.TryGetProperty("dynamicSettings", out var ds)) return new { skipped = true, reason = "no dynamicSettings" };

        // Clear existing settings for this channel
        var existing = await _db.DynamicSettings.Where(d => d.ChannelId == channelId).ToListAsync();
        _db.DynamicSettings.RemoveRange(existing);

        int count = 0;
        foreach (var prop in ds.EnumerateObject())
        {
            var val = prop.Value.ValueKind == JsonValueKind.String
                ? prop.Value.GetString() ?? ""
                : prop.Value.ToString();

            _db.DynamicSettings.Add(new DynamicSetting
            {
                ChannelId = channelId,
                Key = prop.Name,
                Value = val.Length > 4000 ? val[..4000] : val
            });
            count++;
        }

        return new { imported = count };
    }

    private async Task<object> ImportActions(string apiDir, int channelId)
    {
        var actionPath = Path.Combine(apiDir, "rest", "action");
        if (!System.IO.File.Exists(actionPath)) return new { skipped = true };

        var json = await System.IO.File.ReadAllTextAsync(actionPath);
        var doc = JsonDocument.Parse(json);

        if (!doc.RootElement.TryGetProperty("actions", out var actions)) return new { skipped = true };

        // Clear existing actions
        var existing = await _db.Actions.Where(a => a.ChannelId == channelId).ToListAsync();
        _db.Actions.RemoveRange(existing);

        int count = 0;
        foreach (var a in actions.EnumerateArray())
        {
            var name = a.TryGetProperty("name", out var n) ? n.GetString() ?? "Unnamed" : "Unnamed";
            var configJson = a.GetRawText(); // Store full JSON as config

            _db.Actions.Add(new ActionItem
            {
                ChannelId = channelId,
                Name = name,
                Type = a.TryGetProperty("type", out var t) ? t.GetString() ?? "" : "",
                ConfigJson = configJson,
                Enabled = true,
                Sort = count,
                CreatedAt = DateTime.UtcNow
            });
            count++;
        }

        return new { imported = count };
    }

    private async Task<object> ImportModules(string apiDir, int channelId)
    {
        var modulesPath = Path.Combine(apiDir, "modules");
        if (!System.IO.File.Exists(modulesPath)) return new { skipped = true };

        var json = await System.IO.File.ReadAllTextAsync(modulesPath);
        var modules = JsonSerializer.Deserialize<JsonElement>(json);

        // Clear existing modules
        var existing = await _db.Set<ChannelModule>().Where(m => m.ChannelId == channelId).ToListAsync();
        _db.Set<ChannelModule>().RemoveRange(existing);

        int count = 0;
        foreach (var m in modules.EnumerateArray())
        {
            var moduleId = m.TryGetProperty("id", out var id) ? id.GetString() ?? "" : "";
            var name = m.TryGetProperty("name", out var n) ? n.GetString() ?? "" : "";
            var enabled = m.TryGetProperty("enabled", out var e) && e.GetBoolean();
            var sort = m.TryGetProperty("sort", out var s) ? s.GetInt32() : count;

            _db.Set<ChannelModule>().Add(new ChannelModule
            {
                ChannelId = channelId,
                ModuleId = moduleId,
                Name = name,
                Enabled = enabled,
                Sort = sort
            });
            count++;
        }

        return new { imported = count };
    }

    private async Task<object> ImportNotifications(string apiDir, int channelId)
    {
        var notifPath = Path.Combine(apiDir, "notifications", "list");
        if (!System.IO.File.Exists(notifPath)) return new { skipped = true };

        var json = await System.IO.File.ReadAllTextAsync(notifPath);
        var doc = JsonDocument.Parse(json);

        if (!doc.RootElement.TryGetProperty("notifications", out var notifs)) return new { skipped = true };

        // Clear existing
        var existing = await _db.Notifications.Where(n => n.ChannelId == channelId).ToListAsync();
        _db.Notifications.RemoveRange(existing);

        int count = 0;
        foreach (var n in notifs.EnumerateArray())
        {
            var subject = n.TryGetProperty("subject", out var s) ? s.GetString() ?? "" : "";
            var body = n.TryGetProperty("body", out var b) ? b.GetString() ?? "" : "";
            var category = n.TryGetProperty("category", out var c) ? c.GetString() ?? "announcements" : "announcements";
            var isRead = n.TryGetProperty("isRead", out var r) && r.GetBoolean();

            _db.Notifications.Add(new Notification
            {
                ChannelId = channelId,
                Subject = subject,
                Body = body,
                Category = category,
                IsRead = isRead,
                IsSeen = isRead,
                CreatedAt = DateTime.UtcNow
            });
            count++;
        }

        return new { imported = count };
    }

    private async Task<object> ImportSubscription(int channelId)
    {
        // Give the channel a Pro subscription
        var existing = await _db.Set<Subscription>().FirstOrDefaultAsync(s => s.ChannelId == channelId);
        if (existing != null)
        {
            existing.IsPro = true;
            existing.Plan = "pro";
            existing.Active = true;
            return new { updated = true };
        }

        _db.Set<Subscription>().Add(new Subscription
        {
            ChannelId = channelId,
            IsPro = true,
            Plan = "pro",
            Active = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        return new { created = true };
    }

    /// <summary>
    /// GET /api/seed/status - Check what data exists in DB
    /// </summary>
    [HttpGet("status")]
    public async Task<IActionResult> Status()
    {
        return Ok(new
        {
            channels = await _db.Channels.CountAsync(),
            actions = await _db.Actions.CountAsync(),
            dynamicSettings = await _db.DynamicSettings.CountAsync(),
            modules = await _db.Set<ChannelModule>().CountAsync(),
            notifications = await _db.Notifications.CountAsync(),
            subscriptions = await _db.Set<Subscription>().CountAsync(),
            sounds = await _db.Sounds.CountAsync(),
            overlays = await _db.Overlays.CountAsync(),
            widgets = await _db.Widgets.CountAsync(),
            goals = await _db.Goals.CountAsync(),
            timers = await _db.Timers.CountAsync(),
            commands = await _db.Set<ChatCommand>().CountAsync()
        });
    }
}
