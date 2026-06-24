using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TikfinityController.Model;

namespace TikfinityController
{
    internal class WebsocketTikfinity
    {
        public bool isLocalAccount { get; set; }

        private const string UrlPattern = "*tikfinity.zerody.one/api/me*";

        private const string FarFuture = "2099-12-31T23:59:59.000Z";

        private readonly Action<string> _showMess;

        private readonly CancellationToken _cancellation;

        private readonly HttpClient _http = new HttpClient();

        private readonly SemaphoreSlim _sendLock = new SemaphoreSlim(1, 1);

        private readonly ConcurrentDictionary<int, TaskCompletionSource<JToken>> _pending = new ConcurrentDictionary<int, TaskCompletionSource<JToken>>();

        private readonly int _port;

        private int _msgId;

        private ClientWebSocket _ws;

        private Process _tikfinityProcess;

        private string _injectChannelId;

        private string _injectChannelSignature;

        private readonly SemaphoreSlim _injectLock = new SemaphoreSlim(1, 1);

        public bool IsStarted { get; private set; } = false;
        [DllImport("shell32.dll")]
        static extern int SHGetFolderPath(IntPtr hwndOwner, int nFolder, IntPtr hToken, uint dwFlags, StringBuilder pszPath);
        const int CSIDL_LOCAL_APPDATA = 0x001c;

        public WebsocketTikfinity(Action<string> showMess, CancellationToken cancellationToken)
        {
            _showMess = showMess;
            _cancellation = cancellationToken;
            _port = FindPort();
        }

        public void CheckTikfinityRunning()
        {
            try
            {
                CloseTikfinity();
                if (!isLocalAccount)
                {
                    ClearTikfinityData();
                }
                _ = Task.Run(StartTikfinity);
            }
            catch (Exception ex)
            {
                _showMess(ex.Message);
            }
        }

        private async Task StartTikfinity()
        {
            var localappdata = new StringBuilder(260);

            SHGetFolderPath(IntPtr.Zero, CSIDL_LOCAL_APPDATA, IntPtr.Zero, 0, localappdata);
            string dir = "";
            string cookiePath = $"{localappdata}\\tikfinity\\";
            try
            {
                string[] matchingDirectories = Directory.GetDirectories(cookiePath, "app-*");
                if (matchingDirectories.Length == 0)
                {
                    _showMess("Tikfinity not found");
                    return;
                }
                dir = matchingDirectories.Last();
            }
            catch { }

            if (File.Exists($"{localappdata}\\Programs\\tikfinity\\tikfinity.exe"))
            {
                dir = $"{localappdata}\\Programs\\tikfinity";
            }

            bool bypass = File.Exists("bypass");

            ProcessStartInfo psi = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                WorkingDirectory = dir,
                Arguments =
                     $"/c start \"\" \"{dir}\\tikfinity.exe\" --remote-debugging-port={_port} " +
                     $"{(bypass ? "--disable-gpu --no-sandbox --disable-dev-shm-usage" : "")}",

                UseShellExecute = false,
                CreateNoWindow = true,
                WindowStyle = ProcessWindowStyle.Hidden
            };

            Process.Start(psi);
        }

        private async Task<bool> ConnectWebSocketAsync()
        {
            for (int attempt = 0; attempt < 30 && !_cancellation.IsCancellationRequested; attempt++)
            {
                try
                {
                    string wsUrl = await GetPageWsUrl();

                    if (string.IsNullOrEmpty(wsUrl))
                    {
                        await Task.Delay(1000);
                        continue;
                    }

                    _showMess($"Connecting => {wsUrl}");

                    _ws?.Dispose();

                    _ws = new ClientWebSocket();
                    await _ws.ConnectAsync(new Uri(wsUrl), _cancellation);

                    _showMess("WS connected");

                    _ = Task.Run(ReceiveLoop);

                    return true;
                }
                catch (Exception ex)
                {
                    _showMess($"Connect: {ex.Message}");
                    await Task.Delay(1000);
                }
            }
            return false;
        }

        private void CloseWebSocket()
        {
            try
            {
                if (_ws != null)
                {
                    _ws.Abort();
                    _ws.Dispose();
                    _ws = null;
                }
            }
            catch
            {
            }

            _pending.Clear();
        }

        private async Task<string> GetPageWsUrl()
        {
            try
            {
                string json = await _http.GetStringAsync($"http://127.0.0.1:{_port}/json");
                var items = JsonConvert.DeserializeObject<List<JsonDebug>>(json);
                if (items.Any(t => t.title.ToLower().Contains("tikfinity") || t.url.Contains("tikfinity.zerody.one")))
                {
                    var item = items.First(t => t.title.ToLower().Contains("tikfinity") || t.url.Contains("tikfinity.zerody.one"));
                    return item.webSocketDebuggerUrl;
                }
            }
            catch
            {
            }
            return null;
        }

        private async Task<JToken> Send(string method, object @params = null, string sessionId = null)
        {
            if (_ws == null || _ws.State != WebSocketState.Open)
            {
                throw new Exception("WS disconnected");
            }
            int id = Interlocked.Increment(ref _msgId);

            var tcs = new TaskCompletionSource<JToken>(TaskCreationOptions.RunContinuationsAsynchronously);

            _pending[id] = tcs;

            byte[] bytes = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(new ChromeDebugCommand
            {
                id = id,
                method = method,
                @params = @params,
                sessionId = sessionId
            }));

            await _sendLock.WaitAsync();

            try
            {
                await _ws.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, _cancellation);
            }
            finally
            {
                _sendLock.Release();
            }

            using (var timeout = new CancellationTokenSource(30000))
            {
                using (timeout.Token.Register(() =>
                {
                    if (_pending.TryRemove(id, out var pending))
                    {
                        pending.TrySetException(new TimeoutException(method));
                    }
                }))
                {
                    return await tcs.Task;
                }
            }
        }

        private async Task ReceiveLoop()
        {
            byte[] buffer = new byte[1024 * 1024];

            while (_ws != null && _ws.State == WebSocketState.Open && !_cancellation.IsCancellationRequested)
            {
                try
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        WebSocketReceiveResult result;
                        do
                        {
                            result = await _ws.ReceiveAsync(new ArraySegment<byte>(buffer), _cancellation);
                            if (result.MessageType == WebSocketMessageType.Close)
                            {
                                _showMess("WS closed");
                                return;
                            }
                            ms.Write(buffer, 0, result.Count);

                        } while (!result.EndOfMessage);

                        string raw = Encoding.UTF8.GetString(ms.ToArray());

                        _ = Task.Run(() => HandleMessage(raw));
                    }
                }
                catch (Exception ex)
                {
                    _showMess($"ReceiveLoop: {ex.Message}");
                    return;
                }
            }
        }

        private async Task HandleMessage(string raw)
        {
            try
            {
                JObject root = JObject.Parse(raw);

                if (root["id"] != null)
                {
                    int id = root["id"].Value<int>();

                    if (_pending.TryRemove(id, out var tcs))
                    {
                        if (root["error"] != null)
                        {
                            tcs.TrySetException(new Exception(root["error"].ToString()));
                        }
                        else
                        {
                            tcs.TrySetResult(root["result"]);
                        }
                    }

                    return;
                }

                if (root["method"]?.ToString() == "Fetch.requestPaused")
                {
                    await OnRequestPaused(root["params"] as JObject);
                }
            }
            catch (Exception ex)
            {
                _showMess($"HandleMessage: {ex.Message}");
            }
        }

        // CLIENT-SIDE FORCE (thay cho forge x-ric — forge qua CDP BAT KHA THI vi
        // ricData.me set tu /api/me main-process axios ma CDP Fetch khong bat duoc;
        // da chung minh: patch + forge dung nhung ricData.me van = goc -> sabotage).
        // Cach nay: KHONG patch /api/me, KHONG Fetch.enable, KHONG forge. Inject 1 script:
        //   (1) window.ricData.me = undefined  -> integrity poller KHONG chay -> khong sabotage.
        //   (2) ep session.me.isPro + quet moi Pinia store set isPro=true.
        // Inject qua addScriptToEvaluateOnNewDocument (chay TRUOC bundle moi F5) + Runtime.evaluate (trang hien tai).
        public async Task InjectAccount(string channelId, string channelSignature)
        {
            if (!await _injectLock.WaitAsync(0))
            {
                _showMess("Inject already in progress");
                return;
            }

            try
            {
                if (_ws == null || _ws.State != WebSocketState.Open)
                {
                    if (!await ConnectWebSocketAsync())
                    {
                        _showMess("Connect failed");
                        return;
                    }
                    _pending.Clear();
                    _msgId = 0;
                }

                _injectChannelId = channelId;
                _injectChannelSignature = channelSignature;

                string force = BuildForceScript(channelId, channelSignature);

                await Send("Page.enable");
                // Chay TRUOC bundle moi F5/reload -> Pro ben qua F5
                await Send("Page.addScriptToEvaluateOnNewDocument", new Dictionary<string, object>
                {
                    ["source"] = force
                });
                // Trang hien tai: chay luon (KHONG reload luc startup -> tranh app relaunch mat debug port)
                await Send("Runtime.evaluate", new Dictionary<string, object>
                {
                    ["expression"] = force,
                    ["returnByValue"] = true
                });
            }
            catch (Exception ex)
            {
                _showMess($"InjectAccount: {ex.Message}");
            }
            finally
            {
                _injectLock.Release();
            }
        }

        private static string BuildForceScript(string channelId, string channelSignature)
        {
            // NID: so (channelId) hoac "null"; NSIGN: chuoi JSON co quote hoac "null".
            string nid = string.IsNullOrEmpty(channelId) ? "null" : channelId;
            string nsign = string.IsNullOrEmpty(channelSignature)
                ? "null"
                : "\"" + channelSignature.Replace("\\", "\\\\").Replace("\"", "\\\"") + "\"";
            return ForceTemplate.Replace("__NID__", nid).Replace("__NSIGN__", nsign);
        }

        private const string ForceTemplate = @"(function(){
  if(window.__tfForce)return; window.__tfForce=true;
  var FAR=""2099-12-31T23:59:59.000Z"";
  var NID=__NID__; var NSIGN=__NSIGN__;
  function pinfo(){return {isActiveSubscription:true,expire:FAR,paymentGateway:""agency_admin"",subscriptionId:null,customerId:null,subscriptionType:""recurring"",isVerified:true,status:""active"",period:""month"",refreshedAt:FAR,subscribedSince:""2024-01-01T00:00:00.000Z""};}
  try{var p=new Proxy({},{get:function(t,k){return k==='me'?undefined:t[k];},set:function(t,k,v){if(k!=='me')t[k]=v;return true;}});Object.defineProperty(window,'ricData',{configurable:true,get:function(){return p;},set:function(){}});}catch(e){}
  function tick(){
    try{var me=window.session&&window.session.me;
      if(me){me.userFeatures=me.userFeatures||{};me.userFeatures.isPro=true;me.userFeatures.proInfo=pinfo();
        me.subscription={subscribedSince:""2024-01-01T00:00:00.000Z"",isMonthlySubscription:true};
        me.hasActiveTrial=false;me.trialEnded=false;me.isTrialAvailable=false;me.discordHasProRole=true;
        if(me.channel){me.channel.proExpireAt=FAR;me.channel.catchProEnabled=true;me.channel.lastActiveProInfo=pinfo();}
        if(NID){me.channelId=NID;if(me.channel)me.channel.channelId=NID;if(me.channeluser&&'channelId' in me.channeluser)me.channeluser.channelId=NID;}
        if(NSIGN&&me.channel)me.channel.channelSignature=NSIGN;}
    }catch(e){}
    try{var apps=document.querySelectorAll('[data-v-app]');for(var i=0;i<apps.length;i++){var app=apps[i].__vue_app__;if(!app)continue;var pinia=app.config&&app.config.globalProperties&&app.config.globalProperties.$pinia;if(!pinia||!pinia.state||!pinia.state.value)continue;var sv=pinia.state.value;for(var k in sv){var st=sv[k];if(!st||typeof st!=='object')continue;if('isPro' in st)try{st.isPro=true;}catch(e){}['ttsProCredits','proCredits','subscriptionCreditsRemaining','subscriptionCreditsTotal'].forEach(function(f){if(f in st)try{st[f]=100000;}catch(e){}});}}}catch(e){}
  }
  setInterval(tick,1000);[150,500,1200,2500,4000].forEach(function(d){setTimeout(tick,d);});
})();";

        private string EscapeJs(string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return "";
            }
            return value.Replace("\\", "\\\\").Replace("'", "\\'").Replace("\"", "\\\"");
        }

        private async Task OnRequestPaused(JObject prm)
        {
            string requestId = prm["requestId"]?.ToString();

            try
            {
                // Header GOC: o stage "Response", CDP da dua san responseHeaders trong prm.
                // Lay x-ric goc de biet "ver" + pass-through cac header con lai (x-authorization-token, Set-Cookie...).
                JArray origHeaders = prm["responseHeaders"] as JArray;
                string origXRic = null;
                if (origHeaders != null)
                {
                    foreach (var h in origHeaders)
                    {
                        if (string.Equals(h["name"]?.ToString(), "x-ric", StringComparison.OrdinalIgnoreCase))
                        {
                            origXRic = h["value"]?.ToString();
                            break;
                        }
                    }
                }
                int statusCode = prm["responseStatusCode"]?.Value<int>() ?? 200;

                JToken resp = await Send("Fetch.getResponseBody", new Dictionary<string, object>
                {
                    ["requestId"] = requestId
                });

                string body = resp["body"]?.ToString() ?? "";
                bool base64 = resp["base64Encoded"]?.Value<bool>() ?? false;
                if (base64)
                {
                    body = Encoding.UTF8.GetString(Convert.FromBase64String(body));
                }

                JObject patchedNode = PatchBody(body);
                string patched = patchedNode.ToString();
                string patchedB64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(patched));

                // Forge lai x-ric khop voi body da patch. KHONG forge -> client tinh checksum != header
                // -> chay routine pha jQuery ("Illegal invocation" lap).
                string forgedXRic = ForgeXRic(origXRic, patchedNode);

                // AN TOAN: khong co x-ric goc -> KHONG patch (patch ma thieu x-ric -> client tinh
                // checksum != null -> sabotage pha jQuery). Tra response GOC nguyen ven.
                if (forgedXRic == null)
                {
                    await Send("Fetch.continueResponse", new Dictionary<string, object>
                    {
                        ["requestId"] = requestId
                    });
                    return;
                }

                // responseHeaders: pass-through header goc (bo x-ric cu + content-length/encoding + pseudo ':'),
                // roi them x-ric da forge.
                var headers = new List<object>();
                if (origHeaders != null)
                {
                    foreach (var h in origHeaders)
                    {
                        string name = h["name"]?.ToString() ?? "";
                        if (name.Length == 0 || name[0] == ':') continue;
                        if (string.Equals(name, "x-ric", StringComparison.OrdinalIgnoreCase)) continue;
                        if (string.Equals(name, "content-length", StringComparison.OrdinalIgnoreCase)) continue;
                        if (string.Equals(name, "content-encoding", StringComparison.OrdinalIgnoreCase)) continue;
                        headers.Add(new Dictionary<string, object>
                        {
                            ["name"] = name,
                            ["value"] = h["value"]?.ToString()
                        });
                    }
                }
                else
                {
                    headers.Add(new Dictionary<string, object>
                    {
                        ["name"] = "Content-Type",
                        ["value"] = "application/json"
                    });
                }
                if (forgedXRic != null)
                {
                    headers.Add(new Dictionary<string, object>
                    {
                        ["name"] = "x-ric",
                        ["value"] = forgedXRic
                    });
                }

                await Send("Fetch.fulfillRequest", new Dictionary<string, object>
                {
                    ["requestId"] = requestId,
                    ["responseCode"] = statusCode,
                    ["responseHeaders"] = headers.ToArray(),
                    ["body"] = patchedB64
                });
            }
            catch
            {
                try
                {
                    // Stage "Response": dung continueResponse (KHONG continueRequest -> co the treo).
                    await Send("Fetch.continueResponse", new Dictionary<string, object>
                    {
                        ["requestId"] = requestId
                    });
                }
                catch
                {
                }
            }
        }

        private JObject PatchBody(string original)
        {
            JObject node = JObject.Parse(original);

            // Cap nhat channelId + signature theo account inject (neu co). Dong bo MOI noi
            // tham chieu channelId de bundle nhat quan. x-ric forge se dung channelId moi.
            if (!string.IsNullOrEmpty(_injectChannelId))
            {
                JToken cidTok = long.TryParse(_injectChannelId, out var cidNum) ? (JToken)cidNum : _injectChannelId;
                node["channelId"] = cidTok;
                if (node["channel"] is JObject chId) chId["channelId"] = cidTok;
                if (node["channeluser"] is JObject cuId) cuId["channelId"] = cidTok;
                if (node["profile"] is JObject pfId) pfId["channelId"] = cidTok;
                if (node["performanceDebugInfo"] is JObject pdId) pdId["cid"] = cidTok;
            }
            if (!string.IsNullOrEmpty(_injectChannelSignature) && node["channel"] is JObject chSig)
            {
                chSig["channelSignature"] = _injectChannelSignature;
            }

            // proInfo: field set DUNG nhu account Pro THAT (verify tu pro_response real, channelId 774216).
            // Bundle doc: paymentGateway/status/subscriptionId/isVerified/customerId/period/expire.
            // paymentGateway = "agency_admin" (KHAC "paddle"/"lemonsqueezy") -> moi nhanh billing FALSE
            // -> bundle KHONG init Paddle/Lemonsqueezy SDK -> khong can subscriptionId/customerId that.
            JObject proInfo = new JObject
            {
                ["isActiveSubscription"] = true,
                ["expire"] = FarFuture,
                ["paymentGateway"] = "agency_admin",
                ["subscriptionId"] = JValue.CreateNull(),
                ["customerId"] = JValue.CreateNull(),
                ["subscriptionType"] = "recurring",
                ["isVerified"] = true,
                ["status"] = "active",
                ["period"] = "month",
                ["refreshedAt"] = FarFuture,
                ["subscribedSince"] = "2024-01-01T00:00:00.000Z"
            };

            if (node["userFeatures"] is JObject features)
            {
                features["isPro"] = true;
                features["proInfo"] = (JObject)proInfo.DeepClone();
            }

            if (node["channel"] is JObject channel)
            {
                channel["proExpireAt"] = FarFuture;
                channel["lastActiveProDate"] = FarFuture;
                channel["firstActiveProDate"] = "2024-01-01";
                channel["lastActiveProInfo"] = (JObject)proInfo.DeepClone();
                channel["catchProEnabled"] = true;
                channel["catchProEnabledAt"] = "2024-01-01T00:00:00.000Z";
            }

            // subscription: shape DUNG nhu account Pro that (pro_response real).
            node["subscription"] = new JObject
            {
                ["subscribedSince"] = "2024-01-01T00:00:00.000Z",
                ["isMonthlySubscription"] = true
            };

            node["hasActiveTrial"] = false;
            node["trialEnded"] = false;
            node["isTrialAvailable"] = false;
            node["discordHasProRole"] = true;

            return node;
        }

        // Forge header x-ric (response-integrity "tfintegrity" cua bundle 1.70.1).
        // Cong thuc lay verbatim tu app.js: sha256("tfintegrity_v{ver}_{channelId}-{isPro}-{hasActiveTrial}-{channel.updatedAt}")[:8]
        // ver = phan dau header x-ric GOC. Tra null neu khong co x-ric goc (-> khong set header).
        private string ForgeXRic(string originalXRic, JObject node)
        {
            if (string.IsNullOrEmpty(originalXRic) || !originalXRic.Contains(":"))
            {
                return null;
            }

            string ver = originalXRic.Split(':')[0];
            string channelId = node["channelId"]?.ToString() ?? "";
            bool isPro = node["userFeatures"]?["isPro"]?.Value<bool>() ?? true;
            bool hasActiveTrial = node["hasActiveTrial"]?.Value<bool>() ?? false;
            string updatedAt = node["channel"]?["updatedAt"]?.ToString() ?? "";

            string s = $"tfintegrity_v{ver}_{channelId}-{(isPro ? "true" : "false")}-{(hasActiveTrial ? "true" : "false")}-{updatedAt}";

            using (var sha = System.Security.Cryptography.SHA256.Create())
            {
                byte[] hash = sha.ComputeHash(Encoding.UTF8.GetBytes(s));
                string hex = BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
                return $"{ver}:{hex.Substring(0, 8)}";
            }
        }


        public void CloseTikfinity()
        {
            try
            {
                if (_ws != null)
                {
                    _ws.Abort();
                    _ws.Dispose();
                }
            }
            catch
            {
            }

            try
            {
                if (_tikfinityProcess != null)
                {
                    _tikfinityProcess.Kill();
                }
            }
            catch
            {
            }

            foreach (var p in Process.GetProcessesByName("tikfinity"))
            {
                try
                {
                    p.Kill();
                }
                catch
                {
                }
            }
        }

        public void ClearTikfinityData()
        {
            try
            {
                string cookiePath = $"{Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData)}\\tikfinity\\";
                if (!Directory.Exists(cookiePath))
                {
                    return;
                }
                string[] matchingDirectories = Directory.GetDirectories(cookiePath, "app-*");
                if (matchingDirectories.Count() == 0)
                {
                    string localStorage = $"{cookiePath}\\browser_profile\\Local Storage";
                    if (Directory.Exists(localStorage))
                    {
                        Directory.Delete(localStorage, true);
                    }
                }
                foreach (var dir in matchingDirectories)
                {
                    string localStorage = $"{dir}\\resources\\app\\browser_profile\\Local Storage";
                    if (Directory.Exists(localStorage))
                    {
                        Directory.Delete(localStorage, true);
                    }
                }
            }
            catch
            {
            }
        }

        private int FindPort()
        {
            Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            try
            {
                socket.Bind(new IPEndPoint(IPAddress.Any, 0));
                return ((IPEndPoint)socket.LocalEndPoint).Port;
            }
            finally
            {
                socket.Close();
            }
        }
    }
}