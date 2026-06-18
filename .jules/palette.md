## 2026-05-26 - Keyboard Accessibility for Category Tabs
**Learning:** Using `div` elements for interactive tabs makes them invisible to keyboard users and screen readers. Converting these to semantic `<button>` elements immediately enables standard keyboard interaction (Tab, Space, Enter) and provides better accessibility with minimal CSS adjustments (like `appearance: none`).
**Action:** Always prefer semantic `<button>` or `<a>` elements for interactive UI components rather than attaching click handlers to generic `div` or `span` elements.
