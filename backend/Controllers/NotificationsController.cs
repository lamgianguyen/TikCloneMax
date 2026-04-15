using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TikFinityBackend.Data;
using TikFinityBackend.Models;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api/notifications")]
[AllowAnonymous]
public class NotificationsController : BaseApiController
{
    private readonly AppDbContext _db;
    private const string DefaultAvatarUrl = "/favicon.ico";

    public NotificationsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("list")]
    [HttpPost("list")]
    public async Task<IActionResult> GetList()
    {
        var notifications = await _db.Notifications
            .Where(n => n.ChannelId == GetChannelId())
            .OrderByDescending(n => n.CreatedAt)
            .Take(50)
            .ToListAsync();

        return Ok(new
        {
            status = 200,
            message = "OK",
            notifications = notifications.Select(MapNotification).ToList()
        });
    }

    [HttpGet("preferences")]
    [HttpPost("preferences")]
    public IActionResult GetPreferences()
    {
        return Ok(new { status = 200, message = "OK", inApp = true });
    }

    [HttpPost("markRead")]
    public async Task<IActionResult> MarkRead([FromBody] IdDto dto)
    {
        var notif = await _db.Notifications.FirstOrDefaultAsync(n => n.Id == dto.Id && n.ChannelId == GetChannelId());
        if (notif != null)
        {
            notif.IsRead = true;
            notif.IsSeen = true;
            await _db.SaveChangesAsync();
        }
        return Ok(new { status = 200 });
    }

    private static object MapNotification(Notification notification)
    {
        var payload = ParsePayload(notification);

        return new
        {
            id = notification.Id,
            subject = notification.Subject,
            body = notification.Body,
            data = new
            {
                title = payload.Title,
                message = payload.Message,
                category = payload.Category,
                sender = payload.Sender,
                avatarUrl = payload.AvatarUrl
            },
            payload = new
            {
                title = payload.Title,
                category = payload.Category,
                message = payload.Message,
                sender = payload.Sender,
                avatarUrl = payload.AvatarUrl,
                primaryAction = new
                {
                    label = payload.PrimaryAction.Label,
                    url = payload.PrimaryAction.Url,
                    target = payload.PrimaryAction.Target
                },
                secondaryAction = new
                {
                    label = payload.SecondaryAction.Label,
                    url = payload.SecondaryAction.Url,
                    target = payload.SecondaryAction.Target
                },
                primaryTarget = payload.PrimaryTarget,
                secondaryTarget = payload.SecondaryTarget
            },
            primaryAction = new
            {
                label = payload.PrimaryAction.Label,
                url = payload.PrimaryAction.Url,
                target = payload.PrimaryAction.Target
            },
            secondaryAction = new
            {
                label = payload.SecondaryAction.Label,
                url = payload.SecondaryAction.Url,
                target = payload.SecondaryAction.Target
            },
            category = payload.Category,
            isRead = notification.IsRead,
            isSeen = notification.IsSeen,
            createdAt = notification.CreatedAt,
            transactionId = notification.TransactionId
        };
    }

    private static NotificationPayload ParsePayload(Notification notification)
    {
        var fallbackPrimary = new NotificationAction("hidden", "https://example.com/hidden", "_self");
        var fallbackSecondary = new NotificationAction("hidden", "https://example.com/hidden", "_self");
        var payload = new NotificationPayload(
            notification.Subject,
            string.IsNullOrWhiteSpace(notification.Category) ? "announcements" : notification.Category,
            notification.Body,
            string.IsNullOrWhiteSpace(notification.Subject) ? "TikFinity Team" : notification.Subject,
            DefaultAvatarUrl,
            fallbackPrimary,
            fallbackSecondary,
            fallbackPrimary.Target,
            fallbackSecondary.Target);

        if (string.IsNullOrWhiteSpace(notification.DataJson))
        {
            return payload;
        }

        try
        {
            using var doc = JsonDocument.Parse(notification.DataJson);
            var root = doc.RootElement;

            var primary = ParseAction(root, "primaryAction") ?? payload.PrimaryAction;
            var secondary = ParseAction(root, "secondaryAction") ?? payload.SecondaryAction;

            return payload with
            {
                Title = GetString(root, "title") ?? payload.Title,
                Category = GetString(root, "category") ?? payload.Category,
                Message = GetString(root, "message") ?? payload.Message,
                Sender = GetString(root, "sender") ?? payload.Sender,
                AvatarUrl = GetString(root, "avatarUrl") ?? payload.AvatarUrl,
                PrimaryAction = primary,
                SecondaryAction = secondary,
                PrimaryTarget = GetString(root, "primaryTarget") ?? primary.Target,
                SecondaryTarget = GetString(root, "secondaryTarget") ?? secondary.Target
            };
        }
        catch
        {
            return payload;
        }
    }

    private static NotificationAction? ParseAction(JsonElement root, string propertyName)
    {
        if (!root.TryGetProperty(propertyName, out var action) || action.ValueKind != JsonValueKind.Object)
        {
            return null;
        }

        return new NotificationAction(
            GetString(action, "label") ?? "hidden",
            GetString(action, "url") ?? "https://example.com/hidden",
            GetString(action, "target") ?? "_self");
    }

    private static string? GetString(JsonElement element, string propertyName)
    {
        return element.TryGetProperty(propertyName, out var value) && value.ValueKind == JsonValueKind.String
            ? value.GetString()
            : null;
    }

    private sealed record NotificationAction(string Label, string Url, string Target);
    private sealed record NotificationPayload(
        string Title,
        string Category,
        string Message,
        string Sender,
        string AvatarUrl,
        NotificationAction PrimaryAction,
        NotificationAction SecondaryAction,
        string PrimaryTarget,
        string SecondaryTarget);
}
