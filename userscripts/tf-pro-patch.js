/* Appended to downloaded main.js by patched index.js. Runs in Electron main process. */
;(function tfProPatch() {
  try {
    var electron = require('electron');
    var path = require('path');
    var fs = require('fs');
    var rendererPath = path.join(electron.app.getAppPath(), 'tf-pro-renderer.js');
    var PRO_JS;
    try {
      PRO_JS = fs.readFileSync(rendererPath, 'utf8');
    } catch (e) {
      console.error('[TF-PRO] Cannot read tf-pro-renderer.js:', e.message);
      return;
    }
    electron.app.on('browser-window-created', function (event, win) {
      win.webContents.on('did-finish-load', function () {
        win.webContents.executeJavaScript(PRO_JS).catch(function () {});
      });
    });
    console.log('[TF-PRO] Pro patch active via browser-window-created');
  } catch (e) {
    console.error('[TF-PRO] setup failed:', e);
  }
})();
