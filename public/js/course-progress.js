/**
 * DCCourseProgress – client-side course completion + gating helpers.
 *
 * IndexedDB (DCStore, tool 'course-progress', id = courseSlug) is the LOCAL
 * source of truth that drives the UI: gating (module locking), progress bars
 * and completion badges are computed from the locally-persisted row so they
 * render instantly on every page load — no network round-trip, works offline,
 * and a user is never wrongly "locked out" while a slow request is pending.
 *
 * The Google Sheet (course_enrollments / course_module_progress /
 * course_quiz_scores, via DCSyncService) is a background mirror for
 * cross-device consistency. Every change is persisted to IndexedDB immediately
 * and pushed to the sheet in the background (debounced, best-effort). On load /
 * sign-in the server is pulled and reconciled with the local row using
 * row-level last-write-wins on `updatedAt` (newer wins; if local is newer it is
 * pushed up). This avoids both UI-blocking and the older "wrong lock" race.
 *
 * Trade-off: a signed-out user's progress is still kept only in memory for the
 * current page session (IndexedDB persistence + sync are keyed to a signed-in
 * identity).
 *
 * Row shape (keyed by courseSlug):
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
  // IndexedDB object-store namespace for course rows.
  var STORE_TOOL = 'course-progress';

  // In-memory mirror of the persisted rows: courseSlug -> row. Backed by
  // IndexedDB (DCStore); kept in memory so gating helpers can read synchronously
  // once a row has been loaded.
  var cache = {};

  // Background-sync bookkeeping. `pendingPushes` counts courses with a local
  // change that has not yet been confirmed pushed to the sheet (queued OR
  // in flight). While > 0 for a course, a server hydrate must NOT clobber the
  // local row — it may be newer than what the server has seen.
  var pendingPushes = 0;
  var SYNC_DEBOUNCE_MS = 1500;
  var syncTimers = {};   // courseSlug -> setTimeout handle
  var syncDirty = {};    // courseSlug -> bool (has an unsynced local change)

  function key(moduleSlug, lessonSlug) {
    return moduleSlug + '/' + lessonSlug;
  }

  // ── Local persistence (IndexedDB via DCStore) ──────────────────────────────
  function persistLocal(courseSlug, row) {
    if (typeof DCStore === 'undefined') return Promise.resolve();
    // 'course-progress' is intentionally NOT a DCSyncService SYNCED_TOOL, so
    // this write does not trigger the generic blob sync — we push the
    // structured payload ourselves via scheduleSync().
    return Promise.resolve(DCStore.set(STORE_TOOL, courseSlug, { row: row }))
      .catch(function () {});
  }

  // Read a row from IndexedDB into the in-memory cache (best-effort).
  function loadLocal(courseSlug) {
    if (typeof DCStore === 'undefined') return Promise.resolve(null);
    return Promise.resolve(DCStore.get(STORE_TOOL, courseSlug))
      .then(function (item) {
        if (!item || !item.row) return null;
        var row = normalize(item.row);
        cache[courseSlug] = row;
        return row;
      })
      .catch(function () { return null; });
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

  // ── Background sheet sync (debounced, best-effort) ─────────────────────────
  // Queue a structured (3-table) push for this course. Rapid changes (e.g.
  // time tracking, quick mark/undo) are coalesced into one request. The push is
  // fire-and-forget and never blocks the UI; IndexedDB already holds the change.
  function scheduleSync(courseSlug, row) {
    if (typeof DCSyncService === 'undefined' || !DCSyncService.isActive()) return;
    if (typeof DCSyncService.pushCourseProgress !== 'function') return;
    var struct = structure();
    if (!struct || struct.slug !== courseSlug) return;

    // Mark the course dirty (counts as a pending push until it lands) so a
    // concurrent hydrate won't clobber this not-yet-synced local change.
    if (!syncDirty[courseSlug]) { syncDirty[courseSlug] = true; pendingPushes++; }

    if (syncTimers[courseSlug]) clearTimeout(syncTimers[courseSlug]);
    syncTimers[courseSlug] = setTimeout(function () { flushSync(courseSlug); }, SYNC_DEBOUNCE_MS);
  }

  // Push any pending change for a course right now (or no-op if clean). Called
  // by the debounce timer and on demand (e.g. page unload drains).
  function flushSync(courseSlug) {
    if (syncTimers[courseSlug]) { clearTimeout(syncTimers[courseSlug]); syncTimers[courseSlug] = null; }
    if (!syncDirty[courseSlug]) return Promise.resolve();

    var struct = structure();
    var row = cache[courseSlug];
    function settle() {
      syncDirty[courseSlug] = false;
      pendingPushes = Math.max(0, pendingPushes - 1);
    }
    if (typeof DCSyncService === 'undefined' || !DCSyncService.isActive() ||
        typeof DCSyncService.pushCourseProgress !== 'function' ||
        !struct || struct.slug !== courseSlug || !row) {
      settle();
      return Promise.resolve();
    }
    return Promise.resolve(DCSyncService.pushCourseProgress(buildStructuredPayload(struct, row)))
      .then(settle, settle);
  }

  // Push every pending course immediately (best-effort drain, e.g. on unload).
  function flushAll() {
    Object.keys(syncDirty).forEach(function (courseSlug) {
      if (syncDirty[courseSlug]) flushSync(courseSlug);
    });
  }

  // Back-compat alias: callers that previously forced a structured push.
  function syncStructured(courseSlug, row) {
    scheduleSync(courseSlug, row);
  }

  // True while a local write is still being synced to the server.
  function hasPendingPush() {
    return pendingPushes > 0;
  }

  // Resolve a row for gating/render: prefer the in-memory mirror, otherwise load
  // it from IndexedDB so locking is computed from persisted local state.
  function getRow(courseSlug) {
    if (cache[courseSlug]) return Promise.resolve(normalize(cache[courseSlug]));
    return loadLocal(courseSlug);
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
    // Persist to IndexedDB immediately (drives gating/UI on the next load) and
    // queue a background push to the sheet. Neither blocks the returned row.
    persistLocal(courseSlug, row);
    scheduleSync(courseSlug, row);
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

  // Build a row from the server's structured payload. `updatedAt` is taken from
  // the enrollment header so it can be compared against the local row for
  // last-write-wins. Per-module server time becomes the `timeBaseline`.
  function rowFromServer(server) {
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
      row.updatedAt = Number(en.updatedAt) || 0;
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

    return row;
  }

  // Reconcile server-side structured progress with the locally-persisted row
  // (called on load / sign-in). Uses row-level last-write-wins on `updatedAt`:
  // the newer copy wins; if the local copy is strictly newer it is kept and a
  // background push is queued so the sheet catches up. The chosen row is mirrored
  // back to IndexedDB so the UI/gating stays consistent across reloads.
  function applyServerProgress(courseSlug, server) {
    if (!server) return getRow(courseSlug);

    // A local write is still pending sync; the server may not reflect it yet, so
    // keep local and let the background push reconcile.
    if (pendingPushes > 0) return getRow(courseSlug);

    var serverRow = rowFromServer(server);

    return getRow(courseSlug).then(function (local) {
      var localUpdated = local ? (local.updatedAt || 0) : 0;
      var serverUpdated = serverRow.updatedAt || 0;

      // Local is strictly newer than what the server knows: keep it, push it up.
      if (local && localUpdated > serverUpdated) {
        scheduleSync(courseSlug, local);
        return normalize(local);
      }

      // Otherwise the server wins (newer, equal, or no local row yet).
      cache[courseSlug] = serverRow;
      persistLocal(courseSlug, serverRow);
      return normalize(serverRow);
    });
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
    loadLocal: loadLocal,
    syncStructured: syncStructured,
    flushSync: flushSync,
    flushAll: flushAll,
    hasPendingPush: hasPendingPush,
    moduleComplete: moduleComplete,
    moduleUnlocked: moduleUnlocked,
    courseComplete: courseComplete,
    counts: counts
  };
})();
