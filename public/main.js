// VIEREK — sitio

// Selector de idioma: se recuerda la elección para la próxima visita (la lee middleware.js)
document.querySelectorAll('[data-lang]').forEach((link) => {
  link.addEventListener('click', () => {
    document.cookie = `vk_lang=${link.dataset.lang}; path=/; max-age=31536000; SameSite=Lax; Secure`;
  });
});

// Clics en los botones: se cuentan como eventos si Vercel Web Analytics está activo
document.querySelectorAll('[data-cta]').forEach((link) => {
  link.addEventListener('click', () => {
    if (typeof window.va === 'function') {
      window.va('event', { name: 'cta_click', data: { lugar: link.dataset.cta, idioma: document.documentElement.lang } });
    }
  });
});

// Borde de la barra superior al bajar
const topbar = document.getElementById('topbar');
const onScroll = () => topbar.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menú en pantallas chicas
const toggle = document.querySelector('.nav__toggle');
const nav = document.getElementById('nav-secciones');
function setMenu(open) {
  nav.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
}
toggle?.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
});

// Marca en la barra la sección que se está viendo
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
if ('IntersectionObserver' in window && navLinks.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.toggleAttribute('aria-current', a.getAttribute('href') === `#${entry.target.id}`));
      navLinks.forEach((a) => { if (a.hasAttribute('aria-current')) a.setAttribute('aria-current', 'location'); });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));
}

document.getElementById('year').textContent = new Date().getFullYear();
