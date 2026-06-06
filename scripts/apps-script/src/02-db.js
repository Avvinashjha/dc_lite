/**
 * DB — Spreadsheet access layer.
 *
 * Centralizes every tab name + header row in one registry (SHEETS) so modules
 * and `setupSheets()` share a single source of truth. Provides:
 *   - get(name)        : existing sheet or null (read path)
 *   - ensure(name)     : sheet, created with headers if missing (write path)
 *   - values(name)     : full getValues() incl. header row, or [] if missing
 *   - upsert(...)      : last-write-wins row upsert keyed by a derived key
 */
var DB = (function () {
  var SHEETS = {
    subscribers: ['id', 'email', 'source', 'timestamp'],
    comments: ['id', 'postSlug', 'postTitle', 'name', 'email', 'comment', 'timestamp', 'uid'],
    user_progress: ['uid', 'type', 'slug', 'data', 'updatedAt', 'createdAt'],
    user_enrollments: ['uid', 'courseSlug', 'enrolledAt', 'lastLesson', 'lastLessonAt', 'updatedAt', 'createdAt'],
    problem_discussions: ['slug', 'name', 'message', 'uid', 'ts', 'timestamp'],
    community_quizzes: ['slug', 'title', 'category', 'difficulty', 'author', 'uid', 'quizJson', 'createdAt'],
    quiz_scores: ['quizSlug', 'uid', 'displayName', 'score', 'maxScore', 'timeSec', 'completedAt', 'createdAt'],
    course_certifications: ['uid', 'courseSlug', 'displayName', 'round1', 'round2', 'round3', 'certified', 'certifiedAt', 'certId', 'notes'],
    course_enrollments: [
      'uid', 'courseSlug', 'status', 'enrolledAt', 'completedAt',
      'lastModule', 'lastLesson', 'lastLessonAt', 'updatedAt', 'createdAt'
    ],
    course_module_progress: [
      'uid', 'courseSlug', 'moduleSlug', 'moduleTitle', 'status',
      'completedLessons', 'totalLessons', 'percent', 'completedLessonSlugs',
      'timeSpentSec', 'startedAt', 'completedAt', 'updatedAt', 'createdAt'
    ],
    course_quiz_scores: [
      'uid', 'courseSlug', 'moduleSlug', 'lessonSlug', 'quizSlug',
      'bestPercent', 'lastPercent', 'attempts', 'passed', 'passingScore',
      'completedAt', 'updatedAt', 'createdAt'
    ]
  };

  function headers(name) {
    return SHEETS[name] || null;
  }

  // Existing sheet or null (no creation) — for read endpoints.
  function get(name) {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  }

  // Sheet, created with its registered headers if missing — for write endpoints.
  function ensure(name) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      var hdr = headers(name);
      if (hdr && hdr.length) sheet.appendRow(hdr);
    }
    return sheet;
  }

  // Full getValues() (including the header row) or [] when the sheet is missing.
  function values(name) {
    var sheet = get(name);
    if (!sheet) return [];
    return sheet.getDataRange().getValues();
  }

  /**
   * Upsert a row keyed by `key`. `keyFn(rowValues)` derives the key from an
   * existing row. On match, the row is overwritten only when the incoming
   * `updatedAt` (column index `updatedAtIdx`, 0-based) is newer-or-equal than the
   * stored one (last-write-wins); otherwise the stale write is ignored.
   */
  function upsert(sheet, key, keyFn, rowValues, updatedAtIdx) {
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

  function allNames() {
    return Object.keys(SHEETS);
  }

  return {
    SHEETS: SHEETS,
    headers: headers,
    get: get,
    ensure: ensure,
    values: values,
    upsert: upsert,
    allNames: allNames
  };
})();
