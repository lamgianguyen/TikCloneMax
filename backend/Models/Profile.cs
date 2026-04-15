namespace TikFinityBackend.Models;

public class Profile
{
    public int Id { get; set; }
    public int ChannelId { get; set; }
    public string Name { get; set; } = "Default";
    public int Sort { get; set; }

    public Channel Channel { get; set; } = null!;
}
