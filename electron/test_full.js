const WebSocket = require('ws');
const http = require('http');

const URL = 'ws://localhost:5285/socket.io/?EIO=4&transport=websocket';
const results = [];
function pass(name, detail='') { results.push({ name, status: 'PASS', detail }); }
function fail(name, detail='') { results.push({ name, status: 'FAIL', detail }); }

function httpGet(path, opts={}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: 'localhost', port: 5285, path, method: opts.method || 'GET' }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function test1_health() {
  const r = await httpGet('/api/tiktok/status');
  if (r.status === 200 && r.body.includes('"connected"')) pass('A. /api/tiktok/status');
  else fail('A. /api/tiktok/status', `code=${r.status}`);
}

async function test2_seededEvents() {
  const r = await httpGet('/api/me');
  try {
    const d = JSON.parse(r.body);
    const ev = JSON.parse(d.channel.dynamicSettings.events || '[]');
    const ttIds = ev.map(e => e.triggerTypeId).sort();
    const expected = [3, 7, 9, 10];
    if (JSON.stringify(ttIds) === JSON.stringify(expected)) pass('B. seeded events', `triggerTypeIds=${ttIds}`);
    else fail('B. seeded events', `got ${JSON.stringify(ttIds)}`);
  } catch (e) { fail('B. seeded events', e.message); }
}

async function test3_actionsList() {
  const r = await httpGet('/api/rest/action?channelId=1&screenId=1&profileId=current&pageSize=1000');
  try {
    const d = JSON.parse(r.body);
    const names = d.actions.map(a => a.name).sort();
    const expected = ['Follow Alert','Gift Alert','Like Alert','Sub Alert'];
    if (JSON.stringify(names) === JSON.stringify(expected)) pass('C. 4 default actions seeded');
    else fail('C. actions list', `got ${JSON.stringify(names)}`);
  } catch (e) { fail('C. actions list', e.message); }
}

async function test4_widgetSettings() {
  const r = await httpGet('/api/me');
  try {
    const d = JSON.parse(r.body);
    const ds = d.channel.dynamicSettings || {};
    const has3d = ('myactions_enable3d' in ds);
    const hasMove = ('myactions_enableMove' in ds);
    const hasFontType = ('myactions_fontType' in ds);
    if (has3d && hasMove && hasFontType) pass('D. myactions defaults present');
    else fail('D. myactions defaults', `enable3d=${has3d} enableMove=${hasMove} fontType=${hasFontType}`);
  } catch (e) { fail('D. myactions defaults', e.message); }
}

function wsLogin(appType='widget') {
  return new Promise((resolve) => {
    const ws = new WebSocket(URL);
    const events = [];
    let loggedIn = false;
    const t = setTimeout(() => { try{ws.close();}catch{}; resolve(events); }, 1500);
    ws.on('message', (data) => {
      const msg = data.toString();
      if (msg.startsWith('0{')) ws.send('40');
      else if (msg.startsWith('40') && !loggedIn) {
        loggedIn = true;
        ws.send('42["login",{"channelId":1,"appType":"' + appType + '"}]');
      }
      else if (msg.startsWith('42')) { try { events.push(JSON.parse(msg.slice(2))); } catch {} }
      else if (msg.startsWith('2')) ws.send('3');
    });
    ws.on('error', () => { clearTimeout(t); resolve(events); });
  });
}

async function test5_initialAggregateOnLogin() {
  const events = await wsLogin('widget');
  const names = events.map(e => e[0]);
  const required = ['widgetSettings','updateTopGifter','updateTopLiker','updateRanking','topGiftData','setLastX','goalStatus'];
  const missing = required.filter(n => !names.includes(n));
  if (missing.length === 0) pass('E. login emits aggregate state', `${names.length} events`);
  else fail('E. login emits aggregate state', `missing: ${missing.join(',')}`);
}

async function test6_actionTestEndpoint() {
  return new Promise((resolve) => {
    // Open a widget connection
    const ws = new WebSocket(URL);
    let executeReceived = null;
    let loggedIn = false;
    const t = setTimeout(() => {
      try{ws.close();}catch{};
      if (executeReceived) {
        const [name, actionInfo, context] = executeReceived;
        const ok = name === 'executeAction'
          && actionInfo && actionInfo.id === 3
          && context && context.username === 'tester'
          && context.giftName === 'Rose';
        if (ok) pass('F. executeAction multi-arg dispatch', `id=${actionInfo.id} ctx.user=${context.username}`);
        else fail('F. executeAction multi-arg', `got name=${name} info=${JSON.stringify(actionInfo).slice(0,80)} ctx=${JSON.stringify(context).slice(0,80)}`);
      } else fail('F. executeAction multi-arg', 'no executeAction event received');
      resolve();
    }, 2500);

    ws.on('message', (data) => {
      const msg = data.toString();
      if (msg.startsWith('0{')) ws.send('40');
      else if (msg.startsWith('40') && !loggedIn) {
        loggedIn = true;
        ws.send('42["login",{"channelId":1,"appType":"widget"}]');
        // Now hit the test endpoint
        setTimeout(() => {
          const req = http.request({ host: 'localhost', port: 5285, path: '/api/widget/actions/test?id=3', method: 'POST' });
          req.end();
        }, 300);
      } else if (msg.startsWith('42')) {
        try {
          const arr = JSON.parse(msg.slice(2));
          if (arr[0] === 'executeAction') executeReceived = arr;
        } catch {}
      } else if (msg.startsWith('2')) ws.send('3');
    });
  });
}

async function test7_widgetAssets() {
  const urls = ['/widget/topgifter?cid=1','/widget/myactions?cid=1&screen=1','/widget/coinjar?cid=1','/widget/wheelofactions?cid=1','/widget/chat?cid=1','/widget/myactions/sharedio/sharedio.js','/widget/myactions/socketioclient.js','/widget/myactions/mediawrapper.js','/api/rest/action?channelId=1&screenId=1','/api/tiktok/gifts'];
  const broken = [];
  for (const u of urls) {
    const r = await httpGet(u);
    if (r.status !== 200) broken.push(`${u}=${r.status}`);
  }
  if (broken.length === 0) pass('G. widget HTML + assets all 200', `${urls.length} URLs`);
  else fail('G. widget HTML + assets', broken.join(', '));
}

(async () => {
  await test1_health();
  await test2_seededEvents();
  await test3_actionsList();
  await test4_widgetSettings();
  await test5_initialAggregateOnLogin();
  await test6_actionTestEndpoint();
  await test7_widgetAssets();
  console.log('\n=== RESULTS ===');
  results.forEach(r => console.log(`[${r.status}] ${r.name}${r.detail ? ' — ' + r.detail : ''}`));
  const fails = results.filter(r => r.status === 'FAIL').length;
  console.log(`\n${results.length - fails}/${results.length} passed`);
  process.exit(fails > 0 ? 1 : 0);
})();
