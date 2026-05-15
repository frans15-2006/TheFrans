## 2025-05-15 - GPU-Accelerated Layout & Asset Deferral

**Learning:** Using `transform` (like `scaleX` or `translate3d`) instead of properties like `width`, `left`, or `top` triggers hardware acceleration and avoids expensive layout/paint cycles. Additionally, deferring large images (like 2MB+ JPEGs) using `loading="lazy"` and `decoding="async"` significantly improves initial page load and Time to Interactive (TTI).

**Action:** Always prefer CSS transforms for high-frequency animations (scroll, cursor) and ensure large non-critical assets are loaded lazily.
