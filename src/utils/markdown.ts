import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

// Create marked instance with syntax highlighting (runs at build time only - zero runtime JS)
const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

marked.setOptions({
  gfm: true,
  breaks: false,
});

// Parse markdown to HTML with syntax highlighting
export function parseMarkdown(markdown: string): string {
  return marked.parse(markdown) as string;
}

// Extract plain text from markdown (for excerpts)
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\n/g, ' ')
    .trim();
}

// Get excerpt from markdown content
export function getExcerpt(markdown: string, length: number = 150): string {
  const plain = stripMarkdown(markdown);
  if (plain.length <= length) return plain;
  return plain.substring(0, length).trim() + '...';
}
