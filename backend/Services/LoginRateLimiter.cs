using System.Collections.Concurrent;

namespace TikFinityBackend.Services;

/// <summary>
/// Tracks failed login attempts per (ip + identifier) key and enforces a
/// short cool-off after repeated failures. In-memory only; fine for a
/// single-node local backend.
/// </summary>
public sealed class LoginRateLimiter
{
    private const int MaxAttempts = 8;
    private const int WindowSeconds = 300;
    private const int BlockSeconds = 600;

    private readonly ConcurrentDictionary<string, Bucket> _buckets = new();

    public bool IsBlocked(string key, out TimeSpan retryAfter)
    {
        retryAfter = TimeSpan.Zero;
        if (!_buckets.TryGetValue(key, out var bucket))
        {
            return false;
        }

        if (bucket.BlockedUntil > DateTime.UtcNow)
        {
            retryAfter = bucket.BlockedUntil - DateTime.UtcNow;
            return true;
        }

        return false;
    }

    public void RegisterFailure(string key)
    {
        var now = DateTime.UtcNow;
        _buckets.AddOrUpdate(
            key,
            _ => new Bucket { WindowStart = now, Attempts = 1 },
            (_, existing) =>
            {
                if ((now - existing.WindowStart).TotalSeconds > WindowSeconds)
                {
                    existing.WindowStart = now;
                    existing.Attempts = 0;
                }

                existing.Attempts++;
                if (existing.Attempts >= MaxAttempts)
                {
                    existing.BlockedUntil = now.AddSeconds(BlockSeconds);
                    existing.Attempts = 0;
                    existing.WindowStart = now;
                }

                return existing;
            });
    }

    public void Reset(string key) => _buckets.TryRemove(key, out _);

    private sealed class Bucket
    {
        public DateTime WindowStart { get; set; }
        public int Attempts { get; set; }
        public DateTime BlockedUntil { get; set; }
    }
}
