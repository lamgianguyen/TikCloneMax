const fs = require("fs");
const vm = require("vm");

// Read and clean - remove any null bytes
let code = fs.readFileSync("downloads/combo/app.js", "utf8");
code = code.replace(/\0/g, ""); // Remove null bytes

// Create browser-like sandbox
const sandbox = {
    window: {
        tfPageloadData: { appConfig: {} },
        session: {},
        addEventListener: ()=>{},
        toastr: { options: {} },
        FontAwesomeConfig: {}
    },
    document: {
        createElement: () => ({ style: {}, setAttribute: ()=>{}, appendChild: ()=>{} }),
        getElementById: () => ({ style: {}, remove: ()=>{}, addEventListener: ()=>{} }),
        getElementsByClassName: () => [{ innerText: "", style: {}, innerHTML: "" }],
        querySelector: () => ({ setAttribute: ()=>{} }),
        querySelectorAll: () => [],
        head: { appendChild: ()=>{} },
        body: { style: {} },
        readyState: "complete",
        cookie: "",
        hidden: false
    },
    navigator: { userAgent: "Mozilla/5.0", language: "en", platform: "Win32" },
    location: { href: "http://localhost:5285/", origin: "http://localhost:5285", host: "localhost:5285", pathname: "/", search: "", hostname: "localhost" },
    localStorage: { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} },
    sessionStorage: { getItem: ()=>null, setItem: ()=>{} },
    console: { log: ()=>{}, error: ()=>{}, warn: ()=>{}, info: ()=>{} },
    setTimeout: ()=>0,
    setInterval: ()=>0,
    clearTimeout: ()=>{},
    clearInterval: ()=>{},
    fetch: ()=>Promise.resolve({ json: ()=>Promise.resolve({}), text: ()=>Promise.resolve("") }),
    XMLHttpRequest: function(){ return { open:()=>{}, send:()=>{}, setRequestHeader:()=>{} }; },
    URL: globalThis.URL,
    URLSearchParams: globalThis.URLSearchParams,
    Promise: globalThis.Promise,
    JSON: globalThis.JSON,
    Date: globalThis.Date,
    Math: globalThis.Math,
    parseInt: globalThis.parseInt,
    parseFloat: globalThis.parseFloat,
    isNaN: globalThis.isNaN,
    isFinite: globalThis.isFinite,
    encodeURIComponent: globalThis.encodeURIComponent,
    decodeURIComponent: globalThis.decodeURIComponent,
    encodeURI: globalThis.encodeURI,
    decodeURI: globalThis.decodeURI,
    atob: globalThis.atob,
    btoa: globalThis.btoa,
    Array: globalThis.Array,
    Object: globalThis.Object,
    String: globalThis.String,
    Number: globalThis.Number,
    Boolean: globalThis.Boolean,
    RegExp: globalThis.RegExp,
    Map: globalThis.Map,
    Set: globalThis.Set,
    WeakMap: globalThis.WeakMap,
    Symbol: globalThis.Symbol,
    Proxy: globalThis.Proxy,
    Reflect: globalThis.Reflect,
    Error: globalThis.Error,
    TypeError: globalThis.TypeError,
    RangeError: globalThis.RangeError,
    SyntaxError: globalThis.SyntaxError,
    ArrayBuffer: globalThis.ArrayBuffer,
    Uint8Array: globalThis.Uint8Array,
    Uint16Array: globalThis.Uint16Array,
    Uint32Array: globalThis.Uint32Array,
    Int8Array: globalThis.Int8Array,
    Float32Array: globalThis.Float32Array,
    Float64Array: globalThis.Float64Array,
    DataView: globalThis.DataView,
    TextEncoder: globalThis.TextEncoder,
    TextDecoder: globalThis.TextDecoder,
    SharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : function(){},
    Atomics: typeof Atomics !== 'undefined' ? Atomics : {},
    crypto: { getRandomValues: (a) => { for(let i=0;i<a.length;i++) a[i]=Math.floor(Math.random()*256); return a; } },
    performance: { now: () => Date.now() },
    $: () => ({ on:()=>({}), find:()=>({}), css:()=>({}), text:()=>({}), html:()=>({}), attr:()=>({}), append:()=>({}), remove:()=>({}), hide:()=>({}), show:()=>({}), addClass:()=>({}), removeClass:()=>({}), dxButton:()=>({}), dxTextBox:()=>({}), dxValidato:()=>({}) }),
    jQuery: () => ({ on:()=>{} }),
    Vue: function(){ return {}; },
    io: function(){ return { on:()=>{}, emit:()=>{}, connect:()=>{}, connected: false }; },
    posthog: { init:()=>{}, capture:()=>{}, __SV: 1 },
    Sentry: { init:()=>{}, captureException:()=>{} },
    open: ()=>{},
    close: ()=>{},
    alert: ()=>{},
    confirm: ()=>true,
    self: null,
    top: null,
    parent: null,
    undefined: undefined,
    NaN: NaN,
    Infinity: Infinity,
};
sandbox.window.window = sandbox.window;
sandbox.self = sandbox.window;
sandbox.top = sandbox.window;
sandbox.parent = sandbox.window;
sandbox.globalThis = sandbox;

const ctx = vm.createContext(sandbox);

try {
    // Run with timeout - the decoder sets up quickly, main code will error eventually
    vm.runInContext(code, ctx, { timeout: 5000, filename: "app.js" });
} catch(e) {
    // Expected - main code will fail without full browser APIs
    // But decoder functions should be set up by now
}

// Try to access the decoder
try {
    const results = vm.runInContext(`
        var _d = typeof _0xaecf === 'function' ? _0xaecf : null;
        var _r = {};
        if (_d) {
            _r.ok = true;
            _r["0x31f9"] = _d(0x31f9);
            _r["0x28d2"] = _d(0x28d2);
            _r["0x20d1"] = _d(0x20d1);
            _r["path"] = _d(0x31f9) + _d(0x28d2) + _d(0x20d1) + "tikfinity";
            _r["0x4a0a"] = _d(0x4a0a);
            _r["0x1d84"] = _d(0x1d84);
            _r["0x25b9"] = _d(0x25b9);
            _r["0x11b3"] = _d(0x11b3);
            _r["0x14dc"] = _d(0x14dc);
            _r["0x20b4"] = _d(0x20b4);
            _r["0x1a05"] = _d(0x1a05);
            _r["0x14d2"] = _d(0x14d2);
            _r["0x118f"] = _d(0x118f);
            _r["0x4046"] = _d(0x4046);
            _r["0x18ab"] = _d(0x18ab);
            _r["0x3d67"] = _d(0x3d67);
            _r["0x4a19"] = _d(0x4a19);
        } else {
            _r.ok = false;
        }
        _r;
    `, ctx);

    if (results.ok) {
        console.log("=== DECODED AUTH URL ===");
        console.log("Segment 1 (0x31f9):", JSON.stringify(results["0x31f9"]));
        console.log("Segment 2 (0x28d2):", JSON.stringify(results["0x28d2"]));
        console.log("Segment 3 (0x20d1):", JSON.stringify(results["0x20d1"]));
        console.log("\nFULL AUTH URL PATH:", results["path"]);
        console.log("\n=== OTHER AUTH STRINGS ===");
        const labels = {
            "0x4a0a": "HTTP method",
            "0x1d84": "value/code",
            "0x25b9": "authApi?",
            "0x11b3": "flowId?",
            "0x14dc": "accessToken?",
            "0x20b4": "authApi prefix",
            "0x1a05": "Token suffix",
            "0x14d2": "provider",
            "0x118f": "success msg",
            "0x4046": "dialog?",
            "0x18ab": "close?",
            "0x3d67": "token mid",
            "0x4a19": "token end",
        };
        for (const [k, v] of Object.entries(results)) {
            if (k !== "ok" && k !== "path") {
                console.log(`${k} (${labels[k] || "?"}):`, JSON.stringify(v));
            }
        }
    } else {
        console.log("Decoder function not available after eval");
    }
} catch(e) {
    console.log("Decode error:", e.message);
}
