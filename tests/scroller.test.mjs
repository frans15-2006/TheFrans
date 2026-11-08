import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/js/shared.js', import.meta.url), 'utf8');

function harness() {
  const listeners = new Set(), ticks = new Set(), calls = [];
  const preference = { matches: false, addEventListener: (_, callback) => listeners.add(callback) };
  class Lenis {
    constructor(options) { this.options = { smoothWheel: true, ...options }; this.isStopped = false; this.resets = 0; }
    on() {}
    raf() {}
    stop() { this.isStopped = true; }
    start() { this.isStopped = false; }
    reset() { this.resets++; }
    scrollTo(target, settings) { calls.push({ target, settings }); }
  }
  const window = {
    Lenis, matchMedia: () => preference, scrollY: 100, addEventListener() {},
    scrollTo: options => calls.push(options),
    gsap: { ticker: { add: callback => ticks.add(callback), remove: callback => ticks.delete(callback), lagSmoothing() {} } },
    ScrollTrigger: { update() {}, refresh() {} }
  };
  vm.runInNewContext(source, { window, document: { querySelectorAll: () => [], querySelector: () => ({ getBoundingClientRect: () => ({ top: 50 }) }) } });
  return { window, calls, ticks,
    create: settings => window.Portfolio.createScroller(settings),
    preference(matches) { preference.matches = matches; listeners.forEach(callback => callback({ matches })); }
  };
}

test('native scroll fallback reads the current motion preference for every jump', () => {
  const h = harness();
  const scroll = h.create({ lightMotion: true });
  scroll.scrollTo('#section', { offset: -20 });
  assert.equal(h.calls.at(-1).top, 130);
  assert.equal(h.calls.at(-1).behavior, 'smooth');
  h.preference(true);
  scroll.scrollTo(600, { offset: -96 });
  assert.equal(h.calls.at(-1).top, 504);
  assert.equal(h.calls.at(-1).behavior, 'auto');
  h.preference(false);
  scroll.scrollTo(200);
  assert.equal(h.calls.at(-1).behavior, 'smooth');
});

test('live reduced motion stops easing and makes jumps immediate without unlocking navigation', () => {
  const h = harness();
  const scroll = h.create({ lightMotion: false });
  scroll.scrollTo(600, { duration: 1.1 });
  assert.equal(h.calls.at(-1).settings.immediate, undefined);
  scroll.stop();
  h.preference(true);
  assert.equal(scroll.options.smoothWheel, false);
  assert.equal(scroll.resets, 1);
  assert.equal(scroll.isStopped, true);
  scroll.start();
  scroll.scrollTo(700, { offset: -96, duration: 1.1 });
  assert.equal(h.calls.at(-1).settings.immediate, true);
  assert.equal(h.calls.at(-1).settings.offset, -96);
  h.preference(false);
  assert.equal(scroll.options.smoothWheel, true);
  scroll.scrollTo(800);
  assert.equal(h.calls.at(-1).settings.immediate, undefined);
  assert.equal(h.ticks.size, 1);
});

test('restoring motion preserves an intentionally native wheel configuration', () => {
  const h = harness();
  const scroll = h.create({ lightMotion: false, options: { smoothWheel: false } });
  h.preference(true);
  h.preference(false);
  assert.equal(scroll.options.smoothWheel, false);
});
