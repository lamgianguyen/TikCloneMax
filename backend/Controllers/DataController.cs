using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api")]
[AllowAnonymous]
public class DataController : BaseApiController
{
    private readonly AppDbContext _db;
    private static JsonElement? _cachedGifts;
    private static JsonElement? _cachedAnimations;

    public DataController(AppDbContext db)
    {
        _db = db;
    }

    private static JsonElement LoadCachedFile(string filename)
    {
        var path = Path.Combine(Directory.GetCurrentDirectory(), "..", "downloads", "api", filename);
        if (!System.IO.File.Exists(path))
            path = Path.Combine(Directory.GetCurrentDirectory(), "downloads", "api", filename);
        if (System.IO.File.Exists(path))
        {
            var json = System.IO.File.ReadAllText(path);
            return JsonDocument.Parse(json).RootElement;
        }
        return default;
    }

    [HttpGet("odata/transaction")]
    public async Task<IActionResult> GetTransactions()
    {
        var transactions = await _db.Transactions
            .Where(t => t.ChannelId == GetChannelId())
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new
            {
                t.Id,
                t.TransactionId,
                t.Type,
                t.Amount,
                t.Currency,
                t.Status,
                t.PaymentMethod,
                t.PaymentProvider,
                t.CreatedAt
            })
            .ToListAsync();

        return Ok(new { value = transactions });
    }

    [HttpGet("odata/channeluser")]
    public IActionResult GetChannelUsersOdata()
    {
        return Ok(new { value = Array.Empty<object>() });
    }

    [HttpGet("rest/channeluser")]
    public IActionResult GetChannelUsersRest()
    {
        return Ok(new
        {
            status = 200,
            message = "OK",
            arrayKey = "channelusers",
            channelusers = Array.Empty<object>(),
            pageSize = 3,
            page = 0,
            orderType = "DESC",
            orderColumn = "id",
            hasNext = false
        });
    }

    [HttpGet("getChannelUserCount")]
    [HttpPost("getChannelUserCount")]
    public IActionResult GetChannelUserCount()
    {
        return Ok(new { status = 200, message = "OK", count = 0 });
    }

    [HttpGet("getChannelEmotes")]
    [HttpPost("getChannelEmotes")]
    public IActionResult GetChannelEmotes()
    {
        const bool isPro = true;
        var empty = Array.Empty<object>();

        return Ok(new
        {
            status = 200,
            message = "OK",
            isPro,
            data = new { isPro },
            value = empty,
            items = empty,
            results = empty,
            subscription = new { isPro },
            list = empty,
            sounds = empty,
            actions = empty,
            triggers = empty,
            events = empty,
            gifts = empty,
            emotes = empty,
            channels = empty,
            users = empty,
            total = 0,
            count = 0
        });
    }

    [HttpGet("getAllGifts")]
    [HttpPost("getAllGifts")]
    public IActionResult GetAllGifts()
    {
        _cachedGifts ??= LoadCachedFile("getAllGifts");

        // Keep parity with original payload shape: a raw array response.
        if (_cachedGifts.Value.ValueKind == JsonValueKind.Array)
            return Content(_cachedGifts.Value.GetRawText(), "application/json");

        if (_cachedGifts.Value.ValueKind != JsonValueKind.Undefined)
            return Content(_cachedGifts.Value.GetRawText(), "application/json");

        return Ok(Array.Empty<object>());
    }

    [HttpGet("getAllGiftsCached")]
    [HttpPost("getAllGiftsCached")]
    public IActionResult GetAllGiftsCached()
    {
        return GetAllGifts();
    }

    [HttpGet("getAllAnimations")]
    [HttpPost("getAllAnimations")]
    public IActionResult GetAllAnimations()
    {
        _cachedAnimations ??= LoadCachedFile("getAllAnimations");
        if (_cachedAnimations.Value.ValueKind != JsonValueKind.Undefined)
            return Content(_cachedAnimations.Value.GetRawText(), "application/json");
        return Ok(new { status = 200, message = "OK", animations = Array.Empty<object>() });
    }

    [HttpGet("getLiveChannels")]
    [HttpPost("getLiveChannels")]
    public IActionResult GetLiveChannels()
    {
        var liveChannels = Array.Empty<object>();
        return Ok(new
        {
            status = 200,
            message = "OK",
            liveChannelCount = 0,
            liveChannels,
            channels = liveChannels
        });
    }

    [HttpGet("getGlobalTransactions")]
    [HttpPost("getGlobalTransactions")]
    public IActionResult GetGlobalTransactions()
    {
        var globalTransactions = Array.Empty<object>();
        return Ok(new
        {
            status = 200,
            message = "OK",
            globalTransactions,
            transactions = globalTransactions
        });
    }

    [HttpGet("getMyInstants")]
    [HttpPost("getMyInstants")]
    public IActionResult GetMyInstants()
    {
        return Ok(new
        {
            status = 200,
            message = "OK",
            arrayKey = "instants",
            instants = Array.Empty<object>(),
            data = Array.Empty<object>(),
            pageSize = 50,
            page = 0,
            hasNext = false
        });
    }

    [HttpGet("rest/transaction")]
    public async Task<IActionResult> GetTransactionsRest()
    {
        var transactions = await _db.Transactions
            .Where(t => t.ChannelId == GetChannelId())
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new
            {
                t.Id,
                t.TransactionId,
                t.Type,
                t.Amount,
                t.Currency,
                t.Status,
                t.PaymentMethod,
                t.PaymentProvider,
                t.CreatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            status = 200,
            message = "OK",
            arrayKey = "transactions",
            transactions,
            data = transactions,
            pageSize = Math.Max(transactions.Count, 1),
            page = 0,
            hasNext = false
        });
    }

    [HttpPost("usage/log")]
    public IActionResult UsageLog()
    {
        return Ok(new { status = 200 });
    }

    [HttpPost("logError")]
    public IActionResult LogError()
    {
        return Ok(new { status = 200 });
    }

    [HttpPost("backup")]
    public IActionResult Backup()
    {
        return Ok(new { status = 200, message = "OK" });
    }
}
