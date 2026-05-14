using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TikFinityBackend.Controllers;

/// <summary>
/// TikTok TTS proxy. Mirrors Tikfinity's <c>tikfinity-tts-api.zerody.one</c>
/// endpoint so the bundle's TTS module works without depending on Tikfinity's
/// commercial proxy. Reuses the same <c>sessionid</c> cookie the bridge uses.
///
/// Endpoint: GET /api/tts/generate?voice=&lt;voice&gt;&amp;text=&lt;text&gt;
/// Returns audio/mpeg (MP3) on success.
///
/// Voice IDs are TikTok's official speaker codes (en_uk_001, en_us_002,
/// jp_001, ...). Same list Tikfinity exposes.
/// </summary>
[ApiController]
[Route("api/tts")]
[AllowAnonymous]
public class TtsController : ControllerBase
{
    // useast1a works for all regions in testing; useast2a returns 411.
    private const string TikTokTtsEndpoint =
        "https://api16-normal-c-useast1a.tiktokv.com/media/api/text/speech/invoke/";

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<TtsController> _logger;

    public TtsController(IHttpClientFactory httpClientFactory, ILogger<TtsController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    [HttpGet("generate")]
    public async Task<IActionResult> Generate(
        [FromQuery] string voice = "en_us_002",
        [FromQuery] string text = "",
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return BadRequest(new { error = "text is required" });
        }

        // Truncate to TikTok's max (~300 chars per call)
        var trimmed = text.Length > 300 ? text[..300] : text;

        var sessionId = ReadStoredSessionId();
        if (string.IsNullOrWhiteSpace(sessionId))
        {
            _logger.LogWarning("[TTS] No TikTok sessionid available. User needs to sign in via TikTok login flow first.");
            return StatusCode(503, new { error = "tiktok_session_missing", message = "Sign in to TikTok first to enable TTS" });
        }

        try
        {
            var audio = await CallTikTokTts(voice, trimmed, sessionId, cancellationToken);
            if (audio == null)
            {
                return StatusCode(502, new { error = "tts_upstream_failed" });
            }
            return File(audio, "audio/mpeg");
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[TTS] generate failed voice={Voice}", voice);
            return StatusCode(502, new { error = "tts_upstream_exception", message = ex.Message });
        }
    }

    private async Task<byte[]?> CallTikTokTts(
        string voice,
        string text,
        string sessionId,
        CancellationToken cancellationToken)
    {
        var url = $"{TikTokTtsEndpoint}?text_speaker={Uri.EscapeDataString(voice)}" +
                  $"&req_text={Uri.EscapeDataString(text)}" +
                  "&speaker_map_type=0&aid=1233";

        var client = _httpClientFactory.CreateClient("tiktok-tts");
        client.Timeout = TimeSpan.FromSeconds(15);

        using var req = new HttpRequestMessage(HttpMethod.Post, url);
        req.Headers.TryAddWithoutValidation("User-Agent", "com.zhiliaoapp.musically/2022600030 (Linux; U; Android 7.1.2; es_ES; SM-G988N; Build/NRD90M;tt-ok/3.12.13.1)");
        req.Headers.TryAddWithoutValidation("Cookie", $"sessionid={sessionId}");
        req.Headers.TryAddWithoutValidation("Accept", "application/json");

        using var resp = await client.SendAsync(req, cancellationToken);
        if (!resp.IsSuccessStatusCode)
        {
            _logger.LogWarning("[TTS] TikTok returned {Status}", resp.StatusCode);
            return null;
        }

        await using var stream = await resp.Content.ReadAsStreamAsync(cancellationToken);
        var payload = await JsonSerializer.DeserializeAsync<TikTokTtsResponse>(stream, cancellationToken: cancellationToken);

        if (payload?.StatusCode != 0)
        {
            _logger.LogWarning("[TTS] TikTok error status_code={Code} msg={Msg}",
                payload?.StatusCode, payload?.StatusMsg);
            return null;
        }

        if (string.IsNullOrEmpty(payload.Data?.VStr))
        {
            _logger.LogWarning("[TTS] TikTok returned empty audio data");
            return null;
        }

        try
        {
            return Convert.FromBase64String(payload.Data.VStr);
        }
        catch (FormatException ex)
        {
            _logger.LogError(ex, "[TTS] Failed to base64-decode TikTok response");
            return null;
        }
    }

    /// <summary>
    /// Read sessionid from the file that the bridge + Electron auth-flow share.
    /// Path: %APPDATA%/tikfinity-desktop/tiktok-session.json
    /// </summary>
    private static string? ReadStoredSessionId()
    {
        // Env var override (parity with bridge)
        var envSessionId = Environment.GetEnvironmentVariable("TIKTOK_SESSIONID");
        if (!string.IsNullOrWhiteSpace(envSessionId)) return envSessionId;

        var path = ResolveSessionFilePath();
        if (string.IsNullOrEmpty(path) || !System.IO.File.Exists(path)) return null;

        try
        {
            var raw = System.IO.File.ReadAllText(path);
            var data = JsonSerializer.Deserialize<TikTokSessionFile>(raw);
            if (string.IsNullOrWhiteSpace(data?.SessionId)) return null;

            if (!string.IsNullOrWhiteSpace(data.ExpiresAt) &&
                DateTime.TryParse(data.ExpiresAt, out var exp) &&
                exp <= DateTime.UtcNow)
            {
                return null;
            }

            return data.SessionId;
        }
        catch
        {
            return null;
        }
    }

    private static string? ResolveSessionFilePath()
    {
        var envPath = Environment.GetEnvironmentVariable("TIKTOK_SESSION_FILE");
        if (!string.IsNullOrWhiteSpace(envPath)) return envPath;

        const string productDir = "tikfinity-desktop";
        const string fileName = "tiktok-session.json";

        if (OperatingSystem.IsWindows())
        {
            var appData = Environment.GetEnvironmentVariable("APPDATA");
            if (string.IsNullOrEmpty(appData)) return null;
            return System.IO.Path.Combine(appData, productDir, fileName);
        }

        if (OperatingSystem.IsMacOS())
        {
            var home = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
            return System.IO.Path.Combine(home, "Library", "Application Support", productDir, fileName);
        }

        var xdgHome = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
        return System.IO.Path.Combine(xdgHome, ".config", productDir, fileName);
    }

    private sealed class TikTokTtsResponse
    {
        [System.Text.Json.Serialization.JsonPropertyName("data")]
        public TikTokTtsData? Data { get; set; }

        [System.Text.Json.Serialization.JsonPropertyName("status_code")]
        public int StatusCode { get; set; }

        [System.Text.Json.Serialization.JsonPropertyName("status_msg")]
        public string? StatusMsg { get; set; }
    }

    private sealed class TikTokTtsData
    {
        [System.Text.Json.Serialization.JsonPropertyName("v_str")]
        public string? VStr { get; set; }

        [System.Text.Json.Serialization.JsonPropertyName("duration")]
        public string? Duration { get; set; }
    }

    private sealed class TikTokSessionFile
    {
        [System.Text.Json.Serialization.JsonPropertyName("sessionId")]
        public string? SessionId { get; set; }

        [System.Text.Json.Serialization.JsonPropertyName("expiresAt")]
        public string? ExpiresAt { get; set; }
    }
}
