## 2025-06-15 - DOM Batching and Animation Cycle Management
**Learning:** In high-frequency UI updates like price counters and list rendering, using `innerHTML +=` inside loops causes O(n²) re-parsing overhead. Overlapping `requestAnimationFrame` cycles can lead to race conditions and jitter.
**Action:** Always batch DOM updates by constructing full HTML strings first (e.g., using `.map().join('')`) or using `DocumentFragment` for batched element insertions. Explicitly manage animation lifecycles using `cancelAnimationFrame` before starting new cycles.
