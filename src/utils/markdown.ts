import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: false,
});

// Parse markdown to HTML
export function parseMarkdown(markdown: string): string {
  return marked.parse(markdown) as string;
}

// Extract plain text from markdown (for excerpts)
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();
}

// Get excerpt from markdown content
export function getExcerpt(markdown: string, length: number = 150): string {
  const plain = stripMarkdown(markdown);
  if (plain.length <= length) return plain;
  return plain.substring(0, length).trim() + '...';
}
