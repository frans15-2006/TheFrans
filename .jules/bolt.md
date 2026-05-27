## 2026-05-21 - Batching DOM Updates
**Learning:** Using `innerHTML +=` inside a loop leads to $O(n^2)$ performance because the browser re-parses and re-renders the entire content on every iteration. Similarly, individual `appendChild` calls in high-frequency loops (like particle systems or large grids) can cause excessive layout thrashing.
**Action:** Always batch DOM updates by building a single HTML string or using a `DocumentFragment` to perform a single insertion into the live DOM.
