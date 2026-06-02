# Palette's UX Journal

## 2026-05-21 - Accessible Search Feedback
**Learning:** For client-side filtering, simply hiding elements is insufficient for screen readers. An explicit empty state with 'role="status"' and 'aria-live="polite"' ensures that users are notified when a search yields no results, preventing confusion.
**Action:** Always pair dynamic search/filter logic with an ARIA-live region for empty states.
