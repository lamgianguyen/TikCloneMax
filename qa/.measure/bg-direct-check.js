const { chromium } = require('playwright-core');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
const BASE = 'http://localhost:5285';
const http = require('../lib/http')(BASE);
(async()=>{
  const b = await chromium.launch({ executablePath: EXE, headless: true });
  const p = await b.newPage();
  await p.goto(`${BASE}/widget/chat/?cid=1`,{waitUntil:'domcontentloaded',timeout:20000}).catch(()=>{});
  await p.waitForTimeout(3000); // ensure widgetSettings arrived
  const settingVal = await p.evaluate(()=> (window.settings||{}).chat_backgroundNormal);
  console.log('widget received settings.chat_backgroundNormal =', JSON.stringify(settingVal));
  await http.post('/api/_dev/fake-chat?text=bgtest&user=normaluser', {});
  await p.waitForTimeout(1800);
  const r = await p.evaluate(()=>{
    const m=document.querySelector('.chatMessage');
    if(!m) return {none:true};
    return {
      chatMessageBg: getComputedStyle(m).backgroundColor,
      inlineStyle: m.getAttribute('style')||'',
      // also check children backgrounds
      childBgs: [...m.querySelectorAll('*')].map(c=>getComputedStyle(c).backgroundColor).filter(bg=>bg!=='rgba(0, 0, 0, 0)').slice(0,4),
    };
  });
  console.log('.chatMessage backgroundColor:', r.chatMessageBg);
  console.log('.chatMessage inline style   :', (r.inlineStyle||'').slice(0,120));
  console.log('child non-transparent bgs   :', JSON.stringify(r.childBgs));
  console.log(/237, 2, 2/.test(r.chatMessageBg||'')||(r.childBgs||[]).some(x=>/237, 2, 2/.test(x)) ? '✓ NỀN ĐỎ áp đúng' : '✗ KHÔNG đỏ — background không áp');
  await b.close(); process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
