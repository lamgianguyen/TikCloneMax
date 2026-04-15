const fs = require("fs");
const vm = require("vm");

let code = fs.readFileSync("downloads/combo/app.js", "utf8");
code = code.replace(/\0/g, "");

const sandbox = {
    window: { tfPageloadData: { appConfig: {} }, session: {}, addEventListener: ()=>{}, toastr: { options: {} }, FontAwesomeConfig: {} },
    document: { createElement: () => ({ style: {}, setAttribute: ()=>{}, appendChild: ()=>{} }), getElementById: () => ({ style: {}, remove: ()=>{}, addEventListener: ()=>{} }), getElementsByClassName: () => [{ innerText: "", style: {}, innerHTML: "" }], querySelector: () => ({ setAttribute: ()=>{} }), querySelectorAll: () => [], head: { appendChild: ()=>{} }, body: { style: {} }, readyState: "complete", cookie: "", hidden: false },
    navigator: { userAgent: "Mozilla/5.0", language: "en", platform: "Win32" },
    location: { href: "http://localhost:5285/", origin: "http://localhost:5285", host: "localhost:5285", pathname: "/", search: "", hostname: "localhost" },
    localStorage: { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} },
    sessionStorage: { getItem: ()=>null, setItem: ()=>{} },
    console: { log: ()=>{}, error: ()=>{}, warn: ()=>{}, info: ()=>{} },
    setTimeout: ()=>0, setInterval: ()=>0, clearTimeout: ()=>{}, clearInterval: ()=>{},
    fetch: ()=>Promise.resolve({ json: ()=>Promise.resolve({}), text: ()=>Promise.resolve("") }),
    XMLHttpRequest: function(){ return { open:()=>{}, send:()=>{}, setRequestHeader:()=>{} }; },
    URL: globalThis.URL, URLSearchParams: globalThis.URLSearchParams, Promise: globalThis.Promise,
    JSON: globalThis.JSON, Date: globalThis.Date, Math: globalThis.Math,
    parseInt: globalThis.parseInt, parseFloat: globalThis.parseFloat, isNaN: globalThis.isNaN, isFinite: globalThis.isFinite,
    encodeURIComponent: globalThis.encodeURIComponent, decodeURIComponent: globalThis.decodeURIComponent,
    encodeURI: globalThis.encodeURI, decodeURI: globalThis.decodeURI, atob: globalThis.atob, btoa: globalThis.btoa,
    Array: globalThis.Array, Object: globalThis.Object, String: globalThis.String, Number: globalThis.Number,
    Boolean: globalThis.Boolean, RegExp: globalThis.RegExp, Map: globalThis.Map, Set: globalThis.Set,
    WeakMap: globalThis.WeakMap, Symbol: globalThis.Symbol, Proxy: globalThis.Proxy, Reflect: globalThis.Reflect,
    Error: globalThis.Error, TypeError: globalThis.TypeError, RangeError: globalThis.RangeError, SyntaxError: globalThis.SyntaxError,
    ArrayBuffer: globalThis.ArrayBuffer, Uint8Array: globalThis.Uint8Array, Uint16Array: globalThis.Uint16Array,
    Uint32Array: globalThis.Uint32Array, Int8Array: globalThis.Int8Array, Float32Array: globalThis.Float32Array,
    Float64Array: globalThis.Float64Array, DataView: globalThis.DataView,
    TextEncoder: globalThis.TextEncoder, TextDecoder: globalThis.TextDecoder,
    SharedArrayBuffer: typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : function(){},
    Atomics: typeof Atomics !== "undefined" ? Atomics : {},
    crypto: { getRandomValues: (a) => { for(let i=0;i<a.length;i++) a[i]=Math.floor(Math.random()*256); return a; } },
    performance: { now: () => Date.now() },
    $: () => ({ on:()=>({}), find:()=>({}), css:()=>({}), text:()=>({}), html:()=>({}), attr:()=>({}), append:()=>({}), remove:()=>({}), hide:()=>({}), show:()=>({}), addClass:()=>({}), removeClass:()=>({}), dxButton:()=>({}), dxTextBox:()=>({}), dxValidato:()=>({}) }),
    jQuery: () => ({ on:()=>{} }), Vue: function(){ return {}; },
    io: function(){ return { on:()=>{}, emit:()=>{}, connect:()=>{}, connected: false }; },
    posthog: { init:()=>{}, capture:()=>{}, __SV: 1 }, Sentry: { init:()=>{}, captureException:()=>{} },
    open: ()=>{}, close: ()=>{}, alert: ()=>{}, confirm: ()=>true,
    self: null, top: null, parent: null, undefined: undefined, NaN: NaN, Infinity: Infinity,
};
sandbox.window.window = sandbox.window; sandbox.self = sandbox.window; sandbox.top = sandbox.window; sandbox.parent = sandbox.window; sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox);
try { vm.runInContext(code, ctx, { timeout: 5000, filename: "app.js" }); } catch(e) {}

const r = vm.runInContext(`
    var _d = _0xaecf;
    var r = {};
    // Boot function hex values
    r["0xb66"] = _d(0xb66);
    r["0x235"] = _d(0x235);
    r["0xe4d"] = _d(0xe4d);
    r["0x1b23"] = _d(0x1b23);
    r["0x2740"] = _d(0x2740);
    r["0x2c4e"] = _d(0x2c4e);
    r["0x1066"] = _d(0x1066);
    r["0x483f"] = _d(0x483f);
    r["0x40d9"] = _d(0x40d9);
    r["0xe91"] = _d(0xe91);
    r["0x40e"] = _d(0x40e);
    r["0xa26"] = _d(0xa26);
    r["0x4a0a"] = _d(0x4a0a);
    r["0x370a"] = _d(0x370a);
    r["0x137d"] = _d(0x137d);
    r["0x3e38"] = _d(0x3e38);
    r["0x1dde"] = _d(0x1dde);
    r["0x28e6"] = _d(0x28e6);
    r["0x1480"] = _d(0x1480);
    r["0x988"] = _d(0x988);
    r["0x3d59"] = _d(0x3d59);

    // Navigation
    r["0x4171"] = _d(0x4171);
    r["0x4d6"] = _d(0x4d6);
    r["0x3c06"] = _d(0x3c06);
    r["0x4aec"] = _d(0x4aec);
    r["0x4951"] = _d(0x4951);
    r["0x46c7"] = _d(0x46c7);
    r["0x843"] = _d(0x843);
    r["0x351a"] = _d(0x351a);
    r["0x4263"] = _d(0x4263);
    r["0x49b7"] = _d(0x49b7);

    // Search for all auth URL methods
    var authUrlMethods = {};
    for (var i = 0; i < 0x4A20; i++) {
        try {
            var v = _d(i);
            if (typeof v === "string") {
                var lc = v.toLowerCase();
                if (lc.indexOf("getgoog") !== -1 || (lc.indexOf("googl") !== -1 && lc.indexOf("auth") !== -1)
                    || lc.indexOf("getauth") !== -1 || lc.indexOf("authurl") !== -1
                    || lc.indexOf("googleaut") !== -1 || (lc.indexOf("discord") !== -1 && lc.indexOf("auth") !== -1)
                    || lc.indexOf("setupgoog") !== -1 || lc.indexOf("handlegoog") !== -1
                    || lc.indexOf("processgoog") !== -1 || lc.indexOf("onauthcall") !== -1
                    || lc.indexOf("googlecall") !== -1 || lc.indexOf("authcallback") !== -1
                    || lc.indexOf("discordaut") !== -1 || lc.indexOf("getdiscor") !== -1) {
                    authUrlMethods["0x" + i.toString(16)] = v;
                }
            }
        } catch(e) {}
    }
    r.authUrlMethods = authUrlMethods;

    // Search for strings related to Google sign-in / Google OAuth URLs
    var googleOAuthUrls = {};
    for (var i = 0; i < 0x4A20; i++) {
        try {
            var v = _d(i);
            if (typeof v === "string") {
                var lc = v.toLowerCase();
                if (lc.indexOf("accounts.google") !== -1 || lc.indexOf("googleapis") !== -1
                    || lc.indexOf("oauth2") !== -1 || lc.indexOf("openid") !== -1
                    || lc.indexOf("response_type") !== -1 || lc.indexOf("access_type") !== -1
                    || lc.indexOf("approval_prompt") !== -1 || lc.indexOf("signInWith") !== -1
                    || lc.indexOf("gsi/client") !== -1 || lc.indexOf("sign_in") !== -1
                    || lc.indexOf("gstatic") !== -1 || lc.indexOf("google-signin") !== -1) {
                    googleOAuthUrls["0x" + i.toString(16)] = v;
                }
            }
        } catch(e) {}
    }
    r.googleOAuthUrls = googleOAuthUrls;

    // Search for strings with "fromGAds", "gads", or "google" + "ads"
    var gadsStrings = {};
    for (var i = 0; i < 0x4A20; i++) {
        try {
            var v = _d(i);
            if (typeof v === "string") {
                var lc = v.toLowerCase();
                if (lc.indexOf("gads") !== -1 || lc.indexOf("fromgads") !== -1
                    || lc.indexOf("google ads") !== -1 || lc.indexOf("googleads") !== -1
                    || lc.indexOf("utm_source") !== -1 || lc.indexOf("utm_medium") !== -1
                    || lc.indexOf("gclid") !== -1 || lc.indexOf("fromga") !== -1) {
                    gadsStrings["0x" + i.toString(16)] = v;
                }
            }
        } catch(e) {}
    }
    r.gadsStrings = gadsStrings;
    r;
`, ctx);

console.log("=== BOOT FLOW DECODED VALUES ===");
const bootKeys = ["0xb66", "0x235", "0xe4d", "0x1b23", "0x2740", "0x2c4e", "0x1066", "0x483f",
  "0x40d9", "0xe91", "0x40e", "0xa26", "0x4a0a", "0x370a", "0x137d", "0x3e38", "0x1dde",
  "0x28e6", "0x1480", "0x988", "0x3d59"];
for (const k of bootKeys) {
    console.log(`  ${k}: ${JSON.stringify(r[k])}`);
}

console.log("\n=== NAVIGATION DECODED VALUES ===");
const navKeys = ["0x4171", "0x4d6", "0x3c06", "0x4aec", "0x4951", "0x46c7", "0x843", "0x351a", "0x4263", "0x49b7"];
for (const k of navKeys) {
    console.log(`  ${k}: ${JSON.stringify(r[k])}`);
}

console.log("\n=== AUTH URL METHODS (google/discord + auth) ===");
for (const [k, v] of Object.entries(r.authUrlMethods)) {
    console.log(`  ${k}: ${JSON.stringify(v)}`);
}

console.log("\n=== GOOGLE OAUTH URL STRINGS ===");
for (const [k, v] of Object.entries(r.googleOAuthUrls)) {
    console.log(`  ${k}: ${JSON.stringify(v)}`);
}

console.log("\n=== GADS / UTM STRINGS ===");
for (const [k, v] of Object.entries(r.gadsStrings)) {
    console.log(`  ${k}: ${JSON.stringify(v)}`);
}
