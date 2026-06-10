# Palette's UX & Accessibility Journal

## 2026-06-08 - Accessible Search & Navigation
**Learning:** Legacy projects often use `div` elements for interactive tabs, which breaks keyboard navigation. Converting them to `button` elements with `type="button"` and adding a global `focus-visible` indicator significantly improves accessibility with minimal code changes. Adding a semantic empty state with `role="status"` ensures screen reader users are informed when searches return no results.
**Action:** Always check for interactive `div`s and implement semantic `button`s with clear focus states and live region feedback.
