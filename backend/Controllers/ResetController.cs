using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

/// <summary>
/// Reset endpoints for points, in-memory aggregates, goal counters, and
/// chat command cooldowns. Each reset broadcasts the cleared state via
/// Socket.IO so widgets immediately reflect the change.
/// </summary>
[ApiController]
[Route("api/reset")]
[AllowAnonymous]
public sealed class ResetController : BaseApiController
{
    private readonly AppDbContext _db;
    private readonly TikTokBridgeService _bridge;

    public ResetController(AppDbContext db, IEnumerable<IHostedService> hostedServices)
    {
        _db = db;
        _bridge = hostedServices.OfType<TikTokBridgeService>().First();
    }

    /// <summary>Reset stream session aggregates (top gifters/likers/ranking/counters).</summary>
    [HttpPost("aggregates")]
    public async Task<IActionResult> ResetAggregates()
    {
        await _bridge.ResetAggregates();
        return Ok(new { status = 200, reset = "aggregates" });
    }

    /// <summary>Reset all per-user point balances stored as DynamicSetting points_user_*.</summary>
    [HttpPost("points")]
    public async Task<IActionResult> ResetPoints()
    {
        var channelId = GetChannelId();
        var pointSettings = await _db.DynamicSettings
            .Where(s => s.ChannelId == channelId && s.Key.StartsWith("points_user_"))
            .ToListAsync();

        if (pointSettings.Count > 0)
        {
            _db.DynamicSettings.RemoveRange(pointSettings);
            await _db.SaveChangesAsync();
        }
        return Ok(new { status = 200, reset = "points", count = pointSettings.Count });
    }

    /// <summary>Reset all goal progress (Goal.Current = 0). Goal definitions kept.</summary>
    [HttpPost("goals")]
    public async Task<IActionResult> ResetGoals()
    {
        var channelId = GetChannelId();
        var goals = await _db.Goals.Where(g => g.ChannelId == channelId).ToListAsync();
        foreach (var g in goals) g.Current = 0;
        await _db.SaveChangesAsync();
        await _bridge.RefreshGoalConfig(channelId);
        return Ok(new { status = 200, reset = "goals", count = goals.Count });
    }

    /// <summary>Wipe everything resettable in one shot (aggregates + points + goals).</summary>
    [HttpPost("all")]
    public async Task<IActionResult> ResetAll()
    {
        var channelId = GetChannelId();

        // Points
        var pointSettings = await _db.DynamicSettings
            .Where(s => s.ChannelId == channelId && s.Key.StartsWith("points_user_"))
            .ToListAsync();
        if (pointSettings.Count > 0) _db.DynamicSettings.RemoveRange(pointSettings);

        // Goals
        var goals = await _db.Goals.Where(g => g.ChannelId == channelId).ToListAsync();
        foreach (var g in goals) g.Current = 0;

        if (pointSettings.Count > 0 || goals.Count > 0) await _db.SaveChangesAsync();

        // Aggregates + rebroadcast
        await _bridge.ResetAggregates();
        await _bridge.RefreshGoalConfig(channelId);

        return Ok(new
        {
            status = 200,
            reset = "all",
            points = pointSettings.Count,
            goals = goals.Count
        });
    }
}
