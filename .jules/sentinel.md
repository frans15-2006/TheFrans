# Sentinel Journal

## 2025-05-15 - [DOM-based XSS in Vanilla JS]
**Vulnerability:** User-provided input (customer name) was interpolated directly into `innerHTML`, allowing for script injection.
**Learning:** Even in simple static sites, using `innerHTML` for any dynamic content—especially user input—is a high-risk pattern.
**Prevention:** Always prefer `textContent` for plain text data. If HTML structure is needed, build it using `document.createElement` and set `textContent` on leaf nodes to maintain "Defense in Depth".

## 2025-05-15 - [Reverse Tabnabbing]
**Vulnerability:** External links using `target="_blank"` lacked `rel="noopener noreferrer"`.
**Learning:** Opening external sites in a new tab without protection allows the target site to potentially control the source tab via `window.opener`.
**Prevention:** Use `rel="noopener noreferrer"` for all `target="_blank"` links as a standard security practice.
