## 2025-05-31 - Improved Search UX & Accessibility
**Learning:** Search interfaces without feedback for zero results can be confusing. Explicitly handling "no results" with a clear CTA and restoring focus after clearing search improves the flow. Adding ARIA labels to icon-only buttons is essential for screen readers.
**Action:** Always implement a "no results" state for search filters and ensure that programmatic clear actions return focus to the input.
