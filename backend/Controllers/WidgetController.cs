using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api/widget")]
[AllowAnonymous]
public class WidgetController : BaseApiController
{
    private readonly TikTokBridgeService _bridge;
    private readonly SocketManager _socketManager;

    public WidgetController(IEnumerable<IHostedService> hostedServices, SocketManager socketManager)
    {
        _bridge = hostedServices.OfType<TikTokBridgeService>().First();
        _socketManager = socketManager;
    }

    // ── Timer ──

    [HttpPost("timer/{action}")]
    public async Task<IActionResult> Timer(string action, [FromBody] TimerDto? dto = null)
    {
        if (action is not ("start" or "pause" or "resume" or "stop"))
            return BadRequest(new { error = "Invalid action. Use: start, pause, resume, stop" });

        await _bridge.SetTimerState(action, dto?.DurationMs ?? 0);
        return Ok(new { state = action });
    }

    // ── Coin Jar Reset ──

    [HttpPost("coinjar/reset")]
    public async Task<IActionResult> ResetCoinJar()
    {
        await _bridge.ResetCoinJar();
        return Ok(new { reset = true });
    }

    // ── User Info ──

    [HttpPost("userinfo/show")]
    public async Task<IActionResult> ShowUserInfo([FromBody] UserInfoDto dto)
    {
        await _bridge.ShowUserScore(dto.UserId ?? "", dto.Username ?? "");
        return Ok(new { shown = true });
    }

    // ── Wheel Spin ──

    [HttpPost("wheel/spin")]
    public async Task<IActionResult> SpinWheel([FromBody] object data)
    {
        await _bridge.BroadcastWidgetEvent("spinWheel", data);
        return Ok(new { spun = true });
    }

    // ── Wheel of Actions ──

    [HttpPost("wheelofactions/spin")]
    public async Task<IActionResult> SpinWheelOfActions([FromBody] object data)
    {
        await _bridge.BroadcastWidgetEvent("onSpinWheel", data);
        return Ok(new { spun = true });
    }

    // ── Coin Drop ──

    [HttpPost("coindrop/create")]
    public async Task<IActionResult> CreateCoins([FromBody] object data)
    {
        await _bridge.BroadcastWidgetEvent("createCoins", data);
        return Ok(new { created = true });
    }

    [HttpPost("coindrop/timeout")]
    public async Task<IActionResult> TimeoutCoins([FromBody] object data)
    {
        await _bridge.BroadcastWidgetEvent("timeoutCoins", data);
        return Ok(new { timedOut = true });
    }

    [HttpPost("coindrop/collect")]
    public async Task<IActionResult> CollectCoin([FromBody] object data)
    {
        await _bridge.BroadcastWidgetEvent("collectCoin", data);
        return Ok(new { collected = true });
    }

    // ── Coin Match ──

    [HttpPost("coinmatch/{action}")]
    public async Task<IActionResult> CoinMatch(string action, [FromBody] object? data = null)
    {
        var eventName = action switch
        {
            "start" => "coin-match:start",
            "update" => "coin-match:update",
            "result" => "coin-match:result",
            "reset" => "coin-match:reset",
            _ => null
        };
        if (eventName == null)
            return BadRequest(new { error = "Invalid action. Use: start, update, result, reset" });

        await _bridge.BroadcastWidgetEvent(eventName, data ?? new { });
        return Ok(new { action });
    }

    // ── Command Info ──

    [HttpPost("commands/show")]
    public async Task<IActionResult> ShowCommands([FromBody] object data)
    {
        await _bridge.BroadcastWidgetEvent("showCommands", data);
        return Ok(new { shown = true });
    }

    [HttpPost("commands/custom")]
    public async Task<IActionResult> ShowCustomCommands([FromBody] object data)
    {
        await _bridge.BroadcastWidgetEvent("showCustomCommands", data);
        return Ok(new { shown = true });
    }

    [HttpPost("commands/result")]
    public async Task<IActionResult> ShowCommandResult([FromBody] object data)
    {
        await _bridge.BroadcastWidgetEvent("showCommandResult", data);
        return Ok(new { shown = true });
    }

    // ── Actions (myactions widget) ──

    [HttpPost("actions/execute")]
    public async Task<IActionResult> ExecuteAction([FromBody] object data)
    {
        await _bridge.BroadcastWidgetEvent("executeAction", data);
        return Ok(new { executed = true });
    }

    [HttpPost("actions/changed")]
    public async Task<IActionResult> ActionsChanged()
    {
        await _bridge.BroadcastWidgetEvent("actionsChanged", new { });
        return Ok(new { notified = true });
    }

    // ── Song Requests ──

    [HttpPost("songrequests/playlist")]
    public async Task<IActionResult> SetPlaylist([FromBody] object data)
    {
        await _bridge.BroadcastWidgetEvent("setPlaylistItems", data);
        return Ok(new { set = true });
    }

    // ── Generic event broadcast (for any widget) ──

    [HttpPost("broadcast/{eventName}")]
    public async Task<IActionResult> BroadcastEvent(string eventName, [FromBody] object data)
    {
        await _bridge.BroadcastWidgetEvent(eventName, data);
        return Ok(new { eventName, sent = true });
    }
}

public record TimerDto
{
    public int DurationMs { get; init; }
}

public record UserInfoDto
{
    public string? UserId { get; init; }
    public string? Username { get; init; }
}
