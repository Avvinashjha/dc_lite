// This is the only player-page entry. No engine, audio, worker, or game is fetched before Play.
const players = import.meta.glob("./players/*.js");
import { expandedPlayer } from "./expanded.js";
const root = document.querySelector("[data-game-root]");
if (root) {
  expandedPlayer(root, () => window.dispatchEvent(new Event("resize")));
  const $ = (selector) => root.querySelector(selector);
  const play = $("[data-play]"),
    pause = $("[data-pause]"),
    restart = $("[data-restart]"),
    sound = $("[data-sound]");
  let instance = null,
    generation = 0,
    loading = false,
    muted = true;
  try {
    muted = localStorage.getItem("dc_arcade_sound") !== "true";
  } catch {}
  const renderSound = () => {
    sound.textContent = muted ? "Sound off" : "Sound on";
    sound.setAttribute("aria-pressed", String(!muted));
    sound.setAttribute(
      "aria-label",
      muted ? "Enable game sound" : "Mute game sound",
    );
  };
  renderSound();
  async function load() {
    if (loading) return;
    loading = true;
    const ticket = ++generation;
    instance?.destroy();
    instance = null;
    $("[data-pause-overlay]").hidden = true;
    pause.disabled = true;
    pause.textContent = "Pause";
    pause.setAttribute("aria-label", "Pause game");
    restart.disabled = true;
    play.disabled = true;
    play.textContent = "Loading…";
    $("[data-load-message]").textContent = "Getting your game ready…";
    try {
      const loader = players[`./players/${root.dataset.slug}.js`];
      if (!loader) throw new Error("Unknown game");
      const [{ createSession }, module] = await Promise.all([
        import("./runtime.js"),
        loader(),
      ]);
      if (ticket !== generation) return;
      const mount = $("[data-game-mount]");
      mount.replaceChildren();
      mount.hidden = false;
      mount.inert = false;
      instance = createSession(root, {
        restart: () => {
          loading = false;
          load();
        },
        onPause: (value) => {
          pause.textContent = value ? "Resume" : "Pause";
          pause.setAttribute(
            "aria-label",
            value ? "Resume game" : "Pause game",
          );
          $("[data-pause-overlay]").hidden = !value;
          $("[data-game-mount]").inert = value;
          $("[data-game-status]").textContent = value
            ? "A little pause"
            : "Make a little time for play";
          if (!value)
            (
              $("[data-game-mount]").querySelector(
                'input:not(:disabled), .arc-canvas-wrap, [tabindex="0"]',
              ) || $("[data-game-mount]")
            ).focus({ preventScroll: true });
        },
        muted,
      });
      await module.mount(instance);
      if (ticket !== generation) {
        instance?.destroy();
        return;
      }
      $("[data-poster]").hidden = true;
      pause.disabled = false;
      restart.disabled = false;
      $("[data-game-status]").textContent = "Make a little time for play";
      mount.tabIndex = -1;
      if (!mount.contains(document.activeElement)) {
        (
          mount.querySelector(
            'input:not(:disabled), .arc-canvas-wrap, [tabindex="0"]',
          ) || mount
        ).focus({ preventScroll: true });
      }
      root
        .querySelector(".arc-machine")
        .scrollIntoView({ block: "start", behavior: "instant" });
    } catch (error) {
      instance?.destroy();
      instance = null;
      $("[data-game-mount]").hidden = true;
      $("[data-poster]").hidden = false;
      $("[data-load-message]").textContent =
        "The game could not load. Check your connection and try again.";
      play.textContent = "Try loading again";
      play.disabled = false;
      $("[data-game-status]").textContent = "Ready to retry";
      console.error("DailyCoder game loading failed", error);
    } finally {
      loading = false;
    }
  }
  play.addEventListener("click", load);
  restart.addEventListener("click", load);
  pause.addEventListener("click", () => instance?.setPaused(!instance.paused));
  $("[data-resume]").addEventListener("click", () => {
    instance?.setPaused(false);
    (
      $("[data-game-mount]").querySelector(
        '.arc-canvas-wrap, [tabindex="0"]',
      ) || $("[data-game-mount]")
    ).focus({ preventScroll: true });
  });
  sound.addEventListener("click", () => {
    muted = !muted;
    instance?.setMuted(muted);
    try {
      localStorage.setItem("dc_arcade_sound", String(!muted));
    } catch {}
    renderSound();
  });
  const leave = () => {
    generation++;
    instance?.destroy();
    instance = null;
  };
  window.addEventListener("pagehide", leave, { once: true });
}
