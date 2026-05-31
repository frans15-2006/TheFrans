# Bolt's Performance Journal

## 2025-05-15 - Batch DOM Updates
**Learning:** Frequent DOM manipulations (like `appendChild` or `innerHTML +=` inside a loop) cause multiple reflows and repaints, leading to $O(n^2)$ re-parsing overhead. Batching these updates using string concatenation or `DocumentFragment` significantly improves performance.
**Action:** Always build HTML strings or use `DocumentFragment` to update the DOM once after a loop finishes.
