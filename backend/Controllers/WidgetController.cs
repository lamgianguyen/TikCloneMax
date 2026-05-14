using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api/widget")]
[AllowAnonymous]
[LocalOnly]
public class WidgetController : BaseApiController
{
    private readonly TikTokBridgeService _bridge;
    private readonly SocketManager _socketManager;
    private readonly AppDbContext _db;

    public WidgetController(IEnumerable<IHostedService> hostedServices, SocketManager socketManager, AppDbContext db)
    {
        _bridge = hostedServices.OfType<TikTokBridgeService>().First();
        _socketManager = socketManager;
        _db = db;
    }

    // ── Timer ──

    // `action` is a reserved MVC route token — using it as a parameter name
    // throws "Failed to update the route pattern" at startup, which silently
    // disables this controller and routes all timer/* through the fallback.
    // Renamed to `op` to dodge the reserved-name check.
    [HttpPost("timer/{op:regex(^(start|pause|resume|stop|add)$)}")]
    public async Task<IActionResult> Timer(string op, [FromQuery] int seconds = 0, [FromBody] TimerDto? dto = null)
    {
        if (string.Equals(op, "add", StringComparison.OrdinalIgnoreCase))
        {
            if (seconds <= 0) return BadRequest(new { error = "seconds must be > 0" });
            await _bridge.AddTimerSecondsAsync(seconds);
            return Ok(new { added = seconds });
        }

        await _bridge.SetTimerState(op, dto?.DurationMs ?? (seconds * 1000));
        return Ok(new { state = op });
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

    // ── Manual test trigger for the myactions widget ──
    // POST /api/widget/actions/test?id=3
    // POST /api/widget/actions/test?name=Gift Alert
    // Looks up the action, builds (actionInfo, context) and fires `executeAction`
    // so users can verify the OBS overlay without waiting for a real TikTok event.
    [HttpPost("actions/test")]
    public async Task<IActionResult> TestAction([FromQuery] int? id = null, [FromQuery] string? name = null)
    {
        var channelId = GetChannelId();
        var profileId = GetProfileId();
        // Scope to active profile — otherwise testing in Profile 2 can fire
        // an action that only belongs to Profile 1 (cross-profile bleed).
        var query = _db.Actions.Where(a => a.ChannelId == channelId && a.ProfileId == profileId && a.Enabled);
        var action = id.HasValue
            ? await query.FirstOrDefaultAsync(a => a.Id == id.Value)
            : !string.IsNullOrWhiteSpace(name)
                ? await query.FirstOrDefaultAsync(a => a.Name.ToLower() == name.ToLower())
                : await query.OrderBy(a => a.Sort).FirstOrDefaultAsync();

        if (action == null)
            return NotFound(new { error = "Action not found", id, name });

        JsonObject actionInfo;
        try
        {
            actionInfo = string.IsNullOrWhiteSpace(action.ConfigJson)
                ? new JsonObject()
                : JsonNode.Parse(action.ConfigJson) as JsonObject ?? new JsonObject();
        }
        catch { actionInfo = new JsonObject(); }

        actionInfo["id"] = action.Id;
        actionInfo["channelId"] = action.ChannelId;
        actionInfo["name"] = action.Name;
        if (actionInfo["screenId"] is null) actionInfo["screenId"] = 1;
        if (actionInfo["duration"] is null) actionInfo["duration"] = 5;
        if (actionInfo["enableFadeEffect"] is null) actionInfo["enableFadeEffect"] = true;
        if (actionInfo["dynamicConfig"] is null) actionInfo["dynamicConfig"] = new JsonObject();

        var context = new
        {
            username = "tester",
            nickname = "Tester",
            giftData = new { value = 1 },
            giftName = "Rose",
            repeatCount = 1,
            likeCount = 15,
            totalLikeCount = 100,
            subMonth = 1,
            commandParams = "",
            ttsLanguage = "en-US",
            ttsRandomVoice = "en_us_001",
            thumbnailUrl = "https://p16-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/4ec174248f94de26938f73874962469b~c5_100x100.jpeg"
        };

        await _socketManager.BroadcastEventArgs("executeAction", actionInfo, context);

        // Mirror the per-action side effects in TryDispatchActionsAsync so the
        // test endpoint covers the full pipeline (webhook + streamerbot +
        // minecraft + keystrokes). Each is fire-and-forget — failures don't
        // block the executeAction broadcast.
        var webhookFired = false;
        var streamerbotFired = false;
        var minecraftFired = false;
        var keystrokesFired = false;
        var webhookSvc = HttpContext.RequestServices.GetService<WebhookService>();

        var webhookUrl = actionInfo["webhookUrl"]?.GetValue<string>();
        if (!string.IsNullOrWhiteSpace(webhookUrl) && webhookSvc != null)
        {
            _ = webhookSvc.FireOneShotAsync(webhookUrl, new
            {
                action = new { id = action.Id, name = action.Name, type = action.Type },
                test = true,
                context
            });
            webhookFired = true;
        }

        var sbActionId = actionInfo["streamerbotActionId"]?.GetValue<string>();
        if (!string.IsNullOrWhiteSpace(sbActionId) && webhookSvc != null)
        {
            var sbHost = Environment.GetEnvironmentVariable("TIKMAX_STREAMERBOT_URL") ?? "http://127.0.0.1:7474";
            var sbUrl = sbHost.TrimEnd('/') + "/DoAction";
            _ = webhookSvc.FireOneShotAsync(sbUrl, new
            {
                action = new { id = sbActionId },
                args = new { tikfinityAction = action.Name, test = true, username = "tester" }
            });
            streamerbotFired = true;
        }

        var mcCmd = actionInfo["mcCmd"]?.GetValue<string>();
        if (!string.IsNullOrWhiteSpace(mcCmd))
        {
            await _bridge.FireMinecraftCommandFromTestAsync(mcCmd);
            minecraftFired = true;
        }

        var keystrokes = actionInfo["keystrokes"]?.GetValue<string>();
        if (!string.IsNullOrWhiteSpace(keystrokes) && webhookSvc != null)
        {
            var ksUrl = Environment.GetEnvironmentVariable("TIKMAX_KEYSTROKE_URL")
                ?? "http://127.0.0.1:5294/keystroke";
            _ = webhookSvc.FireOneShotAsync(ksUrl, new { keystrokes });
            keystrokesFired = true;
        }

        return Ok(new
        {
            fired = true,
            actionId = action.Id,
            actionName = action.Name,
            clients = _socketManager.ConnectionCount,
            webhookFired,
            streamerbotFired,
            minecraftFired,
            keystrokesFired
        });
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
