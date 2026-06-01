import fs from 'node:fs';
import path from 'node:path';
import { parseMarkdown } from './markdown';
import type {
  SiteConfig, BlogIndex, PostMeta, Post,
  CoursesIndex, CourseMeta, ModuleMeta, CourseModule, Course, Lesson,
  DocsIndex, DocProjectMeta, DocProject, DocPage,
  ProblemIndex, ProblemMeta, ProblemListItem, ProblemItem,
} from '../types/post';

const CONTENT_DIR = path.resolve(process.cwd(), 'content');

// ──── Helpers ────

function readJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function readMd(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

function getDirs(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function normalizeDayKey(value?: string): string | null {
  if (!value) return null;
  const key = value.trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(key) ? key : null;
}

function normalizeProblemMeta(meta: ProblemMeta): ProblemMeta {
  return {
    ...meta,
    topics: Array.isArray(meta.topics) && meta.topics.length ? meta.topics : [meta.topic].filter(Boolean),
    examples: Array.isArray(meta.examples) ? meta.examples : [],
    constraints: Array.isArray(meta.constraints) ? meta.constraints : (meta.constraints ? [meta.constraints] : []),
    visuals: Array.isArray(meta.visuals) ? meta.visuals : [],
    solutionVisuals: Array.isArray(meta.solutionVisuals) ? meta.solutionVisuals : [],
    dailyTrack: meta.dailyTrack,
  };
}

// ──── Site Config ────

export function getSiteConfig(): SiteConfig {
  return readJson<SiteConfig>(path.join(CONTENT_DIR, 'config.json'));
}

// ──── Blog ────

export function getBlogIndex(): BlogIndex {
  return readJson<BlogIndex>(path.join(CONTENT_DIR, 'blog', '_index.json'));
}

export function getBlogPosts(): Post[] {
  const blogDir = path.join(CONTENT_DIR, 'blog');
  const slugs = getDirs(blogDir);

  return slugs.map(slug => {
    const metaPath = path.join(blogDir, slug, 'meta.json');
    const contentPath = path.join(blogDir, slug, 'content.md');

    if (!fs.existsSync(metaPath) || !fs.existsSync(contentPath)) return null;

    const meta = readJson<PostMeta>(metaPath);
    if (meta.draft) return null;

    const content = readMd(contentPath);
    const htmlContent = parseMarkdown(content);

    return { ...meta, slug, content, htmlContent } as Post;
  }).filter(Boolean) as Post[];
}

export function getBlogPostsSorted(): Post[] {
  return getBlogPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogPost(slug: string): Post | null {
  const blogDir = path.join(CONTENT_DIR, 'blog');
  const metaPath = path.join(blogDir, slug, 'meta.json');
  const contentPath = path.join(blogDir, slug, 'content.md');

  if (!fs.existsSync(metaPath) || !fs.existsSync(contentPath)) return null;

  const meta = readJson<PostMeta>(metaPath);
  const content = readMd(contentPath);
  const htmlContent = parseMarkdown(content);

  return { ...meta, slug, content, htmlContent };
}

export function getAllTags(): string[] {
  const posts = getBlogPosts();
  return [...new Set(posts.flatMap(p => p.tags))].sort();
}

export function getAllCategories(): string[] {
  const posts = getBlogPosts();
  return [...new Set(posts.map(p => p.category))].sort();
}

// ──── Courses ────

export function getCoursesIndex(): CoursesIndex {
  return readJson<CoursesIndex>(path.join(CONTENT_DIR, 'courses', '_index.json'));
}

export function getCourses(): Course[] {
  const coursesDir = path.join(CONTENT_DIR, 'courses');
  const slugs = getDirs(coursesDir);

  return slugs.map(slug => getCourse(slug)).filter(Boolean) as Course[];
}

export function getCourse(slug: string): Course | null {
  const courseDir = path.join(CONTENT_DIR, 'courses', slug);
  const metaPath = path.join(courseDir, 'meta.json');

  if (!fs.existsSync(metaPath)) return null;

  const meta = readJson<CourseMeta>(metaPath);
  if (meta.draft) return null;

  const resolvedModules: CourseModule[] = meta.modules.map(modRef => {
    const modDir = path.join(courseDir, modRef.slug);
    const modMetaPath = path.join(modDir, 'meta.json');

    if (!fs.existsSync(modMetaPath)) {
      return { slug: modRef.slug, title: modRef.title, description: '', lessons: [] };
    }

    const modMeta = readJson<ModuleMeta>(modMetaPath);

    const lessons: Lesson[] = modMeta.lessons.map(lessonMeta => {
      const lessonPath = path.join(modDir, `${lessonMeta.slug}.md`);
      const content = fs.existsSync(lessonPath) ? readMd(lessonPath) : '';
      const htmlContent = parseMarkdown(content);

      return {
        ...lessonMeta,
        content,
        htmlContent,
        courseSlug: slug,
        moduleSlug: modRef.slug,
      };
    });

    return { slug: modRef.slug, title: modMeta.title, description: modMeta.description, lessons };
  });

  const totalLessons = resolvedModules.reduce((sum, m) => sum + m.lessons.length, 0);

  return { ...meta, slug, resolvedModules, totalLessons };
}

export function getLesson(courseSlug: string, moduleSlug: string, lessonSlug: string): Lesson | null {
  const course = getCourse(courseSlug);
  if (!course) return null;
  const mod = course.resolvedModules.find(m => m.slug === moduleSlug);
  if (!mod) return null;
  return mod.lessons.find(l => l.slug === lessonSlug) || null;
}

// ──── Docs ────

export function getDocsIndex(): DocsIndex {
  return readJson<DocsIndex>(path.join(CONTENT_DIR, 'docs', '_index.json'));
}

export function getDocProjects(): DocProject[] {
  const docsDir = path.join(CONTENT_DIR, 'docs');
  const slugs = getDirs(docsDir);
  return slugs.map(slug => getDocProject(slug)).filter(Boolean) as DocProject[];
}

export function getDocProject(slug: string): DocProject | null {
  const projectDir = path.join(CONTENT_DIR, 'docs', slug);
  const metaPath = path.join(projectDir, 'meta.json');

  if (!fs.existsSync(metaPath)) return null;

  const meta = readJson<DocProjectMeta>(metaPath);

  const pages: DocPage[] = meta.sidebar.map(item => {
    const pagePath = path.join(projectDir, `${item.slug}.md`);
    const content = fs.existsSync(pagePath) ? readMd(pagePath) : '';
    const htmlContent = parseMarkdown(content);

    return {
      slug: item.slug,
      title: item.title,
      content,
      htmlContent,
      projectSlug: slug,
    };
  });

  return { ...meta, slug, pages };
}

export function getDocPage(projectSlug: string, pageSlug: string): DocPage | null {
  const project = getDocProject(projectSlug);
  if (!project) return null;
  return project.pages.find(p => p.slug === pageSlug) || null;
}

// ──── Problems ────

export function getProblemsIndex(): ProblemIndex {
  return readJson<ProblemIndex>(path.join(CONTENT_DIR, 'problems', '_index.json'));
}

export function getProblems(): ProblemListItem[] {
  const problemsDir = path.join(CONTENT_DIR, 'problems');
  const slugs = getDirs(problemsDir);

  return slugs.map(slug => {
    const metaPath = path.join(problemsDir, slug, 'meta.json');
    if (!fs.existsSync(metaPath)) return null;
    const meta = normalizeProblemMeta(readJson<ProblemMeta>(metaPath));
    if (meta.draft) return null;
    return { ...meta, slug } as ProblemListItem;
  }).filter(Boolean) as ProblemListItem[];
}

export function getProblem(slug: string): ProblemItem | null {
  const problemsDir = path.join(CONTENT_DIR, 'problems');
  const metaPath = path.join(problemsDir, slug, 'meta.json');
  if (!fs.existsSync(metaPath)) return null;

  const meta = normalizeProblemMeta(readJson<ProblemMeta>(metaPath));
  const descPath = path.join(problemsDir, slug, 'description.md');
  const solPath = path.join(problemsDir, slug, 'solution.md');

  const descriptionHtml = fs.existsSync(descPath)
    ? parseMarkdown(readMd(descPath))
    : '<p>Description coming soon.</p>';
  const solutionHtml = fs.existsSync(solPath)
    ? parseMarkdown(readMd(solPath))
    : '<p>Solution coming soon.</p>';

  return { ...meta, slug, descriptionHtml, solutionHtml };
}

export function getProblemTopics(): string[] {
  return [...new Set(getProblems().flatMap(p => p.topics?.length ? p.topics : [p.topic]))].sort();
}

export function getProblemDifficulties(): string[] {
  return [...new Set(getProblems().map(p => p.difficulty))].sort();
}

export function getProblemSets(): string[] {
  return [...new Set(getProblems().map(p => p.problemSet).filter(Boolean) as string[])].sort();
}

export function getProblemsByTopic(topic: string): ProblemListItem[] {
  const t = topic.toLowerCase();
  return getProblems().filter(p => {
    const topics = p.topics?.length ? p.topics : [p.topic];
    return topics.some(tp => tp.toLowerCase() === t);
  });
}

export function getProblemsByDifficulty(difficulty: string): ProblemListItem[] {
  const d = difficulty.toLowerCase();
  return getProblems().filter(p => p.difficulty.toLowerCase() === d);
}

export function getProblemsBySet(setId: string): ProblemListItem[] {
  return getProblems().filter(p => p.problemSet === setId);
}

// ─── Daily schedule (catalog POTD) ───

export interface DailyScheduleEntry {
  date: string;
  slug: string;
}

export interface DailyScheduleFile {
  entries: DailyScheduleEntry[];
}

let _validatedScheduleEntries: DailyScheduleEntry[] | null = null;

function loadValidatedScheduleEntries(): DailyScheduleEntry[] {
  if (_validatedScheduleEntries) return _validatedScheduleEntries;
  const schedulePath = path.join(CONTENT_DIR, 'daily-schedule.json');
  if (!fs.existsSync(schedulePath)) {
    _validatedScheduleEntries = [];
    return _validatedScheduleEntries;
  }
  const file = readJson<DailyScheduleFile>(schedulePath);
  const entries = Array.isArray(file.entries) ? file.entries : [];
  const seenDates = new Set<string>();
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const catalogSlugs = new Set(getProblems().map((p) => p.slug));

  for (const e of sorted) {
    const dk = normalizeDayKey(e.date);
    if (!dk) throw new Error(`daily-schedule.json: invalid date "${e.date}"`);
    if (seenDates.has(dk)) throw new Error(`daily-schedule.json: duplicate date "${dk}"`);
    seenDates.add(dk);
    if (!e.slug || typeof e.slug !== 'string') throw new Error(`daily-schedule.json: missing slug for ${dk}`);
    if (!catalogSlugs.has(e.slug)) {
      throw new Error(`daily-schedule.json: unknown slug "${e.slug}" on ${dk} (not in problems catalog)`);
    }
  }

  _validatedScheduleEntries = sorted;
  return _validatedScheduleEntries;
}

/** Raw schedule rows (sorted by date ascending). Validates slugs against catalog at first call. */
export function getDailyScheduleEntries(): DailyScheduleEntry[] {
  return loadValidatedScheduleEntries();
}

/** Unique slugs that appear anywhere on the schedule (for editor POTD UX). */
export function getAllPotdScheduledSlugs(): string[] {
  const seen = new Set<string>();
  for (const e of loadValidatedScheduleEntries()) {
    seen.add(e.slug);
  }
  return [...seen];
}

export function problemSlugHasPotdSchedule(slug: string): boolean {
  return loadValidatedScheduleEntries().some((e) => e.slug === slug);
}

/** Latest calendar date this slug appears on the POTD schedule (for analytics / display). */
export function getLatestPotdScheduleDateForSlug(slug: string): string | null {
  const dates = loadValidatedScheduleEntries()
    .filter((e) => e.slug === slug)
    .map((e) => normalizeDayKey(e.date))
    .filter(Boolean) as string[];
  if (!dates.length) return null;
  return dates.sort().slice(-1)[0] ?? null;
}

function withScheduleDate(problem: ProblemListItem, scheduleDate: string): ProblemListItem {
  const dk = normalizeDayKey(scheduleDate)!;
  return {
    ...problem,
    publishedAt: dk,
    dailyTrack: problem.dailyTrack || 'dsa',
  };
}

/**
 * Problems that have been POTD through `today` (schedule date ≤ today), newest schedule date first.
 * Each item has `publishedAt` set to the schedule row date (for streak / consistency scoring).
 */
export function getDailyProblems(today = new Date()): ProblemListItem[] {
  const todayKey = toDayKey(today);
  const bySlug = new Map(getProblems().map((p) => [p.slug, p]));
  const out: ProblemListItem[] = [];
  for (const { date, slug } of loadValidatedScheduleEntries()) {
    const dk = normalizeDayKey(date)!;
    if (dk > todayKey) continue;
    const p = bySlug.get(slug);
    if (!p) continue;
    out.push(withScheduleDate(p, date));
  }
  return out.sort((a, b) => {
    const aKey = normalizeDayKey(a.publishedAt) || '';
    const bKey = normalizeDayKey(b.publishedAt) || '';
    return bKey.localeCompare(aKey) || a.title.localeCompare(b.title);
  });
}

export function getPastDailyProblems(today = new Date()): ProblemListItem[] {
  const todayKey = toDayKey(today);
  return getDailyProblems(today).filter(
    (problem) => (normalizeDayKey(problem.publishedAt) || '') < todayKey
  );
}

export function getTodaysProblem(today = new Date()): ProblemListItem | null {
  const todayKey = toDayKey(today);
  const bySlug = new Map(getProblems().map((p) => [p.slug, p]));
  for (const { date, slug } of loadValidatedScheduleEntries()) {
    if (normalizeDayKey(date) !== todayKey) continue;
    const p = bySlug.get(slug);
    return p ? withScheduleDate(p, date) : null;
  }
  return null;
}

export interface DailyScheduleLiteRow {
  slug: string;
  title: string;
  topic: string;
  difficulty: string;
  publishedAt: string;
  heroImageUrl?: string;
}

/** Full schedule JSON for client-side “effective today” (includes future-dated rows). */
export function getDailyScheduleFullLite(): DailyScheduleLiteRow[] {
  const bySlug = new Map(getProblems().map((p) => [p.slug, p]));
  const out: DailyScheduleLiteRow[] = [];
  for (const { date, slug } of loadValidatedScheduleEntries()) {
    const p = bySlug.get(slug);
    if (!p) continue;
    const dk = normalizeDayKey(date)!;
    const wp = withScheduleDate(p, date);
    out.push({
      slug: wp.slug,
      title: wp.title,
      topic: wp.topic,
      difficulty: wp.difficulty,
      publishedAt: dk,
      heroImageUrl: wp.visuals?.[0]?.imageUrl,
    });
  }
  return out.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
