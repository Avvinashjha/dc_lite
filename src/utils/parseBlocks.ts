import { parseLearningLab } from '../lib/learningLab.ts';
import type { LearningLabData } from '../types/learningLab';

/**
 * Parse custom :::video, :::quiz, :::exercise blocks from markdown content.
 * Returns the HTML with blocks replaced by placeholder divs,
 * plus structured data for each block for Astro components.
 */

export interface VideoBlock {
  type: 'video';
  url: string;
  title: string;
}

export interface QuizBlock {
  type: 'quiz';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface ExerciseBlock {
  type: 'exercise';
  title: string;
  description: string;
  starterCode: string;
}

export interface LearningLabBlock { type: 'learninglab'; data: LearningLabData }
export type ContentBlock = VideoBlock | QuizBlock | ExerciseBlock | LearningLabBlock;

export function extractBlocks(markdown: string): { cleanMarkdown: string; blocks: ContentBlock[] } {
  const blocks: ContentBlock[] = [];

  const cleanMarkdown = markdown.replace(
    /:::(\w+)\n([\s\S]*?):::/g,
    (_match, type: string, body: string) => {
      const placeholder = `<!--BLOCK_${blocks.length}-->`;

      if (type === 'video') {
        const url = body.match(/url:\s*(.+)/)?.[1]?.trim() || '';
        const title = body.match(/title:\s*(.+)/)?.[1]?.trim() || 'Video';
        blocks.push({ type: 'video', url, title });
      } else if (type === 'quiz') {
        const question = body.match(/question:\s*(.+)/)?.[1]?.trim() || '';
        const optionsRaw = body.match(/options:\n((?:\s+-\s+.+\n?)+)/)?.[1] || '';
        const options = optionsRaw
          .split('\n')
          .map(l => l.replace(/^\s*-\s*/, '').trim())
          .filter(Boolean);
        const answer = parseInt(body.match(/answer:\s*(\d+)/)?.[1] || '0');
        const explanation = body.match(/explanation:\s*(.+)/)?.[1]?.trim() || '';
        blocks.push({ type: 'quiz', question, options, answer, explanation });
      } else if (type === 'exercise') {
        const title = body.match(/title:\s*(.+)/)?.[1]?.trim() || '';
        const description = body.match(/description:\s*(.+)/)?.[1]?.trim() || '';
        const starterCode = body.match(/starterCode:\s*\|\n([\s\S]*)/)?.[1] || '';
        blocks.push({ type: 'exercise', title, description, starterCode: starterCode.replace(/^  /gm, '') });
      } else if (type === 'learninglab') {
        blocks.push({ type: 'learninglab', data: parseLearningLab(body) });
      } else {
        return _match;
      }
      return placeholder;
    }
  );

  return { cleanMarkdown, blocks };
}
