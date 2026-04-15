namespace TikFinityBackend.Models;

public class Sound
{
    public int Id { get; set; }
    public int ChannelId { get; set; }
    public string Name { get; set; } = "";
    public string? FileName { get; set; }
    public string? Url { get; set; }
    public int Volume { get; set; } = 100;
    public bool Enabled { get; set; } = true;
    public int Sort { get; set; }
    public string? Category { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Channel Channel { get; set; } = null!;
}
