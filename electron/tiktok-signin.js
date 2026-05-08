// Inline TikTok sign-in flow.
//
// Opens a separate BrowserWindow pointing at TikTok's web login. While the
// user signs in we poll the window's session for the `sessionid` cookie.
// As soon as it appears (and survives one extra second to make sure the
// login wasn't aborted) we close the window and persist the cookie.
//
// The captured cookie is then injected into the bridge process via
// process.env.TIKTOK_SESSIONID so the connector skips the public signing
// service (Eulerstream rate-limit) and TikTok treats the connection as a
// real authenticated user instead of an anonymous bot.

const { BrowserWindow, session } = require('electron');
const tiktokSessionStore = require('./tiktok-session-store');

const TIKTOK_LOGIN_URL =
    'https://www.tiktok.com/passport/web/login' +
    '?lang=en' +
    '&redirect_url=' + encodeURIComponent('https://www.tiktok.com/');
const TIKTOK_HOME_URL  = 'https://www.tiktok.com/';
const COOKIE_DOMAIN    = '.tiktok.com';
const COOKIE_NAME      = 'sessionid';
const POLL_INTERVAL_MS = 1000;
const MAX_WAIT_MS      = 10 * 60 * 1000; // give the user up to 10 minutes

// User-agent that mimics a real Chrome on Windows. Some TikTok auth flows
// reject Electron's default UA outright.
const LOGIN_UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

let activeWindow = null;

async function readSessionIdCookie() {
    try {
        const cookies = await session.defaultSession.cookies.get({
            domain: COOKIE_DOMAIN,
            name: COOKIE_NAME
        });
        // Pick the longest value (TikTok sometimes sets short transitional
        // values during the login dance — the final one is the longest).
        const valid = (cookies || []).filter((c) => c.value && c.value.length >= 20);
        if (!valid.length) return null;
        valid.sort((a, b) => b.value.length - a.value.length);
        return valid[0].value;
    } catch (err) {
        console.warn('[tiktok-signin] cookies.get failed:', err.message);
        return null;
    }
}

async function readUsernameCookie() {
    // Best-effort — TikTok sets `tt_chain_token` and others; nickname is in
    // `passport_csrf_token` sometimes. We don't need it, just nice for UI.
    try {
        const cookies = await session.defaultSession.cookies.get({
            domain: COOKIE_DOMAIN,
            name: 'tt-target-idc'  // not the username, but stable per region
        });
        return cookies && cookies[0] ? cookies[0].value : null;
    } catch {
        return null;
    }
}

/**
 * Open the TikTok login window and resolve when the sessionid cookie
 * appears. Returns { ok, sessionId?, cancelled? }.
 */
function openSignIn(parentWindow) {
    if (activeWindow && !activeWindow.isDestroyed()) {
        activeWindow.show();
        activeWindow.focus();
        return Promise.resolve({ ok: false, cancelled: true, reason: 'ALREADY_OPEN' });
    }

    return new Promise((resolve) => {
        const partition = 'persist:tiktok-signin';
        const win = new BrowserWindow({
            width: 560,
            height: 920,
            minWidth: 480,
            minHeight: 720,
            parent: parentWindow && !parentWindow.isDestroyed() ? parentWindow : undefined,
            modal: false,
            title: 'Đăng nhập TikTok',
            autoHideMenuBar: true,
            resizable: true,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                sandbox: true,
                partition
            }
        });
        activeWindow = win;
        // Center on the parent so the user doesn't have to hunt for it.
        try { if (parentWindow && !parentWindow.isDestroyed()) win.center(); } catch { /* fine */ }

        win.webContents.setUserAgent(LOGIN_UA);

        // Inject CSS that hides TikTok's main app chrome (left nav, video
        // feed, footer, "Get Coins/Get App" header) and centers the login
        // modal on a plain dark background. The user only sees the auth UI.
        const HIDE_CHROME_CSS = `
            html, body {
                background: #161823 !important;
                overflow: hidden !important;
            }
            /* Hide left side nav, top header, footer, video feed, Get Coins */
            [class*="DivSideNavContainer"],
            [class*="DivLeftSideNav"],
            [class*="DivHeaderContainer"],
            [class*="DivAppHeader"],
            [class*="DivVideoFeed"],
            [class*="DivVideoCard"],
            [class*="DivFooterWrapper"],
            [class*="DivVerticalContainer"],
            [class*="DivContainer"][class*="VideoCard"],
            [data-e2e="recommend-list-item-container"],
            [data-e2e="nav-bar"],
            [data-e2e="top-bar"],
            header,
            nav,
            footer {
                display: none !important;
            }
            /* Ensure the login modal stays visible and centered */
            [class*="DivBoxContainer"],
            [class*="DivLoginContainer"],
            [class*="DivBodyContainer"] {
                position: fixed !important;
                inset: 0 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                background: #161823 !important;
                z-index: 999 !important;
            }
            /* Generic backdrop that may dim the login modal — make it solid */
            [class*="Mask"], [class*="mask"] {
                background: #161823 !important;
                opacity: 1 !important;
            }
        `;
        win.webContents.on('dom-ready', () => {
            try { win.webContents.insertCSS(HIDE_CHROME_CSS); } catch { /* ignore */ }
        });
        win.webContents.on('did-navigate', () => {
            try { win.webContents.insertCSS(HIDE_CHROME_CSS); } catch { /* ignore */ }
        });
        win.webContents.on('did-navigate-in-page', () => {
            try { win.webContents.insertCSS(HIDE_CHROME_CSS); } catch { /* ignore */ }
        });

        // OAuth popups: Facebook, Google, LINE, KakaoTalk all open a child
        // window via window.open(...). Without an explicit handler Electron
        // would either block them or open in the system browser — neither
        // syncs cookies back to our partition. Allow each child to spawn as
        // a real BrowserWindow inside the same partition, so the eventual
        // redirect back to tiktok.com lands a real `sessionid` in our jar.
        win.webContents.setWindowOpenHandler(({ url }) => ({
            action: 'allow',
            overrideBrowserWindowOptions: {
                width: 540,
                height: 720,
                parent: win,
                autoHideMenuBar: true,
                webPreferences: {
                    contextIsolation: true,
                    nodeIntegration: false,
                    sandbox: true,
                    partition
                }
            }
        }));
        // Apply the same Chrome-like UA to every child window. Some OAuth
        // providers (notably Google) reject the default Electron UA outright.
        win.webContents.on('did-create-window', (childWin) => {
            try {
                childWin.webContents.setUserAgent(LOGIN_UA);
                // When the OAuth flow finishes, the provider redirects back
                // to tiktok.com — at that point TikTok sets the sessionid
                // cookie and the child closes itself. Force-close it from
                // our side too in case the provider keeps it hanging.
                childWin.webContents.on('did-navigate', (_e, url) => {
                    if (typeof url === 'string'
                        && url.indexOf('tiktok.com') >= 0
                        && url.indexOf('login') < 0
                        && url.indexOf('passport') < 0) {
                        try { if (!childWin.isDestroyed()) childWin.close(); } catch { /* already closed */ }
                    }
                });
            } catch (err) {
                console.warn('[tiktok-signin] child window setup failed:', err.message);
            }
        });

        let resolved = false;
        let pollTimer = null;
        const startedAt = Date.now();
        // Snapshot the sessionid that exists AFTER the login page has loaded.
        // TikTok sets an anonymous sessionid cookie automatically for visitors
        // who haven't logged in yet — if we snapshot before page load that
        // anonymous cookie looks like a fresh login and the window closes
        // immediately. Wait for did-finish-load so the baseline includes
        // whatever TikTok seeds for anonymous browsers.
        let initialSessionId = null;
        let snapshotReady = false;
        win.webContents.once('did-finish-load', async () => {
            try {
                // Settle a tick — TikTok may set the anonymous sessionid in a
                // follow-up XHR after DOMContentLoaded.
                await new Promise(r => setTimeout(r, 1500));
                const cks = await win.webContents.session.cookies.get({
                    domain: COOKIE_DOMAIN,
                    name: COOKIE_NAME
                });
                if (cks && cks[0] && cks[0].value) initialSessionId = cks[0].value;
                console.log('[tiktok-signin] Baseline sessionid len=' + (initialSessionId ? initialSessionId.length : 0));
            } catch { /* best effort */ }
            snapshotReady = true;
        });

        const finalize = (result) => {
            if (resolved) return;
            resolved = true;
            if (pollTimer) clearInterval(pollTimer);
            try { if (!win.isDestroyed()) win.close(); } catch { /* already closed */ }
            activeWindow = null;
            resolve(result);
        };

        win.on('closed', () => {
            if (!resolved) {
                resolved = true;
                if (pollTimer) clearInterval(pollTimer);
                activeWindow = null;
                resolve({ ok: false, cancelled: true });
            }
        });

        // Clear partition cookies first so TikTok shows the actual login
        // form instead of redirecting an already-logged-in user to /foryou.
        // The cookies stored in our session file remain untouched until a
        // fresh sessionid is captured below — so canceling out doesn't leave
        // the bridge stranded.
        (async () => {
            try {
                await win.webContents.session.clearStorageData({
                    storages: ['cookies', 'localstorage', 'serviceworkers', 'cachestorage', 'indexdb']
                });
            } catch (err) {
                console.warn('[tiktok-signin] clearStorageData (pre-login) failed:', err.message);
            }
            try {
                await win.loadURL(TIKTOK_LOGIN_URL);
            } catch (err) {
                finalize({ ok: false, error: err.message });
            }
        })();

        // Poll the partition's cookie jar for the sessionid. We can't rely on
        // the `cookies-changed` event from defaultSession because we're using
        // a separate partition.
        async function pollCookie() {
            if (resolved) return;
            // Wait until the initial snapshot has been read so we don't
            // accidentally treat the previous session's cookie as a new login.
            if (!snapshotReady) return;
            try {
                // Real login signal: tt-target-idc cookie is ONLY set after
                // a successful login — anonymous visitors don't get it.
                // Without this we'd close the window on TikTok's bootstrap
                // sessionid (which appears for every visitor).
                const idcCookies = await win.webContents.session.cookies.get({
                    domain: COOKIE_DOMAIN,
                    name: 'tt-target-idc'
                });
                const idcPresent = idcCookies && idcCookies[0] && idcCookies[0].value;
                if (!idcPresent) return;

                const cookies = await win.webContents.session.cookies.get({
                    domain: COOKIE_DOMAIN,
                    name: COOKIE_NAME
                });
                const valid = (cookies || []).filter((c) => c.value && c.value.length >= 20);
                if (valid.length > 0) {
                    valid.sort((a, b) => b.value.length - a.value.length);
                    const sessionId = valid[0].value;
                    // Skip if this is just the anonymous-session cookie that was
                    // already there when the page first loaded. Only proceed
                    // when the user actually completes a fresh login (tt-target-idc
                    // present AND sessionid differs from the baseline).
                    if (initialSessionId && sessionId === initialSessionId) return;

                    // Wait one more poll to make sure the cookie persists (i.e.
                    // login finished, not just an intermediate token).
                    setTimeout(async () => {
                        if (resolved) return;
                        const recheck = await win.webContents.session.cookies.get({
                            domain: COOKIE_DOMAIN,
                            name: COOKIE_NAME
                        });
                        const stillThere = (recheck || []).some((c) => c.value === sessionId);
                        if (stillThere) {
                            // Try to grab the @ handle from the page so we can show
                            // it in the UI later. Best-effort.
                            let username = null;
                            try {
                                const handle = await win.webContents.executeJavaScript(
                                    `(function(){ try { var l = document.querySelector('[data-e2e="profile-link"]'); ` +
                                    `if (l && l.getAttribute('href')) return l.getAttribute('href').replace(/^\\/+|\\/+$/g, '').replace(/^@+/, ''); } catch(e){} return null; })()`,
                                    true
                                );
                                if (handle) username = String(handle);
                            } catch { /* page might be on the login screen still */ }

                            // Capture tt-target-idc cookie too — the v2 connector
                            // requires it whenever a sessionId is supplied.
                            let ttTargetIdc = null;
                            try {
                                const idcCookies = await win.webContents.session.cookies.get({
                                    domain: COOKIE_DOMAIN,
                                    name: 'tt-target-idc'
                                });
                                if (idcCookies && idcCookies[0] && idcCookies[0].value) {
                                    ttTargetIdc = idcCookies[0].value;
                                }
                            } catch { /* best-effort */ }

                            try { tiktokSessionStore.save(sessionId, username, ttTargetIdc); } catch (saveErr) {
                                console.error('[tiktok-signin] persist failed:', saveErr.message);
                            }
                            // Inject into the running process so the bridge picks it up
                            // on its next spawn without an app restart.
                            process.env.TIKTOK_SESSIONID = sessionId;
                            if (ttTargetIdc) process.env.TIKTOK_TT_TARGET_IDC = ttTargetIdc;

                            finalize({ ok: true, sessionId, username });
                        }
                    }, POLL_INTERVAL_MS);
                }
            } catch (err) {
                console.warn('[tiktok-signin] poll error:', err.message);
            }

            if (Date.now() - startedAt > MAX_WAIT_MS) {
                finalize({ ok: false, error: 'TIMEOUT' });
            }
        }
        pollTimer = setInterval(pollCookie, POLL_INTERVAL_MS);
    });
}

function isSignedIn() {
    return tiktokSessionStore.getStatus().signedIn;
}

function clearSession() {
    tiktokSessionStore.clear();
    delete process.env.TIKTOK_SESSIONID;
    // Also wipe the partition so the user is logged out of the inline browser.
    try {
        const part = session.fromPartition('persist:tiktok-signin');
        part.clearStorageData({ storages: ['cookies', 'localstorage', 'serviceworkers'] });
    } catch (err) {
        console.warn('[tiktok-signin] clearStorageData failed:', err.message);
    }
}

// Load saved sessionId on app boot and inject into env so the bridge spawn
// inherits it. Call this once, after tiktokSessionStore.init(userDataDir).
async function hydrateEnv() {
    const saved = tiktokSessionStore.load();
    if (!saved || !saved.sessionId) return false;

    process.env.TIKTOK_SESSIONID = saved.sessionId;

    // If the saved record predates tt-target-idc tracking, try to recover the
    // cookie from the persist:tiktok-signin partition (electron keeps it on
    // disk after a previous login). This lets existing users skip a re-login.
    let ttTargetIdc = saved.ttTargetIdc;
    if (!ttTargetIdc) {
        try {
            const part = session.fromPartition('persist:tiktok-signin');
            const cookies = await part.cookies.get({
                domain: COOKIE_DOMAIN,
                name: 'tt-target-idc'
            });
            if (cookies && cookies[0] && cookies[0].value) {
                ttTargetIdc = cookies[0].value;
                // Persist for next launch so we don't repeat the lookup.
                try { tiktokSessionStore.save(saved.sessionId, saved.username, ttTargetIdc); }
                catch { /* best effort */ }
            }
        } catch (err) {
            console.warn('[tiktok-signin] tt-target-idc recovery failed:', err.message);
        }
    }

    if (ttTargetIdc) process.env.TIKTOK_TT_TARGET_IDC = ttTargetIdc;
    console.log('[tiktok-signin] Restored sessionid from store (saved ' + saved.savedAt
        + ', tt-target-idc=' + (ttTargetIdc ? 'recovered/present' : 'MISSING - re-login needed') + ')');
    return true;
}

module.exports = { openSignIn, isSignedIn, clearSession, hydrateEnv };
