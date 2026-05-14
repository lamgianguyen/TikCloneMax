using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

/// <summary>
/// One-shot importer that pulls a user's existing Tikfinity Pro configuration
/// (settings + actions, per stream profile) from tikfinity.zerody.one and
/// stores it locally so the clone is fully usable without re-setup.
///
/// Auth is replayed verbatim from the user's browser session — three headers
/// (token, channel id, channel signature). The signature is a static value
/// returned by Tikfinity in /api/me (`channel.channelSignature`), not an
/// HMAC, so capture-and-replay is enough.
/// </summary>
[ApiController]
[Route("api/import")]
[AllowAnonymous]
public sealed class TikfinityImportController : BaseApiController
{
    private const string TikfinityBase = "https://tikfinity.zerody.one";
    private static readonly TimeSpan RequestTimeout = TimeSpan.FromSeconds(30);

    private readonly AppDbContext _db;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly WidgetSettingsCache _settingsCache;
    private readonly SocketManager _socketManager;

    public TikfinityImportController(
        AppDbContext db,
        IHttpClientFactory httpClientFactory,
        WidgetSettingsCache settingsCache,
        SocketManager socketManager)
    {
        _db = db;
        _httpClientFactory = httpClientFactory;
        _settingsCache = settingsCache;
        _socketManager = socketManager;
    }

    /// <summary>
    /// Probe credentials by calling /api/me once. Confirms token, signature,
    /// and channel id are valid before running a full import.
    /// </summary>
    [HttpPost("tikfinity/test")]
    public async Task<IActionResult> TestConnection([FromBody] TikfinityCredentials creds, CancellationToken ct)
    {
        var validation = ValidateCredentials(creds);
        if (validation != null) return validation;

        var (status, body) = await CallTikfinityMeAsync(creds, profileId: null, ct);
        if (status != 200)
        {
            return BadRequest(new
            {
                error = $"Tikfinity returned {status}. Token might be expired or signature wrong.",
                status,
                body = body.Length > 500 ? body[..500] : body
            });
        }

        try
        {
            var doc = JsonNode.Parse(body)?.AsObject();
            var channel = doc?["channel"]?.AsObject();
            return Ok(new
            {
                status = 200,
                channelId = channel?["channelId"]?.GetValue<int>(),
                channelName = channel?["channelName"]?.GetValue<string>(),
                email = channel?["email"]?.GetValue<string>(),
                profileId = channel?["profileId"]?.GetValue<int>(),
                proExpireAt = channel?["proExpireAt"]?.ToString(),
                settingsCount = channel?["dynamicSettings"]?.AsObject()?.Count ?? 0
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = "Could not parse Tikfinity response: " + ex.Message });
        }
    }

    /// <summary>
    /// Pull settings + actions for each requested profileId from Tikfinity and
    /// REPLACE the matching per-(channel, profile) data in the local DB.
    /// </summary>
    [HttpPost("tikfinity")]
    public async Task<IActionResult> ImportFromTikfinity([FromBody] TikfinityImportRequest req, CancellationToken ct)
    {
        var validation = ValidateCredentials(req);
        if (validation != null) return validation;

        var localChannelId = GetChannelId();
        if (localChannelId <= 0)
        {
            return BadRequest(new { error = "No local channel — log in to the clone first." });
        }

        var profileIds = (req.ProfileIds is { Length: > 0 } pids ? pids : new[] { 1 })
            .Where(p => p > 0)
            .Distinct()
            .ToArray();

        var summary = new Dictionary<int, ImportProfileSummary>();
        var firstProfile = 0;

        foreach (var pid in profileIds)
        {
            // Body { profileId: N } makes Tikfinity switch + return that
            // profile's data in one call. Free accounts only have profile 1
            // server-side — anything else returns the same data.
            var (meStatus, meBody) = await CallTikfinityMeAsync(req, pid, ct);
            if (meStatus != 200)
            {
                return BadRequest(new
                {
                    error = $"Tikfinity /api/me for profileId={pid} returned {meStatus}",
                    body = meBody.Length > 500 ? meBody[..500] : meBody
                });
            }

            var meDoc = JsonNode.Parse(meBody)?.AsObject();
            var channel = meDoc?["channel"]?.AsObject();
            var dynamicSettings = channel?["dynamicSettings"]?.AsObject();
            var serverProfileId = channel?["profileId"]?.GetValue<int>() ?? pid;
            if (firstProfile == 0) firstProfile = serverProfileId;

            var settingsCount = await ReplaceSettingsAsync(localChannelId, pid, dynamicSettings, ct);

            var (actStatus, actBody) = await CallTikfinityActionsAsync(req, pid, ct);
            if (actStatus != 200)
            {
                return BadRequest(new
                {
                    error = $"Tikfinity /api/rest/action for profileId={pid} returned {actStatus}",
                    body = actBody.Length > 500 ? actBody[..500] : actBody
                });
            }

            var actionsArray = JsonNode.Parse(actBody)?["actions"]?.AsArray();
            var actionsCount = await ReplaceActionsAsync(localChannelId, pid, actionsArray, ct);

            summary[pid] = new ImportProfileSummary(settingsCount, actionsCount, serverProfileId);
        }

        await _db.SaveChangesAsync(ct);

        // Make the imported state visible immediately: refresh the widget
        // settings cache for the active profile and broadcast actionsChanged
        // so any connected widget refetches.
        await _settingsCache.RebuildAndBroadcast(localChannelId);
        await _socketManager.BroadcastEvent("actionsChanged", new { });

        return Ok(new { status = 200, message = "OK", imported = summary });
    }

    private static IActionResult? ValidateCredentials(TikfinityCredentials creds)
    {
        if (string.IsNullOrWhiteSpace(creds.Token))
            return new BadRequestObjectResult(new { error = "Missing token (x-authorization-token)." });
        if (creds.ChannelId <= 0)
            return new BadRequestObjectResult(new { error = "Missing or invalid channelId (x-channel-id)." });
        if (string.IsNullOrWhiteSpace(creds.Signature))
            return new BadRequestObjectResult(new { error = "Missing signature (x-channel-signature)." });
        return null;
    }

    private async Task<(int status, string body)> CallTikfinityMeAsync(
        TikfinityCredentials creds, int? profileId, CancellationToken ct)
    {
        var bodyObj = new JsonObject();
        if (profileId.HasValue)
        {
            // Tikfinity's switchProfile path: bundle's switchProfile() calls
            // POST /api/me with just {profileId}. We mirror that exactly.
            bodyObj["profileId"] = profileId.Value;
        }
        else
        {
            // Plain "get current profile" call — bundle normally sends light
            // telemetry. Server ignores extras; we send zeros to satisfy
            // the JSON shape.
            bodyObj["channelName"] = "";
            bodyObj["ownerUserId"] = "";
            bodyObj["monthlyEarnings"] = 0;
            bodyObj["streamGifter"] = 0;
        }

        return await PostJsonAsync(creds, "/api/me", bodyObj.ToJsonString(), ct);
    }

    private async Task<(int status, string body)> CallTikfinityActionsAsync(
        TikfinityCredentials creds, int profileId, CancellationToken ct)
    {
        var url = $"/api/rest/action?channelId={creds.ChannelId}&profileId={profileId}&pageSize=5000";
        return await GetAsync(creds, url, ct);
    }

    private async Task<(int, string)> PostJsonAsync(TikfinityCredentials creds, string path, string json, CancellationToken ct)
    {
        var client = BuildClient();
        using var req = new HttpRequestMessage(HttpMethod.Post, TikfinityBase + path);
        ApplyAuthHeaders(req, creds);
        req.Content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            using var resp = await client.SendAsync(req, ct);
            var body = await resp.Content.ReadAsStringAsync(ct);
            return ((int)resp.StatusCode, body);
        }
        catch (TaskCanceledException)
        {
            return (0, "Request timed out after " + RequestTimeout.TotalSeconds + "s");
        }
        catch (HttpRequestException ex)
        {
            return (0, "HTTP error: " + ex.Message);
        }
    }

    private async Task<(int, string)> GetAsync(TikfinityCredentials creds, string path, CancellationToken ct)
    {
        var client = BuildClient();
        using var req = new HttpRequestMessage(HttpMethod.Get, TikfinityBase + path);
        ApplyAuthHeaders(req, creds);

        try
        {
            using var resp = await client.SendAsync(req, ct);
            var body = await resp.Content.ReadAsStringAsync(ct);
            return ((int)resp.StatusCode, body);
        }
        catch (TaskCanceledException)
        {
            return (0, "Request timed out after " + RequestTimeout.TotalSeconds + "s");
        }
        catch (HttpRequestException ex)
        {
            return (0, "HTTP error: " + ex.Message);
        }
    }

    private HttpClient BuildClient()
    {
        var client = _httpClientFactory.CreateClient();
        client.Timeout = RequestTimeout;
        client.DefaultRequestHeaders.UserAgent.ParseAdd(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36");
        return client;
    }

    private static void ApplyAuthHeaders(HttpRequestMessage req, TikfinityCredentials creds)
    {
        req.Headers.TryAddWithoutValidation("x-authorization-token", creds.Token);
        req.Headers.TryAddWithoutValidation("x-channel-id", creds.ChannelId.ToString());
        req.Headers.TryAddWithoutValidation("x-channel-signature", creds.Signature);
        req.Headers.TryAddWithoutValidation("x-requested-with", "XMLHttpRequest");
        req.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        req.Headers.Referrer = new Uri(TikfinityBase + "/");
    }

    // Wipe + reinsert for atomicity per (channel, profile). Avoids partial
    // state if a Tikfinity-side rename leaves orphans behind.
    private async Task<int> ReplaceSettingsAsync(int localChannelId, int profileId, JsonObject? settings, CancellationToken ct)
    {
        var existing = _db.DynamicSettings.Where(s => s.ChannelId == localChannelId && s.ProfileId == profileId);
        _db.DynamicSettings.RemoveRange(existing);
        await _db.SaveChangesAsync(ct);

        if (settings == null) return 0;

        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var inserted = 0;
        foreach (var kv in settings)
        {
            if (string.IsNullOrWhiteSpace(kv.Key) || !seen.Add(kv.Key)) continue;

            var value = kv.Value switch
            {
                null => "",
                JsonValue v when v.TryGetValue<string>(out var s) => s ?? "",
                _ => kv.Value!.ToJsonString()
            };

            _db.DynamicSettings.Add(new DynamicSetting
            {
                ChannelId = localChannelId,
                ProfileId = profileId,
                Key = kv.Key,
                Value = value
            });
            inserted++;
        }

        await _db.SaveChangesAsync(ct);
        return inserted;
    }

    private async Task<int> ReplaceActionsAsync(int localChannelId, int profileId, JsonArray? actions, CancellationToken ct)
    {
        var existing = _db.Actions.Where(a => a.ChannelId == localChannelId && a.ProfileId == profileId);
        _db.Actions.RemoveRange(existing);
        await _db.SaveChangesAsync(ct);

        if (actions == null) return 0;

        var inserted = 0;
        var order = 0;
        foreach (var node in actions)
        {
            if (node is not JsonObject obj) continue;

            var name = obj["name"]?.GetValue<string>() ?? $"Action {order + 1}";
            var configJson = obj.DeepClone().ToJsonString();

            _db.Actions.Add(new ActionItem
            {
                ChannelId = localChannelId,
                ProfileId = profileId,
                Name = name,
                Type = "", // bundle drives type via events.json, not the action itself
                TriggerValue = null,
                ConfigJson = configJson,
                Enabled = true,
                Sort = order++
            });
            inserted++;
        }

        await _db.SaveChangesAsync(ct);
        return inserted;
    }

    public class TikfinityCredentials
    {
        public string Token { get; set; } = "";
        public int ChannelId { get; set; }
        public string Signature { get; set; } = "";
    }

    public sealed class TikfinityImportRequest : TikfinityCredentials
    {
        public int[]? ProfileIds { get; set; }
    }

    private sealed record ImportProfileSummary(int Settings, int Actions, int ServerProfileId);
}
