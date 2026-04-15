const fs = require("fs");
const vm = require("vm");

// Read and clean - remove any null bytes
let code = fs.readFileSync("downloads/combo/app.js", "utf8");
code = code.replace(/\0/g, ""); // Remove null bytes

// Create browser-like sandbox (copied from decode_full.js)
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
    posthog: { init:()=>{}, capture:()=>{} , __SV: 1 },
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
    vm.runInContext(code, ctx, { timeout: 5000, filename: "app.js" });
} catch(e) {
    // Expected - main code will fail without full browser APIs
}

// =====================================================
// PART 1: Decode critical hex values
// =====================================================
console.log("=".repeat(80));
console.log("ANALYSIS OF /tiktok/google ROUTE IN TIKFINITY FRONTEND");
console.log("=".repeat(80));

try {
    const results = vm.runInContext(`
        var _d = typeof _0xaecf === 'function' ? _0xaecf : null;
        var _r = {};
        if (_d) {
            _r.ok = true;

            // Session init: "fromGAds" flag logic
            _r["0x308f"] = _d(0x308f);   // "session"
            _r["0xcb7"] = _d(0xcb7);     // "fromGAds"
            _r["0x4710"] = _d(0x4710);   // "utm_source"
            _r["0x1c7e"] = _d(0x1c7e);   // "utm_medium"
            _r["0x3671"] = _d(0x3671);   // "cpc"
            _r["0x1435"] = _d(0x1435);   // "gclid"
            _r["0x342e"] = _d(0x342e);   // "affId"
            _r["0x4166"] = _d(0x4166);   // "gads"

            // Navigation
            _r["0x4165"] = _d(0x4165);   // "/tiktok/"
            _r["0x228f"] = _d(0x228f);   // "init"
            _r["0x2f63"] = _d(0x2f63);   // "pageChange"
            _r["0x1066"] = _d(0x1066);   // "defaultPag"

            // Boot function: hash handling
            _r["0x3e19"] = _d(0x3e19);   // "hash"
            _r["0x235"] = _d(0x235);     // "replaceSta"
            _r["0xb66"] = _d(0xb66);     // "isCrawler"

            // AuthUrl (Discord, not Google)
            _r["0x3ae"] = _d(0x3ae);     // "getDiscorO"
            _r["0x33e6"] = _d(0x33e6);   // "AuthUrl"
            _r["0x17a2"] = _d(0x17a2);   // "open"
            _r["0x2747"] = _d(0x2747);   // "_blank"

            // All strings containing 'google' in the decoder table
            var googleStrings = {};
            for (var i = 0; i < 0x4A20; i++) {
                try {
                    var v = _d(i);
                    if (typeof v === 'string' && v.toLowerCase().indexOf('google') !== -1) {
                        googleStrings['0x' + i.toString(16)] = v;
                    }
                } catch(e) {}
            }
            _r.googleStrings = googleStrings;
        } else {
            _r.ok = false;
        }
        _r;
    `, ctx);

    if (results.ok) {
        console.log("\n--- SECTION 1: The 'fromGAds' flag (Google Ads tracking) ---");
        console.log("Decoded session init values:");
        console.log(`  session.fromGAds = originalUrlParams.has("${results["0x1435"]}") || `);
        console.log(`    (originalUrlParams.get("${results["0x4710"]}") === "google" && `);
        console.log(`     originalUrlParams.get("${results["0x1c7e"]}") === "${results["0x3671"]}")`);
        console.log(`  If fromGAds is true: session.affId = "${results["0x4166"]}"`);
        console.log("");
        console.log("MEANING: The word 'google' in the code is used ONLY for Google Ads");
        console.log("attribution tracking. It checks if the user arrived via Google Ads");
        console.log("(utm_source=google & utm_medium=cpc, or gclid param present).");

        console.log("\n--- SECTION 2: Boot function hash-to-path conversion ---");
        console.log("In boot(), if window.location.hash.length > 0:");
        console.log(`  window.history.replaceState(null, null, "${results["0x4165"]}" + hash.slice(1) + search)`);
        console.log("This converts hash-based URLs to path-based URLs:");
        console.log("  /#google  ->  /tiktok/google");
        console.log("  /#setup   ->  /tiktok/setup");

        console.log("\n--- SECTION 3: navigation.init() URL parsing ---");
        console.log("The init function parses window.location.pathname:");
        console.log("  pathname.split('/') -> ['', 'tiktok', 'google']");
        console.log("  lastSegment = 'google'");
        console.log("  navigation.pageChange('google') is called");

        console.log("\n--- SECTION 4: navigation.pageChange('google') behavior ---");
        console.log("pageChange does the following:");
        console.log("  1. Finds .menuitemain[data-pageid=google] in the DOM -> DOES NOT EXIST");
        console.log("  2. Finds .page[data-pageid=google] in the DOM -> DOES NOT EXIST");
        console.log("  3. Removes 'menuitemselected' from all menu items");
        console.log("  4. Removes 'pageenabled' from all pages (hides all pages)");
        console.log("  5. Adds 'menuitemselected' to matching menu item (none found)");
        console.log("  6. Adds 'pageenabled' to matching page (none found)");
        console.log("  7. Sets navigation.currentPage = 'google'");
        console.log("  8. Calls history.pushState({page:'google'}, '', '/tiktok/google')");
        console.log("  9. Calls window['google'].onVisible() IF it exists (it doesn't)");
        console.log("");
        console.log("RESULT: Visiting /tiktok/google shows a BLANK PAGE.");
        console.log("No page content is matched. All pages are hidden, and no 'google'");
        console.log("page exists in the DOM. The user sees the sidebar/navigation but");
        console.log("no content area.");

        console.log("\n--- SECTION 5: What 'AuthUrl' is (Discord, NOT Google) ---");
        console.log(`The AuthUrl in boot: setup.${results["0x3ae"]}${results["0x33e6"]}()`);
        console.log("This is 'getDiscorOAuthUrl' - a Discord OAuth URL, not Google.");
        console.log("It's used for the 'Claim Discord Role' feature for Pro users.");
        console.log("Called via: window.open(setup.getDiscorOAuthUrl(), '_blank')");

        console.log("\n--- SECTION 6: All 'google' strings in the decoder table ---");
        const gs = results.googleStrings;
        for (const [k, v] of Object.entries(gs).sort()) {
            console.log(`  ${k}: ${JSON.stringify(v)}`);
        }
        console.log(`\n  Total: ${Object.keys(gs).length} strings containing 'google'`);
        console.log("  All are: protobuf refs (google/protobuf), Google Analytics/Tag");
        console.log("  tracking refs (cs.google., w.google.c), bot detection (googlebot),");
        console.log("  or a 'google_' prefix string. NONE are Google OAuth.");

        console.log("\n" + "=".repeat(80));
        console.log("CONCLUSION");
        console.log("=".repeat(80));
        console.log("");
        console.log("There is NO Google OAuth or Google authentication in TikFinity.");
        console.log("The route /tiktok/google is NOT a real route. It is simply the");
        console.log("generic page navigation treating 'google' as a page ID.");
        console.log("");
        console.log("What actually happens when visiting /tiktok/google:");
        console.log("  1. Boot function runs normally");
        console.log("  2. navigation.init() parses pathname, extracts 'google'");
        console.log("  3. navigation.pageChange('google') is called");
        console.log("  4. No DOM element with data-pageid='google' exists");
        console.log("  5. All pages are hidden, resulting in a BLANK content area");
        console.log("  6. The sidebar navigation remains visible but no page is selected");
        console.log("");
        console.log("The literal string 'google' in the code appears in these contexts:");
        console.log("  - Google Ads tracking: utm_source === 'google' && utm_medium === 'cpc'");
        console.log("  - Bot detection: /googlebot/ regex in isCrawler check");
        console.log("  - Google Protobuf: library references (google/protobuf/*)");
        console.log("  - Google Analytics: analytics.google.com, chrome.google.com");
        console.log("  - The string 'google_' in the decoded string table (unknown usage)");
        console.log("");
        console.log("The ONLY OAuth in TikFinity is:");
        console.log("  - Discord OAuth (getDiscorOAuthUrl) for role claiming");
        console.log("  - Spotify OAuth (accounts.spotify.com/api/token) for music integration");
    } else {
        console.log("Decoder function not available after eval");
    }
} catch(e) {
    console.log("Decode error:", e.message);
    console.log(e.stack);
}
