/**
 * DCSyncService – silent background sync of user progress to Google Sheets.
 *
 * IndexedDB remains the primary store; Google Sheets is a mirror for
 * cross-browser consistency. Sync is best-effort and never blocks UI.
 *
 * Depends on: DCStore (public/js/store.js), auth-gate.js globals.
 */
var DCSyncService = (function () {
  var SYNCED_TOOLS = ['problem-progress', 'problem-favorites', 'problem-notes', 'course-enrollment'];
  var DEBOUNCE_MS = 3000;

  var scriptUrl = null;
  var userId = null;
  var syncQueue = [];
  var debounceTimer = null;
  var isSyncing = false;

  function getIdToken() {
    if (typeof window.getFirebaseIdToken === 'function') {
      return window.getFirebaseIdToken();
    }
    return Promise.resolve(null);
  }

  function init(uid, url) {
    userId = uid;
    scriptUrl = url;
    if (uid && url) {
      pullAndMerge();
    }
  }

  function stop() {
    userId = null;
    syncQueue = [];
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  function isActive() {
    return !!(userId && scriptUrl);
  }

  function isSyncedTool(tool) {
    return SYNCED_TOOLS.indexOf(tool) !== -1;
  }

  // ── Pull remote data and merge with local ──
  function pullAndMerge() {
    if (!userId || !scriptUrl) return Promise.resolve();
    if (isSyncing) return Promise.resolve();
    isSyncing = true;

    return getIdToken().then(function (token) {
      var url = scriptUrl + '?action=getProgress&uid=' + encodeURIComponent(userId);
      if (token) url += '&idToken=' + encodeURIComponent(token);
      return fetch(url);
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.status !== 'success' || !data.items) return;
        return mergeRemoteItems(data.items);
      })
      .catch(function (err) {
        console.warn('[DCSyncService] Pull failed:', err);
      })
      .finally(function () {
        isSyncing = false;
      });
  }

  function mergeRemoteItems(remoteItems) {
    if (!remoteItems || !remoteItems.length) return Promise.resolve();
    if (typeof DCStore === 'undefined') return Promise.resolve();

    var localNewer = [];

    return DCStore.init().then(function () {
      var chain = Promise.resolve();

      remoteItems.forEach(function (remote) {
        chain = chain.then(function () {
          return DCStore.get(remote.type, remote.slug).then(function (local) {
            var localUpdated = local ? (local.updatedAt || 0) : 0;
            var remoteUpdated = remote.updatedAt || 0;

            if (!local) {
              // Remote exists, local doesn't – write remote to local
              var record = Object.assign({}, remote.data, {
                updatedAt: remoteUpdated
              });
              return DCStore.set(remote.type, remote.slug, record);
            } else if (remoteUpdated > localUpdated) {
              // Remote is newer
              var merged = Object.assign({}, local, remote.data, {
                updatedAt: remoteUpdated
              });
              return DCStore.set(remote.type, remote.slug, merged);
            } else if (localUpdated > remoteUpdated) {
              // Local is newer – queue for push
              localNewer.push({
                type: remote.type,
                slug: remote.slug,
                data: local,
                updatedAt: localUpdated
              });
            }
          });
        });
      });

      return chain.then(function () {
        if (localNewer.length > 0) {
          return pushItems(localNewer);
        }
      });
    });
  }

  // ── Push queued items to remote ──
  function push(tool, id, data) {
    if (!isActive()) return;
    if (!isSyncedTool(tool)) return;

    syncQueue.push({
      type: tool,
      slug: id,
      data: data,
      updatedAt: data.updatedAt || Date.now()
    });

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(flush, DEBOUNCE_MS);
  }

  function flush() {
    if (!syncQueue.length || !isActive()) return;
    var batch = syncQueue.splice(0, syncQueue.length);
    pushItems(batch);
  }

  function pushItems(items) {
    if (!scriptUrl || !userId || !items.length) return Promise.resolve();

    return getIdToken().then(function (token) {
      var payload = JSON.stringify({
        action: 'saveProgress',
        uid: userId,
        idToken: token || '',
        items: items
      });

      return fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: payload
      });
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.status !== 'success') {
        console.warn('[DCSyncService] Push response:', data);
      }
    })
    .catch(function (err) {
      console.warn('[DCSyncService] Push failed:', err);
      syncQueue = items.concat(syncQueue);
    });
  }

  // ── Enrollment-specific sync ──
  function pushEnrollment(courseSlug, enrollmentData) {
    if (!isActive()) return Promise.resolve();

    return getIdToken().then(function (token) {
      var payload = JSON.stringify({
        action: 'saveEnrollment',
        uid: userId,
        idToken: token || '',
        courseSlug: courseSlug,
        enrolledAt: enrollmentData.enrolledAt,
        lastLesson: enrollmentData.lastLesson || '',
        lastLessonAt: enrollmentData.lastLessonAt || '',
        updatedAt: enrollmentData.updatedAt || Date.now()
      });

      return fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: payload
      });
    })
    .then(function (res) { return res.json(); })
    .catch(function (err) {
      console.warn('[DCSyncService] Enrollment push failed:', err);
    });
  }

  function pullEnrollments() {
    if (!userId || !scriptUrl) return Promise.resolve([]);

    return getIdToken().then(function (token) {
      var url = scriptUrl + '?action=getEnrollments&uid=' + encodeURIComponent(userId);
      if (token) url += '&idToken=' + encodeURIComponent(token);
      return fetch(url);
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.status !== 'success') return [];
        return data.enrollments || [];
      })
      .catch(function (err) {
        console.warn('[DCSyncService] Enrollment pull failed:', err);
        return [];
      });
  }

  function _getScriptUrl() {
    return scriptUrl;
  }

  return {
    init: init,
    stop: stop,
    isActive: isActive,
    isSyncedTool: isSyncedTool,
    push: push,
    flush: flush,
    pullAndMerge: pullAndMerge,
    pushEnrollment: pushEnrollment,
    pullEnrollments: pullEnrollments,
    _getScriptUrl: _getScriptUrl
  };
})();
