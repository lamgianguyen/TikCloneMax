const fs = require("fs");
const code = fs.readFileSync("downloads/combo/app.js", "utf8");

// Step 1: Find the string array definition
const arrMatch = code.match(/^var (_0x[a-f0-9]+)\s*=\s*\[/m);
if (!arrMatch) {
    console.log("String array not found");
    process.exit(1);
}
const arrName = arrMatch[1];
console.log("Array name:", arrName);

// Find end of array
const arrStart = code.indexOf(arrMatch[0]);
let bracketCount = 0;
let arrEnd = arrStart;
for (let i = code.indexOf("[", arrStart); i < code.length; i++) {
    if (code[i] === "[") bracketCount++;
    if (code[i] === "]") bracketCount--;
    if (bracketCount === 0) { arrEnd = i + 1; break; }
}

// Step 2: Find the IIFE rotation function
const afterArr = code.substring(arrEnd, arrEnd + 5000);
const iifeMatch = afterArr.match(/\(function\s*\(/);
let iifeEnd = arrEnd;
if (iifeMatch) {
    const iifeStart = arrEnd + iifeMatch.index;
    // Find the end of the IIFE by matching parens
    let depth = 0;
    for (let i = iifeStart; i < code.length && i < iifeStart + 10000; i++) {
        if (code[i] === "(") depth++;
        if (code[i] === ")") depth--;
        if (depth === 0) { iifeEnd = i + 2; break; } // +2 for ");"
    }
}

// Step 3: Find the decoder function
const afterIife = code.substring(iifeEnd, iifeEnd + 3000);
const decMatch = afterIife.match(/function\s+(_0x[a-f0-9]+)\s*\(/);
let decEnd = iifeEnd;
if (decMatch) {
    const decName = decMatch[1];
    console.log("Decoder name:", decName);
    // Find end of decoder function
    const decStart = iifeEnd + decMatch.index;
    let braceCount = 0;
    let started = false;
    for (let i = decStart; i < code.length && i < decStart + 2000; i++) {
        if (code[i] === "{") { braceCount++; started = true; }
        if (code[i] === "}") braceCount--;
        if (started && braceCount === 0) { decEnd = i + 1; break; }
    }
}

// Step 4: Eval just the decoder setup
const decoderSetup = code.substring(0, decEnd);
console.log("Eval size:", decoderSetup.length, "chars");

try {
    eval(decoderSetup);

    const d = eval("_0xaecf");
    console.log("\n=== Auth URL path segments ===");
    console.log("0x31f9:", JSON.stringify(d(0x31f9)));
    console.log("0x28d2:", JSON.stringify(d(0x28d2)));
    console.log("0x20d1:", JSON.stringify(d(0x20d1)));
    console.log("\nFull path:", d(0x31f9) + d(0x28d2) + d(0x20d1) + "tikfinity");
    console.log("\n=== Other auth strings ===");
    console.log("0x4a0a (method):", JSON.stringify(d(0x4a0a)));
    console.log("0x1d84 (value):", JSON.stringify(d(0x1d84)));
    console.log("0x2ad2 (authApiHos):", JSON.stringify(d(0x2ad2)));
    console.log("0x25b9:", JSON.stringify(d(0x25b9)));
    console.log("0x11b3:", JSON.stringify(d(0x11b3)));
    console.log("0x25d7:", JSON.stringify(d(0x25d7)));
    console.log("0x3c74:", JSON.stringify(d(0x3c74)));
    console.log("0x14dc:", JSON.stringify(d(0x14dc)));
    console.log("0x20b4:", JSON.stringify(d(0x20b4)));
    console.log("0x1a05:", JSON.stringify(d(0x1a05)));
    console.log("0x4046:", JSON.stringify(d(0x4046)));
    console.log("0x18ab:", JSON.stringify(d(0x18ab)));
} catch(e) {
    console.log("Eval error:", e.message);
}
