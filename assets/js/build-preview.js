const clamp = value => Math.max(0, Math.min(1, value));
const glide = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
const colors = ['#d4ad52', '#7c9bd5', '#d5d7d1'];

export function borderPoint(rect, progress) {
  let distance = clamp(progress) * (rect.width + rect.height) * 2;
  const points = [[rect.x, rect.y], [rect.x + rect.width, rect.y], [rect.x + rect.width, rect.y + rect.height], [rect.x, rect.y + rect.height], [rect.x, rect.y]];
  for (let i = 1; i < points.length; i++) {
    const length = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    if (distance <= length) {
      const ratio = length ? distance / length : 0;
      return { x: points[i - 1][0] + (points[i][0] - points[i - 1][0]) * ratio, y: points[i - 1][1] + (points[i][1] - points[i - 1][1]) * ratio };
    }
    distance -= length;
  }
  return { x: rect.x, y: rect.y };
}

// Only the overlay is animated. Page content never gets hidden, cloned, or rewritten.
export function createBuildEngine({ total, readScene, draw, onState, onBuilt = () => {}, requestFrame, cancelFrame }) {
  const built = new Set();
  let workers = [], phase = 'idle', frameId = null, dirty = true, paused = false;
  let scene, clock = 0, previousTime = null, finishTime = 0;
  const report = () => onState(phase, built.size, total);
  function markBuilt(id) { if (!built.has(id)) { built.add(id); onBuilt(id); report(); } }
  function move(worker, from, to, progress, bend = 0) {
    const t = glide(progress), u = 1 - t;
    const dx = to.x - from.x, dy = to.y - from.y, distance = Math.hypot(dx, dy) || 1;
    const cx = (from.x + to.x) / 2 - dy / distance * bend;
    const cy = (from.y + to.y) / 2 + dx / distance * bend;
    worker.x = u * u * from.x + 2 * u * t * cx + t * t * to.x;
    worker.y = u * u * from.y + 2 * u * t * cy + t * t * to.y;
  }
  function travelTo(worker, id, delay = 0) {
    const rect = scene.rects[id];
    const distance = Math.hypot(rect.x - worker.x, rect.y - worker.y);
    worker.task = { id, stage: 'travel', start: clock + delay, from: { x: worker.x, y: worker.y },
      anchor: { ...rect }, travelDuration: Math.min(950, Math.max(450, 350 + distance * 0.7)),
      drawDuration: Math.min(2600, Math.max(1250, 700 + (rect.width + rect.height) * 0.8)) };
    worker.trace = 0; worker.pressScale = 1; worker.clickPulse = null; worker.outlineAlpha = 1;
  }
  function advance(worker, stage) {
    worker.task.stage = stage; worker.task.start = clock;
    worker.task.from = { x: worker.x, y: worker.y };
  }
  function cancel() { if (frameId !== null) cancelFrame(frameId); frameId = null; previousTime = null; }
  function schedule() { if (!paused && frameId === null && (phase === 'running' || phase === 'finishing')) frameId = requestFrame(tick); }
  function finish() {
    if (phase !== 'running') return;
    phase = 'finishing'; finishTime = clock;
    for (let id = 0; id < total; id++) markBuilt(id);
    workers.forEach(worker => { worker.from = { x: worker.x, y: worker.y }; worker.task = null; worker.clickPulse = null; worker.pressScale = 1; });
    report(); schedule();
  }
  function tick(time) {
    frameId = null;
    if (paused || !['running', 'finishing'].includes(phase)) return;
    if (previousTime !== null) clock += Math.min(50, Math.max(0, time - previousTime));
    previousTime = time;
    if (dirty) {
      scene = readScene(); dirty = false;
      workers.forEach(worker => {
        const task = worker.task;
        if (!task || ['release', 'depart'].includes(task.stage)) return;
        const rect = scene.rects[task.id];
        if (rect.visible && (Math.hypot(rect.x - task.anchor.x, rect.y - task.anchor.y) > 72 || Math.abs(rect.width - task.anchor.width) > 72 || Math.abs(rect.height - task.anchor.height) > 72)) travelTo(worker, task.id);
        else task.anchor = { ...rect };
      });
    }
    if (phase === 'running') {
      scene.rects.forEach((rect, id) => { if (rect.passed) markBuilt(id); });
      workers.forEach(worker => {
        if (worker.task && !scene.rects[worker.task.id].visible) {
          markBuilt(worker.task.id); worker.task = null; worker.clickPulse = null; worker.pressScale = 1;
        }
      });
      if (scene.atBottom || built.size === total) finish();
      else {
        const assigned = new Set(workers.filter(worker => worker.task).map(worker => worker.task.id));
        workers.forEach((worker, index) => {
          if (worker.task) return;
          const id = scene.rects.findIndex((rect, index) => rect.visible && !built.has(index) && !assigned.has(index));
          if (id < 0) return;
          assigned.add(id); worker.visible = true;
          travelTo(worker, id, index * 110);
        });
        workers.forEach(worker => {
          if (!worker.task) return;
          const task = worker.task, rect = scene.rects[task.id];
          const elapsed = Math.max(0, clock - task.start);
          if (task.stage === 'travel') {
            const progress = clamp(elapsed / task.travelDuration);
            move(worker, task.from, rect, progress, Math.min(65, task.travelDuration * 0.07));
            if (progress === 1) advance(worker, 'press');
          } else if (task.stage === 'press') {
            const progress = clamp(elapsed / 240);
            worker.x = rect.x; worker.y = rect.y;
            worker.clickPulse = progress; worker.pressScale = 1 - Math.sin(progress * Math.PI) * 0.14;
            if (progress === 1) { worker.clickPulse = null; advance(worker, 'draw'); }
          } else if (task.stage === 'draw') {
            const progress = clamp(elapsed / task.drawDuration);
            worker.trace = glide(progress); worker.pressScale = 0.94;
            const point = borderPoint(rect, worker.trace);
            worker.x = point.x; worker.y = point.y;
            if (progress === 1) { markBuilt(task.id); advance(worker, 'release'); }
          } else if (task.stage === 'release') {
            const progress = clamp(elapsed / 180);
            worker.pressScale = 0.94 + 0.06 * glide(progress);
            if (progress === 1) advance(worker, 'depart');
          } else if (task.stage === 'depart') {
            const progress = clamp(elapsed / 520);
            move(worker, task.from, { x: Math.max(16, rect.x - 32), y: rect.y + 7 }, progress, -10);
            worker.outlineAlpha = 1 - progress;
            if (progress === 1) { worker.task = null; worker.pressScale = 1; }
          }
        });
        if (built.size === total) finish();
      }
    }
    if (phase === 'finishing') {
      const progress = clamp((clock - finishTime) / 1050);
      workers.forEach((worker, i) => {
        const x = scene.width / 2 + (i - 1) * 27, y = scene.height - 125 + i * 8;
        worker.visible = true;
        move(worker, worker.from, { x, y }, progress / 0.75, (i - 1) * 30);
      });
      if (progress === 1) { phase = 'done'; cancel(); draw(null); report(); return; }
      draw({ scene, workers, alpha: 1 - clamp((progress - 0.55) / 0.45) });
      schedule(); return;
    }
    draw({ scene, workers, alpha: 1 });
    if (workers.some(worker => worker.task) || scene.rects.some((rect, id) => rect.visible && !built.has(id))) schedule();
    else previousTime = null;
  }
  return {
    get phase() { return phase; },
    start() {
      cancel(); built.clear(); scene = readScene(); clock = 0; dirty = false;
      workers = colors.map((color, i) => ({ color, x: scene.width / 2 + (i - 1) * 22, y: 112 + i * 12, visible: false, task: null }));
      phase = 'running'; report(); schedule();
    },
    refresh() { dirty = true; schedule(); },
    pause() { paused = true; cancel(); },
    resume() { paused = false; dirty = true; schedule(); },
    skip() { cancel(); phase = 'skipped'; draw(null); report(); }
  };
}

export function createBuildCaption({ controls, status, action, replay, available, onRetire = () => {}, setTimer = setTimeout, clearTimer = clearTimeout }) {
  let phase = 'idle', timer = null;
  const active = () => ['running', 'finishing'].includes(phase);
  function cancel() { if (timer !== null) clearTimer(timer); timer = null; }
  function hide() {
    cancel(); onRetire(); controls.hidden = true;
    controls.classList.remove('is-fading');
  }
  return {
    update(nextPhase) {
      if (phase === nextPhase) return;
      cancel(); phase = nextPhase; controls.dataset.state = phase;
      controls.classList.remove('is-fading');
      replay.hidden = !available();
      if (!active()) onRetire();
      action.hidden = !active();
      status.textContent = phase === 'done' ? 'Built' : 'Build mode';
      if (active()) controls.hidden = !available();
      else if (phase === 'done' && available()) {
        controls.hidden = false;
        timer = setTimer(() => {
          timer = null; controls.classList.add('is-fading');
          timer = setTimer(hide, 180);
        }, 1500);
      } else hide();
    },
    sync() { replay.hidden = !available(); if (active()) controls.hidden = !available(); else if (!available()) hide(); },
    hide
  };
}

export function initBuildPreview() {
  if (document.body.dataset.page !== 'home') return;
  const desktop = matchMedia('(min-width:900px) and (hover:hover) and (pointer:fine)');
  const motion = matchMedia('(prefers-reduced-motion:reduce)');
  const key = 'thefrans:build-preview:v1';
  const targets = [...document.querySelectorAll('#hero .hero-role-tag,#hero .hero-name,#hero .hero-cta,#about .section-title,#about .about-text,#about .stats-row,#skills .section-title,.evidence-card,#projects .section-title,.project-card,#clients .section-title,.marquee-row,#contact .section-title,.contact-tagline,.contact-info')].filter(node => !node.closest('[hidden]'));
  if (!targets.length) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'build-canvas'; canvas.hidden = true; canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const pointer = new Image();
  pointer.addEventListener('load', () => { canvas.dataset.pointer = 'bibata'; engine.refresh(); });
  pointer.src = '/assets/media/builder-bibata-pointer.png';
  const controls = document.createElement('aside');
  controls.className = 'build-controls'; controls.hidden = true; controls.setAttribute('aria-label', 'Portfolio build preview');
  controls.innerHTML = '<span class="build-indicator" aria-hidden="true"></span><span class="build-status" role="status" aria-live="polite" aria-atomic="true">Build mode</span><button class="build-action" type="button">Skip</button>';
  const status = controls.querySelector('.build-status'), action = controls.querySelector('button');
  const replay = document.createElement('button');
  replay.className = 'build-replay'; replay.type = 'button'; replay.hidden = true;
  replay.innerHTML = '<span aria-hidden="true">↻</span> Replay build';
  const footer = document.querySelector('footer .footer-right') || document.querySelector('footer');
  footer?.insertBefore(replay, footer.firstChild);
  document.body.append(canvas, controls);
  const caption = createBuildCaption({ controls, status, action, replay, available: () => desktop.matches,
    onRetire() { if (controls.contains(document.activeElement) && !replay.hidden) replay.focus({ preventScroll: true }); }
  });
  let remembered = false, introTimer = null, pageActive = true;
  try { remembered = sessionStorage.getItem(key) === 'done'; } catch {}
  function remember() { try { sessionStorage.setItem(key, 'done'); } catch {} }
  function fitCanvas() {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(innerWidth * ratio); canvas.height = Math.round(innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function readScene() {
    const top = 100, bottom = Math.max(top + 30, innerHeight - 80);
    return { width: innerWidth, height: innerHeight,
      atBottom: scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 5,
      rects: targets.map(node => {
        const bounds = node.getBoundingClientRect();
        const x = Math.max(16, bounds.left - 5), y = Math.max(top, bounds.top - 5);
        const right = Math.min(innerWidth - 16, bounds.right + 5), end = Math.min(bottom, bounds.bottom + 5);
        return { x, y, width: Math.max(1, right - x), height: Math.max(1, end - y),
          visible: bounds.width > 0 && bounds.height > 0 && right > x && end - y > 16,
          passed: bounds.bottom <= top || !bounds.width || !bounds.height };
      }) };
  }
  function draw(frame) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (!frame) { canvas.hidden = true; canvas.width = canvas.height = 1; return; }
    canvas.hidden = frame.workers.every(worker => !worker.visible);
    for (const worker of frame.workers) {
      if (!worker.visible) continue;
      ctx.save(); ctx.globalAlpha = frame.alpha;
      if (worker.task) {
        const rect = frame.scene.rects[worker.task.id];
        const length = 2 * (rect.width + rect.height);
        ctx.strokeStyle = worker.color; ctx.lineWidth = 1; ctx.globalAlpha = frame.alpha * 0.65 * (worker.outlineAlpha ?? 1);
        ctx.setLineDash([Math.max(0.01, length * worker.trace), length + 1]);
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height); ctx.setLineDash([]);
      }
      ctx.globalAlpha = frame.alpha;
      ctx.translate(worker.x, worker.y);
      if (worker.clickPulse !== null && worker.clickPulse !== undefined) {
        ctx.beginPath(); ctx.arc(0, 0, 5 + worker.clickPulse * 10, 0, Math.PI * 2);
        ctx.strokeStyle = worker.color; ctx.lineWidth = 1;
        ctx.globalAlpha = frame.alpha * (1 - worker.clickPulse) * 0.65; ctx.stroke();
        ctx.globalAlpha = frame.alpha;
      }
      ctx.scale(worker.pressScale || 1, worker.pressScale || 1);
      // The supplied 128px Bibata cursor has a hotspot at (18, 5).
      // Its transparent padding makes this a roughly 14 × 18px visible pointer.
      if (pointer.complete && pointer.naturalWidth) ctx.drawImage(pointer, -3.9375, -1.09375, 28, 28);
      ctx.restore();
    }
  }
  const engine = createBuildEngine({ total: targets.length, readScene, draw,
    requestFrame: callback => requestAnimationFrame(callback), cancelFrame: id => cancelAnimationFrame(id),
    onBuilt: id => { targets[id].dataset.buildState = 'built'; },
    onState(phase) {
      caption.update(phase);
      if (['done', 'skipped'].includes(phase)) remember();
    }
  });
  function begin(replay = false) {
    clearTimeout(introTimer); introTimer = null;
    if (!desktop.matches || !pageActive || document.hidden) return;
    if (replay) window.scrollTo({ top: 0, behavior: 'instant' });
    targets.forEach(node => { delete node.dataset.buildState; });
    fitCanvas(); engine.start();
  }
  action.addEventListener('click', () => {
    if (['running', 'finishing'].includes(engine.phase)) engine.skip();
  });
  replay.addEventListener('click', () => { begin(true); if (!controls.hidden) action.focus({ preventScroll: true }); });
  function syncAvailability() {
    if (!desktop.matches || motion.matches) {
      clearTimeout(introTimer); introTimer = null;
      if (['running', 'finishing'].includes(engine.phase)) engine.skip();
    }
    if (['running', 'finishing'].includes(engine.phase)) fitCanvas();
    caption.sync();
    engine.refresh();
  }
  desktop.addEventListener('change', syncAvailability);
  motion.addEventListener('change', syncAvailability);
  window.addEventListener('resize', () => { if (['running', 'finishing'].includes(engine.phase)) fitCanvas(); engine.refresh(); }, { passive: true });
  window.addEventListener('scroll', () => engine.refresh(), { passive: true });
  document.addEventListener('visibilitychange', () => {
    canvas.hidden = document.hidden || !['running', 'finishing'].includes(engine.phase);
    document.hidden ? engine.pause() : pageActive && engine.resume();
  });
  window.addEventListener('pagehide', () => { pageActive = false; clearTimeout(introTimer); engine.pause(); canvas.hidden = true; caption.hide(); });
  window.addEventListener('pageshow', () => { pageActive = true; caption.sync(); if (!document.hidden) engine.resume(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && ['running', 'finishing'].includes(engine.phase)) engine.skip(); });
  if ('ResizeObserver' in window) new ResizeObserver(() => engine.refresh()).observe(document.body);
  caption.sync();
  if (!remembered && desktop.matches && !motion.matches && !navigator.connection?.saveData) {
    const deadline = performance.now() + 2500;
    const afterIntro = () => {
      if (!window.__preloaderDone && performance.now() < deadline) introTimer = setTimeout(afterIntro, 100);
      else begin();
    };
    afterIntro();
  }
}

if (typeof document !== 'undefined') initBuildPreview();
