const { chromium } = require('playwright-core');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
const BASE = 'http://localhost:5285';
const http = require('../lib/http')(BASE);
const socket = require('../lib/socket');
// widget → {key: fontSize setting key, param: url param}. setFontSettings reads metric/x/c sub-keys for some.
const W = {
  coinjar:{}, coinmatch:{}, cannon:{}, wheel:{}, wheelofactions:{}, webcam:{}, overlay:{}, talking:{},
  chat:{}, fallingsnow:{}, firework:{}, ranking:{}, topgifter:{}, topliker:{}, viewercount:{},
  timer:{}, socialmediarotator:{}, commandinfo:{}, userinfo:{}, transactionviewer:{}, likefountain:{},
  goal:{key:'goalfollowers_fontSize', param:'metric=followers'},
  lastx:{key:'lastx10_fontSize', param:'x=10'},
};
(async()=>{
  // capture originals
  const w0 = await socket.connect(BASE,{channelId:1,appType:'widget'}); const b0 = await w0.waitFor('widgetSettings',4000,0)||{}; w0.close();
  const keys = Object.entries(W).map(([n,c])=>c.key||(n+'_fontSize'));
  const orig={}; keys.forEach(k=>orig[k]=b0[k]);
  // push fontSize=90 for all
  const push={}; keys.forEach(k=>push[k]='90'); await http.post('/api/updateSettings',push);
  await new Promise(r=>setTimeout(r,800));
  const b = await chromium.launch({ executablePath: EXE, headless: true });
  const res=[];
  for(const [name,cfg] of Object.entries(W)){
    const p = await b.newPage();
    const url = `${BASE}/widget/${name}/?cid=1&preview=1`+(cfg.param?'&'+cfg.param:'');
    await p.goto(url,{waitUntil:'domcontentloaded',timeout:20000}).catch(()=>{});
    await p.waitForTimeout(2800);
    const fs = await p.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).fontSize)).catch(()=>-1);
    await p.close();
    // 90 → 1.4em → ~22.4px (base 16). Áp nếu >18px.
    const ok = fs>18;
    res.push({name, fs, ok});
  }
  await b.close();
  // restore originals
  const restore={}; keys.forEach(k=>{ if(orig[k]!==undefined && orig[k]!=='') restore[k]=String(orig[k]); });
  if(Object.keys(restore).length) await http.post('/api/updateSettings',restore);

  console.log('=== SETTINGS ÁP CHO TỪNG OVERLAY (push fontSize=90 → html scale lên?) ===');
  const ok=res.filter(r=>r.ok), bad=res.filter(r=>!r.ok);
  res.forEach(r=>console.log('  '+(r.ok?'✓':'✗')+' '+r.name.padEnd(18)+'html font-size='+r.fs+'px'+(r.ok?' (scaled — ĂN SETTING)':' (16px — không scale)')));
  console.log('\n=> '+ok.length+'/'+res.length+' overlay ĂN SETTING'+(bad.length?'  | không scale: '+bad.map(r=>r.name).join(', '):''));
  console.log('restored '+Object.keys(restore).length+' fontSize gốc.');
  process.exit(0);
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
