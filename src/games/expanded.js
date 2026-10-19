// Native fullscreen where supported; an equivalent fixed player on iPhone or embedded browsers.
export function expandedPlayer(root, onResize = () => {}) {
  const machine = root.querySelector(".arc-machine");
  const trigger = root.querySelector("[data-fullscreen]");
  const close = root.querySelector("[data-fullscreen-close]");
  let expanded = false,
    previousFocus,
    scrollY = 0;
  function render(value) {
    if (value === expanded) return;
    expanded = value;
    machine.toggleAttribute("data-expanded", value);
    trigger.setAttribute("aria-expanded", String(value));
    trigger.setAttribute(
      "aria-label",
      value ? "Exit fullscreen" : "Expand game",
    );
    trigger.textContent = value ? "↙" : "⛶";
    document.body.classList.toggle("arc-player-expanded", value);
    if (value) {
      scrollY = window.scrollY;
      previousFocus = document.activeElement;
      machine.setAttribute("role", "dialog");
      machine.setAttribute("aria-modal", "true");
      (
        machine.querySelector(
          "[data-pause-overlay]:not([hidden]) [data-resume]",
        ) ||
        machine.querySelector(
          'input:not(:disabled),.arc-canvas-wrap,[tabindex="0"]',
        ) ||
        close
      ).focus({ preventScroll: true });
    } else {
      machine.removeAttribute("role");
      machine.removeAttribute("aria-modal");
      window.scrollTo(0, scrollY);
      previousFocus?.focus({ preventScroll: true });
    }
    onResize();
  }
  async function exit() {
    render(false);
    if (document.fullscreenElement === machine) {
      try {
        await document.exitFullscreen();
      } catch {}
    }
  }
  async function enter() {
    render(true);
    if (
      matchMedia(
        "(max-width:700px), (max-width:950px) and (max-height:600px), (pointer:coarse)",
      ).matches
    )
      return;
    try {
      await machine.requestFullscreen?.();
    } catch {
      /* Fixed view remains fully usable. */
    }
  }
  trigger.addEventListener("click", () => (expanded ? exit() : enter()));
  close.addEventListener("click", exit);
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) render(false);
  });
  document.addEventListener(
    "keydown",
    (e) => {
      if (!expanded) return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
        exit();
      }
      if (e.key === "Tab") {
        const focusable = [
          ...machine.querySelectorAll(
            'a,button:not(:disabled),input,select,[tabindex="0"]',
          ),
        ].filter((n) => n.getClientRects().length && !n.closest("[inert]"));
        const first = focusable[0],
          last = focusable.at(-1);
        if (!machine.contains(document.activeElement)) {
          e.preventDefault();
          (e.shiftKey ? last : first)?.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    },
    true,
  );
  window.addEventListener("pagehide", () => render(false));
  return {
    exit,
    get active() {
      return expanded;
    },
  };
}
