import { favorites, toggleFavorite } from "./preferences.js";
const button = document.querySelector("[data-theme-toggle]");
button?.addEventListener("click", () => {
  const theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* System defaults still work. */
  }
});

function renderFavorites() {
  const selected = favorites();
  document.querySelectorAll("[data-favorite]").forEach((button) => {
    const active = selected.has(button.dataset.favorite);
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute(
      "aria-label",
      `${active ? "Unfavorite" : "Favorite"} ${button.dataset.favoriteName}`,
    );
    button.textContent = button.classList.contains("arc-favorite-page")
      ? active
        ? "♥ Favorited"
        : "♡ Favorite"
      : active
        ? "♥"
        : "♡";
  });
}
document.querySelectorAll("[data-favorite]").forEach((button) =>
  button.addEventListener("click", () => {
    toggleFavorite(button.dataset.favorite);
    renderFavorites();
    window.dispatchEvent(new Event("arcade:favorites"));
  }),
);
window.addEventListener("storage", () => {
  renderFavorites();
  window.dispatchEvent(new Event("arcade:favorites"));
});
renderFavorites();

// Keep a game session one step from its dashboard, even when switching related games.
const game = document.querySelector("[data-game-root]");
if (game) {
  let replacing = false;
  try {
    replacing =
      sessionStorage.getItem("dc_arcade_replacing") === location.pathname;
    sessionStorage.removeItem("dc_arcade_replacing");
  } catch {}
  let fromDashboard = false;
  try {
    const ref = new URL(document.referrer);
    fromDashboard =
      ref.origin === location.origin && /^\/games\/?$/.test(ref.pathname);
  } catch {}
  if (!replacing && !fromDashboard && !history.state?.arcadeGame) {
    const current = location.href;
    history.replaceState({ arcadeDashboard: true }, "", "/games/");
    history.pushState({ arcadeGame: true }, "", current);
  } else history.replaceState({ arcadeGame: true }, "");
  window.addEventListener("popstate", () => {
    if (/^\/games\/?$/.test(location.pathname)) location.reload();
  });
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target ||
      link.hasAttribute("download")
    )
      return;
    const url = new URL(link.href);
    if (
      url.origin !== location.origin ||
      !/^\/games\/[^/]+\/?$/.test(url.pathname)
    )
      return;
    event.preventDefault();
    try {
      sessionStorage.setItem("dc_arcade_replacing", url.pathname);
    } catch {}
    location.replace(url.href);
  });
}

window.addEventListener("pageshow", (event) => {
  if (event.persisted && game) location.reload();
  else renderFavorites();
});
