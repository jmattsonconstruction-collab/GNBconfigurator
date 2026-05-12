# GNB Project — Manus Project Migration Guide

## Why Move to a Project?

Running tasks inside a Manus **Project** gives you:
- **Persistent project instructions** — rules like "always maintain the update log" are enforced automatically on every task
- **Shared context** — every new task inside the project already knows the system architecture, file locations, and your preferences
- **No re-explaining** — you don't have to re-brief a new task from scratch every time

---

## How to Create the Project

1. Go to your **Manus dashboard**
2. Click **"New Project"**
3. Name it: **GNB Operations**
4. Once created, open the project and start a new task inside it

---

## Project Instructions to Add

When you're inside the project, go to **Project Settings → Instructions** and paste in the following. These will be enforced on every task automatically:

```
MANDATORY RULES FOR ALL TASKS IN THIS PROJECT:

1. UPDATE LOG: Every coding task MUST maintain the file /GNBconfigurator/GNB_CONFIGURATOR_LOG.md. Log every change, fix, and flagged issue with a session entry, ID, type, description, and files affected.

2. SIMPLER PATH: If a simpler method exists to accomplish the same goal at equal or better quality, flag it immediately before building the complex version.

3. GOOGLE FIRST: When choosing between platforms or services, prefer Google Workspace tools (Apps Script, Sheets, Drive, Gmail) as the user has an active Workspace subscription.

4. FULL ADMIN EDITABILITY: Every visible text label, button, header, and image in the GNB Configurator must be editable from the Admin Panel. Never hardcode visible text.

5. IMAGE HANDLING: All images must use base64 upload or URL. Auto-resize on upload. Never use local relative paths.

6. VERCEL AUTO-DEPLOY: The configurator deploys automatically when changes are pushed to the main branch of jmattsonconstruction-collab/GNBconfigurator. Always push after making changes.

7. GNB SKILL: Read the gnb-workflow skill before starting any GNB-related coding task.
```

---

## Files to Add as Shared Project Files

Upload these to the project's shared files so every task has access:
- `GNB_CONFIGURATOR_LOG.md` — the running update log
- `SETUP_GUIDE.md` — the Apps Script setup instructions
- `GNB_Assistant_Agent_Analysis.md` — the agent analysis document

---

## GitHub Repo

All code lives at: `jmattsonconstruction-collab/GNBconfigurator`
Live URL: `https://gnbcurbconfigurator.vercel.app`
War Board URL: `https://script.google.com/macros/s/AKfycbzQw-kmw50PbI7oo1eAiGIy5Zx4nVtwYCjBFbKDRUj5me_GL6eCLDPiqDjhdMlPpQjZ/exec`

---

## Pending Work (Next Task)

The following items are confirmed and ready to build in the next task:

| Priority | Task | Notes |
|----------|------|-------|
| 1 | Rebuild configurator from `gnb-ops.html` base | The original version is the best-looking one |
| 2 | Full text editability in Admin Panel | Every visible string editable |
| 3 | Image slots on every card/section | Off by default, auto-resize on upload |
| 4 | Color theme editor + background image with opacity slider | Full visual customization |
| 5 | Webhook + transfer code integration | Already built, needs to be ported to new base |
| 6 | Export Portable HTML | Already built, needs to be ported |
