/**
 * Courses module — structured course tracking.
 *   GET  getCourseProgress (auth; own data only)
 *   POST saveCourseProgress (auth) — splits one payload into 3 tabs
 *   Tabs: course_enrollments, course_module_progress, course_quiz_scores
 *
 * All upserts are last-write-wins on `updatedAt`.
 */
var Courses = (function () {
  function getProgress(ctx) {
    var uid = ctx.getUid();
    if (!uid) return Http.error('Authentication required');

    var courseSlug = ctx.e.parameter.courseSlug || '';

    // Enrollment (single row per course).
    var enrollment = null;
    var enData = DB.values('course_enrollments');
    for (var ei = 1; ei < enData.length; ei++) {
      if (enData[ei][0] !== uid) continue;
      if (courseSlug && enData[ei][1] !== courseSlug) continue;
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
      if (courseSlug) break;
    }

    // Module progress rows.
    var modules = [];
    var mpData = DB.values('course_module_progress');
    for (var mi = 1; mi < mpData.length; mi++) {
      if (mpData[mi][0] !== uid) continue;
      if (courseSlug && mpData[mi][1] !== courseSlug) continue;
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

    // Course quiz scores.
    var quizzes = [];
    var qsData = DB.values('course_quiz_scores');
    for (var qi = 1; qi < qsData.length; qi++) {
      if (qsData[qi][0] !== uid) continue;
      if (courseSlug && qsData[qi][1] !== courseSlug) continue;
      quizzes.push({
        courseSlug: qsData[qi][1],
        moduleSlug: qsData[qi][2],
        lessonSlug: qsData[qi][3],
        quizSlug: qsData[qi][4],
        bestPercent: Number(qsData[qi][5]) || 0,
        lastPercent: Number(qsData[qi][6]) || 0,
        attempts: Number(qsData[qi][7]) || 0,
        passed: Utils.isTruthyCell(qsData[qi][8]),
        passingScore: Number(qsData[qi][9]) || 0,
        completedAt: qsData[qi][10],
        updatedAt: qsData[qi][11]
      });
    }

    return Http.json({
      status: 'success',
      enrollment: enrollment,
      modules: modules,
      quizzes: quizzes
    });
  }

  function saveProgress(ctx) {
    var params = ctx.params;
    var uid = ctx.getUid();
    if (!uid) return Http.error('Authentication required');

    var courseSlug = params.courseSlug || '';
    if (!courseSlug) return Http.error('Missing courseSlug');

    var nowIso = new Date().toISOString();
    var payloadUpdatedAt = params.updatedAt || Date.now();

    // ── 1) course_enrollments (key uid|courseSlug) ──
    var enSheet = DB.ensure('course_enrollments');
    DB.upsert(
      enSheet,
      [uid, courseSlug].join('|'),
      function (r) { return [r[0], r[1]].join('|'); },
      [
        uid,
        courseSlug,
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
      var mpSheet = DB.ensure('course_module_progress');
      modules.forEach(function (m) {
        if (!m || !m.moduleSlug) return;
        DB.upsert(
          mpSheet,
          [uid, courseSlug, m.moduleSlug].join('|'),
          function (r) { return [r[0], r[1], r[2]].join('|'); },
          [
            uid,
            courseSlug,
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
      var qsSheet = DB.ensure('course_quiz_scores');
      quizzes.forEach(function (q) {
        if (!q || !q.lessonSlug) return;
        DB.upsert(
          qsSheet,
          [uid, courseSlug, q.moduleSlug, q.lessonSlug].join('|'),
          function (r) { return [r[0], r[1], r[2], r[3]].join('|'); },
          [
            uid,
            courseSlug,
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

    return Http.ok();
  }

  return { getProgress: getProgress, saveProgress: saveProgress };
})();
