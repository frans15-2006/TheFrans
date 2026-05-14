## 2025-05-14 - Caching Layout Properties for High-Frequency Events

**Learning:** Accessing properties that trigger layout (like `getBoundingClientRect()`, `offsetWidth`, `scrollHeight`) inside high-frequency event listeners (like `mousemove`, `scroll`, `resize`) causes layout thrashing and degrades performance.

**Action:** Cache these properties on less frequent events (like `mouseenter`, `load`, or `resize`) and use the cached values in the high-frequency listeners. Always ensure the cache is invalidated or updated when the layout actually changes (e.g., on window `resize`).
