## 2025-05-14 - [DOM-based XSS in Vanilla JS Modal]
**Vulnerability:** User-provided string (customer name) was directly interpolated into an `innerHTML` string in `script.js`, allowing arbitrary script execution via tags like `<script>`, `<img>`, or `<iframe>`.
**Learning:** Even with simple processing like `.toUpperCase()`, user input remains dangerous if used in `innerHTML`. HTML tags and attributes are case-insensitive, and many XSS payloads survive uppercase conversion.
**Prevention:** Always use `.textContent` for user-supplied data. For complex templates, use placeholder elements (e.g., `<span>`) and set their content separately using `.textContent`.
