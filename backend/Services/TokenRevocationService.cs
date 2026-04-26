using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;

namespace TikFinityBackend.Services;

/// <summary>
/// Tracks revoked JWT ids (jti) so that logging out truly invalidates a token
/// before its natural expiry. Uses an in-memory cache backed by SQLite so the
/// token validation hot path doesn't hit the database on every request.
/// </summary>
public sealed class TokenRevocationService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ConcurrentDictionary<string, DateTime> _cache = new();
    private DateTime _lastPurge = DateTime.MinValue;

    public TokenRevocationService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
        ReloadFromDatabase();
    }

    public bool IsRevoked(string? jti)
    {
        if (string.IsNullOrEmpty(jti))
        {
            return false;
        }

        PurgeExpiredIfNeeded();

        if (_cache.TryGetValue(jti, out var expiresAt))
        {
            if (expiresAt > DateTime.UtcNow)
            {
                return true;
            }

            _cache.TryRemove(jti, out _);
        }

        return false;
    }

    public async Task RevokeAsync(string jti, int channelId, DateTime expiresAt, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(jti))
        {
            return;
        }

        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var exists = await db.RevokedTokens.AnyAsync(r => r.Jti == jti, cancellationToken);
        if (!exists)
        {
            db.RevokedTokens.Add(new RevokedToken
            {
                Jti = jti,
                ChannelId = channelId,
                RevokedAt = DateTime.UtcNow,
                ExpiresAt = expiresAt
            });
            await db.SaveChangesAsync(cancellationToken);
        }

        _cache[jti] = expiresAt;
    }

    private void ReloadFromDatabase()
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var now = DateTime.UtcNow;
            var active = db.RevokedTokens.Where(r => r.ExpiresAt > now).ToList();
            foreach (var row in active)
            {
                _cache[row.Jti] = row.ExpiresAt;
            }
        }
        catch
        {
            // Table may not exist yet at first boot (before migrations run).
        }
    }

    private void PurgeExpiredIfNeeded()
    {
        if ((DateTime.UtcNow - _lastPurge).TotalMinutes < 10)
        {
            return;
        }

        _lastPurge = DateTime.UtcNow;
        var now = DateTime.UtcNow;
        foreach (var kv in _cache)
        {
            if (kv.Value <= now)
            {
                _cache.TryRemove(kv.Key, out _);
            }
        }

        try
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var expired = db.RevokedTokens.Where(r => r.ExpiresAt <= now);
            db.RevokedTokens.RemoveRange(expired);
            db.SaveChanges();
        }
        catch
        {
            // Best-effort; ignore transient DB errors.
        }
    }
}
