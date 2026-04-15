using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api")]
[AllowAnonymous]
public class SoundsController : BaseApiController
{
    private readonly AppDbContext _db;

    public SoundsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("sounds")]
    [HttpPost("sounds")]
    public async Task<IActionResult> GetSounds()
    {
        var sounds = await _db.Sounds
            .Where(s => s.ChannelId == GetChannelId())
            .OrderBy(s => s.Sort)
            .Select(s => new { s.Id, s.Name, s.FileName, s.Url, s.Volume, s.Enabled, s.Sort, s.Category })
            .ToListAsync();

        return Ok(new
        {
            status = 200,
            message = "OK",
            arrayKey = "sounds",
            sounds = sounds,
            data = sounds,
            pageSize = Math.Max(sounds.Count, 1),
            page = 0,
            hasNext = false
        });
    }

    [HttpPost("sounds/save")]
    public async Task<IActionResult> SaveSound([FromBody] SoundDto dto)
    {
        var channelId = GetChannelId();
        Sound sound;

        if (dto.Id > 0)
        {
            var existing = await _db.Sounds.FirstOrDefaultAsync(s => s.Id == dto.Id && s.ChannelId == channelId);
            if (existing == null) return NotFound(new { status = 404 });
            sound = existing;
            sound.Name = dto.Name;
            sound.Url = dto.Url;
            sound.Volume = dto.Volume;
            sound.Enabled = dto.Enabled;
            sound.Sort = dto.Sort;
            sound.Category = dto.Category;
        }
        else
        {
            sound = new Sound
            {
                ChannelId = channelId,
                Name = dto.Name,
                Url = dto.Url,
                Volume = dto.Volume,
                Enabled = dto.Enabled,
                Sort = dto.Sort,
                Category = dto.Category
            };
            _db.Sounds.Add(sound);
        }

        await _db.SaveChangesAsync();
        return Ok(new { status = 200, message = "OK", id = sound.Id });
    }

    [HttpPost("sounds/delete")]
    public async Task<IActionResult> DeleteSound([FromBody] IdDto dto)
    {
        var sound = await _db.Sounds.FirstOrDefaultAsync(s => s.Id == dto.Id && s.ChannelId == GetChannelId());
        if (sound != null)
        {
            _db.Sounds.Remove(sound);
            await _db.SaveChangesAsync();
        }
        return Ok(new { status = 200, message = "OK" });
    }
}

public record SoundDto(int Id, string Name, string? Url, int Volume = 100, bool Enabled = true, int Sort = 0, string? Category = null);
public record IdDto(int Id);
