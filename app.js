// Minimal shared app logic: cart state, navigation data passing, modals

(function() {
  const STORAGE_KEYS = {
    // Cart is now per-restaurant: use getCartKey(restaurantName)
    restaurant: 'fd_restaurant',
    address: 'fd_address',
    email: 'fd_email'
  };

  function getCartKey(restaurantName) {
    const name = (restaurantName || '').toString().trim() || 'default';
    return `fd_cart_${name}`;
  }

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
    // Use restaurant-specific cart when on restaurant-related pages
    const page = window.__PAGE__ || '';
    const restaurant = readJSON(STORAGE_KEYS.restaurant, { name: '' });
    const cart = readJSON(getCartKey(restaurant.name), []);
    const count = (page === 'restaurant' || page === 'checkout' || page === 'payment' || page === 'confirmation')
      ? cart.reduce((s, i) => s + i.qty, 0)
      : 0; // On non-restaurant pages, do not show a default count
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

  // Lightweight menu datasets (sampled and approximated; prices illustrative)
  const MENU_DATA = {
    "McDonald's": [
      { id: 'mcbigmac', name: 'Big Mac', price: 5.99, desc: 'Two beef patties, special sauce' },
      { id: 'mcquarter', name: 'Quarter Pounder w/ Cheese', price: 6.29 },
      { id: 'mcchkn', name: 'McChicken', price: 2.49 },
      { id: 'mcnug10', name: '10 pc Chicken McNuggets', price: 5.49 },
      { id: 'mcfries', name: 'Large Fries', price: 3.29 },
      { id: 'mcflurry', name: 'Oreo McFlurry', price: 3.99 }
    ],
    'Chick-fil-A': [
      { id: 'cfa_chicken_sand', name: 'Chick-fil-A Chicken Sandwich', price: 4.99, desc: 'Hand-breaded chicken breast' },
      { id: 'cfa_spicy', name: 'Spicy Chicken Sandwich', price: 5.29 },
      { id: 'cfa_nug8', name: '8 ct Nuggets', price: 4.99 },
      { id: 'cfa_waf', name: 'Waffle Potato Fries', price: 2.49 },
      { id: 'cfa_lemon', name: 'Fresh-Squeezed Lemonade', price: 2.39 },
      { id: 'cfa_salad', name: 'Cobb Salad', price: 8.99 }
    ],
    'Taco Bell': [
      { id: 'tb_crunch', name: 'Crunchwrap Supreme', price: 4.99 },
      { id: 'tb_dl_taco', name: 'Doritos Locos Taco', price: 2.19 },
      { id: 'tb_qsb', name: 'Quesarito', price: 4.29 },
      { id: 'tb_burr', name: 'Bean Burrito', price: 1.89 },
      { id: 'tb_nachos', name: 'Nachos BellGrande', price: 4.79 },
      { id: 'tb_baja', name: 'Baja Blast', price: 2.19 }
    ],
    Subway: [
      { id: 'sub_italian', name: 'Italian B.M.T. Footlong', price: 8.99 },
      { id: 'sub_turkey', name: 'Turkey Breast Footlong', price: 8.49 },
      { id: 'sub_tuna', name: 'Tuna 6"', price: 5.49 },
      { id: 'sub_steak', name: 'Steak & Cheese Footlong', price: 9.49 },
      { id: 'sub_chips', name: 'Chips', price: 1.59 },
      { id: 'sub_cookie', name: 'Cookie', price: 1.19 }
    ],
    "Wendy's": [
      { id: 'wen_bac', name: 'Baconator', price: 6.99 },
      { id: 'wen_dbl', name: 'Dave’s Double', price: 6.49 },
      { id: 'wen_chkn', name: 'Crispy Chicken Sandwich', price: 4.29 },
      { id: 'wen_frosty', name: 'Chocolate Frosty', price: 2.49 }
    ],
    'Burger King': [
      { id: 'bk_whopper', name: 'Whopper', price: 6.19 },
      { id: 'bk_chking', name: 'Chicken Royale', price: 5.49 },
      { id: 'bk_nug10', name: '10 pc Nuggets', price: 2.99 },
      { id: 'bk_rings', name: 'Onion Rings', price: 2.49 }
    ],
    KFC: [
      { id: 'kfc_buck', name: '8 pc Bucket', price: 17.99 },
      { id: 'kfc_famous', name: 'Famous Bowl', price: 5.49 },
      { id: 'kfc_tenders', name: '3 pc Tenders', price: 6.29 },
      { id: 'kfc_bisc', name: 'Biscuits (2)', price: 1.49 }
    ],
    'Chipotle Mexican Grill': [
      { id: 'chi_bowl', name: 'Burrito Bowl', price: 8.95 },
      { id: 'chi_burr', name: 'Burrito', price: 8.95 },
      { id: 'chi_tacos', name: '3 Tacos', price: 8.25 },
      { id: 'chi_chips', name: 'Chips & Guac', price: 4.25 }
    ],
    "Panda Express": [
      { id: 'px_orange', name: 'Orange Chicken Bowl', price: 8.79 },
      { id: 'px_beef', name: 'Beijing Beef Bowl', price: 9.29 },
      { id: 'px_fried', name: 'Fried Rice', price: 3.19 },
      { id: 'px_rangoons', name: 'Cream Cheese Rangoon (3)', price: 2.49 }
    ],
    "Panera Bread": [
      { id: 'pa_mac', name: 'Mac & Cheese', price: 6.99 },
      { id: 'pa_broc', name: 'Broccoli Cheddar Soup', price: 5.49 },
      { id: 'pa_chicken', name: 'Chipotle Chicken Avocado Melt', price: 8.99 },
      { id: 'pa_bowl', name: 'Mediterranean Bowl', price: 9.49 }
    ],
    "Domino's": [
      { id: 'dom_pep', name: 'Medium Pepperoni', price: 9.99 },
      { id: 'dom_deluxe', name: 'Deluxe Pizza', price: 12.99 },
      { id: 'dom_bread', name: 'Stuffed Cheesy Bread', price: 6.49 },
      { id: 'dom_wings', name: '8pc Wings', price: 7.99 }
    ]
  };

  // Restaurant detail
  function initRestaurant() {
    const restaurant = readJSON(STORAGE_KEYS.restaurant, { name: 'Whataburger' });
    // Clear any existing cart for this restaurant on page load
    writeJSON(getCartKey(restaurant.name), []);
    const nameEl = document.getElementById('restaurantName');
    if (nameEl) nameEl.textContent = restaurant.name;
    const cartRestaurant = document.getElementById('cartRestaurant');
    if (cartRestaurant) cartRestaurant.textContent = restaurant.name;

    const miniCart = document.getElementById('miniCart');
    const miniItems = document.getElementById('miniCartItems');

    // Render menu from dataset for the selected restaurant
    const grid = document.getElementById('menuGrid');
    const items = MENU_DATA[restaurant.name] || [];
    if (grid && items.length) {
      grid.innerHTML = items.map(it => (
        `<div class="menu-card" data-item-id="${it.id}" data-item-name="${it.name}" data-item-price="${it.price}">`+
          `<div class="card-img"></div>`+
          `<div class="menu-info"><div class="menu-title">${it.name}</div>`+
            (it.desc ? `<div class="menu-sub">${it.desc}</div>` : '')+
          `</div>`+
          `<button class="add-btn">Add ${formatCurrency(it.price)}</button>`+
        `</div>`
      )).join('');
    }

    document.querySelectorAll('.menu-card .add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = btn.closest('.menu-card');
        if (!card) return;
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
      const cart = readJSON(getCartKey(restaurant.name), []);
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
    const key = getCartKey(restaurantName);
    const cart = readJSON(key, []);
    const existing = cart.find(ci => ci.id === item.id);
    if (existing) existing.qty += 1; else cart.push(item);
    writeJSON(key, cart);
  }

  // Checkout
  function initCheckout() {
    const restaurant = readJSON(STORAGE_KEYS.restaurant, { name: 'Restaurant' });
    const cart = readJSON(getCartKey(restaurant.name), []);
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
    const restaurant = readJSON(STORAGE_KEYS.restaurant, { name: '' });
    const cart = readJSON(getCartKey(restaurant.name), []);
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

