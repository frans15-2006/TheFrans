## 2025-05-15 - Optimizing High-Frequency Mouse Effects
**Learning:** `getBoundingClientRect()` forces synchronous layout (layout thrashing) when called inside high-frequency events like `mousemove`. In this portfolio site, multiple effects (Hero Canvas, Parallax, Magnetic Buttons, Card Tilt, Glow) were all calling it independently, leading to noticeable performance degradation during interactions.

**Action:** Cache absolute document coordinates (viewport offset + `window.scrollX/Y`) during `mouseenter` or `resize` events. Use these cached values in `mousemove` listeners along with `e.pageX/pageY` to eliminate layout thrashing while maintaining scroll-resiliency.
