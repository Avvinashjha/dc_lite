/**
 * Auth gate bridge for vanilla JS pages.
 * Exposes window.requireAuth(reason, callback) that either runs the callback
 * immediately (if signed in) or opens the login modal and runs the callback
 * after successful sign-in.
 *
 * Depends on:
 *   - window.__dcAuthUser (set by userStore.ts)
 *   - window.__dcOpenLoginModal (set by authModalStore.ts)
 *   - CustomEvent 'dc:authchange' (dispatched by userStore.ts)
 */
(function () {
  window.requireAuth = function (reason, callback) {
    if (window.__dcAuthUser) {
      callback(window.__dcAuthUser);
      return;
    }

    if (typeof window.__dcOpenLoginModal === 'function') {
      window.__dcOpenLoginModal(reason || 'Sign in to continue');
    }

    function onAuth(e) {
      var user = e.detail && e.detail.user;
      if (user) {
        window.removeEventListener('dc:authchange', onAuth);
        callback(user);
      }
    }
    window.addEventListener('dc:authchange', onAuth);
  };

  window.isUserSignedIn = function () {
    return !!window.__dcAuthUser;
  };

  window.getCurrentUser = function () {
    return window.__dcAuthUser || null;
  };
})();
