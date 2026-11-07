import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/js/phone-welcome.js', import.meta.url), 'utf8');

function setup({ ua = 'iPhone', mobile, stored = false, deniedStorage = false, deniedClipboard = false, dialogSupported = true } = {}) {
  const classes = new Set(), events = [], children = [], storage = new Map();
  if (stored) storage.set('thefrans:phone-welcome:v1', 'continued');
  const node = () => ({ handlers: {}, addEventListener(event, fn) { this.handlers[event] = fn; }, textContent: '' });
  const copy = node(), proceed = node(), status = node();
  const input = { focused: false, selected: false, focus() { this.focused = true; }, select() { this.selected = true; } };
  const fallback = { hidden: true, querySelector: () => input };
  const dialog = { ...node(), open: false, setAttribute() {},
    querySelector: selector => ({ '.phone-welcome-copy': copy, '.phone-welcome-continue': proceed, '.phone-welcome-status': status, '.phone-welcome-fallback': fallback })[selector],
    close() { this.open = false; this.handlers.close(); }
  };
  if (dialogSupported) dialog.showModal = function() { this.open = true; };
  let copied;
  const context = {
    navigator: { userAgent: ua, userAgentData: mobile === undefined ? undefined : { mobile }, clipboard: { async writeText(value) { if (deniedClipboard) throw Error('Denied'); copied = value; } } },
    sessionStorage: { getItem(key) { if (deniedStorage) throw Error('Denied'); return storage.get(key); }, setItem(key, value) { if (deniedStorage) throw Error('Denied'); storage.set(key, value); } },
    document: { createElement: () => dialog, body: { append: child => children.push(child) }, documentElement: { classList: { add: value => classes.add(value), remove: value => classes.delete(value) } }, dispatchEvent: event => events.push(event.type) },
    CustomEvent: class { constructor(type) { this.type = type; } }
  };
  const run = () => vm.runInNewContext(source, context);
  run();
  return { dialog, copy, proceed, status, input, fallback, children, classes, events, storage, run, get copied() { return copied; } };
}

test('phone browsers get the welcome while desktop browsers and unsupported dialogs stay accessible', () => {
  for (const ua of ['Windows NT 10.0', 'Macintosh; Intel Mac OS X', 'X11; Linux x86_64', 'iPad']) assert.equal(setup({ ua }).children.length, 0);
  for (const options of [{ ua: 'iPhone' }, { ua: 'Android 15; Mobile' }, { ua: 'Android', mobile: true }]) {
    const h = setup(options);
    assert.equal(h.dialog.open, true);
    assert.equal(h.classes.has('phone-welcome-open'), true);
  }
  assert.equal(setup({ dialogSupported: false }).children.length, 0);
  assert.equal(setup({ stored: true }).children.length, 0);
});

test('continuing closes the welcome, unlocks the page, and remembers the choice in this session', () => {
  const h = setup();
  h.proceed.handlers.click();
  assert.equal(h.dialog.open, false);
  assert.equal(h.classes.has('phone-welcome-open'), false);
  assert.deepEqual(h.events, ['portfolio-welcome-close']);
  h.run();
  assert.equal(h.children.length, 1);
});

test('Escape remains an exit even when browser storage is disabled', () => {
  const h = setup({ deniedStorage: true });
  let prevented = false;
  h.dialog.handlers.cancel({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(h.dialog.open, false);
  assert.equal(h.classes.has('phone-welcome-open'), false);
});

test('copy uses the public portfolio URL and offers manual copying if clipboard access fails', async () => {
  const success = setup();
  await success.copy.handlers.click();
  assert.equal(success.copied, 'https://thefrans.vercel.app/');
  assert.match(success.status.textContent, /Link copied/);
  assert.equal(success.dialog.open, true);
  const failure = setup({ deniedClipboard: true });
  await failure.copy.handlers.click();
  assert.equal(failure.fallback.hidden, false);
  assert.equal(failure.input.focused && failure.input.selected, true);
  failure.proceed.handlers.click();
  assert.equal(failure.dialog.open, false);
});
