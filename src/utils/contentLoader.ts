import fs from 'node:fs';
import path from 'node:path';
import { parseMarkdown } from './markdown';
import type {
  SiteConfig, BlogIndex, PostMeta, Post,
  CoursesIndex, CourseMeta, ModuleMeta, CourseModule, Course, Lesson,
  DocsIndex, DocProjectMeta, DocProject, DocPage,
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
