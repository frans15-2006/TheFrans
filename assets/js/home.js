(function(){
  'use strict';
  var el=document.getElementById('preloader');
  var ctr=document.getElementById('plCounter');
  var bar=document.getElementById('plBar');
  var DURATION=420,start=null;
  window.__preloaderDone=false;
  function pad(n){return n<10?'0'+n:''+n}
  function tick(ts){
    if(!start)start=ts;
    var p=Math.min((ts-start)/DURATION,1);
    var e=1-Math.pow(1-p,3);
    ctr.textContent=pad(Math.round(e*100));
    bar.style.width=(e*100)+'%';
    if(p<1){requestAnimationFrame(tick);}
    else{ctr.textContent='100';bar.style.width='100%';setTimeout(exit,100);}
  }
  function finish(){
    if(window.__preloaderDone)return;
    el.style.display='none';
    window.__preloaderDone=true;
    if(typeof window.__onPreloaderDone==='function')window.__onPreloaderDone();
  }
  function exit(){
    el.classList.add('exiting');
    el.addEventListener('transitionend',finish,{once:true});
    setTimeout(finish,650);
  }
  setTimeout(finish, 1400);
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) finish();
  else requestAnimationFrame(tick);
})();


(() => {
'use strict';
const isMobile = window.matchMedia('(max-width:768px), (hover:none), (pointer:coarse)').matches;
const noMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
const motionReady = !!(window.gsap && window.ScrollTrigger);
const lightMotion = isMobile || noMotion || !!navigator.connection?.saveData || !motionReady;
document.documentElement.classList.toggle('light-motion', lightMotion);
const lenis = Portfolio.createScroller({ lightMotion, options: { duration: 1.05, wheelMultiplier: 0.82, lerp: 0.075 } });
const hamburger = document.getElementById('navHamburger');
const navLinks = document.getElementById('navLinks');
function setNavigationOpen(open) {
  hamburger.classList.toggle('open', open);
  navLinks.classList.toggle('mobile-open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
  open ? lenis.stop() : lenis.start();
}
hamburger.addEventListener('click', () => setNavigationOpen(hamburger.getAttribute('aria-expanded') !== 'true'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNavigationOpen(false)));
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
  archToggle.addEventListener('click', () => {
    const open = archDiagram.classList.toggle('open');
    archToggle.classList.toggle('open', open);
    archToggle.setAttribute('aria-expanded', open);
    archDiagram.setAttribute('aria-hidden', String(!open));
  });
}

initSectionRail();
initMarqueeControls();

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
  initHeroParallax();
  initAmbientOrb();
  initSkewOnScroll();
  initMagneticButtons();
  initRevealSystem();
  initBlurTextReveal();
  initEvidenceReveals();
  initDividers();
  initTypographyMorph();
  initSignatureReveal();
  initCardTilt();
  initHeroScrollExit();
  initCountUp();
  initMarqueeVelocity();
  initGhostParallax();

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
  const el = document.getElementById('heroName');
  const line1El = el.querySelector('.hero-line-1');
  const line2El = el.querySelector('.hero-line-2');
  const coordsText = document.getElementById('heroCoordsText');
  if (lightMotion) {
    const elements = ['.hero-eyebrow', '.hero-sub', '.hero-cta', '.hero-scroll-indicator'];
    gsap.set(elements, { opacity: 1, y: 0 });
    if (!noMotion) gsap.fromTo([line1El, line2El], { y: 8 }, {
      y: 0, duration: 0.45, stagger: 0.08, clearProps: 'transform'
    });
    return;
  }

  function wrapChars(container, text, lineNum) {
    container.textContent = '';
    const spans = [];
    [...text].forEach(ch => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      s.dataset.ln = lineNum;
      container.appendChild(s);
      spans.push(s);
    });
    return spans;
  }
  const chars1 = wrapChars(line1El, 'Francis', 1);
  const chars2 = wrapChars(line2El, 'Tarectican', 2);
  const allChars = chars1.concat(chars2);
  const cascade = ['.hero-eyebrow', '.hero-sub', '.hero-cta', '.hero-scroll-indicator', '.hero-coords'];

  if (noMotion) {
    cascade.forEach(sel => gsap.set(sel, { opacity: 1, y: 0 }));
    return;
  }

  const STAGGER = isMobile ? 22 : 28;
  allChars.forEach(s => {
    s.style.setProperty('--bl', '6px');
    s.style.setProperty('--op', '0');
    s.style.setProperty('--ty', '8px');
    s.style.setProperty('--w', s.dataset.ln === '2' ? '560' : '260');
    s.style.setProperty('--o', '14');
  });
  const totalDelay = allChars.length * STAGGER + 260;
  allChars.forEach((s, i) => {
    setTimeout(() => {
      s.style.transition = 'filter .5s var(--easing-premium), opacity .5s var(--easing-premium), transform .5s var(--easing-premium)';
      s.style.setProperty('--bl', '0px');
      s.style.setProperty('--op', '1');
      s.style.setProperty('--ty', '0px');
    }, i * STAGGER);
  });

  cascade.forEach((sel, i) => {
    setTimeout(() => {
      gsap.to(sel, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    }, totalDelay * 0.55 + i * 130);
  });

  if (isMobile) return;

  let centers = [];
  function measure() {
    const r = el.getBoundingClientRect();
    centers = allChars.map(s => {
      const cr = s.getBoundingClientRect();
      return cr.left - r.left + cr.width / 2;
    });
  }
  setTimeout(measure, totalDelay + 550);
  window.addEventListener('resize', measure, { passive: true });

  const hero = document.getElementById('hero');
  let targetX = null, smoothX = null;
  const MAXDIST = 260;
  hero.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    targetX = e.clientX - r.left;
  }, { passive: true });
  hero.addEventListener('mouseleave', () => { targetX = null; });

  function tick() {
    smoothX = targetX === null ? null : (smoothX === null ? targetX : smoothX + (targetX - smoothX) * 0.16);
    if (coordsText) {
      coordsText.textContent = targetX !== null
        ? 'X ' + String(Math.max(0, Math.round(targetX))).padStart(3, '0') + ' \u00b7 tracking'
        : 'X 000 \u00b7 resting';
    }
    allChars.forEach((s, i) => {
      const isLine2 = s.dataset.ln === '2';
      const farW = isLine2 ? 560 : 260;
      const nearW = isLine2 ? 850 : 780;
      const t = smoothX === null ? 1 : Math.min(Math.abs(smoothX - (centers[i] || 0)) / MAXDIST, 1);
      s.style.setProperty('--w', Math.round(nearW - t * (nearW - farW)));
      s.style.setProperty('--o', (96 - t * (96 - (isLine2 ? 26 : 12))).toFixed(0));
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
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
uniform vec2 uMouseVel;
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
  vec2 turbulence = uMouseVel * 0.02;
  float n = fbm(p + 3.0 * warp + turbulence);
  vec3 color = mix(uColorBg, uColorAccent, smoothstep(0.2, 0.7, n) * 0.46);
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
  const uMouseVel = gl.getUniformLocation(program, 'uMouseVel');

  const dprCap = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    canvas.width = Math.round(hero.offsetWidth * dprCap);
    canvas.height = Math.round(hero.offsetHeight * dprCap);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let lastX = null, lastY = null, vx = 0, vy = 0;
  hero.addEventListener('mousemove', e => {
    if (lastX !== null) { vx = e.clientX - lastX; vy = e.clientY - lastY; }
    lastX = e.clientX; lastY = e.clientY;
  }, { passive: true });

  const start = performance.now();
  const desktopViewport = window.matchMedia('(min-width:769px)');
  const initialBounds = hero.getBoundingClientRect();
  let heroInView = initialBounds.bottom > 0 && initialBounds.top < window.innerHeight;
  let pageActive = true;
  let rafId = null;
  function shouldRender() {
    return pageActive && heroInView && !document.hidden && desktopViewport.matches;
  }
  function draw() {
    rafId = null;
    if (!shouldRender()) return;
    vx *= 0.9; vy *= 0.9;
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uTime, (performance.now() - start) / 1000);
    gl.uniform2f(uMouseVel, vx, vy);
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

function initCardTilt() {
  if (isMobile || noMotion) return;
  const MAX_TILT = 4;
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      gsap.to(card, {
        rotateX: -ny * MAX_TILT,
        rotateY: nx * MAX_TILT,
        duration: 0.35,
        ease: 'power2.out',
        transformPerspective: 900
      });
    }, { passive: true });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        transformPerspective: 900
      });
    });
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
  const dots = Array.from(rail.querySelectorAll('.rail-dot'));
  function setActive(activeDot) {
    dots.forEach(d => { d.classList.toggle('active', d === activeDot); d.setAttribute('aria-current', d === activeDot ? 'location' : 'false'); });
  }
  dots.forEach(dot => {
    const target = document.querySelector(dot.dataset.target);
    if (!target) return;
    dot.addEventListener('click', () => {
      lenis.scrollTo(target, { offset: -60, duration: 1.1 });
    });
    if (motionReady && !lightMotion) ScrollTrigger.create({
      trigger: target,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActive(dot),
      onEnterBack: () => setActive(dot)
    });
  });
}

(function() {
  const isDesktop = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const dot = document.getElementById('curDot');
  const ring = document.getElementById('curRing');
  const label = document.getElementById('curLabel');
  if (!isDesktop || lightMotion) {
    [dot, ring, label].forEach(el => el && (el.style.display = 'none'));
    return;
  }
  document.documentElement.classList.add('custom-cursor');
  let mx = -300, my = -300, rx = -300, ry = -300, rafId = null;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  function loop() {
    dot.style.transform = `translate3d(calc(${mx}px - 50%),calc(${my}px - 50%),0)`;
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.transform = `translate3d(calc(${rx}px - 50%),calc(${ry}px - 50%),0)`;
    label.style.transform = `translate3d(calc(${rx}px + 14px),calc(${ry}px - 10px),0)`;
    rafId = requestAnimationFrame(loop);
  }
  loop();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(rafId); rafId = null; }
    else if (!rafId) loop();
  });
  document.addEventListener('mousedown', () => document.documentElement.classList.add('cursor-click'));
  document.addEventListener('mouseup', () => document.documentElement.classList.remove('cursor-click'));
  const hoverMap = [
    { sel: '.stamp', text: 'VERIFIED' },
    { sel: '.project-card', text: 'VIEW' },
    { sel: 'a[target="_blank"]', text: 'OPEN ↗' },
    { sel: '.arch-toggle', text: 'EXPAND' },
  ];
  const genericHov = 'a,button,[role="button"],.btn,.stat-card,.evidence-card';
  document.addEventListener('mouseover', e => {
    let matched = false;
    for (const { sel, text } of hoverMap) {
      if (e.target.closest(sel)) {
        label.textContent = text;
        document.documentElement.classList.add('cursor-hover', 'cursor-label');
        matched = true; break;
      }
    }
    if (!matched && e.target.closest(genericHov)) {
      label.textContent = '';
      document.documentElement.classList.add('cursor-hover');
      document.documentElement.classList.remove('cursor-label');
    }
  });
  document.addEventListener('mouseout', e => {
    const t = e.target;
    if (t.closest(genericHov) || hoverMap.some(h => t.closest(h.sel))) {
      document.documentElement.classList.remove('cursor-hover', 'cursor-label');
    }
  });
})();

if (!lightMotion) document.querySelectorAll('.evidence-card, .project-card').forEach(card => {
  const glow = card.querySelector('.card-glow');
  if (!glow) return;
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    glow.style.left = (e.clientX - r.left) + 'px';
    glow.style.top  = (e.clientY - r.top) + 'px';
  }, { passive: true });
});

(function() {
  if (lightMotion) return;
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&';
  const FRAMES = 10;
  document.querySelectorAll('.nav-links a[data-scramble]').forEach(a => {
    let rafId = null;
    a.addEventListener('mouseenter', () => {
      const orig = a.dataset.scramble;
      let frame = 0;
      if (rafId) cancelAnimationFrame(rafId);
      function tick() {
        a.textContent = orig.split('').map((c, i) => {
          if (c === ' ' || c === '↗') return c;
          const alpha = orig.replace(/[↗ ]/g, '');
          if (frame / FRAMES > i / alpha.length) return c;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('');
        frame++;
        if (frame <= FRAMES) { rafId = requestAnimationFrame(tick); }
        else { a.textContent = orig + (orig === 'GitHub' ? ' ↗' : ''); rafId = null; }
      }
      tick();
    });
  });
})();

})();
