const fs = require('fs');
const path = require('path');

const DOWNLOADS_DIR = path.join(__dirname, 'downloads');
const TARGET_PORT = 3000;
const LOCAL_HTTP = `http://localhost:${TARGET_PORT}`;
const LOCAL_WS = `ws://localhost:${TARGET_PORT}`;
const LOCAL_HOST = `localhost:${TARGET_PORT}`;

// The Electron stub to inject into the <head> of HTML files
const ELECTRON_STUB = `
<!-- [TIKFINITY BROWSER STUB] -->
<script>
  if (typeof window.require === 'undefined') {
    window.require = function(moduleName) {
      console.log('[Stub] require called for:', moduleName);
      if (moduleName === 'electron') {
        return {
          ipcRenderer: {
            send: function() { console.log('[Stub] ipcRenderer.send', arguments); },
            sendSync: function() { console.log('[Stub] ipcRenderer.sendSync', arguments); return null; },
            on: function() { console.log('[Stub] ipcRenderer.on', arguments); },
            once: function() { console.log('[Stub] ipcRenderer.once', arguments); },
            removeListener: function() { console.log('[Stub] ipcRenderer.removeListener', arguments); },
            removeAllListeners: function() { console.log('[Stub] ipcRenderer.removeAllListeners', arguments); },
            invoke: function() { console.log('[Stub] ipcRenderer.invoke', arguments); return Promise.resolve({}); }
          },
          clipboard: {
             writeText: function(t) { console.log('[Stub] clipboard.writeText', t); window.navigator.clipboard?.writeText(t); },
             readText: function() { return ''; }
          },
          shell: {
             openExternal: function(url) { console.log('[Stub] shell.openExternal', url); window.open(url, '_blank'); }
          }
        };
      }
      return null;
    };
  }
  if (typeof window.ipcRenderer === 'undefined') {
    window.ipcRenderer = window.require('electron').ipcRenderer;
  }
  if (typeof process === 'undefined') {
    window.process = { env: {}, platform: 'browser', type: 'renderer', versions: {} };
  }
</script>
<!-- [/TIKFINITY BROWSER STUB] -->
`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Electron Stubbing (HTML only)
  if (filePath.endsWith('.html') || filePath.endsWith('.backup')) {
    if (!content.includes('[TIKFINITY BROWSER STUB]')) {
      // Inject after <head> if it exists, otherwise at the very beginning
      if (content.includes('<head>')) {
        content = content.replace('<head>', '<head>\n' + ELECTRON_STUB);
      } else if (content.includes('<!DOCTYPE html>')) {
        content = content.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n' + ELECTRON_STUB);
      } else {
        content = ELECTRON_STUB + '\n' + content;
      }
      modified = true;
    }
  }

  // 2. Global URL Replacement
  const replacements = [
    { search: /https:\/\/tikfinity\.zerody\.one/g, replace: LOCAL_HTTP },
    { search: /http:\/\/tikfinity\.zerody\.one/g, replace: LOCAL_HTTP },
    { search: /wss:\/\/tikfinity\.zerody\.one/g, replace: LOCAL_WS },
    { search: /ws:\/\/tikfinity\.zerody\.one/g, replace: LOCAL_WS },
    // Also replace domain strings directly
    { search: /tikfinity\.zerody\.one/g, replace: LOCAL_HOST },
    { search: /api\.tikfinity\.com/g, replace: LOCAL_HOST },
    { search: /ph\.tikfinity\.com/g, replace: LOCAL_HOST }
  ];

  for (const rule of replacements) {
    if (rule.search.test(content)) {
      // reset lastIndex because test advances it for global regexes
      rule.search.lastIndex = 0;
      content = content.replace(rule.search, rule.replace);
      modified = true;
    }
    rule.search.lastIndex = 0;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched:', filePath.replace(__dirname, ''));
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (/\.(html|js|css|backup|original)$/i.test(fullPath)) {
      processFile(fullPath);
    }
  }
}

console.log('Starting Client Patching...');
walkDir(DOWNLOADS_DIR);
console.log('Done.');
