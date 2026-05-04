using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class KeyAuthController : ControllerBase
{
    private readonly ChannelService _channels;
    private readonly JwtService _jwt;
    private readonly IHttpClientFactory _httpFactory;
    private readonly IConfiguration _config;
    private readonly ILogger<KeyAuthController> _logger;

    public KeyAuthController(
        ChannelService channels,
        JwtService jwt,
        IHttpClientFactory httpFactory,
        IConfiguration config,
        ILogger<KeyAuthController> logger)
    {
        _channels = channels;
        _jwt = jwt;
        _httpFactory = httpFactory;
        _config = config;
        _logger = logger;
    }

    [HttpPost("key-login")]
    public async Task<IActionResult> KeyLogin([FromBody] KeyLoginDto dto, CancellationToken ct)
    {
        var keyId = dto.KeyId?.Trim().ToUpperInvariant() ?? "";
        if (string.IsNullOrEmpty(keyId))
            return BadRequest(new { status = "error", reason = "INVALID_INPUT", message = "Vui lòng nhập Serial Key." });

        var baseUrl = (_config["LicenseServer:BaseUrl"] ?? "http://localhost:5194").TrimEnd('/');
        var validateUrl = $"{baseUrl}/api/keys/validate";

        ValidateResponse? result;
        try
        {
            using var http = _httpFactory.CreateClient("license");
            http.Timeout = TimeSpan.FromSeconds(10);
            var resp = await http.PostAsJsonAsync(validateUrl,
                new { keyId, keyCode = dto.KeyCode }, ct);
            if (!resp.IsSuccessStatusCode)
            {
                _logger.LogWarning("[KEY-AUTH] License server returned {Status}", resp.StatusCode);
                return StatusCode(502, new
                {
                    status = "error",
                    reason = "UPSTREAM_ERROR",
                    message = $"License server lỗi ({(int)resp.StatusCode})."
                });
            }
            result = await resp.Content.ReadFromJsonAsync<ValidateResponse>(cancellationToken: ct);
        }
        catch (TaskCanceledException)
        {
            _logger.LogWarning("[KEY-AUTH] License server timeout");
            return StatusCode(504, new { status = "error", reason = "TIMEOUT", message = "License server không phản hồi." });
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "[KEY-AUTH] Cannot reach license server at {Url}", validateUrl);
            return StatusCode(503, new
            {
                status = "error",
                reason = "UNREACHABLE",
                message = "Không kết nối được tới license server. Kiểm tra mạng hoặc URL.",
                licenseServerUrl = baseUrl
            });
        }

        if (result == null)
            return StatusCode(502, new { status = "error", reason = "BAD_RESPONSE", message = "License server trả response rỗng." });

        if (!result.Valid)
        {
            return Unauthorized(new
            {
                status = "error",
                reason = result.Reason ?? "INVALID",
                message = result.Message ?? "Serial Key không hợp lệ.",
                expiredAt = result.ExpiredAt
            });
        }

        var expiresAt = result.ExpiredAt ?? DateTime.UtcNow.AddYears(1);
        var channel = await _channels.FindOrCreateByLicenseKey(keyId, expiresAt);
        var isPro = channel.Subscription?.IsPro ?? true;

        var (token, _, _) = _jwt.GenerateToken(channel.ChannelId, channel.ChannelName, channel.Email, isPro);

        _logger.LogInformation("[KEY-AUTH] Login ok keyId={KeyId} channelId={ChannelId} daysLeft={DaysLeft}",
            keyId, channel.ChannelId, result.DaysLeft);

        return Ok(new
        {
            status = "ok",
            accessToken = token,
            channelId = channel.ChannelId,
            channelName = channel.ChannelName,
            isPro,
            license = new
            {
                keyId,
                expiredAt = result.ExpiredAt,
                daysLeft = result.DaysLeft
            }
        });
    }

    private sealed class ValidateResponse
    {
        [JsonPropertyName("valid")] public bool Valid { get; set; }
        [JsonPropertyName("reason")] public string? Reason { get; set; }
        [JsonPropertyName("message")] public string? Message { get; set; }
        [JsonPropertyName("keyId")] public string? KeyId { get; set; }
        [JsonPropertyName("expiredAt")] public DateTime? ExpiredAt { get; set; }
        [JsonPropertyName("daysLeft")] public int? DaysLeft { get; set; }
    }
}

public sealed record KeyLoginDto(string? KeyId, string? KeyCode);
