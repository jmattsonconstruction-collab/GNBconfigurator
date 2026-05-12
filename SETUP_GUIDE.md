# GNB Operations — Setup Guide

This guide walks you through deploying the GNB Ops system. Total time: ~10 minutes. No coding required.

---

## Overview

The system has **two parts**:

| Component | What it does | Where it lives |
|-----------|-------------|----------------|
| **Configurator** (`index.html`) | Customer-facing estimate tool. Works offline. | Any device — just open the HTML file |
| **GNB Ops** (War Board + Job Form) | Internal operations board. Syncs across all devices. | Google Apps Script Web App |

The configurator sends jobs to the Ops board via a **transfer code** (e.g., `muffin33`). You can also type the code manually on any device.

---

## Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"Blank spreadsheet"**
3. Name it: `GNB Operations`
4. Note the URL — you'll need it in Step 2

---

## Step 2: Set Up the Apps Script

1. In your new Google Sheet, click **Extensions → Apps Script**
2. This opens the script editor. Delete any existing code in `Code.gs`
3. Copy the **entire contents** of the file `apps-script/Code.gs` from this repo and paste it in
4. Click the **+** next to "Files" in the left sidebar → **HTML** → name it `Index` (no extension)
5. Delete any default content, then paste the **entire contents** of `apps-script/Index.html`
6. In the script editor, select the function **`setup`** from the dropdown at the top, then click **Run**
7. Authorize when prompted (click "Advanced" → "Go to GNB Operations" if you see a warning — this is normal for personal scripts)
8. You should see "GNB Operations sheets initialized successfully" in the log

---

## Step 3: Deploy as Web App

1. In the Apps Script editor, click **Deploy → New deployment**
2. Click the gear icon next to "Select type" → choose **Web app**
3. Fill in:
   - **Description**: `GNB Ops v1`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` (this means anyone with the link — it's not publicly listed)
4. Click **Deploy**
5. **Copy the Web App URL** — it looks like: `https://script.google.com/macros/s/AKfycb.../exec`

> **This URL is your Ops Board.** Bookmark it on every device. It works on PC, tablet, and phone.

---

## Step 4: Connect the Configurator

1. Open `index.html` (the configurator) in a browser
2. Click the **Admin** button (bottom right) → enter your PIN
3. Under **Standard Settings → Business Info**, find the field **"Webhook Url"**
4. Paste the Web App URL from Step 3
5. Click **Save**
6. (Optional) Click **Export Portable HTML** to bake this setting into the file permanently

Now when you complete an estimate and click **"📋 Send to Ops Board"**, it will:
- Generate a transfer code (e.g., `hawk42`)
- Send the job data to your Google Sheet
- Send a notification email to `greatnorthernborders@gmail.com`

---

## Step 5: Using Transfer Codes

**From the configurator (any device):**
1. Complete an estimate
2. Click "📋 Send to Ops Board"
3. Note the transfer code shown (e.g., `muffin33`)

**On the War Board (any device):**
1. Open your Ops Board URL
2. Click the **"Code"** button in the header
3. Type the transfer code → click **Go**
4. The job appears on the calendar

---

## Step 6: Updating the Deployment

If I make changes to the code and you need to update:

1. Open your Google Sheet → **Extensions → Apps Script**
2. Replace the code in `Code.gs` and/or `Index.html` with the new versions
3. Click **Deploy → Manage deployments**
4. Click the pencil icon on your existing deployment
5. Change **Version** to "New version"
6. Click **Deploy**

The URL stays the same — all bookmarks still work.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Ops webhook not configured" | Paste the Web App URL into Admin → Webhook Url |
| Job doesn't appear on War Board | Click the "Code" button and enter the transfer code manually |
| "Failed to send" error | Check that the Web App URL is correct and the deployment is set to "Anyone" |
| No email received | Check spam folder. Verify `greatnorthernborders@gmail.com` is in the Config sheet |
| War Board shows "Loading..." forever | Refresh the page. If persistent, re-run the `setup` function in Apps Script |

---

## File Inventory

```
GNBconfigurator/
├── index.html                    ← Configurator (standalone, works offline)
├── apps-script/
│   ├── Code.gs                   ← Backend (paste into Apps Script)
│   └── Index.html                ← Frontend (paste into Apps Script)
├── google-apps-script-webhook.js ← (Legacy, replaced by Code.gs)
├── GNB_CONFIGURATOR_LOG.md       ← Update log
├── SETUP_GUIDE.md                ← This file
└── README.md                     ← Repo overview
```

---

## Email Notifications

Every time a job is **finalized** (from the Ops Board) or **submitted** (from the Configurator), an email is automatically sent to `greatnorthernborders@gmail.com` containing:

- Customer name, phone, email, address
- Job type, stamp, footage, estimate
- Color palette
- Run descriptions
- Prep work details
- Boss notes
- Transfer code

This serves as your permanent backup — even if the Sheet is accidentally deleted, you have every job in your email.

---

## Security Notes

- The Web App URL is not publicly discoverable — only people with the link can access it
- Transfer codes are simple (e.g., `fox88`) because there's no security risk — they only contain job info, not payment data
- The Google Sheet is only accessible to your Google account
- No passwords or API keys are stored in the HTML files
