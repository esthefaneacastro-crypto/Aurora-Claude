/* =========================================================
   AURORA DIGITAL — script.js
   Menu mobile, scroll suave, reveal animations, links de
   WhatsApp, galeria de "Soluções em destaque" e botão
   voltar ao topo.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- WhatsApp: número único usado em todo o site ---------- */
  // EDITAR: troque pelo número real (DDI 55 + DDD + número, só dígitos)
  const WHATSAPP_NUMBER = '5532999071294';

  document.querySelectorAll('.whatsapp-link').forEach(link => {
    const message = link.dataset.waMessage || 'Olá! Vim pelo site da Aurora Digital.';
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  });

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  function closeMenu() {
    mainNav.dataset.state = 'closed';
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  }

  function openMenu() {
    mainNav.dataset.state = 'open';
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fechar menu');
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.dataset.state === 'open';
      isOpen ? closeMenu() : openMenu();
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Header: link ativo conforme a seção visível ---------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = '#' + entry.target.id;
        const link = document.querySelector(`.nav-link[href="${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => navObserver.observe(section));
  }

  /* ---------- Animações discretas ao rolar a página ---------- */
  const revealEls = document.querySelectorAll('.reveal, .process-step');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Galeria "Soluções em destaque" (scroll horizontal) ---------- */
  const track = document.getElementById('showcase-track');
  const prevBtn = document.getElementById('showcase-prev');
  const nextBtn = document.getElementById('showcase-next');

  function scrollByCard(direction) {
    if (!track) return;
    const card = track.querySelector('.story-card');
    if (!card) return;
    const gap = 20;
    const distance = (card.getBoundingClientRect().width + gap) * direction;
    track.scrollBy({ left: distance, behavior: 'smooth' });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => scrollByCard(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollByCard(1));

  if (track) {
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') scrollByCard(1);
      if (e.key === 'ArrowLeft') scrollByCard(-1);
    });

    // Arrastar com o mouse no desktop
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('dragging');
      startX = e.pageX;
      scrollStart = track.scrollLeft;
    });
    window.addEventListener('mouseup', () => { isDown = false; track.classList.remove('dragging'); });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      track.scrollLeft = scrollStart - (e.pageX - startX);
    });
  }

  /* ---------- Botão "voltar ao topo" ---------- */
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 480) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Ano atual no rodapé ---------- */
  const anoAtual = document.getElementById('ano-atual');
  if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
  }

});
