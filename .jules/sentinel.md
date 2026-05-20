## 2026-05-20 - Fix DOM-based XSS in mix-match-kain
**Vulnerability:** DOM-based XSS via `innerHTML` when rendering user-controlled input (customer name) and system messages (toasts).
**Learning:** Using template strings with `innerHTML` to render user input is a common but dangerous pattern that allows attackers to inject arbitrary HTML and scripts. Even "trusted" strings like toast messages should be handled safely as they might eventually include user data (e.g., "Added [item name] to cart").
**Prevention:** Prefer `textContent` and `createElement` over `innerHTML` for all dynamic content rendering. If HTML rendering is absolutely necessary, use a robust sanitization library.
