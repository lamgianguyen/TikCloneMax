using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

/// <summary>
/// REST surface for the OBS WebSocket integration. Connection settings are
/// stored in DynamicSetting (key prefix "obs.") so the existing settings UI
/// can drive them. The actual socket lives in <see cref="ObsService"/>.
/// </summary>
[ApiController]
[Route("api/obs")]
[AllowAnonymous]
public sealed class ObsController : BaseApiController
{
    private readonly ObsService _obs;

    public ObsController(ObsService obs)
    {
        _obs = obs;
    }

    [HttpGet("status")]
    public IActionResult Status()
    {
        return Ok(new
        {
            status = 200,
            connected = _obs.IsConnected,
            currentScene = _obs.GetCurrentScene()
        });
    }

    [HttpPost("connect")]
    public async Task<IActionResult> Connect([FromBody] ConnectObsDto dto)
    {
        var url = string.IsNullOrWhiteSpace(dto.Url) ? "ws://localhost:4455" : dto.Url;
        await _obs.ConnectAsync(url, dto.Password);
        return Ok(new { status = 200, requested = url });
    }

    [HttpPost("disconnect")]
    public IActionResult Disconnect()
    {
        _obs.Disconnect();
        return Ok(new { status = 200, disconnected = true });
    }

    [HttpGet("scenes")]
    public IActionResult Scenes()
    {
        if (!_obs.IsConnected) return Conflict(new { status = 409, error = "not connected" });
        return Ok(new
        {
            status = 200,
            current = _obs.GetCurrentScene(),
            scenes = _obs.GetScenes()
        });
    }

    [HttpPost("scene")]
    public IActionResult SetScene([FromBody] SetSceneDto dto)
    {
        if (!_obs.IsConnected) return Conflict(new { status = 409, error = "not connected" });
        if (string.IsNullOrWhiteSpace(dto.Scene)) return BadRequest(new { error = "scene required" });
        var ok = _obs.SetCurrentScene(dto.Scene);
        return Ok(new { status = ok ? 200 : 500, scene = dto.Scene, switched = ok });
    }

    [HttpGet("scene/{sceneName}/items")]
    public IActionResult Items(string sceneName)
    {
        if (!_obs.IsConnected) return Conflict(new { status = 409, error = "not connected" });
        var items = _obs.GetSceneItems(sceneName);
        return Ok(new { status = 200, scene = sceneName, items });
    }

    [HttpPost("source/toggle")]
    public IActionResult ToggleSource([FromBody] ToggleSourceDto dto)
    {
        if (!_obs.IsConnected) return Conflict(new { status = 409, error = "not connected" });
        if (string.IsNullOrWhiteSpace(dto.Scene) || string.IsNullOrWhiteSpace(dto.Source))
            return BadRequest(new { error = "scene + source required" });

        var ok = _obs.ToggleSceneItem(dto.Scene, dto.Source);
        return Ok(new { status = ok ? 200 : 500, toggled = ok });
    }
}

public sealed record ConnectObsDto(string? Url, string? Password);
public sealed record SetSceneDto(string Scene);
public sealed record ToggleSourceDto(string Scene, string Source);
