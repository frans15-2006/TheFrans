## 2025-05-15 - [Optimization: Compositor-only properties for interactions]
**Learning:** Using layout-triggering properties like `width`, `left`, and `top` for high-frequency updates (scroll, mousemove, animation frames) causes frequent reflows and layout thrashing, which can lead to jank on low-resource environments.
**Action:** Prefer compositor-only properties like `transform: translate3d()` and `transform: scaleX()` combined with `will-change: transform`. This offloads the work to the GPU and avoids main-thread layout work.
