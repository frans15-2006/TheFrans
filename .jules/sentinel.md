## 2025-05-15 - DOM-based XSS and Secure Links

**Vulnerability:** User-provided input (customer name) was being rendered directly into the DOM using `innerHTML` in the `mix-match-kain` application, creating a DOM-based XSS vulnerability. Additionally, external links using `target="_blank"` lacked `rel="noopener noreferrer"`, posing security and privacy risks.

**Learning:** In vanilla JavaScript applications, it is easy to default to `innerHTML` for convenience, but this can lead to severe security issues if user data is involved. Even if the application seems "small" or "local," practicing defense in depth is crucial.

**Prevention:** Always use `textContent` when rendering user-provided data. For complex structures involving user data, create specific placeholder elements and set their `textContent` individually. Always include `rel="noopener noreferrer"` for any links that open in a new tab to mitigate reverse tabnabbing and improve user privacy.
