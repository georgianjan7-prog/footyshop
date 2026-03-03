// novinky.js – logika rozbalovacího panelu „Katalog“
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('catalog-toggle');
  const panel  = document.getElementById('catalog-panel');
  if (!toggle || !panel) return;

  const closePanel = () => {
    panel.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
  };

  closePanel();

  toggle.addEventListener('click', () => {
    const isHidden = panel.hasAttribute('hidden');
    if (isHidden) {
      panel.removeAttribute('hidden');
      toggle.setAttribute('aria-expanded', 'true');
    } else {
      closePanel();
    }
  });

  document.addEventListener('click', (e) => {
    const clickedToggle = e.target.closest('#catalog-toggle');
    const clickedPanel  = e.target.closest('#catalog-panel');
    if (!clickedToggle && !clickedPanel && !panel.hasAttribute('hidden')) closePanel();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hasAttribute('hidden')) closePanel();
  });
});