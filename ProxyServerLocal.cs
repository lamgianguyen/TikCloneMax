using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Titanium.Web.Proxy.EventArguments;
using Titanium.Web.Proxy.Models;
using Titanium.Web.Proxy;
using Titanium.Web.Proxy.Http;
using Newtonsoft.Json;
using System.IO;
using System.Windows.Forms;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Crypto.Engines;

namespace TikfinityController
{
    internal class ProxyServerLocal
    {
        private static ProxyServerLocal _proxy = new ProxyServerLocal();
        public ProxyServer proxyServer = new ProxyServer();
        public int port = 8000;
        public static ProxyServerLocal Instance { get { return _proxy; } }

        public static int findPort()
        {
            Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            try
            {
                IPEndPoint localEP = new IPEndPoint(IPAddress.Any, 0);
                socket.Bind(localEP);
                return ((IPEndPoint)socket.LocalEndPoint).Port;
            }
            catch
            {
                return 0;
            }
            finally
            {
                socket.Close();
            }
        }

        private ProxyServerLocal()
        {
            proxyServer.EnableHttp2 = true;
            proxyServer.TcpTimeWaitSeconds = 300;
            proxyServer.ConnectionTimeOutSeconds = 300;
            proxyServer.ReuseSocket = true;
            proxyServer.EnableConnectionPool = false;
            proxyServer.ForwardToUpstreamGateway = false;
            proxyServer.CertificateManager.SaveFakeCertificates = false;
            proxyServer.ServerCertificateValidationCallback += OnServerCertificateValidation;
            port = findPort();
            var explicitEndPoint = new ExplicitProxyEndPoint(IPAddress.Any, port, true);
            // CHI MITM (decrypt) 2 host can patch. Moi host khac (tiktok CDN, posthog,
            // featurebase, sentry, websocket...) -> tunnel THANG, KHONG re-encrypt
            // -> giam latency manh + tranh reject/timeout khi may cham (vuot tick).
            explicitEndPoint.BeforeTunnelConnectRequest += OnBeforeTunnelConnect;
            proxyServer.AddEndPoint(explicitEndPoint);
            proxyServer.BeforeResponse += OnResponse;
            proxyServer.CertificateManager.CreateRootCertificate();
            proxyServer.CertificateManager.TrustRootCertificate();
            ServicePointManager.ServerCertificateValidationCallback = (sender, cert, chain, sslPolicyErrors) => true;
        }
        public void Start()
        {
            if (proxyServer.ProxyRunning)
                return;
            proxyServer.Start();
        }

        // PIN updatedAt = hang so co dinh cho MOI response -> moi x-ric forge giong het
        // -> ricData.me (header) & session.me (body) luon khop -> ricPassed=true -> KHONG sabotage.
        private const string PinnedUpdatedAt = "2025-01-01T00:00:00.000Z";
        private const string FarFuture = "2099-12-31T23:59:59.000Z";

        private static JObject ProInfo()
        {
            return new JObject
            {
                ["isActiveSubscription"] = true,
                ["expire"] = FarFuture,
                ["paymentGateway"] = "agency_admin",   // KHONG "patreon"/"paddle" -> tranh init SDK billing
                ["subscriptionId"] = null,
                ["customerId"] = null,
                ["subscriptionType"] = "recurring",
                ["isVerified"] = true,
                ["status"] = "active",
                ["period"] = "month",
                ["refreshedAt"] = PinnedUpdatedAt,
                ["subscribedSince"] = "2024-01-01T00:00:00.000Z",
            };
        }

        private static string Sha8(string s)
        {
            using (var sha = System.Security.Cryptography.SHA256.Create())
            {
                byte[] hash = sha.ComputeHash(Encoding.UTF8.GetBytes(s));
                return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant().Substring(0, 8);
            }
        }

        private static async Task OnResponse(object sender, SessionEventArgs e)
        {
            try
            {
                if (frmMain.isValid &&
                    e.HttpClient.Request.Url.Contains("tikfinity.zerody.one/api/me") &&
                    e.HttpClient.Response.HasBody)
                {
                    // 1. Doc x-ric GOC de lay "ver". Proxy network bat CA renderer LAN main-process axios
                    //    -> moi /api/me deu qua day -> ricData.me & session.me luon nhat quan (khac CDP bi slip).
                    string origXRic = e.HttpClient.Response.Headers.GetFirstHeader("x-ric")?.Value;

                    string body = await e.GetResponseBodyAsString();
                    var item = JsonConvert.DeserializeObject<JObject>(body);

                    // 2. Patch body Pro
                    if (item["userFeatures"] == null) item["userFeatures"] = new JObject();
                    item["userFeatures"]["isPro"] = true;
                    item["userFeatures"]["proInfo"] = ProInfo();
                    item["subscription"] = new JObject
                    {
                        ["isPro"] = true,
                        ["plan"] = "pro",
                        ["active"] = true,
                        ["isActiveSubscription"] = true,
                        ["subscribedSince"] = "2024-01-01T00:00:00.000Z",
                        ["isMonthlySubscription"] = true,
                    };
                    item["hasActiveTrial"] = false;
                    item["trialEnded"] = false;
                    item["isTrialAvailable"] = false;
                    item["discordHasProRole"] = true;

                    if (item["channel"] is JObject channel)
                    {
                        channel["updatedAt"] = PinnedUpdatedAt;   // *** PIN (chong race) ***
                        channel["proExpireAt"] = FarFuture;
                        channel["lastActiveProDate"] = FarFuture;
                        channel["catchProEnabled"] = true;
                        channel["lastActiveProInfo"] = ProInfo();
                    }

                    // 3. Forge x-ric khop body da patch (channelId + isPro=true + hasActiveTrial=false + PIN).
                    //    KHONG forge -> client tinh checksum != header -> sabotage pha jQuery ("Illegal invocation").
                    if (!string.IsNullOrEmpty(origXRic) && origXRic.Contains(":"))
                    {
                        string ver = origXRic.Split(':')[0];
                        string channelId = item["channelId"]?.ToString() ?? "";
                        string s = $"tfintegrity_v{ver}_{channelId}-true-false-{PinnedUpdatedAt}";
                        string forged = $"{ver}:{Sha8(s)}";
                        e.HttpClient.Response.Headers.RemoveHeader("x-ric");
                        e.HttpClient.Response.Headers.AddHeader("x-ric", forged);
                    }

                    e.SetResponseBodyString(JsonConvert.SerializeObject(item));
                }

                // === PATCH AI/TTS CREDITS: /api/tts/user quota -> Pro (sub_credits + 100k) ===
                // Bundle doc quota.currentUsageMode: "sub_credits" -> tts.proCredits = subscriptionCreditsRemaining.
                // Mode khac ("free"/"subscription"/...) -> proCredits = 0 -> chip hien 0.
                if (frmMain.isValid &&
                    e.HttpClient.Request.Url.Contains("/api/tts/user") &&
                    e.HttpClient.Response.HasBody)
                {
                    string ttsBody = await e.GetResponseBodyAsString();
                    var ttsItem = JsonConvert.DeserializeObject<JObject>(ttsBody);
                    var quota = (ttsItem["data"]?["quota"] ?? ttsItem["quota"]) as JObject;
                    if (quota != null)
                    {
                        quota["exceeded"] = false;
                        quota["currentUsageMode"] = "sub_credits";   // *** PHAI la "sub_credits" ***
                        quota["subscriptionCreditsRemaining"] = 100000;
                        quota["subscriptionCreditsTotal"] = 100000;
                        e.SetResponseBodyString(JsonConvert.SerializeObject(ttsItem));
                    }
                }
            }
            catch
            {
            }
        }
        public void Stop()
        {
            try
            {
                proxyServer.BeforeResponse -= OnResponse;
                proxyServer.ServerCertificateValidationCallback -= new AsyncEventHandler<CertificateValidationEventArgs>(OnServerCertificateValidation);
                proxyServer.Stop();
                proxyServer.Dispose();
            }
            catch
            {
            }
            finally
            {
                try
                {
                    proxyServer.Dispose();
                }
                catch
                {
                }
            }
        }
        private async Task OnServerCertificateValidation(object sender, CertificateValidationEventArgs ev)
        {
            ev.IsValid = true;
            int num = await Task.FromResult(0);
        }

        // Host CAN MITM (decrypt + patch). Moi host khac -> tunnel thang.
        private static readonly HashSet<string> _decryptHosts = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "tikfinity.zerody.one",
            "tts.tikfinity.com",
        };

        // Quyet dinh CO decrypt SSL khong, theo tung host. Chi decrypt 2 host can patch
        // -> tat ca traffic con lai (CDN anh qua, tiktok, posthog, sentry, websocket...)
        // tunnel thang khong re-encrypt -> nhanh + khong bi reject/timeout khi may cham.
        private async Task OnBeforeTunnelConnect(object sender, TunnelConnectSessionEventArgs e)
        {
            try
            {
                string host = e.HttpClient.Request.RequestUri.Host;
                if (!_decryptHosts.Contains(host))
                {
                    e.DecryptSsl = false;   // tunnel thang, KHONG MITM host nay
                }
            }
            catch { }
            await Task.CompletedTask;
        }

    }
}
