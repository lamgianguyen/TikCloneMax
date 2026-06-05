# Widget Mechanisms — render entry + data source (per overlay)

> Map cơ chế từng widget (team audit 2026-06-05). Đọc TRƯỚC khi RE/fix 1 widget — biết ngay render-entry + nguồn data (socket event nào / ajax) thay vì grep lại từ đầu. Reference từ CLAUDE.md §35-MECH.

### physics-interactive

**cannon.html**: Renders spinning cannon with flying emojis triggered via socket io.on("cannonfireemoji") handler; data: socket events + ajax fetch to /api/usage/log.

**coinjar.html**: Vue.js component (window.createCoinJar) mounted on window load; triggered via io.on("coin-jar:gift") and io.on("coin-jar:reset") socket events; entry point: window.addEventListener("load").

**coinmatch.html**: Vue.js component (window.createCoinMatch) mounted on window load; triggered via io.on("coin-match:start/update/result/reset") socket events; entry point: window.addEventListener("load").

**wheel.html**: WinWheel-based spinning wheel with canvas + external library; triggered via socket connection; renders coins/particles during spin animation; data: socket events + fetch to /api/usage/log.

**wheelofactions.html**: Vue.js component (window.mountWheelOfActions) mounted conditionally on load; triggered via io.on("onSpinWheel") socket event; entry point: window.addEventListener("load") with guard check.


### gift-leaderboard

gifts: Renders gift event DOM clones per socket "gift" event into #chatContainer. Entry: io.on("gift") handler, data via socket.io events (real-time). Flat file uses unguarded .first().clone() in event handler.

ranking: Renders user ranking table per socket "updateRanking" event, fetches /api/rest/channeluser via $.get(). Entry: io.on("updateRanking"), $.get() success → updateRanking(). Uses template lazy-init guard as of latest build (lines 1009-1011).

topgifter: Renders top gifter rank table, socket "updateTopGifter" → updateRanking(userList). Entry: io.on("updateTopGifter"), data from socket. Template init at load (line 1071).

topliker: Renders top liker rank table, similar pattern to topgifter. Entry: socket event listener, renders DOM clones. Template init at load (line 1199).

topg: Renders top gifter streak widget. Entry: socket event "updateTopStreaker", DOM clones per event. Template initialized in $(window).load (no guard).

tops: Renders top supporters/streamers ranking. Entry: similar pattern to topgifter/topliker. Template init at load (line 887).


### counters-goals
**lastx**: Renders last X user (profile pic + username) via socket event 'setLastX'; data source is io.on('setLastX') listener at line 190; entry point renders via showLastUser() function with fade animation.

**gcounter**: Renders gift counter with goal progress via socket event 'giftGoalStatus'; data source is io.on('giftGoalStatus') listener at line 380; async loop at line 324 animates counter value every 100ms.

**viewercount**: Renders TikTok viewer count via socket event 'updateViewerCount'; data source is io.on('updateViewerCount') listener at line 39; simple DOM display toggle, single element '#viewercount'.

**transactionviewer**: Renders floating transaction notifications via socket event 'newTransaction'; data source is io.on('newTransaction') listener at line 142; clones template and animates upward with fade, auto-removes after 10s.

**goal**: (obfuscated flat HTML file goal.html) - Presumed goal progress widget; uses embedded obfuscated JS; no readable entry point without deobfuscation.

### fx-overlays
coindrop: Renders coin animations via vanilla JS on event socket 'collectCoin'. Data flows socket -> event handler -> DOM element creation. Init: loads settings from localStorage, fetches socket connection. Render entry: socket 'collectCoin' event listener at ~line 400. firework: Renders rocket/explosion particles via CSS animations + vanilla JS elements. Data flows socket 'gift' event -> animation handler. Init: socket connection, settings from localStorage. Render entry: socket event listeners for 'gift'/'gift-bundle', creates/appends rocket div. fallingsnow: Renders falling snow particles via CSS animation. Data flows: initialization tick -> particle generation. Init: loads settings from localStorage. Render entry: requestAnimationFrame loop or setInterval for particle spawning. emojify: Renders floating emoji reactions via DOM element creation. Data flows socket 'emote'/'emotepack' event -> DOM append. Init: socket init, localStorage settings. Render entry: socket event listener callbacks. likefountain: Renders floating like heart particles. Data flows socket event -> particle creation. Init: socket + localStorage. Render entry: socket event handlers create/append elements to DOM.

### actions-info
myactions: Renders action queue via ActionItem instances; data arrives via executeAction socket.io event; entry point is processQueue() setInterval loop.

commandinfo: Renders command info/rankings; data via socket.io events and AJAX; entry point unknown (obfuscated).

userinfo: Renders user profile info; data via AJAX/socket.io; entry point unknown (obfuscated).

songrequests: Renders song queue; data via AJAX/socket.io; entry point unknown (obfuscated).

streambuddies: Redirects to /widget/streambuddies/?cid=... ; appears to be dynamic routing, not a direct overlay file.

### feed-rotator
chat: Renders incoming socket "chat" messages via jQuery DOM manipulation into #chatContainer. Data arrives via socket.io on-load via socketioclient.js. Entry: $(window).on("load") at line 227/193.

activity-feed: Wrapper loads nested Vite SPA via iframe (./vite/src/activity-feed/). Uses postMessage for config passing between parent and iframe. Entry: iframe.contentWindow.postMessage() on load at line 38/44.

carousel (eventcarousel.html/index.html): WebSocket listens at ws://localhost:21213/ for "config" events, renders gift cards to #carousel div with infinite scroll via requestAnimationFrame. Entry: connect() called on DOMContentLoaded at line 23.

eventcarousel.html (wrapper): Embeds eventcarousel/index.html iframe, posts preview config via postMessage. Entry: updateSettings() and preview() called globally.

socialmediarotator: Vue module mounts to #app. Loads /vue/dist/widgets/social-media-rotator/social-media-rotator.js as ES module. Entry: window.mountSocialMediaRotator("#app") on load at line 26.

### misc-shared
**timer**: Renders countdown timer via setInterval(()=> {...}, 100ms) updating #countdown text. Subscribes via io.on('timerUpdate') for state changes from socket.io. Loads settings from localStorage and updates via widgetSettings socket event.

**christmasevent**: Mounts Vue component via window.mountChristmasEventWidget('#app'). Subscribes to io.on('christmas-event:gift/update/state') for gift/state/update events from socket.io. Preview mode injects fake data via setTimeout() window.handleGift() calls instead of socket events.

**mediawrapper.js**: ActionItem class manages action animations (images/videos/audio/text). Loads external media URLs (imageUrl/videoUrl/audioUrl/animationUrl) as HTML elements on construction. Plays/fades out via CSS classes and setInterval fadeout loops. Accessed by myactions widget.

**socketioclient.js**: Initializes SharedIO or native socket.io connection. Loads settings from localStorage ('cachedSettings') on page load, then subscribes to widgetSettings socket events to update. Dynamically loads Google Fonts CSS on font setting changes. Entry point: executed on every widget load before widget-specific code runs.
