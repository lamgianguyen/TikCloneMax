namespace TikFinityBackend.Models;

public class ChannelModule
{
    public int Id { get; set; }
    public int ChannelId { get; set; }
    public string ModuleId { get; set; } = ""; // actions, tts, sounds, media, timers, commands, spotify, webhooks, overlays
    public string Name { get; set; } = "";
    public bool Enabled { get; set; } = true;
    public int Sort { get; set; }

    public Channel Channel { get; set; } = null!;
}
