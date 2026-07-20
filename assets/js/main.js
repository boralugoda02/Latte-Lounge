/* =========================================================
   LATTE LOUNGE by 7's — main.js
   Modular vanilla ES6. No global leaks.
   Manages mobile navigation, shopping cart, newsletter capture,
   and contact form interactions.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  setActiveNavLink();
  setFooterYear();
  initContactForm();
  initShoppingCart();
  initNewsletterForm();
});

/**
 * Mobile hamburger menu: toggles the nav-menu panel and
 * keeps aria-expanded in sync for screen readers.
 */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the menu after a link is chosen (mobile only).
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on Escape for keyboard users.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}

/**
 * Applies aria-current="page" to the nav link matching the
 * current document location.
 */
function setActiveNavLink() {
  const links = document.querySelectorAll('[data-nav-link]');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach((link) => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

/** Writes the current year into the footer copyright line. */
function setFooterYear() {
  const yearEl = document.getElementById('copyrightYear');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

/**
 * Contact form: prevents the default full-page submit,
 * runs a lightweight simulated send, then shows a success toast.
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitButton = form.querySelector('.form-submit');
    const originalLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';

    simulateSend(new FormData(form))
      .then(() => {
        showToast("Message sent — we'll get back to you soon.");
        form.reset();
      })
      .catch(() => {
        showToast('Something went wrong. Please try again.');
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      });
  });
}

function simulateSend(formData) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ok: true, data: Object.fromEntries(formData) }), 600);
  });
}

/** Shows the toast notification. */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  if (!toast) return;

  if (toastMessage) toastMessage.textContent = message;

  toast.classList.add('is-visible');
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 4000);
}

/**
 * Shopping Cart: tracks order list, calculates totals,
 * manages quantity triggers, and handles WhatsApp redirection.
 */
function initShoppingCart() {
  let cart = [];
  let whatsappNumber = '94571234567'; // default fallback

  // Fetch phone number settings for redirection
  fetch('assets/data/content.json')
    .then(res => res.json())
    .then(settings => {
      if (settings.phoneHref) {
        // Strip plus/spaces for WhatsApp API redirect compatibility
        whatsappNumber = settings.phoneHref.replace(/\+/g, '').replace(/[^0-9]/g, '');
      }
    })
    .catch(() => console.warn('Could not load WhatsApp phone settings, using default.'));

  // Load cart from localStorage
  const storedCart = localStorage.getItem('ll_cart');
  if (storedCart) {
    try {
      cart = JSON.parse(storedCart);
    } catch (e) {
      cart = [];
    }
  }

  // Create Cart Elements dynamically
  const cartBackdrop = document.createElement('div');
  cartBackdrop.className = 'cart-backdrop';
  document.body.appendChild(cartBackdrop);

  const cartDrawer = document.createElement('div');
  cartDrawer.className = 'cart-drawer';
  cartDrawer.setAttribute('role', 'dialog');
  cartDrawer.setAttribute('aria-modal', 'true');
  cartDrawer.setAttribute('aria-label', 'Shopping Cart');
  cartDrawer.innerHTML = `
    <div class="cart-drawer-header">
      <h2>Your Order</h2>
      <button class="cart-drawer-close" aria-label="Close cart">&times;</button>
    </div>
    <div class="cart-drawer-items"></div>
    <div class="cart-drawer-summary">
      <div class="summary-row">
        <span>Subtotal</span>
        <span class="cart-subtotal">LKR 0</span>
      </div>
      <form class="cart-checkout-form" id="cartCheckoutForm" novalidate>
        <h3>Traveler &amp; Order Details</h3>
        <div class="form-group">
          <label for="cartName">Your Name *</label>
          <input type="text" id="cartName" required aria-required="true" placeholder="e.g., Emily Perera">
        </div>
        <div class="form-group">
          <label for="cartNotes">Traveler Notes (e.g. ETA, Vehicle Plate, special instructions)</label>
          <textarea id="cartNotes" rows="2" placeholder="e.g. Red SUV WP-AB1234, arriving in 20 minutes"></textarea>
        </div>
        <button type="submit" class="btn btn-primary checkout-btn">
          Confirm Order via WhatsApp
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(cartDrawer);

  const floatingCart = document.createElement('button');
  floatingCart.className = 'floating-cart';
  floatingCart.setAttribute('aria-label', 'View Order');
  floatingCart.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
    <span class="cart-count" aria-live="polite" style="display: none;">0</span>
  `;
  document.body.appendChild(floatingCart);

  // Selector cache
  const cartItemsContainer = cartDrawer.querySelector('.cart-drawer-items');
  const cartSubtotalEl = cartDrawer.querySelector('.cart-subtotal');
  const cartCountEl = floatingCart.querySelector('.cart-count');
  const closeBtn = cartDrawer.querySelector('.cart-drawer-close');
  const checkoutForm = cartDrawer.querySelector('#cartCheckoutForm');

  // Event handlers
  const openCart = () => {
    cartDrawer.classList.add('is-open');
    cartBackdrop.classList.add('is-visible');
    closeBtn.focus();
  };

  const closeCart = () => {
    cartDrawer.classList.remove('is-open');
    cartBackdrop.classList.remove('is-visible');
    floatingCart.focus();
  };

  floatingCart.addEventListener('click', openCart);
  closeBtn.addEventListener('click', closeCart);
  cartBackdrop.addEventListener('click', closeCart);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer.classList.contains('is-open')) {
      closeCart();
    }
  });

  // Event delegation for "Add to Order" buttons
  document.body.addEventListener('click', (event) => {
    const btn = event.target.closest('.add-to-cart-btn');
    if (!btn) return;

    const title = btn.getAttribute('data-title');
    const price = parseInt(btn.getAttribute('data-price'), 10);
    const category = btn.getAttribute('data-category');
    const image = btn.getAttribute('data-image');

    addToCart(title, price, category, image);
  });

  function addToCart(title, price, category, image) {
    const existingIndex = cart.findIndex(item => item.title === title);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ title, price, category, image, quantity: 1 });
    }
    updateCartUI();
    showToast(`Added ${title} to your order.`);
    
    // Animate cart badge
    cartCountEl.classList.remove('pop');
    void cartCountEl.offsetWidth; // trigger reflow
    cartCountEl.classList.add('pop');
  }

  function removeFromCart(title) {
    cart = cart.filter(item => item.title !== title);
    updateCartUI();
  }

  function updateQuantity(title, delta) {
    const item = cart.find(i => i.title === title);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(title);
    } else {
      updateCartUI();
    }
  }

  function updateCartUI() {
    localStorage.setItem('ll_cart', JSON.stringify(cart));

    // Render items list
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <p>Your order is empty.</p>
          <small>Add signature items on the home page.</small>
        </div>
      `;
      checkoutForm.style.display = 'none';
    } else {
      cartItemsContainer.innerHTML = cart.map(item => `
        <article class="cart-item">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-details">
            <h4>${escapeHtml(item.title)}</h4>
            <span class="item-price">LKR ${item.price.toLocaleString()}</span>
          </div>
          <div class="cart-item-controls">
            <button class="cart-qty-btn qty-minus" aria-label="Decrease quantity of ${item.title}" data-title="${escapeAttr(item.title)}">-</button>
            <span class="cart-qty-val" aria-live="polite">${item.quantity}</span>
            <button class="cart-qty-btn qty-plus" aria-label="Increase quantity of ${item.title}" data-title="${escapeAttr(item.title)}">+</button>
          </div>
          <button class="cart-item-remove" aria-label="Remove ${item.title} from order" data-title="${escapeAttr(item.title)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>
        </article>
      `).join('');
      checkoutForm.style.display = 'flex';
    }

    // Update quantities, totals, badge
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotalEl.textContent = `LKR ${subtotal.toLocaleString()}`;

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalCount > 0) {
      cartCountEl.style.display = 'flex';
      cartCountEl.textContent = String(totalCount);
    } else {
      cartCountEl.style.display = 'none';
    }
  }

  // Handle drawer-level actions via delegation
  cartDrawer.addEventListener('click', (e) => {
    const target = e.target;
    
    if (target.classList.contains('qty-minus')) {
      updateQuantity(target.getAttribute('data-title'), -1);
    } else if (target.classList.contains('qty-plus')) {
      updateQuantity(target.getAttribute('data-title'), 1);
    } else if (target.closest('.cart-item-remove')) {
      const btn = target.closest('.cart-item-remove');
      removeFromCart(btn.getAttribute('data-title'));
    }
  });

  // Handle checkout WhatsApp redirection
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('cartName');
    const notesInput = document.getElementById('cartNotes');

    if (!nameInput.checkValidity()) {
      nameInput.reportValidity();
      return;
    }

    const name = nameInput.value.trim();
    const notes = notesInput.value.trim();

    // 1. Generate receipt code: LL-timestamp-randomHex
    const timestamp = Math.floor(Date.now() / 1000);
    const randHex = Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0');
    const receiptCode = `LL-${timestamp}-${randHex}`;

    // 2. Format order details
    const orderLines = cart.map(item => `- ${item.quantity} x ${item.title} (LKR ${(item.price * item.quantity).toLocaleString()})`);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const formattedTotal = `LKR ${total.toLocaleString()}`;

    // 3. Construct receipt block
    const message = `*LATTE LOUNGE BY 7'S*
*Order Receipt:* ${receiptCode}
----------------------------------------
*Name:* ${name}
${notes ? `*Traveler Notes:* ${notes}\n` : ''}----------------------------------------
*Items Ordered:*
${orderLines.join('\n')}

*Total:* ${formattedTotal}
----------------------------------------
Thank you for planning your stop! See you soon on the highway.`;

    // 4. Clear cart and redirect
    cart = [];
    updateCartUI();
    closeCart();
    checkoutForm.reset();

    const encodedMessage = encodeURIComponent(message);
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  });

  // Initial draw
  updateCartUI();
}

/** Validate and simulate subscription for the newsletter capture form */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  const input = document.getElementById('newsletterEmail');
  const feedback = document.getElementById('newsletterFeedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    feedback.style.display = 'none';
    feedback.className = 'form-feedback';

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const email = input.value.trim();
    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Subscribing…';

    // Simulate API request
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = origText;
      
      feedback.textContent = 'Thank you! You have successfully subscribed to highway updates.';
      feedback.classList.add('success');
      feedback.style.display = 'block';
      form.reset();
    }, 800);
  });
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function escapeAttr(str) {
  return escapeHtml(str);
}
