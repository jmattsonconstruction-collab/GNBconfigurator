/**
 * GNB Operations — Google Apps Script Backend
 * 
 * This file powers the entire GNB Operations web app.
 * It serves the HTML frontend and handles all data operations via Google Sheets.
 *
 * GOOGLE SHEETS SCHEMA (auto-created on first run):
 * ─────────────────────────────────────────────────
 * Sheet: "Jobs"
 * Columns: id | transferCode | name | phone | email | address | type | status | date |
 *          stamp | footage | estimate | crew | access | deposit | depositAmt |
 *          colorPalette | runs | prepWork | prepAmount | bossNotes | preNotes | postNotes |
 *          equipment | sodDone | eodDone | locked | createdAt | updatedAt
 *
 * Sheet: "Config"
 * Columns: key | value
 * (Stores labels, equipment list, checklists, webhook URL, etc.)
 */

// ════════════════════════════════════════════
// WEB APP ENTRY POINTS
// ════════════════════════════════════════════

function doGet(e) {
  const page = e.parameter.page || 'main';
  if (page === 'main') {
    return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('GNB Operations')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, user-scalable=no');
  }
  return HtmlService.createHtmlOutput('Page not found');
}

function doPost(e) {
  // Webhook endpoint for configurator
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action === 'submit-job') {
      const job = createJobFromWebhook(data.job);
      sendNotificationEmail(job, 'job-created');
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok', transferCode: job.transferCode }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (data.action === 'lookup-code') {
      const job = getJobByCode(data.code);
      return ContentService
        .createTextOutput(JSON.stringify({ status: job ? 'ok' : 'not-found', job: job }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'Unknown action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ════════════════════════════════════════════
// SHEET INITIALIZATION
// ════════════════════════════════════════════

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
  }
  return sheet;
}

const JOB_HEADERS = [
  'id', 'transferCode', 'name', 'phone', 'email', 'address',
  'type', 'status', 'date', 'stamp', 'footage', 'estimate',
  'crew', 'access', 'deposit', 'depositAmt',
  'colorPalette', 'runs', 'prepWork', 'prepAmount',
  'bossNotes', 'preNotes', 'postNotes',
  'equipment', 'sodDone', 'eodDone',
  'locked', 'createdAt', 'updatedAt'
];

function initSheets() {
  getOrCreateSheet('Jobs', JOB_HEADERS);
  const configSheet = getOrCreateSheet('Config', ['key', 'value']);
  // Seed default config if empty
  if (configSheet.getLastRow() <= 1) {
    const defaults = [
      ['labels_hw', 'Homeowner'],
      ['labels_con', 'Contractor'],
      ['labels_nc', 'Carve'],
      ['equipment', 'Mixer,Edger,Stamp Tools,Colorant,Cable,Sprayer,Sealer,Curing Compound,Water Tank,Forms/Stakes'],
      ['sodChecklist', 'Mixer loaded,Stamps loaded,Colorant loaded,Cable stocked,Water tank full,Forms & stakes onboard,Hand tools packed,Safety gear onboard'],
      ['eodChecklist', 'Mixer cleaned,Stamps cleaned & stored,Leftover material secured,Tools returned,Site cleaned,Photos taken,Invoice notes updated'],
      ['defaultColors', 'Buff,Charcoal,Terra Cotta,Slate Grey,Desert Tan,Sandstone'],
      ['notifyEmail', 'greatnorthernborders@gmail.com'],
      ['seasonStart', '4'],
      ['seasonEnd', '11']
    ];
    defaults.forEach(row => configSheet.appendRow(row));
  }
}

// ════════════════════════════════════════════
// TRANSFER CODE GENERATION
// ════════════════════════════════════════════

const CODE_NOUNS = [
  'clock','dog','muffin','river','hammer','eagle','stone','cedar',
  'truck','badge','arrow','flame','moose','cabin','ridge','trail',
  'storm','forge','steel','maple','aspen','creek','summit','wolf',
  'bear','pine','slate','gravel','iron','copper','timber','boulder',
  'falcon','canyon','mesa','drift','frost','ember','flint','sage',
  'birch','oak','elk','hawk','bass','pike','trout','otter','lynx','fox'
];

function generateTransferCode() {
  const noun = CODE_NOUNS[Math.floor(Math.random() * CODE_NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10; // 10-99
  const code = noun + num;
  // Ensure uniqueness
  const sheet = getOrCreateSheet('Jobs', JOB_HEADERS);
  const data = sheet.getDataRange().getValues();
  const codeCol = JOB_HEADERS.indexOf('transferCode');
  const exists = data.some(row => row[codeCol] === code);
  if (exists) return generateTransferCode(); // retry (collision extremely unlikely)
  return code;
}

// ════════════════════════════════════════════
// JOB CRUD OPERATIONS (called from frontend)
// ════════════════════════════════════════════

function getAllJobs() {
  const sheet = getOrCreateSheet('Jobs', JOB_HEADERS);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      let val = row[i];
      // Parse JSON fields
      if (['colorPalette', 'runs', 'equipment', 'sodDone', 'eodDone'].includes(h)) {
        try { val = JSON.parse(val); } catch(e) { val = h === 'runs' || h === 'colorPalette' ? [] : {}; }
      }
      if (h === 'deposit' || h === 'locked') {
        val = val === true || val === 'true';
      }
      obj[h] = val;
    });
    return obj;
  }).filter(j => j.id); // skip empty rows
}

function getJobByCode(code) {
  const jobs = getAllJobs();
  return jobs.find(j => j.transferCode === code.toLowerCase().trim()) || null;
}

function saveJob(jobData) {
  const sheet = getOrCreateSheet('Jobs', JOB_HEADERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf('id');
  
  // Serialize complex fields
  const serialized = {};
  JOB_HEADERS.forEach(h => {
    let val = jobData[h];
    if (['colorPalette', 'runs', 'equipment', 'sodDone', 'eodDone'].includes(h)) {
      val = JSON.stringify(val || (h === 'runs' || h === 'colorPalette' ? [] : {}));
    }
    if (h === 'deposit' || h === 'locked') {
      val = val ? 'true' : 'false';
    }
    serialized[h] = val !== undefined && val !== null ? val : '';
  });
  serialized.updatedAt = new Date().toISOString();
  
  // Find existing row
  let rowIdx = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === jobData.id) { rowIdx = i + 1; break; }
  }
  
  const rowValues = JOB_HEADERS.map(h => serialized[h]);
  
  if (rowIdx > 0) {
    // Update existing
    sheet.getRange(rowIdx, 1, 1, JOB_HEADERS.length).setValues([rowValues]);
  } else {
    // New job
    if (!serialized.id) serialized.id = 'job_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    if (!serialized.transferCode) serialized.transferCode = generateTransferCode();
    if (!serialized.createdAt) serialized.createdAt = new Date().toISOString();
    const newRow = JOB_HEADERS.map(h => serialized[h] || (h === 'id' ? serialized.id : h === 'transferCode' ? serialized.transferCode : h === 'createdAt' ? serialized.createdAt : ''));
    sheet.appendRow(newRow);
  }
  
  return { id: serialized.id || jobData.id, transferCode: serialized.transferCode || jobData.transferCode };
}

function deleteJob(jobId) {
  const sheet = getOrCreateSheet('Jobs', JOB_HEADERS);
  const data = sheet.getDataRange().getValues();
  const idCol = 0; // 'id' is first column
  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === jobId) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

function createJobFromWebhook(jobData) {
  jobData.id = 'job_' + Date.now() + '_' + Math.random().toString(36).slice(2);
  jobData.transferCode = generateTransferCode();
  jobData.createdAt = new Date().toISOString();
  jobData.status = jobData.status || 'scheduled';
  jobData.type = jobData.type || 'hw';
  jobData.locked = false;
  jobData.equipment = jobData.equipment || {};
  jobData.sodDone = jobData.sodDone || {};
  jobData.eodDone = jobData.eodDone || {};
  jobData.colorPalette = jobData.colorPalette || [];
  jobData.runs = jobData.runs || [];
  
  saveJob(jobData);
  return jobData;
}

// ════════════════════════════════════════════
// FINALIZE JOB (triggers email)
// ════════════════════════════════════════════

function finalizeJob(jobId) {
  const jobs = getAllJobs();
  const job = jobs.find(j => j.id === jobId);
  if (!job) return { status: 'error', message: 'Job not found' };
  
  job.status = 'scheduled';
  saveJob(job);
  sendNotificationEmail(job, 'job-finalized');
  return { status: 'ok', transferCode: job.transferCode };
}

// ════════════════════════════════════════════
// EMAIL NOTIFICATIONS
// ════════════════════════════════════════════

function sendNotificationEmail(job, eventType) {
  const config = getConfig();
  const recipient = config.notifyEmail || 'greatnorthernborders@gmail.com';
  
  const typeLabels = { hw: config.labels_hw || 'Homeowner', con: config.labels_con || 'Contractor', nc: config.labels_nc || 'Carve' };
  const eventLabels = { 'job-created': 'New Job Created', 'job-finalized': 'Job Finalized', 'job-updated': 'Job Updated' };
  
  const subject = `[GNB] ${eventLabels[eventType] || 'Job Update'}: ${job.name || 'Unknown'} ${job.transferCode ? '(' + job.transferCode + ')' : ''}`;
  
  let body = `GNB JOB NOTIFICATION\n${'='.repeat(40)}\n\n`;
  body += `Event: ${eventLabels[eventType] || eventType}\n`;
  body += `Transfer Code: ${job.transferCode || 'N/A'}\n`;
  body += `Time: ${new Date().toLocaleString()}\n\n`;
  body += `CUSTOMER\n${'-'.repeat(20)}\n`;
  body += `Name: ${job.name || ''}\nPhone: ${job.phone || ''}\nEmail: ${job.email || ''}\nAddress: ${job.address || ''}\n\n`;
  body += `JOB DETAILS\n${'-'.repeat(20)}\n`;
  body += `Type: ${typeLabels[job.type] || job.type || ''}\nStamp: ${job.stamp || ''}\nFootage: ${job.footage || ''} lf\n`;
  body += `Estimate: ${job.estimate || ''}\nDate: ${job.date || ''}\nCrew: ${job.crew || ''}\n\n`;
  
  if (job.colorPalette && job.colorPalette.length) {
    body += `COLORS: ${job.colorPalette.join(', ')}\n\n`;
  }
  if (job.runs && job.runs.length) {
    body += `RUNS\n${'-'.repeat(20)}\n`;
    job.runs.forEach((r, i) => { body += `  ${i+1}. ${r.description} — ${r.footage} lf\n`; });
    body += '\n';
  }
  if (job.prepWork) body += `PREP: ${job.prepWork} (${job.prepAmount || ''})\n\n`;
  if (job.bossNotes) body += `BOSS NOTES: ${job.bossNotes}\n\n`;
  
  try {
    MailApp.sendEmail({ to: recipient, subject: subject, body: body });
  } catch(e) {
    console.log('Email send error: ' + e.toString());
  }
}

// ════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════

function getConfig() {
  const sheet = getOrCreateSheet('Config', ['key', 'value']);
  const data = sheet.getDataRange().getValues();
  const config = {};
  data.slice(1).forEach(row => { if (row[0]) config[row[0]] = row[1]; });
  return config;
}

function getConfigForClient() {
  const config = getConfig();
  return {
    labels: { hw: config.labels_hw || 'Homeowner', con: config.labels_con || 'Contractor', nc: config.labels_nc || 'Carve' },
    equipment: (config.equipment || '').split(',').map(s => s.trim()).filter(Boolean),
    sodChecklist: (config.sodChecklist || '').split(',').map(s => s.trim()).filter(Boolean),
    eodChecklist: (config.eodChecklist || '').split(',').map(s => s.trim()).filter(Boolean),
    defaultColors: (config.defaultColors || '').split(',').map(s => s.trim()).filter(Boolean),
    seasonStart: parseInt(config.seasonStart) || 4,
    seasonEnd: parseInt(config.seasonEnd) || 11
  };
}

// ════════════════════════════════════════════
// SETUP (run once manually)
// ════════════════════════════════════════════

function setup() {
  initSheets();
  console.log('GNB Operations sheets initialized successfully.');
}
