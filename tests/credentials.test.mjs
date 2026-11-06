import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import Fuse from '../assets/vendor/fuse.min.mjs';

const source = readFileSync(new URL('../assets/js/about.js', import.meta.url), 'utf8');
const constants = source.slice(source.indexOf('const CATEGORIES ='), source.indexOf('const FIELD_WORK ='));
const renderer = source.slice(source.indexOf('function renderCreds()'), source.indexOf('function renderFieldwork()'));
const credentials = JSON.parse(source.match(/const CREDENTIALS = (\[[\s\S]*?\]);/)[1]);

// Execute the production renderer and its event handlers; only the DOM and dialog
// shell are replaced. Search uses the same shipped Fuse library as the browser.
function gallery({ query = '', sort = 'date-desc', category = 'all' } = {}) {
  const nodes = new Map();
  const makeNode = id => ({
    id, value: id === 'cred-sort' ? sort : '', innerHTML: '', textContent: '',
    hidden: false, disabled: false, dataset: {}, attributes: {}, listeners: {},
    style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} },
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, handler) { this.listeners[name] = handler; },
    querySelectorAll() { return []; }, querySelector() { return { scrollTop: 0 }; }, focus() {},
  });
  const get = id => nodes.get(id) || (nodes.set(id, makeNode(id)), nodes.get(id));
  const url = new URL('https://thefrans.vercel.app/About/');
  if (query) url.searchParams.set('q', query);
  if (category !== 'all') url.searchParams.set('category', category);
  url.searchParams.set('sort', sort);
  let scheduledRender;
  const window = {
    location: { href: url.href, search: url.search },
    history: { state: null, replaceState() {} }, addEventListener() {},
    A11yDialog: class { on() {} show() {} hide() {} },
  };
  const document = { getElementById: get, body: { children: [] }, documentElement: makeNode('html') };
  const context = vm.createContext({
    window, document, URL, URLSearchParams, Fuse, Set, Map,
    lenis: { stop() {}, start() {} },
    setTimeout(callback) { scheduledRender = callback; return 1; }, clearTimeout() { scheduledRender = undefined; },
  });
  vm.runInContext(`${constants}\n${renderer}\nrenderCreds();`, context);
  const cardIds = () => [...get('cred-exhibits').innerHTML.matchAll(/data-idx="(\d+)"/g)].map(match => Number(match[1]));
  return {
    node: get,
    cards: () => cardIds().map(id => credentials[id]),
    search(value) {
      get('cred-search').value = value;
      get('cred-search').listeners.input();
      scheduledRender();
    },
    filter(value) {
      get('cred-chips').listeners.click({ target: { closest: () => ({ dataset: { filter: value } }) } });
    },
    sort(value) {
      get('cred-sort').value = value;
      get('cred-sort').listeners.change();
    },
    open(position) {
      const card = { dataset: { idx: String(cardIds()[position]) }, focus() {} };
      get('cred-exhibits').listeners.click({ target: { closest: () => card }, preventDefault() {} });
    },
    next() { get('cred-next').listeners.click({}); },
    previous() { get('cred-previous').listeners.click({}); },
    reset() { get('cred-reset').listeners.click(); },
    preview: () => get('cred-modal-title').textContent,
  };
}

test('numeric year search is exact and can recover after empty results', () => {
  const page = gallery();
  assert.equal(credentials.length, 31);
  assert.ok(credentials.every(item => item.dateISO.startsWith('2025-')));
  for (const year of ['2024', '2026']) {
    page.search(year);
    assert.equal(page.cards().length, 0, `${year} must not match 2025 certificates`);
    assert.match(page.node('cred-exhibits').innerHTML, /No certificates match/);
  }
  page.search('2025');
  assert.equal(page.cards().length, 31);
  page.search('XYZnope');
  assert.equal(page.cards().length, 0);
  page.search('');
  assert.equal(page.cards().length, 31);
});

test('text search retains exact and fuzzy title matches', () => {
  const page = gallery();
  const pythonTitles = credentials.filter(item => item.title.startsWith('Python Essentials')).map(item => item.title).sort();
  for (const query of ['Python Essentials', 'Pythn Essentials']) {
    page.search(query);
    assert.deepEqual(page.cards().filter(item => item.title.startsWith('Python Essentials')).map(item => item.title).sort(), pythonTitles);
  }
});

test('category filtering combines with year, date sorting, title sorting and reset', () => {
  const page = gallery({ query: '2025', category: 'web' });
  const expectedWebCount = credentials.filter(item => item.category === 'web').length;
  assert.equal(page.cards().length, expectedWebCount);
  for (const sort of ['date-desc', 'date-asc', 'title-asc']) {
    page.sort(sort);
    const cards = page.cards();
    assert.ok(cards.every(item => item.category === 'web'));
    for (let i = 1; i < cards.length; i++) {
      const comparison = sort === 'title-asc' ? cards[i - 1].title.localeCompare(cards[i].title) : Number(cards[i - 1].dateSort) - Number(cards[i].dateSort);
      assert.ok(sort === 'date-desc' ? comparison >= 0 : comparison <= 0);
    }
  }
  page.search('2026');
  assert.equal(page.cards().length, 0);
  page.reset();
  assert.equal(page.cards().length, 31);
  page.filter('cyber');
  assert.equal(page.cards().length, credentials.filter(item => item.category === 'cyber').length);
});

test('preview next and previous visit every visible card in gallery order for every sort', () => {
  for (const sort of ['date-desc', 'date-asc', 'title-asc']) {
    for (const category of ['all', 'web']) {
      const page = gallery({ sort, category });
      const cards = page.cards();
      page.open(0);
      assert.equal(page.node('cred-modal-position').textContent, `1 / ${cards.length}`);
      assert.equal(page.node('cred-previous').disabled, true);
      for (let i = 0; i < cards.length; i++) {
        assert.equal(page.preview(), cards[i].title, `${sort}/${category} card ${i + 1}`);
        assert.equal(page.node('cred-modal-position').textContent, `${i + 1} / ${cards.length}`);
        if (i < cards.length - 1) page.next();
      }
      assert.equal(page.node('cred-next').disabled, true);
      for (let i = cards.length - 2; i >= 0; i--) {
        page.previous();
        assert.equal(page.preview(), cards[i].title, `${sort}/${category} previous card ${i + 1}`);
      }
      assert.equal(page.node('cred-previous').disabled, true);
    }
  }
});
