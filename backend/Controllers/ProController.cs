using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api/pro")]
[AllowAnonymous]
public class ProController : BaseApiController
{
    private readonly AppDbContext _db;

    public ProController(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// POST /api/pro/setUpgradeIntent - Mark user wants to upgrade
    /// </summary>
    [HttpPost("setUpgradeIntent")]
    public IActionResult SetUpgradeIntent()
    {
        return Ok(new { status = 200 });
    }

    /// <summary>
    /// GET /api/pro/tazapay/methods - Get payment methods by country
    /// </summary>
    [HttpGet("tazapay/methods")]
    [HttpPost("tazapay/methods")]
    public IActionResult GetPaymentMethods()
    {
        // Replace with real payment provider integration
        return Ok(new
        {
            status = 200,
            message = "OK",
            cached = true,
            country = "VN",
            methods = new object[]
            {
                new { id = "card", name = "Credit/Debit Card", icon = "credit-card" },
                new { id = "bank", name = "Bank Transfer", icon = "bank" },
                new { id = "momo", name = "MoMo Wallet", icon = "wallet" }
            }
        });
    }

    /// <summary>
    /// POST /api/pro/upgrade - Process Pro upgrade
    /// </summary>
    [HttpPost("upgrade")]
    public async Task<IActionResult> Upgrade([FromBody] UpgradeDto dto)
    {
        var channelId = GetChannelId();
        var sub = await _db.Subscriptions.FirstOrDefaultAsync(s => s.ChannelId == channelId);

        if (sub == null)
        {
            sub = new Subscription { ChannelId = channelId };
            _db.Subscriptions.Add(sub);
        }

        // TODO: Integrate real payment provider (Stripe, VNPay, etc.)
        // For now, simulate successful payment
        var expireAt = dto.Plan == "lifetime" ? (DateTime?)null : DateTime.UtcNow.AddMonths(dto.Months > 0 ? dto.Months : 1);

        sub.IsPro = true;
        sub.Plan = dto.Plan ?? "pro";
        sub.Active = true;
        sub.ProExpireAt = expireAt;
        sub.ProExpireSetBy = "payment";
        sub.UpdatedAt = DateTime.UtcNow;

        // Record transaction
        _db.Transactions.Add(new Transaction
        {
            ChannelId = channelId,
            Type = "pro_upgrade",
            Amount = dto.Amount,
            Currency = dto.Currency ?? "USD",
            Status = "completed",
            PaymentMethod = dto.PaymentMethod,
            PaymentProvider = dto.PaymentProvider ?? "manual"
        });

        await _db.SaveChangesAsync();

        return Ok(new
        {
            status = 200,
            message = "Pro upgrade successful",
            subscription = new
            {
                isPro = true,
                plan = sub.Plan,
                active = true,
                proExpireAt = sub.ProExpireAt
            }
        });
    }

    /// <summary>
    /// POST /api/pro/deactivate - Deactivate Pro subscription
    /// </summary>
    [HttpPost("deactivate")]
    public IActionResult Deactivate()
    {
        return Ok(new { status = 200, message = "OK" });
    }

    /// <summary>
    /// POST /api/pro/reactivate - Reactivate Pro subscription
    /// </summary>
    [HttpPost("reactivate")]
    public IActionResult Reactivate()
    {
        return Ok(new { status = 200, message = "OK" });
    }

    /// <summary>
    /// POST /api/pro/setPayment - Set payment method
    /// </summary>
    [HttpPost("setPayment")]
    public IActionResult SetPayment()
    {
        return Ok(new { status = 200, message = "OK" });
    }

    /// <summary>
    /// POST /api/pro/stripe - Stripe payment handler
    /// </summary>
    [HttpPost("stripe")]
    [HttpGet("stripe")]
    public IActionResult Stripe()
    {
        return Ok(new { status = 200, message = "OK", url = "" });
    }

    /// <summary>
    /// POST /api/pro/xsolla - Xsolla payment handler
    /// </summary>
    [HttpPost("xsolla")]
    [HttpGet("xsolla")]
    public IActionResult Xsolla()
    {
        return Ok(new { status = 200, message = "OK", url = "" });
    }

    /// <summary>
    /// POST /api/pro/lemonsqueezy - LemonSqueezy payment handler
    /// </summary>
    [HttpPost("lemonsqueezy")]
    [HttpGet("lemonsqueezy")]
    public IActionResult LemonSqueezy()
    {
        return Ok(new { status = 200, message = "OK", url = "" });
    }

    /// <summary>
    /// GET /api/pro/status - Check Pro status
    /// </summary>
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        var sub = await _db.Subscriptions.FirstOrDefaultAsync(s => s.ChannelId == GetChannelId());
        var isPro = sub?.IsPro ?? false;

        // Check expiry
        if (isPro && sub?.ProExpireAt != null && sub.ProExpireAt < DateTime.UtcNow)
        {
            sub.IsPro = false;
            sub.Active = false;
            await _db.SaveChangesAsync();
            isPro = false;
        }

        return Ok(new
        {
            status = 200,
            isPro,
            plan = sub?.Plan ?? "free",
            active = sub?.Active ?? false,
            proExpireAt = sub?.ProExpireAt
        });
    }
}

public record UpgradeDto(
    string? Plan = "pro",
    int Months = 1,
    decimal Amount = 0,
    string? Currency = "USD",
    string? PaymentMethod = null,
    string? PaymentProvider = null
);
