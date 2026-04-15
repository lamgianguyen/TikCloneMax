const fs = require("fs");
const code = fs.readFileSync("downloads/combo/app.js", "utf8");

// Find _0xcd6c function (string array)
const cd6cStart = code.indexOf("function _0xcd6c()");
if (cd6cStart < 0) { console.log("_0xcd6c not found"); process.exit(1); }

// Find end of _0xcd6c function
let braceCount = 0, started = false, cd6cEnd = cd6cStart;
for (let i = cd6cStart; i < code.length && i < cd6cStart + 500000; i++) {
    if (code[i] === "{") { braceCount++; started = true; }
    if (code[i] === "}") braceCount--;
    if (started && braceCount === 0) { cd6cEnd = i + 1; break; }
}
console.log("_0xcd6c length:", cd6cEnd - cd6cStart);

// Find _0xaecf function
const aecfStart = code.indexOf("function _0xaecf(");
let aecfEnd = aecfStart;
braceCount = 0; started = false;
for (let i = aecfStart; i < code.length && i < aecfStart + 1000; i++) {
    if (code[i] === "{") { braceCount++; started = true; }
    if (code[i] === "}") braceCount--;
    if (started && braceCount === 0) { aecfEnd = i + 1; break; }
}

// Find the IIFE rotation (between array start and decoder)
const iifeCode = code.substring(0, aecfEnd);

// Extract JUST what we need: the array function + IIFE + decoder
const evalCode = code.substring(cd6cStart, aecfEnd);

// Also need the IIFE before _0xaecf
const beforeAecf = code.substring(0, aecfStart);
const lastIifeStart = beforeAecf.lastIndexOf("(function(");
const rotationAndDecoder = code.substring(lastIifeStart, aecfEnd);

// Need _0xcd6c + rotation IIFE + _0xaecf
const fullSetup = code.substring(cd6cStart, aecfEnd);
// But also the IIFE that's between _0xcd6c and _0xaecf
const betweenCode = code.substring(cd6cEnd, aecfStart);

try {
    // Eval everything from _0xcd6c to end of _0xaecf
    const allCode = code.substring(Math.min(cd6cStart, lastIifeStart), aecfEnd);
    eval(allCode);

    console.log("\n=== Auth URL path segments ===");
    console.log("0x31f9:", JSON.stringify(_0xaecf(0x31f9)));
    console.log("0x28d2:", JSON.stringify(_0xaecf(0x28d2)));
    console.log("0x20d1:", JSON.stringify(_0xaecf(0x20d1)));
    const fullPath = _0xaecf(0x31f9) + _0xaecf(0x28d2) + _0xaecf(0x20d1) + "tikfinity";
    console.log("\nFull URL path:", fullPath);
    console.log("\n=== Other auth strings ===");
    console.log("0x4a0a (method):", JSON.stringify(_0xaecf(0x4a0a)));
    console.log("0x1d84 (value):", JSON.stringify(_0xaecf(0x1d84)));
    console.log("0x25b9:", JSON.stringify(_0xaecf(0x25b9)));
    console.log("0x11b3:", JSON.stringify(_0xaecf(0x11b3)));
    console.log("0x14dc:", JSON.stringify(_0xaecf(0x14dc)));
    console.log("0x20b4:", JSON.stringify(_0xaecf(0x20b4)));
    console.log("0x1a05:", JSON.stringify(_0xaecf(0x1a05)));
    console.log("0x4046:", JSON.stringify(_0xaecf(0x4046)));
    console.log("0x18ab:", JSON.stringify(_0xaecf(0x18ab)));
} catch(e) {
    console.log("Error:", e.message);
}
