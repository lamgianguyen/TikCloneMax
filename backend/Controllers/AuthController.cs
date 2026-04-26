using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Services;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api/auth")]
[Route("api/v1/auth")]
public sealed class AuthController : ControllerBase
{
    private const int MinPasswordLength = 8;

    private readonly AppDbContext _db;
    private readonly ChannelService _channelService;
    private readonly JwtService _jwtService;
    private readonly PasswordHasher _hasher;
    private readonly TokenRevocationService _revocation;
    private readonly LoginRateLimiter _rateLimiter;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        AppDbContext db,
        ChannelService channelService,
        JwtService jwtService,
        PasswordHasher hasher,
        TokenRevocationService revocation,
        LoginRateLimiter rateLimiter,
        ILogger<AuthController> logger)
    {
        _db = db;
        _channelService = channelService;
        _jwtService = jwtService;
        _hasher = hasher;
        _revocation = revocation;
        _rateLimiter = rateLimiter;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto, CancellationToken cancellationToken)
    {
        var username = dto.Username?.Trim() ?? "";
        var email = dto.Email?.Trim().ToLowerInvariant() ?? "";
        var password = dto.Password ?? "";

        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            return BadRequest(new { status = "error", message = "All fields are required" });
        }

        if (username.Length < 3 || username.Length > 32)
        {
            return BadRequest(new { status = "error", message = "Username must be 3-32 characters" });
        }

        if (!IsValidEmail(email))
        {
            return BadRequest(new { status = "error", message = "Invalid email format" });
        }

        if (password.Length < MinPasswordLength)
        {
            return BadRequest(new { status = "error", message = $"Password must be at least {MinPasswordLength} characters" });
        }

        var exists = await _db.Channels
            .AnyAsync(c => c.ChannelName == username || c.Email == email, cancellationToken);
        if (exists)
        {
            return Conflict(new { status = "error", message = "Username or email already exists" });
        }

        var channel = await _channelService.CreateLocalAccount(username, email, _hasher.Hash(password));

        var subscription = await _db.Subscriptions.FirstOrDefaultAsync(s => s.ChannelId == channel.ChannelId, cancellationToken);
        var isPro = subscription?.IsPro ?? false;

        var (token, _, _) = _jwtService.GenerateToken(channel.ChannelId, channel.ChannelName, email, isPro);

        _logger.LogInformation("[AUTH] Register ok: {Username} (channelId={ChannelId})", username, channel.ChannelId);

        return Ok(new
        {
            status = "ok",
            accessToken = token,
            channelId = channel.ChannelId,
            channelName = channel.ChannelName,
            email,
            isPro
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken cancellationToken)
    {
        var identifier = (dto.Username ?? dto.Email ?? "").Trim();
        var password = dto.Password ?? "";

        if (string.IsNullOrEmpty(identifier) || string.IsNullOrEmpty(password))
        {
            return BadRequest(new { status = "error", message = "Username and password are required" });
        }

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var rateKey = $"{ip}|{identifier.ToLowerInvariant()}";
        if (_rateLimiter.IsBlocked(rateKey, out var retryAfter))
        {
            Response.Headers.RetryAfter = ((int)retryAfter.TotalSeconds).ToString();
            return StatusCode(StatusCodes.Status429TooManyRequests,
                new { status = "error", message = "Too many failed attempts. Try again later." });
        }

        var normalizedEmail = identifier.ToLowerInvariant();
        var channel = await _db.Channels
            .Include(c => c.Subscription)
            .FirstOrDefaultAsync(c => c.ChannelName == identifier || c.Email == normalizedEmail, cancellationToken);

        if (channel == null || !_hasher.Verify(password, channel.PasswordHash))
        {
            _rateLimiter.RegisterFailure(rateKey);
            if (channel != null)
            {
                channel.FailedLoginCount++;
                if (channel.FailedLoginCount >= 10)
                {
                    channel.LockedUntil = DateTime.UtcNow.AddMinutes(15);
                }
                await _db.SaveChangesAsync(cancellationToken);
            }
            _logger.LogWarning("[AUTH] Login failed for {Identifier} from {Ip}", identifier, ip);
            return Unauthorized(new { status = "error", message = "Invalid username or password" });
        }

        if (channel.LockedUntil.HasValue && channel.LockedUntil > DateTime.UtcNow)
        {
            return StatusCode(StatusCodes.Status423Locked,
                new { status = "error", message = "Account temporarily locked. Try again later." });
        }

        if (_hasher.NeedsRehash(channel.PasswordHash))
        {
            channel.PasswordHash = _hasher.Hash(password);
        }

        channel.LastLoginAt = DateTime.UtcNow;
        channel.LastLoginIp = ip;
        channel.FailedLoginCount = 0;
        channel.LockedUntil = null;
        channel.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);

        _rateLimiter.Reset(rateKey);

        var isPro = channel.Subscription?.IsPro ?? false;
        var (token, _, _) = _jwtService.GenerateToken(channel.ChannelId, channel.ChannelName, channel.Email, isPro);

        _logger.LogInformation("[AUTH] Login ok: {Username} from {Ip}", channel.ChannelName, ip);

        return Ok(new
        {
            status = "ok",
            accessToken = token,
            channelId = channel.ChannelId,
            channelName = channel.ChannelName,
            email = channel.Email,
            isPro
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        var principal = TryGetPrincipal();
        if (principal == null)
        {
            return Ok(new { status = "ok", message = "Logged out" });
        }

        var jti = principal.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;
        var expClaim = principal.FindFirst(JwtRegisteredClaimNames.Exp)?.Value;
        var channelIdClaim = principal.FindFirst("channelId")?.Value;

        if (!string.IsNullOrEmpty(jti))
        {
            var expiresAt = DateTime.UtcNow.Add(JwtService.AccessTokenLifetime);
            if (long.TryParse(expClaim, out var expUnix))
            {
                expiresAt = DateTimeOffset.FromUnixTimeSeconds(expUnix).UtcDateTime;
            }

            int.TryParse(channelIdClaim, out var channelId);
            await _revocation.RevokeAsync(jti, channelId, expiresAt, cancellationToken);
            _logger.LogInformation("[AUTH] Logout revoked token jti={Jti} channelId={ChannelId}", jti, channelId);
        }

        return Ok(new { status = "ok", message = "Logged out" });
    }

    // Legacy endpoints kept for obfuscated-frontend compatibility. They no longer
    // issue access tokens; clients must go through /login or /register.
    [HttpPost("/api/v1/code/send")]
    public IActionResult CodeSend() =>
        Ok(new { status = "ok", flowId = "local-flow-001" });

    [HttpPost("/api/v1/code/validate")]
    public IActionResult CodeValidate() =>
        Unauthorized(new { status = "error", message = "Login via /api/v1/auth/login" });

    [HttpGet("/api/v1/flow/start")]
    [HttpPost("/api/v1/flow/start")]
    public IActionResult FlowStart([FromQuery] string? appId, [FromQuery] string? redirectUrl)
    {
        _logger.LogInformation("[AUTH] Flow start appId={AppId} redirect={Redirect}", appId, redirectUrl);
        var accept = Request.Headers.Accept.ToString();
        if (accept.Contains("text/html"))
        {
            return Content(LoginPopupHtml.Build(redirectUrl), "text/html");
        }
        return Ok(new { status = "ok", flowId = "local-flow-001", appId = appId ?? "tikfinity" });
    }

    [HttpGet("/api/v1/flow/end")]
    [HttpPost("/api/v1/flow/end")]
    [HttpGet("/api/v1/flow/logout")]
    [HttpPost("/api/v1/flow/logout")]
    public IActionResult FlowLogout([FromQuery] string? redirectUrl) =>
        Redirect(BuildLogoutUrl(redirectUrl));

    [HttpGet("/api/v1/flow/callback")]
    [HttpPost("/api/v1/flow/callback")]
    public IActionResult FlowCallback() =>
        Unauthorized(new { status = "error", message = "Login via /api/v1/auth/login" });

    [HttpGet("/api/v1/flow/status")]
    [HttpPost("/api/v1/flow/status")]
    public IActionResult FlowStatus([FromQuery] string? flowId) =>
        Ok(new { status = "ok", flowId = flowId ?? "local-flow-001", completed = true });

    private ClaimsPrincipal? TryGetPrincipal()
    {
        var header = Request.Headers.Authorization.ToString();
        if (string.IsNullOrWhiteSpace(header) || !header.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var token = header["Bearer ".Length..].Trim();
        return string.IsNullOrEmpty(token) ? null : _jwtService.ValidateToken(token);
    }

    private static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email) || email.Length > 254)
        {
            return false;
        }

        try
        {
            var addr = new MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    private static string BuildLogoutUrl(string? redirectUrl)
    {
        if (string.IsNullOrWhiteSpace(redirectUrl))
        {
            return "/logout";
        }

        string? safeNext = null;

        if (Uri.TryCreate(redirectUrl, UriKind.Absolute, out var abs))
        {
            if (abs.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase))
            {
                safeNext = abs.PathAndQuery + abs.Fragment;
            }
        }
        else if (redirectUrl.StartsWith("/"))
        {
            safeNext = redirectUrl;
        }

        return string.IsNullOrWhiteSpace(safeNext)
            ? "/logout"
            : "/logout?next=" + Uri.EscapeDataString(safeNext);
    }
}

public sealed record RegisterDto(string? Username, string? Email, string? Password, string? Name);
public sealed record LoginDto(string? Username, string? Email, string? Password);
