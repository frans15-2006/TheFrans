# Palette's UX Journal

## 2025-05-21 - Initializing UX Journal
**Learning:** UX improvements should be documented to ensure consistency and share insights across the team. Accessibility is a key part of micro-UX.
**Action:** Always check for keyboard navigation and screen reader support when adding "delightful" touches.

## 2025-05-21 - Synchronizing Custom Cursors with Keyboard Focus
**Learning:** When using a custom cursor that replaces the default pointer, it's critical to synchronize its position with the keyboard focus. If the cursor stays at the last mouse position while the user tabs through the site, it creates a disconnected experience. Moving the custom cursor to the center of the focused element provides visual continuity and reinforces the "hover" state for keyboard users.
**Action:** Always implement `focusin` listeners to move custom cursors to the active element's coordinates and trigger "hovering" visual states.
