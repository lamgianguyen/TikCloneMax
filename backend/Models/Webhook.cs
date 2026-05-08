namespace TikFinityBackend.Models;

/// <summary>
/// Outbound webhook target. Fires HTTP POST (or configured method) to <see cref="Url"/>
/// whenever a TikTok event listed in <see cref="EventTypesCsv"/> is received.
///
/// Discord webhooks are recognised by URL pattern and rendered with an embed
/// instead of a raw event payload.
/// </summary>
public class Webhook
{
    public int Id { get; set; }
    public int ChannelId { get; set; }
    public string Name { get; set; } = "";
    public string Url { get; set; } = "";
    public string Method { get; set; } = "POST";
    public string EventTypesCsv { get; set; } = "gift,follow,share,subscribe";
    public string? HeadersJson { get; set; }
    public string? TemplateJson { get; set; }
    public bool Enabled { get; set; } = true;
    public int RetryCount { get; set; } = 2;
    public int TimeoutSeconds { get; set; } = 10;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Channel Channel { get; set; } = null!;
}
