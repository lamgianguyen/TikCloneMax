// Local adapter: bridge our Socket.IO to the format TikFinity widgets expect
// The original socketioclient.js creates a Socket.IO connection and overrides window.io
// We do the same but connect to our local server

var channelId = 0;
var screenId = 1;
var settings = {};
var widgetId = document.location.pathname.split("/").filter(Boolean).pop().replace('.html', '');

// Default settings for widgets
settings = {
  isPro: true,
  // CoinJar defaults
  coinjar_xOffset: 0,
  coinjar_yOffset: 0,
  coinjar_scale: 1,
  coinjar_giftScale: 1,
  coinjar_numberOfRanks: "top3",
  coinjar_leaderboardDisplayFormat: "avatarNameCoins",
  coinjar_displayRankBadges: true,
  coinjar_displayLeaderboard: true,
  coinjar_showTotalCoins: true,
  coinjar_displayAlert: true,
  coinjar_leaderboardDuration: 10,
  coinjar_alertDuration: 5,
  // CoinMatch defaults
  coinmatch_showTitle: true,
  coinmatch_title: "Coin Match",
  coinmatch_showParticipantsCount: true,
  coinmatch_showWinners: "keepShowing",
  coinmatch_hideAfter: 10,
  coinmatch_shouldAutoScroll: true,
  coinmatch_enableSnipeMode: false,
  coinmatch_enableSlowCountdown: false,
  coinmatch_randomizedSlowCountdown: false,
  coinmatch_countdown: 60,
  coinmatch_countdownStartDelay: 3,
  coinmatch_fontColor: "#ffffff",
  coinmatch_backgroundColor: "#1a1a2e",
  coinmatch_timerBackgroundColor: "#e94560",
  coinmatch_fontType: "Exo 2",
  coinmatch_fontSize: 50,
  coinmatch_fontLineSpacing: 50,
  coinmatch_fontLetterSpacing: 50,
};

// Create the Socket.IO connection (overrides the global `io` factory with an active connection)
window.io = io();

function reportState() {}
function setFontSettings() {}
function logUsage() {}
function getUserThumbnailUrlFromUserId(userId) {
  return "";
}
