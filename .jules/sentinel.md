## 2026-02-11 - Reverse Tabnabbing Vulnerabilities
**Vulnerability:** External links with `target="_blank"` lacked `rel="noopener noreferrer"`, and `window.open` calls lacked the `noopener,noreferrer` feature string.
**Learning:** This vulnerability allows a linked page to access the original page's `window.opener` object, potentially redirecting it to a malicious URL (tabnabbing). Even modern browsers that default to `noopener` for anchor tags may still be vulnerable in certain contexts or older versions, and `window.open` still requires explicit features.
**Prevention:** Always include `rel="noopener noreferrer"` for `target="_blank"` links and use the third argument of `window.open` to specify security features.
