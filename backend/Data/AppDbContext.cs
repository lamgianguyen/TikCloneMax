using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Models;

namespace TikFinityBackend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Channel> Channels => Set<Channel>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<DynamicSetting> DynamicSettings => Set<DynamicSetting>();
    public DbSet<Sound> Sounds => Set<Sound>();
    public DbSet<ActionItem> Actions => Set<ActionItem>();
    public DbSet<ChannelModule> ChannelModules => Set<ChannelModule>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Overlay> Overlays => Set<Overlay>();
    public DbSet<Widget> Widgets => Set<Widget>();
    public DbSet<ChatCommand> ChatCommands => Set<ChatCommand>();
    public DbSet<Goal> Goals => Set<Goal>();
    public DbSet<TimerItem> Timers => Set<TimerItem>();
    public DbSet<Webhook> Webhooks => Set<Webhook>();
    public DbSet<RevokedToken> RevokedTokens => Set<RevokedToken>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // Channel
        mb.Entity<Channel>(e =>
        {
            e.HasKey(c => c.ChannelId);
            e.Property(c => c.ChannelId).ValueGeneratedOnAdd();
            e.HasIndex(c => c.GoogleId).IsUnique().HasFilter("GoogleId IS NOT NULL");
            e.HasIndex(c => c.Email).IsUnique().HasFilter("Email <> ''");
            e.HasIndex(c => c.ChannelName).IsUnique();
        });

        // RevokedToken
        mb.Entity<RevokedToken>(e =>
        {
            e.HasKey(r => r.Id);
            e.Property(r => r.Jti).HasMaxLength(64).IsRequired();
            e.HasIndex(r => r.Jti).IsUnique();
            e.HasIndex(r => r.ExpiresAt);
        });

        // Subscription 1:1
        mb.Entity<Subscription>(e =>
        {
            e.HasOne(s => s.Channel)
             .WithOne(c => c.Subscription)
             .HasForeignKey<Subscription>(s => s.ChannelId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Profile
        mb.Entity<Profile>(e =>
        {
            e.HasOne(p => p.Channel)
             .WithMany(c => c.Profiles)
             .HasForeignKey(p => p.ChannelId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // DynamicSetting
        mb.Entity<DynamicSetting>(e =>
        {
            e.HasOne(d => d.Channel)
             .WithMany(c => c.DynamicSettings)
             .HasForeignKey(d => d.ChannelId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(d => new { d.ChannelId, d.Key }).IsUnique();
            e.Property(d => d.Key).HasMaxLength(256);
            e.Property(d => d.Value).HasMaxLength(4000);
        });

        // Sound
        mb.Entity<Sound>(e =>
        {
            e.HasOne(s => s.Channel)
             .WithMany(c => c.Sounds)
             .HasForeignKey(s => s.ChannelId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ActionItem
        mb.Entity<ActionItem>(e =>
        {
            e.HasOne(a => a.Channel)
             .WithMany(c => c.Actions)
             .HasForeignKey(a => a.ChannelId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ChannelModule
        mb.Entity<ChannelModule>(e =>
        {
            e.HasOne(m => m.Channel)
             .WithMany(c => c.Modules)
             .HasForeignKey(m => m.ChannelId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(m => new { m.ChannelId, m.ModuleId }).IsUnique();
        });

        // Transaction
        mb.Entity<Transaction>(e =>
        {
            e.HasOne(t => t.Channel)
             .WithMany(c => c.Transactions)
             .HasForeignKey(t => t.ChannelId)
             .OnDelete(DeleteBehavior.Cascade);
            e.Property(t => t.Amount).HasColumnType("TEXT");
            e.HasIndex(t => t.TransactionId).IsUnique();
        });

        // Notification
        mb.Entity<Notification>(e =>
        {
            e.HasOne(n => n.Channel)
             .WithMany(c => c.Notifications)
             .HasForeignKey(n => n.ChannelId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Overlay
        mb.Entity<Overlay>(e =>
        {
            e.HasOne(o => o.Channel)
             .WithMany(c => c.Overlays)
             .HasForeignKey(o => o.ChannelId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Widget
        mb.Entity<Widget>(e =>
        {
            e.HasOne(w => w.Channel)
             .WithMany(c => c.Widgets)
             .HasForeignKey(w => w.ChannelId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ChatCommand
        mb.Entity<ChatCommand>(e =>
        {
            e.HasOne(c => c.Channel)
             .WithMany(ch => ch.Commands)
             .HasForeignKey(c => c.ChannelId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Goal
        mb.Entity<Goal>(e =>
        {
            e.HasOne(g => g.Channel)
             .WithMany(c => c.Goals)
             .HasForeignKey(g => g.ChannelId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Timer
        mb.Entity<TimerItem>(e =>
        {
            e.HasOne(t => t.Channel)
             .WithMany(c => c.Timers)
             .HasForeignKey(t => t.ChannelId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Webhook
        mb.Entity<Webhook>(e =>
        {
            e.HasOne(w => w.Channel)
             .WithMany(c => c.Webhooks)
             .HasForeignKey(w => w.ChannelId)
             .OnDelete(DeleteBehavior.Cascade);
            e.Property(w => w.Url).HasMaxLength(2048);
            e.Property(w => w.Name).HasMaxLength(256);
        });

        // Seed default modules
        var defaultModules = new[]
        {
            ("actions", "Actions & Events", 1),
            ("tts", "Text to Speech", 2),
            ("sounds", "Sound Alerts", 3),
            ("media", "Media Share", 4),
            ("timers", "Timers", 5),
            ("commands", "Chat Commands", 6),
            ("spotify", "Spotify Integration", 7),
            ("webhooks", "Webhooks", 8),
            ("overlays", "Overlays", 9)
        };
        // Note: modules are seeded per-channel on registration, not globally
    }
}
