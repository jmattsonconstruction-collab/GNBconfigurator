/**
 * GNB Job Notification Webhook — Google Apps Script
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Click "New Project"
 * 3. Paste this entire file into the editor (replace any existing code)
 * 4. Click "Deploy" → "New deployment"
 * 5. Choose type: "Web app"
 * 6. Set "Execute as": "Me"
 * 7. Set "Who has access": "Anyone"
 * 8. Click "Deploy" and authorize when prompted
 * 9. Copy the Web App URL — paste it into the GNB_WEBHOOK_URL variable in gnb-ops.html and index.html
 *
 * The URL will look like: https://script.google.com/macros/s/AKfycb.../exec
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const recipient = 'greatnorthernborders@gmail.com';
    const subject = buildSubject(data);
    const body = buildEmailBody(data);
    const htmlBody = buildHtmlEmail(data);
    
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: body,
      htmlBody: htmlBody
    });
    
    // Also save to a Google Sheet for backup
    saveToSheet(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'Email sent' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'GNB Webhook is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function buildSubject(data) {
  const type = data.eventType || 'update';
  const name = data.name || 'Unknown';
  const code = data.transferCode || '';
  
  switch(type) {
    case 'job-finalized':
      return `[GNB] Job Finalized: ${name} ${code ? '(' + code + ')' : ''}`;
    case 'job-created':
      return `[GNB] New Job Created: ${name}`;
    case 'estimate-sent':
      return `[GNB] Estimate Sent: ${name}`;
    default:
      return `[GNB] Job Update: ${name}`;
  }
}

function buildEmailBody(data) {
  let text = `GNB JOB NOTIFICATION\n`;
  text += `${'='.repeat(40)}\n\n`;
  text += `Event: ${data.eventType || 'update'}\n`;
  text += `Transfer Code: ${data.transferCode || 'N/A'}\n`;
  text += `Date: ${new Date().toLocaleString()}\n\n`;
  
  text += `CUSTOMER\n${'-'.repeat(20)}\n`;
  text += `Name: ${data.name || ''}\n`;
  text += `Phone: ${data.phone || ''}\n`;
  text += `Email: ${data.email || ''}\n`;
  text += `Address: ${data.address || ''}\n\n`;
  
  text += `JOB DETAILS\n${'-'.repeat(20)}\n`;
  text += `Type: ${data.type || ''}\n`;
  text += `Stamp/Style: ${data.stamp || ''}\n`;
  text += `Total Footage: ${data.footage || ''} lf\n`;
  text += `Estimate: ${data.estimate || ''}\n`;
  text += `Scheduled: ${data.date || ''}\n`;
  text += `Crew: ${data.crew || ''}\n`;
  text += `Status: ${data.status || ''}\n\n`;
  
  if (data.colorPalette && data.colorPalette.length) {
    text += `COLOR PALETTE\n${'-'.repeat(20)}\n`;
    text += data.colorPalette.join(', ') + '\n\n';
  }
  
  if (data.runs && data.runs.length) {
    text += `RUNS\n${'-'.repeat(20)}\n`;
    data.runs.forEach((r, i) => {
      text += `  ${i+1}. ${r.description} — ${r.footage} lf\n`;
    });
    text += '\n';
  }
  
  if (data.prepWork || data.prepAmount) {
    text += `PREP WORK\n${'-'.repeat(20)}\n`;
    text += `Description: ${data.prepWork || ''}\n`;
    text += `Amount/Hours: ${data.prepAmount || ''}\n\n`;
  }
  
  if (data.bossNotes) {
    text += `BOSS NOTES\n${'-'.repeat(20)}\n`;
    text += `${data.bossNotes}\n\n`;
  }
  
  if (data.preNotes) {
    text += `PRE-JOB NOTES\n${'-'.repeat(20)}\n`;
    text += `${data.preNotes}\n\n`;
  }
  
  text += `${'='.repeat(40)}\n`;
  text += `Sent automatically by GNB Operations\n`;
  
  return text;
}

function buildHtmlEmail(data) {
  const colors = {
    green: '#2E7D4F',
    greenLight: '#E8F5EE',
    blue: '#1B6CA8',
    blueLight: '#E8F2FA',
    grey: '#4A5568',
    greyLight: '#F4F5F7',
    border: '#DDE1E9',
    text: '#1A202C'
  };
  
  let runsHtml = '';
  if (data.runs && data.runs.length) {
    runsHtml = data.runs.map((r, i) => 
      `<tr><td style="padding:6px 10px;border-bottom:1px solid ${colors.border};font-size:14px;">${i+1}</td>
       <td style="padding:6px 10px;border-bottom:1px solid ${colors.border};font-size:14px;">${r.description || ''}</td>
       <td style="padding:6px 10px;border-bottom:1px solid ${colors.border};font-size:14px;text-align:right;">${r.footage || ''} lf</td></tr>`
    ).join('');
  }
  
  let colorsHtml = '';
  if (data.colorPalette && data.colorPalette.length) {
    colorsHtml = data.colorPalette.map(c => 
      `<span style="display:inline-block;padding:4px 10px;margin:2px;background:${colors.greenLight};border:1px solid ${colors.green};border-radius:12px;font-size:12px;font-weight:600;">${c}</span>`
    ).join('');
  }

  return `
  <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
    <div style="background:#2D3748;padding:16px 20px;border-radius:8px 8px 0 0;">
      <h1 style="margin:0;font-size:18px;color:#fff;letter-spacing:1px;">GNB <span style="color:${colors.green};">OPS</span></h1>
      <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:1px;">${data.eventType === 'job-finalized' ? 'Job Finalized' : data.eventType === 'estimate-sent' ? 'Estimate Sent' : 'Job Update'}</p>
    </div>
    
    <div style="padding:20px;border:1px solid ${colors.border};border-top:none;">
      ${data.transferCode ? `<div style="text-align:center;margin-bottom:16px;padding:12px;background:${colors.blueLight};border-radius:8px;border:2px solid ${colors.blue};">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${colors.blue};font-weight:700;">Transfer Code</div>
        <div style="font-size:28px;font-weight:900;color:${colors.blue};letter-spacing:2px;margin-top:4px;">${data.transferCode}</div>
      </div>` : ''}
      
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr style="background:${colors.greyLight};">
          <td style="padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${colors.grey};font-weight:700;" colspan="2">Customer</td>
        </tr>
        <tr>
          <td style="padding:6px 10px;font-size:14px;font-weight:700;border-bottom:1px solid ${colors.border};">${data.name || ''}</td>
          <td style="padding:6px 10px;font-size:14px;border-bottom:1px solid ${colors.border};text-align:right;">${data.phone || ''}</td>
        </tr>
        <tr>
          <td style="padding:6px 10px;font-size:13px;color:${colors.grey};border-bottom:1px solid ${colors.border};">${data.address || ''}</td>
          <td style="padding:6px 10px;font-size:13px;color:${colors.grey};border-bottom:1px solid ${colors.border};text-align:right;">${data.email || ''}</td>
        </tr>
      </table>
      
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr style="background:${colors.greyLight};">
          <td style="padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${colors.grey};font-weight:700;" colspan="3">Job Details</td>
        </tr>
        <tr>
          <td style="padding:6px 10px;font-size:14px;border-bottom:1px solid ${colors.border};"><strong>Stamp:</strong> ${data.stamp || '—'}</td>
          <td style="padding:6px 10px;font-size:14px;border-bottom:1px solid ${colors.border};"><strong>Footage:</strong> ${data.footage || '—'} lf</td>
          <td style="padding:6px 10px;font-size:14px;border-bottom:1px solid ${colors.border};"><strong>Estimate:</strong> ${data.estimate || '—'}</td>
        </tr>
        <tr>
          <td style="padding:6px 10px;font-size:14px;border-bottom:1px solid ${colors.border};"><strong>Date:</strong> ${data.date || '—'}</td>
          <td style="padding:6px 10px;font-size:14px;border-bottom:1px solid ${colors.border};"><strong>Crew:</strong> ${data.crew || '—'}</td>
          <td style="padding:6px 10px;font-size:14px;border-bottom:1px solid ${colors.border};"><strong>Status:</strong> ${data.status || '—'}</td>
        </tr>
      </table>
      
      ${colorsHtml ? `<div style="margin-bottom:16px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${colors.grey};font-weight:700;margin-bottom:6px;">Color Palette</div>
        ${colorsHtml}
      </div>` : ''}
      
      ${runsHtml ? `<table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr style="background:${colors.greyLight};">
          <td style="padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${colors.grey};font-weight:700;" colspan="3">Runs</td>
        </tr>
        <tr style="background:${colors.border};">
          <th style="padding:6px 10px;font-size:11px;text-align:left;">#</th>
          <th style="padding:6px 10px;font-size:11px;text-align:left;">Description</th>
          <th style="padding:6px 10px;font-size:11px;text-align:right;">Footage</th>
        </tr>
        ${runsHtml}
      </table>` : ''}
      
      ${data.prepWork ? `<div style="margin-bottom:16px;padding:10px;background:${colors.greyLight};border-radius:6px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${colors.grey};font-weight:700;margin-bottom:4px;">Prep Work</div>
        <div style="font-size:14px;">${data.prepWork}${data.prepAmount ? ' — <strong>' + data.prepAmount + '</strong>' : ''}</div>
      </div>` : ''}
      
      ${data.bossNotes ? `<div style="margin-bottom:16px;padding:10px;background:#FDF8E8;border-left:3px solid #B8860B;border-radius:4px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8B6508;font-weight:700;margin-bottom:4px;">Boss Notes</div>
        <div style="font-size:14px;">${data.bossNotes}</div>
      </div>` : ''}
      
      ${data.preNotes ? `<div style="margin-bottom:16px;padding:10px;background:${colors.greyLight};border-radius:6px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${colors.grey};font-weight:700;margin-bottom:4px;">Pre-Job Notes</div>
        <div style="font-size:14px;">${data.preNotes}</div>
      </div>` : ''}
    </div>
    
    <div style="padding:12px 20px;background:${colors.greyLight};border-radius:0 0 8px 8px;border:1px solid ${colors.border};border-top:none;">
      <p style="margin:0;font-size:11px;color:${colors.grey};text-align:center;">Sent automatically by GNB Operations · ${new Date().toLocaleDateString()}</p>
    </div>
  </div>`;
}

function saveToSheet(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('GNB Job Log');
    let sheet = ss.getSheetByName('Jobs');
    if (!sheet) {
      sheet = ss.insertSheet('Jobs');
      sheet.appendRow([
        'Timestamp', 'Event', 'Transfer Code', 'Name', 'Phone', 'Email', 
        'Address', 'Type', 'Stamp', 'Footage', 'Estimate', 'Date', 
        'Crew', 'Status', 'Colors', 'Runs', 'Prep', 'Boss Notes'
      ]);
    }
    
    const runsText = (data.runs || []).map(r => `${r.description}: ${r.footage}lf`).join('; ');
    const colorsText = (data.colorPalette || []).join(', ');
    
    sheet.appendRow([
      new Date(),
      data.eventType || 'update',
      data.transferCode || '',
      data.name || '',
      data.phone || '',
      data.email || '',
      data.address || '',
      data.type || '',
      data.stamp || '',
      data.footage || '',
      data.estimate || '',
      data.date || '',
      data.crew || '',
      data.status || '',
      colorsText,
      runsText,
      (data.prepWork || '') + (data.prepAmount ? ' (' + data.prepAmount + ')' : ''),
      data.bossNotes || ''
    ]);
  } catch(e) {
    // Sheet save is best-effort, don't fail the email
    console.log('Sheet save error: ' + e.toString());
  }
}
