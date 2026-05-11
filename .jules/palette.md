## 2025-05-15 - [Accessible Semantic Components]
**Learning:** Using `<div>` for interactive elements (like product cards) breaks native keyboard accessibility. Converting them to `<button>` elements provides built-in focus management and keyboard interaction (Enter/Space) without extra JS overhead.
**Action:** Always prefer semantic HTML elements (`<button>`, `<a>`) for interactive components and ensure they have descriptive `aria-label` attributes if they contain icon-only or visual-heavy content.

## 2025-05-15 - [Themed Scrollbars vs. Hidden Scrollbars]
**Learning:** Hiding scrollbars (`display: none`) removes a critical visual cue for content overflow and can make navigation difficult on non-touch devices. A subtle, themed scrollbar maintains usability while preserving the design's aesthetic.
**Action:** Instead of hiding scrollbars, apply custom CSS styles to match the application's theme while keeping them functional.
