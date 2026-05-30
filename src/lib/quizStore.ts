import type { QuizAttemptRecord, Quiz } from '../types/quiz';

/**
 * Local-only persistence for the Quiz module, layered on the shared IndexedDB
 * helper (`window.DCStore`, loaded via /js/store.js). These tool namespaces are
 * intentionally NOT in DCSyncService's synced-tool list, so attempt history and
 * builder drafts stay purely local to the browser.
 */

const ATTEMPTS_TOOL = 'quiz-attempts';
const DRAFTS_TOOL = 'quiz-drafts';

interface DCStoreLike {
  init(): Promise<void>;
  get(tool: string, id: string): Promise<Record<string, unknown> | null>;
  getAll(tool: string): Promise<Record<string, unknown>[]>;
  set(tool: string, id: string, data: Record<string, unknown>): Promise<unknown>;
  remove(tool: string, id: string): Promise<unknown>;
}

function store(): DCStoreLike | null {
  if (typeof window === 'undefined') return null;
  const s = (window as unknown as { DCStore?: DCStoreLike }).DCStore;
  return s || null;
}

// ──── Attempt history ────

export async function saveAttempt(attempt: QuizAttemptRecord): Promise<void> {
  const s = store();
  if (!s) return;
  await s.init();
  // Key by slug + completedAt so multiple attempts of the same quiz are kept.
  const id = `${attempt.slug}:${attempt.completedAt}`;
  await s.set(ATTEMPTS_TOOL, id, { ...attempt });
}

export async function getAttempts(): Promise<QuizAttemptRecord[]> {
  const s = store();
  if (!s) return [];
  await s.init();
  const rows = await s.getAll(ATTEMPTS_TOOL);
  return rows
    .map(r => r as unknown as QuizAttemptRecord)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
}

export async function getAttemptsForQuiz(slug: string): Promise<QuizAttemptRecord[]> {
  return (await getAttempts()).filter(a => a.slug === slug);
}

export async function getBestPercentForQuiz(slug: string): Promise<number | null> {
  const attempts = await getAttemptsForQuiz(slug);
  if (!attempts.length) return null;
  return Math.max(...attempts.map(a => a.percent || 0));
}

// ──── Builder drafts ────

export interface QuizDraft extends Partial<Quiz> {
  draftId: string;
  updatedAt: number;
}

export async function saveDraft(draft: QuizDraft): Promise<void> {
  const s = store();
  if (!s) return;
  await s.init();
  await s.set(DRAFTS_TOOL, draft.draftId, { ...draft, updatedAt: Date.now() });
}

export async function getDraft(draftId: string): Promise<QuizDraft | null> {
  const s = store();
  if (!s) return null;
  await s.init();
  const row = await s.get(DRAFTS_TOOL, draftId);
  return row ? (row as unknown as QuizDraft) : null;
}

export async function getDrafts(): Promise<QuizDraft[]> {
  const s = store();
  if (!s) return [];
  await s.init();
  const rows = await s.getAll(DRAFTS_TOOL);
  return rows
    .map(r => r as unknown as QuizDraft)
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export async function removeDraft(draftId: string): Promise<void> {
  const s = store();
  if (!s) return;
  await s.init();
  await s.remove(DRAFTS_TOOL, draftId);
}
