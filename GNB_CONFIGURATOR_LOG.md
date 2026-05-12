# GNB Configurator — Update & Issue Log

> **Purpose:** This document is a static, running record of all issues identified, fixes applied, and improvement suggestions for the GNB Configurator and Operations system. It is intended to persist across sessions so that context is never lost, regardless of who is reviewing the file.

> **Standing Rule:** Every coding task on this project MUST add entries to this log. If a simpler path exists to achieve the same goal, it MUST be flagged to the user before building the complex version.

---

## File Inventory

| File | Description |
|---|---|
| `index.html` | Main configurator — standalone, offline-capable estimator with admin panel |
| `configurator-pro-responsive.html` | Alternate/pro version — not yet fully reviewed |
| `gnb-demo.html` | Auto-walkthrough demo file — self-running, no interaction required |
| `apps-script/Code.gs` | Google Apps Script backend — CRUD, transfer codes, email, Sheets |
| `apps-script/Index.html` | Google Apps Script frontend — War Board + Job Form web app |
| `google-apps-script-webhook.js` | Legacy standalone webhook (superseded by Code.gs) |
| `SETUP_GUIDE.md` | Step-by-step deployment instructions |
| `tutorial_presentation/` | HTML-based presentation tutorial for first-time users |
| `GNB_CONFIGURATOR_LOG.md` | This document |

---

## Session Log

### Session 4 — May 11, 2026

**Scope:** Live test the GNB system, generate a tutorial presentation, and analyze the feasibility of a dedicated GNB Assistant Agent.

**Actions Taken:**
1. **Live Testing:** Conducted end-to-end browser testing of `index.html`. Confirmed UI, calculations, form fields, and transfer code generation logic work flawlessly. Expected timeout on "Send to Ops Board" was observed due to the webhook not being live yet (expected behavior).
2. **Tutorial Presentation:** Created a 6-slide HTML presentation (`tutorial_presentation/`) explaining the entire workflow (Configurator -> Transfer Code -> Ops Board -> Job Sheet -> Portable Export -> Quick Reference). This serves as a training tool for the team.
3. **Cloud Backup:** Uploaded the `apps-script` folder and test notes to the user's Google Drive via `rclone` for easy deployment access.
4. **Agent Analysis:** Drafted a comprehensive analysis on the feasibility and design of a dedicated "GNB Assistant Agent" (delivered to user).

| ID | Type | Description | Files Affected |
|----|------|-------------|----------------|
| FIX-011 | Feature | Generated interactive HTML tutorial presentation | `tutorial_presentation/*` |
| TST-001 | Test | Validated `index.html` UI and transfer code logic | `index.html` |

---

### Session 3 — May 11, 2026

**Scope:** Build full GNB Operations system (War Board + Job Form) as Google Apps Script Web App, connect to configurator via transfer codes and webhook, add email notifications.

**Architecture Decision:** Moved from standalone HTML files (localStorage-dependent) to a **hybrid architecture**:
- **Configurator** stays as standalone HTML (works offline at job sites)
- **War Board + Job Form** runs as Google Apps Script Web App (syncs across all devices via Google Sheets)
- **Bridge** is the transfer code system + webhook

**Rationale:** User has Google Workspace subscription, needs multi-device sync without file transfers, and wants email backup. This eliminates the localStorage portability problem entirely for the ops side. User explicitly requested Google-first approach for all applicable scenarios.

#### Changes Made

| ID | Type | Description | Files Affected |
|----|------|-------------|----------------|
| FIX-002 | Feature | Built Google Apps Script backend — handles all CRUD, transfer codes, email notifications, Sheet auto-creation | `apps-script/Code.gs` |
| FIX-003 | Feature | Built responsive web app frontend — War Board calendar with drag-and-drop, quick-view popup, full job form with extended fields | `apps-script/Index.html` |
| FIX-004 | Feature | Added "Send to Ops Board" button to configurator summary step — generates transfer code, posts job data to webhook | `index.html` |
| FIX-005 | Feature | Added `webhookUrl` field to configurator admin panel (Business Info section) | `index.html` |
| FIX-006 | Feature | Transfer code system — noun+number codes (e.g., `muffin33`) for cross-device job transfer | All files |
| FIX-007 | Feature | Auto-save with debounce (1s after last keystroke) + visual "Saved ✓" indicator | `apps-script/Index.html` |
| FIX-008 | Feature | Email notification on job finalize/submit to `greatnorthernborders@gmail.com` | `apps-script/Code.gs` |
| FIX-009 | Feature | Google Sheets backup — every job saved as row in "Jobs" sheet | `apps-script/Code.gs` |
| FIX-010 | Doc | Created `SETUP_GUIDE.md` — step-by-step deployment instructions | `SETUP_GUIDE.md` |

#### Extended Job Form Fields Added

- **Color Palette** — Multi-tag selector with defaults (Buff, Charcoal, Terra Cotta, Slate Grey, Desert Tan, Sandstone) + custom add
- **Runs** — Repeating section: description + footage per run
- **Prep Work** — Text description + amount/hours field
- **Boss Notes** — Highlighted freeform section (yellow, only on full sheet)
- **Pre-Job Notes** — Site conditions, customer requests
- **Post-Job Notes** — What happened, follow-up needed
- **Equipment Checklist** — Configurable list with checkboxes
- **Start of Day Checklist** — Pre-departure audit
- **End of Day Checklist** — Site cleanup audit
- **Gate/Access Notes** — Gate codes, parking, access points
- **Deposit tracking** — Yes/No + amount

---

### Session 2 — May 11, 2026

**Scope:** Auto-demo walkthrough + research MCP coding tools, file packages, Google Drive sync guide.

| ID | Type | Description | Files Affected |
|----|------|-------------|----------------|
| FIX-S2 | Feature | Created `gnb-demo.html` — auto-walkthrough demo of the configurator | `gnb-demo.html` |
| DOC-001 | Doc | Created `MCP_Coding_Tools_and_Workflows.md` — top-rated coding MCPs research | standalone |
| DOC-002 | Doc | Created `Google_Drive_Sync_Setup.md` — phone/laptop sync instructions | standalone |
| DOC-003 | Doc | Created `GNB_Project_Summary.md` — full project context for NotebookLM | standalone |

---

### Session 1 — May 11, 2026

**Scope:** Make configurator HTML portable across devices.

| ID | Type | Description | Files Affected |
|----|------|-------------|----------------|
| FIX-001 | Fix | Added "Export Portable HTML" button — bakes live config into downloaded file | `index.html` |

---

## Issue Log

### ISSUE-001 — Config Does Not Transfer Between Devices
- **Severity:** Critical → **RESOLVED** (FIX-001 + hybrid architecture)
- **Description:** localStorage doesn't travel with HTML files. Receiving device gets factory defaults.

### ISSUE-002 — localStorage Silently Fails on Some Mobile Browsers
- **Severity:** Medium → **Already handled** (code has try/catch + storageAvailable flag)
- **Recommendation:** Add visible warning banner when `storageAvailable === false`.

### ISSUE-003 — Logo URL Field Accepts External URLs Only
- **Severity:** Low-Medium → **Open**
- **Recommendation:** Add Base64 embed option (~30 lines JS)

### ISSUE-004 — Admin PIN Stored in Plaintext
- **Severity:** Low → **Open** (acceptable for internal field tool)

### ISSUE-005 — `Object.assign` Shallow Merge on Config Load
- **Severity:** Low → **Open**
- **Recommendation:** Replace with deep merge utility (~10 lines)

### ISSUE-006 — No Input Validation on Pricing Fields
- **Severity:** Low → **Open**
- **Recommendation:** Add visual error on empty/invalid numeric fields

### ISSUE-007 — Email Submit Uses `mailto:` Protocol
- **Severity:** Low → **Open**
- **Recommendation:** Add copy-to-clipboard fallback

### ISSUE-008 — Configurator webhook uses `mode: 'no-cors'`
- **Severity:** Info → **Acceptable**
- **Description:** Can't read response from Apps Script. Fire-and-forget is fine — the transfer code is generated client-side.

### ISSUE-009 — No offline fallback for War Board
- **Severity:** Low → **Open**
- **Description:** If internet drops, War Board won't load. Could add service worker later.

### ISSUE-010 — No authentication on War Board
- **Severity:** Low → **Open**
- **Description:** Anyone with the URL can access. URL is private/not indexed. Could add PIN later.

---

## Improvement Suggestions

| ID | Suggestion | Effort | Value | Status |
|---|---|---|---|---|
| IMP-001 | Base64 logo embed (ISSUE-003) | Low | High | Backlog |
| IMP-002 | Deep merge on config load (ISSUE-005) | Low | Medium | Backlog |
| IMP-003 | Copy-to-clipboard fallback (ISSUE-007) | Low | High | Backlog |
| IMP-004 | localStorage warning banner (ISSUE-002) | Very Low | Medium | Backlog |
| IMP-005 | Pricing field validation (ISSUE-006) | Low | Medium | Backlog |
| IMP-006 | Photo attachment to job form (before/after) | Medium | High | Planned |
| IMP-007 | Invoice generation from job data | Medium | High | Planned |
| IMP-008 | Crew scheduling view | Medium | Medium | Backlog |
| IMP-009 | Weather integration (auto-flag rain days) | Low | Medium | Backlog |
| IMP-010 | Customer signature capture on completion | Medium | Medium | Backlog |
| IMP-011 | Offline service worker for War Board | High | Low | Backlog |
| IMP-012 | PIN protection for War Board | Low | Low | Backlog |

---

## Git Conflict Resolution Log

| Date | Conflict | Resolution |
|------|----------|------------|
| 2026-05-11 | `GNB_CONFIGURATOR_LOG.md` — remote had Session 2 demo entry, local had full Session 3 rewrite | Merged: kept comprehensive Session 3 version, incorporated Session 2 demo entry (FIX-S2) |

---

*Log maintained by Manus. Last updated: 2026-05-11.*
