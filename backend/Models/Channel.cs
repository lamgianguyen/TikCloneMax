namespace TikFinityBackend.Models;

public class Channel
{
    public int ChannelId { get; set; }
    public string ChannelName { get; set; } = "";
    public string ChannelSignature { get; set; } = "";
    public string? OwnerUserId { get; set; }
    public string? Sub { get; set; } // "social:email@gmail.com"
    public string Email { get; set; } = "";
    public string? GoogleId { get; set; }
    public string? PasswordHash { get; set; }
    public string? AvatarUrl { get; set; }
    public string? AffId { get; set; }
    public string? AgencyId { get; set; }
    public int ProfileId { get; set; } = 1;
    public string Locale { get; set; } = "VN";
    public bool IsChatbotApproved { get; set; }
    public bool ChallengeRunning { get; set; }
    public string? ChallengeName { get; set; }
    public string SignupAuthProvider { get; set; } = "social";
    public DateTime? ChallengeStartAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
    public string? LastLoginIp { get; set; }
    public int FailedLoginCount { get; set; }
    public DateTime? LockedUntil { get; set; }

    // Navigation
    public Subscription? Subscription { get; set; }
    public List<Profile> Profiles { get; set; } = [];
    public List<DynamicSetting> DynamicSettings { get; set; } = [];
    public List<Sound> Sounds { get; set; } = [];
    public List<ActionItem> Actions { get; set; } = [];
    public List<ChannelModule> Modules { get; set; } = [];
    public List<Transaction> Transactions { get; set; } = [];
    public List<Notification> Notifications { get; set; } = [];
    public List<Overlay> Overlays { get; set; } = [];
    public List<Widget> Widgets { get; set; } = [];
    public List<ChatCommand> Commands { get; set; } = [];
    public List<Goal> Goals { get; set; } = [];
    public List<TimerItem> Timers { get; set; } = [];
    public List<Webhook> Webhooks { get; set; } = [];
}
