## 2025-05-09 - [Cursor Performance Optimization]
**Learning:** High-frequency events like `mousemove` that update layout-triggering properties (`left`, `top`) cause significant main-thread work and can drop frames. Using `requestAnimationFrame` and `transform: translate3d()` ensures updates are throttled to the display refresh rate and handled by the compositor thread.
**Action:** Always prefer `transform` over `left`/`top` for animations and move high-frequency DOM updates into a `requestAnimationFrame` loop.
