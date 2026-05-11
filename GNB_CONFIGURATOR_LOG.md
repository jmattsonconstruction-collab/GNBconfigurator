# GNB Configurator — Update & Issue Log

> **Purpose:** This document is a static, running record of all issues identified, fixes applied, and improvement suggestions for the GNB Configurator HTML tool. It is intended to persist across sessions so that context is never lost, regardless of who is reviewing the file.

---

## File Inventory

| File | Description |
|---|---|
| `index.html` | Main configurator — full-featured, step-by-step estimator with admin panel |
| `configurator-pro-responsive.html` | Alternate/pro version — not yet fully reviewed |
| `gnb-demo.html` | Auto-walkthrough demo file — self-running, no interaction required (see SESSION-002) |
| `GNB_CONFIGURATOR_LOG.md` | This document |

---

## Issue Log

### ISSUE-001 — Config Does Not Transfer Between Devices
- **Date Identified:** 2026-05-11
- **Severity:** Critical
- **Status:** Fixed (see FIX-001)
- **Description:** The admin panel saves all configuration (pricing, product names, company info, branding colors, admin PIN) to the browser's `localStorage`. When the HTML file is copied or sent to another device, `localStorage` does not travel with it. The receiving device opens the file with factory default settings, losing all customization.
- **Root Cause:** `saveConfig()` writes to `localStorage.setItem('config', ...)`. The HTML file itself only contains `defaultConfig` hardcoded values. There is no mechanism to embed the live config back into the file for redistribution.
- **Affected Environments:** All — any device that receives the file via email, AirDrop, USB, etc.

---

### ISSUE-002 — localStorage Silently Fails on Some Mobile Browsers
- **Date Identified:** 2026-05-11
- **Severity:** Medium
- **Status:** Already handled in code (no fix needed)
- **Description:** Safari on iOS in Private Browsing mode, and some Android WebViews, throw a `SecurityError` when `localStorage` is accessed. The existing code already wraps this in a `try/catch` with a `storageAvailable` flag, so the app falls back to in-memory config gracefully. No data is lost mid-session, but settings will not persist across page reloads in those environments.
- **Recommendation:** Document this behavior for end users. Consider adding a visible warning banner when `storageAvailable === false`.

---

### ISSUE-003 — Logo URL Field Accepts External URLs Only
- **Date Identified:** 2026-05-11
- **Severity:** Low-Medium
- **Status:** Open — flagged for future improvement
- **Description:** The `logoUrl` field in the admin panel expects a URL string (e.g., `https://...`). When the file is used offline, any external URL will fail to load if there is no internet connection. There is no option to embed a logo image directly into the file as a Base64 data URI.
- **Recommendation:** Add a file picker in the admin panel that converts the selected image to a Base64 data URI and stores it in config. This would make the logo fully portable and offline-safe. Estimated effort: ~30 lines of JS.

---

### ISSUE-004 — Admin PIN Stored in Plaintext
- **Date Identified:** 2026-05-11
- **Severity:** Low (acceptable for this use case)
- **Status:** Open — flagged, no action required unless security is a concern
- **Description:** The admin PIN is stored as a plaintext string in `localStorage` and in any exported config JSON. Anyone who opens DevTools or reads the exported file can see the PIN.
- **Recommendation:** For a field estimator tool used internally, this is likely acceptable. If the tool is ever distributed to customers or used in a higher-trust context, consider hashing the PIN with SHA-256 before storage.

---

### ISSUE-005 — `Object.assign` Shallow Merge on Config Load
- **Date Identified:** 2026-05-11
- **Severity:** Low
- **Status:** Open — flagged for future improvement
- **Description:** `loadConfig()` uses `Object.assign({}, defaultConfig, JSON.parse(stored))`. This is a **shallow merge** — if a stored config is missing a nested key (e.g., a new `features` flag added in a future update), the entire nested object from `defaultConfig` is replaced by the stored version, dropping the new key silently.
- **Recommendation:** Replace with a deep merge utility (a simple recursive function, ~10 lines) so that new config keys added in future updates are always present even when loading an older stored config.

---

### ISSUE-006 — No Input Validation on Pricing Fields
- **Date Identified:** 2026-05-11
- **Severity:** Low
- **Status:** Open — flagged for future improvement
- **Description:** Admin pricing inputs use `parseFloat(inp.value) || 0`, which silently resets invalid input to `0`. A user who accidentally clears a price field will not be warned — the price will just become $0.00.
- **Recommendation:** Add a visual indicator (red border or inline error message) when a numeric field is empty or non-numeric, rather than silently defaulting to zero.

---

### ISSUE-007 — Email Submit Uses `mailto:` Protocol
- **Date Identified:** 2026-05-11
- **Severity:** Low (by design, but worth noting)
- **Status:** Open — informational
- **Description:** The "Send Estimate" button constructs a `mailto:` link and redirects `window.location.href`. This relies on the device having a default email client configured. On devices without one (e.g., tablets used only for field work, or devices where the default mail app is not set up), the button will silently fail or open a browser error.
- **Recommendation:** Consider adding a fallback — either a "Copy to Clipboard" button that copies the estimate text, or a visible plain-text summary the user can manually copy. Low effort, high value for field use.

---

## Fix Log

### FIX-001 — Export Portable HTML Button
- **Date Applied:** 2026-05-11
- **Resolves:** ISSUE-001
- **Description:** Added an **"Export Portable HTML"** button to the Advanced Configuration section of the Admin Panel. When clicked, this function:
  1. Serializes the current live `config` object (including all admin customizations) to a JSON string.
  2. Reads the full source of the current HTML document as a string.
  3. Replaces the `defaultConfig = { ... }` block in the source with the current live config values baked in as the new default.
  4. Downloads the result as a new `.html` file named `gnb-configurator-[date].html`.
- **Result:** The downloaded file opens on any device with all settings intact. No internet, no localStorage, no setup required on the receiving end.
- **Location in code:** Inside `renderAdminPanel()`, appended to the `tools` toolbar div alongside Export Config / Import Config / Restore Defaults.

---

## Improvement Suggestions (Not Yet Implemented)

| ID | Suggestion | Effort | Value |
|---|---|---|---|
| SUGGEST-001 | Base64 logo embed (see ISSUE-003) | Low (~30 lines JS) | High — makes logo portable offline |
| SUGGEST-002 | Deep merge on config load (see ISSUE-005) | Low (~10 lines JS) | Medium — future-proofs config upgrades |
| SUGGEST-003 | Copy-to-clipboard fallback on summary (see ISSUE-007) | Low (~10 lines JS) | High — critical for devices without email client |
| SUGGEST-004 | `localStorage` unavailable warning banner (see ISSUE-002) | Very Low (~5 lines JS) | Medium — improves transparency on mobile |
| SUGGEST-005 | Pricing field validation with visual error (see ISSUE-006) | Low (~20 lines JS) | Medium — prevents accidental $0 pricing |
| SUGGEST-006 | Multi-run mode (already in config as `features.multiRun`) | Medium | High — allows multiple estimates per session without reload |

---

---

## Session Log

### SESSION-001 — Initial Audit & FIX-001
- **Date:** 2026-05-11
- **Summary:** Full audit of `index.html`. Identified ISSUE-001 through ISSUE-007. Applied FIX-001 (Export Portable HTML button). Logged improvement suggestions SUGGEST-001 through SUGGEST-006.

---

### SESSION-002 — Auto-Demo Walkthrough File
- **Date:** 2026-05-11
- **Requested by:** Boss
- **Output file:** `gnb-demo.html`
- **Summary:** Built a fully self-running demo HTML file that auto-progresses through all 7 configurator steps with realistic typing, card selection animations, and timed pauses before each "Next" click. No user interaction required — opens and runs automatically.
- **Demo Run 1 — Badrock Canyon + Granite Stamp:**
  - Customer: Mike Halverson, 2847 Glacier View Dr, Kalispell MT 59901
  - Profile: Badrock Canyon (+$2.50/ft)
  - Stamp: Granite (+$1.50/ft)
  - Cable reinforcement: Yes (+$0.75/ft)
  - Integral colour: Yes (+$0.50/ft)
  - Footage: 185 ft total
  - Split footage demonstrated: 60 ft Great Northern + 125 ft Badrock Canyon
  - Notes: Front driveway border + back patio perimeter
- **Demo Run 2 — Scapegoat + River Rock Stamp:**
  - Triggered via the "Run Again" callout on the summary page (same customer, new style)
  - Profile: Scapegoat (+$3.50/ft)
  - Stamp: River Rock (+$2.00/ft)
  - Cable reinforcement: No
  - Integral colour: Yes (+$0.50/ft)
  - Footage: 240 ft
  - Notes: Pool deck perimeter — rustic look
- **Key features demonstrated:**
  1. Full 7-step walkthrough with realistic user simulation
  2. Split footage UI — per-profile footage entry with live combined total
  3. "Run Again" callout on summary page showing how to price a second style for the same customer without re-entering info
  4. Progress bar, step dots, and run badge in demo banner
  5. Restart button for looping the demo
- **Notes / Assumptions:**
  - `gnb-demo.html` is a standalone demo file and does not modify `index.html`
  - Split footage UI in the demo is a visual demonstration of the capability; the underlying `index.html` footage step currently uses a single total field. If split-footage-per-profile is desired in the live tool, it should be implemented as a separate feature (see SUGGEST-007 below)

---

## Improvement Suggestions (continued)

| ID | Suggestion | Effort | Value |
|---|---|---|---|
| SUGGEST-007 | Add split-footage-per-profile to live `index.html` footage step | Medium (~50 lines JS) | High — allows mixed-profile jobs to be priced accurately in a single estimate |
| SUGGEST-008 | "Run Again" / multi-estimate mode in live tool (builds on `features.multiRun` flag already in config) | Medium | High — lets field staff compare two styles for the same customer and send both estimates at once |

---

*Log maintained by Manus. Last updated: 2026-05-11.*
