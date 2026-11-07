(() => {
  'use strict';
  // Detect phone browsers rather than blocking narrow desktop windows.
  const isPhone = navigator.userAgentData?.mobile === true || /iPhone|iPod|Android.*Mobile/i.test(navigator.userAgent || '');
  if (!isPhone) return;
  const storageKey = 'thefrans:phone-welcome:v1';
  try { if (sessionStorage.getItem(storageKey) === 'continued') return; } catch {}

  const dialog = document.createElement('dialog');
  if (typeof dialog.showModal !== 'function') return;
  dialog.className = 'phone-welcome';
  dialog.setAttribute('aria-labelledby', 'phone-welcome-title');
  dialog.setAttribute('aria-describedby', 'phone-welcome-description');
  dialog.innerHTML = `
    <div class="phone-welcome-brand">TheFrans<span aria-hidden="true">.</span></div>
    <svg class="phone-welcome-icon" viewBox="0 0 64 56" fill="none" aria-hidden="true"><rect x="6" y="5" width="52" height="35" rx="5"/><path d="M22 51h20M32 40v11M18 18h12M18 25h22"/></svg>
    <p class="phone-welcome-kicker">Built for a bigger screen</p>
    <h2 id="phone-welcome-title">Experience the<br>full portfolio.</h2>
    <p id="phone-welcome-description">Best viewed on a laptop or desktop for the complete layout and motion.</p>
    <div class="phone-welcome-actions">
      <button class="phone-welcome-copy" type="button" autofocus>Copy portfolio link <span aria-hidden="true">↗</span></button>
      <button class="phone-welcome-continue" type="button">Continue on phone <span aria-hidden="true">→</span></button>
    </div>
    <p class="phone-welcome-status" role="status" aria-live="polite"></p>
    <label class="phone-welcome-fallback" hidden>Portfolio link<input type="text" value="https://thefrans.vercel.app/" readonly></label>
  `;
  const copy = dialog.querySelector('.phone-welcome-copy');
  const proceed = dialog.querySelector('.phone-welcome-continue');
  const status = dialog.querySelector('.phone-welcome-status');
  const fallback = dialog.querySelector('.phone-welcome-fallback');

  function dismiss() {
    try { sessionStorage.setItem(storageKey, 'continued'); } catch {}
    dialog.close();
  }
  proceed.addEventListener('click', dismiss);
  dialog.addEventListener('cancel', event => { event.preventDefault(); dismiss(); });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('phone-welcome-open');
    document.dispatchEvent(new CustomEvent('portfolio-welcome-close'));
  });
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('https://thefrans.vercel.app/');
      status.textContent = 'Link copied. Open it on your computer.';
    } catch {
      fallback.hidden = false;
      const input = fallback.querySelector('input');
      input.focus(); input.select();
      status.textContent = 'Select and copy the link below.';
    }
  });
  document.body.append(dialog);
  dialog.showModal();
  document.documentElement.classList.add('phone-welcome-open');
})();
