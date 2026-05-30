import type { Quiz, QuizListItem } from '../types/quiz';
import { listCommunityQuizzes as apiListCommunityQuizzes } from './quizApi';

/** URL to play a quiz: curated quizzes are static pages; community quizzes use the client loader. */
export function toListItemUrl(item: Pick<QuizListItem, 'slug' | 'source'>): string {
  if (item.source === 'community') {
    return `/quiz/play/?slug=${encodeURIComponent(item.slug)}`;
  }
  return `/quiz/${item.slug}`;
}

export function quizToListItem(quiz: Quiz): QuizListItem {
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
    source: quiz.source || 'community',
    questionCount: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
    publishedAt: quiz.publishedAt,
  };
}

export interface CommunityListResult {
  configured: boolean;
  items: QuizListItem[];
  error?: string;
}

export async function listCommunityQuizzes(): Promise<CommunityListResult> {
  const res = await apiListCommunityQuizzes();
  return {
    configured: res.configured,
    error: res.error,
    items: res.quizzes.map(quizToListItem),
  };
}
