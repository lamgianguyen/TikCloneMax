namespace TikFinityBackend.Models;

public class Goal
{
    public int Id { get; set; }
    public int ChannelId { get; set; }
    public int ProfileId { get; set; } = 1;
    public string Name { get; set; } = "";
    public string Type { get; set; } = ""; // follows, likes, shares, custom
    public int Target { get; set; }
    public int Current { get; set; }
    public bool Enabled { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Channel Channel { get; set; } = null!;
}
