namespace TikFinityBackend.Models;

public class ActionItem
{
    public int Id { get; set; }
    public int ChannelId { get; set; }
    public int ProfileId { get; set; } = 1;
    public string Name { get; set; } = "";
    public string Type { get; set; } = ""; // gift, like, follow, share, comment, subscribe, etc.
    public string? TriggerValue { get; set; }
    public string? ConfigJson { get; set; } // JSON blob for action config
    public bool Enabled { get; set; } = true;
    public int Sort { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Channel Channel { get; set; } = null!;
}
