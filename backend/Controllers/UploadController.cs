using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TikFinityBackend.Controllers;

/// <summary>
/// File upload endpoints for sound/image/video assets used in actions and
/// sound alerts. Saved to <c>frontend_path/uploads/</c> so the same URL the
/// bundle saves into <c>Sound.url</c> / <c>Action.audioUrl</c> serves the file
/// back when widgets request it.
///
/// Whitelist mime types to avoid arbitrary file hosting. 25 MB cap per file
/// matches Tikfinity Pro's documented limit.
/// </summary>
[ApiController]
[Route("api")]
[AllowAnonymous]
public class UploadController : BaseApiController
{
    private const long MaxBytes = 25 * 1024 * 1024;

    private static readonly HashSet<string> AllowedAudio = new(StringComparer.OrdinalIgnoreCase)
    {
        ".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"
    };
    private static readonly HashSet<string> AllowedImage = new(StringComparer.OrdinalIgnoreCase)
    {
        ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"
    };
    private static readonly HashSet<string> AllowedVideo = new(StringComparer.OrdinalIgnoreCase)
    {
        ".mp4", ".webm", ".mov", ".m4v"
    };
    private static readonly HashSet<string> AllowedAnim = new(StringComparer.OrdinalIgnoreCase)
    {
        ".json", ".lottie"
    };

    private readonly IWebHostEnvironment _env;
    private readonly ILogger<UploadController> _logger;

    public UploadController(IWebHostEnvironment env, ILogger<UploadController> logger)
    {
        _env = env;
        _logger = logger;
    }

    /// <summary>
    /// Multipart upload. Bundle sends FormData with a single file field.
    /// Returns <c>{url: "/uploads/sound/abc-original.mp3"}</c> the caller
    /// then stores into Action/Sound config.
    /// </summary>
    [HttpPost("uploadFile")]
    [HttpPost("uploadMedia")]
    [HttpPost("upload")]
    [HttpPost("rest/upload")]
    [RequestSizeLimit(MaxBytes + (5 * 1024 * 1024))]
    public async Task<IActionResult> Upload([FromForm] IFormFile? file, [FromForm] string? category = null)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { status = 400, error = "no file" });

        if (file.Length > MaxBytes)
            return BadRequest(new { status = 413, error = "file too large", maxBytes = MaxBytes });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        var bucket = ResolveBucket(ext, category);
        if (bucket == null)
            return BadRequest(new { status = 400, error = $"unsupported extension {ext}" });

        var safeName = SanitizeFilename(Path.GetFileNameWithoutExtension(file.FileName));
        var uniqueName = $"{Guid.NewGuid():N}-{safeName}{ext}";
        var uploadsRoot = GetUploadsRoot();
        var bucketDir = Path.Combine(uploadsRoot, bucket);
        Directory.CreateDirectory(bucketDir);
        var diskPath = Path.Combine(bucketDir, uniqueName);

        try
        {
            await using var fs = new FileStream(diskPath, FileMode.CreateNew, FileAccess.Write);
            await file.CopyToAsync(fs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[Upload] save failed for {Name}", file.FileName);
            return StatusCode(500, new { status = 500, error = "save failed" });
        }

        var publicUrl = $"/uploads/{bucket}/{uniqueName}";
        _logger.LogInformation("[Upload] saved {Bucket}/{Name} ({Bytes} bytes)", bucket, uniqueName, file.Length);
        return Ok(new
        {
            status = 200,
            message = "OK",
            url = publicUrl,
            fileName = uniqueName,
            originalName = file.FileName,
            sizeBytes = file.Length,
            category = bucket
        });
    }

    /// <summary>
    /// List uploaded files for a category (sound/image/video/animation).
    /// Used by sound library UI to show what's been uploaded.
    /// </summary>
    [HttpGet("uploads/list")]
    public IActionResult List([FromQuery] string category = "sound")
    {
        var bucket = NormalizeCategory(category);
        var dir = Path.Combine(GetUploadsRoot(), bucket);
        if (!Directory.Exists(dir))
            return Ok(new { status = 200, files = Array.Empty<object>() });

        var files = new DirectoryInfo(dir)
            .EnumerateFiles()
            .OrderByDescending(f => f.CreationTimeUtc)
            .Take(500)
            .Select(f => new
            {
                fileName = f.Name,
                url = $"/uploads/{bucket}/{f.Name}",
                sizeBytes = f.Length,
                createdAt = f.CreationTimeUtc.ToString("o")
            })
            .ToArray();

        return Ok(new { status = 200, files });
    }

    /// <summary>Delete a previously uploaded file. Path-traversal safe.</summary>
    [HttpDelete("uploads/{category}/{fileName}")]
    [HttpPost("uploads/delete")]
    public IActionResult Delete(string? category = null, string? fileName = null, [FromBody] DeleteUploadDto? dto = null)
    {
        category ??= dto?.Category;
        fileName ??= dto?.FileName;
        if (string.IsNullOrWhiteSpace(category) || string.IsNullOrWhiteSpace(fileName))
            return BadRequest(new { status = 400, error = "category + fileName required" });

        var bucket = NormalizeCategory(category);
        var safeName = Path.GetFileName(fileName);
        if (safeName != fileName)
            return BadRequest(new { status = 400, error = "invalid filename" });

        var path = Path.Combine(GetUploadsRoot(), bucket, safeName);
        var fullRoot = Path.GetFullPath(GetUploadsRoot());
        var fullPath = Path.GetFullPath(path);
        if (!fullPath.StartsWith(fullRoot + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { status = 400, error = "invalid path" });

        if (System.IO.File.Exists(fullPath))
        {
            try { System.IO.File.Delete(fullPath); }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "[Upload] delete failed for {Path}", path);
                return StatusCode(500, new { status = 500, error = "delete failed" });
            }
        }
        return Ok(new { status = 200 });
    }

    private string GetUploadsRoot()
    {
        // Co-locate uploads under the frontend so the existing static middleware
        // serves /uploads/* automatically (downloads/ is the frontend root).
        var frontend = Environment.GetEnvironmentVariable("TIKFINITY_FRONTEND_PATH");
        if (string.IsNullOrWhiteSpace(frontend))
        {
            frontend = Path.Combine(_env.ContentRootPath, "..", "downloads");
        }
        return Path.GetFullPath(Path.Combine(frontend, "uploads"));
    }

    private static string? ResolveBucket(string ext, string? requestedCategory)
    {
        if (AllowedAudio.Contains(ext)) return "sound";
        if (AllowedImage.Contains(ext)) return "image";
        if (AllowedVideo.Contains(ext)) return "video";
        if (AllowedAnim.Contains(ext)) return "animation";
        return null;
    }

    private static string NormalizeCategory(string category)
    {
        return category.ToLowerInvariant() switch
        {
            "sound" or "audio" or "music" => "sound",
            "image" or "img" or "picture" => "image",
            "video" or "movie" or "clip"  => "video",
            "animation" or "anim" or "lottie" => "animation",
            _ => "misc"
        };
    }

    private static string SanitizeFilename(string name)
    {
        var sb = new System.Text.StringBuilder(Math.Min(name.Length, 64));
        foreach (var c in name)
        {
            if (c == '_' || c == '-' || char.IsLetterOrDigit(c))
            {
                sb.Append(c);
                if (sb.Length >= 64) break;
            }
            else if (char.IsWhiteSpace(c) && sb.Length > 0 && sb[^1] != '_')
            {
                sb.Append('_');
            }
        }
        return sb.Length == 0 ? "file" : sb.ToString();
    }
}

public record DeleteUploadDto(string? Category, string? FileName);
