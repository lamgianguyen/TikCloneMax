namespace TikFinityBackend.Models;

public class Subscription
{
    public int Id { get; set; }
    public int ChannelId { get; set; }
    public bool IsPro { get; set; }
    public string Plan { get; set; } = "free"; // free, pro, lifetime
    public bool Active { get; set; }
    public DateTime? ProExpireAt { get; set; }
    public string? ProExpireSetBy { get; set; } // null, "admin", "payment"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Channel Channel { get; set; } = null!;
}
