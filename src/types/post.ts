// ──── Site Config ────
export interface NavItem {
  label: string;
  path: string;
}

export interface SiteConfig {
  site: {
    title: string;
    description: string;
    author: string;
    url: string;
    logo?: string;
  };
  navigation: NavItem[];
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// ──── Blog ────
export interface BlogIndex {
  title: string;
  description: string;
  postsPerPage: number;
  featured: string[];
}

export interface PostMeta {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
  image?: string;
  draft: boolean;
}

export interface Post extends PostMeta {
  slug: string;
  content: string;
  htmlContent: string;
}

// ──── Courses ────
export interface CoursesIndex {
  title: string;
  description: string;
  featured: string[];
}

export interface LessonMeta {
  slug: string;
  title: string;
  type: 'text' | 'video' | 'interactive';
  duration: string;
  videoUrl?: string;
}

export interface ModuleMeta {
  title: string;
  description: string;
  lessons: LessonMeta[];
}

export interface CourseModuleRef {
  slug: string;
  title: string;
}

export interface CourseMeta {
  title: string;
  description: string;
  author: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  image?: string;
  tags: string[];
  modules: CourseModuleRef[];
  draft: boolean;
}

export interface Lesson {
  slug: string;
  title: string;
  type: string;
  duration: string;
  videoUrl?: string;
  content: string;
  htmlContent: string;
  courseSlug: string;
  moduleSlug: string;
}

export interface CourseModule {
  slug: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course extends CourseMeta {
  slug: string;
  resolvedModules: CourseModule[];
  totalLessons: number;
}

// ──── Docs ────
export interface DocsCategory {
  slug: string;
  title: string;
  icon: string;
}

export interface DocsIndex {
  title: string;
  description: string;
  categories: DocsCategory[];
}

export interface DocSidebarItem {
  slug: string;
  title: string;
}

export interface DocProjectMeta {
  title: string;
  description: string;
  version: string;
  sidebar: DocSidebarItem[];
}

export interface DocPage {
  slug: string;
  title: string;
  content: string;
  htmlContent: string;
  projectSlug: string;
}

export interface DocProject extends DocProjectMeta {
  slug: string;
  pages: DocPage[];
}
