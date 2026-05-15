## 2025-05-22 - [Accessibility: Interactive Divs]
**Learning:** In vanilla JS projects, interactive elements are often implemented as `div` tags with click handlers. While visually correct, these lack keyboard focus and semantic meaning for screen readers. Converting these to `button` elements is the most robust fix but requires a CSS reset to maintain the intended visual design.
**Action:** Always check for interactive `div` elements and convert them to `button` tags with `type="button"`. Apply a global `button { background: none; border: none; padding: 0; font: inherit; }` reset to prevent styling regressions.

## 2025-05-22 - [ARIA: Live Regions for Dynamic UI]
**Learning:** For single-page applications or dynamic interfaces like shopping carts, visual updates are not automatically announced. Using `aria-live="polite"` on total price and item lists ensures screen reader users are notified of changes as they happen.
**Action:** Use `aria-live="polite"` for any UI element that updates dynamically in response to user actions (e.g., cart totals, search results counts).
