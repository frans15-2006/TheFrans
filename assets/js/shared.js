(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function createScroller({ lightMotion, options = {} }) {
    if (!lightMotion && window.Lenis && window.gsap && window.ScrollTrigger) {
      const instance = new window.Lenis({ autoRaf: false, syncTouch: false, ...options });
      const tick = time => instance.raf(time * 1000);
      instance.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(tick);
      window.gsap.ticker.lagSmoothing(0);
      // Browser navigation and BFCache retain their native lifecycle.
      window.addEventListener('pagehide', () => { window.gsap.ticker.remove(tick); instance.stop(); });
      window.addEventListener('pageshow', event => { if (event.persisted) { window.gsap.ticker.add(tick); instance.start(); window.ScrollTrigger.refresh(); } });
      return instance;
    }
    return {
      on() {}, start() {}, stop() {},
      scrollTo(target, options = {}) {
        const node = typeof target === 'string' ? document.querySelector(target) : target;
        if (node === null || node === undefined) return;
        const top = typeof node === 'number' ? node : node.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + (options.offset || 0), behavior: reduced ? 'auto' : 'smooth' });
      }
    };
  }
  document.querySelectorAll('[data-copy-email]').forEach(button => {
    button.addEventListener('click', async () => {
      const status = document.getElementById(button.getAttribute('aria-describedby'));
      try {
        await navigator.clipboard.writeText('francistarectican47@gmail.com');
        if (status) status.textContent = 'Email copied';
      } catch { if (status) status.textContent = 'francistarectican47@gmail.com'; }
    });
  });
  window.Portfolio = { createScroller };
})();
