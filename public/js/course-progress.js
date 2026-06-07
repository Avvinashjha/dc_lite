/**
 * DCCourseProgress – client-side course completion + gating helpers.
 *
 * The Google Sheet (course_enrollments / course_module_progress /
 * course_quiz_scores, via DCSyncService) is the SINGLE SOURCE OF TRUTH for
 * course progress. This module keeps only an in-memory, per-page-session cache
 * (NOT IndexedDB): it is hydrated from the server on load / sign-in and pushes
 * every change straight back. Nothing course-related is persisted to
 * IndexedDB anymore — that previously caused a confusing dual source of truth
 * (local blob vs. server) that could drift and never reconcile.
 *
 * Trade-off: a signed-out user's progress lives only for the current page
 * session (it is not persisted anywhere), since there is no server identity to
 * store it against.
 *
 * In-memory row shape (keyed by courseSlug):
 *   {
 *     enrolledAt, lastModule, lastLesson, lastLessonAt, updatedAt, completedAt,
 *     completedLessons: ["moduleSlug/lessonSlug", ...],
 *     quizScores: { "moduleSlug/lessonSlug": <bestPercent> },
 *     quizMeta: { "moduleSlug/lessonSlug": { attempts, lastPercent, passingScore } },
 *     timeSpent: { "moduleSlug/lessonSlug": <seconds this session> },
 *     timeBaseline: { "moduleSlug": <seconds already stored on the server> }
 *   }
 *
 * Course structure is passed in by callers as:
 *   { slug, modules: [{ slug, title, lessons: [{ slug, type, quizSlug }] }] }
 * (injected per page as window.__dcCourseStructure).
 */
var DCCourseProgress = (function () {
  // In-memory, per-page-session cache: courseSlug -> row. Replaces IndexedDB.
  var cache = {};

  // Number of structured pushes currently in flight. While > 0, a hydrate must
  // NOT authoritatively replace the cache: the server may not yet reflect the
  // un-persisted local write, so replacing would clobber it.
  var pendingPushes = 0;

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

  // Push the structured (3-table) payload to the server, best-effort. Tracks
  // the in-flight push so a concurrent hydrate won't clobber this write.
  function syncStructured(courseSlug, row) {
    if (typeof DCSyncService === 'undefined' || !DCSyncService.isActive()) return;
    if (typeof DCSyncService.pushCourseProgress !== 'function') return;
    var struct = structure();
    if (!struct || struct.slug !== courseSlug) return;
    pendingPushes++;
    function settle() { pendingPushes = Math.max(0, pendingPushes - 1); }
    Promise.resolve(DCSyncService.pushCourseProgress(buildStructuredPayload(struct, row)))
      .then(settle, settle);
  }

  // True while a local write is still being synced to the server.
  function hasPendingPush() {
    return pendingPushes > 0;
  }

  function getRow(courseSlug) {
    return Promise.resolve(cache[courseSlug] ? normalize(cache[courseSlug]) : null);
  }

  function freshRow() {
    return {
      enrolledAt: Date.now(),
      lastModule: '',
      lastLesson: '',
      lastLessonAt: null,
      completedAt: null,
      completedLessons: [],
      quizScores: {},
      quizMeta: {},
      timeSpent: {},
      timeBaseline: {},
      updatedAt: Date.now()
    };
  }

  // Get the row, creating an enrollment record if none exists (auto-enroll on
  // first completion so progress is always tracked + synced).
  function ensureRow(courseSlug) {
    return getRow(courseSlug).then(function (row) {
      if (row) return row;
      cache[courseSlug] = freshRow();
      return normalize(cache[courseSlug]);
    });
  }

  function save(courseSlug, row) {
    row.updatedAt = Date.now();
    // Mark course completion timestamp the first time every module is done.
    var struct = structure();
    if (struct && struct.slug === courseSlug && !row.completedAt && courseComplete(struct, row)) {
      row.completedAt = Date.now();
    }
    cache[courseSlug] = row;
    // Structured, per-module/quiz sync (course_enrollments / course_module_progress / course_quiz_scores).
    syncStructured(courseSlug, row);
    return Promise.resolve(row);
  }

  // Explicit enrollment: create the row (if needed), stamp enrolledAt, and push.
  function enroll(courseSlug) {
    return ensureRow(courseSlug).then(function (row) {
      if (!row.enrolledAt) row.enrolledAt = Date.now();
      return save(courseSlug, row);
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

  // Rebuild the in-memory row authoritatively from server-side structured
  // progress (called on load / sign-in). The server is the source of truth, so
  // this REPLACES the cached row rather than union-merging — no drift, no
  // confusion. Per-module server time becomes the `timeBaseline`; this-session
  // `timeSpent` starts empty and is added on top before the next push.
  function applyServerProgress(courseSlug, server) {
    if (!server) return Promise.resolve(null);

    // A local write is mid-flight; the server response may predate it. Skip the
    // authoritative replace so we don't clobber the un-persisted change.
    if (pendingPushes > 0) return getRow(courseSlug);

    var row = {
      enrolledAt: 0, lastModule: '', lastLesson: '', lastLessonAt: null,
      completedAt: null, completedLessons: [], quizScores: {}, quizMeta: {},
      timeSpent: {}, timeBaseline: {}, updatedAt: 0
    };

    var en = server.enrollment;
    if (en) {
      row.enrolledAt = en.enrolledAt || 0;
      row.completedAt = en.completedAt || null;
      row.lastModule = en.lastModule || '';
      row.lastLesson = en.lastLesson || '';
      row.lastLessonAt = en.lastLessonAt || null;
    }

    (server.modules || []).forEach(function (m) {
      (m.completedLessonSlugs || []).forEach(function (lessonSlug) {
        var k = key(m.moduleSlug, lessonSlug);
        if (row.completedLessons.indexOf(k) === -1) row.completedLessons.push(k);
      });
      // Historical module time already stored on the server.
      row.timeBaseline[m.moduleSlug] = Number(m.timeSpentSec) || 0;
    });

    (server.quizzes || []).forEach(function (q) {
      var k = key(q.moduleSlug, q.lessonSlug);
      var best = Number(q.bestPercent) || 0;
      row.quizScores[k] = best;
      row.quizMeta[k] = {
        attempts: Number(q.attempts) || 0,
        lastPercent: typeof q.lastPercent === 'number' ? q.lastPercent : best,
        passingScore: typeof q.passingScore === 'number' ? q.passingScore : 70,
        completedAt: q.completedAt || undefined
      };
    });

    row.updatedAt = Date.now();
    cache[courseSlug] = row;
    return Promise.resolve(normalize(row));
  }

  return {
    key: key,
    getRow: getRow,
    ensureRow: ensureRow,
    enroll: enroll,
    isLessonComplete: isLessonComplete,
    markLessonComplete: markLessonComplete,
    unmarkLessonComplete: unmarkLessonComplete,
    recordQuizScore: recordQuizScore,
    addTime: addTime,
    trackLastLesson: trackLastLesson,
    buildStructuredPayload: buildStructuredPayload,
    applyServerProgress: applyServerProgress,
    syncStructured: syncStructured,
    hasPendingPush: hasPendingPush,
    moduleComplete: moduleComplete,
    moduleUnlocked: moduleUnlocked,
    courseComplete: courseComplete,
    counts: counts
  };
})();
