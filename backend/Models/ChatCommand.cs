namespace TikFinityBackend.Models;

public class ChatCommand
{
    public int Id { get; set; }
    public int ChannelId { get; set; }
    public string Command { get; set; } = "";
    public string Response { get; set; } = "";
    public int Cooldown { get; set; } // seconds
    public bool Enabled { get; set; } = true;
    public int Sort { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Channel Channel { get; set; } = null!;
}
