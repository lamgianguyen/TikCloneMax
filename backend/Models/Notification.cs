namespace TikFinityBackend.Models;

public class Notification
{
    public int Id { get; set; }
    public int ChannelId { get; set; }
    public string Subject { get; set; } = "";
    public string Body { get; set; } = "";
    public string Category { get; set; } = "announcements";
    public string? DataJson { get; set; } // payload JSON
    public bool IsRead { get; set; }
    public bool IsSeen { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string TransactionId { get; set; } = Guid.NewGuid().ToString();

    public Channel Channel { get; set; } = null!;
}
