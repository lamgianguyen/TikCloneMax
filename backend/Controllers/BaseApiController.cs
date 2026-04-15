using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;

namespace TikFinityBackend.Controllers;

public abstract class BaseApiController : ControllerBase
{
    // Default channelId for anonymous/local users (first channel in DB)
    private static int? _defaultChannelId;

    protected int GetChannelId()
    {
        var claim = User.FindFirst("channelId");
        if (claim != null)
        {
            var claimId = int.Parse(claim.Value);
            // Verify channel exists (token might be from old DB)
            if (claimId > 0)
            {
                var db = HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                if (db.Channels.Any(c => c.ChannelId == claimId)) return claimId;
            }
        }

        // Fallback: use first channel in DB
        if (_defaultChannelId.HasValue) return _defaultChannelId.Value;

        var dbFallback = HttpContext.RequestServices.GetRequiredService<AppDbContext>();
        var first = dbFallback.Channels.OrderBy(c => c.ChannelId).Select(c => c.ChannelId).FirstOrDefault();
        if (first > 0) _defaultChannelId = first;
        return first;
    }

    protected string GetChannelName()
    {
        return User.FindFirst("channelName")?.Value ?? "";
    }

    protected bool GetIsPro()
    {
        return User.FindFirst("isPro")?.Value == "true" || true; // Local dev: always pro
    }
}
