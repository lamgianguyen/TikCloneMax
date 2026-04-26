using System.Security.Cryptography;
using System.Text;

namespace TikFinityBackend.Services;

/// <summary>
/// Password hashing service. New passwords use BCrypt; legacy SHA-256
/// hashes from the old auth scheme are still verified so existing users
/// can log in, and are transparently upgraded to BCrypt on the next
/// successful login.
/// </summary>
public sealed class PasswordHasher
{
    private const int BCryptWorkFactor = 11;
    private const string LegacySalt = "tikfinity-local-salt";

    public string Hash(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, BCryptWorkFactor);
    }

    public bool Verify(string password, string? storedHash)
    {
        if (string.IsNullOrEmpty(storedHash))
        {
            return false;
        }

        if (IsBCrypt(storedHash))
        {
            try
            {
                return BCrypt.Net.BCrypt.Verify(password, storedHash);
            }
            catch
            {
                return false;
            }
        }

        return VerifyLegacySha256(password, storedHash);
    }

    /// <summary>True if the stored hash is legacy (non-BCrypt) and should be re-hashed after login.</summary>
    public bool NeedsRehash(string? storedHash) =>
        !string.IsNullOrEmpty(storedHash) && !IsBCrypt(storedHash);

    private static bool IsBCrypt(string hash) =>
        hash.StartsWith("$2a$", StringComparison.Ordinal) ||
        hash.StartsWith("$2b$", StringComparison.Ordinal) ||
        hash.StartsWith("$2y$", StringComparison.Ordinal);

    private static bool VerifyLegacySha256(string password, string storedHash)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password + LegacySalt));
        var computed = Convert.ToHexString(bytes).ToLower();
        return CryptographicOperations.FixedTimeEquals(
            Encoding.ASCII.GetBytes(computed),
            Encoding.ASCII.GetBytes(storedHash.ToLower()));
    }
}
