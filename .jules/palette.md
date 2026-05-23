## 2025-05-17 - Enhancing Gallery and Global Keyboard UX

**Learning:** Converting `div`-based interactive elements to `button` elements is essential for keyboard accessibility, but requires a deliberate CSS reset (border, background, padding, font) to avoid breaking the intended design. Furthermore, custom cursor implementations often neglect keyboard users; by tethering the cursor to `focus` events, you can provide the same level of "delight" and visual feedback to everyone, regardless of their input method.

**Action:** Always check for interactive `div` or `a` elements that should be semantic `button`s. Ensure that any "hover-only" visual feedback (like overlays or custom cursors) is also triggered by `focus` or `focus-visible`.
