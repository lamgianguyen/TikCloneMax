import"./modulepreload-polyfill-B5Qt9EMX.js";const i={showChat:!0,showGifts:!0,showFollows:!0,showShares:!0,showSubscribes:!0,showJoins:!1,showEnvelopes:!0};let o={...i};const S=()=>{const e=new URLSearchParams(window.location.search);return parseInt(e.get("dockId")||"1")},E=()=>{const e=S(),s=localStorage.getItem(`activityFeedSettings_${e}`);return s?JSON.parse(s):(e===1?(i.showChat=!0,i.showGifts=!1,i.showFollows=!0,i.showShares=!0,i.showSubscribes=!1,i.showEnvelopes=!1):e===2&&(i.showChat=!1,i.showGifts=!0,i.showFollows=!1,i.showShares=!1,i.showSubscribes=!0,i.showEnvelopes=!0),i)},I=e=>{const s=S();localStorage.setItem(`activityFeedSettings_${s}`,JSON.stringify(e))},b=e=>{o={...o,...e}},C=()=>{const e=document.getElementById("settingsButton"),s=document.getElementById("settingsPanel"),t=document.getElementById("saveSettings"),n=document.getElementById("showChat"),l=document.getElementById("showGifts"),r=document.getElementById("showFollows"),g=document.getElementById("showShares"),m=document.getElementById("showSubscribes"),v=document.getElementById("showJoins"),_=document.getElementById("showEnvelopes");o={...o,...E()},n.checked=o.showChat,l.checked=o.showGifts,r.checked=o.showFollows,g.checked=o.showShares,m.checked=o.showSubscribes,v.checked=o.showJoins,_.checked=o.showEnvelopes,b(o),e==null||e.addEventListener("click",a=>{a.stopPropagation(),s==null||s.classList.toggle("settings-panel--hidden")}),document.addEventListener("click",a=>{!(s!=null&&s.contains(a.target))&&a.target!==e&&(s==null||s.classList.add("settings-panel--hidden"))}),t==null||t.addEventListener("click",()=>{const a={showChat:n.checked,showGifts:l.checked,showFollows:r.checked,showShares:g.checked,showSubscribes:m.checked,showJoins:v.checked,showEnvelopes:_.checked};I(a),b(a),s==null||s.classList.add("settings-panel--hidden");const $=document.querySelectorAll(".message");for(let k of $){const c=k,d=c.getAttribute("data-type");d==="chat"&&!a.showChat||d==="gift"&&!a.showGifts||d==="follow"&&!a.showFollows||d==="share"&&!a.showShares||d==="subscribe"&&!a.showSubscribes||d==="envelope"&&!a.showEnvelopes||d==="join"&&!a.showJoins?c.style.display="none":c.style.display="flex"}})};document.addEventListener("DOMContentLoaded",C);const w=200,u=()=>{const e=document.querySelector(".activity-feed__content");if(!e)return;const s=e.querySelectorAll(".message");if(s.length>w)for(let t=w;t<s.length;t++)s[t-w].remove()},f=e=>e.filter(s=>s.type==="image").map(s=>` <img class="message__user-badge" src="${s.url}" alt="${s.type}">`).join(""),F=(e="",s)=>{if(e=e.replace(/<[^>]+>/g,"").trim(),!s||s.length===0)return e;let t=[...e];for(const n of s){const l=`<img class="message__emote" src="${n.emoteImageUrl}" alt="Emote ${n.emoteId}">`,r=n.placeInComment;r<t.length?t.splice(r,0,l):t.push(l)}return t.join("")},M=e=>{const s=document.querySelector(".activity-feed__content");if(!s)return;const t=document.createElement("div");t.className="message message--chat",t.setAttribute("data-type","chat"),t.innerHTML=`
    <img class="message__pfp" src="${e.profilePictureUrl}" alt="${e.uniqueId}">
    <div class="message__text" title="${new Date(parseInt(e.createTime)).toISOString()}">
        <a href="https://tiktok.com/@${e.uniqueId}" target="_blank" class="message__sender">${e.nickname} ${f(e.userBadges)} </a>
        <span>${F(e.comment,e.emotes)}</span>
    </div>
  `,s.append(t),p(t),u()},q=e=>{const s=document.querySelector(".activity-feed__content");if(!s)return;const t=`${e.groupId}-${e.giftId}-${e.userId}`,n=document.createElement("div");n.className="message message--gift",n.setAttribute("data-type","gift");const l=e.giftType===1&&!e.repeatEnd,r=e.diamondCount*(e.repeatCount||1),g=r>1?" Coins":" Coin";l&&n.setAttribute("data-streakid",t),n.innerHTML=`
    <img class="message__pfp" src="${e.profilePictureUrl}" alt="${e.uniqueId}">
    <div class="message__gift-content">
      <a href="#" class="message__sender">${e.nickname} ${f(e.userBadges)} </a>
      <div class="message__gift-info">
        <img class="gift-icon" src="${e.giftPictureUrl}" alt="${e.giftName}">
        <div class="gift-details">
          <div>
            <span class="gift-name">${e.giftName} <span class="gift-id">(ID:${e.giftId})</span></span>
            <span class="gift-streak ${l?"gift-streak--active":""}">${e.repeatCount>1?`x${e.repeatCount}`:""}</span>
          </div>
          <div class="gift-cost">${r.toLocaleString()} ${g}</div>
        </div>
      </div>
    </div>
  `;const m=s.querySelector(`[data-streakid='${t}']`);m?m.replaceWith(n):s.append(n),p(n),u()},x=e=>{const s=document.querySelector(".activity-feed__content");if(!s)return;const t=document.createElement("div");t.className="message message--follow",t.setAttribute("data-type","follow"),t.innerHTML=`
    <img class="message__pfp" src="${e.profilePictureUrl}" alt="${e.uniqueId}">
    <div class="message__follow-content">
      <a href="#" class="message__sender">${e.nickname} ${f(e.userBadges)} </a>
      <span class="follow-text"> <i class="fa-solid fa-user-plus"></i> Started following!</span>
    </div>
  `,s.append(t),p(t),u()},L=e=>{const s=document.querySelector(".activity-feed__content");if(!s)return;const t=document.createElement("div");t.className="message message--share",t.setAttribute("data-type","share"),t.innerHTML=`
    <img class="message__pfp" src="${e.profilePictureUrl}" alt="${e.uniqueId}">
    <div class="message__share-content">
      <a href="#" class="message__sender">${e.nickname} ${f(e.userBadges)} </a>
      <span class="share-text"> <i class="fa-solid fa-share"></i> Shared the stream!</span>
    </div>
  `,s.append(t),p(t),u()},B=e=>{const s=document.querySelector(".activity-feed__content");if(!s)return;const t=document.createElement("div");t.className="message message--subscribe",t.setAttribute("data-type","subscribe"),t.innerHTML=`
    <img class="message__pfp" src="${e.profilePictureUrl}" alt="${e.uniqueId}">
    <div class="message__subscribe-content">
      <a href="#" class="message__sender">${e.nickname} ${f(e.userBadges)} </a>
      <span class="subscribe-text"><i class="fa-solid fa-subscribe"></i> <i class="fas fa-star"></i> Subscribed!</span>
    </div>
  `,s.append(t),p(t),u()},A=e=>{const s=document.querySelector(".activity-feed__content");if(!s)return;const t=document.createElement("div");t.className="message message--join",t.setAttribute("data-type","join"),t.innerHTML=`
    <img class="message__pfp" src="${e.profilePictureUrl}" alt="${e.uniqueId}">
    <div class="message__join-content">
      <a href="#" class="message__sender">${e.nickname} ${f(e.userBadges)} </a>
      <span class="join-text"><i class="fa-solid fa-right-to-bracket"></i> Joined!</span>
    </div>
  `,s.append(t),p(t),u()},G=e=>{const s=document.querySelector(".activity-feed__content");if(!s)return;const t=document.createElement("div");t.className="message message--envelope",t.setAttribute("data-type","envelope"),t.innerHTML=`
    <img class="message__pfp" src="${e.profilePictureUrl}" alt="${e.uniqueId}">
    <div class="message__envelope-content">
      <a href="#" class="message__sender">${e.nickname} ${f(e.userBadges)} </a>
      <span class="envelope-text"><i class="fa-solid fa-box-open"></i> Sent a treasure chest with ${e.coins} coins for ${e.canOpen} people</span>
    </div>
  `,s.append(t),p(t),u()},p=e=>{const s=e.getAttribute("data-type");(s==="chat"&&!o.showChat||s==="gift"&&!o.showGifts||s==="follow"&&!o.showFollows||s==="share"&&!o.showShares||s==="subscribe"&&!o.showSubscribes)&&(e.style.display="none"),e.scrollIntoView({behavior:"smooth"})};let h=null;function y(){h||(h=new WebSocket("ws://localhost:21213/"),h.onclose=()=>{h=null,setTimeout(y,1e3)},h.onerror=()=>{h=null,setTimeout(y,1e3)},h.onmessage=e=>{const s=JSON.parse(e.data),t=s.event,n=s.data;window.postMessage({type:t,payload:n})})}window.addEventListener("message",e=>{if(!e.data||typeof e.data!="object")return;const{type:s,payload:t}=e.data;s==="chat"&&o.showChat?M(t):s==="gift"&&o.showGifts?q(t):s==="follow"&&o.showFollows?x(t):s==="share"&&o.showShares?L(t):s==="subscribe"&&o.showSubscribes?B(t):s==="member"&&o.showJoins?A(t):s==="envelope"&&o.showEnvelopes&&G(t)});location.href.includes("localhost")&&!location.href.includes("cid=")&&y();
