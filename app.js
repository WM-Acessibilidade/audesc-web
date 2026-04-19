const state = { repositories: [], selectedCategory: 'Todas', activeScreen: 'explorar' };

const els = {
  searchInput: document.getElementById('searchInput'),
  categoryChips: document.getElementById('categoryChips'),
  repoList: document.getElementById('repoList'),
  toast: document.getElementById('toast'),
  navBtns: Array.from(document.querySelectorAll('.nav-btn')),
  reloadBtn: document.getElementById('reloadBtn'),
  screens: {
    explorar: document.getElementById('screen-explorar'),
    live: document.getElementById('screen-live'),
    config: document.getElementById('screen-config')
  }
};

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove('hidden');
  setTimeout(() => els.toast.classList.add('hidden'), 2200);
}

function switchScreen(screen) {
  state.activeScreen = screen;
  Object.entries(els.screens).forEach(([key, node]) => {
    node.classList.toggle('active', key === screen);
  });
  els.navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.screen === screen));
}

function normalizeCatalogData(data) {
  const categories = Array.isArray(data.categories) ? data.categories : [];
  const repos = [];
  categories.forEach(category => {
    const categoryName = (category.name || '').trim();
    const repositories = Array.isArray(category.repositories) ? category.repositories : [];
    if (!categoryName || repositories.length === 0) return;
    repositories.forEach(repo => {
      const title = (repo.title || '').trim();
      const url = (repo.url || '').trim();
      if (!title || !url) return;
      repos.push({
        id: repo.id || (categoryName + '-' + title).toLowerCase().replace(/\s+/g, '-'),
        title,
        description: (repo.description || '').trim(),
        category: categoryName,
        url
      });
    });
  });
  return repos;
}

async function loadRepositories() {
  try {
    const response = await fetch('data/repositories.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Falha ao carregar catálogo');
    const data = await response.json();
    state.repositories = normalizeCatalogData(data);
    state.selectedCategory = 'Todas';
    renderCategoryChips();
    renderRepositories();
  } catch (error) {
    els.repoList.innerHTML = '<div class="item-card"><p>Não foi possível carregar o catálogo de repositórios.</p></div>';
    els.categoryChips.innerHTML = '';
  }
}

function getAvailableCategories() {
  const categories = [...new Set(state.repositories.map(item => item.category))];
  return ['Todas', ...categories];
}

function renderCategoryChips() {
  const categories = getAvailableCategories().filter(category => {
    if (category === 'Todas') return state.repositories.length > 0;
    return state.repositories.some(item => item.category === category);
  });

  els.categoryChips.innerHTML = '';
  if (!categories.length) {
    els.categoryChips.innerHTML = '<p class="hint">Nenhuma categoria disponível.</p>';
    return;
  }

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (state.selectedCategory === cat ? ' active' : '');
    btn.type = 'button';
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      state.selectedCategory = cat;
      renderCategoryChips();
      renderRepositories();
    });
    els.categoryChips.appendChild(btn);
  });
}

function renderRepositories() {
  const q = els.searchInput.value.trim().toLowerCase();
  const items = state.repositories.filter(item => {
    const categoryOk = state.selectedCategory === 'Todas' || item.category === state.selectedCategory;
    const haystack = `${item.title} ${item.description} ${item.category}`.toLowerCase();
    const searchOk = !q || haystack.includes(q);
    return categoryOk && searchOk;
  });

  els.repoList.innerHTML = '';
  if (!items.length) {
    els.repoList.innerHTML = '<div class="item-card"><p>Nenhum repositório encontrado.</p></div>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <h4>${escapeHtml(item.title)}</h4>
      <div class="item-meta">${escapeHtml(item.category)}</div>
      <p>${escapeHtml(item.description || 'Repositório de audiodescrição cadastrado no catálogo do Audesc.')}</p>
      <div class="actions">
        <button type="button">Abrir repositório</button>
      </div>
    `;
    card.querySelector('button').addEventListener('click', () => {
      window.open(item.url, '_blank');
    });
    els.repoList.appendChild(card);
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s]));
}

function bindEvents() {
  els.navBtns.forEach(btn => btn.addEventListener('click', () => switchScreen(btn.dataset.screen)));
  els.searchInput.addEventListener('input', renderRepositories);
  els.reloadBtn.addEventListener('click', async () => {
    await loadRepositories();
    showToast('Catálogo atualizado.');
  });
}

bindEvents();
loadRepositories();
