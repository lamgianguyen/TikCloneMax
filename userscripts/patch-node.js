#!/usr/bin/env node
// Chạy: node userscripts/patch-node.js
// Không cần PowerShell, không cần admin
'use strict';
var cp = require('child_process');
var fs = require('fs');
var path = require('path');
var os = require('os');

var ASAR_PATH    = path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'tikfinity', 'resources', 'app.asar');
var BACKUP_PATH  = ASAR_PATH + '.bak-original';
var EXTRACT_DIR  = path.join(os.tmpdir(), 'tik-asar-patch-' + Date.now());
var SCRIPT_DIR   = __dirname;

function run(cmd) {
  console.log('>', cmd);
  cp.execSync(cmd, { stdio: 'inherit' });
}

// 1. Kiểm tra file tồn tại
['tf-pro-patch.js', 'tf-pro-renderer.js'].forEach(function(f) {
  if (!fs.existsSync(path.join(SCRIPT_DIR, f))) throw new Error('Thieu file: ' + f);
});
if (!fs.existsSync(ASAR_PATH)) throw new Error('Khong tim thay TikFinity: ' + ASAR_PATH);

// 2. Backup (lần đầu)
if (!fs.existsSync(BACKUP_PATH)) {
  fs.copyFileSync(ASAR_PATH, BACKUP_PATH);
  console.log('Backup:', BACKUP_PATH);
} else {
  console.log('Backup da co san.');
}

// 3. Extract luon tu BACKUP (dam bao luon patch ban goc, khong phai ban da bi patch)
if (fs.existsSync(EXTRACT_DIR)) fs.rmSync(EXTRACT_DIR, { recursive: true });
var extractSrc = fs.existsSync(BACKUP_PATH) ? BACKUP_PATH : ASAR_PATH;
console.log('Extract tu:', extractSrc);
run('npx --yes @electron/asar extract "' + extractSrc + '" "' + EXTRACT_DIR + '"');

// 4. Patch index.js (KHONG BOM — Node.js writeFileSync mac dinh UTF-8 khong BOM)
var indexPath = path.join(EXTRACT_DIR, 'index.js');
var content   = fs.readFileSync(indexPath, 'utf8');

var OLD = "writeFile(path.join(RES_DIR, 'main.js'), mainJsResponse.data,";
var NEW = [
  "var _tfPP = require('path').join(__dirname, 'tf-pro-patch.js');",
  "var _tfPC = require('fs').existsSync(_tfPP) ? require('fs').readFileSync(_tfPP, 'utf8').replace(/^\\uFEFF/, '') : '';",
  "writeFile(path.join(RES_DIR, 'main.js'), mainJsResponse.data + '\\n\\n' + _tfPC,",
].join('\n');

if (!content.includes(OLD)) {
  throw new Error('Khong tim thay vi tri patch trong index.js. Backup co the bi sai?');
}
content = content.replace(OLD, NEW);
fs.writeFileSync(indexPath, content, 'utf8'); // utf8 = KHONG BOM
console.log('Patched index.js (khong BOM).');

// 5. Copy scripts Pro
fs.copyFileSync(path.join(SCRIPT_DIR, 'tf-pro-patch.js'),    path.join(EXTRACT_DIR, 'tf-pro-patch.js'));
fs.copyFileSync(path.join(SCRIPT_DIR, 'tf-pro-renderer.js'), path.join(EXTRACT_DIR, 'tf-pro-renderer.js'));
console.log('Da copy tf-pro-patch.js + tf-pro-renderer.js');

// 6. Repack
run('npx @electron/asar pack "' + EXTRACT_DIR + '" "' + ASAR_PATH + '"');
fs.rmSync(EXTRACT_DIR, { recursive: true });

console.log('');
console.log('PATCH THANH CONG!');
console.log('Mo TikFinity -> Pro tu kich hoat sau moi lan load.');
console.log('Rollback: cp "' + BACKUP_PATH + '" "' + ASAR_PATH + '"');
