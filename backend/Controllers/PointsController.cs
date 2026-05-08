using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

/// <summary>
/// Read-only endpoints for the channel-points economy + admin overrides.
/// Configuration values live in DynamicSetting (key prefix "points.") so they
/// are edited via the existing /api/updateSettings flow.
/// </summary>
[ApiController]
[Route("api/points")]
[AllowAnonymous]
public sealed class PointsController : BaseApiController
{
    private readonly AppDbContext _db;
    private readonly PointsService _points;

    public PointsController(AppDbContext db, PointsService points)
    {
        _db = db;
        _points = points;
    }

    /// <summary>List all per-user balances. Sorted descending.</summary>
    [HttpGet("leaderboard")]
    public async Task<IActionResult> Leaderboard([FromQuery] int limit = 50)
    {
        var channelId = GetChannelId();
        var rows = await _db.DynamicSettings
            .Where(s => s.ChannelId == channelId && s.Key.StartsWith("points_user_"))
            .Select(s => new { s.Key, s.Value })
            .ToListAsync();

        var entries = rows
            .Select(r => new
            {
                username = r.Key.StartsWith("points_user_") ? r.Key["points_user_".Length..] : r.Key,
                balance = double.TryParse(r.Value, System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out var v) ? v : 0
            })
            .Where(x => x.balance > 0)
            .OrderByDescending(x => x.balance)
            .Take(Math.Clamp(limit, 1, 500))
            .ToList();

        return Ok(new { status = 200, total = entries.Count, leaderboard = entries });
    }

    /// <summary>Balance for a single user.</summary>
    [HttpGet("user/{username}")]
    public async Task<IActionResult> Get(string username)
    {
        var balance = await _points.GetBalanceAsync(GetChannelId(), username);
        return Ok(new { status = 200, username, balance });
    }

    /// <summary>Admin override — set a user's balance to an absolute value.</summary>
    [HttpPost("user/{username}")]
    public async Task<IActionResult> Set(string username, [FromBody] SetPointsDto dto)
    {
        await _points.SetBalanceAsync(GetChannelId(), username, dto.Balance);
        return Ok(new { status = 200, username, balance = dto.Balance });
    }
}

public sealed record SetPointsDto(double Balance);
