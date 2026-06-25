## 2026-06-25 - SRI and Tabnabbing Regression in ptci
**Finding:** SRI attributes for GSAP scripts and rel="noopener" for the footer link were missing in ptci/index.html, despite memory suggesting they had been implemented.
**Why it happened:** Likely a regression due to a file overwrite or a manual update that didn't include security headers. The static nature of the repository makes it easy to lose these small attribute changes during site-wide updates.
**Prevention:** Regular automated audits using grep or BeautifulSoup to ensure these security attributes remain in place across all client folders.
