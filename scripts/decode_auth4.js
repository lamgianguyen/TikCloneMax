const fs = require("fs");
const code = fs.readFileSync("downloads/combo/app.js", "utf8");

// Provide window/document stubs
global.window = {};
global.document = { createElement: () => ({}) };
global.navigator = { userAgent: "" };
global.location = { href: "" };

// Find _0xcd6c function (string array)
const cd6cStart = code.indexOf("function _0xcd6c()");

// Find _0xaecf function
const aecfStart = code.indexOf("function _0xaecf(");
let braceCount = 0, started = false, aecfEnd = aecfStart;
for (let i = aecfStart; i < code.length && i < aecfStart + 1000; i++) {
    if (code[i] === "{") { braceCount++; started = true; }
    if (code[i] === "}") braceCount--;
    if (started && braceCount === 0) { aecfEnd = i + 1; break; }
}

// Everything from _0xcd6c to end of _0xaecf includes the array + IIFE rotation + decoder
const setupCode = code.substring(cd6cStart, aecfEnd);

try {
    eval(setupCode);

    console.log("=== Auth URL path segments ===");
    console.log("0x31f9:", JSON.stringify(_0xaecf(0x31f9)));
    console.log("0x28d2:", JSON.stringify(_0xaecf(0x28d2)));
    console.log("0x20d1:", JSON.stringify(_0xaecf(0x20d1)));
    const fullPath = _0xaecf(0x31f9) + _0xaecf(0x28d2) + _0xaecf(0x20d1) + "tikfinity";
    console.log("\nFull URL:", fullPath);

    console.log("\n=== Other auth strings ===");
    console.log("0x4a0a:", JSON.stringify(_0xaecf(0x4a0a)));
    console.log("0x1d84:", JSON.stringify(_0xaecf(0x1d84)));
    console.log("0x25b9:", JSON.stringify(_0xaecf(0x25b9)));
    console.log("0x11b3:", JSON.stringify(_0xaecf(0x11b3)));
    console.log("0x14dc:", JSON.stringify(_0xaecf(0x14dc)));
    console.log("0x20b4:", JSON.stringify(_0xaecf(0x20b4)));
    console.log("0x1a05:", JSON.stringify(_0xaecf(0x1a05)));
    console.log("0x4046:", JSON.stringify(_0xaecf(0x4046)));
    console.log("0x18ab:", JSON.stringify(_0xaecf(0x18ab)));
    console.log("0x3d67:", JSON.stringify(_0xaecf(0x3d67)));
    console.log("0x4a19:", JSON.stringify(_0xaecf(0x4a19)));
    console.log("0x14d2:", JSON.stringify(_0xaecf(0x14d2)));
} catch(e) {
    console.log("Error:", e.message, e.stack?.split("\n").slice(0,5).join("\n"));
}
