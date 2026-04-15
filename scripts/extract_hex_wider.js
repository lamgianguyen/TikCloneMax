const fs = require("fs");

const code = fs.readFileSync("downloads/combo/app.js", "utf8");

// Region around openAuthPopup function (~position 2911106 based on search)
const popupRegion = code.substring(2911000, 2916000);
const hexPattern = /\(0x([0-9a-f]+)\)/gi;
const hexValues = new Set();
let match;

while ((match = hexPattern.exec(popupRegion)) !== null) {
    hexValues.add("0x" + match[1]);
}
console.log("openAuthPopup region hex values:", hexValues.size);
console.log(JSON.stringify(Array.from(hexValues).sort()));

// Show the openAuthPopup function context
const popupStart = popupRegion.indexOf("openAuthPopup");
if (popupStart > 0) {
    console.log("\n=== openAuthPopup function ===");
    console.log(popupRegion.substring(popupStart, popupStart + 2000));
}

// Also check region around google bot check (position 3276989)
const googleBotRegion = code.substring(3275000, 3282000);
const hexValues2 = new Set();
while ((match = hexPattern.exec(googleBotRegion)) !== null) {
    hexValues2.add("0x" + match[1]);
}
console.log("\n\ngoogle session region hex values:", hexValues2.size);

// Find the google auth page handler - search for /tiktok pattern
let searchIdx = 0;
while (true) {
    const idx = code.indexOf("/tiktok", searchIdx);
    if (idx === -1) break;
    // Check if it's a page route
    const context = code.substring(Math.max(0, idx - 50), idx + 100);
    if (context.includes("google") || context.includes("auth")) {
        console.log("\n/tiktok route near google/auth at position", idx, ":");
        console.log(code.substring(Math.max(0, idx - 200), idx + 500));
    }
    searchIdx = idx + 1;
}

// Look for 0x2acf and 0x3678 which are in the openAuthPopup title
console.log("\n=== Additional popup-related hex values ===");
// These appear in: 'title': _0x2cd0bb(0x2acf) + _0x2cd0bb(0x3678)
console.log("Need to decode: 0x2acf, 0x3678, 0x21d8, 0x25b9, 0x4046");

// Look for OAuth URL construction
// The Google login might use the session/appConfig pattern
const appConfigRegion = code.substring(3276000, 3285000);
const appConfigIdx = appConfigRegion.indexOf("appConfig");
if (appConfigIdx > 0) {
    console.log("\n=== appConfig usage ===");
    console.log(appConfigRegion.substring(Math.max(0, appConfigIdx - 200), appConfigIdx + 500));
}

// Find the Google OAuth URL - look for 'authEndpoi' or 'authUri' patterns
searchIdx = 2900000;
while (true) {
    const idx = code.indexOf("authEnd", searchIdx);
    if (idx === -1 || idx > 3300000) break;
    console.log("\n=== authEnd* at position", idx, "===");
    console.log(code.substring(Math.max(0, idx - 200), idx + 300));
    searchIdx = idx + 1;
}

// Find OAuth URL - look for _0xb7f36f or decoder calls around the google auth page
searchIdx = 2900000;
const oauthIdx = code.indexOf("'oauth'", searchIdx);
if (oauthIdx > 0 && oauthIdx < 3300000) {
    console.log("\n=== oauth at position", oauthIdx, "===");
    console.log(code.substring(Math.max(0, oauthIdx - 300), oauthIdx + 300));
}

// Check for window.open pattern - it might use sandbox.open or _0x...('open')
searchIdx = 2900000;
while (true) {
    const idx = code.indexOf("'open'", searchIdx);
    if (idx === -1 || idx > 3000000) break;
    console.log("\n=== 'open' string at position", idx, "===");
    console.log(code.substring(Math.max(0, idx - 200), idx + 200));
    searchIdx = idx + 1;
}
