## 2025-05-12 - Initial Performance Audit
**Learning:** Found several high-frequency event handlers (mousemove, scroll) that trigger layout recalculations by accessing properties like `scrollHeight` or `getBoundingClientRect()` repeatedly. Additionally, using `left`/`top` for custom cursor positioning causes layout thrashing as it affects the geometry of the page.
**Action:** Transition high-frequency animations to use `transform: translate3d` to leverage the GPU (compositor thread) and cache layout properties where possible.
