/* =========================================================
   Latte Lounge by 7's — main.js
   Vanilla ES6. No global leaks — everything lives inside the
   DOMContentLoaded scope below.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile navigation toggle ---- */
  const initNavToggle = () => {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the menu when a link is chosen (mobile)
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  };

  /* ---- Active nav state based on current page ---- */
  const initActiveNav = () => {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const current = path === '' ? 'index.html' : path;
    document.querySelectorAll('.nav-menu a[data-nav]').forEach((link) => {
      const linkPage = link.getAttribute('href');
      if (linkPage === current || (current === 'index.html' && linkPage === 'index.html')) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  };

  /* ---- Dynamic copyright year ---- */
  const initFooterYear = () => {
    const year = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = String(year);
    });
  };

  /* ---- Dynamic "offer" dates for the Current Happenings cards ---- */
  const initOfferDates = () => {
    const formatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
    const today = new Date();
    const nodes = document.querySelectorAll('[data-offer-date]');

    nodes.forEach((node) => {
      const kind = node.getAttribute('data-offer-date');
      if (kind === '1') {
        const end = new Date(today);
        end.setDate(today.getDate() + 6);
        node.textContent = `Through ${formatter.format(end)}`;
      } else if (kind === '2') {
        node.textContent = 'Saturday & Sunday';
      } else if (kind === '3') {
        node.textContent = 'Daily, 6:00–10:00 AM';
      }
    });
  };

  /* ---- Contact form: prevent default, simulate submit, show toast ---- */
  const initContactForm = () => {
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    if (!form || !toast) return;

    let toastTimer = null;

    const showToast = () => {
      toast.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 4000);
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      // Simulated network round-trip (fetch-style async pattern,
      // ready to be swapped for a real endpoint later).
      const simulateSubmit = () => new Promise((resolve) => {
        setTimeout(resolve, 700);
      });

      simulateSubmit().then(() => {
        showToast();
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      });
    });
  };

  initNavToggle();
  initActiveNav();
  initFooterYear();
  initOfferDates();
  initContactForm();

});
