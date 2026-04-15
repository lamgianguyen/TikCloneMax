namespace TikFinityBackend.Models;

public class TimerItem
{
    public int Id { get; set; }
    public int ChannelId { get; set; }
    public string Name { get; set; } = "";
    public int IntervalSeconds { get; set; } = 300;
    public string? ActionJson { get; set; }
    public bool Enabled { get; set; } = true;
    public int Sort { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Channel Channel { get; set; } = null!;
}
