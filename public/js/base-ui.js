(function () {
  function setupTheme() {
    var toggles = [
      document.getElementById('theme-toggle'),
      document.getElementById('theme-toggle-mobile')
    ];
    var icons = [
      document.getElementById('theme-icon'),
      document.getElementById('theme-icon-mobile')
    ];

    function updateIcons(theme) {
      var sun =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
      var moon =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      icons.forEach(function (icon) {
        if (icon) icon.innerHTML = theme === 'dark' ? sun : moon;
      });
    }

    updateIcons(document.documentElement.getAttribute('data-theme') || 'light');

    toggles.forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') || 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateIcons(next);
      });
    });
  }

  function setupMobileMenu() {
    var btn = document.getElementById('mobile-menu-btn');
    var nav = document.getElementById('mobile-nav');
    if (!btn || !nav) return;

    var closeIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    var menuIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('header__mobile-nav--open');
      btn.innerHTML = open ? closeIcon : menuIcon;
    });

    nav.querySelectorAll('a').forEach(function (anchor) {
      anchor.addEventListener('click', function () {
        nav.classList.remove('header__mobile-nav--open');
        btn.innerHTML = menuIcon;
      });
    });
  }

  function setupReadingMode() {
    var buttons = [
      document.getElementById('reading-mode-toggle'),
      document.getElementById('reading-mode-toggle-mobile')
    ];

    function updateStyle() {
      var on = document.documentElement.getAttribute('data-reading-mode') === 'true';
      buttons.forEach(function (btn) {
        if (btn) btn.style.color = on ? 'var(--color-primary)' : '';
      });
    }

    updateStyle();

    buttons.forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener('click', function () {
        var on = document.documentElement.getAttribute('data-reading-mode') === 'true';
        if (on) document.documentElement.removeAttribute('data-reading-mode');
        else document.documentElement.setAttribute('data-reading-mode', 'true');
        localStorage.setItem('readingMode', String(!on));
        updateStyle();
      });
    });
  }

  setupTheme();
  setupMobileMenu();
  setupReadingMode();
})();
