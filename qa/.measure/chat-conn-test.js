const { chromium } = require('playwright-core');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
const BASE = 'http://localhost:5285';
const http = require('../lib/http')(BASE);
async function trial(label, url) {
  const b = await chromium.launch({ executablePath: EXE, headless: true });
  const p = await b.newPage();
  const logs = [];
  p.on('console', m => logs.push(m.type()[0] + ':' + m.text().slice(0,90)));
  p.on('pageerror', e => logs.push('PAGEERR:' + e.message.slice(0,90)));
  const t0 = Date.now();
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(()=>{});
  // poll until socket connected (window.io.connected or SharedIO ready) up to 15s
  let connMs = -1;
  for (let i=0;i<60;i++){
    const c = await p.evaluate(()=>{ try { return !!(window.io && (window.io.connected || window.io.connected===undefined && window.io.id)) ; } catch(e){ return false; } }).catch(()=>false);
    if (c) { connMs = Date.now()-t0; break; }
    await p.waitForTimeout(250);
  }
  // inject a fake chat, measure render latency
  const tInject = Date.now();
  await http.post('/api/_dev/fake-chat?text=conntest&user=conn_'+Date.now(), {});
  let renderMs = -1;
  for (let i=0;i<40;i++){
    const has = await p.evaluate(()=>document.querySelectorAll('.username').length>0).catch(()=>false);
    if (has){ renderMs = Date.now()-tInject; break; }
    await p.waitForTimeout(200);
  }
  console.log(`\n[${label}] connect=${connMs}ms  fakeChat→render=${renderMs}ms`);
  console.log('  console:', logs.slice(0,8).join(' || ') || '(none)');
  await b.close();
}
(async()=>{
  await trial('SharedIO (default, như browser bạn)', `${BASE}/widget/chat/?cid=1`);
  await trial('NO SharedIO (disableSharedIO=1)', `${BASE}/widget/chat/?cid=1&disableSharedIO=1`);
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
