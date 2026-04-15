const fs = require("fs");

const code = fs.readFileSync("downloads/combo/app.js", "utf8");

// Extract auth flow regions
// Occurrence 2: Google OAuth code flow (position ~2916482)
// Occurrence 3: Email auth flow (position ~2920924)

// Get a wide region covering both auth flows
const start1 = 2915000;
const end1 = 2925000;

const authRegion = code.substring(start1, end1);

// Extract all hex values like (0xNNNN) from this region
const hexPattern = /\(0x([0-9a-f]+)\)/gi;
const hexValues = new Set();
let match;

while ((match = hexPattern.exec(authRegion)) !== null) {
    hexValues.add("0x" + match[1]);
}

console.log("Found", hexValues.size, "unique hex values in auth flow region (" + start1 + "-" + end1 + "):");
const sorted = Array.from(hexValues).sort();
console.log(JSON.stringify(sorted));

// Also look at the wider auth page setup - search for the page handler
// Look for where /tiktok/google or google auth popup is set up
const googleIdx = code.indexOf("'google'", 3278179);
if (googleIdx > 0) {
    const gStart = Math.max(0, googleIdx - 500);
    const gEnd = Math.min(code.length, googleIdx + 1000);
    console.log("\n=== Google string reference at", googleIdx, "===");
    console.log(code.substring(gStart, gEnd));
}

// Look for the auth popup setup - search near occurrence 2 for the popup window open
const popupRegion = code.substring(2910000, 2918000);
const popupIdx = popupRegion.indexOf("open");
if (popupIdx > 0) {
    console.log("\n=== 'open' found in auth region at offset", popupIdx, "===");
    console.log(popupRegion.substring(Math.max(0, popupIdx - 300), popupIdx + 300));
}

// Search for authPopup or popup setup
let searchStart = 2900000;
const authPopupIdx = code.indexOf("authPopup", searchStart);
if (authPopupIdx > 0) {
    const apStart = Math.max(0, authPopupIdx - 500);
    const apEnd = Math.min(code.length, authPopupIdx + 1000);
    console.log("\n=== authPopup at", authPopupIdx, "===");
    console.log(code.substring(apStart, apEnd));
}

// Search backwards from the fetch call for the function entry point
const fetchPos = 2916482; // where 0x31f9 appears in occurrence 2
// Look further back for the function start
const preAuth = code.substring(fetchPos - 5000, fetchPos);
const funcMatch = preAuth.lastIndexOf("function");
if (funcMatch > 0) {
    console.log("\n=== Function entry before auth fetch (offset from region start:", funcMatch, ") ===");
    console.log(preAuth.substring(funcMatch, funcMatch + 2000));
}

// Find the accounts.google.com URL construction - it might be built from hex values
// Search for 'accounts' string
let accIdx = 0;
while (true) {
    accIdx = code.indexOf("accounts", accIdx);
    if (accIdx === -1) break;
    if (accIdx > 1600000 && accIdx < 2000000) {
        // This might be in the string array
        console.log("\n=== 'accounts' at position", accIdx, "===");
        console.log(code.substring(Math.max(0, accIdx - 100), accIdx + 200));
    }
    accIdx++;
}
