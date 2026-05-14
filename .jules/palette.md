## 2025-05-15 - Enhancing Keyboard Accessibility in Vanilla JS

**Learning:** Converting `div`-based interactive elements to semantic `button` elements is the most robust way to provide keyboard support, but requires a CSS reset for background, border, and font to avoid UI regressions. Dynamic `aria-label` attributes on generated components (like food cards) provide essential context that text-only content might miss for screen readers.

**Action:** Always prefer `<button>` for clickable items and ensure `focus-visible` styles are implemented to support tab-based navigation.
