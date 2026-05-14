using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using TikFinityBackend.Data;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

public abstract class BaseApiController : ControllerBase
{
    private static int? _defaultChannelId;

    /// <summary>
    /// Returns a channelId to use for the current request. Prefers the
    /// authenticated JWT claim; otherwise falls back to the first channel
    /// in the DB (single-user local mode). Does not validate tokens — use
    /// <see cref="TryAuthenticate"/> when you need a verified principal.
    /// </summary>
    protected int GetChannelId()
    {
        var claim = User.FindFirst("channelId");
        if (claim != null && int.TryParse(claim.Value, out var claimId) && claimId > 0)
        {
            var db = HttpContext.RequestServices.GetRequiredService<AppDbContext>();
            if (db.Channels.Any(c => c.ChannelId == claimId))
            {
                return claimId;
            }
        }

        if (_defaultChannelId.HasValue) return _defaultChannelId.Value;

        var dbFallback = HttpContext.RequestServices.GetRequiredService<AppDbContext>();
        var first = dbFallback.Channels.OrderBy(c => c.ChannelId).Select(c => c.ChannelId).FirstOrDefault();
        if (first > 0) _defaultChannelId = first;
        return first;
    }

    /// <summary>
    /// Returns the currently-active Stream Profile id for this channel.
    /// Stream Profiles are configuration presets stored in Channels.ProfileId.
    /// All per-profile data (Actions, Sounds, Goals, ChatCommands,
    /// DynamicSettings) must filter on this id so switching profiles
    /// actually shows different data.
    /// </summary>
    protected int GetProfileId()
    {
        var channelId = GetChannelId();
        if (channelId <= 0) return 1;
        var db = HttpContext.RequestServices.GetRequiredService<AppDbContext>();
        var profileId = db.Channels
            .Where(c => c.ChannelId == channelId)
            .Select(c => (int?)c.ProfileId)
            .FirstOrDefault();
        return profileId.GetValueOrDefault() > 0 ? profileId!.Value : 1;
    }

    protected string GetChannelName() =>
        User.FindFirst("channelName")?.Value ?? "";

    protected bool GetIsPro() =>
        User.FindFirst("isPro")?.Value == "true";

    /// <summary>
    /// Validates the Authorization header and returns the authenticated principal
    /// together with the channelId from its claims, or null if the token is
    /// missing, invalid, or revoked.
    /// </summary>
    protected (ClaimsPrincipal Principal, int ChannelId)? TryAuthenticate()
    {
        var header = Request.Headers.Authorization.ToString();
        if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var token = header["Bearer ".Length..].Trim();
        if (string.IsNullOrEmpty(token))
        {
            return null;
        }

        var jwt = HttpContext.RequestServices.GetRequiredService<JwtService>();
        var principal = jwt.ValidateToken(token);
        if (principal == null)
        {
            return null;
        }

        var jti = principal.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti)?.Value;
        var revocation = HttpContext.RequestServices.GetRequiredService<TokenRevocationService>();
        if (revocation.IsRevoked(jti))
        {
            return null;
        }

        var idClaim = principal.FindFirst("channelId")?.Value;
        if (!int.TryParse(idClaim, out var channelId) || channelId <= 0)
        {
            return null;
        }

        return (principal, channelId);
    }
}
