import { Marked } from 'marked';
import hljs from 'highlight.js';

// Token shape passed to the `code` renderer by marked v17
interface CodeToken {
  text: string;
  lang?: string;
  escaped?: boolean;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Create marked instance with a custom code renderer (runs at build time only - zero runtime JS)
const marked = new Marked();

marked.use({
  renderer: {
    code(token: CodeToken): string {
      const text = token.text;
      const requested = (token.lang || '').trim().split(/\s+/)[0];

      if (requested === 'mermaid') {
        return `<div class="mermaid">${escapeHtml(text)}</div>`;
      }

      const language = requested && hljs.getLanguage(requested) ? requested : 'plaintext';
      const label = requested || 'text';

      let highlighted: string;
      try {
        highlighted = hljs.highlight(text, { language }).value;
      } catch {
        highlighted = escapeHtml(text);
      }

      const lineCount = text.replace(/\n$/, '').split('\n').length;
      const gutter = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');
      const safeLabel = escapeHtml(label);

      return (
        `<figure class="cb" data-lang="${safeLabel}">` +
        `<figcaption class="cb__bar"><span class="cb__lang">${safeLabel}</span>` +
        `<button type="button" class="cb__copy" aria-label="Copy code">` +
        `<svg class="cb__copy-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
        `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>` +
        `<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>` +
        `</svg><span class="cb__copy-label">Copy</span></button></figcaption>` +
        `<div class="cb__main"><pre class="cb__gutter" aria-hidden="true">${gutter}</pre>` +
        `<pre class="cb__code"><code class="hljs language-${language}">${highlighted}</code></pre></div>` +
        `</figure>`
      );
    }
  }
});

marked.setOptions({
  gfm: true,
  breaks: false,
});

// Parse markdown to HTML with syntax highlighting
export function parseMarkdown(markdown: string): string {
  const html = marked.parse(markdown) as string;
  return html
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, '</table></div>');
}

// Parse a single line of markdown without wrapping it in a <p> (inline only).
// Fenced code blocks are not handled here — use parseMarkdown for block content.
export function parseInlineMarkdown(markdown: string): string {
  if (!markdown) return '';
  return marked.parseInline(markdown) as string;
}

/**
 * Render short rich text used in quizzes (prompts, options, explanations).
 * Supports inline `code` and fenced ```lang ... ``` blocks, rendered with the
 * exact same syntax-highlighted `.cb` code-block component as lesson markdown.
 * A single wrapping paragraph is unwrapped so inline-only strings stay clean.
 */
export function renderQuizRichText(text: string): string {
  if (!text) return '';
  if (!text.includes('```')) return parseInlineMarkdown(text);
  const html = parseMarkdown(text).trim();
  const single = html.match(/^<p>([\s\S]*?)<\/p>$/);
  if (single && !single[1].includes('<p') && !single[1].includes('<figure')) {
    return single[1];
  }
  return html;
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
