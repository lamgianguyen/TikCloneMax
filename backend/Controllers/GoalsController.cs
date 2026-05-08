using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

/// <summary>
/// CRUD for stream goals (subscriber count, like count, follow count, gift goal, custom).
/// Goals drive the goal.html overlay widget — when a goal is created/updated, the in-memory
/// state in <see cref="TikTokBridgeService"/> is refreshed and rebroadcast.
/// </summary>
[ApiController]
[Route("api/goals")]
[AllowAnonymous]
public sealed class GoalsController : BaseApiController
{
    private readonly AppDbContext _db;
    private readonly TikTokBridgeService _bridge;

    public GoalsController(AppDbContext db, IEnumerable<IHostedService> hostedServices)
    {
        _db = db;
        _bridge = hostedServices.OfType<TikTokBridgeService>().First();
    }

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var goals = await _db.Goals
            .Where(g => g.ChannelId == GetChannelId())
            .OrderByDescending(g => g.Id)
            .ToListAsync();

        return Ok(new
        {
            status = 200,
            message = "OK",
            goals = goals.Select(MapGoal).ToList()
        });
    }

    [HttpPost]
    public async Task<IActionResult> Save([FromBody] GoalDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Type)) return BadRequest(new { error = "type required" });
        if (dto.Target <= 0) return BadRequest(new { error = "target must be > 0" });

        var channelId = GetChannelId();
        Goal goal;

        if (dto.Id > 0)
        {
            goal = await _db.Goals.FirstOrDefaultAsync(g => g.Id == dto.Id && g.ChannelId == channelId)
                   ?? throw new InvalidOperationException($"Goal {dto.Id} not found");
            goal.Name = dto.Name ?? goal.Name;
            goal.Type = dto.Type;
            goal.Target = dto.Target;
            goal.Enabled = dto.Enabled;
        }
        else
        {
            goal = new Goal
            {
                ChannelId = channelId,
                Name = dto.Name ?? "",
                Type = dto.Type,
                Target = dto.Target,
                Current = 0,
                Enabled = dto.Enabled
            };
            _db.Goals.Add(goal);
        }

        await _db.SaveChangesAsync();
        await _bridge.RefreshGoalConfig(channelId);
        return Ok(new { status = 200, id = goal.Id });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var channelId = GetChannelId();
        var goal = await _db.Goals.FirstOrDefaultAsync(g => g.Id == id && g.ChannelId == channelId);
        if (goal != null)
        {
            _db.Goals.Remove(goal);
            await _db.SaveChangesAsync();
            await _bridge.RefreshGoalConfig(channelId);
        }
        return Ok(new { status = 200 });
    }

    [HttpPost("{id}/reset")]
    public async Task<IActionResult> Reset(int id)
    {
        var channelId = GetChannelId();
        var goal = await _db.Goals.FirstOrDefaultAsync(g => g.Id == id && g.ChannelId == channelId);
        if (goal == null) return NotFound(new { status = 404 });

        goal.Current = 0;
        await _db.SaveChangesAsync();
        await _bridge.RefreshGoalConfig(channelId);
        return Ok(new { status = 200 });
    }

    private static object MapGoal(Goal g) => new
    {
        id = g.Id,
        channelId = g.ChannelId,
        name = g.Name,
        type = g.Type,
        target = g.Target,
        current = g.Current,
        enabled = g.Enabled,
        percent = g.Target > 0 ? Math.Round(100.0 * g.Current / g.Target, 1) : 0,
        createdAt = g.CreatedAt
    };
}

public sealed record GoalDto(int Id, string? Name, string Type, int Target, bool Enabled = true);
