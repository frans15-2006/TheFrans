# Sentinel Security Journal

## 2026-05-21 - Root Index Security Hardening
**Vulnerability:** Missing Subresource Integrity (SRI) and incomplete reverse tabnabbing protection.
**Learning:** External assets loaded from CDNs without integrity checks allow for potential malicious code execution if the provider is compromised. `rel="noopener"` alone is insufficient for legacy browser protection against reverse tabnabbing.
**Prevention:** Always use SRI hashes for third-party assets and `rel="noopener noreferrer"` for external links.
