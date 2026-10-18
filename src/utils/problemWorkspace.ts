/** Pointer and keyboard resizing without a layout framework or continuous storage writes. */
export function setupProblemWorkspace() {
  const root = document.querySelector<HTMLElement>('.problem-ide');
  const split = root?.querySelector<HTMLElement>('.problem-split');
  const editor = root?.querySelector<HTMLElement>('.problem-editor-area');
  if (!root || !split || !editor) return;
  const desktop = window.matchMedia('(min-width: 1024px)');
  const key = 'dc-problem-workspace';
  let columns = 45;
  let output = 180;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    if (Number.isFinite(saved.columns)) columns = Math.max(25, Math.min(70, saved.columns));
    if (Number.isFinite(saved.output)) output = Math.max(100, Math.min(500, saved.output));
  } catch { /* Storage is optional. */ }
  const columnHandle = root.querySelector<HTMLElement>('.problem-resizer--columns')!;
  const outputHandle = root.querySelector<HTMLElement>('.problem-resizer--output')!;
  function draw() {
    const maxOutput = Math.max(100, Math.min(500, editor!.clientHeight - 200));
    const visibleOutput = Math.min(output, maxOutput);
    root!.style.setProperty('--problem-description-width', `${columns}%`);
    root!.style.setProperty('--problem-output-height', `${visibleOutput}px`);
    columnHandle.setAttribute('aria-valuenow', String(Math.round(columns)));
    outputHandle.setAttribute('aria-valuenow', String(Math.round(visibleOutput)));
    outputHandle.setAttribute('aria-valuemax', String(Math.round(maxOutput)));
  }
  function save() {
    try { localStorage.setItem(key, JSON.stringify({ columns, output })); } catch {}
  }
  function bind(handle: HTMLElement, horizontal: boolean) {
    let dragging = false;
    handle.addEventListener('pointerdown', event => {
      if (event.button !== 0 || (horizontal && !desktop.matches)) return;
      dragging = true;
      handle.setPointerCapture(event.pointerId);
      root!.classList.add('problem-ide--resizing');
      event.preventDefault();
    });
    handle.addEventListener('pointermove', event => {
      if (!dragging) return;
      const bounds = (horizontal ? split! : editor!).getBoundingClientRect();
      if (horizontal) columns = Math.max(25, Math.min(70, (event.clientX - bounds.left) / bounds.width * 100));
      else output = Math.max(100, Math.min(500, bounds.height - 200, bounds.bottom - event.clientY));
      draw();
    });
    const finish = () => { if (!dragging) return; dragging = false; root!.classList.remove('problem-ide--resizing'); save(); };
    handle.addEventListener('pointerup', finish);
    handle.addEventListener('pointercancel', finish);
    handle.addEventListener('lostpointercapture', finish);
    handle.addEventListener('dblclick', () => { if (horizontal) columns = 45; else output = 180; draw(); save(); });
    handle.addEventListener('keydown', event => {
      const decrease = horizontal ? 'ArrowLeft' : 'ArrowDown';
      const increase = horizontal ? 'ArrowRight' : 'ArrowUp';
      if (![decrease, increase, 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      if (horizontal) columns = event.key === 'Home' ? 25 : event.key === 'End' ? 70 : Math.max(25, Math.min(70, columns + (event.key === increase ? 2 : -2)));
      else {
        const maxOutput = Math.max(100, Math.min(500, editor!.clientHeight - 200));
        const currentOutput = Math.min(output, maxOutput);
        output = event.key === 'Home' ? 100 : event.key === 'End' ? maxOutput : Math.max(100, Math.min(maxOutput, currentOutput + (event.key === increase ? 20 : -20)));
      }
      draw(); save();
    });
  }
  bind(columnHandle, true);
  bind(outputHandle, false);
  root.querySelectorAll<HTMLButtonElement>('[data-workspace-view]').forEach(button => {
    button.addEventListener('click', () => {
      root.dataset.mobileView = button.dataset.workspaceView;
      root.querySelectorAll<HTMLButtonElement>('[data-workspace-view]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      draw();
    });
  });
  window.addEventListener('resize', draw, { passive: true });
  draw();
}
