# Sentinel's Journal - Critical Security Learnings

## 2025-05-14 - DOM-based XSS in Order Summary
**Vulnerability:** User-provided customer name was directly injected into the DOM using `innerHTML` in the `generateQR` function within `mix-and-match/script.js`.
**Learning:** In vanilla JavaScript applications, it's easy to fall into the trap of using template literals with `innerHTML` for quick rendering, which bypasses built-in browser sanitization.
**Prevention:** Always use `textContent` for user-controlled strings. For complex structures, either use `document.createElement` or a library that handles sanitization.

## 2025-05-14 - Reverse Tabnabbing Risk
**Vulnerability:** External links using `target="_blank"` without `rel="noopener noreferrer"` in the main `index.html`.
**Learning:** While modern browsers (Chrome 88+, Safari 13.1+) set `rel="noopener"` by default for `target="_blank"`, explicitly including it ensures defense-in-depth and protects users on older or alternative browsers.
**Prevention:** Standardize the use of `rel="noopener noreferrer"` for all external links that open in a new tab.
