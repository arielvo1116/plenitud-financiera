/* ==========================================================
   Plenitud Financiera — Interacciones
   ========================================================== */
(() => {
  'use strict';

  // >>> Cambia aquí el número de WhatsApp (código de país + número, sin espacios)
  const WHATSAPP = '50258285623';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Header al hacer scroll + botón "arriba" ---------- */
  const header = $('#header');
  const toTop = $('#toTop');
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    toTop.classList.toggle('is-visible', y > 600);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Menú móvil ---------- */
  const nav = $('#nav');
  const toggle = $('#navToggle');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Link activo según la sección visible ---------- */
  const links = $$('.nav__link');
  const sections = links.map(l => $(l.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  /* ---------- Animaciones de aparición ---------- */
  const reveals = $$('.reveal');
  // Escalonado para elementos dentro de una misma cuadrícula
  ['.values__grid', '.services__grid', '.process__steps'].forEach(sel => {
    $$(sel + ' > .reveal').forEach((el, i) => el.style.setProperty('--d', (i % 4) * 0.1 + 's'));
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Calculadora de cuota ---------- */
  const fmt = n => 'Q ' + Math.round(n).toLocaleString('es-GT');
  const amount = $('#calcAmount'), term = $('#calcTerm'), rate = $('#calcRate');
  const paint = el => el.style.setProperty('--p', ((el.value - el.min) / (el.max - el.min)) * 100 + '%');
  const calc = () => {
    const P = +amount.value, n = +term.value, r = +rate.value / 100 / 12;
    const cuota = r ? (P * r) / (1 - Math.pow(1 + r, -n)) : P / n;
    $('#calcAmountOut').textContent = fmt(P);
    $('#calcTermOut').textContent = n + ' meses';
    $('#calcRateOut').textContent = (+rate.value).toLocaleString('es-GT') + '%';
    $('#calcPayment').textContent = fmt(cuota);
    $('#calcTotal').textContent = fmt(cuota * n);
    [amount, term, rate].forEach(paint);
  };
  [amount, term, rate].forEach(el => el.addEventListener('input', calc));
  calc();
  $('#calcCta').addEventListener('click', () => {
    const msg = $('#fMsg');
    msg.value = `Me interesa un financiamiento de ${fmt(+amount.value)} a ${term.value} meses.`;
  });

  /* ---------- Servicio preseleccionado desde las tarjetas ---------- */
  const select = $('#fService');
  $$('[data-service]').forEach(a => a.addEventListener('click', () => {
    select.value = a.dataset.service;
    select.closest('.field').classList.remove('is-invalid');
  }));

  /* ---------- Formulario → WhatsApp ---------- */
  const form = $('#contactForm');
  const out = $('#formMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    ['#fName', '#fPhone', '#fService'].forEach(id => {
      const el = $(id);
      const valid = el.checkValidity() && el.value.trim() !== '';
      el.closest('.field').classList.toggle('is-invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) {
      out.textContent = 'Por favor completa los campos marcados.';
      out.className = 'form__msg is-error';
      return;
    }
    const d = Object.fromEntries(new FormData(form));
    const text = [
      'Hola Plenitud Financiera, quiero solicitar asesoría.',
      `*Nombre:* ${d.nombre}`,
      `*Teléfono:* ${d.telefono}`,
      d.correo ? `*Correo:* ${d.correo}` : '',
      `*Servicio:* ${d.servicio}`,
      d.mensaje ? `*Mensaje:* ${d.mensaje}` : ''
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    out.textContent = '¡Gracias! Te estamos redirigiendo a WhatsApp.';
    out.className = 'form__msg is-ok';
    form.reset();
  });
  $$('input, select', form).forEach(el => el.addEventListener('input', () => el.closest('.field').classList.remove('is-invalid')));

  /* ---------- Tooltip del botón flotante (una vez) ---------- */
  const fab = $('.fab-wa');
  setTimeout(() => { fab.classList.add('show-tip'); setTimeout(() => fab.classList.remove('show-tip'), 4000); }, 3500);

  /* ---------- Año del footer ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
