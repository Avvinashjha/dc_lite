export type SchoolMode = 'home' | 'play' | 'learn' | 'code' | 'quiz' | 'tests' | 'ask';
export type SchoolStage = 'discover' | 'explore' | 'focus' | 'specialise';
export type SchoolStream = 'all' | 'engineering' | 'medical' | 'commerce' | 'arts';
export type QuizMode = 'smash' | 'rush' | 'think' | 'test';

export interface SchoolSubject {
  id: string;
  name: string;
  symbol: string;
  color: string;
  description: string;
  grades: number[];
}

export interface SchoolQuestion {
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface SchoolLesson {
  id: string;
  grade: number;
  subject: string;
  title: string;
  summary: string;
  minutes: number;
  outcome: string;
  sections: { title: string; text: string }[];
  example: string;
  questions: SchoolQuestion[];
}

export interface SchoolAttempt {
  lessonId: string;
  mode: QuizMode;
  correct: number;
  total: number;
  completedAt: number;
}

export interface SchoolProfile {
  version: 1;
  grade: number;
  stream: SchoolStream;
  completed: string[];
  codeCompleted: string[];
  attempts: SchoolAttempt[];
}
