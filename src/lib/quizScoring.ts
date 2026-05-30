import type { Question, QuizAnswers, QuizResult, QuestionResult } from '../types/quiz';

function arraysEqualAsSets(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const setB = new Set(b);
  return a.every(x => setB.has(x));
}

/**
 * Grade a single question. For single/boolean a question is correct when the
 * one selected option matches. For multiple, ALL correct options must be
 * selected and NO incorrect option may be selected (exact set match).
 */
export function gradeQuestion(question: Question, selected: string[]): QuestionResult {
  const possible = question.points ?? 1;
  const correctIds = question.correct || [];
  const sel = selected || [];

  let correct: boolean;
  if (question.type === 'multiple') {
    correct = arraysEqualAsSets(sel, correctIds);
  } else {
    // single / boolean: exactly one selection that is in the correct set
    correct = sel.length === 1 && correctIds.includes(sel[0]);
  }

  return {
    questionId: question.id,
    correct,
    earned: correct ? possible : 0,
    possible,
    selected: sel,
    correctIds,
  };
}

export function gradeQuiz(
  questions: Question[],
  answers: QuizAnswers,
  timeSec: number
): QuizResult {
  const perQuestion = questions.map(q => gradeQuestion(q, answers[q.id] || []));
  const score = perQuestion.reduce((s, r) => s + r.earned, 0);
  const maxScore = perQuestion.reduce((s, r) => s + r.possible, 0);
  const correctCount = perQuestion.filter(r => r.correct).length;
  const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return {
    score,
    maxScore,
    percent,
    correctCount,
    total: questions.length,
    timeSec,
    perQuestion,
    completedAt: Date.now(),
  };
}
