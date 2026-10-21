const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

// Scroll reveals, with a graceful fallback for browsers without IntersectionObserver.
const revealItems = $$('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// Mobile navigation.
const menuToggle = $('.menu-toggle');
const navLinks = $('.nav-links');
menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
$$('.nav-links a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

// Cursor light is intentionally subtle and disabled on touch devices.
const cursorGlow = $('.cursor-glow');
if (cursorGlow && matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', event => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

// Threat dossier is real interactive UI, not a static visual.
const threats = {
  stalker: {
    code: 'V-01', name: 'THE STALKER', status: 'HOSTILE / ACTIVE',
    description: 'A once-human predator that follows sound rather than sight. It circles the edges of your light, learning the rhythm of your movement before it strikes.',
    level: 'SEVERE', sense: 'SOUND', advice: 'DO NOT RUN', shape: 'stalker-shape',
    bg: 'radial-gradient(ellipse at 50% 48%, #30221f 0%, #151713 42%, #090c0a 76%)'
  },
  bloom: {
    code: 'V-02', name: 'THE BLOOM', status: 'HOSTILE / TERRITORIAL',
    description: 'A fungal mass that has learned to move through living hosts. Its spores gather in low places. The beautiful glow is not a warning light — it is bait.',
    level: 'CRITICAL', sense: 'AIRBORNE SPORES', advice: 'MASK UP / DETOUR', shape: 'bloom-shape',
    bg: 'radial-gradient(ellipse at 50% 48%, #263b2b 0%, #151713 42%, #090c0a 76%)'
  },
  zero: {
    code: 'V-00', name: 'SUBJECT ZERO', status: 'UNKNOWN / UNCONTAINED',
    description: 'The first successful trial. The last recorded containment report is redacted. No two witnesses describe the same silhouette, but every recording contains the same low-frequency signal.',
    level: 'UNCLASSIFIED', sense: 'UNKNOWN', advice: 'DO NOT ENGAGE', shape: 'zero-shape',
    bg: 'radial-gradient(ellipse at 50% 48%, #3b1b19 0%, #151713 42%, #090c0a 76%)'
  }
};
const threatImage = $('#threatImage');
$$('.threat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const data = threats[tab.dataset.threat];
    if (!data) return;
    $$('.threat-tab').forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    $('#threatStatus').textContent = data.status;
    $('#threatName').textContent = data.name;
    $('#threatDescription').textContent = data.description;
    $('#threatLevel').textContent = data.level;
    $('#threatSense').textContent = data.sense;
    $('#threatAdvice').textContent = data.advice;
    $('.threat-number').textContent = data.code;
    threatImage.style.background = data.bg;
    const shape = $('.threat-shape');
    shape.className = `threat-shape ${data.shape}`;
  });
});

// Distinct silhouette variations for each dossier.
const dynamicThreatStyles = document.createElement('style');
dynamicThreatStyles.textContent = `
.bloom-shape{width:245px;height:255px!important;clip-path:polygon(50% 0,61% 22%,88% 12%,77% 38%,100% 51%,73% 61%,86% 92%,57% 77%,44% 100%,35% 73%,7% 88%,22% 58%,0 45%,28% 35%,15% 9%,42% 22%)!important;background:linear-gradient(90deg,#0a100a,#61754c 45%,#1a261a 75%,#080b09)!important}
.zero-shape{width:230px;height:330px!important;clip-path:polygon(44% 0,61% 4%,75% 20%,70% 37%,91% 49%,83% 57%,100% 85%,71% 73%,68% 100%,29% 100%,32% 70%,4% 88%,22% 54%,35% 39%,29% 20%)!important;background:linear-gradient(90deg,#080b09,#3c2422 43%,#101310 72%,#080b09)!important;filter:drop-shadow(0 0 22px rgba(223,64,47,.35))!important}
`;
document.head.appendChild(dynamicThreatStyles);

// Light parallax on the hero image; keep it tiny to avoid motion sickness.
const hero = $('.hero');
const heroImage = $('.hero-image');
if (hero && heroImage && matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  hero.addEventListener('pointermove', event => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    heroImage.style.transform = `scale(1.08) translate(${x * -8}px, ${y * -5}px)`;
  });
  hero.addEventListener('pointerleave', () => heroImage.style.transform = '');
}
