## 2025-05-15 - Reverse Tabnabbing Vulnerability Pattern

**Vulnerability:** Widespread use of `target="_blank"` without `rel="noopener noreferrer"` across multiple static sites in the repository, along with insecure `window.open` calls.

**Learning:** Static, legacy-style sites often lack modern security linting, leading to recurring vulnerabilities like reverse tabnabbing. This allows a linked page to gain partial access to the original page's `window.opener` object, potentially leading to phishing or redirection attacks.

**Prevention:** Always pair `target="_blank"` with `rel="noopener noreferrer"`. For JavaScript-driven redirects, ensure `window.open` includes `'noopener,noreferrer'` in the features string. Implement automated checks or linting for these attributes during development.
