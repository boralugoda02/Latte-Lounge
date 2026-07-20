/* =========================================================
   LATTE LOUNGE by 7's — main.js
   Modular vanilla ES6. No global leaks: everything lives
   inside the DOMContentLoaded listener / named functions.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  setActiveNavLink();
  setFooterYear();
  initContactForm();
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
 * current document location, so the active state is always
 * derived from window.location rather than hardcoded per page.
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
 * runs a lightweight simulated send, then shows a success
 * toast. HTML5 attributes (required, type="email") handle
 * baseline validation before this ever runs.
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

/**
 * Simulates a network request using fetch-style Promise
 * semantics. Swap the resolve() body for a real fetch() call
 * to a form backend when one is available.
 */
function simulateSend(formData) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ok: true, data: Object.fromEntries(formData) }), 600);
  });
}

/** Shows the toast notification for a few seconds, then hides it. */
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
