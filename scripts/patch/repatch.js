const fs = require('fs');
const path = require('path');

const NEW_STUB = `<!-- [TIKFINITY BROWSER STUB] -->
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
      if (moduleName === 'jquery') return window.jQuery || window.$;
      if (moduleName === 'stream') return { Transform: class {} };
      if (moduleName === 'fs') return { existsSync: () => false, readFileSync: () => '' };
      return {};
    };
  }
  if (typeof window.ipcRenderer === 'undefined') {
    window.ipcRenderer = window.require('electron').ipcRenderer;
  }
  if (typeof process === 'undefined') {
    window.process = { env: {}, platform: 'browser', type: 'renderer', versions: {} };
  }
</script>
<!-- [/TIKFINITY BROWSER STUB] -->`;

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (/\.(html)$/i.test(fullPath)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('<!-- [TIKFINITY BROWSER STUB] -->')) {
                const regex = /<!-- \[TIKFINITY BROWSER STUB\] -->[\s\S]*?<!-- \[\/TIKFINITY BROWSER STUB\] -->/;
                const newContent = content.replace(regex, NEW_STUB);
                if (newContent !== content) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log('Repatched:', fullPath);
                }
            }
        }
    }
}

walkDir('downloads');
