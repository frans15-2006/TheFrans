## 2025-05-14 - Mitigating DOM-based XSS in Vanilla JS
**Vulnerability:** DOM-based XSS in the 'mix-match-kain' ordering system where user-provided customer names and menu data were rendered using `innerHTML`.
**Learning:** Even when input is processed (e.g., `.toUpperCase()`), it remains dangerous if interpolated into `innerHTML`. Manual DOM construction using `textContent` is a robust defense.
**Prevention:** Avoid `innerHTML` and template literals for rendering any data that could be influenced by users. Prefer `document.createElement` and `textContent`.
