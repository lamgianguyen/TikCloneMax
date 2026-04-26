namespace TikFinityBackend.Models;

public class RevokedToken
{
    public int Id { get; set; }
    public string Jti { get; set; } = "";
    public int ChannelId { get; set; }
    public DateTime RevokedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
}
