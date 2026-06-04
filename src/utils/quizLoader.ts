import fs from 'node:fs';
import path from 'node:path';
import type { Quiz, QuizMeta, QuizListItem, QuizIndex, Question } from '../types/quiz';
import { renderQuizRichText } from './markdown';

const CONTENT_DIR = path.resolve(process.cwd(), 'content');
const QUIZ_DIR = path.join(CONTENT_DIR, 'quiz');

function readJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function getDirs(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

// ──── Index ────

export function getQuizIndex(): QuizIndex {
  const indexPath = path.join(QUIZ_DIR, '_index.json');
  if (!fs.existsSync(indexPath)) {
    return { title: 'Quizzes', description: 'Interactive web development quizzes.' };
  }
  return readJson<QuizIndex>(indexPath);
}

// ──── Curated quizzes (build-time, from content/quiz/<slug>/quiz.json) ────

export function getQuizzes(): Quiz[] {
  const slugs = getDirs(QUIZ_DIR);
  return slugs.map(slug => getQuiz(slug)).filter(Boolean) as Quiz[];
}

export function getQuiz(slug: string): Quiz | null {
  const quizPath = path.join(QUIZ_DIR, slug, 'quiz.json');
  if (!fs.existsSync(quizPath)) return null;

  const meta = readJson<QuizMeta>(quizPath);
  if (meta.draft) return null;

  // Curated quizzes always derive source/slug from the repo.
  return {
    ...meta,
    slug,
    source: meta.source || 'curated',
    questions: (meta.questions || []).map(renderQuestionHtml),
  };
}

/**
 * Pre-render a question's prompt/options/explanation to HTML at build time so
 * code snippets get the same syntax-highlighted code blocks as lesson markdown.
 */
function renderQuestionHtml(q: Question): Question {
  return {
    ...q,
    promptHtml: renderQuizRichText(q.prompt),
    explanationHtml: q.explanation ? renderQuizRichText(q.explanation) : undefined,
    options: (q.options || []).map(opt => ({
      ...opt,
      textHtml: renderQuizRichText(opt.text),
    })),
  };
}

export function getQuizzesSorted(): Quiz[] {
  return getQuizzes().sort((a, b) => {
    const ad = a.publishedAt || '';
    const bd = b.publishedAt || '';
    return bd.localeCompare(ad) || a.title.localeCompare(b.title);
  });
}

/** Lightweight list items for index/listing pages. */
export function getQuizListItems(): QuizListItem[] {
  return getQuizzesSorted().map(toListItem);
}

export function toListItem(quiz: Quiz): QuizListItem {
  return {
    slug: quiz.slug,
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    difficulty: quiz.difficulty,
    tags: quiz.tags || [],
    author: quiz.author,
    ranked: !!quiz.ranked,
    timeLimitSec: quiz.timeLimitSec,
    source: quiz.source || 'curated',
    questionCount: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
    publishedAt: quiz.publishedAt,
  };
}

// ──── Registry helpers (mirror data/tools.ts style) ────

export function getQuizCategories(): string[] {
  return [...new Set(getQuizzes().map(q => q.category))].sort();
}

export function getQuizDifficulties(): string[] {
  const order = ['easy', 'medium', 'hard'];
  return [...new Set(getQuizzes().map(q => q.difficulty))].sort(
    (a, b) => order.indexOf(a) - order.indexOf(b)
  );
}

export function getQuizTags(): string[] {
  return [...new Set(getQuizzes().flatMap(q => q.tags || []))].sort();
}

export const QUIZZES_COUNT = getQuizzes().length;
