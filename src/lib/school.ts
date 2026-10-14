import type { SchoolProfile, SchoolStage, SchoolStream, SchoolQuestion } from '../types/school.ts';
import { SCHOOL_LESSONS, SCHOOL_STREAMS, SCHOOL_SUBJECTS } from '../data/school.ts';

export const SCHOOL_STORAGE_KEY = 'dailycoder-school-v1';
export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = { version: 1, grade: 6, stream: 'all', completed: [], codeCompleted: [], attempts: [] };
const lessonIds = new Set(SCHOOL_LESSONS.map(l => l.id));

export function isSchoolGrade(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 12;
}

export function schoolStage(grade: number): SchoolStage {
  return grade <= 4 ? 'discover' : grade <= 8 ? 'explore' : grade <= 10 ? 'focus' : 'specialise';
}

export function isSchoolStream(value: unknown): value is SchoolStream {
  return SCHOOL_STREAMS.some(s => s.id === value);
}

export function schoolSubjects(grade: number, stream: SchoolStream = 'all') {
  const preset = SCHOOL_STREAMS.find(s => s.id === stream) || SCHOOL_STREAMS[0];
  return SCHOOL_SUBJECTS.filter(s => s.grades.includes(grade) && (grade < 11 || preset.subjects.includes(s.id)));
}

export function schoolLessons(grade: number, subject?: string) {
  return SCHOOL_LESSONS.filter(l => l.grade === grade && (!subject || l.subject === subject));
}

/** Validate browser storage; neither malformed storage nor URL values are trusted. */
export function restoreSchoolProfile(raw: unknown): SchoolProfile {
  const fresh = (): SchoolProfile => ({ ...DEFAULT_SCHOOL_PROFILE, completed: [], codeCompleted: [], attempts: [] });
  if (!raw || typeof raw !== 'object') return fresh();
  const p = raw as Record<string, unknown>;
  if (p.version !== 1) return fresh();
  const result = fresh();
  if (isSchoolGrade(p.grade)) result.grade = p.grade;
  if (isSchoolStream(p.stream)) result.stream = p.stream;
  if (Array.isArray(p.completed)) result.completed = [...new Set(p.completed.filter((id): id is string => typeof id === 'string' && lessonIds.has(id)))];
  if (Array.isArray(p.codeCompleted)) result.codeCompleted = [...new Set(p.codeCompleted.filter((id): id is string => typeof id === 'string' && /^robot-[1-3]$/.test(id)))];
  if (Array.isArray(p.attempts)) {
    result.attempts = p.attempts.filter((a): a is SchoolProfile['attempts'][number] => {
      if (!a || typeof a !== 'object') return false;
      const known = SCHOOL_LESSONS.find(l => l.id === a.lessonId);
      return !!known && ['smash', 'rush', 'think', 'test'].includes(a.mode)
        && a.total === known.questions.length && Number.isInteger(a.correct)
        && a.correct >= 0 && a.correct <= a.total && Number.isFinite(a.completedAt) && a.completedAt > 0;
    }).slice(-50).map(a => ({ lessonId: a.lessonId, mode: a.mode, correct: a.correct, total: a.total, completedAt: a.completedAt }));
  }
  return result;
}

export function scoreSchoolQuestions(questions: SchoolQuestion[], answers: (number | null)[]) {
  return questions.reduce((score, question, index) => score + (answers[index] === question.correct ? 1 : 0), 0);
}

export type RobotCommand = 'up' | 'right' | 'down' | 'left';
export const ROBOT_CHALLENGES = [
  { id: 'robot-1', title: 'A path to the star', goal: [3, 3], blocks: [] as number[][], limit: 8, hint: 'Try three steps right, then three steps down.' },
  { id: 'robot-2', title: 'Go around the garden', goal: [3, 3], blocks: [[1, 0], [1, 1], [2, 2]], limit: 10, hint: 'Start by moving down. The bottom row is clear.' },
  { id: 'robot-3', title: 'Plan the whole journey', goal: [3, 0], blocks: [[1, 0], [1, 1], [2, 2]], limit: 12, hint: 'Go down to the bottom row, cross it, then travel up the right edge.' },
];

/** A small, deterministic instruction interpreter; it never evaluates user code. */
export function runSchoolRobot(commands: RobotCommand[], challenge: typeof ROBOT_CHALLENGES[number]) {
  let x = 0, y = 0;
  const path = [[x, y]];
  const movement = { up: [0, -1], right: [1, 0], down: [0, 1], left: [-1, 0] };
  if (commands.length > challenge.limit) return { path, success: false, message: `Use at most ${challenge.limit} instructions.` };
  for (let i = 0; i < commands.length; i++) {
    const step = movement[commands[i]];
    if (!step) return { path, success: false, message: 'Choose one of the four direction instructions.' };
    const nx = x + step[0], ny = y + step[1];
    if (nx < 0 || nx > 3 || ny < 0 || ny > 3) return { path, success: false, message: `Step ${i + 1} goes off the board. Change your instructions and try again.` };
    if (challenge.blocks.some(([bx, by]) => bx === nx && by === ny)) return { path, success: false, message: `Step ${i + 1} reaches a garden square. Find a path around it.` };
    x = nx; y = ny; path.push([x, y]);
  }
  const success = x === challenge.goal[0] && y === challenge.goal[1];
  return { path, success, message: success ? 'You reached the star! Your instructions worked.' : 'Your robot is still exploring. Add or change a step to reach the star.' };
}
