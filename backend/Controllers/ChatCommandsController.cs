using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

/// <summary>
/// CRUD for chat command bot — when a viewer types a command in TikTok chat,
/// the matching response is broadcast via Socket.IO. Templates support
/// {user}, {username}, {nickname}, {message} placeholders.
/// </summary>
[ApiController]
[Route("api/commands")]
[AllowAnonymous]
public sealed class ChatCommandsController : BaseApiController
{
    private readonly AppDbContext _db;
    private readonly ChatBotService _chatBot;

    public ChatCommandsController(AppDbContext db, ChatBotService chatBot)
    {
        _db = db;
        _chatBot = chatBot;
    }

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var channelId = GetChannelId();
        var profileId = GetProfileId();
        var commands = await _db.ChatCommands
            .Where(c => c.ChannelId == channelId && c.ProfileId == profileId)
            .OrderBy(c => c.Sort)
            .ThenByDescending(c => c.Id)
            .ToListAsync();

        return Ok(new
        {
            status = 200,
            message = "OK",
            commands = commands.Select(MapCommand).ToList()
        });
    }

    [HttpPost]
    public async Task<IActionResult> Save([FromBody] ChatCommandDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Command)) return BadRequest(new { error = "command required" });
        if (string.IsNullOrWhiteSpace(dto.Response)) return BadRequest(new { error = "response required" });

        var channelId = GetChannelId();
        ChatCommand cmd;

        if (dto.Id > 0)
        {
            cmd = await _db.ChatCommands.FirstOrDefaultAsync(c => c.Id == dto.Id && c.ChannelId == channelId)
                  ?? throw new InvalidOperationException($"Command {dto.Id} not found");
            cmd.Command = dto.Command;
            cmd.Response = dto.Response;
            cmd.Cooldown = Math.Max(0, dto.Cooldown);
            cmd.Enabled = dto.Enabled;
            cmd.Sort = dto.Sort;
        }
        else
        {
            cmd = new ChatCommand
            {
                ChannelId = channelId,
                ProfileId = GetProfileId(),
                Command = dto.Command,
                Response = dto.Response,
                Cooldown = Math.Max(0, dto.Cooldown),
                Enabled = dto.Enabled,
                Sort = dto.Sort
            };
            _db.ChatCommands.Add(cmd);
        }

        await _db.SaveChangesAsync();
        await _chatBot.RefreshAsync(channelId);
        return Ok(new { status = 200, id = cmd.Id });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var channelId = GetChannelId();
        var cmd = await _db.ChatCommands.FirstOrDefaultAsync(c => c.Id == id && c.ChannelId == channelId);
        if (cmd != null)
        {
            _db.ChatCommands.Remove(cmd);
            await _db.SaveChangesAsync();
            await _chatBot.RefreshAsync(channelId);
        }
        return Ok(new { status = 200 });
    }

    [HttpPost("test/{id}")]
    public async Task<IActionResult> Test(int id, [FromBody] TestChatCommandDto? dto)
    {
        var channelId = GetChannelId();
        var cmd = await _db.ChatCommands.FirstOrDefaultAsync(c => c.Id == id && c.ChannelId == channelId);
        if (cmd == null) return NotFound(new { status = 404 });

        await _chatBot.OnChatAsync(
            username: dto?.Username ?? "test_user",
            nickname: dto?.Nickname ?? "Test User",
            profilePictureUrl: "",
            userId: "test_id",
            comment: cmd.Command);

        return Ok(new { status = 200, fired = true });
    }

    private static object MapCommand(ChatCommand c) => new
    {
        id = c.Id,
        channelId = c.ChannelId,
        command = c.Command,
        response = c.Response,
        cooldown = c.Cooldown,
        enabled = c.Enabled,
        sort = c.Sort,
        createdAt = c.CreatedAt
    };
}

public sealed record ChatCommandDto(
    int Id,
    string Command,
    string Response,
    int Cooldown = 0,
    bool Enabled = true,
    int Sort = 0);

public sealed record TestChatCommandDto(string? Username, string? Nickname);
