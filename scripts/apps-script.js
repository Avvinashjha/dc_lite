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
 *   - user_enrollments     (legacy course resume index; superseded by course_enrollments)
 *   - problem_discussions   (shared problem discussions)
 *   - course_enrollments   (slim: uid, courseSlug, status, enrolledAt, completedAt, lastModule, lastLesson, lastLessonAt, updatedAt, createdAt)
 *   - course_module_progress (per-module: uid, courseSlug, moduleSlug, moduleTitle, status, completedLessons, totalLessons, percent, completedLessonSlugs, timeSpentSec, startedAt, completedAt, updatedAt, createdAt)
 *   - course_quiz_scores   (course quizzes: uid, courseSlug, moduleSlug, lessonSlug, quizSlug, bestPercent, lastPercent, attempts, passed, passingScore, completedAt, updatedAt, createdAt)
 *   - community_quizzes    (slug, title, category, difficulty, author, uid, quizJson, createdAt)
 *   - quiz_scores          (quizSlug, uid, displayName, score, maxScore, timeSec, completedAt, createdAt)
 *   - course_certifications (uid, courseSlug, displayName, round1, round2, round3, certified, certifiedAt, certId, notes)
 *                          ── admin-managed: you fill rows manually after interviewing a student
 */

// ─── Config ──────────────────────────────────────────────────────────────────
//
// Firebase Web config (NOT secret — these ship in the client bundle anyway).
// Copy these from Firebase Console → Project Settings → General → Your apps,
// or from your site's PUBLIC_FIREBASE_* env vars. They MUST match the Firebase
// project your site authenticates against, otherwise token verification fails
// and every signed-in feature (progress sync, enrollments, quizzes) breaks.
var FIREBASE_API_KEY = 'AIzaSyCo59zkY1n3GgshBoxUcZCieVwhNVwyhQw';   // PUBLIC_FIREBASE_API_KEY (dailycoder-007)
var FIREBASE_PROJECT_ID = 'dailycoder-007';                         // PUBLIC_FIREBASE_PROJECT_ID

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
 * Upsert a row into `sheet` keyed by `key`. `keyFn(rowValues)` derives the key
 * from an existing row. On match, the row is overwritten only when the incoming
 * `updatedAt` (at column index `updatedAtIdx`, 0-based) is newer-or-equal than
 * the stored one (last-write-wins); otherwise the stale write is ignored.
 */
function upsertRow(sheet, key, keyFn, rowValues, updatedAtIdx) {
  var existing = sheet.getDataRange().getValues();
  for (var i = 1; i < existing.length; i++) {
    if (keyFn(existing[i]) !== key) continue;
    if (typeof updatedAtIdx === 'number') {
      var prevUpdated = existing[i][updatedAtIdx] || 0;
      var nextUpdated = rowValues[updatedAtIdx] || 0;
      if (nextUpdated < prevUpdated) return; // stale write
    }
    sheet.getRange(i + 1, 1, 1, rowValues.length).setValues([rowValues]);
    return;
  }
  sheet.appendRow(rowValues);
}

/**
 * Verify a Firebase ID token via the Identity Toolkit `accounts:lookup` API.
 *
 * NOTE: Google's `oauth2.googleapis.com/tokeninfo` endpoint does NOT work for
 * Firebase ID tokens — those are issued by `securetoken.google.com`, not
 * Google's OAuth IdP, so tokeninfo rejects them. `accounts:lookup` validates
 * the token against the Firebase project (signature + expiry) and returns the
 * user record, whose `localId` is the Firebase uid.
 *
 * Returns { uid, email, name } on success or null if the token is invalid.
 */
function verifyFirebaseToken(idToken) {
  if (!idToken) return null;
  if (!FIREBASE_API_KEY || FIREBASE_API_KEY === 'YOUR_FIREBASE_WEB_API_KEY') {
    // Misconfigured: fail closed so we never trust an unverified token.
    return null;
  }
  try {
    var url = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' +
      encodeURIComponent(FIREBASE_API_KEY);
    var res = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ idToken: idToken }),
      muteHttpExceptions: true
    });
    if (res.getResponseCode() !== 200) return null;
    var body = JSON.parse(res.getContentText());
    var users = body.users || [];
    if (!users.length || !users[0].localId) return null;
    var u = users[0];
    return { uid: u.localId, email: u.email || '', name: u.displayName || '' };
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

// Interpret a spreadsheet cell as a boolean (handles TRUE/true/1/yes/pass).
function isTruthyCell(v) {
  if (v === true) return true;
  var s = String(v).trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes' || s === 'y' || s === 'pass' || s === 'passed';
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

// ─── Course tracking schema ──────────────────────────────────────────────────
// Three purpose-built tabs replace the old course usage of user_progress /
// user_enrollments. Column order here is the source of truth for the upserts in
// `saveCourseProgress` / reads in `getCourseProgress`.
var COURSE_ENROLLMENTS_HEADERS = [
  'uid', 'courseSlug', 'status', 'enrolledAt', 'completedAt',
  'lastModule', 'lastLesson', 'lastLessonAt', 'updatedAt', 'createdAt'
];
var COURSE_MODULE_PROGRESS_HEADERS = [
  'uid', 'courseSlug', 'moduleSlug', 'moduleTitle', 'status',
  'completedLessons', 'totalLessons', 'percent', 'completedLessonSlugs',
  'timeSpentSec', 'startedAt', 'completedAt', 'updatedAt', 'createdAt'
];
var COURSE_QUIZ_SCORES_HEADERS = [
  'uid', 'courseSlug', 'moduleSlug', 'lessonSlug', 'quizSlug',
  'bestPercent', 'lastPercent', 'attempts', 'passed', 'passingScore',
  'completedAt', 'updatedAt', 'createdAt'
];

/**
 * One-time setup: creates every tab this backend uses (with headers) if it
 * doesn't already exist. Run this once from the Apps Script editor
 * (select `setupSheets` in the function dropdown, then click Run).
 *
 * Safe to re-run: existing tabs are left untouched.
 */
function setupSheets() {
  getOrCreateSheet('subscribers', ['id', 'email', 'source', 'timestamp']);
  getOrCreateSheet('comments', ['id', 'postSlug', 'postTitle', 'name', 'email', 'comment', 'timestamp', 'uid']);
  getOrCreateSheet('user_progress', ['uid', 'type', 'slug', 'data', 'updatedAt', 'createdAt']);
  getOrCreateSheet('user_enrollments', ['uid', 'courseSlug', 'enrolledAt', 'lastLesson', 'lastLessonAt', 'updatedAt', 'createdAt']);
  getOrCreateSheet('problem_discussions', ['slug', 'name', 'message', 'uid', 'ts', 'timestamp']);
  getOrCreateSheet('community_quizzes', ['slug', 'title', 'category', 'difficulty', 'author', 'uid', 'quizJson', 'createdAt']);
  getOrCreateSheet('quiz_scores', ['quizSlug', 'uid', 'displayName', 'score', 'maxScore', 'timeSec', 'completedAt', 'createdAt']);
  getOrCreateSheet('course_certifications', ['uid', 'courseSlug', 'displayName', 'round1', 'round2', 'round3', 'certified', 'certifiedAt', 'certId', 'notes']);
  getOrCreateSheet('course_enrollments', COURSE_ENROLLMENTS_HEADERS);
  getOrCreateSheet('course_module_progress', COURSE_MODULE_PROGRESS_HEADERS);
  getOrCreateSheet('course_quiz_scores', COURSE_QUIZ_SCORES_HEADERS);
  return 'Sheets ready';
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

  // ── Get structured course progress (auth required; own data only) ──
  if (action === 'getCourseProgress') {
    var cpUid = getAuthUid(e, {});
    if (!cpUid) return jsonResponse({ status: 'error', message: 'Authentication required' });

    var cpCourseSlug = e.parameter.courseSlug || '';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Enrollment (single row per course).
    var enrollment = null;
    var enSheet = ss.getSheetByName('course_enrollments');
    if (enSheet) {
      var enData = enSheet.getDataRange().getValues();
      for (var ei = 1; ei < enData.length; ei++) {
        if (enData[ei][0] !== cpUid) continue;
        if (cpCourseSlug && enData[ei][1] !== cpCourseSlug) continue;
        enrollment = {
          courseSlug: enData[ei][1],
          status: enData[ei][2],
          enrolledAt: enData[ei][3],
          completedAt: enData[ei][4],
          lastModule: enData[ei][5],
          lastLesson: enData[ei][6],
          lastLessonAt: enData[ei][7],
          updatedAt: enData[ei][8]
        };
        if (cpCourseSlug) break;
      }
    }

    // Module progress rows.
    var modules = [];
    var mpSheet = ss.getSheetByName('course_module_progress');
    if (mpSheet) {
      var mpData = mpSheet.getDataRange().getValues();
      for (var mi = 1; mi < mpData.length; mi++) {
        if (mpData[mi][0] !== cpUid) continue;
        if (cpCourseSlug && mpData[mi][1] !== cpCourseSlug) continue;
        var lessonSlugs = [];
        try { lessonSlugs = JSON.parse(mpData[mi][8] || '[]'); } catch (exA) { lessonSlugs = []; }
        modules.push({
          courseSlug: mpData[mi][1],
          moduleSlug: mpData[mi][2],
          moduleTitle: mpData[mi][3],
          status: mpData[mi][4],
          completedLessons: Number(mpData[mi][5]) || 0,
          totalLessons: Number(mpData[mi][6]) || 0,
          percent: Number(mpData[mi][7]) || 0,
          completedLessonSlugs: lessonSlugs,
          timeSpentSec: Number(mpData[mi][9]) || 0,
          startedAt: mpData[mi][10],
          completedAt: mpData[mi][11],
          updatedAt: mpData[mi][12]
        });
      }
    }

    // Course quiz scores.
    var quizzes = [];
    var qsSheet = ss.getSheetByName('course_quiz_scores');
    if (qsSheet) {
      var qsData = qsSheet.getDataRange().getValues();
      for (var qi = 1; qi < qsData.length; qi++) {
        if (qsData[qi][0] !== cpUid) continue;
        if (cpCourseSlug && qsData[qi][1] !== cpCourseSlug) continue;
        quizzes.push({
          courseSlug: qsData[qi][1],
          moduleSlug: qsData[qi][2],
          lessonSlug: qsData[qi][3],
          quizSlug: qsData[qi][4],
          bestPercent: Number(qsData[qi][5]) || 0,
          lastPercent: Number(qsData[qi][6]) || 0,
          attempts: Number(qsData[qi][7]) || 0,
          passed: isTruthyCell(qsData[qi][8]),
          passingScore: Number(qsData[qi][9]) || 0,
          completedAt: qsData[qi][10],
          updatedAt: qsData[qi][11]
        });
      }
    }

    return jsonResponse({
      status: 'success',
      enrollment: enrollment,
      modules: modules,
      quizzes: quizzes
    });
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

  // ── Get course certification status (auth required; user reads only their own) ──
  if (action === 'getCertification') {
    var certUid = getAuthUid(e, {});
    if (!certUid) return jsonResponse({ status: 'error', message: 'Authentication required' });

    var certCourseSlug = e.parameter.courseSlug || '';
    if (!certCourseSlug) return jsonResponse({ status: 'error', message: 'Missing courseSlug' });

    var certSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('course_certifications');
    if (!certSheet) return jsonResponse({ status: 'success', certification: null });

    var certData = certSheet.getDataRange().getValues();
    for (var ci = 1; ci < certData.length; ci++) {
      if (certData[ci][0] === certUid && certData[ci][1] === certCourseSlug) {
        return jsonResponse({
          status: 'success',
          certification: {
            courseSlug: certData[ci][1],
            displayName: certData[ci][2],
            round1: certData[ci][3],
            round2: certData[ci][4],
            round3: certData[ci][5],
            certified: certData[ci][6],
            certifiedAt: certData[ci][7],
            certId: certData[ci][8]
          }
        });
      }
    }
    return jsonResponse({ status: 'success', certification: null });
  }

  // ── Verify a certificate by its public ID (public, read-only) ──
  if (action === 'verifyCertificate') {
    var certIdParam = e.parameter.certId || '';
    if (!certIdParam) return jsonResponse({ status: 'error', message: 'Missing certId' });

    var vSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('course_certifications');
    var vResult = { status: 'success', valid: false };
    if (vSheet) {
      var vData = vSheet.getDataRange().getValues();
      for (var vi = 1; vi < vData.length; vi++) {
        if (String(vData[vi][8]) === String(certIdParam) && isTruthyCell(vData[vi][6])) {
          vResult = {
            status: 'success',
            valid: true,
            certificate: {
              displayName: vData[vi][2],
              courseSlug: vData[vi][1],
              certifiedAt: vData[vi][7],
              certId: vData[vi][8]
            }
          };
          break;
        }
      }
    }
    if (callback) return jsonpResponse(vResult, callback);
    return jsonResponse(vResult);
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

  // ── Save structured course progress (auth required) ──
  // Splits one client payload into three tables: course_enrollments (status),
  // course_module_progress (per-module analytics), course_quiz_scores (course
  // quizzes). All upserts are last-write-wins on `updatedAt`.
  if (action === 'saveCourseProgress') {
    var scpUid = getAuthUid(e, params);
    if (!scpUid) return jsonResponse({ status: 'error', message: 'Authentication required' });

    var scpCourseSlug = params.courseSlug || '';
    if (!scpCourseSlug) return jsonResponse({ status: 'error', message: 'Missing courseSlug' });

    var nowIso = new Date().toISOString();
    var payloadUpdatedAt = params.updatedAt || Date.now();

    // ── 1) course_enrollments (key uid|courseSlug) ──
    var enSheet = getOrCreateSheet('course_enrollments', COURSE_ENROLLMENTS_HEADERS);
    upsertRow(
      enSheet,
      [scpUid, scpCourseSlug].join('|'),
      function (r) { return [r[0], r[1]].join('|'); },
      [
        scpUid,
        scpCourseSlug,
        params.status || 'enrolled',
        params.enrolledAt || Date.now(),
        params.completedAt || '',
        params.lastModule || '',
        params.lastLesson || '',
        params.lastLessonAt || '',
        payloadUpdatedAt,
        nowIso
      ],
      8 // updatedAt column index (0-based) for last-write-wins
    );

    // ── 2) course_module_progress (key uid|courseSlug|moduleSlug) ──
    var modules = Array.isArray(params.modules) ? params.modules : [];
    if (modules.length) {
      var mpSheet = getOrCreateSheet('course_module_progress', COURSE_MODULE_PROGRESS_HEADERS);
      modules.forEach(function (m) {
        if (!m || !m.moduleSlug) return;
        upsertRow(
          mpSheet,
          [scpUid, scpCourseSlug, m.moduleSlug].join('|'),
          function (r) { return [r[0], r[1], r[2]].join('|'); },
          [
            scpUid,
            scpCourseSlug,
            m.moduleSlug,
            m.moduleTitle || '',
            m.status || 'not_started',
            Number(m.completedLessons) || 0,
            Number(m.totalLessons) || 0,
            Number(m.percent) || 0,
            JSON.stringify(m.completedLessonSlugs || []),
            Number(m.timeSpentSec) || 0,
            m.startedAt || '',
            m.completedAt || '',
            m.updatedAt || payloadUpdatedAt,
            nowIso
          ],
          12 // updatedAt column index (0-based)
        );
      });
    }

    // ── 3) course_quiz_scores (key uid|courseSlug|moduleSlug|lessonSlug) ──
    var quizzes = Array.isArray(params.quizzes) ? params.quizzes : [];
    if (quizzes.length) {
      var qsSheet = getOrCreateSheet('course_quiz_scores', COURSE_QUIZ_SCORES_HEADERS);
      quizzes.forEach(function (q) {
        if (!q || !q.lessonSlug) return;
        upsertRow(
          qsSheet,
          [scpUid, scpCourseSlug, q.moduleSlug, q.lessonSlug].join('|'),
          function (r) { return [r[0], r[1], r[2], r[3]].join('|'); },
          [
            scpUid,
            scpCourseSlug,
            q.moduleSlug || '',
            q.lessonSlug,
            q.quizSlug || '',
            Number(q.bestPercent) || 0,
            Number(q.lastPercent) || 0,
            Number(q.attempts) || 0,
            q.passed ? true : false,
            Number(q.passingScore) || 0,
            q.completedAt || '',
            q.updatedAt || payloadUpdatedAt,
            nowIso
          ],
          11 // updatedAt column index (0-based)
        );
      });
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
