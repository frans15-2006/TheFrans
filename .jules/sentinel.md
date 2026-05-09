## 2026-03-12 - Fix XSS in Order Summary and Toast Notifications
**Vulnerability:** DOM-based Cross-Site Scripting (XSS).
**Learning:** Directly injecting unsanitized user input (customer name) into the DOM using `innerHTML` allowed for script execution.
**Prevention:** Always use `textContent` when displaying user-provided strings. For complex HTML structures, separate the static markup from the dynamic content by using dedicated elements (e.g., `<span>`) for user data.
