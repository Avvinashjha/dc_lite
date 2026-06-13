import type { Quiz, LeaderboardEntry, ScoreSubmission } from '../types/quiz';

/**
 * Client-side wrapper around the Quiz Google Apps Script endpoint.
 *
 * The endpoint URL is injected by the page via `window.__dcQuizApiUrl`
 * (see content/config.json → quiz.googleScriptUrl). When it is blank, the API
 * is treated as "not configured" and all calls resolve to empty/graceful
 * results so the UI can degrade without errors.
 *
 * The request contract mirrors the existing minimal-DB style used by
 * DCSyncService: GET with `?action=...` for reads, POST with a `text/plain`
 * JSON body (`{ action, ... }`) for writes to avoid CORS preflight.
 */

export function getQuizApiUrl(): string {
  if (typeof window === 'undefined') return '';
  return (window as unknown as { __dcQuizApiUrl?: string }).__dcQuizApiUrl || '';
}

export function isQuizApiConfigured(): boolean {
  return getQuizApiUrl().trim().length > 0;
}

async function getIdToken(forceRefresh = false): Promise<string | null> {
  if (typeof window === 'undefined') return '';
  const w = window as unknown as { getFirebaseIdToken?: (forceRefresh?: boolean) => Promise<string | null> };
  if (typeof w.getFirebaseIdToken === 'function') {
    try {
      return await w.getFirebaseIdToken(forceRefresh);
    } catch {
      return null;
    }
  }
  return null;
}

async function postWithAuth(url: string, body: Record<string, unknown>): Promise<unknown> {
  const idToken = await getIdToken();
  if (!idToken) {
    return { status: 'error', message: 'Sign in required' };
  }

  async function send(token: string) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ ...body, idToken: token }),
    });
    return res.json();
  }

  const data = await send(idToken);
  if (data?.status === 'error' && data?.message === 'Authentication required') {
    const freshToken = await getIdToken(true);
    if (freshToken && freshToken !== idToken) return send(freshToken);
  }
  return data;
}

export interface CommunityQuizResponse {
  configured: boolean;
  quizzes: Quiz[];
  error?: string;
}

export async function listCommunityQuizzes(): Promise<CommunityQuizResponse> {
  const url = getQuizApiUrl();
  if (!url) return { configured: false, quizzes: [] };

  try {
    const res = await fetch(`${url}?action=listCommunityQuizzes`);
    const data = await res.json();
    if (data.status !== 'success') {
      return { configured: true, quizzes: [], error: data.message || 'Failed to load' };
    }
    const quizzes: Quiz[] = (data.quizzes || [])
      .map(normalizeCommunityQuiz)
      .filter(Boolean) as Quiz[];
    return { configured: true, quizzes };
  } catch (err) {
    console.warn('[quizApi] listCommunityQuizzes failed:', err);
    return { configured: true, quizzes: [], error: 'Network error' };
  }
}

/** Community rows may store the quiz as a JSON string blob; normalize it. */
function normalizeCommunityQuiz(row: unknown): Quiz | null {
  try {
    let q: Partial<Quiz>;
    if (typeof row === 'string') {
      q = JSON.parse(row);
    } else if (row && typeof row === 'object' && 'quiz' in row) {
      const raw = (row as { quiz: unknown }).quiz;
      q = typeof raw === 'string' ? JSON.parse(raw) : (raw as Partial<Quiz>);
    } else {
      q = row as Partial<Quiz>;
    }
    if (!q || !q.slug || !Array.isArray(q.questions)) return null;
    return {
      ...(q as Quiz),
      source: 'community',
      ranked: false,
    };
  } catch {
    return null;
  }
}

export interface LeaderboardResponse {
  configured: boolean;
  scores: LeaderboardEntry[];
  error?: string;
}

export async function getLeaderboard(quizSlug: string, limit = 20): Promise<LeaderboardResponse> {
  const url = getQuizApiUrl();
  if (!url) return { configured: false, scores: [] };

  try {
    const res = await fetch(
      `${url}?action=getLeaderboard&quizSlug=${encodeURIComponent(quizSlug)}&limit=${limit}`
    );
    const data = await res.json();
    if (data.status !== 'success') {
      return { configured: true, scores: [], error: data.message || 'Failed to load' };
    }
    return { configured: true, scores: (data.scores || []) as LeaderboardEntry[] };
  } catch (err) {
    console.warn('[quizApi] getLeaderboard failed:', err);
    return { configured: true, scores: [], error: 'Network error' };
  }
}

export interface SubmitResult {
  ok: boolean;
  configured: boolean;
  error?: string;
}

export async function submitScore(submission: ScoreSubmission): Promise<SubmitResult> {
  const url = getQuizApiUrl();
  if (!url) return { ok: false, configured: false };

  try {
    const data = await postWithAuth(url, { action: 'submitScore', ...submission }) as {
      status?: string;
      message?: string;
    };
    if (data.status !== 'success') {
      return { ok: false, configured: true, error: data.message || 'Submission failed' };
    }
    return { ok: true, configured: true };
  } catch (err) {
    console.warn('[quizApi] submitScore failed:', err);
    return { ok: false, configured: true, error: 'Network error' };
  }
}

export interface CreateResult {
  ok: boolean;
  configured: boolean;
  slug?: string;
  error?: string;
}

export async function createCommunityQuiz(
  quiz: Quiz,
  uid: string
): Promise<CreateResult> {
  const url = getQuizApiUrl();
  if (!url) return { ok: false, configured: false };

  try {
    const data = await postWithAuth(url, {
      action: 'createQuiz',
      uid,
      quiz: { ...quiz, source: 'community', ranked: false },
    }) as { status?: string; message?: string; slug?: string };
    if (data.status !== 'success') {
      return { ok: false, configured: true, error: data.message || 'Create failed' };
    }
    return { ok: true, configured: true, slug: data.slug };
  } catch (err) {
    console.warn('[quizApi] createCommunityQuiz failed:', err);
    return { ok: false, configured: true, error: 'Network error' };
  }
}
