using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TikFinityBackend.Services;

public sealed class JwtService
{
    public static readonly TimeSpan AccessTokenLifetime = TimeSpan.FromDays(7);

    private readonly SymmetricSecurityKey _signingKey;
    private readonly string _issuer;
    private readonly string _audience;

    public JwtService(IConfiguration config)
    {
        var secret = config["Jwt:Secret"];
        if (string.IsNullOrWhiteSpace(secret) || secret.Length < 32)
        {
            throw new InvalidOperationException(
                "Jwt:Secret is missing or too short (min 32 chars). " +
                "Set a strong secret in appsettings.json or the JWT_SECRET environment variable before starting the server.");
        }

        _signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        _issuer = config["Jwt:Issuer"] ?? "TikFinityBackend";
        _audience = config["Jwt:Audience"] ?? "TikFinityFrontend";
    }

    public SymmetricSecurityKey SigningKey => _signingKey;
    public string Issuer => _issuer;
    public string Audience => _audience;

    public (string Token, string Jti, DateTime ExpiresAt) GenerateToken(
        int channelId, string channelName, string email, bool isPro)
    {
        var jti = Guid.NewGuid().ToString("N");
        var expiresAt = DateTime.UtcNow.Add(AccessTokenLifetime);

        var claims = new[]
        {
            new Claim("channelId", channelId.ToString()),
            new Claim("channelName", channelName),
            new Claim(ClaimTypes.Email, email),
            new Claim("isPro", isPro ? "true" : "false"),
            new Claim(JwtRegisteredClaimNames.Jti, jti)
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expiresAt,
            signingCredentials: new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256)
        );

        return (new JwtSecurityTokenHandler().WriteToken(token), jti, expiresAt);
    }

    public string GenerateFeaturebaseToken(string name, string email, string userId)
    {
        var now = DateTimeOffset.UtcNow;
        var claims = new List<Claim>
        {
            new("name", string.IsNullOrWhiteSpace(name) ? "user" : name),
            new("userId", string.IsNullOrWhiteSpace(userId) ? "0" : userId),
            new(JwtRegisteredClaimNames.Iat, now.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        if (!string.IsNullOrWhiteSpace(email))
        {
            claims.Add(new Claim("email", email));
        }

        var token = new JwtSecurityToken(
            claims: claims,
            notBefore: now.UtcDateTime,
            expires: now.AddDays(30).UtcDateTime,
            signingCredentials: new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        try
        {
            var handler = new JwtSecurityTokenHandler();
            return handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _signingKey,
                ValidateIssuer = true,
                ValidIssuer = _issuer,
                ValidateAudience = true,
                ValidAudience = _audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(1)
            }, out _);
        }
        catch
        {
            return null;
        }
    }
}
