/**
 * ============================================================
 * GOOGLE SHEETS + APPS SCRIPT SETUP (COMMENTS + SUBSCRIBERS)
 * ============================================================
 *
 * WHAT THIS ENABLES:
 * 1) Blog comments form submission (stored in Google Sheet)
 * 2) Email subscribe form submission (stored in Google Sheet)
 * 3) Manual newsletter/update broadcast to all subscribers
 *
 * ------------------------------------------------------------
 * STEP 1: CREATE GOOGLE SHEET
 * ------------------------------------------------------------
 * Create one Google Sheet and add these tabs with headers:
 *
 * Tab 1: Subscribers
 * Headers (row 1):
 *   Email | Timestamp | Source | Status
 *
 * Tab 2: Comments
 * Headers (row 1):
 *   PostSlug | PostTitle | Name | Email | Comment | Timestamp | Status
 *
 * Recommended values:
 * - Status for new subscribers: active
 * - Status for new comments: approved
 *
 * ------------------------------------------------------------
 * STEP 2: CREATE APPS SCRIPT WEB APP
 * ------------------------------------------------------------
 * 1. In the sheet: Extensions -> Apps Script
 * 2. Replace Code.gs with the script below
 * 3. Deploy -> New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL:
 *    https://script.google.com/macros/s/XXXXX/exec
 *
 * ------------------------------------------------------------
 * STEP 3: ADD URL TO SITE CONFIG
 * ------------------------------------------------------------
 * In content/config.json set both URLs to the same web app URL:
 *
 * "newsletter": {
 *   "enabled": true,
 *   "googleScriptUrl": "https://script.google.com/macros/s/XXXXX/exec"
 * },
 * "comments": {
 *   "enabled": true,
 *   "googleScriptUrl": "https://script.google.com/macros/s/XXXXX/exec"
 * }
 *
 * ------------------------------------------------------------
 * STEP 4: BROADCAST EMAIL UPDATES
 * ------------------------------------------------------------
 * Use Apps Script editor and run:
 *   sendUpdateToSubscribers(subject, htmlBody)
 *
 * Example:
 *   sendUpdateToSubscribers(
 *     'New post: Rendering Strategies for Web Pages',
 *     '<p>New article is live.</p><p><a href="https://dailycoder.in/blog/rendering-strategies-for-web-page/">Read now</a></p>'
 *   )
 *
 * NOTE: First run asks for permission to send email via your Google account.
 * ============================================================
 */

// ---- COPY EVERYTHING BELOW INTO APPS SCRIPT ----

/*
const SHEET_SUBSCRIBERS = 'Subscribers';
const SHEET_COMMENTS = 'Comments';

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error('Missing sheet: ' + name);
  return sheet;
}

function normalizeEmail(email) {
  return (email || '').toString().trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function json(data, callback) {
  const payload = JSON.stringify(data);
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + payload + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const action = (e.parameter.action || '').toLowerCase();
    if (action === 'listcomments') {
      return handleListComments(e.parameter);
    }
    return json({ status: 'ok', message: 'DailyCoder API running' }, e.parameter.callback);
  } catch (error) {
    return json({ status: 'error', message: String(error) }, e.parameter.callback);
  }
}

function doPost(e) {
  try {
    const action = (e.parameter.action || '').toLowerCase();

    if (action === 'subscribe') {
      return handleSubscribe(e.parameter);
    }

    if (action === 'comment') {
      return handleComment(e.parameter);
    }

    return json({ status: 'error', message: 'Invalid action' });
  } catch (error) {
    return json({ status: 'error', message: String(error) });
  }
}

function handleSubscribe(params) {
  const email = normalizeEmail(params.email);
  const source = params.source || 'website';
  const timestamp = params.timestamp || new Date().toISOString();

  if (!isValidEmail(email)) {
    return json({ status: 'error', message: 'Invalid email' });
  }

  const sheet = getSheet(SHEET_SUBSCRIBERS);
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    const existingEmail = normalizeEmail(rows[i][0]);
    const status = (rows[i][3] || 'active').toString().toLowerCase();
    if (existingEmail === email && status === 'active') {
      return json({ status: 'exists', message: 'Already subscribed' });
    }
  }

  sheet.appendRow([email, timestamp, source, 'active']);
  return json({ status: 'success', message: 'Subscribed' });
}

function handleComment(params) {
  const postSlug = (params.postSlug || '').toString().trim();
  const postTitle = (params.postTitle || '').toString().trim();
  const name = (params.name || '').toString().trim();
  const email = normalizeEmail(params.email || '');
  const comment = (params.comment || '').toString().trim();
  const timestamp = params.timestamp || new Date().toISOString();

  if (!postSlug || !name || !comment) {
    return json({ status: 'error', message: 'Missing required fields' });
  }
  if (email && !isValidEmail(email)) {
    return json({ status: 'error', message: 'Invalid email' });
  }

  const sheet = getSheet(SHEET_COMMENTS);
  sheet.appendRow([postSlug, postTitle, name, email, comment, timestamp, 'approved']);

  return json({ status: 'success', message: 'Comment received' });
}

function handleListComments(params) {
  const callback = params.callback || '';
  const postSlug = (params.postSlug || '').toString().trim();
  if (!postSlug) {
    return json({ status: 'error', message: 'Missing postSlug' }, callback);
  }

  const sheet = getSheet(SHEET_COMMENTS);
  const rows = sheet.getDataRange().getValues();
  const comments = [];

  for (let i = 1; i < rows.length; i++) {
    const rowPostSlug = (rows[i][0] || '').toString().trim();
    const name = (rows[i][2] || '').toString().trim();
    const comment = (rows[i][4] || '').toString().trim();
    const timestamp = (rows[i][5] || '').toString().trim();
    const status = (rows[i][6] || '').toString().trim().toLowerCase();

    if (rowPostSlug !== postSlug) continue;
    if (status && status !== 'approved') continue;
    if (!comment) continue;

    comments.push({
      name: name || 'Anonymous',
      comment: comment,
      timestamp: timestamp
    });
  }

  comments.sort(function(a, b) {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  return json({ status: 'success', comments: comments }, callback);
}

function sendUpdateToSubscribers(subject, htmlBody) {
  if (!subject || !htmlBody) {
    throw new Error('Provide subject and htmlBody');
  }

  const sheet = getSheet(SHEET_SUBSCRIBERS);
  const rows = sheet.getDataRange().getValues();
  let sent = 0;

  for (let i = 1; i < rows.length; i++) {
    const email = normalizeEmail(rows[i][0]);
    const status = (rows[i][3] || 'active').toString().toLowerCase();
    if (!email || status !== 'active') continue;

    GmailApp.sendEmail(email, subject, 'HTML only email', {
      htmlBody: htmlBody,
      name: 'DailyCoder'
    });
    sent++;
  }

  Logger.log('Sent emails: ' + sent);
  return sent;
}
*/
