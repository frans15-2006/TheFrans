## 2025-05-15 - Optimizing High-Frequency Event Handlers

**Learning:** High-frequency event handlers (mouse move, scroll) can cause significant layout thrashing if they access layout properties like `getBoundingClientRect`, `scrollHeight`, or `innerHeight` directly. Additionally, using `left`/`top` for positioning interactive elements like custom cursors triggers expensive layout and paint cycles compared to hardware-accelerated `translate3d` transforms.

**Action:**
1. Always use `translate3d` for elements that follow the mouse or animate frequently to stay on the compositor thread.
2. Cache layout properties (e.g., `scrollHeight`, `getBoundingClientRect`) on less frequent events like `load`, `resize`, or `mouseenter` instead of accessing them during every `scroll` or `mousemove` event.
3. Consolidate multiple scroll or resize listeners into a single passive listener to reduce overhead.
