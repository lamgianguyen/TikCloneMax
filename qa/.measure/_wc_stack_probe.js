// Navigate to obsoverlays, wait, measure World Cup section + cards layout.
try { window.navigation && window.navigation.pageChange && window.navigation.pageChange('obsoverlays'); } catch(e){}
await new Promise(r => setTimeout(r, 4000));

function box(el){ if(!el) return null; const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right) }; }
function cs(el, props){ if(!el) return null; const s = getComputedStyle(el); const o = {}; props.forEach(p => o[p] = s.getPropertyValue(p)); return o; }

const section = document.querySelector('.worldCupEventSection');
const cardsWrap = document.querySelector('.worldCupEventCards');
const cards = Array.from(document.querySelectorAll('.worldCupEventSection .obsOverlayOnPage'));
const firstNormal = document.querySelector('.obsOverlayContainer > .obsOverlayOnPage:not(.worldCupEventSection .obsOverlayOnPage)');

const cardBoxes = cards.map(box);
let sideBySide = null;
if (cardBoxes.length >= 2) {
  // same row if their y values are close AND second card x > first card right - tolerance
  sideBySide = Math.abs(cardBoxes[0].y - cardBoxes[1].y) < 40 && cardBoxes[1].x > cardBoxes[0].right - 60;
}

return {
  viewport: { w: window.innerWidth, h: window.innerHeight },
  section: box(section),
  cardsWrap: box(cardsWrap),
  cardCount: cards.length,
  cardBoxes,
  sideBySide,
  card0_computed: cs(cards[0], ['flex-grow','flex-shrink','flex-basis','min-width','width','max-width']),
  card0_classes: cards[0] ? cards[0].className : null,
  normalCard: box(firstNormal),
};
