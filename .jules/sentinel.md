## 2025-05-14 - DOM-based XSS in Order Summary
**Vulnerability:** The `generateQR` function in `mix-and-match/script.js` was using `innerHTML` to render the user-provided customer name directly into the DOM. This allowed for script injection if a user entered a name like `<img src=x onerror=alert(1)>`.
**Learning:** In a vanilla JS environment, it's easy to fall into the trap of using template literals with `innerHTML` for convenience, even when some variables contain untrusted user input.
**Prevention:** Adopt a pattern of using `innerHTML` for the static structure but leaving placeholders (e.g., empty `<span>` tags with IDs) for user-provided data, which are then populated using `textContent`.
