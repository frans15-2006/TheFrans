## 2026-02-12 - DOM Manipulation Anti-patterns
**Learning:** In `mix-match-kain/script.js`, the `updateCart` function used `innerHTML +=` inside a `forEach` loop. This causes the browser to re-parse the entire HTML content of the container on every iteration, leading to O(n²) rendering overhead. Similarly, `createParticles` was appending elements to the container individually in a loop, triggering multiple reflows.
**Action:** Always accumulate HTML strings or use `DocumentFragment` when creating multiple DOM elements in a loop to ensure O(n) performance and minimize layout thrashing.
