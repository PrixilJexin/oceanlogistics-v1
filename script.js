/* ============================================================
   APEX COAL & ENERGY — Main JavaScript
   Ember Canvas · Nav Scroll · Counters · Scroll Reveal
   ============================================================ */

/* ── Utility: Clamp ────────────────────────────────────────── */
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

/* ══════════════════════════════════════════════════════════════
   1. NAV SCROLL BEHAVIOUR
══════════════════════════════════════════════════════════════ */
(function navScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ══════════════════════════════════════════════════════════════
   2. HERO VIDEO CAROUSEL (scene switcher) - REMOVED (Video BG active)
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   3. EMBER CANVAS ANIMATION
══════════════════════════════════════════════════════════════ */
(function emberCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* Particle class */
  class Ember {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 10;
      this.vx   = (Math.random() - 0.5) * 0.6;
      this.vy   = -(Math.random() * 1.2 + 0.4);
      this.life = 0;
      this.maxLife = Math.random() * 180 + 120;
      this.size = Math.random() * 2.2 + 0.4;
      /* colour: amber, orange, white-hot */
      const hue = Math.random() < 0.6 ? 28 + Math.random() * 20 : 45 + Math.random() * 10;
      this.hue  = hue;
      this.sat  = 80 + Math.random() * 20;
    }

    update() {
      this.life++;
      this.x  += this.vx + Math.sin(this.life * 0.04) * 0.3;
      this.y  += this.vy;
      this.vx *= 0.998;
      if (this.life >= this.maxLife || this.y < -10) this.reset();
    }

    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.75;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, ${this.sat}%, 70%, ${alpha})`;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, ${alpha * 0.6})`;
      ctx.shadowBlur  = 6;
      ctx.fill();
    }
  }

  /* Smoke / haze particle */
  class Haze {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 30;
      this.vx   = (Math.random() - 0.5) * 0.2;
      this.vy   = -(Math.random() * 0.35 + 0.1);
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      this.r    = Math.random() * 60 + 20;
    }

    update() {
      this.life++;
      this.x += this.vx;
      this.y += this.vy;
      this.r += 0.08;
      if (this.life >= this.maxLife || this.y < -this.r) this.reset();
    }

    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.04;
      const grad  = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      grad.addColorStop(0, `rgba(60,40,20,${alpha})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  /* Initialise */
  for (let i = 0; i < 120; i++) particles.push(new Ember());
  for (let i = 0; i < 20;  i++) particles.push(new Haze());

  /* Animation loop */
  function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.shadowBlur = 0;

    // Base glow removed to let video background shine through clearly

    particles.forEach(p => { p.update(); p.draw(); });

    requestAnimationFrame(loop);
  }
  loop();
})();

/* ══════════════════════════════════════════════════════════════
   4. SCROLL REVEAL (IntersectionObserver)
══════════════════════════════════════════════════════════════ */
(function scrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════════════════════════
   5. STAT COUNTERS
══════════════════════════════════════════════════════════════ */
(function statCounters() {
  const statSection = document.getElementById('stats');
  if (!statSection) return;

  let started = false;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const update = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      el.textContent = Math.round(easeOut(t) * target);
      if (t < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !started) {
        started = true;
        document.querySelectorAll('.stat-number').forEach(num => {
          const target = parseInt(num.dataset.target, 10);
          animateCounter(num, target);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  obs.observe(statSection);
})();

/* ══════════════════════════════════════════════════════════════
   6. SMOOTH ANCHOR SCROLL (corrects fixed nav offset)
══════════════════════════════════════════════════════════════ */
(function smoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ══════════════════════════════════════════════════════════════
   7. PRODUCT CARD HOVER TILT (subtle)
══════════════════════════════════════════════════════════════ */
(function cardTilt() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ══════════════════════════════════════════════════════════════
   8. TESTIMONIAL CARD PARALLAX GLOW
══════════════════════════════════════════════════════════════ */
(function testimonialGlow() {
  document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background =
        `radial-gradient(circle at ${x}% ${y}%, #161616, #111111 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();

/* ══════════════════════════════════════════════════════════════
   9. HAMBURGER MENU (Mobile)
   ══════════════════════════════════════════════════════════════ */
(function mobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
})();
