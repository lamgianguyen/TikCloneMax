const fs = require("fs");
const vm = require("vm");
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
const iifeStart = code.indexOf("(function(", 22);
let depth = 0, iifeEnd = iifeStart;
for (let i = iifeStart; i < iifeStart + 50000; i++) {
    if (code[i] === "(") depth++;
    if (code[i] === ")") depth--;
    if (depth === 0) { iifeEnd = i + 1; break; }
}

const decoderCode = code.substring(cd6cStart, cd6cEnd) + "\n" +
    code.substring(aecfStart, aecfEnd) + "\n" +
    code.substring(iifeStart, iifeEnd) + ";\n";

const sandbox = {};
const ctx = vm.createContext(sandbox);

try {
    vm.runInContext(decoderCode, ctx);

    const results = vm.runInContext(`
        var r = {};
        r["0x31f9"] = _0xaecf(0x31f9);
        r["0x28d2"] = _0xaecf(0x28d2);
        r["0x20d1"] = _0xaecf(0x20d1);
        r["path"] = _0xaecf(0x31f9) + _0xaecf(0x28d2) + _0xaecf(0x20d1) + "tikfinity";
        r["0x4a0a"] = _0xaecf(0x4a0a);
        r["0x1d84"] = _0xaecf(0x1d84);
        r["0x25b9"] = _0xaecf(0x25b9);
        r["0x11b3"] = _0xaecf(0x11b3);
        r["0x14dc"] = _0xaecf(0x14dc);
        r["0x20b4"] = _0xaecf(0x20b4);
        r["0x1a05"] = _0xaecf(0x1a05);
        r["0x14d2"] = _0xaecf(0x14d2);
        r["0x118f"] = _0xaecf(0x118f);
        r["0x4046"] = _0xaecf(0x4046);
        r["0x18ab"] = _0xaecf(0x18ab);
        r;
    `, ctx);

    console.log("=== Auth URL Path ===");
    console.log("0x31f9:", results["0x31f9"]);
    console.log("0x28d2:", results["0x28d2"]);
    console.log("0x20d1:", results["0x20d1"]);
    console.log("FULL PATH:", results["path"]);
    console.log("\n=== Auth Strings ===");
    for (const [k, v] of Object.entries(results)) {
        if (k !== "path") console.log(k + ":", JSON.stringify(v));
    }
} catch(e) {
    console.log("Error:", e.message);
    // Try to show where the error is
    const lines = decoderCode.split("\n");
    console.log("Total lines:", lines.length);
    // Check for problematic characters
    for (let i = 0; i < decoderCode.length; i++) {
        const c = decoderCode.charCodeAt(i);
        if (c === 0 || (c > 127 && c < 160)) {
            console.log("Problem char at pos", i, "code:", c, "context:", JSON.stringify(decoderCode.substring(Math.max(0,i-20), i+20)));
            break;
        }
    }
}
