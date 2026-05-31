# Sentinel Security Journal

This journal records CRITICAL security learnings discovered during the protection of this codebase.

## 2025-05-31 - Reverse Tabnabbing Pattern in Static Portfolio
**Vulnerability:** Numerous instances of `target="_blank"` without `rel="noopener noreferrer"`, and `window.open()` calls without security features.
**Learning:** Legacy static sites often overlook this as they rely on simple link patterns. In this repo, even imperative redirects in JS (like brand card clicks) omitted these protections.
**Prevention:** Always append `rel="noopener noreferrer"` to external links and include `'noopener,noreferrer'` as the third argument in `window.open()` calls.
