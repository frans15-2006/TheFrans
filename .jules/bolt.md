## 2026-06-08 - Optimize Cart Updates and DOM Lookups
**Learning:** Using `innerHTML +=` inside a loop causes the browser to re-parse the entire DOM tree of the target element on every iteration, leading to (n^2)$ complexity and layout thrashing. Batching updates into a single string and using cached DOM references significantly reduces overhead.
**Action:** Always build HTML strings or use DocumentFragments for batch updates, and cache frequently accessed DOM elements at the top level or during initialization.
