using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;

namespace TikFinityBackend.Controllers;

/// <summary>
/// Full configuration backup. Export = single JSON document containing every
/// channel-scoped table the user can edit. Import = atomic replace.
///
/// Schema is versioned ("schemaVersion": 1) so future changes can migrate
/// older payloads instead of failing.
/// </summary>
[ApiController]
[Route("api/backup")]
[AllowAnonymous]
public sealed class BackupController : BaseApiController
{
    private const int CurrentSchemaVersion = 1;

    private readonly AppDbContext _db;

    public BackupController(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>Return all editable per-channel data as a single JSON document.</summary>
    [HttpGet("export")]
    public async Task<IActionResult> Export()
    {
        var channelId = GetChannelId();

        var settings = await _db.DynamicSettings
            .Where(s => s.ChannelId == channelId)
            .Select(s => new { s.Key, s.Value, s.ProfileId })
            .ToListAsync();

        var actions = await _db.Actions
            .Where(a => a.ChannelId == channelId)
            .ToListAsync();

        var sounds = await _db.Sounds.Where(s => s.ChannelId == channelId).ToListAsync();
        var commands = await _db.ChatCommands.Where(c => c.ChannelId == channelId).ToListAsync();
        var goals = await _db.Goals.Where(g => g.ChannelId == channelId).ToListAsync();
        var timers = await _db.Timers.Where(t => t.ChannelId == channelId).ToListAsync();
        var overlays = await _db.Overlays.Where(o => o.ChannelId == channelId).ToListAsync();
        var widgets = await _db.Widgets.Where(w => w.ChannelId == channelId).ToListAsync();
        var modules = await _db.ChannelModules.Where(m => m.ChannelId == channelId).ToListAsync();

        var payload = new
        {
            schemaVersion = CurrentSchemaVersion,
            exportedAt = DateTime.UtcNow,
            channelId,
            settings,
            actions,
            sounds,
            commands,
            goals,
            timers,
            overlays,
            widgets,
            modules
        };

        var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions
        {
            WriteIndented = true,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        });

        var fileName = $"tikfinity-backup-{DateTime.UtcNow:yyyyMMdd-HHmmss}.json";
        return File(System.Text.Encoding.UTF8.GetBytes(json), "application/json", fileName);
    }

    /// <summary>Replace all per-channel data with the contents of an exported backup.</summary>
    [HttpPost("import")]
    public async Task<IActionResult> Import([FromBody] JsonElement payload)
    {
        var channelId = GetChannelId();

        if (payload.TryGetProperty("schemaVersion", out var sv) && sv.GetInt32() > CurrentSchemaVersion)
        {
            return BadRequest(new { error = $"Schema version {sv.GetInt32()} chưa được hỗ trợ (max: {CurrentSchemaVersion})" });
        }

        await using var tx = await _db.Database.BeginTransactionAsync();
        try
        {
            // Wipe channel-scoped data
            _db.DynamicSettings.RemoveRange(_db.DynamicSettings.Where(x => x.ChannelId == channelId));
            _db.Actions.RemoveRange(_db.Actions.Where(x => x.ChannelId == channelId));
            _db.Sounds.RemoveRange(_db.Sounds.Where(x => x.ChannelId == channelId));
            _db.ChatCommands.RemoveRange(_db.ChatCommands.Where(x => x.ChannelId == channelId));
            _db.Goals.RemoveRange(_db.Goals.Where(x => x.ChannelId == channelId));
            _db.Timers.RemoveRange(_db.Timers.Where(x => x.ChannelId == channelId));
            _db.Overlays.RemoveRange(_db.Overlays.Where(x => x.ChannelId == channelId));
            _db.Widgets.RemoveRange(_db.Widgets.Where(x => x.ChannelId == channelId));
            _db.ChannelModules.RemoveRange(_db.ChannelModules.Where(x => x.ChannelId == channelId));
            await _db.SaveChangesAsync();

            int settingsCount = 0, actionsCount = 0, soundsCount = 0, commandsCount = 0;
            int goalsCount = 0, timersCount = 0, overlaysCount = 0, widgetsCount = 0, modulesCount = 0;

            if (payload.TryGetProperty("settings", out var settingsArr) && settingsArr.ValueKind == JsonValueKind.Array)
            {
                // Track (profileId, key) to dedupe — legacy exports could have
                // multiple rows with the same key across profiles but old
                // backups didn't include ProfileId, defaulting to 1 collides.
                var seen = new HashSet<(int profileId, string key)>();
                foreach (var s in settingsArr.EnumerateArray())
                {
                    var key = s.TryGetProperty("Key", out var kProp) ? kProp.GetString() :
                              s.TryGetProperty("key", out var kProp2) ? kProp2.GetString() : null;
                    var value = s.TryGetProperty("Value", out var vProp) ? vProp.GetString() :
                                s.TryGetProperty("value", out var vProp2) ? vProp2.GetString() : null;
                    var profileId = s.TryGetProperty("ProfileId", out var pProp) && pProp.TryGetInt32(out var p) ? p :
                                     s.TryGetProperty("profileId", out var pProp2) && pProp2.TryGetInt32(out var p2) ? p2 : 1;
                    if (profileId <= 0) profileId = 1;
                    if (string.IsNullOrEmpty(key)) continue;
                    if (!seen.Add((profileId, key))) continue; // skip duplicate
                    _db.DynamicSettings.Add(new DynamicSetting { ChannelId = channelId, ProfileId = profileId, Key = key, Value = value ?? "" });
                    settingsCount++;
                }
            }

            actionsCount = await ImportEntities<ActionItem>(payload, "actions", channelId);
            soundsCount = await ImportEntities<Sound>(payload, "sounds", channelId);
            commandsCount = await ImportEntities<ChatCommand>(payload, "commands", channelId);
            goalsCount = await ImportEntities<Goal>(payload, "goals", channelId);
            timersCount = await ImportEntities<TimerItem>(payload, "timers", channelId);
            overlaysCount = await ImportEntities<Overlay>(payload, "overlays", channelId);
            widgetsCount = await ImportEntities<Widget>(payload, "widgets", channelId);
            modulesCount = await ImportEntities<ChannelModule>(payload, "modules", channelId);

            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            return Ok(new
            {
                status = 200,
                imported = new
                {
                    settings = settingsCount,
                    actions = actionsCount,
                    sounds = soundsCount,
                    commands = commandsCount,
                    goals = goalsCount,
                    timers = timersCount,
                    overlays = overlaysCount,
                    widgets = widgetsCount,
                    modules = modulesCount
                }
            });
        }
        catch (Exception ex)
        {
            await tx.RollbackAsync();
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // Generic deserialize-and-attach for tables with the same shape (Channel-scoped, Id auto).
    private async Task<int> ImportEntities<T>(JsonElement root, string propName, int channelId) where T : class
    {
        if (!root.TryGetProperty(propName, out var arr) || arr.ValueKind != JsonValueKind.Array) return 0;

        int count = 0;
        var opts = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        foreach (var item in arr.EnumerateArray())
        {
            var entity = item.Deserialize<T>(opts);
            if (entity == null) continue;

            // Force channel scoping + reset Id so EF assigns fresh ones.
            var t = typeof(T);
            t.GetProperty("ChannelId")?.SetValue(entity, channelId);
            var idProp = t.GetProperty("Id");
            if (idProp != null && idProp.PropertyType == typeof(int))
            {
                idProp.SetValue(entity, 0);
            }

            _db.Set<T>().Add(entity);
            count++;
        }
        await _db.SaveChangesAsync();
        return count;
    }
}
