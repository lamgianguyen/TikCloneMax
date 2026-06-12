const { chromium } = require('playwright-core');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
const BASE = 'http://localhost:5285';
const http = require('../lib/http')(BASE);
const socket = require('../lib/socket');
const ALL = ['coinjar','coinmatch','cannon','wheel','wheelofactions','goal','webcam','overlay','talking','chat','eventcarousel','fallingsnow','firework','ranking','topgifter','topliker','lastx','viewercount','myactions','timer','socialmediarotator','commandinfo','userinfo','transactionviewer','likefountain','streambuddies'];
const MARKER='rgb(1, 2, 3)'; const KEY='chat_backgroundNormal';
(async()=>{
  const w0=await socket.connect(BASE,{channelId:1,appType:'widget'}); const b0=await w0.waitFor('widgetSettings',4000,0)||{}; w0.close();
  const origBg=b0[KEY];
  await http.post('/api/updateSettings',{[KEY]:MARKER}); await new Promise(r=>setTimeout(r,800));
  const b=await chromium.launch({executablePath:EXE,headless:true});
  const res=[];
  for(const name of ALL){
    const p=await b.newPage();
    await p.goto(`${BASE}/widget/${name}/?cid=1&preview=1`,{waitUntil:'domcontentloaded',timeout:20000}).catch(()=>{});
    await p.waitForTimeout(2600);
    const got=await p.evaluate((k)=>{ try{return (window.settings||{})[k];}catch(e){return '(no window.settings)';} }, KEY).catch(()=>'(eval err)');
    await p.close();
    res.push({name, ok: got===MARKER, got});
  }
  await b.close();
  // restore
  if(origBg!==undefined) await http.post('/api/updateSettings',{[KEY]:String(origBg)});
  const ok=res.filter(r=>r.ok), bad=res.filter(r=>!r.ok);
  console.log('=== DELIVERY: mọi overlay có NHẬN settings không? (push marker '+MARKER+') ===');
  res.forEach(r=>console.log('  '+(r.ok?'✓':'✗')+' '+r.name.padEnd(18)+(r.ok?'nhận đúng marker':'got='+JSON.stringify(r.got))));
  console.log('\n=> '+ok.length+'/'+res.length+' overlay NHẬN settings'+(bad.length?'  | không nhận: '+bad.map(r=>r.name).join(', '):' — TẤT CẢ nhận ✓'));
  console.log('restored chat_backgroundNormal = '+JSON.stringify(origBg));
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
