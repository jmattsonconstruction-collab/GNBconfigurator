# GNB Configurator + Ops Board — First Use Tutorial

## Slide 1: Welcome
**Heading:** Your Complete Job Workflow — From Estimate to War Board
- This presentation walks you through the full GNB system: the Configurator (customer-facing estimate tool) and the Ops Board (your internal job management war board)
- By the end, you'll know how to create an estimate, send it to the Ops Board, and manage jobs from any device
- The system is designed to be simple enough that anyone can use it — no tech experience required

## Slide 2: The Big Picture — How Everything Connects
**Heading:** One Estimate Flows Automatically Into Your Job Schedule
- The **Configurator** is a standalone HTML file you open on any device (works offline at job sites)
- When you finalize an estimate, it sends the job data to a **Google Sheet** (your database)
- The **Ops Board** (War Board) reads from that same Google Sheet and shows all your jobs as draggable cards
- A **transfer code** (like "muffin33") lets you pull jobs between devices without any login
- An **email backup** goes to greatnorthernborders@gmail.com every time a job is finalized

## Slide 3: One-Time Setup — The Google Sheet Backend (5 minutes)
**Heading:** Create Your Google Sheet and Deploy the Web App Once — Then Never Touch It Again
- Step 1: Go to sheets.google.com and create a new spreadsheet called "GNB Operations"
- Step 2: Click Extensions → Apps Script
- Step 3: Delete the placeholder code and paste in the Code.gs file (from your Drive → GNB_Configurator → apps-script)
- Step 4: Create a second file called "Index.html" and paste in the Index.html file from the same folder
- Step 5: Click the play button next to "setup" and authorize it (this creates your column headers)
- Step 6: Click Deploy → New Deployment → Web App → set access to "Anyone" → Deploy → Copy the URL

## Slide 4: One-Time Setup — Connect the Configurator to Your Backend
**Heading:** Paste One URL Into the Admin Panel and You're Done Forever
- Open the configurator (index.html) in any browser
- Click the gear icon (bottom-right) to open the Admin Panel
- Enter your PIN (default: 1234)
- Scroll to "Business Info" section
- Paste your Web App URL into the "Webhook URL" field
- Click Save
- That's it — the configurator will now send jobs to your Google Sheet automatically

## Slide 5: Using the Configurator — Customer Info
**Heading:** Fill In the Customer's Basic Info to Start an Estimate
- Open the configurator on your tablet, phone, or laptop
- Enter the customer's Name, Email, Phone, and Address
- Click "Next" to proceed
- This info carries through the entire estimate and gets sent to the Ops Board automatically
- Works offline — no internet needed at the job site

## Slide 6: Using the Configurator — Choose Profile and Stamp
**Heading:** Select the Border Profile and Stamp Pattern — Prices Update Live
- Choose from Mountain profiles (Great Northern, Badrock Canyon) or Wilderness profiles (Scapegoat)
- Each profile shows its price add-on per foot
- Then choose a stamp pattern (No Stamp, Granite, River Rock)
- The running price per foot updates in the green header bar in real time
- The customer can see exactly what they're paying for as you build the estimate

## Slide 7: Using the Configurator — Extras, Footage, and Notes
**Heading:** Add Cable, Color, Enter Footage, and Drop Any Notes
- Check the boxes for Cable Reinforcement and/or Integral Colour
- Enter the total linear feet for the job
- Add any notes (gate codes, color preferences, special instructions)
- The system calculates the total automatically: price per foot × footage

## Slide 8: Using the Configurator — The Summary Step
**Heading:** Review the Complete Estimate — Then Send It Anywhere
- The summary shows everything: customer, profile, stamp, extras, footage, price per foot, and total
- Four action buttons available:
  - **Back** — go back and change anything
  - **Print** — print or save as PDF for the customer
  - **Send Estimate** — emails the estimate to the customer
  - **Send to Ops Board** — fires the job to your Google Sheet and generates a transfer code

## Slide 9: The Transfer Code System
**Heading:** A Simple Word + Number Gets Your Job Onto Any Device
- When you click "Send to Ops Board," the system generates a code like **muffin33** or **eagle72**
- Write it down or remember it — it's intentionally simple
- On any other device, open the Ops Board (War Board) and enter that code
- The job appears on the board immediately, ready to schedule
- No login, no account, no QR code — just a word and a number

## Slide 10: The Ops Board (War Board) — Your Job Command Center
**Heading:** All Your Jobs on One Screen — Drag, Drop, Click, Done
- The War Board shows all jobs as cards organized by status: Scheduled, In Progress, Complete
- Each card shows: customer name, address, estimate total, and status
- **Drag and drop** cards between columns to update status
- **Click** any card to open the full job sheet with all details
- **Add jobs manually** with the + button if you need to enter one that didn't come from the configurator
- Works on PC, tablet, and phone — same URL, same data

## Slide 11: The Full Job Sheet — Extended Details
**Heading:** Every Detail About the Job Lives in One Place
- The job sheet opens when you click a card on the War Board
- It shows everything from the configurator PLUS extended fields:
  - **Color Palette** — tag your standard colors for the job
  - **Run Descriptions** — describe each run (e.g., "Front walkway - 40ft")
  - **Prep Work** — what prep is needed and how much
  - **Boss Notes** — freeform field for anything extra
- Auto-saves every change — no "save" button needed, no data loss
- Click "Finalize" when the job is done → sends email backup to greatnorthernborders@gmail.com

## Slide 12: Sending the Configurator to Another Device
**Heading:** Export a Portable Copy That Works Anywhere Without Setup
- Go to Admin Panel → Advanced Configuration → "Export Portable HTML"
- Downloads a file like `gnb-configurator-2026-05-11.html`
- This file has ALL your settings baked in (prices, products, company name, colors, webhook URL)
- Send it to any device — email it, AirDrop it, put it on a USB drive
- It opens and works immediately with your settings — no configuration needed on the other end

## Slide 13: Quick Reference — The Complete Flow
**Heading:** Estimate → Transfer Code → War Board → Job Sheet → Email Backup
- 1. Open configurator → fill out estimate → click "Send to Ops Board"
- 2. Get transfer code (e.g., muffin33)
- 3. Open War Board on any device → enter code → job appears
- 4. Drag job card to "In Progress" when you start
- 5. Click card → fill in extended details (colors, runs, prep, notes)
- 6. Drag to "Complete" or click "Finalize" → email backup sent automatically
- Total time from estimate to scheduled job: under 60 seconds
