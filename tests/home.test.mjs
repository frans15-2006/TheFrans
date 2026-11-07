import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const site = fileURLToPath(new URL('../', import.meta.url));
const html = readFileSync(path.join(site, 'index.html'), 'utf8');
const css = readFileSync(path.join(site, 'assets/css/home.css'), 'utf8');
const script = readFileSync(path.join(site, 'assets/js/home.js'), 'utf8');
const sitemap = readFileSync(path.join(site, 'sitemap.xml'), 'utf8');
const decode = text => text.replaceAll('&amp;', '&').replaceAll('&apos;', "'");

function classes() {
  const values = new Set();
  return {
    contains: value => values.has(value),
    toggle(value, force = !values.has(value)) {
      force ? values.add(value) : values.delete(value);
      return force;
    },
  };
}

test('every displayed client links to an existing route, and clones stay out of tab order', () => {
  const cards = [...html.matchAll(/<a class="mq-card"([^>]*)>.*?<span class="mq-name">(.*?)<\/span><\/a>/g)];
  assert.equal(cards.length, 146);
  let originals = 0;
  for (const [, attributes, name] of cards) {
    const href = /href="([^"]+)"/.exec(attributes)?.[1];
    assert.ok(href, `Missing link: ${name}`);
    assert.ok(existsSync(path.join(site, decode(href), 'index.html')), `Missing route: ${href}`);
    if (attributes.includes('aria-hidden="true"')) assert.match(attributes, /tabindex="-1"/);
    else { originals++; assert.doesNotMatch(attributes, /tabindex="-1"/); }
  }
  assert.equal(originals, 73);
  assert.doesNotMatch(html, /Beautyfeel Spa/);
});

test('sitemap includes About and references only existing pages', () => {
  assert.match(sitemap, /https:\/\/thefrans\.vercel\.app\/About\//);
  assert.doesNotMatch(sitemap, /beautyfeel-spa/);
  for (const [, value] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const pathname = decodeURIComponent(new URL(decode(value)).pathname);
    const local = path.join(site, pathname);
    assert.ok(existsSync(path.extname(local) ? local : path.join(local, 'index.html')), value);
  }
});

test('persistent marquee control toggles pause and resume; keyboard focus has a static browsing path', () => {
  const clients = { classList: classes() };
  const toggle = { attributes: {}, handlers: {}, setAttribute(k, v) { this.attributes[k] = v; }, addEventListener(k, fn) { this.handlers[k] = fn; } };
  const fn = script.slice(script.indexOf('function initMarqueeControls()'), script.indexOf('\nif (!motionReady)'));
  vm.runInNewContext(`${fn}; initMarqueeControls();`, { lightMotion: false, document: { getElementById: id => id === 'clients' ? clients : toggle } });
  assert.equal(toggle.hidden, false);
  toggle.handlers.click();
  assert.equal(clients.classList.contains('clients-paused'), true);
  assert.equal(toggle.attributes['aria-pressed'], 'true');
  assert.equal(toggle.textContent, 'Resume animation');
  toggle.handlers.click();
  assert.equal(clients.classList.contains('clients-paused'), false);
  assert.equal(toggle.attributes['aria-pressed'], 'false');
  assert.equal(toggle.textContent, 'Pause animation');
  assert.match(css, /\.marquee-row:focus-within[^}]*animation-play-state:paused/);
  assert.match(css, /\.marquee-row:focus-within[^}]*overflow-x:auto/);
  assert.match(css, /\.marquee-row:focus-within \.marquee-track[^}]*animation:none/);
});

test('resizing out of mobile navigation releases scroll lock', () => {
  const attributes = { 'aria-expanded': 'false' };
  const hamburger = { classList: classes(), handlers: {}, getAttribute: k => attributes[k], setAttribute: (k, v) => { attributes[k] = String(v); }, addEventListener(k, fn) { this.handlers[k] = fn; }, focus() {} };
  const navLinks = { classList: classes(), querySelectorAll: () => [] };
  const mediaHandlers = {};
  const body = { style: {} };
  const contact = { addEventListener(event, handler) { this[event] = handler; } };
  let stopped = false;
  const document = { body, getElementById: id => id === 'navHamburger' ? hamburger : navLinks, querySelector: () => contact, querySelectorAll: () => [], addEventListener() {} };
  const window = { matchMedia: () => ({ addEventListener: (name, fn) => { mediaHandlers[name] = fn; } }), addEventListener() {} };
  vm.runInNewContext(script.slice(script.indexOf('const hamburger ='), script.indexOf('const archToggle =')), { document, window, IntersectionObserver: class { observe() {} }, lenis: { stop: () => { stopped = true; }, start: () => { stopped = false; } } });
  hamburger.handlers.click();
  assert.equal(body.style.overflow, 'hidden');
  assert.equal(stopped, true);
  mediaHandlers.change({ matches: false });
  assert.equal(body.style.overflow, '');
  assert.equal(stopped, false);
  assert.equal(attributes['aria-expanded'], 'false');
  assert.equal(navLinks.classList.contains('mobile-open'), false);
  hamburger.handlers.click();
  contact.click();
  assert.equal(stopped, false);
  assert.equal(body.style.overflow, '');
  assert.equal(attributes['aria-expanded'], 'false');
});

test('section indicators follow rendered scroll position in both directions without anticipating clicks', () => {
  let scrollY = 0;
  const events = {};
  const frames = [];
  let destination;
  const ids = ['hero', 'about', 'skills', 'projects', 'clients', 'contact'];
  const targets = ids.map((id, index) => ({ id, getBoundingClientRect: () => ({ top: index * 1000 - scrollY }) }));
  const dots = ids.map(id => ({
    dataset: { target: '#' + id }, classList: classes(), attributes: {},
    setAttribute(key, value) { this.attributes[key] = value; },
    removeAttribute(key) { delete this.attributes[key]; },
    addEventListener(event, handler) { this[event] = handler; }
  }));
  const links = ids.map(id => ({
    attributes: { href: '#' + id },
    getAttribute(key) { return this.attributes[key]; },
    setAttribute(key, value) { this.attributes[key] = value; },
    removeAttribute(key) { delete this.attributes[key]; }
  }));
  const document = {
    body: {}, documentElement: { scrollHeight: 5600 }, getElementById: () => ({ querySelectorAll: () => dots }),
    querySelector: selector => targets.find(target => '#' + target.id === selector),
    querySelectorAll: () => links
  };
  vm.runInNewContext(script.slice(script.indexOf('function initSectionRail()'), script.lastIndexOf('\n})();')) + '\ninitSectionRail();', {
    document, window: { innerHeight: 1000, get scrollY() { return scrollY; }, addEventListener: (event, handler) => { events[event] = handler; } },
    requestAnimationFrame: handler => frames.push(handler), ResizeObserver: class { observe() {} },
    lenis: { scrollTo: target => { destination = target; } }
  });
  function active(id) {
    assert.deepEqual(dots.filter(dot => dot.classList.contains('active')).map(dot => dot.dataset.target), ['#' + id]);
    assert.equal(dots[ids.indexOf(id)].attributes['aria-current'], 'location');
    assert.deepEqual(links.filter(link => link.attributes['aria-current']).map(link => link.attributes.href), ['#' + id]);
  }
  function scrollTo(y) { scrollY = y; events.scroll(); frames.shift()(); }
  active('hero');
  scrollTo(500); active('hero'); // Next section is visible, but not yet being read.
  scrollTo(887); active('hero');
  scrollTo(888); active('about');
  dots[3].click();
  assert.equal(destination, 3000);
  active('about'); // Clicking ahead must not jump the indicator ahead of the page.
  scrollTo(2000); active('skills');
  scrollTo(3000); active('projects');
  scrollTo(2887); active('skills');
  scrollTo(4500); active('clients');
  scrollTo(4600); active('contact'); // Short final section cannot reach the reading line.
  scrollTo(0); active('hero');
  events.scroll(); events.scroll();
  assert.equal(frames.length, 1); // Coalesce scroll events and do no work when idle.
  frames.shift()();
  assert.equal(frames.length, 0);
});

test('architecture disclosure keeps visual and accessibility states in sync', () => {
  assert.match(html, /id="archDiagram" aria-hidden="true"/);
  const attributes = {};
  const diagram = { classList: classes(), setAttribute: (key, value) => { attributes[key] = value; } };
  const toggle = { classList: classes(), addEventListener(event, fn) { this.click = fn; }, setAttribute: (key, value) => { attributes[key] = value; } };
  vm.runInNewContext(script.slice(script.indexOf('const archToggle ='), script.indexOf('\ninitSectionRail();')), { document: { getElementById: id => id === 'archToggle' ? toggle : diagram } });
  toggle.click();
  assert.equal(attributes['aria-expanded'], true);
  assert.equal(attributes['aria-hidden'], 'false');
  toggle.click();
  assert.equal(attributes['aria-expanded'], false);
  assert.equal(attributes['aria-hidden'], 'true');
});

function heroHarness(initialTop = 0, pixelRatio = 1) {
  let draws = 0;
  let observer;
  let frameNumber = 0;
  const frames = new Map();
  const documentEvents = {};
  const windowEvents = {};
  const mediaEvents = {};
  const media = { matches: true, addEventListener: (key, fn) => { mediaEvents[key] = fn; } };
  const gl = new Proxy({ drawArrays: () => draws++, getShaderParameter: () => true, getProgramParameter: () => true }, { get: (target, key) => target[key] || (() => ({})) });
  const heroEvents = {};
  const hero = { offsetWidth: 1200, offsetHeight: 900, getBoundingClientRect: () => ({ top: initialTop, bottom: initialTop + 900 }), addEventListener: (event, handler) => { heroEvents[event] = handler; } };
  const canvas = { getContext: () => gl, classList: { add() {} } };
  const document = { hidden: false, getElementById: id => id === 'hero' ? hero : canvas, addEventListener: (key, fn) => { documentEvents[key] = fn; } };
  class Observer { constructor(callback) { observer = callback; } observe() {} }
  const window = { innerHeight: 800, devicePixelRatio: pixelRatio, IntersectionObserver: Observer, matchMedia: () => media, addEventListener: (key, fn) => { windowEvents[key] = fn; } };
  const requestAnimationFrame = callback => { frames.set(++frameNumber, callback); return frameNumber; };
  const cancelAnimationFrame = id => frames.delete(id);
  const fn = script.slice(script.indexOf('function initHeroCanvas()'), script.indexOf('\nfunction initAmbientOrb()'));
  vm.runInNewContext(`${fn}; initHeroCanvas();`, { isMobile: false, noMotion: false, document, window, IntersectionObserver: Observer, performance: { now: () => 0 }, requestAnimationFrame, cancelAnimationFrame, setTimeout() {} });
  return {
    get draws() { return draws; }, frames, document, canvas, heroEvents,
    intersect: value => observer([{ target: hero, isIntersecting: value }]),
    visibility: hidden => { document.hidden = hidden; documentEvents.visibilitychange(); },
    page: event => windowEvents[event](),
    viewport: matches => { media.matches = matches; mediaEvents.change(); },
    tick() { const [id, callback] = frames.entries().next().value; frames.delete(id); callback(); },
  };
}

test('ambient waves have no pointer controls and avoid high-DPI framebuffer multiplication', () => {
  const state = heroHarness(0, 2);
  assert.equal(state.heroEvents.mousemove, undefined);
  assert.equal(state.heroEvents.pointermove, undefined);
  assert.equal(state.canvas.width, 1200);
  assert.equal(state.canvas.height, 900);
  assert.equal(state.draws, 1);
  state.tick();
  assert.equal(state.draws, 2, 'ambient motion continues without pointer events');
});

test('WebGL renders only while the hero is visible in an active desktop tab', () => {
  const state = heroHarness();
  assert.equal(state.draws, 1);
  assert.equal(state.frames.size, 1);
  state.tick();
  assert.equal(state.draws, 2);
  assert.equal(state.frames.size, 1);
  const staleCallback = state.frames.values().next().value;
  state.intersect(false);
  assert.equal(state.frames.size, 0);
  staleCallback();
  assert.equal(state.draws, 2);
  assert.equal(state.frames.size, 0);
  state.visibility(true);
  state.intersect(true);
  assert.equal(state.draws, 2);
  state.visibility(false);
  assert.equal(state.draws, 3);
  state.visibility(false);
  assert.equal(state.frames.size, 1, 'must not create duplicate render loops');
  state.page('pagehide');
  assert.equal(state.frames.size, 0);
  state.page('pageshow');
  assert.equal(state.draws, 4);
  state.viewport(false);
  assert.equal(state.frames.size, 0);
  state.viewport(true);
  assert.equal(state.draws, 5);
  assert.equal(state.frames.size, 1);
});

test('loading directly below the hero does not start WebGL until it enters the viewport', () => {
  const state = heroHarness(-1000);
  assert.equal(state.draws, 0);
  assert.equal(state.frames.size, 0);
  state.intersect(true);
  assert.equal(state.draws, 1);
});

test('the brightest shader output behind the scrim preserves readable hero contrast', () => {
  const goldStrength = Number(/smoothstep\(0\.2, 0\.7, n\) \* ([\d.]+)/.exec(script)[1]);
  const highlightStrength = Number(/smoothstep\(0\.75, 0\.95, n\) \* ([\d.]+)/.exec(script)[1]);
  const scrimOpacity = Number(/rgba\(8,8,8,([\d.]+)\) 100%/.exec(css)[1]);
  const bg = [8, 8, 8], gold = [240, 165, 0], white = [234, 234, 234];
  const brightest = bg.map((value, i) => ((value * (1 - goldStrength) + gold[i] * goldStrength) * (1 - highlightStrength) + white[i] * highlightStrength) * (1 - scrimOpacity) + 8 * scrimOpacity);
  const luminance = rgb => rgb.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  const contrast = rgb => (luminance(rgb) + .05) / (luminance(brightest) + .05);
  assert.ok(contrast(gold) >= 4.5, 'gold name must remain distinguishable from the animation');
  assert.ok(contrast([196, 196, 196]) >= 4.5, 'hero description must remain readable');
});
