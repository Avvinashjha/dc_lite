/**
 * ============================================================
 * GOOGLE APPS SCRIPT - Copy this to Google Apps Script Editor
 * ============================================================
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a new Google Sheet at https://sheets.google.com
 *    - Name it "DailyCoder Subscribers"
 *    - Add headers in Row 1: Email | Timestamp | Source
 * 
 * 2. Go to Extensions → Apps Script
 * 
 * 3. Delete everything in Code.gs and paste the code below
 * 
 * 4. Click Deploy → New Deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click Deploy
 * 
 * 5. Copy the Web App URL (looks like: https://script.google.com/macros/s/XXXX/exec)
 * 
 * 6. Paste the URL in content/config.json:
 *    "newsletter": {
 *      "enabled": true,
 *      "googleScriptUrl": "https://script.google.com/macros/s/XXXX/exec"
 *    }
 * 
 * 7. Rebuild and deploy your site
 * 
 * That's it! Emails will be saved to your Google Sheet.
 * ============================================================
 */

// ---- COPY EVERYTHING BELOW THIS LINE INTO APPS SCRIPT ----

/*
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    var email = e.parameter.email;
    var timestamp = e.parameter.timestamp || new Date().toISOString();
    
    // Check for duplicate emails
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === email) {
        return ContentService
          .createTextOutput(JSON.stringify({ status: 'exists', message: 'Already subscribed' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Add new subscriber
    sheet.appendRow([email, timestamp, 'website']);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Subscribed!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Newsletter API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
*/
