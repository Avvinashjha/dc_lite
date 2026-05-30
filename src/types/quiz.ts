// ──── Quiz ────
// All quiz types are intentionally JSON-serializable so a quiz can be stored
// as `content/quiz/<slug>/quiz.json` (curated) or as a JSON blob in a Google
// Sheet (community), and round-tripped through IndexedDB drafts.

export type QuizDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'single' | 'multiple' | 'boolean';
export type QuizSource = 'curated' | 'community';

export interface QuizOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options: QuizOption[];
  /** Option ids that are correct. Single/boolean have exactly one; multiple has 1+. */
  correct: string[];
  explanation?: string;
  /** Points awarded for a fully correct answer. Defaults to 1. */
  points?: number;
}

/** Shape stored in content/quiz/<slug>/quiz.json (no slug field — derived from dir). */
export interface QuizMeta {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: QuizDifficulty;
  tags: string[];
  author: string;
  /** Ranked quizzes count toward the leaderboard and require login to submit. */
  ranked: boolean;
  /** Optional overall countdown in seconds. Omit / 0 for untimed. */
  timeLimitSec?: number;
  source: QuizSource;
  questions: Question[];
  /** ISO date string; optional, used for ordering / SEO. */
  publishedAt?: string;
  draft?: boolean;
}

/** Full quiz with its slug (curated quizzes derive slug from directory name). */
export interface Quiz extends QuizMeta {
  slug: string;
}

/** Lightweight quiz used for list/index pages (questions count instead of full questions). */
export interface QuizListItem {
  slug: string;
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: QuizDifficulty;
  tags: string[];
  author: string;
  ranked: boolean;
  timeLimitSec?: number;
  source: QuizSource;
  questionCount: number;
  publishedAt?: string;
}

export interface QuizIndex {
  title: string;
  description: string;
  featured?: string[];
}

// ──── Runtime / scoring ────

/** A user's selected option ids per question, keyed by question id. */
export type QuizAnswers = Record<string, string[]>;

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  earned: number;
  possible: number;
  selected: string[];
  correctIds: string[];
}

export interface QuizResult {
  score: number;
  maxScore: number;
  percent: number;
  correctCount: number;
  total: number;
  timeSec: number;
  perQuestion: QuestionResult[];
  completedAt: number;
}

// ──── Leaderboard / community payloads (Apps Script contract) ────

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  score: number;
  maxScore: number;
  timeSec: number;
  completedAt: string;
}

export interface ScoreSubmission {
  quizSlug: string;
  uid: string;
  displayName: string;
  score: number;
  maxScore: number;
  timeSec: number;
  completedAt: string;
}

/** Local IndexedDB attempt history record (tool: 'quiz-attempts'). */
export interface QuizAttemptRecord {
  slug: string;
  title: string;
  score: number;
  maxScore: number;
  percent: number;
  timeSec: number;
  ranked: boolean;
  completedAt: number;
}
