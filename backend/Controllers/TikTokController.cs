using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

    public TikTokController(IEnumerable<IHostedService> hostedServices, SocketManager socketManager, AppDbContext db)
    {
        _bridge = hostedServices.OfType<TikTokBridgeService>().First();
        _socketManager = socketManager;
        _db = db;
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
            lastError = _bridge.LastConnectionError,
            clients = _socketManager.ConnectionCount
        });
    }
}

public record TikTokConnectDto(string? Username);
