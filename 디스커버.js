(() => {
  const queryInput = document.querySelector('#discover-query');
  const clearButton = document.querySelector('.search-clear');
  const searchForm = document.querySelector('#discover-search-form');
  const sortSelect = document.querySelector('#discover-sort');
  const grid = document.querySelector('#profile-grid');
  const emptyState = document.querySelector('#empty-state');
  const count = document.querySelector('#result-count');
  const filters = [...document.querySelectorAll('.category-filter')];
  if (!queryInput || !grid || !emptyState) return;

  // The static portfolio ships with no member records. A future data adapter may
  // provide approved public records through this documented page contract.
  const profiles = Array.isArray(window.OFF_SEEN_APPROVED_PROFILES)
    ? window.OFF_SEEN_APPROVED_PROFILES.filter((profile) => profile?.approval_status === 'approved' && profile?.is_public !== false && !profile?.deleted_at)
    : [];
  let selectedCategory = 'all';

  const safeExternalImage = (value) => {
    try {
      const url = new URL(value, window.location.href);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  };

  const render = () => {
    const term = queryInput.value.trim().toLocaleLowerCase();
    const sort = sortSelect.value;
    const visible = profiles.filter((profile) => {
      const category = String(profile.category ?? '').toLocaleLowerCase();
      const categoryMatch = selectedCategory === 'all' || category === selectedCategory;
      const searchable = [profile.name, profile.profile_id, ...(profile.keywords ?? []), ...(profile.activity_fields ?? [])]
        .filter(Boolean).join(' ').toLocaleLowerCase();
      return categoryMatch && (!term || searchable.includes(term));
    });

    visible.sort((a, b) => {
      if (sort === 'name-asc') return String(a.name ?? '').localeCompare(String(b.name ?? ''), 'ko');
      if (sort === 'name-desc') return String(b.name ?? '').localeCompare(String(a.name ?? ''), 'ko');
      return new Date(b.published_at ?? b.created_at ?? 0) - new Date(a.published_at ?? a.created_at ?? 0);
    });

    grid.replaceChildren();
    visible.forEach((profile) => {
      if (!profile.name || !/^OFF_[0-9]{4}$/.test(profile.profile_id ?? '')) return;
      const card = document.createElement('a');
      card.className = 'profile-card';
      card.href = `프로필.html?profile_id=${encodeURIComponent(profile.profile_id)}`;
      const image = document.createElement('span');
      image.className = 'profile-card-image is-empty';
      const imageUrl = safeExternalImage(profile.profile_image);
      if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `${profile.name} 프로필 사진`;
        img.loading = 'lazy';
        image.classList.remove('is-empty');
        image.append(img);
      } else {
        const mark = document.createElement('i');
        mark.setAttribute('aria-hidden', 'true');
        image.append(mark);
      }
      const info = document.createElement('span');
      info.className = 'profile-card-info';
      const id = document.createElement('span');
      id.className = 'profile-card-number';
      id.textContent = profile.profile_id;
      const name = document.createElement('span');
      name.className = 'profile-card-name';
      name.textContent = profile.name;
      info.append(id, name);
      card.append(image, info);
      grid.append(card);
    });

    const hasCards = grid.childElementCount > 0;
    emptyState.hidden = hasCards;
    count.textContent = `${String(grid.childElementCount).padStart(2, '0')} PROFILES`;
    clearButton.hidden = queryInput.value.length === 0;
  };

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    render();
  });
  queryInput.addEventListener('input', render);
  clearButton.addEventListener('click', () => {
    queryInput.value = '';
    render();
    queryInput.focus();
  });
  sortSelect.addEventListener('change', render);
  filters.forEach((filter) => filter.addEventListener('click', () => {
    selectedCategory = filter.dataset.category;
    filters.forEach((item) => {
      const active = item === filter;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render();
  }));
  render();
})();
