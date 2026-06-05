/**
 * DCCourseProgress – client-side course completion + gating helpers.
 *
 * Built on top of DCStore (public/js/store.js). Progress is stored on the
 * existing synced `course-enrollment` record (keyed by course slug), so it
 * round-trips to Google Sheets via DCSyncService for free.
 *
 * Record shape (tool: 'course-enrollment', id: courseSlug):
 *   {
 *     enrolledAt, lastModule, lastLesson, lastLessonAt, updatedAt, completedAt,
 *     completedLessons: ["moduleSlug/lessonSlug", ...],
 *     quizScores: { "moduleSlug/lessonSlug": <bestPercent> },
 *     quizMeta: { "moduleSlug/lessonSlug": { attempts, lastPercent, passingScore } },
 *     timeSpent: { "moduleSlug/lessonSlug": <seconds> }
 *   }
 *
 * Course structure is passed in by callers as:
 *   { slug, modules: [{ slug, title, lessons: [{ slug, type, quizSlug }] }] }
 * (injected per page as window.__dcCourseStructure).
 */
var DCCourseProgress = (function () {
  var TOOL = 'course-enrollment';

  function key(moduleSlug, lessonSlug) {
    return moduleSlug + '/' + lessonSlug;
  }

  function normalize(row) {
    if (!row) return null;
    if (!Array.isArray(row.completedLessons)) row.completedLessons = [];
    if (!row.quizScores || typeof row.quizScores !== 'object') row.quizScores = {};
    if (!row.quizMeta || typeof row.quizMeta !== 'object') row.quizMeta = {};
    if (!row.timeSpent || typeof row.timeSpent !== 'object') row.timeSpent = {};
    // Per-module time restored from the server (so re-aggregation locally never
    // clobbers historical time accumulated on other devices).
    if (!row.timeBaseline || typeof row.timeBaseline !== 'object') row.timeBaseline = {};
    return row;
  }

  function structure() {
    return (typeof window !== 'undefined' && window.__dcCourseStructure) || null;
  }

  // Push the structured (3-table) payload to the server, best-effort.
  function syncStructured(courseSlug, row) {
    if (typeof DCSyncService === 'undefined' || !DCSyncService.isActive()) return;
    if (typeof DCSyncService.pushCourseProgress !== 'function') return;
    var struct = structure();
    if (!struct || struct.slug !== courseSlug) return;
    DCSyncService.pushCourseProgress(buildStructuredPayload(struct, row));
  }

  function getRow(courseSlug) {
    return DCStore.init().then(function () {
      return DCStore.get(TOOL, courseSlug).then(normalize);
    });
  }

  // Get the row, creating an enrollment record if none exists (auto-enroll on
  // first completion so progress is always persisted).
  function ensureRow(courseSlug) {
    return getRow(courseSlug).then(function (row) {
      if (row) return row;
      var fresh = {
        enrolledAt: Date.now(),
        lastModule: '',
        lastLesson: '',
        lastLessonAt: null,
        completedAt: null,
        completedLessons: [],
        quizScores: {},
        quizMeta: {},
        timeSpent: {},
        updatedAt: Date.now()
      };
      return DCStore.set(TOOL, courseSlug, fresh).then(function () {
        return getRow(courseSlug);
      });
    });
  }

  function save(courseSlug, row) {
    row.updatedAt = Date.now();
    // Mark course completion timestamp the first time every module is done.
    var struct = structure();
    if (struct && struct.slug === courseSlug && !row.completedAt && courseComplete(struct, row)) {
      row.completedAt = Date.now();
    }
    return DCStore.set(TOOL, courseSlug, row).then(function () {
      // Structured, per-module/quiz sync (course_enrollments / course_module_progress / course_quiz_scores).
      syncStructured(courseSlug, row);
      return row;
    });
  }

  function isLessonComplete(row, moduleSlug, lessonSlug) {
    return !!row && row.completedLessons.indexOf(key(moduleSlug, lessonSlug)) !== -1;
  }

  function markLessonComplete(courseSlug, moduleSlug, lessonSlug) {
    return ensureRow(courseSlug).then(function (row) {
      var k = key(moduleSlug, lessonSlug);
      if (row.completedLessons.indexOf(k) === -1) row.completedLessons.push(k);
      return save(courseSlug, row);
    });
  }

  function unmarkLessonComplete(courseSlug, moduleSlug, lessonSlug) {
    return ensureRow(courseSlug).then(function (row) {
      var k = key(moduleSlug, lessonSlug);
      var idx = row.completedLessons.indexOf(k);
      if (idx !== -1) row.completedLessons.splice(idx, 1);
      return save(courseSlug, row);
    });
  }

  // Record a quiz lesson result; marks the lesson complete when the best
  // score reaches the passing threshold (default 70%).
  function recordQuizScore(courseSlug, moduleSlug, lessonSlug, percent, passingScore) {
    var passing = typeof passingScore === 'number' ? passingScore : 70;
    return ensureRow(courseSlug).then(function (row) {
      var k = key(moduleSlug, lessonSlug);
      var prev = row.quizScores[k] || 0;
      if (percent > prev) row.quizScores[k] = percent;

      var meta = row.quizMeta[k] || { attempts: 0, lastPercent: 0, passingScore: passing };
      meta.attempts = (meta.attempts || 0) + 1;
      meta.lastPercent = percent;
      meta.passingScore = passing;
      if (!meta.completedAt && percent >= passing) meta.completedAt = Date.now();
      row.quizMeta[k] = meta;

      if (percent >= passing && row.completedLessons.indexOf(k) === -1) {
        row.completedLessons.push(k);
      }
      return save(courseSlug, row);
    });
  }

  // Accumulate active seconds spent on a lesson (drives module-level analytics).
  function addTime(courseSlug, moduleSlug, lessonSlug, seconds) {
    var secs = Math.max(0, Math.round(seconds || 0));
    if (!secs) return Promise.resolve(null);
    return ensureRow(courseSlug).then(function (row) {
      var k = key(moduleSlug, lessonSlug);
      row.timeSpent[k] = (row.timeSpent[k] || 0) + secs;
      return save(courseSlug, row);
    });
  }

  // Record the user's current position (resume pointer).
  function trackLastLesson(courseSlug, moduleSlug, lessonSlug) {
    return ensureRow(courseSlug).then(function (row) {
      row.lastModule = moduleSlug;
      row.lastLesson = key(moduleSlug, lessonSlug);
      row.lastLessonAt = Date.now();
      return save(courseSlug, row);
    });
  }

  // Build the structured payload consumed by Apps Script `saveCourseProgress`:
  // a slim enrollment header + one entry per module + one entry per course quiz.
  function buildStructuredPayload(struct, row) {
    row = normalize(row) || {};
    var now = row.updatedAt || Date.now();
    var allComplete = courseComplete(struct, row);

    var modules = (struct && struct.modules ? struct.modules : []).map(function (mod) {
      var total = mod.lessons.length;
      var completedSlugs = [];
      var timeSpentSec = 0;
      mod.lessons.forEach(function (les) {
        var k = key(mod.slug, les.slug);
        if (row.completedLessons.indexOf(k) !== -1) completedSlugs.push(les.slug);
        timeSpentSec += row.timeSpent[k] || 0;
      });
      timeSpentSec += row.timeBaseline[mod.slug] || 0;
      var done = completedSlugs.length;
      var status = done === 0 ? 'not_started' : (done >= total && total > 0 ? 'completed' : 'in_progress');
      return {
        moduleSlug: mod.slug,
        moduleTitle: mod.title || '',
        status: status,
        completedLessons: done,
        totalLessons: total,
        percent: total ? Math.round((done / total) * 100) : 0,
        completedLessonSlugs: completedSlugs,
        timeSpentSec: timeSpentSec,
        startedAt: (done > 0 || timeSpentSec > 0) ? (row.enrolledAt || now) : '',
        completedAt: (status === 'completed') ? now : '',
        updatedAt: now
      };
    });

    var quizzes = [];
    (struct && struct.modules ? struct.modules : []).forEach(function (mod) {
      mod.lessons.forEach(function (les) {
        if (les.type !== 'quiz') return;
        var k = key(mod.slug, les.slug);
        var meta = row.quizMeta[k];
        var best = row.quizScores[k];
        if (!meta && typeof best !== 'number') return; // never attempted
        meta = meta || {};
        var passing = typeof meta.passingScore === 'number' ? meta.passingScore : 70;
        var bestPercent = typeof best === 'number' ? best : 0;
        quizzes.push({
          moduleSlug: mod.slug,
          lessonSlug: les.slug,
          quizSlug: les.quizSlug || '',
          bestPercent: bestPercent,
          lastPercent: typeof meta.lastPercent === 'number' ? meta.lastPercent : bestPercent,
          attempts: meta.attempts || 0,
          passed: bestPercent >= passing,
          passingScore: passing,
          completedAt: meta.completedAt || '',
          updatedAt: now
        });
      });
    });

    return {
      courseSlug: struct ? struct.slug : '',
      status: allComplete ? 'completed' : 'enrolled',
      enrolledAt: row.enrolledAt || now,
      completedAt: row.completedAt || (allComplete ? now : ''),
      lastModule: row.lastModule || '',
      lastLesson: row.lastLesson || '',
      lastLessonAt: row.lastLessonAt || '',
      updatedAt: now,
      modules: modules,
      quizzes: quizzes
    };
  }

  function moduleComplete(structure, row, moduleIndex) {
    var mod = structure && structure.modules[moduleIndex];
    if (!mod || !mod.lessons.length) return false;
    return mod.lessons.every(function (les) {
      return isLessonComplete(row, mod.slug, les.slug);
    });
  }

  // Module 0 is always unlocked; later modules unlock when the previous one
  // is fully complete.
  function moduleUnlocked(structure, row, moduleIndex) {
    if (moduleIndex <= 0) return true;
    return moduleComplete(structure, row, moduleIndex - 1);
  }

  function courseComplete(structure, row) {
    if (!structure || !structure.modules.length) return false;
    return structure.modules.every(function (_mod, i) {
      return moduleComplete(structure, row, i);
    });
  }

  function counts(structure, row) {
    var total = 0;
    var done = 0;
    if (structure) {
      structure.modules.forEach(function (mod) {
        mod.lessons.forEach(function (les) {
          total++;
          if (isLessonComplete(row, mod.slug, les.slug)) done++;
        });
      });
    }
    return { total: total, completed: done, percent: total ? Math.round((done / total) * 100) : 0 };
  }

  // Merge server-side structured progress into the local blob (restore on
  // sign-in / cross-device). Union of completion, best quiz scores, and the
  // larger of local vs server module time; never destructive.
  function applyServerProgress(courseSlug, server) {
    if (!server) return Promise.resolve(null);
    return getRow(courseSlug).then(function (existing) {
      var row = normalize(existing) || {
        enrolledAt: 0, lastModule: '', lastLesson: '', lastLessonAt: null,
        completedAt: null, completedLessons: [], quizScores: {}, quizMeta: {},
        timeSpent: {}, timeBaseline: {}, updatedAt: 0
      };

      var en = server.enrollment;
      if (en) {
        if (en.enrolledAt && (!row.enrolledAt || en.enrolledAt < row.enrolledAt)) {
          row.enrolledAt = en.enrolledAt;
        }
        if (!row.enrolledAt) row.enrolledAt = en.enrolledAt || Date.now();
        if (en.completedAt && !row.completedAt) row.completedAt = en.completedAt;
        if (en.lastLessonAt && (!row.lastLessonAt || en.lastLessonAt > row.lastLessonAt)) {
          row.lastModule = en.lastModule || row.lastModule;
          row.lastLesson = en.lastLesson || row.lastLesson;
          row.lastLessonAt = en.lastLessonAt;
        }
      }

      (server.modules || []).forEach(function (m) {
        (m.completedLessonSlugs || []).forEach(function (lessonSlug) {
          var k = key(m.moduleSlug, lessonSlug);
          if (row.completedLessons.indexOf(k) === -1) row.completedLessons.push(k);
        });
        // Preserve historical module time as a baseline.
        var serverTime = Number(m.timeSpentSec) || 0;
        if (serverTime > (row.timeBaseline[m.moduleSlug] || 0)) {
          row.timeBaseline[m.moduleSlug] = serverTime;
        }
      });

      (server.quizzes || []).forEach(function (q) {
        var k = key(q.moduleSlug, q.lessonSlug);
        var best = Number(q.bestPercent) || 0;
        if (best > (row.quizScores[k] || 0)) row.quizScores[k] = best;
        var meta = row.quizMeta[k] || { attempts: 0, lastPercent: 0, passingScore: 70 };
        meta.attempts = Math.max(meta.attempts || 0, Number(q.attempts) || 0);
        if (typeof q.lastPercent === 'number') meta.lastPercent = q.lastPercent;
        if (typeof q.passingScore === 'number') meta.passingScore = q.passingScore;
        if (q.completedAt && !meta.completedAt) meta.completedAt = q.completedAt;
        row.quizMeta[k] = meta;
      });

      row.updatedAt = Date.now();
      return DCStore.set(TOOL, courseSlug, row).then(function () { return row; });
    });
  }

  return {
    key: key,
    getRow: getRow,
    ensureRow: ensureRow,
    isLessonComplete: isLessonComplete,
    markLessonComplete: markLessonComplete,
    unmarkLessonComplete: unmarkLessonComplete,
    recordQuizScore: recordQuizScore,
    addTime: addTime,
    trackLastLesson: trackLastLesson,
    buildStructuredPayload: buildStructuredPayload,
    applyServerProgress: applyServerProgress,
    syncStructured: syncStructured,
    moduleComplete: moduleComplete,
    moduleUnlocked: moduleUnlocked,
    courseComplete: courseComplete,
    counts: counts
  };
})();
