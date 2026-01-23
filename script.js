// Busca dinâmica
const search = document.getElementById('search');
const cards = document.querySelectorAll('.card');

search.addEventListener('input', () => {
  const q = search.value.toLowerCase();
  cards.forEach(card => {
    const title = card.dataset.title.toLowerCase();
    const category = card.dataset.category.toLowerCase();
    const campaign = card.dataset.campaign.toLowerCase();
    const match = title.includes(q) || category.includes(q) || campaign.includes(q);
    card.style.display = match ? '' : 'none';
  });
});

// Alternar tema claro/escuro
const toggle = document.getElementById('toggleTheme');
toggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
});
