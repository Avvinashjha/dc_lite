/**
 * Shared sync initialization for DCSyncService.
 *
 * Expects a global `__dcSyncScriptUrl` to be set before this script loads
 * (via define:vars in the layout). Listens for auth changes and starts/stops
 * DCSyncService accordingly.
 */
(function () {
  var url = window.__dcSyncScriptUrl;
  if (!url) return;

  window.addEventListener('dc:authchange', function (e) {
    var user = e.detail && e.detail.user;
    if (user && typeof DCSyncService !== 'undefined') {
      DCSyncService.init(user.uid, url);
    } else if (!user && typeof DCSyncService !== 'undefined') {
      DCSyncService.stop();
    }
  });

  if (window.__dcAuthUser && typeof DCSyncService !== 'undefined') {
    DCSyncService.init(window.__dcAuthUser.uid, url);
  }
})();
