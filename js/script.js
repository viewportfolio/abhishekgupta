// ==========================================================================
// Abhishek Gupta — Portfolio interactions
// ==========================================================================

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------------------------------------------------------------------
   Nav: scrolled state + mobile toggle
--------------------------------------------------------------------- */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function onScroll(){
  nav.classList.toggle('scrolled', window.scrollY > 24);
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

/* ---------------------------------------------------------------------
   Cursor glow (desktop only)
--------------------------------------------------------------------- */
const glow = document.getElementById('cursorGlow');
window.addEventListener('pointermove', (e) => {
  glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if(e.touches.length > 0) {
    glow.style.transform = `translate(${e.touches[0].clientX}px, ${e.touches[0].clientY}px)`;
  }
}, { passive: true });

/* ---------------------------------------------------------------------
   Scroll reveal
--------------------------------------------------------------------- */
const revealTargets = document.querySelectorAll(
  '.section-eyebrow, .section-title, .about-text, .about-edu, .exp-card, .skill-card, .cert-row, .flow-step, .contact-card, .hero-copy, .hero-visual, .work-card'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealTargets.forEach(el => io.observe(el));

// Stagger experience cards / skill cards / contact cards / flow steps slightly
function stagger(selector, delayStep = 90){
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = `${i * delayStep}ms`;
  });
}
stagger('.work-card');
stagger('.exp-card');
stagger('.skill-card');
stagger('.contact-card');
stagger('.flow-step', 110);

/* ---------------------------------------------------------------------
   Hero background: generative "user-flow" wireframe diagram
   (SVG nodes + connecting paths, drifting gently — a nod to UX flow maps)
--------------------------------------------------------------------- */
(function buildHeroFlow(){
  const container = document.getElementById('heroFlow');
  if (!container) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 1200 800');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.style.width = '100%';
  svg.style.height = '100%';

  // Node positions loosely resembling a user-flow map
  const nodes = [
    { x: 120, y: 620 }, { x: 320, y: 520 }, { x: 300, y: 720 },
    { x: 560, y: 440 }, { x: 560, y: 660 }, { x: 820, y: 380 },
    { x: 840, y: 600 }, { x: 1080, y: 300 }, { x: 1060, y: 520 },
    { x: 940, y: 150 }
  ];
  const edges = [
    [0,1],[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,8],[5,8],[7,9]
  ];

  const gradId = 'flowGrad';
  const defs = document.createElementNS(svgNS, 'defs');
  const grad = document.createElementNS(svgNS, 'linearGradient');
  grad.setAttribute('id', gradId);
  grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '100%');
  grad.innerHTML = `
    <stop offset="0%" stop-color="#7c6cff" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="#35e6c3" stop-opacity="0.45"/>
  `;
  defs.appendChild(grad);
  svg.appendChild(defs);

  const edgeGroup = document.createElementNS(svgNS, 'g');
  edges.forEach(([a, b]) => {
    const n1 = nodes[a], n2 = nodes[b];
    const midX = (n1.x + n2.x) / 2;
    const midY = (n1.y + n2.y) / 2 - 40;
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', `M${n1.x},${n1.y} Q${midX},${midY} ${n2.x},${n2.y}`);
    path.setAttribute('stroke', `url(#${gradId})`);
    path.setAttribute('stroke-width', '1.4');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-dasharray', '5 7');
    edgeGroup.appendChild(path);
  });
  svg.appendChild(edgeGroup);

  const nodeGroup = document.createElementNS(svgNS, 'g');
  nodes.forEach((n, i) => {
    const isAccent = i % 3 === 0;
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', n.x);
    circle.setAttribute('cy', n.y);
    circle.setAttribute('r', isAccent ? 6 : 4);
    circle.setAttribute('fill', isAccent ? '#35e6c3' : '#7c6cff');
    circle.setAttribute('opacity', isAccent ? '0.85' : '0.55');
    circle.style.animation = `flowPulse ${4 + (i % 4)}s ease-in-out ${i * 0.3}s infinite`;
    nodeGroup.appendChild(circle);

    const ring = document.createElementNS(svgNS, 'circle');
    ring.setAttribute('cx', n.x);
    ring.setAttribute('cy', n.y);
    ring.setAttribute('r', isAccent ? 14 : 9);
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', isAccent ? '#35e6c3' : '#7c6cff');
    ring.setAttribute('stroke-width', '1');
    ring.setAttribute('opacity', '0.25');
    nodeGroup.appendChild(ring);
  });
  svg.appendChild(nodeGroup);

  container.appendChild(svg);

  // inject the pulse keyframes once
  const style = document.createElement('style');
  style.textContent = `
    @keyframes flowPulse {
      0%, 100% { opacity: 0.35; transform: scale(1); }
      50% { opacity: 0.9; transform: scale(1.25); }
    }
    #heroFlow svg g circle { transform-box: fill-box; transform-origin: center; }
  `;
  document.head.appendChild(style);
})();
