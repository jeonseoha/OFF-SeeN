(() => {
  const archive = document.querySelector('#archive-view');
  const detail = document.querySelector('#person-view');
  if (!archive || !detail) return;

  const openProfile = () => {
    archive.hidden = true;
    detail.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('#person-name')?.focus({ preventScroll: true });
    history.replaceState(null, '', '#profile');
  };

  const closeProfile = () => {
    detail.hidden = true;
    archive.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', location.pathname);
    document.querySelector('.archive-card')?.focus({ preventScroll: true });
  };

  document.querySelectorAll('.archive-card').forEach((card) => card.addEventListener('click', openProfile));
  document.querySelector('.back-to-archive')?.addEventListener('click', closeProfile);
})();
