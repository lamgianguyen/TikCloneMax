const { chromium } = require('playwright-core');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
const BASE = 'http://localhost:5285';
const http = require('../lib/http')(BASE);
const socket = require('../lib/socket');
(async()=>{
  // capture originals
  const w0 = await socket.connect(BASE,{channelId:1,appType:'widget'});
  const b0 = await w0.waitFor('widgetSettings',4000,0)||{}; w0.close();
  const KEYS=['chat_usernameRgb','chat_usernameColorNormal','chat_commentColorNormal','chat_backgroundNormal','chat_fontSize'];
  const orig={}; KEYS.forEach(k=>orig[k]=b0[k]);
  // push distinctive settings
  const SET={ chat_usernameRgb:'false', chat_usernameColorNormal:'#11ff00', chat_commentColorNormal:'#00aaff', chat_backgroundNormal:'rgb(80, 0, 80)', chat_fontSize:'70' };
  await http.post('/api/updateSettings', SET);
  await new Promise(r=>setTimeout(r,700));
  const b = await chromium.launch({ executablePath: EXE, headless: true });
  const p = await b.newPage();
  await p.goto(`${BASE}/widget/chat/?cid=1`,{waitUntil:'domcontentloaded',timeout:20000}).catch(()=>{});
  await p.waitForTimeout(2500);
  await http.post('/api/_dev/fake-chat?text=settingcheck&user=setcheck', {});
  await p.waitForTimeout(2000);
  const r = await p.evaluate(()=>{
    const u=document.querySelector('.username'), c=document.querySelector('.comment');
    const item=u?u.closest('div'):null;
    return u? {
      userColor: getComputedStyle(u).color,
      commentColor: c?getComputedStyle(c).color:'?',
      htmlFontSize: getComputedStyle(document.documentElement).fontSize,
    } : {none:true};
  });
  console.log('=== CHAT settings-apply (RGB off, distinctive values) ===');
  const exp={ userColor:'rgb(17, 255, 0)', commentColor:'rgb(0, 170, 255)' };
  console.log('  username color :', r.userColor, r.userColor===exp.userColor?'✓ #11ff00':'✗');
  console.log('  comment color  :', r.commentColor, r.commentColor===exp.commentColor?'✓ #00aaff':'✗');
  console.log('  html font-size :', r.htmlFontSize, '(fontSize=70 → ~1.2em scale, áp nếu >16px)');
  const pass = r.userColor===exp.userColor && r.commentColor===exp.commentColor;
  console.log('  => '+(pass?'✓ CHAT ĂN SETTING (màu username+comment áp đúng)':'✗ KHÔNG áp'));
  await b.close();
  // restore
  const restore={}; KEYS.forEach(k=>{ if(orig[k]!==undefined) restore[k]=String(orig[k]); });
  await http.post('/api/updateSettings',restore);
  console.log('  restored originals (chat_usernameRgb='+orig.chat_usernameRgb+')');
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
