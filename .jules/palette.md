## 2025-05-15 - Improving Menu Keyboard Accessibility
**Learning:** Using generic `div` elements with `onclick` handlers for interactive UI components (like category tabs or food cards) breaks keyboard navigation and screen reader support. Converting these to semantic `button` elements with a proper CSS reset maintains the visual design while providing native focusability and accessibility.
**Action:** Always prefer semantic `<button type="button">` for custom interactive components and use `:focus-visible` for themed focus indicators.
