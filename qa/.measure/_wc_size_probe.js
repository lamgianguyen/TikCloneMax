window.navigation.pageChange('obsoverlays');
await new Promise(r=>setTimeout(r,6000));
const out={};
const sec=document.querySelector('.worldCupEventSection');
const cards=document.querySelector('.worldCupEventCards');
function info(el){ if(!el) return null; const cs=getComputedStyle(el); const r=el.getBoundingClientRect();
  return {w:Math.round(r.width),h:Math.round(r.height),display:cs.display,flexDir:cs.flexDirection,flexWrap:cs.flexWrap,
    flex:cs.flex,flexBasis:cs.flexBasis,minWidth:cs.minWidth,maxWidth:cs.maxWidth,width:cs.width}; }
out.section=info(sec);
out.cardsRow=info(cards);
out.cards=[];
if(cards){ for(const c of cards.children){ const cs=getComputedStyle(c); const r=c.getBoundingClientRect();
  out.cards.push({cls:c.className,w:Math.round(r.width),h:Math.round(r.height),left:Math.round(r.left),
    flex:cs.flex,flexBasis:cs.flexBasis,minWidth:cs.minWidth,width:cs.width,display:cs.display,flexDir:cs.flexDirection}); } }
// container
const cont=document.querySelector('.page[data-pageid=obsoverlays] .obsOverlayContainer')||document.querySelector('.obsOverlayContainer');
out.container=info(cont);
return out;