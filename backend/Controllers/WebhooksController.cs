using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

/// <summary>
/// CRUD for outbound webhooks (Discord, custom URL, etc.). On save, the
/// in-memory cache in <see cref="WebhookService"/> is refreshed so the change
/// takes effect without restarting the bridge.
/// </summary>
[ApiController]
[Route("api/webhooks")]
[AllowAnonymous]
public sealed class WebhooksController : BaseApiController
{
    private readonly AppDbContext _db;
    private readonly WebhookService _webhooks;

    public WebhooksController(AppDbContext db, WebhookService webhooks)
    {
        _db = db;
        _webhooks = webhooks;
    }

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var hooks = await _db.Webhooks
            .Where(w => w.ChannelId == GetChannelId())
            .OrderByDescending(w => w.Id)
            .ToListAsync();

        return Ok(new
        {
            status = 200,
            webhooks = hooks.Select(MapHook).ToList()
        });
    }

    [HttpPost]
    public async Task<IActionResult> Save([FromBody] WebhookDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Url)) return BadRequest(new { error = "url required" });
        if (!Uri.TryCreate(dto.Url, UriKind.Absolute, out var uri) || (uri.Scheme != "http" && uri.Scheme != "https"))
            return BadRequest(new { error = "url phải là http(s)" });

        var channelId = GetChannelId();
        Webhook hook;

        if (dto.Id > 0)
        {
            hook = await _db.Webhooks.FirstOrDefaultAsync(w => w.Id == dto.Id && w.ChannelId == channelId)
                   ?? throw new InvalidOperationException($"Webhook {dto.Id} not found");
            hook.Name = dto.Name ?? hook.Name;
            hook.Url = dto.Url;
            hook.Method = string.IsNullOrWhiteSpace(dto.Method) ? "POST" : dto.Method.ToUpperInvariant();
            hook.EventTypesCsv = dto.EventTypesCsv ?? "gift,follow,share,subscribe";
            hook.HeadersJson = dto.HeadersJson;
            hook.TemplateJson = dto.TemplateJson;
            hook.Enabled = dto.Enabled;
            hook.RetryCount = Math.Max(0, dto.RetryCount);
            hook.TimeoutSeconds = Math.Max(2, dto.TimeoutSeconds);
        }
        else
        {
            hook = new Webhook
            {
                ChannelId = channelId,
                Name = dto.Name ?? "",
                Url = dto.Url,
                Method = string.IsNullOrWhiteSpace(dto.Method) ? "POST" : dto.Method.ToUpperInvariant(),
                EventTypesCsv = dto.EventTypesCsv ?? "gift,follow,share,subscribe",
                HeadersJson = dto.HeadersJson,
                TemplateJson = dto.TemplateJson,
                Enabled = dto.Enabled,
                RetryCount = Math.Max(0, dto.RetryCount),
                TimeoutSeconds = Math.Max(2, dto.TimeoutSeconds)
            };
            _db.Webhooks.Add(hook);
        }

        await _db.SaveChangesAsync();
        await _webhooks.RefreshAsync(channelId);
        return Ok(new { status = 200, id = hook.Id });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var channelId = GetChannelId();
        var hook = await _db.Webhooks.FirstOrDefaultAsync(w => w.Id == id && w.ChannelId == channelId);
        if (hook != null)
        {
            _db.Webhooks.Remove(hook);
            await _db.SaveChangesAsync();
            await _webhooks.RefreshAsync(channelId);
        }
        return Ok(new { status = 200 });
    }

    /// <summary>Send a synthetic event so the user can verify Discord embed / custom URL.</summary>
    [HttpPost("test/{id}")]
    public async Task<IActionResult> Test(int id)
    {
        var channelId = GetChannelId();
        var hook = await _db.Webhooks.FirstOrDefaultAsync(w => w.Id == id && w.ChannelId == channelId);
        if (hook == null) return NotFound(new { status = 404 });

        var samplePayload = JsonSerializer.SerializeToElement(new
        {
            uniqueId = "tikfinity_test",
            nickname = "TikFinity Test",
            profilePictureUrl = "https://tikfinity.zerody.one/favicon.ico",
            giftName = "Rose",
            diamondCount = 5,
            repeatCount = 1,
            comment = "Đây là tin nhắn test webhook"
        });

        // Refresh first so the test actually uses the on-disk record (not stale cache).
        await _webhooks.RefreshAsync(channelId);
        await _webhooks.DispatchAsync("gift", samplePayload);
        return Ok(new { status = 200, sent = true });
    }

    private static object MapHook(Webhook h) => new
    {
        id = h.Id,
        channelId = h.ChannelId,
        name = h.Name,
        url = h.Url,
        method = h.Method,
        eventTypes = h.EventTypesCsv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
        headersJson = h.HeadersJson,
        templateJson = h.TemplateJson,
        enabled = h.Enabled,
        retryCount = h.RetryCount,
        timeoutSeconds = h.TimeoutSeconds,
        isDiscord = h.Url.StartsWith("https://discord.com/api/webhooks/", StringComparison.OrdinalIgnoreCase) ||
                    h.Url.StartsWith("https://discordapp.com/api/webhooks/", StringComparison.OrdinalIgnoreCase),
        createdAt = h.CreatedAt
    };
}

public sealed record WebhookDto(
    int Id,
    string? Name,
    string Url,
    string? Method,
    string? EventTypesCsv,
    string? HeadersJson,
    string? TemplateJson,
    bool Enabled = true,
    int RetryCount = 2,
    int TimeoutSeconds = 10);
