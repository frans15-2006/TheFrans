## 2025-05-26 - Optimized DOM rendering in Vanilla JS
**Learning:** Using `innerHTML +=` inside a loop is a significant performance anti-pattern. It causes the browser to re-serialize, concatenate, and re-parse the entire container's HTML on every iteration, leading to O(n²) complexity.
**Action:** Always batch DOM updates by building the complete HTML string first and performing a single `innerHTML` assignment at the end of the loop.
