const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'downloads', 'index.html');
const backupPath = path.join(__dirname, 'downloads', 'index_old_backup.html');

let html = fs.readFileSync(indexPath, 'utf8');
const oldHtml = fs.readFileSync(backupPath, 'utf8');

console.log('=== Patching new index.html ===\n');

// 1. Extract stub block from old HTML
const stubMatch = oldHtml.match(/<!-- \[TIKFINITY BROWSER STUB\] -->[\s\S]*?<!-- \[\/TIKFINITY BROWSER STUB\] -->/);
if (!stubMatch) {
    console.error('Could not find BROWSER STUB in old index.html!');
    process.exit(1);
}
const stubBlock = stubMatch[0];
console.log('[1] Extracted browser stub block from old version');

// 2. Extract Sentry stub + Safe API proxy from old HTML
const sentryMatch = oldHtml.match(/<script type="module">\/\/ Sentry disabled[\s\S]*?<\/script>/);
let sentryBlock = '';
if (sentryMatch) {
    sentryBlock = sentryMatch[0];
    console.log('[2] Extracted Sentry/SafeProxy stub from old version');
} else {
    console.log('[2] No Sentry stub found in old version, skipping');
}

// 3. Insert stubs after <head> in new HTML
// Insert browser stub right after first <script> tag or after <head>
const headInsertPoint = html.indexOf('<head>') + '<head>'.length;
const stubInsert = `<script>
window.addEventListener('beforeunload', () => navigator.sendBeacon('/api/logError', 'PAGE UNLOADING'));
window.addEventListener('error', e => navigator.sendBeacon('/api/logError', 'ERROR: ' + e.message));
window.addEventListener('unhandledrejection', e => navigator.sendBeacon('/api/logError', 'UNHANDLED REJECTION: ' + (e.reason && e.reason.message || e.reason)));
</script>
${stubBlock}
`;

// Find the first <script> in <head> and insert before it
const firstScriptInHead = html.indexOf('<script>', headInsertPoint);
if (firstScriptInHead > -1) {
    html = html.slice(0, firstScriptInHead) + stubInsert + html.slice(firstScriptInHead);
    console.log('[3] Inserted browser stub into new index.html');
}

// 4. Insert Sentry stub before </head> or before init.js
if (sentryBlock) {
    const initJsTag = html.indexOf('<script src="/js/init.js">');
    if (initJsTag > -1) {
        html = html.slice(0, initJsTag) + sentryBlock + '\n' + html.slice(initJsTag);
        console.log('[4] Inserted Sentry/SafeProxy stub before init.js');
    }
}

// 5. Replace tikfinity.zerody.one URLs with localhost:3005
html = html.replace(/https:\/\/tikfinity\.zerody\.one/g, 'http://localhost:3005');
console.log('[5] Replaced tikfinity.zerody.one -> localhost:3005');

// 6. Disable/stub external analytics that could cause errors
// Stub the GTM/dataLayer script
html = html.replace(
    /j\.src='\/2l68\/'/,
    "j.src='/2l68/'; j.onerror=function(){console.log('[Stub] GTM blocked')}"
);
console.log('[6] Added GTM error handler');

// 7. Save
fs.writeFileSync(indexPath, html, 'utf8');
console.log(`\n=== Done! Patched index.html saved (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB) ===`);
console.log('Restart server: node start_server.js');
