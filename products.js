// 1) TVÁ ZÁKLADNÍ DATA (ponecháno) + pár doplnění pro ostatní kategorie
const BASE = [
  // ===== KOPAČKY =====
  { id:'nike-phantom-gx2-force9', name:'Nike Phantom GX 2 Force 9', brand:'Nike',   category:'kopacky', surface:'FG', price:5999, img:'obrazky/produkty/nike_phantom_gx2_force9.jpg' },
  { id:'adidas-f50-lamine-yamal', name:'adidas F50 Lamine Yamal',    brand:'adidas', category:'kopacky', surface:'FG', price:6699, img:'obrazky/produkty/adidas_f50_lamine_yamal.jpg' },
  { id:'puma-ultra-playmaker-pack', name:'Puma Ultra Playmaker Pack',brand:'Puma',   category:'kopacky', surface:'FG', price:5199, img:'obrazky/produkty/puma_ultra_playmaker.jpg' },
  { id:'adidas-coral-blaze-pack', name:'adidas Coral Blaze Pack',    brand:'adidas', category:'kopacky', surface:'FG', price:6399, img:'obrazky/produkty/adidas_coral_blaze.jpg' },

  // ===== CHRÁNIČE =====
  { id:'nike-tiempe-guard-pro', name:'Nike Tiempe Guard Pro',  brand:'Nike',   category:'chranice', surface:'', price: 899, img:'obrazky/produkty/nike_chranice.jpg' },
  { id:'puma-evospeed-shin',    name:'Puma evoSPEED Shin',     brand:'Puma',   category:'chranice', surface:'', price: 749, img:'obrazky/produkty/puma_chranice.jpg' },
  { id:'adidas-tiro-match',     name:'adidas Tiro Match Shin', brand:'adidas', category:'chranice', surface:'', price: 649, img:'obrazky/produkty/adidas_tiro_match.jpg' },

  // ===== DRESY =====
  { id:'adidas-match-jersey', name:'adidas Match Jersey',    brand:'adidas', category:'dresy', surface:'', price:1199, img:'obrazky/produkty/adidas_dres.jpg' },
  { id:'nike-park-vii',       name:'Nike Park VII Jersey',   brand:'Nike',   category:'dresy', surface:'', price: 399, img:'obrazky/produkty/nike_park_vii.jpg' },
  { id:'puma-teamliga',       name:'Puma teamLIGA Jersey',   brand:'Puma',   category:'dresy', surface:'', price: 429, img:'obrazky/produkty/puma_teamliga.jpg' },

  // ===== TERMO =====
  { id:'nike-pro-ls',         name:'Nike Pro Top LS',           brand:'Nike',   category:'termo', surface:'', price: 899, img:'obrazky/produkty/nike_pro_ls.jpg' },
  { id:'adidas-techfit-cold', name:'adidas Techfit Cold.RDY',   brand:'adidas', category:'termo', surface:'', price: 999, img:'obrazky/produkty/adidas_techfit_coldrdy.jpg' },
  { id:'puma-team-thermal',   name:'Puma Team Thermal Base',    brand:'Puma',   category:'termo', surface:'', price: 899, img:'obrazky/produkty/puma_team_thermal.jpg' },

  // ===== RUKAVICE (field player) =====
  { id:'nike-hyperwarm-field', name:'Nike HyperWarm Field',      brand:'Nike',   category:'rukavice', surface:'', price: 749, img:'obrazky/produkty/nike_hyperwarm_field.jpg' },
  { id:'adidas-fieldplayer',   name:'adidas Fieldplayer Gloves', brand:'adidas', category:'rukavice', surface:'', price: 699, img:'obrazky/produkty/adidas_fieldplayer.jpg' },
  { id:'puma-team-winter',     name:'Puma Team Winter Gloves',   brand:'Puma',   category:'rukavice', surface:'', price: 649, img:'obrazky/produkty/puma_team_winter.jpg' },

  // ===== GÓLMAN =====
  { id:'nike-gk-match',         name:'Nike GK Match',            brand:'Nike',   category:'golman', surface:'', price: 899,  img:'obrazky/produkty/nike_gk_match.jpg' },
  { id:'adidas-predator-glpro', name:'adidas Predator GL Pro',   brand:'adidas', category:'golman', surface:'', price:2199,  img:'obrazky/produkty/adidas_predator_glpro.jpg' },
  { id:'puma-future-grip3',     name:'Puma Future Grip 3',       brand:'Puma',   category:'golman', surface:'', price:1699,  img:'obrazky/produkty/puma_future_grip3.jpg' },
];

// 2) Generátor variant — přidá N nových kusů, zároveň zajistí min. X/kat.
function expandProducts(base, extraTotal = 60, minPerCategory = 5) {
  const surfaces = ['FG','AG','TF','SG'];
  const suffixes = ['II','Pro','Elite','SE','X','Neo','Edge','Plus','Color','Ltd'];

  // Pomocné indexy podle kategorií a brandů, aby se řazení drželo
  const catOrder = ['kopacky','chranice','dresy','termo','rukavice','golman'];
  const brandOrder = ['Nike','adidas','Puma'];

  // Seskupení podle kategorie a brandu (pro hezké střídání)
  const byCatBrand = {};
  for (const p of base) {
    const key = `${p.category}|${p.brand}`;
    (byCatBrand[key] ??= []).push(p);
  }

  const out = [...base];

  // a) nejdřív zajistit min. 5 na kategorii
  const byCat = {};
  base.forEach(p => (byCat[p.category] ??= []).push(p));
  for (const cat of catOrder) {
    const list = byCat[cat] || [];
    let i = 0;
    while (list.length < minPerCategory) {
      const seed = base.find(p => p.category === cat) || base[0];
      const clone = makeClone(seed, list.length);
      out.push(clone);
      list.push(clone);
    }
  }

  // b) poté doplnit další varianty, dokud nepřidáme extraTotal kusů navíc
  let added = 0, turn = 0;
  while (added < extraTotal) {
    // střídáme kategorie i brandy, ať je to rozprostřené
    const cat = catOrder[turn % catOrder.length];
    const brand = brandOrder[turn % brandOrder.length];
    const seed = out.find(p => p.category === cat && p.brand === brand) ||
                 out.find(p => p.category === cat) ||
                 out[0];

    const clone = makeClone(seed, added);
    // pro kopačky krokuj povrchy
    if (cat === 'kopacky') {
      clone.surface = surfaces[(added + turn) % surfaces.length];
    }
    out.push(clone);
    added++; turn++;
  }

  // finální stabilní řazení (dle přání)
  out.sort((a, b) => {
    const c = catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
    if (c) return c;
    const d = brandOrder.indexOf(a.brand) - brandOrder.indexOf(b.brand);
    if (d) return d;
    return a.name.localeCompare(b.name, 'cs');
  });

  return out;

  function makeClone(seed, i) {
    const suf = suffixes[i % suffixes.length];
    const id  = `${seed.id}-${(i+1).toString(36)}`;
    const name = `${seed.name} ${suf}`;
    // mírná variace ± až ~10 %
    const price = Math.max(99, Math.round(seed.price * (0.92 + (i % 8) * 0.01)));
    return {
      ...seed,
      id, name, price,
      // když seed nemá img, necháme prázdné / placeholder
      img: seed.img || 'obrazky/produkty/placeholder.jpg'
    };
  }
}

// 3) Export – přidáme +60 kusů a hlídáme min. 5 na kategorii
window.PRODUCTS = expandProducts(BASE, /* extraTotal */ 60, /* minPerCategory */ 5);