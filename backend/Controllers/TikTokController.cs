using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TikFinityBackend.Data;
using TikFinityBackend.Models;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api/tiktok")]
[AllowAnonymous]
public class TikTokController : BaseApiController
{
    private readonly TikTokBridgeService _bridge;
    private readonly SocketManager _socketManager;
    private readonly AppDbContext _db;
    private static readonly Lazy<string?> CachedGiftCatalogJson = new(LoadGiftCatalogJsonFromDisk, isThreadSafe: true);

    public TikTokController(IEnumerable<IHostedService> hostedServices, SocketManager socketManager, AppDbContext db)
    {
        _bridge = hostedServices.OfType<TikTokBridgeService>().First();
        _socketManager = socketManager;
        _db = db;
    }

    private static string? LoadGiftCatalogJsonFromDisk()
    {
        var rootPath = Directory.GetCurrentDirectory();
        var candidatePaths = new[]
        {
            Path.Combine(rootPath, "..", "downloads", "api", "getAllGifts"),
            Path.Combine(rootPath, "downloads", "api", "getAllGifts")
        };

        foreach (var path in candidatePaths)
        {
            if (!System.IO.File.Exists(path))
                continue;

            try
            {
                var json = System.IO.File.ReadAllText(path);
                using var _ = JsonDocument.Parse(json);
                return json;
            }
            catch (Exception ex) when (ex is IOException || ex is UnauthorizedAccessException || ex is JsonException)
            {
                Console.WriteLine($"[TikTok] Failed to load cached gift catalog from {path}: {ex.Message}");
            }
        }

        return null;
    }

    /// <summary>
    /// POST /api/tiktok/connect - Connect to a TikTok LIVE stream
    /// </summary>
    [HttpPost("connect")]
    public async Task<IActionResult> Connect([FromBody] TikTokConnectDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username))
            return BadRequest(new { status = "error", message = "Username is required" });

        var username = dto.Username.Trim().TrimStart('@');

        // Fast-path dedupe to reduce noisy repeat /connect calls from frontend loops.
        // TikTokBridgeService.ConnectToTikTok still does authoritative debouncing,
        // so this block is only an optimization layer.
        var currentBridgeUser = (_bridge.CurrentUsername ?? string.Empty).Trim().TrimStart('@');
        if (!string.IsNullOrWhiteSpace(currentBridgeUser)
            && string.Equals(currentBridgeUser, username, StringComparison.OrdinalIgnoreCase))
        {
            if (_bridge.IsConnectedToTikTok)
            {
                return Ok(new { status = "ok", username, tiktokUsername = username, message = $"Already connected to @{username}." });
            }

            if (_bridge.IsConnecting)
            {
                return Ok(new { status = "ok", username, tiktokUsername = username, message = $"Already connecting to @{username}." });
            }
        }

        // Save TikTok name to DB (non-blocking — don't fail connect if DB errors)
        try
        {
            var channelId = GetChannelId();
            if (channelId > 0)
            {
                var existing = await _db.DynamicSettings
                    .FirstOrDefaultAsync(d => d.ChannelId == channelId && d.Key == "setting_tiktokname");
                if (existing == null)
                {
                    _db.DynamicSettings.Add(new DynamicSetting
                    {
                        ChannelId = channelId,
                        Key = "setting_tiktokname",
                        Value = username
                    });
                }
                else
                {
                    existing.Value = username;
                }
                await _db.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            // Don't block connect if DB save fails
            Console.WriteLine($"[TikTok] DB save warning: {ex.Message}");
        }

        await _bridge.ConnectToTikTok(username);

        return Ok(new { status = "ok", username, tiktokUsername = username, message = $"Connecting to @{username}..." });
    }

    /// <summary>
    /// POST /api/tiktok/disconnect - Disconnect from current TikTok LIVE stream
    /// </summary>
    [HttpPost("disconnect")]
    public async Task<IActionResult> Disconnect()
    {
        await _bridge.DisconnectFromTikTok();
        return Ok(new { status = "ok", message = "Disconnected" });
    }

    /// <summary>
    /// GET /api/tiktok/status - Get current TikTok connection status
    /// </summary>
    [HttpGet("status")]
    public IActionResult GetStatus()
    {
        return Ok(new
        {
            status = "ok",
            connected = _bridge.IsConnectedToTikTok,
            connecting = _bridge.IsConnecting,
            username = _bridge.CurrentUsername,
            failedUsername = _bridge.LastFailedUsername,
            lastError = _bridge.LastConnectionError,
            lastErrorAt = _bridge.LastErrorAtUnixMs,
            clients = _socketManager.ConnectionCount
        });
    }

    /// <summary>
    /// Static TikTok gift catalog used by the bundle's wheel-of-actions
    /// trigger picker, gift counter setup, etc. The cloud Tikfinity used to
    /// inject this list at runtime; we mirror the most popular gifts so the
    /// settings UI can render the gift selector. IDs match TikTok's webcast
    /// gift IDs so backend trigger matching against incoming `gift.giftId`
    /// works without translation.
    /// </summary>
    [HttpGet("gifts")]
    public IActionResult GetGiftCatalog()
    {
        var cachedGiftCatalogJson = CachedGiftCatalogJson.Value;
        if (!string.IsNullOrWhiteSpace(cachedGiftCatalogJson))
            return Content(cachedGiftCatalogJson, "application/json");

        var gifts = new[]
        {
            new { id = 5655, name = "Rose", diamondCount = 1, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.png" },
            new { id = 5269, name = "Hand Hearts", diamondCount = 100, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/6cd022271dc4669d182cad856384870f~tplv-obj.png" },
            new { id = 6855, name = "TikTok", diamondCount = 1, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/2fa794a99919386b85402d9a0a991b2b~tplv-obj.png" },
            new { id = 8913, name = "Pink Heart", diamondCount = 5, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/2fa794a99919386b85402d9a0a991b2c~tplv-obj.png" },
            new { id = 5487, name = "Finger Heart", diamondCount = 5, image = "https://p19-webcast.tiktokcdn.com/img/alisg/webcast-sg/resource/finger-heart.png" },
            new { id = 7934, name = "Heart Me", diamondCount = 1, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/heart-me.png" },
            new { id = 7062, name = "GG", diamondCount = 1, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/gg.png" },
            new { id = 7934, name = "Mic", diamondCount = 5, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/mic.png" },
            new { id = 9947, name = "Doughnut", diamondCount = 30, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/doughnut.png" },
            new { id = 5827, name = "Ice Cream Cone", diamondCount = 1, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/ice-cream.png" },
            new { id = 6242, name = "Perfume", diamondCount = 20, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/perfume.png" },
            new { id = 6431, name = "Confetti", diamondCount = 100, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/confetti.png" },
            new { id = 16690, name = "Siêu nổi tiếng", diamondCount = 1000, image = "https://p16-webcast.tiktokcdn.com/img/alisg/webcast-sg/resource/2fa794a99919386b85402d9a0a991b2b.png~tplv-obj.webp" },
            new { id = 8554, name = "Rosa", diamondCount = 10, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/rosa.png" },
            new { id = 9947, name = "Galaxy", diamondCount = 1000, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/galaxy.png" },
            new { id = 11022, name = "Mascara", diamondCount = 1, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/mascara.png" },
            new { id = 12435, name = "Lion", diamondCount = 29999, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/lion.png" },
            new { id = 12433, name = "Universe", diamondCount = 44999, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/universe.png" },
            new { id = 5644, name = "Like", diamondCount = 1, image = "https://p19-webcast.tiktokcdn.com/img/maliva/webcast-va/like.png" }
        };
        return Ok(gifts);
    }

    /// <summary>
    /// Fire a fake chat event so users can verify the widget pipeline
    /// (socket broadcast → widget render) without waiting for a real chat.
    /// </summary>
    [HttpPost("debug/emit")]
    public async Task<IActionResult> DebugEmit([FromQuery] string type = "chat", [FromQuery] string text = "Test message")
    {
        object payload = type switch
        {
            "chat" => new
            {
                uniqueId = "tester",
                nickname = "Test User",
                userId = "0",
                profilePictureUrl = "",
                comment = text,
                isModerator = false,
                isSubscriber = false,
                followRole = 0,
                userBadges = Array.Empty<object>()
            },
            "like" => new { uniqueId = "tester", nickname = "Test User", userId = "0", profilePictureUrl = "", likeCount = 1, totalLikeCount = 1 },
            "follow" => new { uniqueId = "tester", nickname = "Test User", userId = "0", profilePictureUrl = "" },
            "gift" => new { uniqueId = "tester", nickname = "Test User", userId = "0", profilePictureUrl = "", giftId = 5655, giftName = "Rose", giftPictureUrl = "", diamondCount = 1, repeatCount = 1, repeatEnd = true, giftType = 1, describe = "Rose" },
            _ => new { uniqueId = "tester", nickname = "Test User", text }
        };
        await _socketManager.BroadcastEvent(type, payload);
        return Ok(new { status = "ok", emitted = type, clients = _socketManager.ConnectionCount });
    }
}

public record TikTokConnectDto(string? Username);
