const WebSocket = require('ws');
const url = 'ws://localhost:5285/socket.io/?EIO=4&transport=websocket';
const ws = new WebSocket(url);
const events = [];
let loggedIn = false;
let timeout = setTimeout(() => {
  console.log('---events received---');
  events.forEach(e => console.log(e.length > 200 ? e.slice(0,200)+'...' : e));
  process.exit(0);
}, 4000);

ws.on('open', () => {});
ws.on('message', (data) => {
  const msg = data.toString();
  if (msg.startsWith('0{')) {
    ws.send('40');
  } else if (msg.startsWith('40') && !loggedIn) {
    loggedIn = true;
    const login = '42["login",{"channelId":1,"appType":"widget"}]';
    ws.send(login);
    events.push('SENT: '+login);
  } else if (msg.startsWith('42')) {
    try {
      const arr = JSON.parse(msg.slice(2));
      events.push('RECV: ' + arr[0]);
    } catch { events.push('RECV(raw): '+msg.slice(0,80)); }
  } else if (msg.startsWith('2')) {
    ws.send('3');
  }
});
ws.on('error', (e) => { console.log('ERR:', e.message); process.exit(1); });
