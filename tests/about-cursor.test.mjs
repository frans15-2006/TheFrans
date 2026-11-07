import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/js/about.js', import.meta.url), 'utf8');
const cursor = source.slice(source.indexOf('function initAboutCursor()'), source.indexOf('    if (finePointer && !lightMotion)'));

function harness() {
  const frames = new Map(), events = {}, classes = new Set();
  let nextId = 0;
  const node = () => ({ style: {}, classList: { add() {}, remove() {} } });
  const dot = node(), ring = node(), label = { textContent: '' };
  const document = {
    hidden: false,
    body: { classList: { toggle(name, value) { value ? classes.add(name) : classes.delete(name); } } },
    documentElement: { addEventListener: (name, fn) => { events['root:' + name] = fn; } },
    getElementById: id => ({ 'cursor-dot': dot, 'cursor-ring': ring, 'cursor-label': label })[id],
    querySelectorAll: () => [], addEventListener: (name, fn) => { events['document:' + name] = fn; }
  };
  const pointer = { matches: true, addEventListener: (name, fn) => { events.pointer = fn; } };
  const motionPreference = { matches: false, addEventListener: (name, fn) => { events.motion = fn; } };
  const window = { innerWidth: 1200, innerHeight: 800, matchMedia: () => pointer, addEventListener: (name, fn) => { events['window:' + name] = fn; } };
  vm.runInNewContext(cursor + '\ninitAboutCursor();', {
    document, window, motionPreference, gsap: { killTweensOf() {}, set() {}, to() {} },
    requestAnimationFrame: fn => { frames.set(++nextId, fn); return nextId; }, cancelAnimationFrame: id => frames.delete(id)
  });
  return { frames, events, classes, dot, ring, document, pointer, motionPreference,
    move(x, y) { events['window:mousemove']({ clientX: x, clientY: y, target: { closest: () => null } }); },
    settle() { let count = 0; while (frames.size && count++ < 200) { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn()); } assert.ok(count < 200, 'cursor should become idle'); }
  };
}

test('About cursor starts on pointer entry and stops scheduling frames once settled', () => {
  const h = harness();
  assert.equal(h.frames.size, 0);
  assert.equal(h.classes.has('has-cursor'), false);
  h.move(200, 200); h.settle();
  assert.equal(h.classes.has('has-cursor'), true);
  h.move(800, 600); h.move(900, 650);
  assert.equal(h.frames.size, 1);
  h.settle();
  assert.equal(h.frames.size, 0);
  assert.match(h.ring.style.transform, /900px, 650px/);
});

test('cursor restores the native pointer and cancels motion on lifecycle and preference changes', () => {
  for (const action of ['motion', 'pointer', 'hidden', 'pagehide', 'leave']) {
    const h = harness();
    h.move(200, 200); h.move(800, 600);
    const staleFrame = [...h.frames.values()][0];
    if (action === 'motion') { h.motionPreference.matches = true; h.events.motion(); }
    if (action === 'pointer') { h.pointer.matches = false; h.events.pointer(); }
    if (action === 'hidden') { h.document.hidden = true; h.events['document:visibilitychange'](); }
    if (action === 'pagehide') h.events['window:pagehide']();
    if (action === 'leave') h.events['root:mouseleave']();
    staleFrame();
    assert.equal(h.frames.size, 0, action);
    assert.equal(h.classes.has('has-cursor'), false, action);
    assert.equal(h.dot.style.display, 'none', action);
  }
});
