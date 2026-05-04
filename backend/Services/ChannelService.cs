using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;

namespace TikFinityBackend.Services;

public class ChannelService
{
    private readonly AppDbContext _db;

    public ChannelService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Channel> FindOrCreateByGoogle(string googleId, string email, string name, string? avatarUrl)
    {
        var channel = await _db.Channels
            .Include(c => c.Subscription)
            .Include(c => c.Profiles)
            .Include(c => c.Modules)
            .FirstOrDefaultAsync(c => c.GoogleId == googleId);

        if (channel != null)
        {
            channel.Email = email;
            channel.AvatarUrl = avatarUrl;
            channel.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return channel;
        }

        // Generate unique channel name
        var baseName = name.Replace(" ", "").ToLower();
        var channelName = baseName;
        var counter = 1;
        while (await _db.Channels.AnyAsync(c => c.ChannelName == channelName))
        {
            channelName = $"{baseName}{counter++}";
        }

        channel = new Channel
        {
            ChannelName = channelName,
            ChannelSignature = GenerateSignature(),
            GoogleId = googleId,
            Email = email,
            AvatarUrl = avatarUrl,
            Sub = $"social:{email}",
            SignupAuthProvider = "social"
        };

        _db.Channels.Add(channel);
        await _db.SaveChangesAsync();

        // Create default subscription (free)
        _db.Subscriptions.Add(new Subscription
        {
            ChannelId = channel.ChannelId,
            IsPro = false,
            Plan = "free",
            Active = true
        });

        // Create default profile
        _db.Profiles.Add(new Profile
        {
            ChannelId = channel.ChannelId,
            Name = "Default",
            Sort = 0
        });

        // Create default modules
        foreach (var (id, mName, sort) in GetDefaultModules())
        {
            _db.ChannelModules.Add(new ChannelModule
            {
                ChannelId = channel.ChannelId,
                ModuleId = id,
                Name = mName,
                Sort = sort,
                Enabled = true
            });
        }

        await _db.SaveChangesAsync();

        // Reload with includes
        return (await _db.Channels
            .Include(c => c.Subscription)
            .Include(c => c.Profiles)
            .Include(c => c.Modules)
            .FirstAsync(c => c.ChannelId == channel.ChannelId));
    }

    public async Task<Channel> CreateWithEmail(string email, string passwordHash, string name)
    {
        var baseName = name.Replace(" ", "").ToLower();
        var channelName = baseName;
        var counter = 1;
        while (await _db.Channels.AnyAsync(c => c.ChannelName == channelName))
        {
            channelName = $"{baseName}{counter++}";
        }

        var channel = new Channel
        {
            ChannelName = channelName,
            ChannelSignature = GenerateSignature(),
            Email = email,
            PasswordHash = passwordHash,
            Sub = $"email:{email}",
            SignupAuthProvider = "email"
        };

        _db.Channels.Add(channel);
        await _db.SaveChangesAsync();

        _db.Subscriptions.Add(new Subscription
        {
            ChannelId = channel.ChannelId,
            IsPro = false,
            Plan = "free",
            Active = true
        });

        _db.Profiles.Add(new Profile
        {
            ChannelId = channel.ChannelId,
            Name = "Default",
            Sort = 0
        });

        foreach (var (id, mName, sort) in GetDefaultModules())
        {
            _db.ChannelModules.Add(new ChannelModule
            {
                ChannelId = channel.ChannelId,
                ModuleId = id,
                Name = mName,
                Sort = sort,
                Enabled = true
            });
        }

        await _db.SaveChangesAsync();

        return (await _db.Channels
            .Include(c => c.Subscription)
            .Include(c => c.Profiles)
            .Include(c => c.Modules)
            .FirstAsync(c => c.ChannelId == channel.ChannelId));
    }

    public async Task<Channel> CreateLocalAccount(string username, string email, string passwordHash)
    {
        var channel = new Channel
        {
            ChannelName = username,
            ChannelSignature = GenerateSignature(),
            Email = email,
            PasswordHash = passwordHash,
            Sub = $"email:{email}",
            SignupAuthProvider = "email",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Channels.Add(channel);
        await _db.SaveChangesAsync();

        _db.Subscriptions.Add(new Subscription
        {
            ChannelId = channel.ChannelId,
            IsPro = false,
            Plan = "free",
            Active = true
        });

        _db.Profiles.Add(new Profile
        {
            ChannelId = channel.ChannelId,
            Name = "Default",
            Sort = 0
        });

        foreach (var (id, mName, sort) in GetDefaultModules())
        {
            _db.ChannelModules.Add(new ChannelModule
            {
                ChannelId = channel.ChannelId,
                ModuleId = id,
                Name = mName,
                Sort = sort,
                Enabled = true
            });
        }

        await _db.SaveChangesAsync();

        return (await _db.Channels
            .Include(c => c.Subscription)
            .Include(c => c.Profiles)
            .Include(c => c.Modules)
            .FirstAsync(c => c.ChannelId == channel.ChannelId));
    }

    public async Task<Channel> FindOrCreateByLicenseKey(string keyId, DateTime licenseExpiresAt)
    {
        // Synthesize a channel name fitting the 32-char limit: keyId minus dashes, lowercased,
        // truncated. License keys are unique, so this is unique by construction.
        var sanitized = keyId.Replace("-", "").ToLowerInvariant();
        var channelName = sanitized.Length > 28 ? sanitized[..28] : sanitized;

        var channel = await _db.Channels
            .Include(c => c.Subscription)
            .FirstOrDefaultAsync(c => c.ChannelName == channelName && c.SignupAuthProvider == "license");

        var now = DateTime.UtcNow;
        var licenseIsActive = licenseExpiresAt > now;

        if (channel != null)
        {
            channel.UpdatedAt = now;
            if (channel.Subscription != null)
            {
                channel.Subscription.IsPro = licenseIsActive;
                channel.Subscription.Active = licenseIsActive;
                channel.Subscription.Plan = licenseIsActive ? "pro" : "free";
                channel.Subscription.ProExpireAt = licenseExpiresAt;
                channel.Subscription.ProExpireSetBy = "license";
                channel.Subscription.UpdatedAt = now;
            }
            await UpsertLicenseSetting(channel.ChannelId, keyId, licenseExpiresAt);
            await _db.SaveChangesAsync();
            return channel;
        }

        channel = new Channel
        {
            ChannelName = channelName,
            ChannelSignature = GenerateSignature(),
            Email = $"{channelName}@license.local",
            Sub = $"license:{keyId}",
            SignupAuthProvider = "license",
            CreatedAt = now,
            UpdatedAt = now
        };
        _db.Channels.Add(channel);
        await _db.SaveChangesAsync();

        _db.Subscriptions.Add(new Subscription
        {
            ChannelId = channel.ChannelId,
            IsPro = licenseIsActive,
            Plan = licenseIsActive ? "pro" : "free",
            Active = licenseIsActive,
            ProExpireAt = licenseExpiresAt,
            ProExpireSetBy = "license"
        });
        _db.Profiles.Add(new Profile { ChannelId = channel.ChannelId, Name = "Default", Sort = 0 });
        foreach (var (id, mName, sort) in GetDefaultModules())
        {
            _db.ChannelModules.Add(new ChannelModule
            {
                ChannelId = channel.ChannelId,
                ModuleId = id,
                Name = mName,
                Sort = sort,
                Enabled = true
            });
        }
        await _db.SaveChangesAsync();
        await UpsertLicenseSetting(channel.ChannelId, keyId, licenseExpiresAt);
        await _db.SaveChangesAsync();

        return await _db.Channels
            .Include(c => c.Subscription)
            .Include(c => c.Profiles)
            .Include(c => c.Modules)
            .FirstAsync(c => c.ChannelId == channel.ChannelId);
    }

    private async Task UpsertLicenseSetting(int channelId, string keyId, DateTime expiresAt)
    {
        async Task Upsert(string key, string value)
        {
            var existing = await _db.DynamicSettings
                .FirstOrDefaultAsync(s => s.ChannelId == channelId && s.Key == key);
            if (existing == null)
                _db.DynamicSettings.Add(new DynamicSetting { ChannelId = channelId, Key = key, Value = value });
            else
                existing.Value = value;
        }
        await Upsert("license_keyid", keyId);
        await Upsert("license_expires_at", expiresAt.ToString("O"));
        await Upsert("license_validated_at", DateTime.UtcNow.ToString("O"));
    }

    private static string GenerateSignature()
    {
        const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        return new string(Enumerable.Range(0, 10).Select(_ => chars[random.Next(chars.Length)]).ToArray());
    }

    private static (string id, string name, int sort)[] GetDefaultModules() =>
    [
        ("actions", "Actions & Events", 1),
        ("events", "Events", 2),
        ("sounds", "Sound Alerts", 3),
        ("tts", "Text to Speech", 4),
        ("media", "Media Share", 5),
        ("timers", "Timers", 6),
        ("commands", "Chat Commands", 7),
        ("spotify", "Spotify Integration", 8),
        ("webhooks", "Webhooks", 9),
        ("overlays", "Overlays", 10)
    ];
}
