using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TikFinityBackend.Data;
using TikFinityBackend.Models;
using TikFinityBackend.Services;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace TikFinityBackend.Controllers;

[ApiController]
[Route("api/auth")]
[Route("api/v1/auth")] // Frontend popup calls /api/v1/auth/*
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ChannelService _channelService;
    private readonly JwtService _jwtService;

    public AuthController(AppDbContext db, ChannelService channelService, JwtService jwtService)
    {
        _db = db;
        _channelService = channelService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var username = dto.Username?.Trim() ?? "";
        var email = dto.Email?.Trim() ?? "";
        var password = dto.Password ?? "";

        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            return BadRequest(new { status = "error", message = "All fields are required" });

        if (password.Length < 4)
            return BadRequest(new { status = "error", message = "Password must be at least 4 characters" });

        var exists = await _db.Channels.AnyAsync(c => c.ChannelName == username || c.Email == email);
        if (exists)
            return Conflict(new { status = "error", message = "Username or email already exists" });

        var channel = await _channelService.CreateLocalAccount(username, email, HashPassword(password));

        Console.WriteLine($"[AUTH] Register OK: {username} (channelId={channel.ChannelId})");

        var token = _jwtService.GenerateToken(channel.ChannelId, channel.ChannelName, email, true);

        return Ok(new
        {
            status = "ok",
            accessToken = token,
            channelId = channel.ChannelId,
            channelName = channel.ChannelName,
            email,
            isPro = true
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var username = dto.Username?.Trim() ?? dto.Email?.Trim() ?? "";
        var password = dto.Password ?? "";

        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            return BadRequest(new { status = "error", message = "Username and password are required" });

        var channel = await _db.Channels
            .Include(c => c.Subscription)
            .FirstOrDefaultAsync(c => c.ChannelName == username || c.Email == username);

        if (channel == null || channel.PasswordHash != HashPassword(password))
            return Unauthorized(new { status = "error", message = "Invalid username or password" });

        Console.WriteLine($"[AUTH] Login OK: {channel.ChannelName}");

        var isPro = channel.Subscription?.IsPro ?? true;
        var token = _jwtService.GenerateToken(channel.ChannelId, channel.ChannelName, channel.Email, isPro);

        return Ok(new
        {
            status = "ok",
            accessToken = token,
            channelId = channel.ChannelId,
            channelName = channel.ChannelName,
            email = channel.Email,
            isPro
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok(new { status = "ok", message = "Logged out" });
    }

    // --- Original auth.zerody.one endpoints (used by obfuscated frontend) ---

    [HttpPost("/api/v1/code/send")]
    public IActionResult CodeSend()
    {
        Console.WriteLine("[AUTH] POST /api/v1/code/send (auto-approve)");
        return Ok(new { flowId = "local-flow-001", status = "ok" });
    }

    [HttpPost("/api/v1/code/validate")]
    public async Task<IActionResult> CodeValidate()
    {
        Console.WriteLine("[AUTH] POST /api/v1/code/validate (auto-approve)");
        var channel = await _db.Channels.FirstOrDefaultAsync();
        if (channel != null)
        {
            var token = _jwtService.GenerateToken(channel.ChannelId, channel.ChannelName, channel.Email, true);
            return Ok(new { accessToken = token, status = "ok" });
        }
        return Ok(new { accessToken = "local-token-auto", status = "ok" });
    }

    // --- Auth flow endpoints (auth.zerody.one compatible) ---
    // These handle the OAuth-like flow the obfuscated bundle uses

    [HttpGet("/api/v1/flow/start")]
    [HttpPost("/api/v1/flow/start")]
    public IActionResult FlowStart([FromQuery] string? appId, [FromQuery] string? redirectUrl)
    {
        Console.WriteLine($"[AUTH] Flow start: appId={appId}, redirectUrl={redirectUrl}");

        // If browser request (popup), return HTML login form
        var accept = Request.Headers.Accept.ToString();
        if (accept.Contains("text/html"))
        {
            return Content(BuildLoginPopupHtml(redirectUrl), "text/html");
        }

        return Ok(new { flowId = "local-flow-001", status = "ok", appId = appId ?? "tikfinity" });
    }

    private static string BuildLoginPopupHtml(string? redirectUrl)
    {
        return """
        <!DOCTYPE html>
        <html><head>
        <title>Login - TikFinity</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #1a1a2e; color: #e0e0e0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          .container { background: #16213e; border-radius: 12px; padding: 40px; width: 400px; max-width: 90vw; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
          h2 { text-align: center; margin-bottom: 8px; color: #fff; }
          .subtitle { text-align: center; color: #888; margin-bottom: 24px; font-size: 14px; }
          .tabs { display: flex; margin-bottom: 24px; border-bottom: 2px solid #333; }
          .tab { flex: 1; text-align: center; padding: 10px; cursor: pointer; color: #888; border-bottom: 2px solid transparent; margin-bottom: -2px; }
          .tab.active { color: #e91e63; border-bottom-color: #e91e63; }
          label { display: block; margin-bottom: 6px; font-size: 13px; color: #aaa; }
          input { width: 100%; padding: 10px 14px; border: 1px solid #333; border-radius: 6px; background: #0f3460; color: #fff; font-size: 14px; margin-bottom: 16px; outline: none; }
          input:focus { border-color: #e91e63; }
          button { width: 100%; padding: 12px; border: none; border-radius: 6px; background: #e91e63; color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; }
          button:hover { background: #c2185b; }
          button:disabled { background: #555; cursor: not-allowed; }
          .msg { padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; font-size: 13px; display: none; }
          .msg.error { background: #5c1a1a; color: #ff6b6b; display: block; }
          .msg.success { background: #1a5c2a; color: #6bff8b; display: block; }
          .switch { text-align: center; margin-top: 16px; font-size: 13px; color: #888; }
          .switch a { color: #e91e63; cursor: pointer; text-decoration: none; }
        </style>
        </head><body>
        <div class="container">
          <h2>TikFinity</h2>
          <p class="subtitle">Sign in to your account</p>
          <div id="msgBox" class="msg"></div>

          <div id="loginForm">
            <label>Username or Email</label>
            <input type="text" id="loginUser" placeholder="Enter username or email" autofocus>
            <label>Password</label>
            <input type="password" id="loginPass" placeholder="Enter password" onkeydown="if(event.key==='Enter')doLogin()">
            <button onclick="doLogin()" id="loginBtn">Sign In</button>
            <div class="switch">Don't have an account? <a onclick="showRegister()">Register</a></div>
          </div>

          <div id="registerForm" style="display:none">
            <label>Username</label>
            <input type="text" id="regUser" placeholder="Choose a username">
            <label>Email</label>
            <input type="email" id="regEmail" placeholder="Enter your email">
            <label>Password</label>
            <input type="password" id="regPass" placeholder="Choose a password">
            <label>Confirm Password</label>
            <input type="password" id="regPass2" placeholder="Confirm password" onkeydown="if(event.key==='Enter')doRegister()">
            <button onclick="doRegister()" id="regBtn">Create Account</button>
            <div class="switch">Already have an account? <a onclick="showLogin()">Sign In</a></div>
          </div>
        </div>
        <script>
        function showLogin() { document.getElementById('loginForm').style.display=''; document.getElementById('registerForm').style.display='none'; clearMsg(); }
        function showRegister() { document.getElementById('loginForm').style.display='none'; document.getElementById('registerForm').style.display=''; clearMsg(); }
        function clearMsg() { document.getElementById('msgBox').className='msg'; document.getElementById('msgBox').textContent=''; }
        function showMsg(text, type) { var m=document.getElementById('msgBox'); m.textContent=text; m.className='msg '+type; }

        function doLogin() {
          var user=document.getElementById('loginUser').value.trim();
          var pass=document.getElementById('loginPass').value;
          if(!user||!pass){showMsg('Please enter username and password','error');return;}
          document.getElementById('loginBtn').disabled=true;
          fetch('/api/v1/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:user,password:pass})})
          .then(function(r){return r.json()})
          .then(function(d){
            if(d.status==='ok'&&d.accessToken){
              showMsg('Login successful!','success');
              // Store in opener's localStorage
              if(window.opener){
                try{
                  window.opener.localStorage.setItem('setting_loginaccesstoken',d.accessToken);
                  window.opener.localStorage.setItem('setting_loginaccesstokenprovider','authapi');
                  window.opener.localStorage.setItem('setting_pendinglogin','1');
                  window.opener.localStorage.setItem('setting_channelid',String(d.channelId||'1'));
                  window.opener.localStorage.setItem('setting_channelname',d.channelName||user);
                  window.opener.localStorage.setItem('setting_ispro',d.isPro===false?'false':'true');
                  window.opener.location.reload();
                }catch(e){}
              } else {
                // Not a popup, store locally
                localStorage.setItem('setting_loginaccesstoken',d.accessToken);
                localStorage.setItem('setting_loginaccesstokenprovider','authapi');
                localStorage.setItem('setting_pendinglogin','1');
                localStorage.setItem('setting_channelid',String(d.channelId||'1'));
                localStorage.setItem('setting_channelname',d.channelName||user);
                localStorage.setItem('setting_ispro',d.isPro===false?'false':'true');
              }
              setTimeout(function(){window.close();},500);
            } else {
              showMsg(d.message||'Login failed','error');
              document.getElementById('loginBtn').disabled=false;
            }
          })
          .catch(function(){showMsg('Connection error','error');document.getElementById('loginBtn').disabled=false;});
        }

        function doRegister() {
          var user=document.getElementById('regUser').value.trim();
          var email=document.getElementById('regEmail').value.trim();
          var pass=document.getElementById('regPass').value;
          var pass2=document.getElementById('regPass2').value;
          if(!user||!email||!pass){showMsg('Please fill in all fields','error');return;}
          if(pass!==pass2){showMsg('Passwords do not match','error');return;}
          if(pass.length<4){showMsg('Password must be at least 4 characters','error');return;}
          document.getElementById('regBtn').disabled=true;
          fetch('/api/v1/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:user,email:email,password:pass})})
          .then(function(r){return r.json()})
          .then(function(d){
            if(d.status==='ok'&&d.accessToken){
              showMsg('Account created!','success');
              if(window.opener){
                try{
                  window.opener.localStorage.setItem('setting_loginaccesstoken',d.accessToken);
                  window.opener.localStorage.setItem('setting_loginaccesstokenprovider','authapi');
                  window.opener.localStorage.setItem('setting_pendinglogin','1');
                  window.opener.localStorage.setItem('setting_channelid',String(d.channelId||'1'));
                  window.opener.localStorage.setItem('setting_channelname',d.channelName||user);
                  window.opener.localStorage.setItem('setting_ispro','true');
                  window.opener.location.reload();
                }catch(e){}
              } else {
                localStorage.setItem('setting_loginaccesstoken',d.accessToken);
                localStorage.setItem('setting_loginaccesstokenprovider','authapi');
                localStorage.setItem('setting_pendinglogin','1');
                localStorage.setItem('setting_channelid',String(d.channelId||'1'));
                localStorage.setItem('setting_channelname',d.channelName||user);
                localStorage.setItem('setting_ispro','true');
              }
              setTimeout(function(){window.close();},500);
            } else {
              showMsg(d.message||'Registration failed','error');
              document.getElementById('regBtn').disabled=false;
            }
          })
          .catch(function(){showMsg('Connection error','error');document.getElementById('regBtn').disabled=false;});
        }
        </script>
        </body></html>
        """;
    }

    [HttpGet("/api/v1/flow/end")]
    [HttpPost("/api/v1/flow/end")]
    public IActionResult FlowEnd([FromQuery] string? appId, [FromQuery] string? redirectUrl)
    {
        Console.WriteLine($"[AUTH] Flow end (logout): appId={appId}, redirectUrl={redirectUrl}");
        return Redirect(BuildLogoutUrl(redirectUrl));
    }

    [HttpGet("/api/v1/flow/logout")]
    [HttpPost("/api/v1/flow/logout")]
    public IActionResult FlowLogout([FromQuery] string? redirectUrl)
    {
        Console.WriteLine($"[AUTH] Flow logout: redirectUrl={redirectUrl}");
        return Redirect(BuildLogoutUrl(redirectUrl));
    }

    private static string BuildLogoutUrl(string? redirectUrl)
    {
        if (string.IsNullOrWhiteSpace(redirectUrl))
        {
            return "/logout";
        }

        string? safeNext = null;

        if (Uri.TryCreate(redirectUrl, UriKind.Absolute, out var abs))
        {
            if (abs.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase))
            {
                safeNext = abs.PathAndQuery + abs.Fragment;
            }
        }
        else if (redirectUrl.StartsWith("/"))
        {
            safeNext = redirectUrl;
        }

        if (string.IsNullOrWhiteSpace(safeNext))
        {
            return "/logout";
        }

        return "/logout?next=" + Uri.EscapeDataString(safeNext);
    }

    [HttpGet("/api/v1/flow/callback")]
    [HttpPost("/api/v1/flow/callback")]
    public async Task<IActionResult> FlowCallback([FromQuery] string? code, [FromQuery] string? flowId)
    {
        Console.WriteLine($"[AUTH] Flow callback: code={code}, flowId={flowId}");
        var channel = await _db.Channels.FirstOrDefaultAsync();
        if (channel != null)
        {
            var token = _jwtService.GenerateToken(channel.ChannelId, channel.ChannelName, channel.Email, true);
            return Ok(new { accessToken = token, status = "ok", channelId = channel.ChannelId, channelName = channel.ChannelName });
        }
        return Ok(new { status = "ok" });
    }

    [HttpGet("/api/v1/flow/status")]
    [HttpPost("/api/v1/flow/status")]
    public IActionResult FlowStatus([FromQuery] string? flowId)
    {
        return Ok(new { status = "ok", flowId = flowId ?? "local-flow-001", completed = true });
    }

    private static string HashPassword(string password)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password + "tikfinity-local-salt"));
        return Convert.ToHexString(bytes).ToLower();
    }
}

public record RegisterDto(string? Username, string? Email, string? Password, string? Name);
public record LoginDto(string? Username, string? Email, string? Password);
