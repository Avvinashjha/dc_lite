import type { LearningLabData } from '../types/learningLab';

/** Reject broken authored activities at build time rather than shipping empty widgets. */
export function parseLearningLab(body: string): LearningLabData {
  const data = JSON.parse(body);
  const text = (value: unknown) => typeof value === 'string' && value.trim().length > 0;
  if (!data || !text(data.title) || !text(data.code) || !text(data.output) ||
      !Array.isArray(data.steps) || !data.steps.length ||
      !data.steps.every((step: any) => step && text(step.label) && text(step.detail)) ||
      !data.prediction || !text(data.prediction.question) ||
      !Array.isArray(data.prediction.options) || data.prediction.options.length < 2 ||
      !data.prediction.options.every(text) || !Number.isInteger(data.prediction.answer) ||
      data.prediction.answer < 0 || data.prediction.answer >= data.prediction.options.length ||
      !text(data.prediction.explanation)) {
    throw new Error('Invalid learninglab: expected code, output, trace steps, and a valid prediction.');
  }
  return data;
}
