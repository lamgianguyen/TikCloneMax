const fs = require("fs");
const vm = require("vm");

// Read and clean - remove any null bytes
let code = fs.readFileSync("downloads/combo/app.js", "utf8");
code = code.replace(/\0/g, ""); // Remove null bytes

// Create browser-like sandbox (same as decode_full.js)
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
    // Run with timeout - the decoder sets up quickly, main code will error eventually
    vm.runInContext(code, ctx, { timeout: 5000, filename: "app.js" });
} catch(e) {
    // Expected - main code will fail without full browser APIs
    // But decoder functions should be set up by now
}

// ============================================================
// Decode all hex values from the Google auth flow
// ============================================================
// These hex values were extracted from the following regions of app.js:
//   1. openAuthPopup function (~position 2911000-2916000)
//   2. Google OAuth code validation flow (~position 2916000-2920000)
//   3. Email auth / code submission flow (~position 2920000-2925000)
//   4. Google session/bot check region (~position 3276000-3282000)
// ============================================================

try {
    const results = vm.runInContext(`
        var _d = typeof _0xaecf === 'function' ? _0xaecf :
                 (typeof _0xb7f36f === 'function' ? _0xb7f36f : null);
        var _r = {};
        if (_d) {
            _r.ok = true;

            // ---- Auth URL construction (the fetch call) ----
            _r["0x31f9"] = _d(0x31f9);    // URL segment 1 (e.g. "/api/")
            _r["0x28d2"] = _d(0x28d2);    // URL segment 2
            _r["0x20d1"] = _d(0x20d1);    // URL segment 3
            _r["0x1f6c"] = _d(0x1f6c);    // Email flow URL segment
            _r["0x2523"] = _d(0x2523);    // Email flow URL segment 2
            _r["0x25d7"] = _d(0x25d7);    // String concat method
            _r["0x3c74"] = _d(0x3c74);    // appConfig key
            _r["0x2ad2"] = _d(0x2ad2);    // authApiEnd + ...
            _r["0x32be"] = _d(0x32be);    // authApiApp

            // ---- HTTP method ----
            _r["0x4a0a"] = _d(0x4a0a);    // method (POST?)

            // ---- Request body params ----
            _r["0x25b9"] = _d(0x25b9);    // window key part 1 (authFlow?)
            _r["0x11b3"] = _d(0x11b3);    // window key part 2 (Id?)
            _r["0x1d84"] = _d(0x1d84);    // value/code
            _r["0x2b71"] = _d(0x2b71);    // flowId response key

            // ---- Response handling: success path ----
            _r["0x14dc"] = _d(0x14dc);    // accessToken key
            _r["0xd1a"] = _d(0xd1a);      // set method
            _r["0x20b4"] = _d(0x20b4);    // settings key prefix (authApi)
            _r["0x1a05"] = _d(0x1a05);    // settings key suffix (Token)
            _r["0x3d67"] = _d(0x3d67);    // settings key middle (Prov)
            _r["0x4a19"] = _d(0x4a19);    // settings key end (ider)
            _r["0x14d2"] = _d(0x14d2);    // provider value (google?)
            _r["0x118f"] = _d(0x118f);    // success toast message
            _r["0x37bc"] = _d(0x37bc);    // window.location key
            _r["0x7cf"] = _d(0x7cf);      // reload method

            // ---- Response handling: error path ----
            _r["0x3edb"] = _d(0x3edb);    // error title
            _r["0x2f1e"] = _d(0x2f1e);    // error message key
            _r["0x1f09"] = _d(0x1f09);    // error suffix 1
            _r["0x2c6c"] = _d(0x2c6c);    // error suffix 2
            _r["0x1ed1"] = _d(0x1ed1);    // showError method
            _r["0x3b5d"] = _d(0x3b5d);    // email error msg prefix
            _r["0x34f8"] = _d(0x34f8);    // service unavailable suffix

            // ---- Auth popup dialog ----
            _r["0x4046"] = _d(0x4046);    // authDialog/popup key
            _r["0x18ab"] = _d(0x18ab);    // close method
            _r["0x21d8"] = _d(0x21d8);    // dxPopup method
            _r["0x2acf"] = _d(0x2acf);    // popup title part 1
            _r["0x3678"] = _d(0x3678);    // popup title part 2

            // ---- DOM selectors and UI ----
            _r["0xd3d"] = _d(0xd3d);      // CSS selector prefix
            _r["0xb55"] = _d(0xb55);      // CSS selector suffix (thPopupCod)
            _r["0x1e8e"] = _d(0x1e8e);    // find method
            _r["0x1902"] = _d(0x1902);     // selector prefix 2
            _r["0x3c1"] = _d(0x3c1);      // selector suffix
            _r["0x1fd1"] = _d(0x1fd1);    // dxTextBox method
            _r["0x46f1"] = _d(0x46f1);    // instance key
            _r["0x129d"] = _d(0x129d);    // option method
            _r["0xad2"] = _d(0xad2);      // disabled/readOnly
            _r["0x150d"] = _d(0x150d);    // focus method
            _r["0x1e68"] = _d(0x1e68);    // text method
            _r["0xd0d"] = _d(0xd0d);      // validating text mid
            _r["0x2b00"] = _d(0x2b00);    // validating text end
            _r["0x25b7"] = _d(0x25b7);    // css method
            _r["0x6d9"] = _d(0x6d9);      // css property
            _r["0x434c"] = _d(0x434c);    // json method
            _r["0x2d03"] = _d(0x2d03);    // sent key
            _r["0x2738"] = _d(0x2738);    // CSS class (hidden?)
            _r["0x1482"] = _d(0x1482);    // fadeOut/delay method
            _r["0x70a"] = _d(0x70a);      // fadeIn method
            _r["0x2c41"] = _d(0x2c41);    // length
            _r["0x35a5"] = _d(0x35a5);    // prev key
            _r["0x176f"] = _d(0x176f);    // next key
            _r["0x2dd9"] = _d(0x2dd9);    // validate method
            _r["0xe6e"] = _d(0xe6e);      // isValid
            _r["0x21ff"] = _d(0x21ff);    // abrupt method
            _r["0x2c4e"] = _d(0x2c4e);    // return value
            _r["0x4ae"] = _d(0x4ae);      // dxValidat prefix
            _r["0x182c"] = _d(0x182c);    // thPopupEma selector
            _r["0x27a8"] = _d(0x27a8);    // dxButton method
            _r["0x71e"] = _d(0x71e);      // button text prefix
            _r["0x2e2a"] = _d(0x2e2a);    // button width
            _r["0x2879"] = _d(0x2879);    // mark method
            _r["0x670"] = _d(0x670);      // wrap method
            _r["0x4927"] = _d(0x4927);    // apply method
            _r["0xdc7"] = _d(0xdc7);      // end key
            _r["0x4228"] = _d(0x4228);    // catch key

            // ---- openAuthPopup HTML template ----
            _r["0xb41"] = _d(0xb41);      // append method
            _r["0x732"] = _d(0x732);      // HTML element
            _r["0x44c2"] = _d(0x44c2);    // html method
            _r["0x305"] = _d(0x305);      // localization get
            _r["0x48a1"] = _d(0x48a1);    // l_address suffix
            _r["0x26d9"] = _d(0x26d9);    // HTML template part 1
            _r["0x4833"] = _d(0x4833);    // HTML template part 2
            _r["0x2727"] = _d(0x2727);    // HTML template part 3
            _r["0x3f71"] = _d(0x3f71);    // HTML template part 4
            _r["0x2bd0"] = _d(0x2bd0);    // HTML template part 5
            _r["0xd4c"] = _d(0xd4c);      // HTML template part 6
            _r["0x2c16"] = _d(0x2c16);    // HTML template - type
            _r["0x103a"] = _d(0x103a);    // HTML newline/indent
            _r["0xab7"] = _d(0xab7);      // CSS class
            _r["0x46cd"] = _d(0x46cd);    // CSS class 2
            _r["0x2499"] = _d(0x2499);    // HTML attr
            _r["0x48be"] = _d(0x48be);    // HTML attr 2
            _r["0x2175"] = _d(0x2175);    // HTML content
            _r["0x1098"] = _d(0x1098);    // HTML tag close
            _r["0x1d4e"] = _d(0x1d4e);    // field label
            _r["0x2833"] = _d(0x2833);    // div class
            _r["0x23be"] = _d(0x23be);    // class attr
            _r["0x1d61"] = _d(0x1d61);    // authPo prefix
            _r["0x116d"] = _d(0x116d);    // div close
            _r["0x4439"] = _d(0x4439);    // closing tag
            _r["0xce3"] = _d(0xce3);      // template middle
            _r["0x2316"] = _d(0x2316);    // class attr 2
            _r["0x41e3"] = _d(0x41e3);    // fieldset suffix
            _r["0x95b"] = _d(0x95b);      // div structure
            _r["0x1cc6"] = _d(0x1cc6);    // label class
            _r["0x35f5"] = _d(0x35f5);    // erification
            _r["0x29c0"] = _d(0x29c0);    // code label

            // ---- Additional error/status messages ----
            _r["0x31e3"] = _d(0x31e3);    // error note text 1
            _r["0x2233"] = _d(0x2233);    // error note text 2
            _r["0x2561"] = _d(0x2561);    // error note text 3
            _r["0x241d"] = _d(0x241d);    // error note text 4
            _r["0xb73"] = _d(0xb73);      // error note text 5
            _r["0x3803"] = _d(0x3803);    // CSS display value

            // ---- Async generator / state machine ----
            _r["0x36df"] = _d(0x36df);    // trim method
            _r["0x2879"] = _d(0x2879);    // mark method
            _r["0x4927"] = _d(0x4927);    // apply method

            // ---- Session/Google bot check (position ~3277000) ----
            _r["0x308f"] = _d(0x308f);    // session key
            _r["0x1429"] = _d(0x1429);    // search property
            _r["0x26f1"] = _d(0x26f1);    // getItem method
            _r["0x342e"] = _d(0x342e);    // affId storage key
            _r["0x41b1"] = _d(0x41b1);    // URL param key
            _r["0x1c9c"] = _d(0x1c9c);    // originalUr key
            _r["0x2d9f"] = _d(0x2d9f);    // lParams suffix
            _r["0x1435"] = _d(0x1435);    // has param key
            _r["0x4710"] = _d(0x4710);    // utm_medium param
            _r["0x3671"] = _d(0x3671);    // google value for utm
            _r["0x1c7e"] = _d(0x1c7e);    // another param key
            _r["0xcb7"] = _d(0xcb7);      // property on session
            _r["0x413c"] = _d(0x413c);    // toast position class

            // ---- Additional appConfig keys ----
            _r["0x2900"] = _d(0x2900);    // appConfig flag 1
            _r["0xc37"] = _d(0xc37);      // appConfig flag suffix
            _r["0x3702"] = _d(0x3702);    // settings key 1
            _r["0xe95"] = _d(0xe95);      // settings key 2
            _r["0x677"] = _d(0x677);      // settings key 3
            _r["0x77a"] = _d(0x77a);      // settings value
            _r["0x2740"] = _d(0x2740);    // window property
            _r["0x2ec"] = _d(0x2ec);      // appConfig end

            // ---- openAuthPopup additional internal hex vals ----
            _r["0x3069"] = _d(0x3069);    // error prefix
            _r["0x68a"] = _d(0x68a);      // error suffix

            // ---- More UI interaction ----
            _r["0x1b0c"] = _d(0x1b0c);    // setCode suffix
            _r["0x4711"] = _d(0x4711);    // Button suffix
            _r["0x2ba4"] = _d(0x2ba4);    // .authPopup prefix
            _r["0x10d9"] = _d(0x10d9);    // pleaseWait selector
            _r["0x4ee"] = _d(0x4ee);      // tNote suffix
            _r["0x91f"] = _d(0x91f);      // another selector
            _r["0x36ab"] = _d(0x36ab);    // note text
            _r["0x11ee"] = _d(0x11ee);    // another key

        } else {
            _r.ok = false;
        }
        _r;
    `, ctx);

    if (results.ok) {
        console.log("==========================================================");
        console.log("  DECODED GOOGLE AUTH FLOW - ALL HEX VALUES");
        console.log("==========================================================");

        // Group 1: Auth URL construction
        console.log("\n--- AUTH URL CONSTRUCTION (fetch call) ---");
        console.log("0x31f9:", JSON.stringify(results["0x31f9"]));
        console.log("0x28d2:", JSON.stringify(results["0x28d2"]));
        console.log("0x20d1:", JSON.stringify(results["0x20d1"]));
        console.log("FULL Google Auth URL path:", JSON.stringify(results["0x31f9"] + results["0x28d2"] + results["0x20d1"]));
        console.log("");
        console.log("0x1f6c:", JSON.stringify(results["0x1f6c"]), "(email flow URL segment)");
        console.log("0x2523:", JSON.stringify(results["0x2523"]), "(email flow URL segment 2)");
        console.log("FULL Email Auth URL path:", JSON.stringify(results["0x31f9"] + results["0x1f6c"] + results["0x2523"]));
        console.log("");
        console.log("0x25d7:", JSON.stringify(results["0x25d7"]), "(string concat method)");
        console.log("0x3c74:", JSON.stringify(results["0x3c74"]), "(window config key)");
        console.log("0x2ad2:", JSON.stringify(results["0x2ad2"]), "(authApiEndpoint prefix)");
        console.log("0x32be:", JSON.stringify(results["0x32be"]), "(authApiApp)");

        // Group 2: HTTP method
        console.log("\n--- HTTP METHOD ---");
        console.log("0x4a0a:", JSON.stringify(results["0x4a0a"]), "(HTTP method)");

        // Group 3: Request body params
        console.log("\n--- REQUEST BODY / FLOW ID ---");
        console.log("0x25b9:", JSON.stringify(results["0x25b9"]), "(window auth key part 1)");
        console.log("0x11b3:", JSON.stringify(results["0x11b3"]), "(window auth key part 2)");
        console.log("FULL window key:", JSON.stringify(results["0x25b9"] + results["0x11b3"]));
        console.log("0x1d84:", JSON.stringify(results["0x1d84"]), "(value/code property)");
        console.log("0x2b71:", JSON.stringify(results["0x2b71"]), "(flowId response key)");

        // Group 4: Success response handling
        console.log("\n--- SUCCESS RESPONSE HANDLING ---");
        console.log("0x14dc:", JSON.stringify(results["0x14dc"]), "(accessToken key)");
        console.log("0xd1a:", JSON.stringify(results["0xd1a"]), "(set method)");
        console.log("0x20b4:", JSON.stringify(results["0x20b4"]), "(settings key prefix)");
        console.log("0x1a05:", JSON.stringify(results["0x1a05"]), "(settings key suffix)");
        console.log("FULL settings token key:", JSON.stringify(results["0x20b4"] + results["0x1a05"]));
        console.log("0x3d67:", JSON.stringify(results["0x3d67"]), "(settings provider key mid)");
        console.log("0x4a19:", JSON.stringify(results["0x4a19"]), "(settings provider key end)");
        console.log("FULL settings provider key:", JSON.stringify(results["0x20b4"] + results["0x3d67"] + results["0x4a19"]));
        console.log("0x14d2:", JSON.stringify(results["0x14d2"]), "(provider value)");
        console.log("0x118f:", JSON.stringify(results["0x118f"]), "(success toast message)");
        console.log("0x37bc:", JSON.stringify(results["0x37bc"]), "(window.location)");
        console.log("0x7cf:", JSON.stringify(results["0x7cf"]), "(reload method)");

        // Group 5: Error response handling
        console.log("\n--- ERROR RESPONSE HANDLING ---");
        console.log("0x3edb:", JSON.stringify(results["0x3edb"]), "(error title)");
        console.log("0x2f1e:", JSON.stringify(results["0x2f1e"]), "(error message key)");
        console.log("0x1f09:", JSON.stringify(results["0x1f09"]), "(error text part 1)");
        console.log("0x2c6c:", JSON.stringify(results["0x2c6c"]), "(error text part 2)");
        console.log("0x1ed1:", JSON.stringify(results["0x1ed1"]), "(showError method)");
        console.log("0x3b5d:", JSON.stringify(results["0x3b5d"]), "(email error prefix)");
        console.log("0x34f8:", JSON.stringify(results["0x34f8"]), "(service unavailable)");

        // Group 6: Auth popup dialog
        console.log("\n--- AUTH POPUP DIALOG ---");
        console.log("0x4046:", JSON.stringify(results["0x4046"]), "(popup key on window)");
        console.log("0x18ab:", JSON.stringify(results["0x18ab"]), "(close method)");
        console.log("0x21d8:", JSON.stringify(results["0x21d8"]), "(dxPopup method)");
        console.log("0x2acf:", JSON.stringify(results["0x2acf"]), "(popup title part 1)");
        console.log("0x3678:", JSON.stringify(results["0x3678"]), "(popup title part 2)");
        console.log("FULL popup title:", JSON.stringify(results["0x2acf"] + results["0x3678"]));

        // Group 7: DOM selectors and UI methods
        console.log("\n--- DOM SELECTORS & UI METHODS ---");
        console.log("0xd3d:", JSON.stringify(results["0xd3d"]), "(selector prefix)");
        console.log("0xb55:", JSON.stringify(results["0xb55"]), "(selector: thPopupCod)");
        console.log("FULL code input selector:", JSON.stringify(results["0xd3d"] + results["0xb55"] + "e"));
        console.log("0x182c:", JSON.stringify(results["0x182c"]), "(email popup selector)");
        console.log("FULL email input selector:", JSON.stringify(results["0xd3d"] + results["0x182c"] + "il"));
        console.log("0x1902:", JSON.stringify(results["0x1902"]), "(selector 2 prefix)");
        console.log("0x3c1:", JSON.stringify(results["0x3c1"]), "(selector 2 suffix)");
        console.log("FULL note selector:", JSON.stringify(results["0x1902"] + results["0x3c1"]));
        console.log("0x1e8e:", JSON.stringify(results["0x1e8e"]), "(find method)");
        console.log("0x1fd1:", JSON.stringify(results["0x1fd1"]), "(dxTextBox)");
        console.log("0x46f1:", JSON.stringify(results["0x46f1"]), "(instance key)");
        console.log("0x129d:", JSON.stringify(results["0x129d"]), "(option method)");
        console.log("0xad2:", JSON.stringify(results["0xad2"]), "(readOnly/disabled)");
        console.log("0x150d:", JSON.stringify(results["0x150d"]), "(focus method)");
        console.log("0x1e68:", JSON.stringify(results["0x1e68"]), "(text method)");
        console.log("0xd0d:", JSON.stringify(results["0xd0d"]), "(validating msg mid)");
        console.log("0x2b00:", JSON.stringify(results["0x2b00"]), "(validating msg end)");
        console.log("0x25b7:", JSON.stringify(results["0x25b7"]), "(css method)");
        console.log("0x6d9:", JSON.stringify(results["0x6d9"]), "(css property)");
        console.log("0x434c:", JSON.stringify(results["0x434c"]), "(json method)");
        console.log("0x2d03:", JSON.stringify(results["0x2d03"]), "(sent key)");
        console.log("0x2738:", JSON.stringify(results["0x2738"]), "(CSS class)");
        console.log("0x1482:", JSON.stringify(results["0x1482"]), "(fadeOut/delay)");
        console.log("0x70a:", JSON.stringify(results["0x70a"]), "(fadeIn)");
        console.log("0x2c41:", JSON.stringify(results["0x2c41"]), "(length)");
        console.log("0x35a5:", JSON.stringify(results["0x35a5"]), "(prev state key)");
        console.log("0x176f:", JSON.stringify(results["0x176f"]), "(next state key)");
        console.log("0x2dd9:", JSON.stringify(results["0x2dd9"]), "(validate)");
        console.log("0xe6e:", JSON.stringify(results["0xe6e"]), "(isValid)");
        console.log("0x21ff:", JSON.stringify(results["0x21ff"]), "(abrupt)");
        console.log("0x2c4e:", JSON.stringify(results["0x2c4e"]), "(return value)");
        console.log("0x4ae:", JSON.stringify(results["0x4ae"]), "(dxValidat)");
        console.log("0x27a8:", JSON.stringify(results["0x27a8"]), "(dxButton)");
        console.log("0x71e:", JSON.stringify(results["0x71e"]), "(button text)");
        console.log("0x2e2a:", JSON.stringify(results["0x2e2a"]), "(button width)");
        console.log("0x36df:", JSON.stringify(results["0x36df"]), "(trim method)");
        console.log("0x4927:", JSON.stringify(results["0x4927"]), "(apply method)");
        console.log("0xdc7:", JSON.stringify(results["0xdc7"]), "(end key)");
        console.log("0x4228:", JSON.stringify(results["0x4228"]), "(catch key)");

        // Group 8: Auth popup HTML template
        console.log("\n--- AUTH POPUP HTML TEMPLATE ---");
        console.log("0xb41:", JSON.stringify(results["0xb41"]), "(append)");
        console.log("0x732:", JSON.stringify(results["0x732"]), "(HTML element)");
        console.log("0x44c2:", JSON.stringify(results["0x44c2"]), "(html method)");
        console.log("0x305:", JSON.stringify(results["0x305"]), "(localization get)");
        console.log("0x48a1:", JSON.stringify(results["0x48a1"]), "(l_address suffix)");
        console.log("0x26d9:", JSON.stringify(results["0x26d9"]), "(template part 1)");
        console.log("0x4833:", JSON.stringify(results["0x4833"]), "(template part 2)");
        console.log("0x2727:", JSON.stringify(results["0x2727"]), "(template part 3)");
        console.log("0x3f71:", JSON.stringify(results["0x3f71"]), "(template part 4)");
        console.log("0x2bd0:", JSON.stringify(results["0x2bd0"]), "(template part 5)");
        console.log("0xd4c:", JSON.stringify(results["0xd4c"]), "(template part 6)");
        console.log("0x2c16:", JSON.stringify(results["0x2c16"]), "(type attr)");
        console.log("0x103a:", JSON.stringify(results["0x103a"]), "(newline/indent)");
        console.log("0xab7:", JSON.stringify(results["0xab7"]), "(CSS class)");
        console.log("0x46cd:", JSON.stringify(results["0x46cd"]), "(CSS class 2)");
        console.log("0x2499:", JSON.stringify(results["0x2499"]), "(HTML attr)");
        console.log("0x48be:", JSON.stringify(results["0x48be"]), "(HTML attr 2)");
        console.log("0x2175:", JSON.stringify(results["0x2175"]), "(HTML content)");
        console.log("0x1098:", JSON.stringify(results["0x1098"]), "(tag close)");
        console.log("0x1d4e:", JSON.stringify(results["0x1d4e"]), "(field label)");
        console.log("0x2833:", JSON.stringify(results["0x2833"]), "(div class)");
        console.log("0x23be:", JSON.stringify(results["0x23be"]), "(class attr)");
        console.log("0x1d61:", JSON.stringify(results["0x1d61"]), "(authPo prefix)");
        console.log("0x116d:", JSON.stringify(results["0x116d"]), "(div close)");
        console.log("0x4439:", JSON.stringify(results["0x4439"]), "(closing tag)");
        console.log("0xce3:", JSON.stringify(results["0xce3"]), "(template mid)");
        console.log("0x2316:", JSON.stringify(results["0x2316"]), "(class attr 2)");
        console.log("0x41e3:", JSON.stringify(results["0x41e3"]), "(fieldset suffix)");
        console.log("0x95b:", JSON.stringify(results["0x95b"]), "(div structure)");
        console.log("0x1cc6:", JSON.stringify(results["0x1cc6"]), "(label class)");
        console.log("0x35f5:", JSON.stringify(results["0x35f5"]), "(verification)");
        console.log("0x29c0:", JSON.stringify(results["0x29c0"]), "(code label)");

        // Group 9: Status/note messages
        console.log("\n--- STATUS / NOTE MESSAGES ---");
        console.log("0x31e3:", JSON.stringify(results["0x31e3"]), "(error note 1)");
        console.log("0x2233:", JSON.stringify(results["0x2233"]), "(error note 2)");
        console.log("0x2561:", JSON.stringify(results["0x2561"]), "(error note 3)");
        console.log("0x241d:", JSON.stringify(results["0x241d"]), "(error note 4)");
        console.log("0xb73:", JSON.stringify(results["0xb73"]), "(error note 5)");
        console.log("0x3803:", JSON.stringify(results["0x3803"]), "(CSS display)");

        // Group 10: Session / Google bot check
        console.log("\n--- SESSION / GOOGLE BOT CHECK ---");
        console.log("0x308f:", JSON.stringify(results["0x308f"]), "(session key)");
        console.log("0x1429:", JSON.stringify(results["0x1429"]), "(search property)");
        console.log("0x26f1:", JSON.stringify(results["0x26f1"]), "(getItem)");
        console.log("0x342e:", JSON.stringify(results["0x342e"]), "(affId key)");
        console.log("0x41b1:", JSON.stringify(results["0x41b1"]), "(URL param)");
        console.log("0x1c9c:", JSON.stringify(results["0x1c9c"]), "(originalUr key)");
        console.log("0x2d9f:", JSON.stringify(results["0x2d9f"]), "(lParams suffix)");
        console.log("0x1435:", JSON.stringify(results["0x1435"]), "(has param)");
        console.log("0x4710:", JSON.stringify(results["0x4710"]), "(utm param)");
        console.log("0x3671:", JSON.stringify(results["0x3671"]), "(utm value)");
        console.log("0x1c7e:", JSON.stringify(results["0x1c7e"]), "(another param)");
        console.log("0xcb7:", JSON.stringify(results["0xcb7"]), "(session property)");
        console.log("0x413c:", JSON.stringify(results["0x413c"]), "(toast position)");

        // Group 11: AppConfig flags
        console.log("\n--- APP CONFIG FLAGS ---");
        console.log("0x2900:", JSON.stringify(results["0x2900"]), "(appConfig flag)");
        console.log("0xc37:", JSON.stringify(results["0xc37"]), "(flag suffix)");
        console.log("FULL appConfig flag:", JSON.stringify(results["0x2900"] + results["0xc37"]));
        console.log("0x3702:", JSON.stringify(results["0x3702"]), "(settings key)");
        console.log("0xe95:", JSON.stringify(results["0xe95"]), "(settings key 2)");
        console.log("0x677:", JSON.stringify(results["0x677"]), "(settings key 3)");
        console.log("0x77a:", JSON.stringify(results["0x77a"]), "(settings value)");
        console.log("0x2740:", JSON.stringify(results["0x2740"]), "(window property)");
        console.log("0x2ec:", JSON.stringify(results["0x2ec"]), "(appConfig end)");

        // Group 12: Misc
        console.log("\n--- MISC ---");
        console.log("0x3069:", JSON.stringify(results["0x3069"]), "(error prefix)");
        console.log("0x68a:", JSON.stringify(results["0x68a"]), "(error suffix)");
        console.log("0x1b0c:", JSON.stringify(results["0x1b0c"]), "(setCode suffix)");
        console.log("0x4711:", JSON.stringify(results["0x4711"]), "(Button suffix)");
        console.log("0x2ba4:", JSON.stringify(results["0x2ba4"]), "(.authPopup prefix)");
        console.log("0x10d9:", JSON.stringify(results["0x10d9"]), "(pleaseWait selector)");
        console.log("0x4ee:", JSON.stringify(results["0x4ee"]), "(tNote suffix)");
        console.log("0x91f:", JSON.stringify(results["0x91f"]), "(another selector)");
        console.log("0x36ab:", JSON.stringify(results["0x36ab"]), "(note text)");
        console.log("0x11ee:", JSON.stringify(results["0x11ee"]), "(another key)");
        console.log("0x670:", JSON.stringify(results["0x670"]), "(wrap)");

        // ============================================================
        // RECONSTRUCTED AUTH FLOWS
        // ============================================================
        console.log("\n==========================================================");
        console.log("  RECONSTRUCTED AUTH FLOWS");
        console.log("==========================================================");

        console.log("\n1. GOOGLE CODE AUTH FLOW:");
        console.log("   URL: window.appConfig." + results["0x2ad2"] + "t + " + JSON.stringify(results["0x31f9"] + results["0x28d2"] + results["0x20d1"]) + " + window.appConfig.authApiAppId");
        console.log("   Method:", results["0x4a0a"]);
        console.log("   Body: { flowId: window." + results["0x25b9"] + results["0x11b3"] + ", code: <user_code>." + results["0x1d84"] + " }");
        console.log("   On success:");
        console.log("     - settings.set('pendingLogin', 1)");
        console.log("     - settings.set('" + results["0x20b4"] + results["0x1a05"] + "', response.accessToken)");
        console.log("     - settings.set('" + results["0x20b4"] + results["0x3d67"] + results["0x4a19"] + "', '" + results["0x14d2"] + "')");
        console.log("     - window." + results["0x25b9"] + results["0x4046"] + "." + results["0x18ab"] + "()");
        console.log("     - toastr.success('" + results["0x118f"] + "')");
        console.log("     - setTimeout(() => window." + results["0x37bc"] + "." + results["0x7cf"] + "())");

        console.log("\n2. EMAIL AUTH FLOW:");
        console.log("   URL: window.appConfig." + results["0x2ad2"] + "t + " + JSON.stringify(results["0x31f9"] + results["0x1f6c"] + results["0x2523"]) + " + window.appConfig." + results["0x32be"] + "Id");
        console.log("   Method:", results["0x4a0a"]);
        console.log("   Body: { email: <email_input>.value.toLowerCase().trim() }");
        console.log("   On success: window." + results["0x25b9"] + results["0x11b3"] + " = response." + results["0x2b71"]);

        console.log("\n3. AUTH POPUP:");
        console.log("   Title:", JSON.stringify(results["0x2acf"] + results["0x3678"]));
        console.log("   Method: " + results["0x21d8"] + "(...)");
        console.log("   Code input: " + JSON.stringify(results["0xd3d"] + results["0xb55"] + "e"));
        console.log("   Email input: " + JSON.stringify(results["0xd3d"] + results["0x182c"] + "il"));

    } else {
        console.log("Decoder function not available after eval");
    }
} catch(e) {
    console.log("Decode error:", e.message);
    console.log(e.stack);
}
