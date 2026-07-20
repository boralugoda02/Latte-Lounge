/* =========================================================
   LATTE LOUNGE by 7's — content.js
   Fetches the JSON files under /data (managed by the CMS at
   /admin) and renders them into the page at runtime. No
   build step needed: editing a JSON file via the CMS and
   committing it is enough to update the live site.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  renderOffers();
  renderItems();
  renderSettings();
});

async function loadJSON(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

/** Renders the "Current Happenings" offer cards on the homepage. */
async function renderOffers() {
  const grid = document.getElementById('offersGrid');
  if (!grid) return;

  try {
    const { offers } = await loadJSON('data/offers.json');
    grid.innerHTML = offers.map((offer) => `
      <article class="offer-card">
        <span class="tag-chip ${escapeAttr(offer.tagClass)}">${escapeHtml(offer.tag)}</span>
        <h3>${escapeHtml(offer.title)}</h3>
        <p>${escapeHtml(offer.description)}</p>
        <time datetime="${escapeAttr(offer.dateISO)}">${escapeHtml(offer.dateLabel)}</time>
      </article>
    `).join('');
  } catch (error) {
    console.error(error);
  }
}

/** Renders the signature menu items grid on the homepage. */
async function renderItems() {
  const grid = document.getElementById('itemsGrid');
  if (!grid) return;

  try {
    const { items } = await loadJSON('data/items.json');
    grid.innerHTML = items.map((item) => `
      <article class="item-card">
        <div class="item-media">
          <img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.name)}" loading="lazy">
        </div>
        <div class="item-body">
          <div class="item-top">
            <h3>${escapeHtml(item.name)}</h3>
            <span class="item-price">${escapeHtml(item.price)}</span>
          </div>
          <span class="tag-chip ${escapeAttr(item.tagClass)}" style="align-self:flex-start;">${escapeHtml(item.tag)}</span>
          <p class="item-desc">${escapeHtml(item.description)}</p>
        </div>
      </article>
    `).join('');
  } catch (error) {
    console.error(error);
  }
}

/** Fills in hours, phone, address, map, and social links everywhere they appear. */
async function renderSettings() {
  const targets = document.querySelectorAll('[data-field]');
  if (!targets.length) return;

  try {
    const settings = await loadJSON('data/settings.json');

    targets.forEach((el) => {
      const field = el.getAttribute('data-field');
      const value = field.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), settings);
      if (value === undefined) return;

      if (el.tagName === 'A' && el.hasAttribute('href')) {
        el.setAttribute('href', field === 'phoneHref' ? `tel:${value}` : value);
        return;
      }
      if (el.tagName === 'IFRAME') {
        el.setAttribute('src', value);
        return;
      }
      el.textContent = value;
    });
  } catch (error) {
    console.error(error);
  }
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function escapeAttr(str) {
  return escapeHtml(str);
}
