import type { ComponentChildren } from 'preact';

export default function SchoolIcon({ name, size = 22 }: { name: string; size?: number }) {
  const paths: Record<string, ComponentChildren> = {
    home: <><path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/></>,
    book: <><path d="M12 6c-3-3-7-3-10-2v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 2Z"/><path d="M12 6v15"/></>,
    play: <><rect x="2" y="6" width="20" height="13" rx="5"/><path d="M6 12h5M8.5 9.5v5M16 10h.01M18 14h.01"/></>,
    code: <><path d="m7 6-5 6 5 6m10-12 5 6-5 6M14 3l-4 18"/></>,
    bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7Z"/>,
    check: <><rect x="4" y="3" width="16" height="19" rx="3"/><path d="M9 3V1h6v2m-7 9 3 3 5-6"/></>,
    chat: <><path d="M21 11a9 9 0 0 1-9 9H3l1.5-4.5A9 9 0 1 1 21 11Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
    star: <path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
    leaf: <><path d="M20 3C9 1 2 9 6 16s16 3 14-13Z"/><path d="M4 21 15 9"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{paths[name] || paths.star}</svg>;
}
