## 2026-05-20 - Animation and Layout Optimization in Vanilla JS Portfolio

**Learning:** High-frequency event listeners (scroll, mousemove) that update layout-triggering properties (width, left, top) cause significant layout thrashing and CPU load. Switching to GPU-accelerated transforms (translate3d, scaleX) and decoupling visual updates from input events using requestAnimationFrame (rAF) dramatically improves rendering performance. Additionally, repeated calls to getBoundingClientRect() during mousemove can be cached on mouseenter/scroll/resize to avoid expensive synchronous layout reflows.

**Action:** Always prefer CSS transforms for animations. Use translate3d for hardware acceleration even for 2D movements. Decouple input handling from rendering via rAF loops. Cache layout values when they are accessed repeatedly in high-frequency loops and invalidate the cache only on relevant layout changes.
