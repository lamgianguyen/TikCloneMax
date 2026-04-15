using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TikFinityBackend.Services;

public class JwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(int channelId, string channelName, string email, bool isPro)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _config["Jwt:Secret"] ?? "TikFinityBackendSuperSecretKey2024!@#$%^&*()"));

        var claims = new[]
        {
            new Claim("channelId", channelId.ToString()),
            new Claim("channelName", channelName),
            new Claim(ClaimTypes.Email, email),
            new Claim("isPro", isPro.ToString().ToLower()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"] ?? "TikFinityBackend",
            audience: _config["Jwt:Audience"] ?? "TikFinityFrontend",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(30),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateFeaturebaseToken(string name, string email, string userId)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _config["Jwt:Secret"] ?? "TikFinityBackendSuperSecretKey2024!@#$%^&*()"));

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
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _config["Jwt:Secret"] ?? "TikFinityBackendSuperSecretKey2024!@#$%^&*()"));

        try
        {
            var handler = new JwtSecurityTokenHandler();
            return handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = _config["Jwt:Issuer"] ?? "TikFinityBackend",
                ValidateAudience = true,
                ValidAudience = _config["Jwt:Audience"] ?? "TikFinityFrontend",
                ValidateLifetime = true
            }, out _);
        }
        catch
        {
            return null;
        }
    }
}
