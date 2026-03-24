/**
 * Google Apps Script for DailyCoder
 *
 * Deploy as Web App: Execute as "Me", Access "Anyone".
 * After editing, create a new deployment version for changes to take effect.
 *
 * This script handles:
 *   - Newsletter subscriptions
 *   - Blog/problem comments
 *   - User progress sync (problem-progress, problem-favorites, problem-notes)
 *   - Course enrollment sync
 *   - Problem discussion (shared, server-backed)
 *
 * Sheet tabs used:
 *   - subscribers          (newsletter)
 *   - comments             (blog/problem comments)
 *   - user_progress        (problem progress + favorites + notes)
 *   - user_enrollments     (course enrollment + lesson tracking)
 *   - problem_discussions   (shared problem discussions)
 */

// ─── Helpers ───────────────────────────────────────────────────────────────

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonpResponse(obj, callback) {
  return ContentService.createTextOutput(callback + '(' + JSON.stringify(obj) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length) {
      sheet.appendRow(headers);
    }
  }
  return sheet;
}

/**
 * Verify a Firebase ID token by calling Google's tokeninfo endpoint.
 * Returns the decoded token payload (with uid, email, etc.) or null if invalid.
 */
function verifyFirebaseToken(idToken) {
  if (!idToken) return null;
  try {
    var url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken);
    var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) return null;
    var payload = JSON.parse(res.getContentText());
    if (!payload.sub) return null;
    return { uid: payload.sub, email: payload.email || '', name: payload.name || '' };
  } catch (ex) {
    return null;
  }
}

/**
 * Extract Bearer token from Authorization header or from params.
 * Apps Script Web Apps receive headers via e.parameter for GET,
 * and via the JSON body for POST (we pass it as `idToken`).
 */
function getAuthUid(e, params) {
  var token = (params && params.idToken) || (e.parameter && e.parameter.idToken) || '';
  if (!token) return null;
  var verified = verifyFirebaseToken(token);
  return verified ? verified.uid : null;
}

// ─── GET handler ───────────────────────────────────────────────────────────

function doGet(e) {
  var action = (e.parameter.action || '').trim();
  var callback = e.parameter.callback || '';

  // ── List comments ──
  if (action === 'listComments') {
    var postSlug = e.parameter.postSlug || '';
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('comments');
    var comments = [];

    if (sheet) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][1] === postSlug) {
          comments.push({
            name: data[i][3],
            email: data[i][4],
            comment: data[i][5],
            timestamp: data[i][6]
          });
        }
      }
    }

    var result = { status: 'success', comments: comments };
    if (callback) return jsonpResponse(result, callback);
    return jsonResponse(result);
  }

  // ── Get user progress (auth required) ──
  if (action === 'getProgress') {
    var uid = getAuthUid(e, {}) || e.parameter.uid;
    if (!uid) return jsonResponse({ status: 'error', message: 'Missing uid or invalid token' });

    var tokenUid = getAuthUid(e, {});
    if (tokenUid && tokenUid !== uid) {
      return jsonResponse({ status: 'error', message: 'Token uid mismatch' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('user_progress');
    if (!sheet) return jsonResponse({ status: 'success', items: [] });

    var data = sheet.getDataRange().getValues();
    var items = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === uid) {
        var parsed = {};
        try { parsed = JSON.parse(data[i][3] || '{}'); } catch (ex) { parsed = {}; }
        items.push({
          type: data[i][1],
          slug: data[i][2],
          data: parsed,
          updatedAt: data[i][4]
        });
      }
    }
    return jsonResponse({ status: 'success', items: items });
  }

  // ── Get user enrollments (auth required) ──
  if (action === 'getEnrollments') {
    var uid = getAuthUid(e, {}) || e.parameter.uid;
    if (!uid) return jsonResponse({ status: 'error', message: 'Missing uid or invalid token' });

    var tokenUid = getAuthUid(e, {});
    if (tokenUid && tokenUid !== uid) {
      return jsonResponse({ status: 'error', message: 'Token uid mismatch' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('user_enrollments');
    if (!sheet) return jsonResponse({ status: 'success', enrollments: [] });

    var data = sheet.getDataRange().getValues();
    var enrollments = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === uid) {
        enrollments.push({
          courseSlug: data[i][1],
          enrolledAt: data[i][2],
          lastLesson: data[i][3],
          lastLessonAt: data[i][4],
          updatedAt: data[i][5]
        });
      }
    }
    return jsonResponse({ status: 'success', enrollments: enrollments });
  }

  // ── Get problem discussion ──
  if (action === 'getDiscussion') {
    var slug = e.parameter.slug || '';
    if (!slug) return jsonResponse({ status: 'error', message: 'Missing slug' });

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('problem_discussions');
    if (!sheet) return jsonResponse({ status: 'success', posts: [] });

    var data = sheet.getDataRange().getValues();
    var posts = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === slug) {
        posts.push({
          name: data[i][1],
          message: data[i][2],
          uid: data[i][3],
          ts: data[i][4],
          timestamp: data[i][5]
        });
      }
    }
    // Newest first
    posts.sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });

    var result = { status: 'success', posts: posts };
    if (callback) return jsonpResponse(result, callback);
    return jsonResponse(result);
  }

  return jsonResponse({ status: 'error', message: 'Unknown action' });
}

// ─── POST handler ──────────────────────────────────────────────────────────

function doPost(e) {
  var contentType = e.postData ? e.postData.type : '';
  var action = '';
  var params = {};

  // Determine action from JSON body (sent as text/plain to avoid CORS preflight) or form data
  if (contentType === 'application/json' || contentType === 'text/plain') {
    try {
      params = JSON.parse(e.postData.contents);
      action = params.action || '';
    } catch (ex) {
      return jsonResponse({ status: 'error', message: 'Invalid JSON' });
    }
  } else {
    action = e.parameter.action || '';
    params = e.parameter;
  }

  // ── Newsletter subscribe ──
  if (action === 'subscribe') {
    var email = params.email || e.parameter.email || '';
    var source = params.source || e.parameter.source || 'website';
    var timestamp = params.timestamp || e.parameter.timestamp || new Date().toISOString();

    if (!email) return jsonResponse({ status: 'error', message: 'Email required' });

    var sheet = getOrCreateSheet('subscribers', ['id', 'email', 'source', 'timestamp']);
    var id = Utilities.getUuid();
    sheet.appendRow([id, email, source, timestamp]);

    return jsonResponse({ status: 'success' });
  }

  // ── Post comment (auth verified if token provided) ──
  if (action === 'comment') {
    var verifiedUid = getAuthUid(e, params);
    var postSlug = params.postSlug || e.parameter.postSlug || '';
    var postTitle = params.postTitle || e.parameter.postTitle || '';
    var name = params.name || e.parameter.name || 'Anonymous';
    var email = params.email || e.parameter.email || '';
    var comment = params.comment || e.parameter.comment || '';
    var timestamp = params.timestamp || e.parameter.timestamp || new Date().toISOString();
    var uid = verifiedUid || params.uid || e.parameter.uid || '';

    if (!comment || !postSlug) {
      return jsonResponse({ status: 'error', message: 'Comment and postSlug required' });
    }

    var sheet = getOrCreateSheet('comments', ['id', 'postSlug', 'postTitle', 'name', 'email', 'comment', 'timestamp', 'uid']);
    var id = Utilities.getUuid();
    sheet.appendRow([id, postSlug, postTitle, name, email, comment, timestamp, uid]);

    return jsonResponse({ status: 'success' });
  }

  // ── Save user progress (batch, auth required) ──
  if (action === 'saveProgress') {
    var verifiedUid = getAuthUid(e, params);
    var uid = verifiedUid || params.uid;
    var items = params.items || [];

    if (!uid) return jsonResponse({ status: 'error', message: 'Missing uid' });
    if (verifiedUid && verifiedUid !== params.uid) {
      return jsonResponse({ status: 'error', message: 'Token uid mismatch' });
    }

    var sheet = getOrCreateSheet('user_progress', ['uid', 'type', 'slug', 'data', 'updatedAt', 'createdAt']);

    var existing = sheet.getDataRange().getValues();
    var lookup = {};
    for (var i = 1; i < existing.length; i++) {
      lookup[existing[i][0] + '|' + existing[i][1] + '|' + existing[i][2]] = i + 1;
    }

    items.forEach(function (item) {
      var key = uid + '|' + item.type + '|' + item.slug;
      var dataStr = JSON.stringify(item.data || {});
      var now = new Date().toISOString();

      if (lookup[key]) {
        var rowNum = lookup[key];
        var existingUpdatedAt = existing[rowNum - 1][4] || 0;
        if (item.updatedAt >= existingUpdatedAt) {
          sheet.getRange(rowNum, 4).setValue(dataStr);
          sheet.getRange(rowNum, 5).setValue(item.updatedAt);
        }
      } else {
        sheet.appendRow([uid, item.type, item.slug, dataStr, item.updatedAt, now]);
        lookup[key] = sheet.getLastRow();
      }
    });

    return jsonResponse({ status: 'success', saved: items.length });
  }

  // ── Save course enrollment (auth required) ──
  if (action === 'saveEnrollment') {
    var verifiedUid = getAuthUid(e, params);
    var uid = verifiedUid || params.uid;
    var courseSlug = params.courseSlug;

    if (!uid || !courseSlug) {
      return jsonResponse({ status: 'error', message: 'Missing uid or courseSlug' });
    }
    if (verifiedUid && verifiedUid !== params.uid) {
      return jsonResponse({ status: 'error', message: 'Token uid mismatch' });
    }

    var sheet = getOrCreateSheet('user_enrollments', [
      'uid', 'courseSlug', 'enrolledAt', 'lastLesson', 'lastLessonAt', 'updatedAt', 'createdAt'
    ]);

    var existing = sheet.getDataRange().getValues();
    var lookup = {};
    for (var i = 1; i < existing.length; i++) {
      lookup[existing[i][0] + '|' + existing[i][1]] = i + 1;
    }

    var key = uid + '|' + courseSlug;
    var now = new Date().toISOString();

    if (lookup[key]) {
      var rowNum = lookup[key];
      if (params.lastLesson) sheet.getRange(rowNum, 4).setValue(params.lastLesson);
      if (params.lastLessonAt) sheet.getRange(rowNum, 5).setValue(params.lastLessonAt);
      sheet.getRange(rowNum, 6).setValue(params.updatedAt || Date.now());
    } else {
      sheet.appendRow([
        uid,
        courseSlug,
        params.enrolledAt || Date.now(),
        params.lastLesson || '',
        params.lastLessonAt || '',
        params.updatedAt || Date.now(),
        now
      ]);
    }

    return jsonResponse({ status: 'success' });
  }

  // ── Post to problem discussion (auth verified if token provided) ──
  if (action === 'postDiscussion') {
    var verifiedUid = getAuthUid(e, params);

    var slug = params.slug || '';
    var name = params.name || 'Anonymous';
    var message = params.message || '';
    var uid = verifiedUid || params.uid || '';
    var timestamp = params.timestamp || new Date().toISOString();

    if (!slug || !message) {
      return jsonResponse({ status: 'error', message: 'slug and message required' });
    }

    var sheet = getOrCreateSheet('problem_discussions', [
      'slug', 'name', 'message', 'uid', 'ts', 'timestamp'
    ]);

    var ts = new Date(timestamp).getTime() || Date.now();
    sheet.appendRow([slug, name, message, uid, ts, timestamp]);

    return jsonResponse({ status: 'success' });
  }

  return jsonResponse({ status: 'error', message: 'Unknown action: ' + action });
}
