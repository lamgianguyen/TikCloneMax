const electron = require('electron');
console.log('TYPE:', typeof electron);
console.log('KEYS:', Object.keys(electron).slice(0, 20));
console.log('app:', electron.app);
process.exit(0);
