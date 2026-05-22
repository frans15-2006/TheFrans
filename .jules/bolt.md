## 2025-05-22 - Initial Performance Audit
**Learning:** Found that large gallery images (1.5MB - 2.1MB) in the root `index.html` were lacking `loading="lazy"` and `decoding="async"`, causing them to be fetched even if the user never scrolls down to the gallery section.
**Action:** Always check for large assets below the fold and apply native lazy loading to improve Largest Contentful Paint (LCP) and save bandwidth.
