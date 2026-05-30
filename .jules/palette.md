## 2026-05-30 - Search Empty State Accessibility
**Learning:** Screen readers do not automatically announce the appearance of "No results found" messages if they are dynamically injected or shown. Using `role="status"` and `aria-live="polite"` ensures that users are notified when their search yields no matches.
**Action:** Always include ARIA live regions on dynamic feedback elements that signify state changes like "No results" or "Loading complete".
