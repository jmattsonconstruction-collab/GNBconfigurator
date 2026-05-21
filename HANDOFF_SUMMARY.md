# GNB Operations — Project Handoff Summary

This document serves as a comprehensive handoff package for the GNB Operations system, summarizing the project history, architecture, and current state for any future developer or assistant.

## 1. Project Overview
The GNB Operations system is a custom-built suite of tools designed for a decorative concrete business. It streamlines the process from customer estimation to job scheduling and record-keeping.

### Core Components:
- **Frontend (Configurator):** A standalone, mobile-responsive HTML/JS application for field estimates. Deployed on Vercel.
- **Backend (War Board/Ops Board):** A Google Apps Script Web App connected to a Google Sheet for centralized job management and scheduling.
- **Bridge:** A transfer code system (e.g., `muffin33`) that allows offline estimates to be synced to the online Ops Board via a webhook.

## 2. Key Documentation
- **[GNB_CONFIGURATOR_LOG.md](./GNB_CONFIGURATOR_LOG.md):** The definitive record of all changes, fixes, and pending issues. **Must be updated during every task.**
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md):** Instructions for deploying the Apps Script backend and connecting it to the configurator.
- **[PROJECT_MIGRATION.md](./PROJECT_MIGRATION.md):** Guidelines for moving the project into a dedicated Manus Project environment.
- **[GNB_Assistant_Agent_Analysis.md](./GNB_Assistant_Agent_Analysis.md):** Strategic analysis of how an AI agent should manage this ecosystem.

## 3. Technical Stack
- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript (no heavy frameworks to ensure portability).
- **Hosting:** Vercel (auto-deploys from GitHub `main` branch).
- **Backend:** Google Apps Script (JavaScript-based).
- **Database:** Google Sheets (acting as a relational database for jobs).
- **Communication:** Gmail integration for job alerts.

## 4. Current Status & Pending Work
As of May 20, 2026, the system is fully functional but has several planned improvements:
1. **UI/UX Rebuild:** Migration to a more polished "pro" responsive base.
2. **Full Admin Editability:** Moving remaining hardcoded labels into the admin configuration.
3. **Enhanced Image Support:** Auto-resizing base64 image uploads for all product cards.
4. **Invoicing & Scheduling:** Building out the next phase of operational features.

## 5. Important URLs
- **Live Configurator:** [gnbcurbconfigurator.vercel.app](https://gnbcurbconfigurator.vercel.app/)
- **GitHub Repository:** [jmattsonconstruction-collab/GNBconfigurator](https://github.com/jmattsonconstruction-collab/GNBconfigurator)
- **Ops Board (Private):** [Google Apps Script Web App](https://script.google.com/macros/s/AKfycbzQw-kmw50PbI7oo1eAiGIy5Zx4nVtwYCjBFbKDRUj5me_GL6eCLDPiqDjhdMlPpQjZ/exec)

---
*Prepared by Manus for Boss (Decorative Concrete).*
