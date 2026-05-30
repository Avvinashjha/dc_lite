import { ALL_TOOLS, type ToolEntry } from '../data/tools';
import { getBlogPostsSorted } from './contentLoader';
import type { Post } from '../types/post';

const STOP = new Set([
  'the', 'a', 'an', 'and', 'or', 'for', 'to', 'of', 'with', 'in', 'on', 'your', 'you',
  'online', 'free', 'tool', 'tools', 'dailycoder', 'how', 'what', 'why', 'guide', 'using',
  'use', 'into', 'from', 'this', 'that', 'are', 'is', 'it', 'its',
]);

function tokenize(s: string): string[] {
  const matches = (s || '').toLowerCase().match(/[a-z0-9]+/g) || [];
  return matches.filter((w) => w.length > 2 && !STOP.has(w));
}

function tokenSet(...parts: (string | undefined)[]): Set<string> {
  const set = new Set<string>();
  for (const part of parts) {
    for (const tok of tokenize(part || '')) set.add(tok);
  }
  return set;
}

function overlap(a: Set<string>, b: Set<string>): number {
  let score = 0;
  for (const t of a) if (b.has(t)) score++;
  return score;
}

const POPULAR_TOOL_HREFS = [
  '/tools/json-formatter',
  '/tools/regex-tester',
  '/tools/diff-checker',
  '/tools/code-formatter',
  '/tools/jwt-decoder',
];

function fillTo<T>(current: T[], pool: T[], n: number): T[] {
  const result = [...current];
  for (const item of pool) {
    if (result.length >= n) break;
    if (!result.includes(item)) result.push(item);
  }
  return result.slice(0, n);
}

/** Tools in the same category as the current tool, then filled from the rest. */
export function getRelatedTools(currentHref: string, n = 4): (ToolEntry & { category: string })[] {
  const cleaned = currentHref.replace(/\/+$/, '');
  const current = ALL_TOOLS.find((t) => t.href === cleaned);
  const sameCat = ALL_TOOLS.filter((t) => t.href !== cleaned && current && t.category === current.category);
  const others = ALL_TOOLS.filter((t) => t.href !== cleaned && (!current || t.category !== current.category));
  return [...sameCat, ...others].slice(0, n);
}

/** Tools most relevant to a blog post (keyword overlap), filled with popular tools. */
export function getToolsForPost(
  post: { title: string; tags?: string[]; category?: string },
  n = 3
): (ToolEntry & { category: string })[] {
  const postTokens = tokenSet(post.title, (post.tags || []).join(' '), post.category);
  const scored = ALL_TOOLS.map((t) => ({
    tool: t,
    score: overlap(tokenSet(t.name, t.desc), postTokens),
  })).sort((a, b) => b.score - a.score);

  const matched = scored.filter((s) => s.score > 0).map((s) => s.tool);
  const popular = POPULAR_TOOL_HREFS
    .map((h) => ALL_TOOLS.find((t) => t.href === h))
    .filter(Boolean) as (ToolEntry & { category: string })[];
  return fillTo(matched, popular.concat(ALL_TOOLS), n);
}

/** Blog posts most relevant to a tool (keyword overlap), filled with recent posts. */
export function getPostsForTool(tool: { name: string; desc: string }, n = 3): Post[] {
  const toolTokens = tokenSet(tool.name, tool.desc);
  const posts = getBlogPostsSorted();
  const scored = posts.map((p) => ({
    post: p,
    score: overlap(tokenSet(p.title, (p.tags || []).join(' '), p.category), toolTokens),
  })).sort((a, b) => b.score - a.score);

  const matched = scored.filter((s) => s.score > 0).map((s) => s.post);
  return fillTo(matched, posts, n);
}
