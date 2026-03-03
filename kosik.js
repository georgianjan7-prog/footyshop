const CART_KEY = 'footyshop_cart_v1';

function loadCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function renderCart(){
  const cart = loadCart();
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');

  if (!container) return;

  if (cart.length === 0){
    container.innerHTML = "<p>Košík je prázdný.</p>";
    totalEl.textContent = "";
    return;
  }

  let total = 0;

  container.innerHTML = cart.map(item=>{
    const product = (window.PRODUCTS || []).find(p => p.id === item.id);
    if (!product) return '';

    const price = product.price * item.qty;
    total += price;

    return `
      <div style="margin-bottom:20px; border-bottom:1px solid #333; padding-bottom:10px">
        <h3>${product.name}</h3>
        <p>${item.qty} × ${product.price} Kč</p>
        <strong>${price.toLocaleString('cs-CZ')} Kč</strong>
      </div>
    `;
  }).join('');

  totalEl.textContent = "Celkem: " + total.toLocaleString('cs-CZ') + " Kč";
}

document.getElementById('clearCart').addEventListener('click', ()=>{
  localStorage.removeItem(CART_KEY);
  renderCart();
});

document.addEventListener('DOMContentLoaded', renderCart);


