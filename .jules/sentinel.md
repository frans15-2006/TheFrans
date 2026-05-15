## 2025-05-22 - DOM-based XSS in Order Summary
**Vulnerability:** User-controlled input (customer name) was being directly interpolated into an HTML string and assigned to `innerHTML`.
**Learning:** Even if the data is transformed (e.g., `.toUpperCase()`), it doesn't prevent XSS as HTML tags are case-insensitive.
**Prevention:** Always use `textContent` for user-provided data, or create specific elements and set their properties instead of using `innerHTML`.
