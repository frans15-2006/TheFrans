## 2024-06-07 - Subresource Integrity (SRI) and DOM Integrity
**Vulnerability:** External assets (scripts/styles) were loaded from CDNs without integrity hashes, and a malformed HTML tag (`<div <div`) was present in the contact section.
**Learning:** Legacy static portfolios often overlook Subresource Integrity, leaving them vulnerable to CDN compromises. Additionally, malformed HTML can lead to unpredictable DOM parsing which may bypass security filters or break layouts.
**Prevention:** Always implement SRI for external resources using SHA-384 hashes and `crossorigin="anonymous"`. Use a hash generator (`sri_gen.py`) to automate the process. Regularly audit DOM structure for malformed tags that disrupt semantic parsing.
