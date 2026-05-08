using System.Collections.Concurrent;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;

namespace TikFinityBackend.Services;

/// <summary>
/// Fires registered Webhook records when the bridge emits matching events.
/// Discord webhook URLs are auto-detected and rendered with a richer embed.
/// All sends are fire-and-retry — no event handler is ever blocked waiting on
/// a slow webhook.
/// </summary>
public sealed class WebhookService
{
    private readonly ILogger<WebhookService> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly HttpClient _http;

    private List<WebhookConfig> _hooks = new();
    private bool _loaded;

    private sealed record WebhookConfig(
        int Id,
        string Name,
        string Url,
        string Method,
        HashSet<string> EventTypes,
        Dictionary<string, string>? Headers,
        string? TemplateJson,
        int RetryCount,
        int TimeoutSeconds);

    public WebhookService(
        ILogger<WebhookService> logger,
        IServiceProvider serviceProvider,
        IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        _http = httpClientFactory.CreateClient("webhooks");
    }

    public async Task RefreshAsync(int channelId)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var hooks = await db.Webhooks
            .Where(w => w.ChannelId == channelId && w.Enabled)
            .ToListAsync();

        _hooks = hooks.Select(h => new WebhookConfig(
            h.Id,
            h.Name,
            h.Url,
            string.IsNullOrWhiteSpace(h.Method) ? "POST" : h.Method.ToUpperInvariant(),
            new HashSet<string>(h.EventTypesCsv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
                                StringComparer.OrdinalIgnoreCase),
            ParseHeaders(h.HeadersJson),
            h.TemplateJson,
            Math.Max(0, h.RetryCount),
            Math.Max(2, h.TimeoutSeconds))).ToList();
        _loaded = true;
        _logger.LogInformation("[Webhooks] Loaded {Count} hooks for channel {ChannelId}", _hooks.Count, channelId);
    }

    /// <summary>Fire all hooks subscribed to <paramref name="eventType"/>.</summary>
    public async Task DispatchAsync(string eventType, JsonElement payload)
    {
        if (!_loaded) await EnsureLoadedAsync();
        if (_hooks.Count == 0) return;

        foreach (var hook in _hooks)
        {
            if (!hook.EventTypes.Contains(eventType) && !hook.EventTypes.Contains("*")) continue;
            // Fire-and-forget — wrap in Task so a slow hook doesn't block the bridge loop.
            _ = SendWithRetryAsync(hook, eventType, payload);
        }
    }

    private async Task SendWithRetryAsync(WebhookConfig hook, string eventType, JsonElement payload)
    {
        for (var attempt = 0; attempt <= hook.RetryCount; attempt++)
        {
            try
            {
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(hook.TimeoutSeconds));
                var body = BuildBody(hook, eventType, payload);
                using var req = new HttpRequestMessage(new HttpMethod(hook.Method), hook.Url);
                req.Content = new StringContent(body, Encoding.UTF8, "application/json");
                if (hook.Headers != null)
                {
                    foreach (var (k, v) in hook.Headers)
                    {
                        req.Headers.TryAddWithoutValidation(k, v);
                    }
                }
                using var res = await _http.SendAsync(req, cts.Token);
                if (res.IsSuccessStatusCode || (int)res.StatusCode == 429 == false && (int)res.StatusCode < 500)
                {
                    return; // success or non-retryable client error
                }
                _logger.LogWarning("[Webhook {HookId}] HTTP {Status} for event {Event}, attempt {Attempt}/{Max}",
                    hook.Id, (int)res.StatusCode, eventType, attempt + 1, hook.RetryCount + 1);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "[Webhook {HookId}] send failed (attempt {Attempt}/{Max})",
                    hook.Id, attempt + 1, hook.RetryCount + 1);
            }
            // Exponential backoff before retry
            if (attempt < hook.RetryCount)
            {
                await Task.Delay(TimeSpan.FromMilliseconds(500 * Math.Pow(2, attempt)));
            }
        }
    }

    private static string BuildBody(WebhookConfig hook, string eventType, JsonElement payload)
    {
        // Discord webhooks: render a friendly embed instead of dumping the raw payload.
        if (IsDiscordUrl(hook.Url))
        {
            return BuildDiscordPayload(eventType, payload);
        }

        // Custom template support: substitute {event}, {data.field} placeholders.
        if (!string.IsNullOrWhiteSpace(hook.TemplateJson))
        {
            return RenderTemplate(hook.TemplateJson!, eventType, payload);
        }

        // Default envelope
        var envelope = new
        {
            @event = eventType,
            timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
            data = JsonSerializer.Deserialize<JsonElement>(payload.GetRawText())
        };
        return JsonSerializer.Serialize(envelope);
    }

    private static bool IsDiscordUrl(string url) =>
        url.StartsWith("https://discord.com/api/webhooks/", StringComparison.OrdinalIgnoreCase) ||
        url.StartsWith("https://discordapp.com/api/webhooks/", StringComparison.OrdinalIgnoreCase) ||
        url.StartsWith("https://canary.discord.com/api/webhooks/", StringComparison.OrdinalIgnoreCase);

    private static string BuildDiscordPayload(string eventType, JsonElement payload)
    {
        // Try to extract common TikTok event fields for a readable embed.
        string? username = TryGetString(payload, "uniqueId") ?? TryGetString(payload, "username");
        string? nickname = TryGetString(payload, "nickname") ?? username;
        string? avatar = TryGetString(payload, "profilePictureUrl");
        string? giftName = TryGetString(payload, "giftName");
        int? diamonds = TryGetInt(payload, "diamondCount");
        int? repeat = TryGetInt(payload, "repeatCount");

        var title = eventType switch
        {
            "gift" => $"🎁 {nickname ?? "Ai đó"} tặng {giftName ?? "quà"}{(repeat is > 1 ? $" ×{repeat}" : "")}",
            "follow" => $"➕ {nickname ?? "Ai đó"} đã follow",
            "share" => $"🔁 {nickname ?? "Ai đó"} đã share",
            "subscribe" => $"⭐ {nickname ?? "Ai đó"} đã subscribe",
            "like" => $"❤️ {nickname ?? "Ai đó"} đã thả tim",
            "chat" => $"💬 {nickname ?? "Ai đó"} đã chat",
            _ => $"📣 Event: {eventType}"
        };

        var description = TryGetString(payload, "comment") ?? "";
        var color = eventType switch
        {
            "gift" => 0xFFD700,
            "follow" => 0x2ECC71,
            "subscribe" => 0xE67E22,
            "share" => 0x3498DB,
            "like" => 0xE91E63,
            _ => 0x95A5A6
        };

        var embed = new Dictionary<string, object?>
        {
            ["title"] = title,
            ["description"] = description,
            ["color"] = color,
            ["timestamp"] = DateTimeOffset.UtcNow.ToString("o"),
            ["thumbnail"] = avatar != null ? new { url = avatar } : null
        };
        if (diamonds.HasValue && diamonds > 0)
        {
            embed["fields"] = new[]
            {
                new { name = "Diamonds", value = diamonds.Value.ToString(), inline = true }
            };
        }

        var payloadObj = new
        {
            username = "TikFinity",
            embeds = new[] { embed }
        };
        return JsonSerializer.Serialize(payloadObj, new JsonSerializerOptions
        {
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        });
    }

    private static string RenderTemplate(string template, string eventType, JsonElement payload)
    {
        var sb = new StringBuilder(template);
        sb.Replace("{event}", eventType);
        // Naive {data.field} substitution
        foreach (var prop in payload.EnumerateObject())
        {
            sb.Replace("{data." + prop.Name + "}", prop.Value.ToString());
        }
        return sb.ToString();
    }

    private static Dictionary<string, string>? ParseHeaders(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;
        try { return JsonSerializer.Deserialize<Dictionary<string, string>>(json); }
        catch { return null; }
    }

    private static string? TryGetString(JsonElement el, string prop) =>
        el.ValueKind == JsonValueKind.Object && el.TryGetProperty(prop, out var v) && v.ValueKind == JsonValueKind.String
            ? v.GetString()
            : null;

    private static int? TryGetInt(JsonElement el, string prop) =>
        el.ValueKind == JsonValueKind.Object && el.TryGetProperty(prop, out var v) && v.ValueKind == JsonValueKind.Number && v.TryGetInt32(out var n)
            ? n
            : (int?)null;

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
            _logger.LogWarning(ex, "[Webhooks] initial load failed");
            _loaded = true;
        }
    }
}
