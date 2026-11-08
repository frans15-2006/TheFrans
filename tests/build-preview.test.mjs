import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Load the browser module without changing this dependency-free site's package type.
const source = await readFile(new URL('../assets/js/build-preview.js', import.meta.url), 'utf8');
const { createBuildEngine, createBuildCaption, borderPoint } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

function harness(total = 4) {
  let nextId = 0, now = 0;
  const frames = new Map(), built = [], reports = [], draws = [];
  const scene = { width: 1200, height: 800, atBottom: false,
    rects: Array.from({ length: total }, (_, id) => ({ x: 200, y: 150 + id * 80, width: 200, height: 50, visible: id < 2, passed: false })) };
  const engine = createBuildEngine({ total, readScene: () => scene,
    draw: frame => draws.push(frame && structuredClone(frame)), onState: (...state) => reports.push(state), onBuilt: id => built.push(id),
    requestFrame: callback => { const id = ++nextId; frames.set(id, callback); return id; }, cancelFrame: id => frames.delete(id) });
  function step() { now += 50; const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback(now)); }
  return { engine, scene, frames, built, reports, draws, step,
    settle() { for (let i = 0; frames.size && i < 200; i++) step(); assert.equal(frames.size, 0, 'animation must become idle'); } };
}

test('builders work once per visible target, then stop requesting frames while reading', () => {
  const h = harness(); h.engine.start(); h.settle();
  assert.deepEqual(h.built, [0, 1]);
  assert.equal(h.engine.phase, 'running');
  h.engine.refresh(); h.settle();
  assert.deepEqual(h.built, [0, 1], 'scrolling back must not rebuild completed targets');
  h.scene.rects[2].visible = true;
  h.engine.refresh(); h.settle();
  assert.deepEqual(h.built, [0, 1, 2]);
});

test('fast scrolling catches up and reaching the bottom completes, clears and stops the overlay', () => {
  const h = harness(); h.engine.start(); h.step();
  h.scene.rects.forEach(rect => { rect.visible = false; rect.passed = true; });
  h.scene.atBottom = true;
  h.engine.refresh(); h.settle();
  assert.equal(h.engine.phase, 'done');
  assert.equal(new Set(h.built).size, 4);
  assert.equal(h.draws.at(-1), null);
  h.engine.refresh(); h.engine.resume();
  assert.equal(h.frames.size, 0, 'a completed build must not wake on later scrolls');
});

test('skip cancels pending work and stale frames cannot restart it; replay resets the build', () => {
  const h = harness(); h.engine.start();
  const stale = [...h.frames.values()][0];
  h.engine.skip(); stale(100);
  assert.equal(h.engine.phase, 'skipped');
  assert.equal(h.frames.size, 0);
  assert.equal(h.draws.at(-1), null);
  h.engine.start(); h.settle();
  assert.equal(h.engine.phase, 'running');
  assert.deepEqual(h.built, [0, 1]);
});

test('hidden pages suspend all work and a build resumes without duplicating workers', () => {
  const h = harness(); h.engine.start(); h.step(); h.engine.pause();
  assert.equal(h.frames.size, 0);
  h.engine.refresh();
  assert.equal(h.frames.size, 0);
  h.engine.resume(); h.engine.resume();
  assert.equal(h.frames.size, 1);
  h.settle();
  assert.deepEqual(h.built, [0, 1]);
});

test('the last visible target finishes naturally even before a bottom-scroll event', () => {
  const h = harness(2); h.engine.start(); h.settle();
  assert.equal(h.engine.phase, 'done');
  assert.equal(h.draws.at(-1), null);
});

test('cursors glide, click, trace progressively and return without snapping to a rest position', () => {
  const h = harness(); h.engine.start(); h.settle();
  const history = h.draws.filter(Boolean).map(frame => frame.workers[0]);
  const stages = new Set(history.map(worker => worker.task?.stage));
  for (const stage of ['travel', 'press', 'draw', 'release', 'depart']) assert.ok(stages.has(stage), `Missing ${stage} choreography`);
  assert.ok(history.findIndex(worker => worker.trace > 0) >= 14, 'travel and click must be visible before any drawing');
  assert.ok(history.filter(worker => worker.trace > 0 && worker.trace < 1).length >= 20, 'the outline should build over many frames');
  const jumps = history.slice(1).map((worker, i) => Math.hypot(worker.x - history[i].x, worker.y - history[i].y));
  assert.ok(Math.max(...jumps) < 80, 'a cursor must not teleport at the beginning or end of a job');
  assert.ok(history.some(worker => worker.clickPulse > 0 && worker.pressScale < 1));
});

test('a large layout or scroll change retargets from the current cursor position', () => {
  const h = harness(); h.engine.start();
  for (let i = 0; i < 25; i++) h.step();
  const before = h.draws.at(-1).workers[0];
  assert.equal(before.task.stage, 'draw');
  h.scene.rects[0].x += 320;
  h.engine.refresh(); h.step();
  const after = h.draws.at(-1).workers[0];
  assert.equal(after.task.stage, 'travel');
  assert.equal(after.x, before.x);
  assert.equal(after.y, before.y);
  h.settle();
  assert.deepEqual(h.built, [1, 0]);
});

test('border tracing visits every edge without moving the target element', () => {
  const rect = { x: 20, y: 30, width: 100, height: 100 };
  assert.deepEqual(borderPoint(rect, 0), { x: 20, y: 30 });
  assert.deepEqual(borderPoint(rect, 0.25), { x: 120, y: 30 });
  assert.deepEqual(borderPoint(rect, 0.5), { x: 120, y: 130 });
  assert.deepEqual(borderPoint(rect, 0.75), { x: 20, y: 130 });
  assert.deepEqual(borderPoint(rect, 1), { x: 20, y: 30 });
});

function captionHarness() {
  const classes = new Set(), timers = new Map();
  const controls = { hidden: true, dataset: {}, classList: { add: value => classes.add(value), remove: value => classes.delete(value) } };
  const status = {}, action = {}, replay = {};
  let nextId = 0, desktop = true, retireCalls = 0;
  const caption = createBuildCaption({ controls, status, action, replay,
    available: () => desktop, onRetire: () => { retireCalls++; },
    setTimer: (callback, delay) => { const id = ++nextId; timers.set(id, { callback, delay }); return id; },
    clearTimer: id => timers.delete(id)
  });
  return { caption, controls, status, action, replay, classes, timers,
    get retired() { return retireCalls; },
    desktop(value) { desktop = value; caption.sync(); },
    fire(delay) { const timer = [...timers].find(([, task]) => task.delay === delay); assert.ok(timer, `Missing ${delay}ms timer`); timers.delete(timer[0]); timer[1].callback(); }
  };
}

test('Quiet caption keeps a simple label while building and retires after a brief Built cue', () => {
  const h = captionHarness();
  h.caption.update('running');
  assert.equal(h.status.textContent, 'Build mode');
  assert.equal(h.controls.hidden, false);
  assert.equal(h.action.hidden, false);
  h.caption.update('finishing');
  assert.equal(h.status.textContent, 'Build mode');
  h.caption.update('done');
  assert.equal(h.status.textContent, 'Built');
  assert.equal(h.action.hidden, true);
  assert.equal(h.controls.hidden, false);
  h.fire(1500);
  assert.equal(h.classes.has('is-fading'), true);
  h.fire(180);
  assert.equal(h.controls.hidden, true);
  assert.equal(h.replay.hidden, false, 'footer replay remains available');
  assert.equal(h.timers.size, 0);
});

test('replaying during the completion cue cancels its pending dismissal', () => {
  const h = captionHarness();
  h.caption.update('done'); h.fire(1500);
  h.caption.update('running');
  assert.equal(h.timers.size, 0);
  assert.equal(h.classes.has('is-fading'), false);
  assert.equal(h.controls.hidden, false);
  assert.equal(h.status.textContent, 'Build mode');
  assert.equal(h.action.hidden, false);
});

test('Skip and navigation cleanup leave no floating caption or dismissal timers', () => {
  const h = captionHarness();
  h.caption.update('running'); h.caption.update('skipped');
  assert.equal(h.controls.hidden, true);
  assert.equal(h.timers.size, 0);
  assert.ok(h.retired > 0);
  h.caption.update('done'); h.caption.hide();
  assert.equal(h.timers.size, 0);
  h.desktop(false);
  assert.equal(h.replay.hidden, true);
  h.desktop(true);
  assert.equal(h.replay.hidden, false);
  assert.equal(h.controls.hidden, true);
});
