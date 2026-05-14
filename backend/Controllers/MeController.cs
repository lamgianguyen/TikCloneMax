using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TikFinityBackend.Data;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api")]
[AllowAnonymous]
public class MeController : BaseApiController
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwtService;

    // Cache the wsAuthToken per channel so /api/me returns the SAME JWT
    // every call. Without this, every request mints a fresh JWT (different
    // `iat` claim) — the bundle sees the change and reloads itself, causing
    // an infinite refresh loop (~1 reload/sec).
    private static readonly System.Collections.Concurrent.ConcurrentDictionary<int, string> _wsAuthTokenCache = new();
    // FeatureBase token is signed over (frontendChannelName, email, channelId).
    // frontendChannelName is profile-scoped (it comes from per-profile
    // DynamicSettings 'setting_tiktokname'), so caching by channelId alone
    // returned a stale token after the user switched profiles. Key by
    // (channelId, frontendChannelName) so each profile-specific identity gets
    // its own cached token.
    private static readonly System.Collections.Concurrent.ConcurrentDictionary<(int channelId, string name), string> _featureBaseTokenCache = new();

    private readonly WidgetSettingsCache _settingsCache;
    private readonly SocketManager _socketManager;

    public MeController(AppDbContext db, JwtService jwtService, WidgetSettingsCache settingsCache, SocketManager socketManager)
    {
        _db = db;
        _jwtService = jwtService;
        _settingsCache = settingsCache;
        _socketManager = socketManager;
    }

    /// <summary>
    /// GET/POST /api/me - Main user info (matches TikFinity frontend expectations)
    /// </summary>
    [HttpGet("me")]
    [HttpPost("me")]
    [HttpGet("loginChannel")]
    [HttpPost("loginChannel")]
    public async Task<IActionResult> GetMe(CancellationToken cancellationToken)
    {
        // Single-user local mode: TikfinityServer auth gate already verified the
        // user before they reach the main window. The bundle's auth bridge holds
        // a TikfinityServer key (not a local JWT), so JWT validation will fail
        // here — but that's expected. Fall back to GetChannelId() which returns
        // the default channel from the DB. If the DB is genuinely empty, only
        // then return the guest response.
        var auth = TryAuthenticate();
        var channelId = auth?.ChannelId ?? GetChannelId();
        if (channelId <= 0)
        {
            return Ok(GuestResponse());
        }

        var channel = await _db.Channels
            .Include(c => c.Subscription)
            .Include(c => c.Profiles)
            .FirstOrDefaultAsync(c => c.ChannelId == channelId, cancellationToken);

        if (channel == null)
        {
            return Ok(GuestResponse());
        }

        // Bundle's switchProfile() calls POST /api/me with body {profileId:N}
        // (verified by reading downloads/combo/app.js). If we ignore the body
        // and just return the cached profile, the bundle sees stale profileId
        // in the response, reverts the UI, and the click does nothing.
        var requestedProfileId = await ReadRequestedProfileIdAsync(cancellationToken);
        if (requestedProfileId.HasValue && requestedProfileId.Value > 0 && requestedProfileId.Value != channel.ProfileId)
        {
            channel.ProfileId = requestedProfileId.Value;
            await _db.SaveChangesAsync(cancellationToken);
            await _settingsCache.RebuildAndBroadcast(channelId);
            await _socketManager.BroadcastEvent("actionsChanged", new { });
            await _socketManager.BroadcastEvent("profileChanged", new { profileId = requestedProfileId.Value, channelId });
        }

        // Stream Profiles: load only the active profile's settings, NOT the
        // whole bag (.Include(c => c.DynamicSettings)). Otherwise switching
        // profile would still surface stale keys.
        var activeProfileId = channel.ProfileId > 0 ? channel.ProfileId : 1;
        var ds = await _db.DynamicSettings
            .Where(d => d.ChannelId == channel.ChannelId && d.ProfileId == activeProfileId)
            .ToDictionaryAsync(d => d.Key, d => d.Value, cancellationToken);
        var preferredTikTokName = ds.TryGetValue("setting_tiktokname", out var savedTikTokName)
            ? savedTikTokName?.Trim().TrimStart('@')
            : null;
        if (string.IsNullOrWhiteSpace(preferredTikTokName))
        {
            preferredTikTokName = null;
        }

        var frontendChannelName = preferredTikTokName ?? channel.ChannelName;
        // User reached this endpoint, which means they passed the TikfinityServer
        // license gate at app startup. Treat as Pro regardless of the local
        // Subscription row (which may still be at default isPro=false).
        var pro = true;
        // Reuse cached tokens — every fresh GenerateToken() bumps the `iat`
        // claim, the bundle interprets that as a session change and reloads
        // the whole app (~1 reload/sec). Single token per channel for the
        // process lifetime keeps the bundle stable.
        var wsAuthToken = _wsAuthTokenCache.GetOrAdd(channel.ChannelId, _ =>
            _jwtService.GenerateToken(channel.ChannelId, channel.ChannelName, channel.Email, pro).Item1);
        var featureBaseToken = _featureBaseTokenCache.GetOrAdd((channel.ChannelId, frontendChannelName ?? ""), _ =>
            _jwtService.GenerateFeaturebaseToken(frontendChannelName, channel.Email, channel.ChannelId.ToString()));
        var dynamicSettings = BuildDynamicSettings(ds, frontendChannelName, featureBaseToken, channel.OwnerUserId);
        var remoteIp = HttpContext.Connection.RemoteIpAddress?.ToString();

        return Ok(new
        {
            status = 200, message = "OK",
            channelName = frontendChannelName,
            accountChannelName = channel.ChannelName,
            tiktokUsername = preferredTikTokName ?? "",
            channel = new
            {
                channel.OwnerUserId, channel.ChannelId,
                ChannelName = frontendChannelName,
                AccountChannelName = channel.ChannelName,
                channel.ChannelSignature, channel.Sub, channel.Email,
                channel.AffId, channel.AgencyId, channel.ProfileId,
                proExpireAt = channel.Subscription?.ProExpireAt,
                proExpireSetBy = channel.Subscription?.ProExpireSetBy,
                channel.Locale, channel.IsChatbotApproved,
                channel.ChallengeRunning, channel.ChallengeName,
                channel.SignupAuthProvider, channel.ChallengeStartAt,
                TiktokUsername = preferredTikTokName ?? "",
                dynamicSettings = dynamicSettings,
                dynamicProfileSettings = Array.Empty<object>(),
                halvingLastExecutionAt = (DateTime?)null,
                catchApplied = false,
                catchEnabled = false,
                catchEnabledInGrid = true,
                catchEnabledAt = (DateTime?)null,
                catchProEnabled = false,
                catchProEnabledAt = (DateTime?)null,
                catchRandom = 5,
                isCatchAdmin = false,
                userAgent = Request.Headers.UserAgent.ToString(),
                customInfoText = (string?)null,
                lastActivityAt = channel.UpdatedAt,
                patreonUserId = (string?)null,
                discordUsername = (string?)null,
                bmcEmail = (string?)null,
                lmSubscriptionId = (string?)null,
                monthlyEarnings = 0,
                monthlyEarningsMax = 0,
                streamGifter = 0,
                streamGifterMax = 0,
                lastSeenIp = remoteIp,
                lastActiveProDate = (DateTime?)null,
                firstActiveProDate = (DateTime?)null,
                lastActiveProInfo = (object?)null,
                proCanceledAt = (DateTime?)null,
                banReason = (string?)null,
                tiktokAgencyInfoId = 0,
                tiktokAgencyInfoName = (string?)null,
                tiktokAgencyInfoUpdatedAt = (DateTime?)null,
                upgradeIntent = (string?)null,
                upgradeIntentUpdatedAt = (DateTime?)null,
                paymentMethodSelected = (string?)null,
                paymentMethodSelectedAt = (DateTime?)null,
                specialProOfferPrice = (decimal?)null,
                trialStartedAt = (DateTime?)null,
                trialExpiresAt = (DateTime?)null,
                trialOfferNotificationSentAt = (DateTime?)null,
                channel.CreatedAt,
                channel.UpdatedAt,
                isPro = pro,
                subscription = new { isPro = pro, plan = channel.Subscription?.Plan ?? "free", active = channel.Subscription?.Active ?? false },
                userFeatures = new { isPro = pro, proInfo = new { plan = channel.Subscription?.Plan ?? "free", active = channel.Subscription?.Active ?? false } },
                profiles = channel.Profiles.Select(p => new { p.Id, p.Name, p.Sort })
            },
            channeluser = (object?)null,
            userFeatures = new { isPro = pro, proInfo = new { plan = channel.Subscription?.Plan ?? "free", active = channel.Subscription?.Active ?? false } },
            profile = (object?)null,
            cookieAuth = false,
            wsAuthToken,
            discordVerifyToken = channel.ChannelSignature,
            channelId = channel.ChannelId,
            countryCode = channel.Locale ?? "VN",
            overloadSettings = new { enabled = false, suffixIds = new[] { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 }, minAccountAge = 5, updatedAt = channel.UpdatedAt },
            activePromotions = Array.Empty<object>(),
            mobileVoucherCode = "",
            performanceDebugInfo = new { cid = channel.ChannelId, step1 = 0, step2 = 0, step3 = 0, step4 = 0, step5 = 0, step6 = 0, step7 = 0, total = 0 },
            isTrialAvailable = false,
            hasActiveTrial = false,
            trialEnded = false,
            trialInfo = (object?)null,
            featureBaseToken,
            isPro = pro,
            subscription = new { isPro = pro, plan = channel.Subscription?.Plan ?? "free", active = channel.Subscription?.Active ?? false }
        });
    }

    // Pull `profileId` out of the POST body if present. Only POSTs with JSON
    // content carry one — GETs and legacy clients don't, so swallow any parse
    // error and return null.
    private async Task<int?> ReadRequestedProfileIdAsync(CancellationToken ct)
    {
        if (!HttpMethods.IsPost(Request.Method)) return null;
        if (Request.ContentLength is null or 0) return null;
        var ct2 = Request.ContentType ?? "";
        if (!ct2.Contains("json", StringComparison.OrdinalIgnoreCase)) return null;

        try
        {
            Request.EnableBuffering();
            Request.Body.Position = 0;
            using var doc = await JsonDocument.ParseAsync(Request.Body, cancellationToken: ct);
            Request.Body.Position = 0;
            if (doc.RootElement.ValueKind == JsonValueKind.Object &&
                doc.RootElement.TryGetProperty("profileId", out var pid))
            {
                if (pid.ValueKind == JsonValueKind.Number && pid.TryGetInt32(out var n)) return n;
                if (pid.ValueKind == JsonValueKind.String && int.TryParse(pid.GetString(), out var s)) return s;
            }
        }
        catch
        {
            // Body is not parseable JSON — bundle telemetry shape might
            // include weird fields. Falling through to null is correct.
        }
        return null;
    }

    // Bundle calls /api/me/switchProfile (some builds) or /api/switchProfile (others).
    // Without both aliases the call falls through to the generic API fallback,
    // returns a fake 200 and the DB is never updated — so profile switching
    // appears to silently fail.
    [HttpPost("switchProfile")]
    [HttpPost("me/switchProfile")]
    public async Task<IActionResult> SwitchProfile([FromBody] JsonElement body)
    {
        var channelId = GetChannelId();
        var profileId = body.TryGetProperty("profileId", out var pid) ? pid.GetInt32() : 0;

        if (profileId <= 0)
        {
            return Ok(new { status = 200, message = "OK" });
        }

        var channel = await _db.Channels.FirstOrDefaultAsync(c => c.ChannelId == channelId);
        if (channel == null)
        {
            return Ok(new { status = 200, message = "OK" });
        }

        var previous = channel.ProfileId;
        channel.ProfileId = profileId;
        await _db.SaveChangesAsync();

        if (previous != profileId)
        {
            // Per-profile data layout: rebuild the cache so the new profile's
            // settings flow to every connected widget. Also broadcast
            // `actionsChanged` so the myactions widget refetches actions for
            // the new profile.
            await _settingsCache.RebuildAndBroadcast(channelId);
            await _socketManager.BroadcastEvent("actionsChanged", new { });
            await _socketManager.BroadcastEvent("profileChanged", new { profileId, channelId });
        }

        return Ok(new { status = 200, message = "OK", profileId });
    }

    [HttpPost("setAffiliate")]
    [HttpPost("setAff")]
    public async Task<IActionResult> SetAffiliate([FromBody] JsonElement body)
    {
        var channelId = GetChannelId();
        var affId = body.TryGetProperty("affId", out var aid) ? aid.GetString() : null;

        if (!string.IsNullOrEmpty(affId))
        {
            var channel = await _db.Channels.FirstOrDefaultAsync(c => c.ChannelId == channelId);
            if (channel != null)
            {
                channel.AffId = affId;
                await _db.SaveChangesAsync();
            }
        }

        return Ok(new { status = 200, message = "OK" });
    }

    private static object GuestResponse() => new
    {
        status = 200,
        message = "OK",
        channelId = 0,
        channelName = "",
        accountChannelName = "",
        tiktokUsername = "",
        isPro = false,
        channel = new
        {
            channelId = 0,
            channelName = "",
            isPro = false,
            challengeRunning = false,
            challengeName = (string?)null,
            challengeStartAt = (DateTime?)null,
            dynamicSettings = new Dictionary<string, string>(),
            profiles = Array.Empty<object>(),
            subscription = new { isPro = false, plan = "free", active = false }
        },
        userFeatures = new { isPro = false, proInfo = new { plan = "free", active = false } },
        subscription = new { isPro = false, plan = "free", active = false },
        wsAuthToken = "",
        cookieAuth = false,
        countryCode = "VN",
        overloadSettings = new { enabled = false },
        activePromotions = Array.Empty<object>(),
        isTrialAvailable = false,
        hasActiveTrial = false,
        trialEnded = false,
        trialInfo = (object?)null,
        featureBaseToken = ""
    };

    private static Dictionary<string, string> BuildDynamicSettings(
        Dictionary<string, string> source,
        string frontendChannelName,
        string featureBaseToken,
        string? ownerUserId)
    {
        var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["events"] = "[]",
            ["timer"] = "[]",
            ["soundsdatasource"] = "[]",
            ["widget_wheelofactions_wheels"] = "[]",
            ["wheelcustomsegments"] = "[]",
            ["widget_socialmediarotator_socials"] = "[]",
            ["FBVisitedChangelogsTracker-tikfinity"] = "{\"shownChangelogs\":[],\"unviewedChangelogs\":[]}",
            ["featurebaseIdentifyData"] = "{}"
        };

        foreach (var (key, value) in source)
        {
            result[key] = value ?? "";
        }

        if (string.IsNullOrWhiteSpace(result.GetValueOrDefault("profilechannelname")))
        {
            result["profilechannelname"] = frontendChannelName;
        }

        if (string.IsNullOrWhiteSpace(result.GetValueOrDefault("textboxchannelname")))
        {
            result["textboxchannelname"] = $"@{frontendChannelName}";
        }

        if (string.IsNullOrWhiteSpace(result.GetValueOrDefault("owneruserid")))
        {
            result["owneruserid"] = ownerUserId ?? "";
        }

        // Always override with the cached token so every /api/me response is
        // identical. If we kept the stale DB value when present, the bundle
        // would compare it with localStorage's fresh token, fire updateSettings,
        // and the server would echo the stale value again next call → infinite
        // settings-mismatch loop (~1 GET+POST /api/me per second).
        result["featurebaseGlobalAuth"] = JsonSerializer.Serialize(new
        {
            organization = "tikfinity",
            jwt = featureBaseToken
        });
        result["featurebasetoken"] = featureBaseToken;

        return result;
    }
}
