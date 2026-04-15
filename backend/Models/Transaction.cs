namespace TikFinityBackend.Models;

public class Transaction
{
    public int Id { get; set; }
    public int ChannelId { get; set; }
    public string TransactionId { get; set; } = Guid.NewGuid().ToString();
    public string Type { get; set; } = ""; // pro_upgrade, pro_renewal
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string Status { get; set; } = "pending"; // pending, completed, failed, refunded
    public string? PaymentMethod { get; set; }
    public string? PaymentProvider { get; set; } // stripe, vnpay, paypal
    public string? ExternalId { get; set; } // provider transaction id
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Channel Channel { get; set; } = null!;
}
