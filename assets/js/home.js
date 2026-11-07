(function(){
  'use strict';
  const el = document.getElementById('preloader');
  const counter = document.getElementById('plCounter');
  const bar = document.getElementById('plBar');
  const duration = 760;
  const start = performance.now();
  let frame, holdTimer, exitTimer, safetyTimer;
  window.__preloaderDone = false;
  function finish(){
    if (window.__preloaderDone) return;
    window.__preloaderDone = true;
    cancelAnimationFrame(frame);
    clearTimeout(holdTimer);
    clearTimeout(exitTimer);
    clearTimeout(safetyTimer);
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('keydown', finish);
    window.removeEventListener('pagehide', finish);
    el.removeEventListener('transitionend', onTransitionEnd);
    el.hidden = true;
    el.style.display = 'none';
    if (typeof window.__onPreloaderDone === 'function') window.__onPreloaderDone();
  }
  function onVisibility() { if (document.hidden) finish(); }
  function onTransitionEnd(event) {
    if (event.target === el && event.propertyName === 'opacity') finish();
  }
  function exit() {
    if (window.__preloaderDone) return;
    el.addEventListener('transitionend', onTransitionEnd);
    el.classList.add('exiting');
    exitTimer = setTimeout(finish, 280);
  }
  function tick(now) {
    if (window.__preloaderDone) return;
    const progress = Math.min(Math.max((now - start) / duration, 0), 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = String(progress === 1 ? 100 : Math.floor(eased * 100)).padStart(2, '0');
    if (counter.textContent !== value) counter.textContent = value;
    bar.style.transform = 'scaleX(' + eased + ')';
    if (progress < 1) frame = requestAnimationFrame(tick);
    else holdTimer = setTimeout(exit, 80);
  }
  // This is a brief brand intro, independent of network or asset loading.
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches || document.hidden) {
    finish();
    return;
  }
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('keydown', finish);
  window.addEventListener('pagehide', finish);
  safetyTimer = setTimeout(finish, 1600);
  frame = requestAnimationFrame(tick);
})();


(() => {
'use strict';
const isMobile = window.matchMedia('(max-width:768px), (hover:none), (pointer:coarse)').matches;
const noMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
const motionReady = !!(window.gsap && window.ScrollTrigger);
const lightMotion = isMobile || noMotion || !!navigator.connection?.saveData || !motionReady;
document.documentElement.classList.toggle('light-motion', lightMotion);
const lenis = Portfolio.createScroller({ lightMotion, options: { smoothWheel: true, wheelMultiplier: 1, lerp: 0.14 } });
const hamburger = document.getElementById('navHamburger');
const navLinks = document.getElementById('navLinks');
const navigation = navLinks.closest('nav');
function setNavigationOpen(open) {
  hamburger.classList.toggle('open', open);
  navLinks.classList.toggle('mobile-open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
  open ? lenis.stop() : lenis.start();
}
hamburger.addEventListener('click', () => setNavigationOpen(hamburger.getAttribute('aria-expanded') !== 'true'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNavigationOpen(false)));
document.querySelector('.nav-contact').addEventListener('click', () => setNavigationOpen(false));
navigation.addEventListener('focusout', event => {
  if (hamburger.getAttribute('aria-expanded') === 'true' && event.relatedTarget && !navigation.contains(event.relatedTarget)) setNavigationOpen(false);
});
document.addEventListener('pointerdown', event => {
  if (hamburger.getAttribute('aria-expanded') === 'true' && !navigation.contains(event.target)) setNavigationOpen(false);
});
const navigationViewport = window.matchMedia('(max-width:768px)');
navigationViewport.addEventListener('change', event => {
  if (!event.matches) setNavigationOpen(false);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
    hamburger.click();
    hamburger.focus();
  }
});
window.addEventListener('pageshow', event => {
  if (event.persisted) setNavigationOpen(false);
});
const archToggle = document.getElementById('archToggle');
const archDiagram = document.getElementById('archDiagram');
if (archToggle && archDiagram) {
  function setArchitectureOpen(open) {
    archDiagram.classList.toggle('open', open);
    archToggle.classList.toggle('open', open);
    archToggle.setAttribute('aria-expanded', String(open));
    archDiagram.setAttribute('aria-hidden', String(!open));
  }
  archToggle.addEventListener('click', () => {
    setArchitectureOpen(!archDiagram.classList.contains('open'));
  });
  document.querySelectorAll('a[href="#archDiagram"]').forEach(link => link.addEventListener('click', () => setArchitectureOpen(true)));
  function revealLinkedArchitecture() {
    if (window.location.hash === '#archDiagram') setArchitectureOpen(true);
  }
  window.addEventListener('hashchange', revealLinkedArchitecture);
  revealLinkedArchitecture();
}

initSectionRail();
initMarqueeControls();
initHeaderScroll();
initHeaderMedia();

function initHeaderMedia() {
  const slot = document.getElementById('headerMedia');
  const image = document.getElementById('headerMediaImage');
  if (!slot || !image) return;
  const preference = window.matchMedia('(prefers-reduced-motion:reduce)');
  let paused = preference.matches;
  function render() {
    const source = paused || document.hidden || document.documentElement.classList.contains('phone-welcome-open') ? image.dataset.poster : image.dataset.animation;
    if (image.getAttribute('src') !== source) image.setAttribute('src', source);
    const label = paused ? 'Play header animation' : 'Pause header animation';
    slot.setAttribute('aria-label', label);
    slot.setAttribute('title', label);
    slot.setAttribute('aria-pressed', String(paused));
    slot.querySelector('.header-media-icon').textContent = paused ? '▶' : 'Ⅱ';
  }
  slot.addEventListener('click', () => { paused = !paused; render(); });
  for (const event of ['contextmenu', 'dragstart', 'selectstart']) slot.addEventListener(event, event => event.preventDefault());
  document.addEventListener('visibilitychange', render);
  document.addEventListener('portfolio-welcome-close', render);
  window.addEventListener('pageshow', render);
  preference.addEventListener('change', event => { if (event.matches) paused = true; render(); });
  render();
}

function initHeaderScroll() {
  const header = document.querySelector('nav[aria-label="Primary navigation"]');
  const hero = document.getElementById('hero');
  if (!header || !hero) return;
  // Only switch at the hero boundary; no per-frame scroll measurements.
  const observer = new IntersectionObserver(([entry]) => {
    const pastHero = !entry.isIntersecting && entry.boundingClientRect.bottom <= (entry.rootBounds?.top ?? 96);
    header.classList.toggle('nav-scrolled', pastHero);
  }, { rootMargin: '-96px 0px 0px 0px', threshold: 0 });
  observer.observe(hero);
}

function initMarqueeControls() {
  const clients = document.getElementById('clients');
  const toggle = document.getElementById('marqueeToggle');
  if (!clients || !toggle) return;
  toggle.hidden = lightMotion;
  toggle.addEventListener('click', () => {
    const paused = clients.classList.toggle('clients-paused');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Resume animation' : 'Pause animation';
  });
}

if (!motionReady) {
  document.documentElement.classList.add('motion-fallback');
  return;
}
gsap.registerPlugin(ScrollTrigger);


function onPreloaderReady() {
  lenis.start();
  if (lightMotion) {
    initKineticHero();
    document.querySelectorAll('.marquee-row').forEach(row => {
      row.tabIndex = 0;
    });
    return;
  }
  initScanline();
  initHeroCanvas();
  initKineticHero();
  // Keep the full page stable instead of compositing a skewed scrolling layer.
  initRevealSystem();
  initDividers();
  initSignatureReveal();
  // Cards stay flat while the pointer moves.
  initCountUp();
  // Client rows retain a steady CSS animation instead of updating every frame.

  initFlagshipStamp();
}
if (window.__preloaderDone) { onPreloaderReady(); }
else { window.__onPreloaderDone = onPreloaderReady; }

function initScanline() {
  if (noMotion) return;
  const hero = document.getElementById('hero');
  const line = document.createElement('div');
  line.className = 'scanline';
  hero.appendChild(line);
  gsap.to(line, {
    top: '100%', duration: 0.72, ease: 'power1.inOut', delay: 0.05,
    onComplete: () => line.remove()
  });
}

function initKineticHero() {
  const name = document.getElementById('heroName');
  gsap.set(['.hero-eyebrow', '.hero-sub', '.hero-cta', '.hero-scroll-indicator'], { opacity: 1, y: 0 });
  if (!noMotion) gsap.fromTo(name, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, clearProps: 'transform,opacity' });
}
function initHeroCanvas() {
  if (isMobile || noMotion) return; // CSS hides #heroCanvas on mobile anyway — skip the GPU work
  const canvas = document.getElementById('heroCanvas');
  const hero = document.getElementById('hero');
  const gl = canvas.getContext('webgl2');
  if (!gl) return; // no WebGL2 — leave canvas empty, body background still shows

  // Flow Field: domain-warped noise shader. Desktop/high-end tier, chosen as
  // the production background. Fullscreen-triangle trick, no vertex buffers.
  const VERT = `#version 300 es
void main() {
  vec2 pos = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}`;
  const FRAG = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColorBg;
uniform vec3 uColorAccent;
uniform vec3 uColorHighlight;
out vec4 outColor;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = uv * 3.0;
  float t = uTime * 0.06;
  vec2 warp = vec2(fbm(p + t), fbm(p + vec2(1.7, 4.2) - t));
  float n = fbm(p + 3.0 * warp);
  vec3 color = mix(uColorBg, uColorAccent, smoothstep(0.2, 0.7, n) * 0.30);
  color = mix(color, uColorHighlight, smoothstep(0.75, 0.95, n) * 0.08);
  outColor = vec4(color, 1.0);
}`;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[heroCanvas] shader compile failed:', gl.getShaderInfoLog(s));
    }
    return s;
  }
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[heroCanvas] program link failed:', gl.getProgramInfoLog(program));
    return; // leave canvas empty rather than running with broken uniforms
  }
  gl.useProgram(program);

  function hexToRgb01(hex) {
    const v = hex.replace('#', '');
    return [parseInt(v.substring(0, 2), 16) / 255, parseInt(v.substring(2, 4), 16) / 255, parseInt(v.substring(4, 6), 16) / 255];
  }
  gl.uniform3fv(gl.getUniformLocation(program, 'uColorBg'), hexToRgb01('#080808'));
  gl.uniform3fv(gl.getUniformLocation(program, 'uColorAccent'), hexToRgb01('#f0a500'));
  gl.uniform3fv(gl.getUniformLocation(program, 'uColorHighlight'), hexToRgb01('#eaeaea'));
  const uResolution = gl.getUniformLocation(program, 'uResolution');
  const uTime = gl.getUniformLocation(program, 'uTime');

  // Slow ambient waves do not need a high-DPI framebuffer.
  const dprCap = Math.min(window.devicePixelRatio || 1, 1);
  function resize() {
    canvas.width = Math.round(hero.offsetWidth * dprCap);
    canvas.height = Math.round(hero.offsetHeight * dprCap);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const start = performance.now();
  const desktopViewport = window.matchMedia('(min-width:769px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const initialBounds = hero.getBoundingClientRect();
  let heroInView = initialBounds.bottom > 0 && initialBounds.top < window.innerHeight;
  let pageActive = true;
  let rafId = null;
  function shouldRender() {
    return pageActive && heroInView && !document.hidden && desktopViewport.matches && !reducedMotion.matches;
  }
  function draw() {
    rafId = null;
    if (!shouldRender()) return;
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uTime, (performance.now() - start) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    rafId = requestAnimationFrame(draw);
  }
  function syncRendering() {
    if (shouldRender()) {
      if (rafId === null) draw();
    } else if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      heroInView = entries.some(entry => entry.target === hero && entry.isIntersecting);
      syncRendering();
    });
    observer.observe(hero);
  } else {
    const updateBounds = () => {
      const bounds = hero.getBoundingClientRect();
      heroInView = bounds.bottom > 0 && bounds.top < window.innerHeight;
      syncRendering();
    };
    window.addEventListener('scroll', updateBounds, { passive: true });
    window.addEventListener('resize', updateBounds, { passive: true });
  }
  document.addEventListener('visibilitychange', syncRendering);
  desktopViewport.addEventListener('change', syncRendering);
  reducedMotion.addEventListener('change', syncRendering);
  window.addEventListener('pagehide', () => { pageActive = false; syncRendering(); });
  window.addEventListener('pageshow', () => { pageActive = true; syncRendering(); });
  syncRendering();
  setTimeout(() => canvas.classList.add('visible'), 600);
}

function initAmbientOrb() {
  if (noMotion) return;
  let tx = 50, ty = 40;
  let cx = 50, cy = 40;
  let cx2 = 62, cy2 = 58;
  const LERP = isMobile ? 0 : 0.006;
  const LERP2 = isMobile ? 0 : 0.0032;
  window.addEventListener('mousemove', e => {
    tx = (e.clientX / window.innerWidth) * 100;
    ty = (e.clientY / window.innerHeight) * 100;
  }, { passive: true });
  let drift = 0;
  function autonomousDrift() {
    drift += 0.0018;
    tx = 50 + Math.sin(drift) * 18;
    ty = 40 + Math.cos(drift * 0.7) * 12;
  }
  function loop() {
    if (isMobile) autonomousDrift();
    cx += (tx - cx) * (isMobile ? 0.004 : LERP);
    cy += (ty - cy) * (isMobile ? 0.004 : LERP);
    cx2 += (tx - cx2) * (isMobile ? 0.002 : LERP2);
    cy2 += (ty - cy2) * (isMobile ? 0.002 : LERP2);
    document.body.style.setProperty('--orb-x', cx.toFixed(2) + '%');
    document.body.style.setProperty('--orb-y', cy.toFixed(2) + '%');
    document.body.style.setProperty('--orb2-x', cx2.toFixed(2) + '%');
    document.body.style.setProperty('--orb2-y', cy2.toFixed(2) + '%');
    requestAnimationFrame(loop);
  }
  setTimeout(() => {
    document.body.classList.add('orb-ready');
    loop();
  }, 800);
}

function initHeroParallax() {
  if (isMobile || noMotion) return;
  const line1 = document.querySelector('.hero-line-1');
  const line2 = document.querySelector('.hero-line-2');
  const hero = document.getElementById('hero');
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(line1, { x: nx * 10, y: ny * 5, duration: 1.4, ease: 'power2.out' });
    gsap.to(line2, { x: nx * -8, y: ny * -4, duration: 1.6, ease: 'power2.out' });
  }, { passive: true });
  hero.addEventListener('mouseleave', () => {
    gsap.to([line1, line2], { x: 0, y: 0, duration: 1.8, ease: 'elastic.out(1,0.5)' });
  });
}

function initHeroScrollExit() {
  if (noMotion) return;
  const heroContent = document.querySelector('.hero-content');
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.4,
    onUpdate: self => {
      const p = self.progress;
      gsap.set(heroContent, {
        scale: 1 - p * 0.04,
        opacity: 1 - p * 0.55,
        filter: `blur(${p * 2.5}px)`,
        y: p * -18
      });
    }
  });
}

function initSkewOnScroll() {
  if (noMotion) return;
  let targetSkew = 0, currentSkew = 0;
  let lastVelocity = 0;
  const MAX_SKEW = 1.8;
  lenis.on('scroll', ({ velocity }) => {
    targetSkew = Math.max(-MAX_SKEW, Math.min(MAX_SKEW, velocity * 0.012));
    lastVelocity = Math.abs(velocity);
    const grainBase = 0.022;
    const grainBoost = Math.min(lastVelocity * 0.0008, 0.018);
    document.body.style.setProperty('--grain-opacity', (grainBase + grainBoost).toFixed(4));
  });
  gsap.ticker.add(() => {
    currentSkew += (targetSkew - currentSkew) * 0.1;
    if (Math.abs(currentSkew) > 0.001) {
      gsap.set('#skewWrap', { skewY: currentSkew });
    }
  });
}

function initMagneticButtons() {
  if (isMobile || noMotion) return;
  document.querySelectorAll('.magnetic, .btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.38;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.38;
      gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1,0.45)' });
    });
  });
}

function initRevealSystem() {
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 91%', toggleActions: 'play none none none' }
      }
    );
  });
}

function wrapWordsInNode(node) {
  Array.from(node.childNodes).forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      if (!child.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach(part => {
        if (part === '') return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const span = document.createElement('span');
        span.className = 'bw-word';
        span.textContent = part;
        frag.appendChild(span);
      });
      node.replaceChild(frag, child);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      wrapWordsInNode(child);
    }
  });
}

function initBlurTextReveal() {
  const targets = document.querySelectorAll('.blur-words');
  if (!targets.length) return;
  targets.forEach(el => wrapWordsInNode(el));
  if (noMotion) {
    document.querySelectorAll('.bw-word').forEach(w => {
      w.style.filter = 'none'; w.style.opacity = '1'; w.style.transform = 'none';
    });
    return;
  }
  targets.forEach(el => {
    const words = el.querySelectorAll('.bw-word');
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', toggleActions: 'play none none none',
      onEnter: () => {
        gsap.to(words, {
          filter: 'blur(0px)', opacity: 1, y: 0,
          duration: 0.6, ease: 'power3.out', stagger: 0.018
        });
      }
    });
  });
}

function initTypographyMorph() {
  if (noMotion) return;
  document.querySelectorAll('.section-title').forEach(title => {
    ScrollTrigger.create({
      trigger: title,
      start: 'top 85%',
      onEnter: () => title.classList.add('weight-resolved'),
      onLeaveBack: () => title.classList.remove('weight-resolved')
    });
  });
}

function initEvidenceReveals() {
  if (noMotion) {
    document.querySelectorAll('.evidence-card').forEach(el => {
      el.style.clipPath = 'none'; el.style.opacity = '1';
    });
    return;
  }
  document.querySelectorAll('.evidence-card').forEach((card, i) => {
    const fromLeft = i % 2 === 0;
    if (!fromLeft) card.classList.add('rev-right');
    ScrollTrigger.create({
      trigger: card,
      start: 'top 88%',
      onEnter: () => {
        gsap.to(card, {
          clipPath: 'inset(0 0% 0 0% round 16px)',
          duration: 0.78,
          delay: (i % 2) * 0.07,
          ease: 'power4.out',
          onStart() { card.style.opacity = '1'; }
        });
      }
    });
  });
}

function initFlagshipStamp() {
  const slot = document.querySelector('.project-status');
  if (!slot) return;
  const wrap = document.createElement('div');
  wrap.className = 'stamp';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML =
    '<div class="stamp-pulse"></div>' +
    '<svg viewBox="0 0 120 120" class="stamp-svg">' +
      '<defs><path id="stampArcFlagship" d="M 18,64 A 42,42 0 0 1 102,64"/></defs>' +
      '<circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<circle cx="60" cy="60" r="43" fill="none" stroke="currentColor" stroke-width="1"/>' +
      '<text font-size="8.5" letter-spacing="3" fill="currentColor"><textPath href="#stampArcFlagship" startOffset="50%" text-anchor="middle">ON RECORD</textPath></text>' +
      '<g transform="translate(60,53)" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
        '<line x1="-7" y1="-5" x2="7" y2="-5"/><line x1="0" y1="-5" x2="0" y2="10"/><line x1="-7" y1="10" x2="7" y2="10"/>' +
      '</g>' +
      '<text x="60" y="88" font-size="7" text-anchor="middle" letter-spacing="1" fill="currentColor">CASE NO. 2026-01</text>' +
    '</svg>';
  slot.insertBefore(wrap, slot.firstChild);
  const pulse = wrap.querySelector('.stamp-pulse');

  const REST_ROT = -5;
  wrap.style.pointerEvents = 'auto';
  wrap.addEventListener('mouseenter', () => {
    if (noMotion) return;
    gsap.to(wrap, {
      rotate: REST_ROT - 6, duration: 0.14, ease: 'power2.out',
      onComplete: () => gsap.to(wrap, { rotate: REST_ROT, duration: 0.55, ease: 'elastic.out(1, 0.4)' })
    });
  });

  if (noMotion) {
    gsap.set(wrap, { opacity: 0.86, rotate: REST_ROT, scale: 1 });
    return;
  }
  gsap.set(wrap, { opacity: 0, rotate: REST_ROT + 16, scale: 1.6, transformOrigin: '50% 50%' });
  const card = document.getElementById('flagshipCard');
  ScrollTrigger.create({
    trigger: card,
    start: 'top 80%',
    onEnter: () => {
      gsap.to(wrap, { opacity: 0.86, rotate: REST_ROT, scale: 1, duration: 0.45, delay: 0.6, ease: 'back.out(2.4)' });
      gsap.fromTo(pulse,
        { opacity: 0.4, scale: 0.3 },
        { opacity: 0, scale: 2, duration: 0.7, delay: 0.62, ease: 'power2.out' }
      );
    }
  });
}

function initSignatureReveal() {
  if (noMotion) return;
  const card = document.getElementById('flagshipCard');
  const line = document.getElementById('cinemaLine');
  if (!card || !line) return;
  gsap.set(card, {
    rotateX: isMobile ? 0 : 14,
    scale: isMobile ? 1 : 0.93,
    filter: isMobile ? 'none' : 'blur(5px)',
    opacity: 0,
    transformOrigin: 'center top'
  });
  ScrollTrigger.create({
    trigger: '#projects',
    start: 'top 72%',
    onEnter: () => {
      line.classList.add('drawn');
      setTimeout(() => {
        gsap.to(card, {
          rotateX: 0,
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          duration: isMobile ? 0.5 : 1.15,
          ease: 'power4.out',
          onComplete: () => {
            card.classList.add('sweep');
            setTimeout(() => card.classList.remove('sweep'), 1000);
          }
        });
      }, isMobile ? 100 : 280);
    }
  });
}

function initDividers() {
  document.querySelectorAll('.divider').forEach(div => {
    gsap.to(div, {
      scaleX: 1, opacity: 1, duration: 1.1, ease: 'power4.out',
      scrollTrigger: { trigger: div, start: 'top 96%', toggleActions: 'play none none none' }
    });
  });
}

function initCountUp() {
  if (noMotion) return;
  document.querySelectorAll('.stat-num').forEach(el => {
    const match = el.textContent.trim().match(/^(\d+)(\D*)$/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2] || '';
    const counter = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target, duration: 1.15, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(counter.val) + suffix; }
        });
      }
    });
  });
}

function initMarqueeVelocity() {
  if (noMotion) return;
  const tracks = document.querySelectorAll('.marquee-track');
  if (!tracks.length) return;
  let rate = 1;
  lenis.on('scroll', ({ velocity }) => {
    const boosted = 1 + Math.min(Math.abs(velocity) * 0.06, 3.5);
    rate = Math.max(rate, boosted);
  });
  gsap.ticker.add(() => {
    rate += (1 - rate) * 0.03;
    tracks.forEach(t => {
      const anim = t.getAnimations && t.getAnimations()[0];
      if (anim) anim.playbackRate = rate;
    });
  });
}

function initGhostParallax() {
  if (noMotion || isMobile) return;
  document.querySelectorAll('.section-ghost-num').forEach(el => {
    gsap.to(el, {
      y: -40, ease: 'none',
      scrollTrigger: {
        trigger: el.closest('.section-title-wrap'),
        start: 'top bottom', end: 'bottom top', scrub: 1
      }
    });
  });
}

function initSectionRail() {
  const rail = document.getElementById('sectionRail');
  if (!rail) return;
  const sections = Array.from(rail.querySelectorAll('.rail-dot'), dot => ({
    dot, target: document.querySelector(dot.dataset.target)
  })).filter(section => section.target);
  const links = Array.from(document.querySelectorAll('nav[aria-label="Primary navigation"] a[href^="#"]'));
  let activeTarget;
  let queued = false;
  function update() {
    queued = false;
    // Use the rendered page, including smooth-scroll movement and layout changes.
    // Read all bounds before changing classes, and keep the previous section in gaps.
    const positions = sections.map(section => ({ ...section, top: section.target.getBoundingClientRect().top }));
    let current = positions[0];
    for (const section of positions) {
      if (section.top > 112) break;
      current = section;
    }
    // A short final section cannot always reach the reading line before scrolling ends.
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = positions[positions.length - 1];
    }
    if (!current || current.target === activeTarget) return;
    activeTarget = current.target;
    sections.forEach(({ dot, target }) => {
      const active = target === activeTarget;
      dot.classList.toggle('active', active);
      if (active) dot.setAttribute('aria-current', 'location');
      else dot.removeAttribute('aria-current');
    });
    links.forEach(link => {
      if (link.getAttribute('href') === '#' + activeTarget.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleUpdate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }
  sections.forEach(({ dot, target }) => {
    dot.addEventListener('click', () => {
      // A numeric destination avoids Lenis adding CSS scroll-padding a second time.
      const top = target.getBoundingClientRect().top + window.scrollY;
      lenis.scrollTo(top, { offset: -96, duration: 1.1 });
    });
  });
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);
  new ResizeObserver(scheduleUpdate).observe(document.body);
  document.fonts?.ready.then(scheduleUpdate);
  update();
}





})();
