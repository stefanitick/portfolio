/* ============================================
   STEFANI PORTFOLIO v2 — APP JS
   Cursor · Scroll reveal · Nav · Filters ·
   Project Modal · Lightbox · Gallery
   ============================================ */

// ── CUSTOM CURSOR ──
const cur = document.getElementById('cur');
const ring = document.getElementById('ring');
let mx = 0, my = 0, cx = 0, cy = 0;

if (cur && ring) {
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function loop() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
    if (ring) { ring.style.left = cx + 'px'; ring.style.top = cy + 'px'; }
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .sel-card, .wid-card, .gallery-item, .proj-card-header, .scope-item, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', () => ring && ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring && ring.classList.remove('hovered'));
  });
}

// ── SCROLL REVEAL ──
const revEls = document.querySelectorAll('.rev, .rev-left');
if (revEls.length > 0) {
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  revEls.forEach(el => revObs.observe(el));
}

// ── VISIBILITY FALLBACK ──
setTimeout(() => {
  document.querySelectorAll('.rev, .rev-left').forEach(el => {
    if (!el.classList.contains('vis')) {
      el.classList.add('vis');
    }
  });
}, 1500);

// ── NAV SCROLL STATE ──
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ── MOBILE MENU ──
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ── IMAGE FADE IN ──
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.6s';
  if (img.complete) {
    img.style.opacity = '1';
  } else {
    img.addEventListener('load', () => { img.style.opacity = '1'; });
    img.addEventListener('error', () => { img.style.opacity = '1'; });
  }
});

// ── FILTERS (Work page) ──
const filterBtns = document.querySelectorAll('.proj-filter');
if (filterBtns.length > 0) {
  const allItems = document.querySelectorAll('[data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      allItems.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s';
            item.style.opacity = '1';
          });
        } else {
          item.style.opacity = '0';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

// ── PROJECT MODAL ──
const projModal = document.getElementById('projModal');
const projModalInner = document.getElementById('projModalInner');
const projModalContent = document.getElementById('projModalContent');
const projModalClose = document.getElementById('projModalClose');

function openProjectModal(card) {
  if (!projModal || !projModalContent) return;

  // Get card data
  const imgEl = card.querySelector('.proj-card-img img');
  const cat = card.querySelector('.proj-card-cat');
  const title = card.querySelector('.proj-card-meta h3');
  const summary = card.querySelector('.proj-card-meta > p');
  const body = card.querySelector('.proj-card-body-inner');

  let html = '';

  // Image
  if (imgEl) {
    html += `<img class="proj-modal-img" src="${imgEl.src}" alt="${imgEl.alt}">`;
  }

  // Body
  html += '<div class="proj-modal-body">';
  if (cat) html += `<span class="proj-card-cat">${cat.innerHTML}</span>`;
  if (title) html += `<h3>${title.textContent}</h3>`;
  if (summary) html += `<p class="proj-modal-summary">${summary.textContent}</p>`;
  if (body) html += body.innerHTML;
  html += '</div>';

  projModalContent.innerHTML = html;
  projModal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Bind video links inside modal
  projModalContent.querySelectorAll('.proj-video-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const videoSrc = link.dataset.video;
      if (videoSrc) {
        openLightbox(`<video src="${videoSrc}" controls autoplay></video>`);
      }
    });
  });
}

function closeProjectModal() {
  if (!projModal) return;
  projModal.classList.remove('open');
  document.body.style.overflow = '';
}

if (projModalClose) projModalClose.addEventListener('click', closeProjectModal);
if (projModal) projModal.addEventListener('click', e => {
  if (e.target === projModal) closeProjectModal();
});

// Click card header to open modal
document.querySelectorAll('.proj-card-header').forEach(header => {
  header.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    const card = header.closest('.proj-card');
    openProjectModal(card);
  });
});

// ── LIGHTBOX (Gallery + Videos) ──
const lightbox = document.getElementById('lightbox');
const lbContent = document.getElementById('lbContent');
const lbClose = document.getElementById('lbClose');

function openLightbox(content) {
  if (!lightbox || !lbContent) return;
  lbContent.innerHTML = content;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  const vid = lbContent && lbContent.querySelector('video');
  if (vid) vid.pause();
}

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lightbox) lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (lightbox && lightbox.classList.contains('open')) {
      closeLightbox();
    } else {
      closeProjectModal();
    }
  }
});

// Gallery image items
document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
  item.addEventListener('click', () => {
    openLightbox(`<img src="${item.dataset.src}" alt="">`);
  });
});

// Gallery video items
document.querySelectorAll('.gallery-item[data-video]').forEach(item => {
  item.addEventListener('click', () => {
    openLightbox(`<video src="${item.dataset.video}" controls autoplay></video>`);
  });
});

// ── SMOOTH SCROLL TO HASH ──
if (window.location.hash) {
  setTimeout(() => {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // If it's a card, open its modal
      if (target.classList.contains('proj-card')) {
        openProjectModal(target);
      }
    }
  }, 300);
}
