const fs = require("fs");
const code = fs.readFileSync("downloads/combo/app.js", "utf8");

// Extract everything up to the first "function" keyword after the decoder setup
// The decoder is typically in the first ~10000-20000 chars
const setupEnd = code.indexOf("socketiowrapper");
const setup = code.substring(0, setupEnd > 0 ? setupEnd : 20000);

try {
    eval(setup);

    // The decoder function name - try common patterns
    let decoder;
    try { decoder = _0xaecf; } catch(e) {}
    if (!decoder) try { decoder = eval("_0xaecf"); } catch(e) {}

    if (!decoder) {
        // Find decoder function name from the code
        const match = code.match(/function\s+(_0x[a-f0-9]+)\s*\(\s*_0x[a-f0-9]+\s*,\s*_0x[a-f0-9]+\s*\)\s*\{[^}]*_0xcd6c/);
        if (match) {
            console.log("Found decoder:", match[1]);
            decoder = eval(match[1]);
        }
    }

    if (decoder) {
        console.log("=== Auth URL path segments ===");
        console.log("0x31f9:", decoder(0x31f9));
        console.log("0x28d2:", decoder(0x28d2));
        console.log("0x20d1:", decoder(0x20d1));
        console.log("");
        console.log("=== Other auth-related strings ===");
        console.log("0x4a0a:", decoder(0x4a0a));  // HTTP method
        console.log("0x1d84:", decoder(0x1d84));  // code/value
        console.log("0x2ad2:", decoder(0x2ad2));  // authApiHos(t)
        console.log("0x25b9:", decoder(0x25b9));  // authApi flow?
        console.log("0x11b3:", decoder(0x11b3));  // flowId?
        console.log("0x25d7:", decoder(0x25d7));  // concat
        console.log("0x3c74:", decoder(0x3c74));  // tfPageloadData?
        console.log("0x14dc:", decoder(0x14dc));  // accessToken?
        console.log("0x20b4:", decoder(0x20b4));  // authApi?
        console.log("0x1a05:", decoder(0x1a05));  // Token?
        console.log("0x4046:", decoder(0x4046));  // dialog?
        console.log("0x18ab:", decoder(0x18ab));  // close?
    } else {
        console.log("Could not find decoder function");
    }
} catch(e) {
    console.log("Error:", e.message);
    console.log("Stack:", e.stack?.split("\n").slice(0,3).join("\n"));
}
