# Sentinel Security Journal

## 2026-06-06 - [Subresource Integrity and Link Hardening]
**Vulnerability:** External CDN resources (GSAP, Lenis) were loaded without Subresource Integrity (SRI) hashes.
**Learning:** Legacy static projects often rely on CDNs for core animations and smooth scrolling but fail to guard against CDN compromise.
**Prevention:** Always use versioned CDN URLs and generate/apply SHA-384 hashes for the `integrity` attribute. Combine with `rel="noopener noreferrer"` for external links to ensure cross-browser protection against reverse tabnabbing and data leakage.
