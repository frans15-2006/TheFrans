import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const demoRoot = new URL('../mix-match-kain/', import.meta.url);
const source = await fs.readFile(new URL('script.js', demoRoot), 'utf8');
const html = await fs.readFile(new URL('index.html', demoRoot), 'utf8');
const inlineSource = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]).join('\n');

function harness() {
  let now = 0;
  let nextFrame = 0;
  const frames = new Map();
  const timers = [];
  const listeners = new Map();
  const windowListeners = new Map();
  let activeElement = null;
  function element(tagName = 'div') {
    const classes = new Set();
    let markup = '';
    let text = '';
    const events = new Map();
    return {
      tagName: tagName.toUpperCase(), children: [], attributes: {}, value: '', inert: false,
      style: { setProperty(name, value) { this[name] = value; } },
      classList: {
        add(...names) { names.forEach(name => classes.add(name)); },
        remove(...names) { names.forEach(name => classes.delete(name)); },
        contains(name) { return classes.has(name); },
        toggle(name, force = !classes.has(name)) { force ? classes.add(name) : classes.delete(name); return force; },
      },
      set innerHTML(value) { markup = value; this.children = []; },
      get innerHTML() { return markup || text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); },
      set textContent(value) { text = String(value); markup = ''; },
      get textContent() { return text; },
      appendChild(child) { this.children.push(child); },
      setAttribute(name, value) { this.attributes[name] = String(value); },
      addEventListener(name, callback) {
        if (!events.has(name)) events.set(name, []);
        events.get(name).push(callback);
      },
      dispatch(name, event) { for (const callback of events.get(name) || []) callback(event); },
      focus() { this.focused = true; activeElement = this; },
      contains(node) { return this === node || this.children.some(child => child.contains(node)); },
      querySelector() { return null; },
      getBoundingClientRect() { return { left: 0, top: 0, width: 100, height: 100 }; },
    };
  }
  const ids = ['cart-list', 'total-price', 'cart-badge', 'mobile-cart-fab', 'cart-sidebar',
    'main-content', 'landing-page', 'hero-scroller', 'rice-grid', 'ulam-grid', 'drinks-grid',
    'modal', 'cust-name', 'qrcode', 'summary', 'search-input', 'page-wrapper', 'fab-btn',
    'cart-overlay', 'cart-countdown', 'rice-section', 'ulam-section', 'drinks-section', 'menu-results'];
  const elements = Object.fromEntries(ids.map(id => [id, element()]));
  elements['total-price'].textContent = '₱0';
  const done = element('button');
  const entry = element('button');
  const cartClose = element('button');
  const searchClear = element('button');
  elements['cart-sidebar'].children.push(cartClose, elements['cust-name']);
  elements['cart-sidebar'].querySelector = selector => selector === '#cart-close-btn button' ? cartClose : null;
  elements.modal.querySelector = selector => selector === '.done-btn' ? done : null;
  elements['landing-page'].querySelector = selector => selector === '.order-now-btn' ? entry : null;
  const context = vm.createContext({
    document: {
      get activeElement() { return activeElement; },
      body: element('body'),
      getElementById(id) { assert.ok(elements[id], `Unexpected element ${id}`); return elements[id]; },
      createElement: element,
      querySelector: selector => selector === '#modal .done-btn' ? done : selector === '.search-clear' ? searchClear : null,
      addEventListener(name, callback) {
        if (!listeners.has(name)) listeners.set(name, []);
        listeners.get(name).push(callback);
      },
    },
    window: {
      innerWidth: 400,
      addEventListener(name, callback) {
        if (!windowListeners.has(name)) windowListeners.set(name, []);
        windowListeners.get(name).push(callback);
      },
    },
    Date: { now: () => now },
    setTimeout: callback => timers.push(callback),
    clearTimeout() {},
    setInterval() { return 1; },
    clearInterval() {},
    requestAnimationFrame(callback) { const id = ++nextFrame; frames.set(id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    fetch() { assert.fail('The demo must not submit a network request'); },
  });
  vm.runInContext(source, context, { filename: 'mix-match-kain/script.js' });
  return {
    elements, frames, timers, done, entry, cartClose,
    get activeElement() { return activeElement; },
    run: code => vm.runInContext(code, context),
    inline() { vm.runInContext(inlineSource, context, { filename: 'mix-match-kain/index.html' }); },
    resize(width) {
      vm.runInContext(`window.innerWidth = ${Number(width)}`, context);
      for (const callback of windowListeners.get('resize') || []) callback();
    },
    ready() { for (const callback of listeners.get('DOMContentLoaded') || []) callback(); },
    frame(time) {
      now = time;
      const current = [...frames.values()];
      frames.clear();
      current.forEach(callback => callback(time));
    },
    setTime(time) { now = time; },
  };
}

test('removing the final cart item invalidates a pending total animation', () => {
  const page = harness();
  page.run('cart.push({ ...riceMenu[0], qty: 1 }); updateCart();');
  const staleCallback = [...page.frames.values()][0];
  assert.equal(page.frames.size, 1);
  page.run('changeQty(0, -1);');
  assert.equal(page.frames.size, 0);
  assert.equal(page.elements['total-price'].textContent, '₱0');
  // Even a callback already dequeued by the browser cannot restore a removed total.
  page.setTime(600);
  staleCallback();
  assert.equal(page.elements['total-price'].textContent, '₱0');
  assert.equal(page.elements['cart-badge'].textContent, '0');
  assert.equal(page.elements['total-price'].classList.contains('updating'), false);
});

test('rapid quantity changes settle on the current cart total', () => {
  const page = harness();
  page.run('cart.push({ ...riceMenu[0], qty: 1 }); updateCart();');
  page.frame(300);
  assert.equal(page.elements['total-price'].textContent, '₱5');
  page.run('changeQty(0, 1);');
  assert.equal(page.frames.size, 1);
  page.frame(900);
  assert.equal(page.elements['total-price'].textContent, '₱20');
  assert.equal(page.run('cart[0].qty'), 2);
  assert.equal(page.frames.size, 0);
});

test('quantity controls retain keyboard focus after rebuilding or removing a cart row', () => {
  const page = harness();
  const requested = [];
  const replacement = page.cartClose;
  page.elements['cart-list'].querySelector = selector => { requested.push(selector); return replacement; };
  page.run('cart.push({ ...riceMenu[0], qty: 1 }, { ...drinksMenu[0], qty: 1 }); const quantityControl = document.createElement("button"); quantityControl.focus(); changeQty(0, 1, quantityControl);');
  assert.equal(page.activeElement, replacement);
  assert.match(requested.at(-1), /data-item-id="1".*data-qty-delta="1"/);
  page.run('quantityControl.focus(); changeQty(0, -1, quantityControl); quantityControl.focus(); changeQty(0, -1, quantityControl);');
  assert.match(requested.at(-1), /data-item-id="10"/);
  assert.equal(page.activeElement, replacement);
  page.run('quantityControl.focus(); changeQty(0, -1, quantityControl);');
  assert.equal(page.activeElement, page.elements['cust-name']);
  assert.equal(page.run('cart.length'), 0);
});

test('cart updates do not steal focus from another input', () => {
  const page = harness();
  page.elements['cust-name'].focus();
  page.elements['cart-list'].querySelector = () => assert.fail('Unfocused updates must not move keyboard focus');
  page.run('cart.push({ ...riceMenu[0], qty: 1 }); changeQty(0, 1, document.createElement("button"));');
  assert.equal(page.activeElement, page.elements['cust-name']);
});

test('keyboard interaction cancels the mobile cart auto-close countdown', () => {
  const page = harness();
  page.inline();
  page.run('openCartDrawer();');
  assert.notEqual(page.run('_autoCloseTimer'), null);
  page.elements['cart-sidebar'].dispatch('keydown', { key: 'Tab' });
  assert.equal(page.run('_autoCloseTimer'), null);
  assert.equal(page.run('_timerAnimation'), null);
  assert.equal(page.elements['cart-sidebar'].classList.contains('drawer-open'), true);
});

test('menu initialization renders named native food buttons immediately', () => {
  const page = harness();
  page.ready();
  const riceButtons = page.elements['rice-grid'].children;
  assert.equal(riceButtons.length, 2);
  assert.equal(riceButtons[0].tagName, 'BUTTON');
  assert.equal(riceButtons[0].type, 'button');
  assert.equal(riceButtons[0].attributes['aria-label'], 'Add Classic Rice, ₱10, to demo cart');
  assert.equal(typeof riceButtons[0].onclick, 'function');
  assert.match(page.elements['hero-scroller'].innerHTML, /Classic Rice/);
  assert.doesNotMatch(html, /startPrank|SYSTEM_FAILURE|main_logic\.js|id="error-screen"/);
});

test('categories use native toggle buttons and disclose demo before entry', () => {
  const categories = [...html.matchAll(/<button\b([^>]*class="category-tab[^>]*)>/g)];
  assert.equal(categories.length, 4);
  for (const [, attrs] of categories) {
    assert.match(attrs, /type="button"/);
    assert.match(attrs, /aria-pressed="(?:true|false)"/);
  }
  assert.ok(html.indexOf('No real orders or payments are sent.') < html.indexOf('TRY DEMO MENU'));
  assert.match(html, /tab\.setAttribute\('aria-pressed', String\(selected\)\)/);
});

test('menu search announces empty and filtered results and clear restores the selected category', () => {
  const page = harness();
  page.ready();
  for (const id of ['rice-grid', 'ulam-grid', 'drinks-grid']) {
    const grid = page.elements[id];
    grid.querySelectorAll = () => grid.children;
  }
  page.inline();
  page.run('handleSearch("zzzzzz");');
  assert.match(page.elements['menu-results'].textContent, /No matching items/);
  for (const id of ['rice-section', 'ulam-section', 'drinks-section']) assert.equal(page.elements[id].style.display, 'none');
  page.run('handleSearch("  water  ");');
  assert.match(page.elements['menu-results'].textContent, /^1 menu item /);
  assert.equal(page.elements['drinks-section'].style.display, 'block');
  assert.equal(page.elements['rice-section'].style.display, 'none');
  page.run('currentCategory = "rice"; clearSearch();');
  assert.equal(page.elements['menu-results'].textContent, '2 menu items available.');
  assert.equal(page.elements['rice-section'].style.display, 'block');
  assert.equal(page.elements['drinks-section'].style.display, 'none');
  assert.equal(page.activeElement, page.elements['search-input']);
});

test('checkout creates a local demo summary without a QR dependency or submission', () => {
  const page = harness();
  page.run('createConfetti = () => {}; cart.push({ ...riceMenu[0], qty: 2 });');
  page.elements['cust-name'].value = 'Sample Guest';
  page.run('generateQR();');
  assert.equal(page.elements.qrcode.textContent, 'DEMO ONLY · NO PAYMENT');
  assert.match(page.elements.summary.innerHTML, /SAMPLE GUEST/);
  assert.match(page.elements.summary.innerHTML, /&#8369;20/);
  assert.equal(page.elements['main-content'].inert, true);
  page.timers[0]();
  assert.equal(page.done.focused, true);
  assert.match(html, /No order is submitted and no payment is available/);
  assert.doesNotMatch(source, /new QRCode|sendOrderToServer|09618866276/);
});

test('entry and reset move keyboard focus to the active screen', () => {
  const page = harness();
  page.run('goToMenu();');
  assert.equal(page.elements['landing-page'].inert, true);
  page.timers[0]();
  assert.equal(page.elements['main-content'].classList.contains('enter-3d'), true);
  assert.equal(page.elements['search-input'].focused, true);
  page.run('cart.push({ ...riceMenu[0], qty: 1 }); updateCart(); closeModal();');
  page.timers.at(-1)();
  assert.equal(page.run('cart.length'), 0);
  assert.equal(page.elements['total-price'].textContent, '₱0');
  assert.equal(page.frames.size, 0);
  assert.equal(page.elements['landing-page'].inert, false);
  assert.equal(page.elements['main-content'].classList.contains('enter-3d'), false);
  assert.equal(page.entry.focused, true);
});

test('closed mobile drawer is inert and open/close restores the cart trigger', () => {
  const page = harness();
  page.inline();
  assert.equal(page.elements['cart-sidebar'].inert, true);
  page.run('openCartDrawer();');
  assert.equal(page.elements['cart-sidebar'].inert, false);
  assert.equal(page.elements['mobile-cart-fab'].inert, true);
  assert.equal(page.elements['mobile-cart-fab'].attributes['aria-expanded'], 'true');
  assert.equal(page.activeElement, page.cartClose);
  page.run('closeCartDrawer();');
  assert.equal(page.elements['cart-sidebar'].inert, true);
  assert.equal(page.elements['mobile-cart-fab'].inert, false);
  assert.equal(page.elements['mobile-cart-fab'].attributes['aria-expanded'], 'false');
  assert.equal(page.activeElement, page.elements['mobile-cart-fab']);
});

test('responsive drawer exposes desktop controls and hides closed mobile controls', () => {
  const page = harness();
  page.inline();
  page.resize(1200);
  assert.equal(page.elements['cart-sidebar'].inert, false);
  page.elements['cust-name'].focus();
  page.resize(400);
  assert.equal(page.elements['cart-sidebar'].inert, true);
  assert.equal(page.activeElement, page.elements['mobile-cart-fab']);
  page.run('openCartDrawer();');
  page.resize(1200);
  assert.equal(page.elements['cart-sidebar'].inert, false);
  assert.equal(page.elements['cart-sidebar'].classList.contains('drawer-open'), false);
  assert.equal(page.elements['mobile-cart-fab'].inert, false);
  assert.equal(page.elements['mobile-cart-fab'].attributes['aria-expanded'], 'false');
});

test('preview inerts every background control and retains Tab focus until reset', () => {
  const page = harness();
  page.inline();
  page.ready();
  page.run('createConfetti = () => {}; cart.push({ ...riceMenu[0], qty: 1 });');
  page.elements['cust-name'].value = 'Sample';
  page.run('openCartDrawer(); generateQR();');
  assert.equal(page.activeElement, page.done);
  assert.equal(page.elements['page-wrapper'].inert, true);
  assert.equal(page.elements['fab-btn'].inert, true);
  assert.equal(page.elements['cart-sidebar'].inert, true);
  let prevented = false;
  page.elements.modal.dispatch('keydown', { key: 'Tab', shiftKey: true, preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(page.activeElement, page.done);
  page.elements.modal.dispatch('keydown', { key: 'Escape' });
  assert.equal(page.elements['page-wrapper'].inert, true);
  page.timers.at(-1)();
  assert.equal(page.elements['page-wrapper'].inert, false);
  assert.equal(page.elements['fab-btn'].inert, false);
  assert.equal(page.activeElement, page.entry);
});
