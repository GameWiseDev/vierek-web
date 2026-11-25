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

document.getElementById('year').textContent = new Date().getFullYear();
