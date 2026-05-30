import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getBlogPosts, getProblems, getSiteConfig } from './contentLoader';
import { getQuizzes } from './quizLoader';
import { ALL_TOOLS } from '../data/tools';

export interface OgEntry {
  /** Path-style slug, e.g. "blog/getting-started-with-astro" or "tools/json-formatter". */
  slug: string;
  title: string;
  description: string;
  tag: string;
}

const WIDTH = 1200;
const HEIGHT = 630;

function clamp(value: string, max: number): string {
  const v = (value || '').trim();
  return v.length > max ? v.slice(0, max - 1).trimEnd() + '…' : v;
}

/**
 * All pages that get a build-time Open Graph image. The endpoint enumerates
 * these for getStaticPaths; BaseLayout uses the same list to map a page to its
 * generated image (falling back to /og/default.png otherwise).
 */
let _entriesCache: OgEntry[] | null = null;
let _slugSetCache: Set<string> | null = null;

export function getOgEntries(): OgEntry[] {
  if (_entriesCache) return _entriesCache;
  const config = getSiteConfig();
  const entries: OgEntry[] = [
    {
      slug: 'default',
      title: config.site.title,
      description: config.site.description,
      tag: 'dailycoder.in',
    },
  ];

  for (const tool of ALL_TOOLS) {
    const id = tool.href.replace(/^\/+/, '');
    entries.push({
      slug: id,
      title: tool.name,
      description: tool.desc,
      tag: 'Developer Tool',
    });
  }

  for (const post of getBlogPosts()) {
    entries.push({
      slug: `blog/${post.slug}`,
      title: post.title,
      description: post.description || '',
      tag: post.category || 'Blog',
    });
  }

  for (const problem of getProblems()) {
    const topic = problem.topics?.[0] || problem.topic || 'Problem';
    entries.push({
      slug: `problems/${problem.slug}`,
      title: problem.title,
      description: `A ${problem.difficulty} ${topic} coding problem you can solve in the browser with an integrated editor and test cases.`,
      tag: `${problem.difficulty} · ${topic}`,
    });
  }

  for (const quiz of getQuizzes()) {
    entries.push({
      slug: `quiz/${quiz.slug}`,
      title: quiz.title,
      description: quiz.description || `A ${quiz.difficulty} ${quiz.category} quiz with ${quiz.questions.length} questions.`,
      tag: `${quiz.difficulty} · ${quiz.category} Quiz`,
    });
  }

  _entriesCache = entries;
  return entries;
}

/** Set of slugs that have a generated OG image (used by BaseLayout to map a page to its image). */
export function getOgSlugSet(): Set<string> {
  if (!_slugSetCache) {
    _slugSetCache = new Set(getOgEntries().map((e) => e.slug));
  }
  return _slugSetCache;
}

/** Resolve the OG image path for a page pathname, falling back to the default image. */
export function ogImageForPath(pathname: string): string {
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  const slugSet = getOgSlugSet();
  if (slug && slugSet.has(slug)) return `/og/${slug}.png`;
  return '/og/default.png';
}

// ──── Font loading (build-time, cached) ────

const FONT_URLS = {
  regular: 'https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-400-normal.woff',
  bold: 'https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files/inter-latin-700-normal.woff',
};

let _fontsPromise: Promise<{ name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }[]> | null = null;

async function loadFonts() {
  if (!_fontsPromise) {
    _fontsPromise = (async () => {
      const [reg, bold] = await Promise.all([fetch(FONT_URLS.regular), fetch(FONT_URLS.bold)]);
      if (!reg.ok || !bold.ok) throw new Error(`OG font fetch failed (${reg.status}/${bold.status})`);
      return [
        { name: 'Inter', data: await reg.arrayBuffer(), weight: 400 as const, style: 'normal' as const },
        { name: 'Inter', data: await bold.arrayBuffer(), weight: 700 as const, style: 'normal' as const },
      ];
    })();
  }
  return _fontsPromise;
}

// ──── Rendering ────

function buildTree(entry: OgEntry) {
  const title = clamp(entry.title, 95);
  const description = clamp(entry.description, 155);

  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '70px',
        backgroundColor: '#0b1120',
        backgroundImage: 'linear-gradient(135deg, #0b1120 0%, #111c33 55%, #1e293b 100%)',
        color: '#f8fafc',
        fontFamily: 'Inter',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center' },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '64px',
                          height: '64px',
                          borderRadius: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                          fontSize: '34px',
                          fontWeight: 700,
                          color: '#ffffff',
                          marginRight: '22px',
                        },
                        children: '{ }',
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: { fontSize: '34px', fontWeight: 700, letterSpacing: '-0.5px' },
                        children: 'DailyCoder',
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#93c5fd',
                    border: '2px solid #1e3a8a',
                    backgroundColor: 'rgba(37,99,235,0.15)',
                    borderRadius: '999px',
                    padding: '10px 26px',
                  },
                  children: entry.tag,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column' },
            children: [
              {
                type: 'div',
                props: {
                  style: { fontSize: '64px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px' },
                  children: title,
                },
              },
              description
                ? {
                    type: 'div',
                    props: {
                      style: { marginTop: '26px', fontSize: '30px', lineHeight: 1.4, color: '#cbd5e1' },
                      children: description,
                    },
                  }
                : { type: 'div', props: { children: '' } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', fontSize: '26px', fontWeight: 700, color: '#94a3b8' },
            children: 'dailycoder.in',
          },
        },
      ],
    },
  } as any;
}

function escapeXml(value: string): string {
  return (value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Minimal hand-built SVG used only if web fonts can't be fetched at build time. */
function buildFallbackSvg(entry: OgEntry): string {
  const title = escapeXml(clamp(entry.title, 70));
  const description = escapeXml(clamp(entry.description, 120));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1120"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <text x="70" y="120" font-family="sans-serif" font-size="34" font-weight="700" fill="#f8fafc">DailyCoder</text>
  <text x="70" y="340" font-family="sans-serif" font-size="64" font-weight="700" fill="#f8fafc">${title}</text>
  <text x="70" y="410" font-family="sans-serif" font-size="30" fill="#cbd5e1">${description}</text>
  <text x="70" y="570" font-family="sans-serif" font-size="26" font-weight="700" fill="#94a3b8">dailycoder.in</text>
</svg>`;
}

export async function renderOgPng(entry: OgEntry): Promise<Buffer> {
  let svg: string;
  try {
    const fonts = await loadFonts();
    svg = await satori(buildTree(entry), { width: WIDTH, height: HEIGHT, fonts });
  } catch (err) {
    console.warn(`[og] satori/font rendering failed for "${entry.slug}", using system-font fallback:`, err);
    svg = buildFallbackSvg(entry);
  }
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  return resvg.render().asPng();
}
