# Sentinel Security Journal 🛡️

## 2026-06-24 - [Subresource Integrity Implementation]
**Vulnerability:** External script files from CDNs were being loaded without cryptographic verification, exposing the application to potential supply-chain attacks or malicious script injection if the CDN provider or a specific file were compromised.
**Learning:** In static portfolio projects, external libraries like GSAP and Lenis are often pulled from public CDNs. Without SRI, the client browser has no way to verify that the file delivered matches the one intended by the developer.
**Prevention:** Always use Subresource Integrity (SRI) for external assets. Include the `integrity` attribute with a valid cryptographic hash (e.g., SHA-384) and the `crossorigin="anonymous"` attribute for all CDN-hosted scripts.
