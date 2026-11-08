import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/js/about.js', import.meta.url), 'utf8');
const resolver = source.slice(source.indexOf('function resolveActiveSection()'), source.indexOf('function updateActiveTab()'));

test('About selects the short final chapter at page end on a tall screen', () => {
  const sectionIds = ['hero', 's-fieldwork', 's-fieldkit'];
  const bounds = { hero: { top: -7000, bottom: -5800 }, 's-fieldwork': { top: -2100, bottom: 626 }, 's-fieldkit': { top: 626, bottom: 1090 } };
  const window = { innerHeight: 1200, scrollY: 7790 };
  const context = vm.createContext({ sectionIds, window, document: { documentElement: { scrollHeight: 9000 }, getElementById: id => ({ getBoundingClientRect: () => bounds[id] }) } });
  vm.runInContext(resolver, context);
  assert.equal(vm.runInContext('resolveActiveSection()', context), 's-fieldwork');
  window.scrollY = 7800;
  assert.equal(vm.runInContext('resolveActiveSection()', context), 's-fieldkit');
  window.scrollY = 0;
  bounds.hero = { top: 0, bottom: 1200 };
  assert.equal(vm.runInContext('resolveActiveSection()', context), 'hero');
});

test('resizing realigns the same active About chapter when the horizontal menu gets narrower', () => {
  const scrolls = [];
  const strip = { clientWidth: 900, scrollTo: options => scrolls.push(options) };
  const compactNavigation = { matches: false };
  const tabs = ['hero', 's-fieldkit'].map(id => ({ dataset: { target: id }, classList: { toggle() {} }, setAttribute() {} }));
  const tabByTarget = new Map([['s-fieldkit', { offsetLeft: 700, offsetWidth: 100 }]]);
  const fn = source.slice(source.indexOf('function setActiveTab('), source.indexOf('function resolveActiveSection()'));
  const context = vm.createContext({ tabs, tabStrip: strip, compactNavigation, tabByTarget, motionPreference: { matches: false } });
  vm.runInContext('let activeSectionId = null;\n' + fn, context);
  vm.runInContext('setActiveTab("s-fieldkit");', context);
  assert.equal(scrolls.length, 0);
  compactNavigation.matches = true;
  strip.clientWidth = 375;
  vm.runInContext('setActiveTab("s-fieldkit", true);', context);
  assert.equal(scrolls.at(-1).left, 562.5);
  assert.equal(scrolls.at(-1).behavior, 'auto');
  vm.runInContext('setActiveTab("s-fieldkit");', context);
  assert.equal(scrolls.length, 1, 'normal scroll events should not restart horizontal alignment');
  strip.clientWidth = 320;
  vm.runInContext('setActiveTab("s-fieldkit", true);', context);
  assert.equal(scrolls.at(-1).left, 590);
});

test('About uses the latest motion preference when centering a new chapter', () => {
  let lastScroll;
  const motionPreference = { matches: false };
  const fn = source.slice(source.indexOf('function setActiveTab('), source.indexOf('function resolveActiveSection()'));
  const context = vm.createContext({
    tabs: [], compactNavigation: { matches: true }, motionPreference,
    tabStrip: { clientWidth: 320, scrollTo: options => { lastScroll = options; } },
    tabByTarget: new Map(['hero', 's-fieldkit'].map(id => [id, { offsetLeft: 700, offsetWidth: 100 }]))
  });
  vm.runInContext('let activeSectionId = null;\n' + fn + '\nsetActiveTab("hero");', context);
  assert.equal(lastScroll.behavior, 'smooth');
  motionPreference.matches = true;
  vm.runInContext('setActiveTab("s-fieldkit");', context);
  assert.equal(lastScroll.behavior, 'auto');
});
