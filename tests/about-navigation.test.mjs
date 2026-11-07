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
