// Toggle rozbalovacího panelu „Katalog“
const toggle = document.getElementById('catalog-toggle');
const panel  = document.getElementById('catalog-panel');

if (toggle && panel) {
  toggle.addEventListener('click', () => {
    const isHidden = panel.hasAttribute('hidden');
    if (isHidden) panel.removeAttribute('hidden');
    else panel.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', String(isHidden));
  });

  document.addEventListener('click', (e) => {
    const clickedToggle = e.target.closest('#catalog-toggle');
    const clickedPanel  = e.target.closest('#catalog-panel');
    if (!clickedToggle && !clickedPanel && !panel.hasAttribute('hidden')) {
      panel.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hasAttribute('hidden')) {
      panel.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ------- Pomocné odkazy na prvky -------
const grid      = document.getElementById('grid');
const fBrand    = document.getElementById('fBrand');
const fSurface  = document.getElementById('fSurface');
const fMin      = document.getElementById('fMin');
const fMax      = document.getElementById('fMax');
const fSort     = document.getElementById('fSort');
const q         = document.getElementById('q'); // musí být id="q"
const resultCnt = document.getElementById('resultCount');
const btnReset  = document.getElementById('btnReset');

// Modal prvky
const modal        = document.getElementById('productModal');
const modalContent = document.getElementById('modalContent');

// ------- Pomocné funkce -------
function formatPrice(n){ return (n|0).toLocaleString('cs-CZ') + ' Kč'; }

function getCategoryFromURL(){
  const params = new URLSearchParams(location.search);
  return params.get('kat') || '';
}

function renderCard(p){
  return `
    <article class="card" data-id="${p.id}" role="button" tabindex="0" aria-label="Zobrazit detail ${p.name}">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="price">${formatPrice(p.price)}</div>
      <button class="btn-cart" type="button" data-id="${p.id}">Do košíku</button>
    </article>
  `;
}

function render(list){
  if(!Array.isArray(list)) list = [];
  if (!grid) return;

  grid.innerHTML = list.map(renderCard).join('');
  if (resultCnt) resultCnt.textContent = String(list.length);

  // Klik/Enter na kartu => otevřít modal
  grid.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('click', e=>{
      if (e.target.closest('.btn-cart')) return;
      const id = card.dataset.id;
      const product = (window.PRODUCTS || []).find(p => p.id === id);
      if (product) openModal(product);
    });

    card.addEventListener('keydown', e=>{
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = card.dataset.id;
        const product = (window.PRODUCTS || []).find(p => p.id === id);
        if (product) openModal(product);
      }
    });
  });

  // Klik na "Do košíku" na kartě
  grid.querySelectorAll('.btn-cart').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const id = btn.dataset.id;
      if (typeof window.addToCart === 'function') window.addToCart(id, 1);
    });
  });
}

function applyFilters(){
  let list = [...(window.PRODUCTS || [])];

  const katFromURL = getCategoryFromURL();
  if (katFromURL) {
    list = list.filter(p => (p.category || '').toLowerCase() === katFromURL.toLowerCase());
  }

  const query = (q && q.value ? q.value : '').trim().toLowerCase();
  if (query) {
    list = list.filter(p =>
      (p.name || '').toLowerCase().includes(query) ||
      (p.brand || '').toLowerCase().includes(query) ||
      (p.category || '').toLowerCase().includes(query)
    );
  }

  if (fBrand && fBrand.value) {
    list = list.filter(p => (p.brand || '').toLowerCase() === fBrand.value.toLowerCase());
  }

  if (fSurface && fSurface.value) {
    list = list.filter(p => (p.surface || '').toUpperCase() === fSurface.value.toUpperCase());
  }

  const min = fMin && fMin.value ? parseInt(fMin.value, 10) : null;
  const max = fMax && fMax.value ? parseInt(fMax.value, 10) : null;
  if (min !== null && !Number.isNaN(min)) list = list.filter(p => (p.price|0) >= min);
  if (max !== null && !Number.isNaN(max)) list = list.filter(p => (p.price|0) <= max);

  switch (fSort && fSort.value){
    case 'priceAsc':  list.sort((a,b)=> (a.price|0) - (b.price|0)); break;
    case 'priceDesc': list.sort((a,b)=> (b.price|0) - (a.price|0)); break;
    case 'nameAsc':   list.sort((a,b)=> (a.name||'').localeCompare(b.name||'', 'cs')); break;
    default: break;
  }

  render(list);
}

function resetFilters(){
  if (fBrand)   fBrand.value = '';
  if (fSurface) fSurface.value = '';
  if (fMin)     fMin.value = '';
  if (fMax)     fMax.value = '';
  if (fSort)    fSort.value = '';
  if (q)        q.value = '';
  applyFilters();
}

[fBrand, fSurface, fMin, fMax, fSort, q].forEach(el=>{
  if (!el) return;
  el.addEventListener('input', applyFilters);
  el.addEventListener('change', applyFilters);
});
if (btnReset) btnReset.addEventListener('click', resetFilters);

document.addEventListener('DOMContentLoaded', applyFilters);

// =========================================================
// MODAL: otevření detailu produktu, galerie, zavírání
// =========================================================
if (modal) {
  modal.addEventListener('click', (e)=>{
    if (e.target.hasAttribute('data-close')) closeModal();
  });
}
document.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
});

function openModal(p){
  if (!modal || !modalContent) return;

  const imgs = Array.isArray(p.images) && p.images.length ? p.images : [p.img];
  const specs = p.specs && p.specs.length
    ? `<ul class="md-specs">${p.specs.map(s=>`<li>${s}</li>`).join('')}</ul>`
    : '';

  modalContent.innerHTML = `
    <div class="md-wrap">
      <div class="md-media">
        <img id="mdMainImg" class="md-mainimg" src="${imgs[0] || ''}" alt="${p.name}">
        ${imgs.length > 1 ? `
          <div class="md-thumbs">
            ${imgs.map((src,i)=>`<img src="${src}" class="${i===0?'active':''}" data-index="${i}" alt="náhled ${i+1}">`).join('')}
          </div>
        ` : ``}
      </div>

      <div class="md-info">
        <h1 id="modalTitle">${p.name}</h1>
        <div class="md-meta">
          ${(p.brand || '')}${p.category ? ' • ' + p.category : ''}${p.surface ? ' • ' + p.surface : ''}
        </div>
        <div class="md-price">${formatPrice(p.price|0)}</div>
        <p class="md-desc">${p.desc || ''}</p>
        ${specs}

        <div class="md-actions">
          <input id="mdQty" class="md-qty" type="number" min="1" value="1">
          <button id="mdBuy" class="btn-primary" type="button">Do košíku</button>
          <button class="btn-ghost" type="button" data-close>Zavřít</button>
        </div>
      </div>
    </div>
  `;

  // přepínání obrázků
  const mainImg = document.getElementById('mdMainImg');
  modalContent.querySelectorAll('.md-thumbs img').forEach(img=>{
    img.addEventListener('click', ()=>{
      modalContent.querySelectorAll('.md-thumbs img').forEach(i=>i.classList.remove('active'));
      img.classList.add('active');
      if (mainImg) mainImg.src = img.src;
    });
  });

  // přidání do košíku z modalu
  const buyBtn = document.getElementById('mdBuy');
  const qtyEl  = document.getElementById('mdQty');
  if (buyBtn) {
    buyBtn.addEventListener('click', ()=>{
      const qty = Math.max(1, parseInt(qtyEl?.value || '1', 10) || 1);
      if (typeof window.addToCart === 'function') window.addToCart(p.id, qty);
      closeModal();
    });
  }

  // volitelné: klik na hlavní obrázek (zoom class, když máš CSS)
  if (mainImg) {
    mainImg.addEventListener('click', ()=> mainImg.classList.toggle('zoomed'));
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('has-modal');
}

function closeModal(){
  if (!modal || !modalContent) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  modalContent.innerHTML = '';
  document.body.classList.remove('has-modal');
}