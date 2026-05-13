## 2026-05-13 - Semantic Button Conversion & Keyboard Visibility
**Learning:** Converting `div`-based interactive elements to `button` elements provides native keyboard support (Tab/Enter/Space) but requires a CSS reset (background, border, font) and explicit `:focus-visible` styling to maintain visual consistency while ensuring accessibility.
**Action:** Always prefer semantic `<button>` for click actions. Apply a base reset and clear `:focus-visible` indicators to ensure high-visibility keyboard navigation without cluttering the mouse experience.
