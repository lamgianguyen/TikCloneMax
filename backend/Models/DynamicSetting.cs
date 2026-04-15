namespace TikFinityBackend.Models;

public class DynamicSetting
{
    public int Id { get; set; }
    public int ChannelId { get; set; }
    public string Key { get; set; } = "";
    public string Value { get; set; } = "";

    public Channel Channel { get; set; } = null!;
}
