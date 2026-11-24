(() => {
  const archive = document.querySelector('#opportunity-archive');
  const detail = document.querySelector('#company-detail-view');
  if (!archive || !detail) return;

  let selectedCard = null;
  const openDetail = (event) => {
    selectedCard = event.currentTarget;
    archive.hidden = true;
    detail.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    detail.querySelector('#company-name')?.focus({ preventScroll: true });
  };
  const closeDetail = () => {
    detail.hidden = true;
    archive.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    (selectedCard || archive.querySelector('.company-card'))?.focus({ preventScroll: true });
  };

  archive.querySelectorAll('.company-card').forEach((card) => card.addEventListener('click', openDetail));
  detail.querySelector('.back-to-companies')?.addEventListener('click', closeDetail);
})();
