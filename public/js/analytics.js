(function () {
  function getGtag() {
    return typeof window.gtag === 'function' ? window.gtag : null;
  }

  window.DCTrack = function DCTrack(eventName, params) {
    try {
      var gtag = getGtag();
      if (!gtag || !eventName) return;
      gtag('event', eventName, params || {});
    } catch (_) {
      // Ignore analytics failures to avoid affecting UX.
    }
  };
})();
