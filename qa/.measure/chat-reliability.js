const { chromium } = require('playwright-core');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
const BASE = 'http://localhost:5285';
const http = require('../lib/http')(BASE);
(async()=>{
  const b = await chromium.launch({ executablePath: EXE, headless: true });
  const p = await b.newPage();
  const warns=[];
  p.on('console', m=>{ if(/SharedIO|timeout|disconnect|reconnect|error/i.test(m.text())) warns.push(m.text().slice(0,80)); });
  await p.goto(`${BASE}/widget/chat/?cid=1`, {waitUntil:'domcontentloaded', timeout:20000}).catch(()=>{});
  await p.waitForTimeout(1500);
  let rendered=0, sent=0;
  for(let i=0;i<6;i++){
    const tag='rel'+i+'_'+Date.now();
    await http.post('/api/_dev/fake-chat?text=msg'+i+'&user='+tag, {});
    sent++;
    // wait up to 3s for this message's username to appear
    let got=false;
    for(let j=0;j<15;j++){ const n=await p.evaluate(t=>[...document.querySelectorAll('.username')].some(u=>u.textContent.includes(t)), tag).catch(()=>false); if(n){got=true;break;} await p.waitForTimeout(200); }
    if(got) rendered++;
    process.stdout.write(got?'✓':'✗');
    await p.waitForTimeout(4500); // ~5s between sends → spans 30s, tests background/idle behavior
  }
  console.log('\nrendered '+rendered+'/'+sent+' messages over ~30s');
  console.log('connection warns:', warns.length? warns.join(' || ') : '(none — stable)');
  // total messages on screen
  const total=await p.evaluate(()=>document.querySelectorAll('.username').length).catch(()=>-1);
  console.log('total .username on screen:', total);
  await b.close(); process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
