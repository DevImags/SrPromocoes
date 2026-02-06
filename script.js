/* ======================================================
   MENU MOBILE (existente)
====================================================== */
function toggleMenu() {
  const nav = document.querySelector(".header nav ul");
  if (nav) nav.classList.toggle("show");
}

/* ======================================================
   CARD CMS / ADMIN
====================================================== */

const CARD_KEY = "offers_admin_v1";

/* ===== LÊ OS CARDS DO HTML (1ª VEZ) ===== */
function readCardsFromDOM() {
  return [...document.querySelectorAll(".offer-card")].map(card => ({
    id: crypto.randomUUID(),
    badge: card.querySelector(".aff-badge")?.textContent || "",
    title: card.querySelector(".aff-product-title")?.textContent || "",
    oldPrice: card.querySelector(".aff-price-old")?.textContent || "",
    price: card.querySelector(".aff-price-now")?.textContent || "",
    link: card.querySelector(".aff-product-btn")?.getAttribute("href") || "#"
  }));
}

function initCards() {
  if (!localStorage.getItem(CARD_KEY)) {
    localStorage.setItem(CARD_KEY, JSON.stringify(readCardsFromDOM()));
  }
}

function renderCards() {
  const grid = document.querySelector(".aff-products-grid");
  if (!grid) return;

  const cards = JSON.parse(localStorage.getItem(CARD_KEY)) || [];
  grid.innerHTML = "";

  cards.forEach(c => {
    grid.insertAdjacentHTML("beforeend", `
      <article class="offer-card aff-product-card" data-id="${c.id}">
        <div class="aff-product-media">
          ${c.badge ? `<span class="aff-badge">${c.badge}</span>` : ""}
        </div>
        <h3 class="aff-product-title">${c.title}</h3>
        <div class="aff-product-prices">
          <span class="aff-price-old">${c.oldPrice}</span>
          <span class="aff-price-now">${c.price}</span>
        </div>
        <a class="aff-btn aff-btn-primary aff-product-btn" href="${c.link}" target="_blank">
          Ver oferta
        </a>
      </article>
    `);
  });
}

/* ======================================================
   ADMIN MODAL (ÚNICO)
====================================================== */

const overlay = document.createElement("div");
overlay.className = "admin-overlay";
overlay.style.display = "none";

overlay.innerHTML = `
  <div class="admin-modal">
    <h2>Painel Admin</h2>

    <input id="a-badge" placeholder="Badge (-40%)">
    <input id="a-title" placeholder="Título">
    <input id="a-old" placeholder="Preço antigo">
    <input id="a-price" placeholder="Preço atual">
    <input id="a-link" placeholder="Link">

    <div class="admin-actions">
      <button id="add-card">Adicionar</button>
      <button id="export">Exportar</button>
      <label class="import-label">
        Importar
        <input type="file" id="import" accept=".json" hidden>
      </label>
    </div>
  </div>
`;

document.body.appendChild(overlay);

/* ===== FECHAR AO CLICAR FORA ===== */
overlay.addEventListener("click", e => {
  if (e.target === overlay) overlay.style.display = "none";
});

/* ===== ABRIR ADMIN ===== */
const profileBtn = document.querySelector(".profile-btn");
if (profileBtn) {
  profileBtn.addEventListener("click", () => {
    overlay.style.display = "flex";
  });
}

/* ATALHO SECRETO */
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
    overlay.style.display = "flex";
  }
});

/* ===== REFERÊNCIAS DOS INPUTS ===== */
const badgeInput = overlay.querySelector("#a-badge");
const titleInput = overlay.querySelector("#a-title");
const oldInput   = overlay.querySelector("#a-old");
const priceInput = overlay.querySelector("#a-price");
const linkInput  = overlay.querySelector("#a-link");

/* ===== ADICIONAR CARD ===== */
overlay.querySelector("#add-card").onclick = () => {
  const cards = JSON.parse(localStorage.getItem(CARD_KEY)) || [];

  cards.push({
    id: crypto.randomUUID(),
    badge: badgeInput.value,
    title: titleInput.value,
    oldPrice: oldInput.value,
    price: priceInput.value,
    link: linkInput.value
  });

  localStorage.setItem(CARD_KEY, JSON.stringify(cards));
  renderCards();

  badgeInput.value = "";
  titleInput.value = "";
  oldInput.value = "";
  priceInput.value = "";
  linkInput.value = "";
};

/* ===== EXPORTAR ===== */
overlay.querySelector("#export").onclick = () => {
  const data = localStorage.getItem(CARD_KEY);
  const blob = new Blob([data], { type: "application/json" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "offers.json";
  a.click();
};

/* ===== IMPORTAR ===== */
overlay.querySelector("#import").onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    localStorage.setItem(CARD_KEY, ev.target.result);
    renderCards();
  };
  reader.readAsText(file);
};

/* ======================================================
   INIT
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initCards();
  renderCards();
});
