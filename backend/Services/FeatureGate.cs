namespace TikFinityBackend.Services;

/// <summary>
/// Single source of truth for which features are "Stable" vs "Hidden".
///
/// Hidden features are:
/// - Removed from <c>ConfigController.DefaultModules()</c> output → bundle doesn't show menu
/// - Blocked at API route level by <see cref="UnstableFeatureMiddleware"/> → returns 404
///
/// Enable hidden features for dev by setting env var <c>TIKMAX_ENABLE_UNSTABLE=1</c>.
/// </summary>
public sealed class FeatureGate
{
    private static readonly HashSet<string> HiddenModuleIds = new(StringComparer.OrdinalIgnoreCase)
    {
        "media",     // Media Share — backend adapter incomplete
        "spotify",   // Spotify Integration — needs Premium + Dev App
    };

    private static readonly string[] HiddenRoutePrefixes =
    [
        "/api/pro",      // Payment simulated, not production-ready
        "/api/spotify",  // No backend implementation
        "/api/media",    // No backend implementation
    ];

    public bool IsUnstableEnabled { get; }

    public FeatureGate(IConfiguration configuration)
    {
        // Env var takes precedence, fallback to appsettings.json Feature:EnableUnstable
        var envValue = Environment.GetEnvironmentVariable("TIKMAX_ENABLE_UNSTABLE");
        if (!string.IsNullOrWhiteSpace(envValue))
        {
            IsUnstableEnabled = envValue == "1" || envValue.Equals("true", StringComparison.OrdinalIgnoreCase);
            return;
        }

        IsUnstableEnabled = configuration.GetValue<bool>("Feature:EnableUnstable", false);
    }

    public bool IsModuleHidden(string moduleId) =>
        !IsUnstableEnabled && HiddenModuleIds.Contains(moduleId);

    public bool IsRouteHidden(string path)
    {
        if (IsUnstableEnabled) return false;
        if (string.IsNullOrEmpty(path)) return false;
        return HiddenRoutePrefixes.Any(p => path.StartsWith(p, StringComparison.OrdinalIgnoreCase));
    }
}

/// <summary>
/// Middleware that returns 404 for routes belonging to hidden/unstable features.
/// Mounted early in the pipeline so unstable endpoints look like they don't exist.
/// </summary>
public sealed class UnstableFeatureMiddleware
{
    private readonly RequestDelegate _next;
    private readonly FeatureGate _gate;
    private readonly ILogger<UnstableFeatureMiddleware> _logger;

    public UnstableFeatureMiddleware(
        RequestDelegate next,
        FeatureGate gate,
        ILogger<UnstableFeatureMiddleware> logger)
    {
        _next = next;
        _gate = gate;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value;
        if (_gate.IsRouteHidden(path ?? string.Empty))
        {
            _logger.LogWarning("[FeatureGate] Blocked hidden route {Path}", path);
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            await context.Response.WriteAsync("Not Found");
            return;
        }

        await _next(context);
    }
}
