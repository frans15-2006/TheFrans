## 2026-05-23 - DOM-based XSS in Order Summary
**Vulnerability:** A DOM-based Cross-Site Scripting (XSS) vulnerability was found in the `generateQR` function within `mix-match-kain/script.js`. The customer name input was directly injected into the page using `innerHTML`.
**Learning:** Even though the input was transformed using `.toUpperCase()`, it remained vulnerable because HTML tags and attributes are case-insensitive. Attackers could still inject payloads like `<IMG SRC=X ONERROR=...>`. Case transformation is not a substitute for proper sanitization or safe DOM manipulation.
**Prevention:** Always use safe DOM APIs like `textContent` or `createElement` when rendering user-controlled data. Avoid `innerHTML` unless the content is strictly trusted and sanitized with a dedicated library.
