const fs = require("fs");
const code = fs.readFileSync("downloads/combo/app.js", "utf8");

// Find function boundaries
function findFuncEnd(src, start) {
    let bc = 0, st = false;
    for (let i = start; i < src.length; i++) {
        if (src[i] === "{") { bc++; st = true; }
        if (src[i] === "}") bc--;
        if (st && bc === 0) return i + 1;
    }
    return -1;
}

const cd6cStart = code.indexOf("function _0xcd6c()");
const cd6cEnd = findFuncEnd(code, cd6cStart);

const aecfStart = code.indexOf("function _0xaecf(");
const aecfEnd = findFuncEnd(code, aecfStart);

// IIFE rotation - starts right after "var _0xb7f36f=_0xaecf;"
const iifeSearchStart = code.indexOf("var _0xb7f36f=_0xaecf;") + "var _0xb7f36f=_0xaecf;".length;
const iifeStart = code.indexOf("(function(", iifeSearchStart);
let depth = 0, iifeEnd = iifeStart;
for (let i = iifeStart; i < code.length && i < iifeStart + 50000; i++) {
    if (code[i] === "(") depth++;
    if (code[i] === ")") depth--;
    if (depth === 0) { iifeEnd = i + 1; break; }
}

// Write temporary file with just the decoder
const tmpCode = `
${code.substring(cd6cStart, cd6cEnd)}
${code.substring(aecfStart, aecfEnd)}
${code.substring(iifeStart, iifeEnd)};

// Now decode
console.log("=== Auth URL path ===");
console.log("0x31f9:", JSON.stringify(_0xaecf(0x31f9)));
console.log("0x28d2:", JSON.stringify(_0xaecf(0x28d2)));
console.log("0x20d1:", JSON.stringify(_0xaecf(0x20d1)));
console.log("FULL PATH:", _0xaecf(0x31f9) + _0xaecf(0x28d2) + _0xaecf(0x20d1) + "tikfinity");
console.log("\\n=== Auth strings ===");
console.log("0x4a0a:", JSON.stringify(_0xaecf(0x4a0a)));
console.log("0x1d84:", JSON.stringify(_0xaecf(0x1d84)));
console.log("0x25b9:", JSON.stringify(_0xaecf(0x25b9)));
console.log("0x11b3:", JSON.stringify(_0xaecf(0x11b3)));
console.log("0x14dc:", JSON.stringify(_0xaecf(0x14dc)));
console.log("0x20b4:", JSON.stringify(_0xaecf(0x20b4)));
console.log("0x1a05:", JSON.stringify(_0xaecf(0x1a05)));
console.log("0x14d2:", JSON.stringify(_0xaecf(0x14d2)));
console.log("0x118f:", JSON.stringify(_0xaecf(0x118f)));
`;

fs.writeFileSync("scripts/_tmp_decoder.js", tmpCode);
console.log("Written tmp file, length:", tmpCode.length);
console.log("cd6c:", cd6cStart, "-", cd6cEnd, "(", cd6cEnd - cd6cStart, "bytes)");
console.log("aecf:", aecfStart, "-", aecfEnd, "(", aecfEnd - aecfStart, "bytes)");
console.log("iife:", iifeStart, "-", iifeEnd, "(", iifeEnd - iifeStart, "bytes)");
