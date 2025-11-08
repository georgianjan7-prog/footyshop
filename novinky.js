// Toggle rozbalovacího panelu „Katalog“
const toggle = document.getElementById('catalog-toggle');
const panel  = document.getElementById('catalog-panel');

// klik na „Katalog“: otevři/zavři panel a udržuj ARIA stav
toggle.addEventListener('click', () => {
  const isHidden = panel.hasAttribute('hidden');
  if (isHidden) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
  toggle.setAttribute('aria-expanded', String(isHidden));
});

// klik mimo panel ho zavře (příjemnější používání)
document.addEventListener('click', (e) => {
  const clickedToggle = e.target.closest('#catalog-toggle');
  const clickedPanel  = e.target.closest('#catalog-panel');
  if (!clickedToggle && !clickedPanel && !panel.hasAttribute('hidden')) {
    panel.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// klávesa Escape: zavřít panel
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !panel.hasAttribute('hidden')) {
    panel.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

function bindHeaderLogic() {
  const toggle = document.getElementById('catalog-toggle');
  const panel  = document.getElementById('catalog-panel');

  if (!toggle || !panel) return;

  // 1) Při každém načtení stránky panel jistě zavřeme
  panel.setAttribute('hidden', '');
  toggle.setAttribute('aria-expanded', 'false');

  // 2) Otevírání/zavírání tlačítkem
  toggle.addEventListener('click', () => {
    const open = !panel.hasAttribute('hidden');
    if (open) {
      panel.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      panel.removeAttribute('hidden');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });

  // 3) Když klikneš na logo nebo některý odkaz v menu, panel zavřeme
  const closePanel = () => {
    panel.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
  };

  document.querySelector('.brand')?.addEventListener('click', closePanel);
  document.querySelectorAll('.top-nav a').forEach(a =>
    a.addEventListener('click', closePanel)
  );

  // 4) (volitelné) schovej panel při scrollu
  window.addEventListener('scroll', () => {
    if (!panel.hasAttribute('hidden')) closePanel();
  });
}

// pokud používáš include.js:
window.addEventListener('includes:loaded', bindHeaderLogic);
// pokud ne, použij tohle:
// document.addEventListener('DOMContentLoaded', bindHeaderLogic);