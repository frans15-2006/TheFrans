## 2025-05-15 - [Search Empty States]
**Learning:** In filtered grid interfaces, displaying empty category headers during a search that yields no results creates visual clutter and user confusion. A dedicated "No Results" state with an immediate recovery action (e.g., "Clear Search") is essential for a graceful failure state.
**Action:** When implementing search or filters, always ensure that parent containers (sections/headers) are hidden if their children are filtered out, and provide a clear empty state with 'role="status"' and 'aria-live="polite"'.

## 2025-05-15 - [Search Keyboard UX]
**Learning:** Keyboard users lose their place in the document flow if the search input is not explicitly refocused after clicking a "Clear Search" button.
**Action:** Always call '.focus()' on the search input after a programmatic clear to maintain the interactive loop.
