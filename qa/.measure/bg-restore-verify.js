const { chromium } = require('playwright-core');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
const BASE = 'http://localhost:5285';
const http = require('../lib/http')(BASE);
(async()=>{
  // restore the user's RED Normal background (from their Customize screenshot)
  await http.post('/api/updateSettings', { chat_backgroundNormal: 'rgba(237, 2, 2, 0.8)' });
  await new Promise(r=>setTimeout(r,700));
  const b = await chromium.launch({ executablePath: EXE, headless: true });
  const p = await b.newPage();
  await p.goto(`${BASE}/widget/chat/?cid=1`,{waitUntil:'domcontentloaded',timeout:20000}).catch(()=>{});
  await p.waitForTimeout(2500);
  await http.post('/api/_dev/fake-chat?text=test&user=normaluser', {}); // normal user → chat_backgroundNormal
  await p.waitForTimeout(1800);
  const r = await p.evaluate(()=>{
    const u=document.querySelector('.username');
    if(!u) return {none:true};
    // walk up to the message bubble that has the bg
    let el=u; for(let i=0;i<5;i++){ if(el && getComputedStyle(el).backgroundColor && getComputedStyle(el).backgroundColor!=='rgba(0, 0, 0, 0)') break; el=el.parentElement; }
    return { bg: el?getComputedStyle(el).backgroundColor:'?' };
  });
  console.log('Normal-user message background:', r.bg);
  console.log(/237, 2, 2/.test(r.bg||'') ? '✓ NỀN ĐỎ ĐÚNG — background ăn setting + đã khôi phục màu của bạn' : '✗ bg=' + r.bg);
  await b.close();
  // verify persisted (don't restore — leave it RED)
  const socket=require('../lib/socket');
  const w=await socket.connect(BASE,{channelId:1,appType:'widget'}); const bag=await w.waitFor('widgetSettings',4000,0)||{}; w.close();
  console.log('chat_backgroundNormal now =', JSON.stringify(bag.chat_backgroundNormal), '(GIỮ đỏ, không restore)');
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
