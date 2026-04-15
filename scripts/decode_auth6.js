const fs = require("fs");
const code = fs.readFileSync("downloads/combo/app.js", "utf8");

// Find the IIFE at the very start: var _0xb7f36f=_0xaecf;(function(...){...})(_0xcd6c,0xNNNN);
// Then function _0xcd6c(){...}
// Then function _0xaecf(){...}

// The first line sets up the alias and rotation
// Let's find everything from start to the end of _0xaecf

const aecfStart = code.indexOf("function _0xaecf(");
let braceCount = 0, started = false, aecfEnd = aecfStart;
for (let i = aecfStart; i < code.length && i < aecfStart + 1000; i++) {
    if (code[i] === "{") { braceCount++; started = true; }
    if (code[i] === "}") braceCount--;
    if (started && braceCount === 0) { aecfEnd = i + 1; break; }
}

// Everything from start of file to end of _0xaecf, but stop before other code
// The _0xaecf is typically near the end of the file (it's a function declaration, hoisted)
// Actually, in obfuscated code, _0xcd6c and _0xaecf are at the END of the file

console.log("_0xaecf at position:", aecfStart, "of", code.length);
console.log("_0xaecf ends at:", aecfEnd);

// Show what's right after _0xaecf
console.log("After _0xaecf:", code.substring(aecfEnd, aecfEnd + 100));

// The file starts with: var _0xb7f36f=_0xaecf;(function(...)...)
// The functions _0xcd6c and _0xaecf are declared (hoisted) at end of file
// Let's just eval the whole start of the file up to where the main code begins
// The IIFE rotation ends with );  then code like socketiowrapper starts

// Find where the initial IIFE ends
const firstIifeStart = code.indexOf("(function(");
let depth = 0, firstIifeEnd = firstIifeStart;
for (let i = firstIifeStart; i < code.length && i < firstIifeStart + 50000; i++) {
    if (code[i] === "(") depth++;
    if (code[i] === ")") depth--;
    if (depth === 0) { firstIifeEnd = i + 1; break; }
}

// Skip the semicolon after IIFE
let codeStart = firstIifeEnd;
while (code[codeStart] === ";" || code[codeStart] === "\n") codeStart++;

console.log("\nFirst IIFE ends at:", firstIifeEnd);
console.log("Code starts at:", codeStart);
console.log("Next chars:", JSON.stringify(code.substring(codeStart, codeStart + 80)));

// The decoder setup is: var alias + IIFE + function _0xcd6c + function _0xaecf
// Since functions are hoisted, we can eval:
// 1. function _0xcd6c
// 2. function _0xaecf
// 3. var _0xb7f36f=_0xaecf  (the alias)
// 4. The IIFE (which rotates the array)

const cd6cStart = code.indexOf("function _0xcd6c()");
braceCount = 0; started = false;
let cd6cEnd = cd6cStart;
for (let i = cd6cStart; i < code.length && i < cd6cStart + 500000; i++) {
    if (code[i] === "{") { braceCount++; started = true; }
    if (code[i] === "}") braceCount--;
    if (started && braceCount === 0) { cd6cEnd = i + 1; break; }
}

const cd6cFunc = code.substring(cd6cStart, cd6cEnd);
const aecfFunc = code.substring(aecfStart, aecfEnd);

// Get the IIFE (from start of file after 'var _0xb7f36f=_0xaecf;')
const aliasEnd = code.indexOf(";") + 1;
const iife = code.substring(aliasEnd, firstIifeEnd + 1);

const evalCode = cd6cFunc + "\n" + aecfFunc + "\nvar _0xb7f36f=_0xaecf;\n" + iife;

try {
    eval(evalCode);
    console.log("\n=== DECODED ===");
    console.log("0x31f9:", JSON.stringify(_0xaecf(0x31f9)));
    console.log("0x28d2:", JSON.stringify(_0xaecf(0x28d2)));
    console.log("0x20d1:", JSON.stringify(_0xaecf(0x20d1)));
    console.log("\nFull path:", _0xaecf(0x31f9) + _0xaecf(0x28d2) + _0xaecf(0x20d1) + "tikfinity");
    console.log("0x4a0a:", JSON.stringify(_0xaecf(0x4a0a)));
    console.log("0x1d84:", JSON.stringify(_0xaecf(0x1d84)));
    console.log("0x25b9:", JSON.stringify(_0xaecf(0x25b9)));
    console.log("0x11b3:", JSON.stringify(_0xaecf(0x11b3)));
    console.log("0x14dc:", JSON.stringify(_0xaecf(0x14dc)));
    console.log("0x20b4:", JSON.stringify(_0xaecf(0x20b4)));
    console.log("0x1a05:", JSON.stringify(_0xaecf(0x1a05)));
    console.log("0x4046:", JSON.stringify(_0xaecf(0x4046)));
    console.log("0x18ab:", JSON.stringify(_0xaecf(0x18ab)));
    console.log("0x14d2:", JSON.stringify(_0xaecf(0x14d2)));
    console.log("0x118f:", JSON.stringify(_0xaecf(0x118f)));
} catch(e) {
    console.log("Error:", e.message);
}
