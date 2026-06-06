/**
 * Progress module — problem tool sync (problem-progress, favorites, notes) and
 * the legacy course-enrollment resume index.
 *   GET  getProgress, getEnrollments (auth required)
 *   POST saveProgress, saveEnrollment (auth required)
 *   Tabs: user_progress, user_enrollments (legacy)
 */
var Progress = (function () {
  function get(ctx) {
    var uid = ctx.getUid();
    if (!uid) return Http.error('Authentication required');

    var data = DB.values('user_progress');
    if (!data.length) return Http.json({ status: 'success', items: [] });

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
    return Http.json({ status: 'success', items: items });
  }

  function save(ctx) {
    var params = ctx.params;
    var uid = ctx.getUid();
    var items = params.items || [];

    if (!uid) return Http.error('Authentication required');

    var sheet = DB.ensure('user_progress');

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

    return Http.json({ status: 'success', saved: items.length });
  }

  // Legacy slim resume index. Superseded by the Courses module, kept for
  // backward compatibility.
  function getEnrollments(ctx) {
    var uid = ctx.getUid();
    if (!uid) return Http.error('Authentication required');

    var data = DB.values('user_enrollments');
    if (!data.length) return Http.json({ status: 'success', enrollments: [] });

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
    return Http.json({ status: 'success', enrollments: enrollments });
  }

  function saveEnrollment(ctx) {
    var params = ctx.params;
    var uid = ctx.getUid();
    var courseSlug = params.courseSlug;

    if (!uid) return Http.error('Authentication required');
    if (!courseSlug) return Http.error('Missing courseSlug');

    var sheet = DB.ensure('user_enrollments');

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

    return Http.ok();
  }

  return {
    get: get,
    save: save,
    getEnrollments: getEnrollments,
    saveEnrollment: saveEnrollment
  };
})();
