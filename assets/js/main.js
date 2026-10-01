/* ---------- mobile nav ---------- */
const burger = document.querySelector('.burger');
const links = document.querySelector('nav.links');
if (burger) burger.addEventListener('click', () => links.classList.toggle('open'));
links && links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

/* ---------- nav shadow ---------- */
const nav = document.querySelector('header.nav');
addEventListener('scroll', () => {
  if (nav) nav.style.boxShadow = scrollY > 20 ? '0 8px 30px rgba(0,0,0,.4)' : 'none';
});

/* ---------- scroll progress bar ---------- */
const bar = document.querySelector('.progress');
if (bar) addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (scrollY / h * 100) + '%';
});

/* ---------- IntersectionObserver reveals (works without GSAP) ---------- */
const revealSel = '.reveal,.reveal-l,.reveal-r,.reveal-sc,.clip,[data-stagger],.divider';
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('in');
    // stagger children
    if (el.hasAttribute('data-stagger')) {
      [...el.children].forEach((c, i) => { c.style.transitionDelay = (i * 0.08) + 's'; });
    }
    io.unobserve(el);
  });
}, { threshold: 0.14 });
document.querySelectorAll(revealSel).forEach(el => io.observe(el));

/* ---------- animated counters ---------- */
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = parseFloat(el.dataset.count), dur = 1400;
    const suf = el.dataset.suffix || '', t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    cio.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => cio.observe(c));

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
});
