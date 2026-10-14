# DevContent - Blog, Courses & Documentation Platform

A scalable, high-performance content platform built with **Astro**, featuring blog posts, interactive courses, and documentation. Hosted on **GitHub Pages** with custom domain support, using your public repo as unlimited free storage.

## Features

- **School preview**: A separate `/school` area for Classes 1–12 with class-based lessons, games, beginner coding, quizzes, and subject checks. See [School scope and roadmap](docs/school.md) for current coverage and the planned Ask service.
- **Blog**: Full blog with tags, categories, search, RSS feed
- **Courses**: Interactive courses with modules, lessons, embedded videos, quizzes, and exercises
- **Documentation**: Project docs and tech guides with sidebar navigation
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, JSON-LD, sitemap
- **Full-Text Search**: Client-side search powered by Pagefind
- **Dark Mode & Reading Mode**: Toggle themes for comfortable reading
- **Zero Backend**: Fully static, hosted on GitHub Pages for free
- **Markdown Content**: Easy to write and edit, even on GitHub's web interface

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Content Structure

All content lives in the `content/` directory:

```
content/
├── config.json                     # Site-wide configuration
├── blog/
│   ├── _index.json                 # Blog settings
│   └── post-slug/
│       ├── meta.json               # Post metadata
│       └── content.md              # Post content (Markdown)
├── courses/
│   ├── _index.json                 # Courses settings
│   └── course-slug/
│       ├── meta.json               # Course metadata + module list
│       └── module-slug/
│           ├── meta.json           # Module metadata + lesson list
│           └── lesson-slug.md      # Lesson content
└── docs/
    ├── _index.json                 # Docs settings
    └── project-slug/
        ├── meta.json               # Project metadata + sidebar
        └── page-slug.md            # Doc page content
```

## Adding Content

### Blog Post

```bash
npm run new-post
```

Or manually create `content/blog/my-post/meta.json` + `content/blog/my-post/content.md`.

### Course

Create `content/courses/my-course/meta.json`, then add module directories with lessons.

### Documentation

Create `content/docs/my-project/meta.json`, then add `.md` files referenced in the sidebar.

### Validate Content

```bash
npm run validate
```

## Deployment

### GitHub Pages with Custom Domain

1. Push to GitHub
2. Go to repo Settings > Pages > Source: GitHub Actions
3. Add custom domain in Pages settings
4. Update `public/CNAME` with your domain
5. Update `astro.config.mjs` with your site URL

Auto-deploys on every push to `main`.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview build
npm run new-post     # Create new blog post
npm run validate     # Validate posts
npm run validate:problems # Audit problems, execute solutions, and check the runner
```

## Customization

- **Site Config**: `content/config.json` (title, navigation, social links)
- **Styling**: `src/styles/global.scss` (CSS variables, typography)
- **Layouts**: `src/layouts/` (BaseLayout, PostLayout, LessonLayout, DocLayout)

## Comments + Newsletter (Google Sheets)

This project supports:
- Blog comment submissions
- Email subscriptions
- Update broadcasts to subscribers

Use setup instructions in:
- `scripts/google-sheet-setup.js`

Then set your web app URL in:
- `content/config.json`
  - `newsletter.googleScriptUrl`
  - `comments.googleScriptUrl`

---

Built with [Astro](https://astro.build)

Problem pages load `meta.json`, `description.md`, and `solution.md` from each directory in `content/problems`. Keep examples synchronized with their corresponding test fixtures; Example 1 is executed by Run Sample. Node fixtures and judging rules are configured through `runner` in the metadata. `npm run build` runs the complete problem validation suite before generating the site. To export a per-problem validation report, run `node scripts/audit-problems.mjs --report /tmp/problem-content-audit.json` or `node scripts/verify-problem-solutions.mjs --report /tmp/problem-solution-audit.json`.
