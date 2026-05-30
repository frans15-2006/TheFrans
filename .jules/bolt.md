## 2026-05-30 - DOM Batching and Animation Sync
**Learning:** High-frequency UI updates like adding items to a cart or rendering particle systems can cause layout thrashing and unnecessary re-parsing if DOM updates aren't batched. Overlapping JavaScript animations on the same element (e.g., a price count-up) can lead to race conditions and visual jitters if not properly canceled before a new cycle starts.
**Action:** Use string joining or DocumentFragments for batch DOM updates. Always use cancelAnimationFrame with a tracked ID before starting a new animation cycle on a shared element.
