## 2025-05-17 - Layout Thrashing and Compositor Optimization

**Learning:** Caching `getBoundingClientRect` results for elements that are repeatedly queried (e.g., in a `mousemove` handler) prevents forced synchronous layouts (layout thrashing). Additionally, using compositor-friendly properties like `transform` (with `translate3d` or `scaleX`) instead of layout-triggering properties like `top`, `left`, or `width` significantly improves frame rates for high-frequency animations.

**Action:** Always cache layout measurements during frequent events like `mousemove` or `scroll`, and prefer `transform` for all animations to keep them on the compositor thread. Use `translate3d` to force GPU acceleration when possible.
