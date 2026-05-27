## 2026-05-18 - Scope Management for Security Enhancements
**Vulnerability:** Reverse tabnabbing and potential referrer leakage on external links across multiple legacy static projects.
**Learning:** Broad security sweeps across many files can lead to repository hygiene issues (e.g., committing build artifacts like `server.log`) and violate PR size constraints. While modern browsers increasingly default to `noopener` for `target="_blank"`, explicit `noreferrer` remains a critical enhancement for privacy and legacy compatibility.
**Prevention:** Focus security enhancements on high-traffic entry points (like the root `index.html`) when dealing with large legacy repositories. Always verify that no diagnostic artifacts or side-effect files are staged before submission.
