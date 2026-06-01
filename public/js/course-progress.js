/**
 * DCCourseProgress – client-side course completion + gating helpers.
 *
 * Built on top of DCStore (public/js/store.js). Progress is stored on the
 * existing synced `course-enrollment` record (keyed by course slug), so it
 * round-trips to Google Sheets via DCSyncService for free.
 *
 * Record shape (tool: 'course-enrollment', id: courseSlug):
 *   {
 *     enrolledAt, lastLesson, lastLessonAt, updatedAt,
 *     completedLessons: ["moduleSlug/lessonSlug", ...],
 *     quizScores: { "moduleSlug/lessonSlug": <bestPercent> }
 *   }
 *
 * Course structure is passed in by callers as:
 *   { slug, modules: [{ slug, title, lessons: [{ slug, type }] }] }
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
    return row;
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
        lastLesson: '',
        lastLessonAt: null,
        completedLessons: [],
        quizScores: {},
        updatedAt: Date.now()
      };
      return DCStore.set(TOOL, courseSlug, fresh).then(function () {
        return getRow(courseSlug);
      });
    });
  }

  function save(courseSlug, row) {
    row.updatedAt = Date.now();
    // DCStore.set auto-syncs synced tools (course-enrollment) to user_progress.
    return DCStore.set(TOOL, courseSlug, row).then(function () {
      if (typeof DCSyncService !== 'undefined' && DCSyncService.isActive()) {
        DCSyncService.pushEnrollment(courseSlug, row);
      }
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
      if (percent >= passing && row.completedLessons.indexOf(k) === -1) {
        row.completedLessons.push(k);
      }
      return save(courseSlug, row);
    });
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

  return {
    key: key,
    getRow: getRow,
    ensureRow: ensureRow,
    isLessonComplete: isLessonComplete,
    markLessonComplete: markLessonComplete,
    unmarkLessonComplete: unmarkLessonComplete,
    recordQuizScore: recordQuizScore,
    moduleComplete: moduleComplete,
    moduleUnlocked: moduleUnlocked,
    courseComplete: courseComplete,
    counts: counts
  };
})();
