const WS = require('ws');
const http = require('http');
const URL = 'ws://localhost:5285/socket.io/?EIO=4&transport=websocket';

const results = [];
const pass = (name, detail = '') => results.push({ name, status: 'PASS', detail });
const fail = (name, detail = '') => results.push({ name, status: 'FAIL', detail });

function httpGet(path) {
  return new Promise((resolve) => {
    const req = http.request({ host: 'localhost', port: 5285, path }, (res) => {
      let body = ''; res.on('data', c => body += c); res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', e => resolve({ status: 0, body: e.message }));
    req.end();
  });
}
function httpPost(path) {
  return new Promise((resolve) => {
    const req = http.request({ host: 'localhost', port: 5285, path, method: 'POST' }, (res) => {
      let body = ''; res.on('data', c => body += c); res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', e => resolve({ status: 0, body: e.message }));
    req.end();
  });
}

function wsConnect(loginPayload, holdMs = 1500) {
  return new Promise((resolve) => {
    const ws = new WS(URL);
    const evt = {};
    let li = false;
    let executeActions = [];
    setTimeout(() => { try { ws.close(); } catch {} resolve({ events: evt, executeActions }); }, holdMs);
    ws.on('message', (d) => {
      const m = d.toString();
      if (m.startsWith('0{')) ws.send('40');
      else if (m.startsWith('40') && !li) { li = true; ws.send(loginPayload); }
      else if (m.startsWith('42')) {
        try {
          const a = JSON.parse(m.slice(2));
          evt[a[0]] = a.slice(1);
          if (a[0] === 'executeAction') executeActions.push({ info: a[1], context: a[2] });
        } catch {}
      } else if (m.startsWith('2')) ws.send('3');
    });
    ws.on('error', () => { resolve({ events: evt, executeActions, error: true }); });
  });
}

(async () => {
  let r = await httpGet('/api/tiktok/status');
  if (r.status === 200 && r.body.includes('"connected"')) pass('M1 health');
  else fail('M1 health', 'code=' + r.status);

  r = await httpGet('/api/me');
  try {
    const d = JSON.parse(r.body);
    const ev = JSON.parse(d.channel.dynamicSettings.events || '[]');
    const ttIds = ev.map(e => e.triggerTypeId).sort((a,b)=>a-b);
    if (JSON.stringify(ttIds) === '[3,7,9,10]') pass('M3 events seeded');
    else fail('M3 events seeded', 'got ' + ttIds);
  } catch (e) { fail('M3 events seeded', e.message); }

  r = await httpGet('/api/rest/action?channelId=1&screenId=1&profileId=current&pageSize=1000');
  try {
    const d = JSON.parse(r.body);
    const names = d.actions.map(a => a.name).sort();
    if (JSON.stringify(names) === JSON.stringify(['Follow Alert','Gift Alert','Like Alert','Sub Alert'])) pass('M3 default actions');
    else fail('M3 default actions', 'got ' + names);
  } catch (e) { fail('M3 default actions', e.message); }

  try {
    const d = JSON.parse((await httpGet('/api/rest/action?channelId=1')).body);
    const withAudio = d.actions.filter(a => a.audioUrl).length;
    if (withAudio >= 2) pass('M4 sound alerts', withAudio + ' actions with audioUrl');
    else fail('M4 sound alerts', 'only ' + withAudio + ' actions have audio');
  } catch (e) { fail('M4 sound alerts', e.message); }

  r = await httpGet('/js/tts.js');
  if (r.status === 200 && r.body.includes('class TTSItem')) pass('M5 tts.js engine');
  else fail('M5 tts.js engine', 'code=' + r.status);

  r = await httpGet('/api/me');
  try {
    const ds = JSON.parse(r.body).channel.dynamicSettings;
    const ttsKeys = Object.keys(ds).filter(k => k.includes('tts')).length;
    if (ttsKeys >= 20) pass('M5 TTS settings', ttsKeys + ' keys');
    else fail('M5 TTS settings', ttsKeys + ' keys');
  } catch (e) { fail('M5 TTS settings', e.message); }

  const widgets = ['chat','coinjar','wheelofactions','topgifter','topliker','ranking','lastx','gcounter','goal','viewercount','commandinfo','songrequests','gifts','firework','cannon','emojify','activity-feed','timer','userinfo','myactions'];
  let broken = [];
  for (const w of widgets) {
    const c = (await httpGet('/widget/' + w + '?cid=1')).status;
    if (c !== 200) broken.push(w + '=' + c);
  }
  if (broken.length === 0) pass('M7 widgets all 200', widgets.length + ' widgets');
  else fail('M7 widgets', broken.join(', '));

  const dashUrls = ['/','/api/me','/config/','/dx/'];
  let dashBroken = [];
  for (const u of dashUrls) {
    const c = (await httpGet(u)).status;
    if (c !== 200) dashBroken.push(u + '=' + c);
  }
  if (dashBroken.length === 0) pass('M9 dashboard core', dashUrls.length + ' endpoints');
  else fail('M9 dashboard', dashBroken.join(', '));

  const conn = await wsConnect('42["login",{"channelId":1,"appType":"widget"}]', 1500);
  const required = ['widgetSettings','goalStatus','updateTopGifter','updateTopLiker','updateRanking','topGiftData','setLastX','updateViewerCount','stats'];
  const missing = required.filter(n => !conn.events[n]);
  if (missing.length === 0) pass('E2E widget login emits', required.length + ' events');
  else fail('E2E widget login emits', 'missing ' + missing.join(','));

  if (conn.events.goalStatus) {
    const gs = conn.events.goalStatus[0];
    const cfg = (gs && gs.config) || {};
    const sLikes = ((gs && gs.status) || {}).likes || {};
    const sShares = ((gs && gs.status) || {}).shares || {};
    // Check SHAPE not exact values (user can change targets in UI).
    const tLikes = parseInt(cfg.goal_likes_value, 10);
    const tShares = parseInt(cfg.goal_shares_value, 10);
    const ok = tLikes > 0 && sLikes.target === tLikes
            && tShares > 0 && sShares.target === tShares
            && typeof cfg.goal_likes_title === 'string' && cfg.goal_likes_title.length > 0
            && typeof sLikes.current === 'number' && typeof sLikes.percentage === 'number';
    if (ok) pass('Goal widget payload', 'likes ' + sLikes.current + '/' + tLikes + ', shares ' + sShares.current + '/' + tShares);
    else fail('Goal widget payload', 'cfg likes_v=' + cfg.goal_likes_value + ' likes_t=' + cfg.goal_likes_title + ' shares_v=' + cfg.goal_shares_value + ' status=' + JSON.stringify(sLikes));
  } else {
    fail('Goal widget payload', 'no goalStatus event');
  }

  if (conn.events.widgetSettings) {
    const ws_ = conn.events.widgetSettings[0];
    const ks = ['myactions_enable3d','myactions_enableMove','myactions_enableWaves','myactions_fontType'];
    const miss = ks.filter(k => !(k in ws_));
    if (miss.length === 0) pass('myactions defaults', 'enable3d=' + ws_.myactions_enable3d);
    else fail('myactions defaults', 'missing ' + miss);

    // topg/tops layout — username and counter must NOT overlap
    const tg_user = ws_.topg_usernameYOffset, tg_counter = ws_.topg_counterYOffset;
    const ts_user = ws_.tops_usernameYOffset, ts_counter = ws_.tops_counterYOffset;
    if (typeof tg_user !== 'number' || typeof tg_counter !== 'number') fail('topg layout', 'YOffsets missing/wrong type');
    else if (tg_user === tg_counter) fail('topg layout', 'username and counter overlap at ' + tg_user);
    else pass('topg layout', 'user=' + tg_user + ' counter=' + tg_counter + ' (' + (tg_counter-tg_user) + 'px gap)');
    if (typeof ts_user !== 'number' || typeof ts_counter !== 'number') fail('tops layout', 'YOffsets missing/wrong type');
    else if (ts_user === ts_counter) fail('tops layout', 'username and counter overlap at ' + ts_user);
    else pass('tops layout', 'user=' + ts_user + ' counter=' + ts_counter + ' (' + (ts_counter-ts_user) + 'px gap)');
  }

  // Fetch a real action id dynamically (Import wipes + reseeds with new IDs)
  const actionsResp = await httpGet('/api/rest/action?channelId=1&pageSize=10');
  let firstActionId = null;
  try { firstActionId = JSON.parse(actionsResp.body).actions?.[0]?.id; } catch {}
  if (!firstActionId) { fail('E2E executeAction dispatch', 'no action exists'); }
  else {
    const conn2Promise = wsConnect('42["login",{"channelId":1,"appType":"widget"}]', 2500);
    setTimeout(() => httpPost('/api/widget/actions/test?id=' + firstActionId), 500);
    const conn2 = await conn2Promise;
    if (conn2.executeActions.length > 0) {
      const ea = conn2.executeActions[0];
      if (ea.info && ea.info.id === firstActionId && ea.context && ea.context.username === 'tester' && ea.context.giftName === 'Rose') {
        pass('E2E executeAction dispatch', 'id=' + ea.info.id + ' user=' + ea.context.username);
      } else {
        fail('E2E executeAction dispatch', 'wrong shape: ' + JSON.stringify(ea).slice(0,200));
      }
    } else {
      fail('E2E executeAction dispatch', 'no executeAction received');
    }
  }

  r = await httpPost('/api/widget/actions/test');
  if (r.status === 200 && r.body.includes('"fired":true')) pass('actions/test endpoint');
  else fail('actions/test endpoint', r.status + ' ' + r.body.slice(0,80));

  r = await httpGet('/api/webhooks?channelId=1');
  if (r.status === 200) pass('M10 webhooks endpoint');
  else fail('M10 webhooks endpoint', 'code=' + r.status);

  for (const u of ['/api/chat-commands?channelId=1','/api/points?channelId=1']) {
    const c = (await httpGet(u)).status;
    if (c !== 200) { fail('M8 chatbot', u + '=' + c); break; }
  }
  pass('M8 chatbot endpoints');

  console.log('\n====== FULL TEST REPORT ======');
  results.forEach(rr => console.log('[' + rr.status + '] ' + rr.name + (rr.detail ? ' -- ' + rr.detail : '')));
  const passed = results.filter(rr => rr.status === 'PASS').length;
  const failed = results.filter(rr => rr.status === 'FAIL').length;
  console.log('\n' + passed + ' passed, ' + failed + ' failed (' + results.length + ' total)');
  process.exit(failed > 0 ? 1 : 0);
})();
