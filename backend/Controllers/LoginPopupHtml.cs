namespace TikFinityBackend.Controllers;

internal static class LoginPopupHtml
{
    public static string Build(string? redirectUrl) => """
        <!DOCTYPE html>
        <html><head>
        <title>Login - TikFinity</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #1a1a2e; color: #e0e0e0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          .container { background: #16213e; border-radius: 12px; padding: 40px; width: 400px; max-width: 90vw; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
          h2 { text-align: center; margin-bottom: 8px; color: #fff; }
          .subtitle { text-align: center; color: #888; margin-bottom: 24px; font-size: 14px; }
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
            <label>Password (min 8 chars)</label>
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

        function persistSession(d, fallbackName){
          var target = window.opener ? window.opener : window;
          try{
            target.localStorage.setItem('setting_loginaccesstoken', d.accessToken);
            target.localStorage.setItem('setting_loginaccesstokenprovider', 'authapi');
            target.localStorage.setItem('setting_pendinglogin', '1');
            target.localStorage.setItem('setting_channelid', String(d.channelId || ''));
            target.localStorage.setItem('setting_channelname', d.channelName || fallbackName);
            target.localStorage.setItem('setting_ispro', d.isPro ? 'true' : 'false');
            if (window.opener) target.location.reload();
          }catch(e){}
        }

        function doLogin() {
          var user=document.getElementById('loginUser').value.trim();
          var pass=document.getElementById('loginPass').value;
          if(!user||!pass){showMsg('Please enter username and password','error');return;}
          document.getElementById('loginBtn').disabled=true;
          fetch('/api/v1/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:user,password:pass})})
          .then(function(r){return r.json().then(function(d){return {ok:r.ok,data:d}})})
          .then(function(res){
            if(res.ok && res.data.status==='ok' && res.data.accessToken){
              showMsg('Login successful!','success');
              persistSession(res.data, user);
              setTimeout(function(){window.close();},500);
            } else {
              showMsg(res.data.message||'Login failed','error');
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
          if(pass.length<8){showMsg('Password must be at least 8 characters','error');return;}
          document.getElementById('regBtn').disabled=true;
          fetch('/api/v1/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:user,email:email,password:pass})})
          .then(function(r){return r.json().then(function(d){return {ok:r.ok,data:d}})})
          .then(function(res){
            if(res.ok && res.data.status==='ok' && res.data.accessToken){
              showMsg('Account created!','success');
              persistSession(res.data, user);
              setTimeout(function(){window.close();},500);
            } else {
              showMsg(res.data.message||'Registration failed','error');
              document.getElementById('regBtn').disabled=false;
            }
          })
          .catch(function(){showMsg('Connection error','error');document.getElementById('regBtn').disabled=false;});
        }
        </script>
        </body></html>
        """;
}
