(function (global) {
  const HOST_ID = "tf-splash-host";
  const HIDDEN_CLASS = "tf-splash-hidden";

  function ensureDOM() {
    let host = document.getElementById(HOST_ID);
    if (host) return host;

    host = document.createElement("div");
    host.id = HOST_ID;
    host.className = HIDDEN_CLASS;
    host.setAttribute("aria-hidden", "true");
    host.style.all = "initial";

    const root = host.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      :host { all: initial; }
      .backdrop {
        position: fixed; inset: 0;
        display: flex; justify-content: center; align-items: center;
        background: rgba(33,33,33,1);
        z-index: 2147483647; /* max-voorgrond */
      }
      .inner {
        width: 689px; height: 376px; padding: 30px; box-sizing: border-box; text-align: center;
        background: rgba(33,33,33,1);
        background-image: repeating-linear-gradient(
          135deg,
          rgba(255,255,255,0.04) 0 1px,
          transparent 1px 10px
        );
        border-radius: 12px;
      }
      .img { width: 169px; height: 174px; aspect-ratio: 169 / 174; object-fit: contain; }
      .heading {
        color:#FD0053; margin: 8px 0; font: 700 17px/20px "Exo 2", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      }
      .paragraph {
        color:#FFF; margin: 0;
        padding-left: 80px;
        padding-right: 80px;
        font: 400 14px/24px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      }
      .paragraph strong { font-weight: 700; }
      /* host hidden */
      :host(.${HIDDEN_CLASS}) .backdrop { display: none; }
    `;

    const container = document.createElement("div");
    container.className = "backdrop";
    container.innerHTML = `
      <div class="inner" role="dialog" aria-modal="true">
        <img class="img" alt="Splash"/>
        <h3 class="heading"></h3>
        <p class="paragraph"></p>
      </div>
    `;

    root.append(style, container);
    document.body.appendChild(host);
    return host;
  }

  function setContent({ img, heading, html }) {
    const host = ensureDOM();
    const $ = (sel) => host.shadowRoot.querySelector(sel);
    if (img) $(".img").src = img;
    if (heading != null) $(".heading").textContent = heading;
    if (html != null) $(".paragraph").innerHTML = html;
  }

  function show(opts = {}) {
    const host = ensureDOM();
    setContent(opts);
    host.classList.remove(HIDDEN_CLASS);
    host.setAttribute("aria-hidden", "false");
  }

  function hide() {
    const host = ensureDOM();
    host.classList.add(HIDDEN_CLASS);
    host.setAttribute("aria-hidden", "true");
  }

  function destroy() {
    const host = document.getElementById(HOST_ID);
    if (host && host.parentNode) host.parentNode.removeChild(host);
  }

  global.TFSplash = { show, hide, setContent, ensureDOM, destroy };
})(window);