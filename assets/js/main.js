/* ---------- mobile nav ---------- */
const burger = document.querySelector('.burger');
const links = document.querySelector('nav.links');
if (burger) burger.addEventListener('click', () => links.classList.toggle('open'));
links && links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

/* ---------- nav shadow + blur intensify ---------- */
const nav = document.querySelector('header.nav');
addEventListener('scroll', () => {
  if (!nav) return;
  nav.style.boxShadow = scrollY > 20 ? '0 8px 30px rgba(0,0,0,.4)' : 'none';
  nav.classList.toggle('scrolled', scrollY > 20);
});

/* ---------- WOW: gold particle canvas on every cinematic hero ---------- */
(function(){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.hero, .page-hero.shot, .player-hero').forEach(host => {
    const canvas = document.createElement('canvas');
    canvas.className = 'heroFx';
    const anchor = host.querySelector('.wrap') || host.firstChild;
    host.insertBefore(canvas, anchor);
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    function resize(){
      w = canvas.width = host.offsetWidth;
      h = canvas.height = host.offsetHeight;
      const n = Math.min(60, Math.floor(w / 20));
      particles = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vy: -(Math.random() * 0.35 + 0.08),
        vx: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.5 + 0.15
      }));
    }
    resize();
    addEventListener('resize', resize);
    function tick(){
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#d4af37';
      for (const p of particles) {
        p.y += p.vy; p.x += p.vx;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        ctx.globalAlpha = p.a;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
})();

/* ---------- WOW: magnetic buttons ---------- */
if (matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.3;
      const y = (e.clientY - r.top - r.height / 2) * 0.3;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });
}

/* ---------- WOW: marquee speeds up with scroll velocity ---------- */
(function(){
  const track = document.querySelector('.marquee .track');
  if (!track) return;
  let lastY = scrollY, lastT = performance.now();
  addEventListener('scroll', () => {
    const now = performance.now();
    const dy = Math.abs(scrollY - lastY), dt = Math.max(now - lastT, 16);
    const v = dy / dt; // px/ms
    const speed = Math.max(6, 28 - v * 40);
    track.style.setProperty('--mqspeed', speed + 's');
    lastY = scrollY; lastT = now;
  }, { passive: true });
})();

/* ---------- scroll progress bar ---------- */
const bar = document.querySelector('.progress');
if (bar) addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (scrollY / h * 100) + '%';
});

/* ---------- curtain loader + page transitions ---------- */
(function(){
  const curtain = document.getElementById('curtain');
  const hide = () => curtain && curtain.classList.add('hide');
  addEventListener('load', () => setTimeout(hide, 420));
  addEventListener('pageshow', hide);          // back/forward cache
  setTimeout(hide, 2200);                        // failsafe: never trap the page
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || a.target === '_blank' || href.startsWith('#') ||
        href.startsWith('mailto') || /^https?:/i.test(href)) return;
    e.preventDefault();
    curtain && curtain.classList.remove('hide');
    setTimeout(() => { location.href = href; }, 520);
  });
})();

/* ---------- scroll-reveal (native scroll sweep — robust) ---------- */
document.documentElement.classList.add('js');
const revealSel = '.reveal,.reveal-l,.reveal-r,.reveal-sc,.clip,[data-stagger],.divider';
const revealEls = [...document.querySelectorAll(revealSel)];
function reveal(el){
  if (el.classList.contains('in')) return;
  el.classList.add('in');
  if (el.hasAttribute('data-stagger'))
    [...el.children].forEach((c, i) => { c.style.transitionDelay = (i * 0.08) + 's'; });
}
function sweepReveal(){
  const trigger = innerHeight * 0.9;
  for (const el of revealEls)
    if (!el.classList.contains('in') && el.getBoundingClientRect().top < trigger) reveal(el);
}
addEventListener('scroll', sweepReveal, { passive: true });
addEventListener('resize', sweepReveal);
sweepReveal();
// failsafe: nothing stays hidden even if a scroll event is missed
setTimeout(() => revealEls.forEach(reveal), 3000);

/* ---------- animated counters (scroll sweep) ---------- */
const counters = [...document.querySelectorAll('[data-count]')];
function runCounter(el){
  if (el.dataset.done) return; el.dataset.done = '1';
  const end = parseFloat(el.dataset.count), dur = 1400, suf = el.dataset.suffix || '', t0 = performance.now();
  const step = (t) => {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function sweepCounters(){
  for (const el of counters)
    if (!el.dataset.done && el.getBoundingClientRect().top < innerHeight * 0.85) runCounter(el);
}
addEventListener('scroll', sweepCounters, { passive: true });
sweepCounters();
setTimeout(() => counters.forEach(runCounter), 3200);

/* ---------- manifesto word-by-word highlight on scroll ---------- */
const manifesto = document.querySelector('.manifesto p.big');
if (manifesto) {
  const words = manifesto.querySelectorAll('.w');
  addEventListener('scroll', () => {
    const r = manifesto.getBoundingClientRect();
    const start = innerHeight * 0.85, end = innerHeight * 0.25;
    const prog = Math.min(Math.max((start - r.top) / (start - end), 0), 1);
    const lit = Math.floor(prog * words.length);
    words.forEach((w, i) => w.classList.toggle('lit', i < lit));
  });
}

/* ---------- cursor glow ---------- */
const glow = document.querySelector('.cursor-glow');
if (glow && matchMedia('(pointer:fine)').matches) {
  addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* ---------- card tilt ---------- */
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

/* ---------- contact form demo ---------- */
const form = document.querySelector('#contactForm');
if (form) form.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = document.querySelector('#formMsg');
  ok.textContent = 'Grazie! Messaggio inviato. Ti ricontatteremo a breve. (demo)';
  ok.style.color = 'var(--gold)';
  form.reset();
});

/* ---------- GSAP (progressive enhancement, loaded via CDN) ---------- */
window.addEventListener('load', () => {
  if (!window.gsap) {
    // fallback: no CDN — show hero words, no animation lib
    document.querySelectorAll('.hero .word i').forEach(i => i.style.transform = 'none');
    return;
  }
  const { gsap } = window;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  // Lenis smooth inertial scroll (fires native scroll → reveals keep working)
  if (window.Lenis) {
    const lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) lenis.on('scroll', window.ScrollTrigger.update);
  }

  // hero title words rise
  gsap.to('.hero .word i', { y: 0, duration: 1, stagger: 0.12, ease: 'power4.out', delay: 0.2 });
  gsap.from('.hero .badge,.hero p.lead,.hero .cta', { y: 24, opacity: 0, duration: 0.9, stagger: 0.12, delay: 0.7, ease: 'power3.out' });

  if (!window.ScrollTrigger) return;

  // hero parallax zoom
  gsap.to('.hero-bg img', { yPercent: 18, scale: 1.0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // generic parallax for [data-parallax]
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.to(el, { yPercent: parseFloat(el.dataset.parallax) || -14, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // champions giant word drift
  gsap.to('.champ .huge', { xPercent: -8, ease: 'none',
    scrollTrigger: { trigger: '.champ', start: 'top bottom', end: 'bottom top', scrub: true } });

  // fullbleed kicker slow scale for depth
  gsap.fromTo('.fullbleed .kicker', { scale: 0.96 }, { scale: 1.06, ease: 'none',
    scrollTrigger: { trigger: '.fullbleed', start: 'top bottom', end: 'bottom top', scrub: true } });

  // WOW: champions trophy grows + tilts into view on scroll
  if (document.querySelector('.champ .trophy')) {
    gsap.fromTo('.champ .trophy', { scale: 0.82, rotate: -3, opacity: 0.4 },
      { scale: 1, rotate: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: '.champ', start: 'top 85%', end: 'top 25%', scrub: true } });
  }

  // WOW: feature photos (squadra, palmares, contatti) grow into view on every page
  gsap.utils.toArray('.feature .ph.clip img').forEach(img => {
    gsap.fromTo(img, { scale: 1.22 }, { scale: 1.04, ease: 'none',
      scrollTrigger: { trigger: img, start: 'top 90%', end: 'top 20%', scrub: true } });
  });

  // WOW: player hero number pops in
  if (document.querySelector('.player-hero .pnum')) {
    gsap.from('.player-hero .pnum', { scale: 0.5, opacity: 0, duration: 1, ease: 'back.out(1.7)', delay: 0.3 });
    gsap.from('.player-hero .pinfo', { x: -20, opacity: 0, duration: 0.9, delay: 0.5, ease: 'power3.out' });
  }

  // WOW: page-hero.shot background zoom-out on load (cinematic settle)
  if (document.querySelector('.page-hero.shot .ph img')) {
    gsap.fromTo('.page-hero.shot .ph img', { scale: 1.25 }, { scale: 1.08, duration: 1.6, ease: 'power2.out' });
  }

  // WOW: hub cards rise with slight 3D on scroll
  gsap.utils.toArray('.hub-card').forEach((el, i) => {
    gsap.from(el, { y: 50, opacity: 0, rotateX: 8, duration: 0.9, delay: i * 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  // WOW: overview cards subtle parallax image drift
  gsap.utils.toArray('.ov-card img').forEach(img => {
    gsap.to(img, { yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
});
