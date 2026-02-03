/* =========================================================
   1) FUNÇÃO EXISTENTE (MANTIDA) - NÃO RENOMEAR / NÃO MUDAR ONCLICK
   ========================================================= */
function toggleMenu() {
  const nav = document.querySelector(".header nav ul");
  nav.classList.toggle("show");
}

/* =========================================================
   2) CARROSSEL SIMPLES DO HERO (sem libs, sem quebrar o resto)
   - 3 slides
   - auto a cada 5s
   - setas e dots
   ========================================================= */
(function () {
  const slides = [
    {
      kicker: "Destaque do dia",
      title: "Mega Liquidação",
      subtitle: "Até <strong>60% OFF</strong> em eletrônicos e casa, por tempo limitado",
      ctaText: "Conferir ofertas",
      ctaHref: "#Precos",
    },
    {
      kicker: "Cupons e cashback",
      title: "Cupom na veia",
      subtitle: "Junte cupons e descontos. Economia sem sofrimento (só humano sofre).",
      ctaText: "Ver cupons",
      ctaHref: "#Cupons",
    },
    {
      kicker: "Top buscados",
      title: "Achadinhos do momento",
      subtitle: "Smartphones, notebooks e acessórios com preço bom e link afiliado.",
      ctaText: "Abrir + Buscados",
      ctaHref: "#Buscados",
    },
  ];

  const elKicker = document.getElementById("affHeroKicker");
  const elTitle = document.getElementById("affHeroTitle");
  const elSubtitle = document.getElementById("affHeroSubtitle");
  const elCta = document.getElementById("affHeroCta");

  const btnPrev = document.querySelector(".aff-hero-prev");
  const btnNext = document.querySelector(".aff-hero-next");
  const dots = Array.from(document.querySelectorAll(".aff-dot"));

  if (!elKicker || !elTitle || !elSubtitle || !elCta || dots.length === 0) {
    // Se alguém remover o hero, a gente simplesmente não quebra a página.
    return;
  }

  let index = 0;
  let timer = null;

  function setActiveDot(i) {
    dots.forEach((d, idx) => {
      if (idx === i) d.classList.add("is-active");
      else d.classList.remove("is-active");
    });
  }

  function render(i) {
    const s = slides[i];
    elKicker.textContent = s.kicker;
    elTitle.textContent = s.title;
    elSubtitle.innerHTML = s.subtitle;
    elCta.textContent = s.ctaText;
    elCta.setAttribute("href", s.ctaHref);
    setActiveDot(i);
  }

  function next() {
    index = (index + 1) % slides.length;
    render(index);
  }

  function prev() {
    index = (index - 1 + slides.length) % slides.length;
    render(index);
  }

  function start() {
    stop();
    timer = setInterval(next, 5000);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Eventos
  if (btnNext) btnNext.addEventListener("click", () => { next(); start(); });
  if (btnPrev) btnPrev.addEventListener("click", () => { prev(); start(); });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const i = Number(dot.getAttribute("data-slide"));
      if (!Number.isNaN(i)) {
        index = i;
        render(index);
        start();
      }
    });
  });

  // Pausa ao passar o mouse (desktop)
  const hero = document.querySelector(".aff-hero-inner");
  if (hero) {
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
  }

  // Boa prática: se a pessoa redimensionar para desktop, fecha o menu mobile aberto
  window.addEventListener("resize", () => {
    const nav = document.querySelector(".header nav ul");
    if (!nav) return;
    if (window.innerWidth > 768 && nav.classList.contains("show")) {
      nav.classList.remove("show");
    }
  });

  // Inicializa
  render(index);
  start();
})();