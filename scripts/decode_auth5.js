const fs = require("fs");
const code = fs.readFileSync("downloads/combo/app.js", "utf8");

global.window = {};
global.document = { createElement: () => ({}) };
global.navigator = { userAgent: "" };
global.location = { href: "" };

// Find _0xcd6c and _0xaecf
const cd6cStart = code.indexOf("function _0xcd6c()");
const aecfStart = code.indexOf("function _0xaecf(");
let braceCount = 0, started = false, aecfEnd = aecfStart;
for (let i = aecfStart; i < code.length && i < aecfStart + 1000; i++) {
    if (code[i] === "{") { braceCount++; started = true; }
    if (code[i] === "}") braceCount--;
    if (started && braceCount === 0) { aecfEnd = i + 1; break; }
}

// Only eval the decoder functions, not the code in between that has side effects
// Structure: function _0xcd6c(){...array...} then IIFE rotation then function _0xaecf(){...}
// But there may be other code between them. Let's extract just the two functions + IIFE

// Find end of _0xcd6c
braceCount = 0; started = false;
let cd6cEnd = cd6cStart;
for (let i = cd6cStart; i < code.length && i < cd6cStart + 500000; i++) {
    if (code[i] === "{") { braceCount++; started = true; }
    if (code[i] === "}") braceCount--;
    if (started && braceCount === 0) { cd6cEnd = i + 1; break; }
}

// Extract _0xcd6c function
const cd6cFunc = code.substring(cd6cStart, cd6cEnd);
// Extract _0xaecf function
const aecfFunc = code.substring(aecfStart, aecfEnd);

// Find the IIFE rotation between them
const between = code.substring(cd6cEnd, aecfStart);
const iifeStart = between.indexOf("(function(");
let iifeCode = "";
if (iifeStart >= 0) {
    let depth = 0;
    let iifeEnd2 = iifeStart;
    for (let i = iifeStart; i < between.length; i++) {
        if (between[i] === "(") depth++;
        if (between[i] === ")") depth--;
        if (depth === 0) { iifeEnd2 = i + 1; break; }
    }
    iifeCode = between.substring(iifeStart, iifeEnd2 + 1); // include trailing ;
}

const evalCode = cd6cFunc + "\n" + iifeCode + "\n" + aecfFunc;
console.log("Eval code length:", evalCode.length);

try {
    eval(evalCode);
    var _0xb7f36f = _0xaecf; // alias used in the main code

    console.log("\n=== Auth URL path segments ===");
    console.log("0x31f9:", JSON.stringify(_0xaecf(0x31f9)));
    console.log("0x28d2:", JSON.stringify(_0xaecf(0x28d2)));
    console.log("0x20d1:", JSON.stringify(_0xaecf(0x20d1)));
    const fullPath = _0xaecf(0x31f9) + _0xaecf(0x28d2) + _0xaecf(0x20d1) + "tikfinity";
    console.log("\nFull URL path:", fullPath);

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
    console.log("0x118f:", JSON.stringify(_0xaecf(0x118f)));
} catch(e) {
    console.log("Error:", e.message);
}
