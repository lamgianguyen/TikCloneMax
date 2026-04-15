namespace TikFinityBackend.Models;

public class Widget
{
    public int Id { get; set; }
    public int ChannelId { get; set; }
    public string Name { get; set; } = "";
    public string Type { get; set; } = "";
    public string? ConfigJson { get; set; }
    public bool Enabled { get; set; } = true;
    public int Sort { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Channel Channel { get; set; } = null!;
}
