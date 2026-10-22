export interface LearningLabData {
  title: string;
  code: string;
  output: string;
  steps: { label: string; detail: string }[];
  prediction: { question: string; options: string[]; answer: number; explanation: string };
}
