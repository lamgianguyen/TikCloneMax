using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api/rest")]
[AllowAnonymous]
public class ActionsController : BaseApiController
{
    private readonly AppDbContext _db;

    public ActionsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("action")]
    public async Task<IActionResult> GetActions()
    {
        var actions = await _db.Actions
            .Where(a => a.ChannelId == GetChannelId())
            .OrderBy(a => a.Sort)
            .ThenByDescending(a => a.Id)
            .ToListAsync();

        return Ok(new
        {
            status = 200,
            message = "OK",
            arrayKey = "actions",
            actions = actions.Select(MapAction).ToList(),
            pageSize = Math.Max(actions.Count, 1),
            page = 0,
            orderType = "DESC",
            orderColumn = "id",
            hasNext = false
        });
    }

    [HttpPost("action")]
    public async Task<IActionResult> SaveAction([FromBody] ActionDto dto)
    {
        var channelId = GetChannelId();

        if (dto.Id > 0)
        {
            var existing = await _db.Actions.FirstOrDefaultAsync(a => a.Id == dto.Id && a.ChannelId == channelId);
            if (existing == null) return NotFound(new { status = 404 });
            existing.Name = dto.Name;
            existing.Type = dto.Type;
            existing.TriggerValue = dto.TriggerValue;
            existing.ConfigJson = string.IsNullOrWhiteSpace(dto.ConfigJson) ? existing.ConfigJson : dto.ConfigJson;
            existing.Enabled = dto.Enabled;
            existing.Sort = dto.Sort;
            await _db.SaveChangesAsync();
            return Ok(new { status = 200, id = existing.Id });
        }

        var action = new ActionItem
        {
            ChannelId = channelId,
            Name = dto.Name,
            Type = dto.Type,
            TriggerValue = dto.TriggerValue,
            ConfigJson = string.IsNullOrWhiteSpace(dto.ConfigJson) ? "{}" : dto.ConfigJson,
            Enabled = dto.Enabled,
            Sort = dto.Sort
        };
        _db.Actions.Add(action);
        await _db.SaveChangesAsync();
        return Ok(new { status = 200, id = action.Id });
    }

    [HttpDelete("action/{id}")]
    public async Task<IActionResult> DeleteAction(int id)
    {
        var action = await _db.Actions.FirstOrDefaultAsync(a => a.Id == id && a.ChannelId == GetChannelId());
        if (action != null)
        {
            _db.Actions.Remove(action);
            await _db.SaveChangesAsync();
        }
        return Ok(new { status = 200 });
    }

    private static object MapAction(ActionItem action)
    {
        var config = ParseObject(action.ConfigJson);
        var dynamicConfig = BuildDynamicConfig(config);
        var createdAt = GetDateTime(config, "createdAt") ?? action.CreatedAt;
        var updatedAt = GetDateTime(config, "updatedAt") ?? action.CreatedAt;

        return new
        {
            id = action.Id,
            channelId = action.ChannelId,
            profileId = GetInt(config, "profileId") ?? 1,
            name = string.IsNullOrWhiteSpace(action.Name) ? $"Action {action.Id}" : action.Name,
            type = action.Type,
            triggerValue = action.TriggerValue,
            screenId = GetInt(config, "screenId") ?? 1,
            duration = GetInt(config, "duration") ?? 5,
            amountToAdd = GetDouble(config, "amountToAdd") ?? 0d,
            imageUrl = GetString(config, "imageUrl"),
            audioUrl = GetString(config, "audioUrl"),
            videoUrl = GetString(config, "videoUrl"),
            animationUrl = GetString(config, "animationUrl"),
            webhookUrl = GetString(config, "webhookUrl"),
            text = GetString(config, "text"),
            textToSpeech = GetString(config, "textToSpeech"),
            message = GetString(config, "message"),
            obsSceneId = CloneNode(config["obsSceneId"]),
            obsSourceId = CloneNode(config["obsSourceId"]),
            snapCamEffectId = CloneNode(config["snapCamEffectId"]),
            mcCmd = GetString(config, "mcCmd"),
            keystrokes = GetString(config, "keystrokes"),
            thirdPartyAction = CloneNode(config["thirdPartyAction"]),
            customGoalConfig = CloneNode(config["customGoalConfig"]),
            voicemodVoiceConfig = CloneNode(config["voicemodVoiceConfig"]),
            streamerbotActionId = CloneNode(config["streamerbotActionId"]),
            timerSeconds = GetInt(config, "timerSeconds"),
            enableFadeEffect = GetBool(config, "enableFadeEffect", true),
            dynamicConfig,
            isDeleted = GetBool(config, "isDeleted", false),
            createdAt,
            updatedAt,
            configJson = string.IsNullOrWhiteSpace(action.ConfigJson) ? "{}" : action.ConfigJson,
            enabled = action.Enabled,
            sort = action.Sort
        };
    }

    private static JsonObject BuildDynamicConfig(JsonObject config)
    {
        var dynamicConfig = CloneObject(config["dynamicConfig"]);

        SetIfMissing(dynamicConfig, "enableStreaks", GetBool(dynamicConfig, "enableStreaks", GetBool(config, "enableStreaks", false)));
        SetIfMissing(dynamicConfig, "skipOnNext", GetBool(dynamicConfig, "skipOnNext", GetBool(config, "skipOnNext", false)));
        SetIfMissing(dynamicConfig, "mediaSoundVolume", GetInt(dynamicConfig, "mediaSoundVolume") ?? GetInt(config, "mediaSoundVolume") ?? 100);
        SetIfMissing(dynamicConfig, "cooldown", GetInt(dynamicConfig, "cooldown") ?? GetInt(config, "cooldown") ?? 0);
        SetIfMissing(dynamicConfig, "userCooldown", GetInt(dynamicConfig, "userCooldown") ?? GetInt(config, "userCooldown") ?? 0);
        SetIfMissing(dynamicConfig, "isImported", GetBool(dynamicConfig, "isImported", true));
        SetIfMissing(dynamicConfig, "ttsVoice", GetString(dynamicConfig, "ttsVoice") ?? GetString(config, "ttsVoice") ?? "default");

        SetIfMissing(dynamicConfig, "animationUrlOriginalFilename", GetString(dynamicConfig, "animationUrlOriginalFilename") ?? ExtractOriginalName(GetString(config, "animationUrl"), "gift_"));
        SetIfMissing(dynamicConfig, "audioUrlOriginalFilename", GetString(dynamicConfig, "audioUrlOriginalFilename") ?? ExtractOriginalName(GetString(config, "audioUrl")));
        SetIfMissing(dynamicConfig, "imageUrlOriginalFilename", GetString(dynamicConfig, "imageUrlOriginalFilename") ?? ExtractOriginalName(GetString(config, "imageUrl")));
        SetIfMissing(dynamicConfig, "videoUrlOriginalFilename", GetString(dynamicConfig, "videoUrlOriginalFilename") ?? ExtractOriginalName(GetString(config, "videoUrl")));

        return dynamicConfig;
    }

    private static JsonObject ParseObject(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return new JsonObject();
        }

        try
        {
            return JsonNode.Parse(json) as JsonObject ?? new JsonObject();
        }
        catch
        {
            return new JsonObject();
        }
    }

    private static JsonObject CloneObject(JsonNode? node) => node?.DeepClone() as JsonObject ?? new JsonObject();

    private static JsonNode? CloneNode(JsonNode? node) => node?.DeepClone();

    private static string? GetString(JsonObject obj, string propertyName)
    {
        if (!obj.TryGetPropertyValue(propertyName, out var node) || node is null)
        {
            return null;
        }

        if (node is JsonValue value)
        {
            if (value.TryGetValue<string>(out var stringValue))
            {
                return string.IsNullOrWhiteSpace(stringValue) ? null : stringValue;
            }

            return node.ToJsonString().Trim('"');
        }

        return node.ToJsonString();
    }

    private static bool GetBool(JsonObject obj, string propertyName, bool fallbackValue)
    {
        if (!obj.TryGetPropertyValue(propertyName, out var node) || node is not JsonValue value)
        {
            return fallbackValue;
        }

        if (value.TryGetValue<bool>(out var boolValue))
        {
            return boolValue;
        }

        if (value.TryGetValue<int>(out var intValue))
        {
            return intValue != 0;
        }

        if (value.TryGetValue<double>(out var doubleValue))
        {
            return Math.Abs(doubleValue) > double.Epsilon;
        }

        if (value.TryGetValue<string>(out var stringValue))
        {
            if (bool.TryParse(stringValue, out var parsedBool))
            {
                return parsedBool;
            }

            if (int.TryParse(stringValue, out var parsedInt))
            {
                return parsedInt != 0;
            }
        }

        return fallbackValue;
    }

    private static int? GetInt(JsonObject obj, string propertyName)
    {
        if (!obj.TryGetPropertyValue(propertyName, out var node) || node is not JsonValue value)
        {
            return null;
        }

        if (value.TryGetValue<int>(out var intValue))
        {
            return intValue;
        }

        if (value.TryGetValue<long>(out var longValue))
        {
            return (int)longValue;
        }

        if (value.TryGetValue<double>(out var doubleValue))
        {
            return (int)doubleValue;
        }

        if (value.TryGetValue<string>(out var stringValue) && int.TryParse(stringValue, out var parsedInt))
        {
            return parsedInt;
        }

        return null;
    }

    private static double? GetDouble(JsonObject obj, string propertyName)
    {
        if (!obj.TryGetPropertyValue(propertyName, out var node) || node is not JsonValue value)
        {
            return null;
        }

        if (value.TryGetValue<double>(out var doubleValue))
        {
            return doubleValue;
        }

        if (value.TryGetValue<int>(out var intValue))
        {
            return intValue;
        }

        if (value.TryGetValue<string>(out var stringValue) && double.TryParse(stringValue, out var parsedDouble))
        {
            return parsedDouble;
        }

        return null;
    }

    private static DateTime? GetDateTime(JsonObject obj, string propertyName)
    {
        if (!obj.TryGetPropertyValue(propertyName, out var node) || node is not JsonValue value)
        {
            return null;
        }

        if (value.TryGetValue<DateTime>(out var dateValue))
        {
            return dateValue;
        }

        if (value.TryGetValue<string>(out var stringValue) && DateTime.TryParse(stringValue, out var parsedDate))
        {
            return parsedDate;
        }

        return null;
    }

    private static void SetIfMissing(JsonObject obj, string propertyName, string? value)
    {
        if (!obj.ContainsKey(propertyName) && !string.IsNullOrWhiteSpace(value))
        {
            obj[propertyName] = value;
        }
    }

    private static void SetIfMissing(JsonObject obj, string propertyName, int value)
    {
        if (!obj.ContainsKey(propertyName))
        {
            obj[propertyName] = value;
        }
    }

    private static void SetIfMissing(JsonObject obj, string propertyName, bool value)
    {
        if (!obj.ContainsKey(propertyName))
        {
            obj[propertyName] = value;
        }
    }

    private static string? ExtractOriginalName(string? url, string marker = "")
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            return null;
        }

        try
        {
            var cleanUrl = url.Split('?', '#')[0];
            var fileName = Path.GetFileNameWithoutExtension(cleanUrl);
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return null;
            }

            if (!string.IsNullOrWhiteSpace(marker))
            {
                var markerIndex = fileName.IndexOf(marker, StringComparison.OrdinalIgnoreCase);
                if (markerIndex >= 0)
                {
                    fileName = fileName[(markerIndex + marker.Length)..];
                }
            }

            fileName = fileName
                .Replace("_full_lottie", "", StringComparison.OrdinalIgnoreCase)
                .Replace('-', ' ')
                .Replace('_', ' ')
                .Trim();

            return string.IsNullOrWhiteSpace(fileName) ? null : fileName;
        }
        catch
        {
            return null;
        }
    }
}

public record ActionDto(int Id, string Name, string Type, string? TriggerValue, string? ConfigJson, bool Enabled = true, int Sort = 0);
