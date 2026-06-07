## 2026-06-07 - Batching DOM Updates
**Learning:** Using `innerHTML +=` inside a loop causes the browser to re-parse the entire container's HTML on every iteration, leading to O(n²) complexity and excessive layout thrashing.
**Action:** Always build the full HTML string first and set `innerHTML` once, or use `DocumentFragment` for batching node insertions.
