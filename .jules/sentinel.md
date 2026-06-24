## 2026-06-25 - Widespread Reverse Tabnabbing Risk
**Finding:** Multiple client directories (`momentfood`, `MK-Sushi-Bar-Antipolo`, `JO-Coffee`, `ptci`, `Izakaya-Tago`) were found to have `target="_blank"` links missing `rel="noopener noreferrer"` attributes, both in static HTML and dynamic `window.open` calls.
**Why it happened:** The repository consists of independent static sites, likely built from older templates or basic HTML/JS patterns where tabnabbing protection was not a standard part of the development workflow.
**Prevention:** Implement a repository-wide linting or audit script that flags external links missing `rel="noopener noreferrer"`. Ensure the security policy for new client sites explicitly requires these attributes for all external navigation.
