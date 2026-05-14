using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace TikFinityBackend.Services;

/// <summary>
/// Restricts an endpoint to local-only callers. Requests from non-loopback
/// IPs return 403.
///
/// Designed for controllers that fire side effects (webhooks, OBS commands,
/// keystrokes, action tests) — these must never be reachable from the LAN
/// even if the backend is accidentally bound to 0.0.0.0.
///
/// Override: set env var <c>TIKMAX_ALLOW_LAN=1</c> for opt-in LAN access
/// (e.g. OBS on a different machine on a trusted home network).
/// </summary>
public sealed class LocalOnlyAttribute : Attribute, IAuthorizationFilter
{
    private static readonly Lazy<bool> AllowLan = new(() =>
    {
        var v = Environment.GetEnvironmentVariable("TIKMAX_ALLOW_LAN");
        return v == "1" || string.Equals(v, "true", StringComparison.OrdinalIgnoreCase);
    });

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var ctx = context.HttpContext;

        // Layer 1: remote IP must be loopback (unless TIKMAX_ALLOW_LAN=1)
        if (!AllowLan.Value)
        {
            var ip = ctx.Connection.RemoteIpAddress;
            if (ip == null || !IPAddress.IsLoopback(ip))
            {
                context.Result = new ForbidResult();
                return;
            }
        }

        // Layer 2: defend against same-machine browser CSRF.
        //
        // The IP check above does NOT block a malicious web page that the user
        // happens to have open in a browser — it can issue cross-origin POSTs
        // to http://localhost:5285 from JS, which arrive at our server with
        // remote IP = 127.0.0.1. Browsers add the Origin header to such
        // requests; we reject anything whose Origin/Referer is set but doesn't
        // match our own host.
        //
        // Non-browser callers (Electron preload, curl, server-to-server) send
        // no Origin/Referer — those are allowed through.
        var origin = ctx.Request.Headers.Origin.ToString();
        var referer = ctx.Request.Headers.Referer.ToString();

        if (string.IsNullOrEmpty(origin) && string.IsNullOrEmpty(referer))
        {
            return; // no browser context, treat as trusted local caller
        }

        if (!IsAllowedBrowserOrigin(origin) && !IsAllowedBrowserOrigin(referer))
        {
            context.Result = new ForbidResult();
        }
    }

    private static bool IsAllowedBrowserOrigin(string value)
    {
        if (string.IsNullOrEmpty(value)) return false;
        return value.StartsWith("http://localhost", StringComparison.OrdinalIgnoreCase)
            || value.StartsWith("http://127.0.0.1", StringComparison.OrdinalIgnoreCase);
    }
}
