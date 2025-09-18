// Minimal shared app logic: cart state, navigation data passing, modals

(function() {
  const STORAGE_KEYS = {
    cart: 'fd_cart',
    restaurant: 'fd_restaurant',
    address: 'fd_address',
    email: 'fd_email'
  };

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
  }
  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function formatCurrency(n) { return `$${Number(n).toFixed(2)}`; }

  // Initialize page
  document.addEventListener('DOMContentLoaded', () => {
    const page = window.__PAGE__ || '';
    hydrateHeader();

    if (page === 'home') initHome();
    if (page === 'restaurant') initRestaurant();
    if (page === 'checkout') initCheckout();
    if (page === 'payment') initPayment();
    if (page === 'confirmation') initConfirmation();
  });

  function hydrateHeader() {
    const cart = readJSON(STORAGE_KEYS.cart, []);
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = String(count);
    const address = readJSON(STORAGE_KEYS.address, '123 main str');
    const addressPill = document.getElementById('addressPill');
    if (addressPill) addressPill.textContent = `🏠 ${address}`;
  }

  // Home
  function initHome() {
    document.querySelectorAll('.restaurant-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const name = card.getAttribute('data-name') || 'Restaurant';
        writeJSON(STORAGE_KEYS.restaurant, { name });
      });
    });
  }

  // Restaurant detail
  function initRestaurant() {
    const restaurant = readJSON(STORAGE_KEYS.restaurant, { name: 'Whataburger' });
    const nameEl = document.getElementById('restaurantName');
    if (nameEl) nameEl.textContent = restaurant.name;
    const cartRestaurant = document.getElementById('cartRestaurant');
    if (cartRestaurant) cartRestaurant.textContent = restaurant.name;

    const miniCart = document.getElementById('miniCart');
    const miniItems = document.getElementById('miniCartItems');

    document.querySelectorAll('.menu-card').forEach(card => {
      card.querySelector('.add-btn')?.addEventListener('click', () => {
        const item = {
          id: card.getAttribute('data-item-id'),
          name: card.getAttribute('data-item-name'),
          price: Number(card.getAttribute('data-item-price')),
          qty: 1
        };
        addToCart(restaurant.name, item);
        renderMiniCart();
      });
    });

    function renderMiniCart() {
      const cart = readJSON(STORAGE_KEYS.cart, []);
      miniItems.innerHTML = '';
      cart.forEach(ci => {
        const line = document.createElement('div');
        line.className = 'mini-line';
        line.textContent = `${ci.qty} × ${ci.name}`;
        const price = document.createElement('span');
        price.textContent = formatCurrency(ci.price * ci.qty);
        line.appendChild(price);
        miniItems.appendChild(line);
      });
      if (cart.length > 0) miniCart.hidden = false; else miniCart.hidden = true;
      hydrateHeader();
    }

    renderMiniCart();
  }

  function addToCart(restaurantName, item) {
    writeJSON(STORAGE_KEYS.restaurant, { name: restaurantName });
    const cart = readJSON(STORAGE_KEYS.cart, []);
    const existing = cart.find(ci => ci.id === item.id);
    if (existing) existing.qty += 1; else cart.push(item);
    writeJSON(STORAGE_KEYS.cart, cart);
  }

  // Checkout
  function initCheckout() {
    const cart = readJSON(STORAGE_KEYS.cart, []);
    const restaurant = readJSON(STORAGE_KEYS.restaurant, { name: 'Restaurant' });
    const list = document.getElementById('summaryItems');
    const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const fees = sub * 0.08;
    const total = sub + fees;

    const summaryRestaurant = document.getElementById('summaryRestaurant');
    if (summaryRestaurant) summaryRestaurant.textContent = restaurant.name;

    if (list) {
      list.innerHTML = '';
      cart.forEach(i => {
        const row = document.createElement('div');
        row.className = 'summary-row';
        row.innerHTML = `<span>${i.qty} × ${i.name}</span><span>${formatCurrency(i.price * i.qty)}</span>`;
        list.appendChild(row);
      });
    }
    const subtotalEl = document.getElementById('subtotal');
    const feesEl = document.getElementById('fees');
    const totalEl = document.getElementById('total');
    if (subtotalEl) subtotalEl.textContent = formatCurrency(sub);
    if (feesEl) feesEl.textContent = formatCurrency(fees);
    if (totalEl) totalEl.textContent = formatCurrency(total);

    // Address modal
    const open = document.getElementById('changeAddressBtn');
    const modal = document.getElementById('addressModal');
    const close = document.getElementById('closeAddressModal');
    const confirm = document.getElementById('confirmAddress');
    const input = document.getElementById('addressInput');
    if (open && modal && close && confirm && input) {
      open.addEventListener('click', () => { modal.hidden = false; });
      close.addEventListener('click', () => { modal.hidden = true; });
      confirm.addEventListener('click', () => {
        writeJSON(STORAGE_KEYS.address, input.value || '');
        modal.hidden = true;
        hydrateHeader();
      });
    }
  }

  // Payment page
  function initPayment() {
    const cart = readJSON(STORAGE_KEYS.cart, []);
    const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const total = sub + sub * 0.08;
    const totalEl = document.getElementById('paymentTotal');
    if (totalEl) totalEl.textContent = formatCurrency(total);

    const open = document.getElementById('openCardModal');
    const modal = document.getElementById('cardModal');
    const close = document.getElementById('closeCardModal');
    const save = document.getElementById('saveCard');
    if (open && modal && close && save) {
      open.addEventListener('click', () => { modal.hidden = false; });
      close.addEventListener('click', () => { modal.hidden = true; });
      save.addEventListener('click', () => {
        modal.hidden = true;
        // Proceed to confirmation
        window.location.href = 'confirmation.html';
      });
    }
  }

  // Confirmation page
  function initConfirmation() {
    const address = readJSON(STORAGE_KEYS.address, '123 main str');
    const el = document.getElementById('confirmAddressText');
    if (el) el.innerHTML = `Deliver Address<br>${address}`;
  }
})();

