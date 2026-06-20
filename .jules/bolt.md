## 2025-05-22 - Optimizing DOM updates and animations in Mix & Match Kain

**Learning:** Using `innerHTML +=` within a loop causes the browser to re-parse and re-render the entire content of the element for every iteration, which is highly inefficient for large lists. Batching these updates into a single string and setting `innerHTML` once significantly improves performance. Additionally, high-frequency UI updates (like total price count-ups) that use `requestAnimationFrame` can lead to race conditions if multiple animation instances overlap.

**Action:** Always prefer batching DOM updates using string joining or `DocumentFragment`. For `requestAnimationFrame` animations, ensure to track the request ID and use `cancelAnimationFrame` to clean up previous instances before starting a new one.
