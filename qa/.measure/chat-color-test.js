const { chromium } = require('playwright-core');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
const BASE = 'http://localhost:5285';
const http = require('../lib/http')(BASE);
(async () => {
  // capture originals
  const socket = require('../lib/socket');
  const w0 = await socket.connect(BASE, { channelId: 1, appType: 'widget' });
  const b0 = await w0.waitFor('widgetSettings', 4000, 0) || {}; w0.close();
  const orig = { chat_usernameRgb: b0.chat_usernameRgb, chat_usernameColorNormal: b0.chat_usernameColorNormal };
  // set RGB OFF + red
  await http.post('/api/updateSettings', { chat_usernameRgb: 'false', chat_usernameColorNormal: '#f71414' });
  await new Promise(r => setTimeout(r, 600));
  const b = await chromium.launch({ executablePath: EXE, headless: true });
  const p = await b.newPage({ viewport: { width: 600, height: 400 } });
  await p.goto(`${BASE}/widget/chat/?cid=1`, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(()=>{});
  await p.waitForTimeout(2500); // let it connect + receive settings
  // inject a chat message via dev endpoint (dev mode)
  await http.post('/api/_dev/fake-chat?text=hello&user=tester_red', {});
  await p.waitForTimeout(2000);
  const res = await p.evaluate(() => {
    const u = document.querySelector('.username');
    return u ? { text: u.innerText, color: getComputedStyle(u).color } : { none: true };
  });
  console.log('RGB OFF + red picked → rendered username:', JSON.stringify(res));
  console.log(res.color === 'rgb(247, 20, 20)' ? '✓ ĂN SETTING — username đỏ đúng #f71414' : (res.none ? '(no message rendered — fake-chat may not have reached)' : '✗ color=' + res.color + ' (không khớp đỏ)'));
  await b.close();
  // restore
  await http.post('/api/updateSettings', { chat_usernameRgb: String(orig.chat_usernameRgb), chat_usernameColorNormal: String(orig.chat_usernameColorNormal) });
  console.log('restored chat_usernameRgb=' + orig.chat_usernameRgb);
  process.exit(0);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
