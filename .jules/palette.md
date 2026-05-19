## 2026-05-19 - Keyboard Accessibility for Menu Interactions
**Learning:** Converting `div`-based interactive elements (like tabs and product cards) to `button` elements is the most robust way to ensure keyboard accessibility (tabbing and Enter/Space support). However, this requires a surgical CSS reset (removing `background`, `border`, and `padding`, and inheriting `font` and `color`) to maintain the original design while providing native interactivity.

**Action:** Always prefer native `<button>` or `<a>` tags for interactive elements and include a global or scoped CSS reset to keep the visual identity intact while gaining accessibility for free.
