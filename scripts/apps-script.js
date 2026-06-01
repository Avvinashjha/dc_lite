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
 *   - Quiz: community quizzes + ranked leaderboards
 *
 * Sheet tabs used:
 *   - subscribers          (newsletter)
 *   - comments             (blog/problem comments)
 *   - user_progress        (problem progress + favorites + notes)
 *   - user_enrollments     (course enrollment + lesson tracking)
 *   - problem_discussions   (shared problem discussions)
 *   - community_quizzes    (slug, title, category, difficulty, author, uid, quizJson, createdAt)
 *   - quiz_scores          (quizSlug, uid, displayName, score, maxScore, timeSec, completedAt, createdAt)
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

// Slugify matching the client (lowercase, non-alphanumerics → dashes).
function slugify(value) {
  return String(value || '')
    .toLowerCase().trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
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
    var uid = getAuthUid(e, {});
    if (!uid) return jsonResponse({ status: 'error', message: 'Authentication required' });

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
    var uid = getAuthUid(e, {});
    if (!uid) return jsonResponse({ status: 'error', message: 'Authentication required' });

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

  // ── QUIZ: list community quizzes ──
  if (action === 'listCommunityQuizzes') {
    var cqSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('community_quizzes');
    var quizzes = [];
    if (cqSheet) {
      var cqData = cqSheet.getDataRange().getValues();
      for (var i = 1; i < cqData.length; i++) {
        var quizJson = cqData[i][6];
        if (!quizJson) continue;
        try {
          quizzes.push(JSON.parse(quizJson));
        } catch (ex) { /* skip malformed row */ }
      }
    }
    var qResult = { status: 'success', quizzes: quizzes };
    if (callback) return jsonpResponse(qResult, callback);
    return jsonResponse(qResult);
  }

  // ── QUIZ: leaderboard (best score per user, fastest time as tiebreaker) ──
  if (action === 'getLeaderboard') {
    var quizSlug = e.parameter.quizSlug || '';
    var limit = parseInt(e.parameter.limit, 10) || 20;
    if (!quizSlug) return jsonResponse({ status: 'error', message: 'Missing quizSlug' });

    var lbSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('quiz_scores');
    var scores = [];
    if (lbSheet) {
      var lbData = lbSheet.getDataRange().getValues();
      var best = {};
      for (var j = 1; j < lbData.length; j++) {
        if (lbData[j][0] !== quizSlug) continue;
        var lbUid = lbData[j][1];
        var entry = {
          uid: lbUid,
          displayName: lbData[j][2],
          score: Number(lbData[j][3]) || 0,
          maxScore: Number(lbData[j][4]) || 0,
          timeSec: Number(lbData[j][5]) || 0,
          completedAt: lbData[j][6]
        };
        var prev = best[lbUid];
        if (!prev || entry.score > prev.score ||
            (entry.score === prev.score && entry.timeSec < prev.timeSec)) {
          best[lbUid] = entry;
        }
      }
      scores = Object.keys(best).map(function (k) { return best[k]; });
    }
    scores.sort(function (a, b) {
      return b.score - a.score || a.timeSec - b.timeSec;
    });
    var lbResult = { status: 'success', scores: scores.slice(0, limit) };
    if (callback) return jsonpResponse(lbResult, callback);
    return jsonResponse(lbResult);
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
    var uid = getAuthUid(e, params);
    var items = params.items || [];

    if (!uid) return jsonResponse({ status: 'error', message: 'Authentication required' });

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
    var uid = getAuthUid(e, params);
    var courseSlug = params.courseSlug;

    if (!uid) return jsonResponse({ status: 'error', message: 'Authentication required' });
    if (!courseSlug) return jsonResponse({ status: 'error', message: 'Missing courseSlug' });

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

  // ── Post to problem discussion (auth required) ──
  if (action === 'postDiscussion') {
    var uid = getAuthUid(e, params);
    if (!uid) return jsonResponse({ status: 'error', message: 'Authentication required' });

    var slug = params.slug || '';
    var name = params.name || 'Anonymous';
    var message = params.message || '';
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

  // ── QUIZ: create a community quiz (auth required) ──
  if (action === 'createQuiz') {
    var cqUid = getAuthUid(e, params);
    if (!cqUid) return jsonResponse({ status: 'error', message: 'Authentication required' });

    var quiz = params.quiz;
    if (!quiz || !quiz.title || !Array.isArray(quiz.questions) || !quiz.questions.length) {
      return jsonResponse({ status: 'error', message: 'Invalid quiz' });
    }

    var cqSheet = getOrCreateSheet('community_quizzes',
      ['slug', 'title', 'category', 'difficulty', 'author', 'uid', 'quizJson', 'createdAt']);

    // Ensure a unique slug.
    var baseSlug = slugify(quiz.slug || quiz.title) || ('quiz-' + Date.now());
    var cqExisting = cqSheet.getDataRange().getValues();
    var used = {};
    for (var i = 1; i < cqExisting.length; i++) used[cqExisting[i][0]] = true;
    var newSlug = baseSlug, n = 2;
    while (used[newSlug]) { newSlug = baseSlug + '-' + n; n++; }

    // Force trusted server-side fields.
    quiz.slug = newSlug;
    quiz.id = newSlug;
    quiz.source = 'community';
    quiz.ranked = false;

    cqSheet.appendRow([
      newSlug,
      quiz.title,
      quiz.category || 'General',
      quiz.difficulty || 'easy',
      quiz.author || 'Anonymous',
      cqUid,
      JSON.stringify(quiz),
      new Date().toISOString()
    ]);

    return jsonResponse({ status: 'success', slug: newSlug });
  }

  // ── QUIZ: submit a ranked score (auth required) ──
  if (action === 'submitScore') {
    var ssUid = getAuthUid(e, params);
    if (!ssUid) return jsonResponse({ status: 'error', message: 'Authentication required' });

    if (!params.quizSlug) return jsonResponse({ status: 'error', message: 'Missing quizSlug' });

    var ssSheet = getOrCreateSheet('quiz_scores',
      ['quizSlug', 'uid', 'displayName', 'score', 'maxScore', 'timeSec', 'completedAt', 'createdAt']);

    ssSheet.appendRow([
      params.quizSlug,
      ssUid,
      params.displayName || 'Anonymous',
      Number(params.score) || 0,
      Number(params.maxScore) || 0,
      Number(params.timeSec) || 0,
      params.completedAt || new Date().toISOString(),
      new Date().toISOString()
    ]);

    return jsonResponse({ status: 'success' });
  }

  return jsonResponse({ status: 'error', message: 'Unknown action: ' + action });
}
