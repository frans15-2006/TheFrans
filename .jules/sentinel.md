## 2026-05-10 - DOM-based XSS in Order Summary
**Vulnerability:** User-provided customer name was injected directly into `innerHTML` of the order summary element in `generateQR()`.
**Learning:** Even simple "portfolio" projects can harbor XSS if user input isn't handled carefully when rendering to the DOM.
**Prevention:** Always use `textContent` or similar safe methods when rendering user-provided strings, or sanitize the input if HTML is absolutely required.
