const { spawn } = require('child_process');
const path = require('path');

const exe = path.join(__dirname, 'node_modules', 'electron', 'dist', 'electron.exe');

// Strip ELECTRON_RUN_AS_NODE — when set, electron runs as plain Node and `app` is undefined.
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;
delete env.ELECTRON_NO_ATTACH_CONSOLE;

const child = spawn(exe, ['.'], {
    cwd: __dirname,
    detached: true,
    stdio: 'ignore',
    windowsHide: false,
    env
});
child.unref();
console.log(`[launcher] electron PID=${child.pid}`);
