**Vinext** (pronounced "vee-next") is a drop-in replacement for Next.js that reimplements the Next.js API surface on top of Vite. Built by Cloudflare and announced in February 2026, it lets you keep your existing Next.js app structure while gaining faster builds, smaller bundles, and one-command deployment to Cloudflare Workers. In this post we cover what Vinext is, the project idea behind it, why it exists, who built it and how, getting started, and how to migrate from Next.js.

## What Is Vinext?

Vinext is a Vite plugin that reimplements the Next.js public API from scratch. It is not a wrapper around Next.js or Turbopack output. Instead, it provides the same API surface: routing, server rendering, React Server Components, server actions, caching, middleware. All of it built on top of Vite as a plugin.

Your existing `app/`, `pages/`, and `next.config.js` work as-is. Vinext uses 33 shim modules that intercept `next/*` imports and redirect them to Vinext implementations, so you typically do not need to change any application code.

**In short:** Replace `next` with `vinext` in your scripts and everything else stays the same.

## The Project Idea: Why Vinext Exists

### The Next.js Deployment Problem

Next.js is the most popular React framework. But its deployment story outside Vercel is limited. The tooling is bespoke: Next.js uses Turbopack, and if you want to deploy to Cloudflare Workers, Netlify, or AWS Lambda, you have to take the build output and reshape it into something the target platform can run.

**OpenNext** was built to solve this. It wraps Next.js output and adapts it for other platforms. But it has to reverse-engineer Next.js's build output, which leads to fragility when Next.js versions change. OpenNext becomes a game of whack-a-mole.

### The Vinext Approach

**What if instead of adapting Next.js output, we reimplemented the Next.js API surface on Vite directly?**

Vite is the build tool used by most of the front-end ecosystem outside Next.js (Astro, SvelteKit, Nuxt, Remix). A clean reimplementation, not a wrapper or adapter. Vite output runs on any platform thanks to the Vite Environment API. Cloudflare tried this approach and got surprisingly far.

The result: Vinext. A drop-in replacement that requires no code changes, builds faster, produces smaller bundles, and deploys to Cloudflare Workers in one command.

## Why Vinext?

- **4.4x faster builds** – With Vite 8 and Rolldown (the Rust-based bundler), production builds are 1.67s vs 7.38s for Next.js 16 (on a shared 33-route App Router app).
- **57% smaller bundles** – Client bundle gzipped: 72.9 KB vs 168.9 KB for Next.js 16.
- **94% API coverage** – Supports most of the Next.js 16 API, including App Router, Pages Router, React Server Components, Server Actions, Streaming SSR, ISR, Middleware, and static export.
- **Deploy anywhere** – Built for Cloudflare Workers first, but ~95% of Vinext is pure Vite. The routing, shims, SSR pipeline, and RSC integration are all platform-agnostic. A proof-of-concept was deployed to Vercel in under 30 minutes.
- **No adapter fragility** – Direct implementation of the API surface, not reverse-engineering of Next.js output.

## Who Developed It and How?

Vinext was built by **Cloudflare**. One engineer and an AI model rebuilt the most popular front-end framework from scratch in about one week. The total cost was roughly $1,100 in tokens.

The announcement blog, *"How we rebuilt Next.js with AI in one week"*, was written by Steve Faulkner at Cloudflare. The project is open source on GitHub under the [cloudflare/vinext](https://github.com/cloudflare/vinext) repository.

**How it works:**

- 33 module shims intercept `next/*` imports (e.g. `next/link`, `next/image`, `next/navigation`, `next/server`, `next/headers`, `next/og`) and redirect them to Vinext implementations.
- No import rewrites in your app code.
- Built on top of Vite as a plugin. Uses `@vitejs/plugin-rsc` for React Server Components.
- Over 2,000 tests (Vitest + Playwright E2E), including tests ported from the Next.js test suite and OpenNext's Cloudflare conformance suite.

**Status:** Vinext is experimental and under heavy development. It is not yet battle-tested at scale. Proceed with caution for production applications. That said, early customers (e.g. National Design Studio) are already running it in production.

## Getting Started with Vinext

### Option 1: Automated Migration (Recommended)

```bash
npx vinext init
```

This command:

- Scans for compatibility issues
- Installs dependencies
- Updates your `package.json` scripts
- Generates a minimal Vite config
- Can start the dev server

Your existing Next.js setup keeps working alongside Vinext. The migration is non-destructive.

### Option 2: Manual Migration

```bash
npm install vinext
```

Then replace `next` with `vinext` in your `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vinext dev",
    "build": "vinext build",
    "start": "vinext start"
  }
}
```

Your `app/`, `pages/`, and `next.config.js` work as-is.

### Option 3: AI Agent Skill

If you use Cursor, Claude Code, Codex, or OpenCode:

```bash
npx skills add cloudflare/vinext
```

Then tell your AI: "migrate this project to vinext". The skill handles compatibility checking, dependency installation, config generation, and dev server startup.

### Before Migrating: Check Compatibility

```bash
vinext check
```

This scans your project for compatibility issues before you migrate.

## How to Migrate from Next.js to Vinext

![Migration flow: Next.js to npx vinext init to Vinext on Vite](/blog/introduction-to-vinext/migration-flow.svg)

### Step 1: Run the Check

```bash
npx vinext check
```

Review any reported compatibility issues.

### Step 2: Run the Migration

```bash
npx vinext init
```

This will:

- Install `vinext` and remove or replace `next`
- Update your scripts to use `vinext dev`, `vinext build`, etc.
- Generate a `vite.config.ts` (or equivalent) if needed

### Step 3: Replace Scripts (If Manual)

If you prefer manual migration:

1. `npm install vinext`
2. `npm uninstall next` (or keep it for reference)
3. Update scripts: `"dev": "vinext dev"`, `"build": "vinext build"`
4. Run `vinext dev` and test your app

### Step 4: Deploy to Cloudflare Workers (Optional)

```bash
vinext deploy
```

This builds your app, auto-generates the Worker config, and deploys to Cloudflare Workers in one command.

### What Stays the Same

- `app/` directory and App Router
- `pages/` directory and Pages Router
- `next.config.js` (most options)
- `public/` directory
- All `next/*` imports (e.g. `next/link`, `next/image`, `next/navigation`, `next/server`, `next/headers`, `next/cache`, `next/og`)

### What May Differ

- **Static pre-rendering at build time** – Vinext does not yet support `generateStaticParams()`-style pre-rendering. It supports ISR (Incremental Static Regeneration) out of the box: after the first request, pages are cached and revalidated in the background.
- **Traffic-aware Pre-Rendering (TPR)** – Experimental. Vinext can query Cloudflare zone analytics and pre-render only the pages that get traffic, then cache them to KV. For sites with many pages (e.g. 100,000 product pages), this can mean pre-rendering only the 50–200 pages that cover 90% of traffic.
- **Platform-specific APIs** – Cloudflare bindings (Durable Objects, KV, R2, AI) work in both dev and deploy. No `getPlatformProxy` workarounds.

## Supported Features

- **App Router** – Nested layouts, loading states, error boundaries, parallel routes, intercepting routes
- **Pages Router** – `getStaticProps`, `getServerSideProps`, `getStaticPaths`, `_app`, `_document`
- **React Server Components** – `"use client"` and `"use server"` directives
- **Server Actions** – Form submissions, mutations, `redirect()` inside actions, re-render after mutation
- **Streaming SSR** – For both routers, with RSC payload streaming and Suspense
- **ISR & Caching** – Incremental Static Regeneration, pluggable `CacheHandler`, `"use cache"` with `cacheLife()` and `cacheTag()`
- **Middleware** – `middleware.ts` and `proxy.ts` (Next.js 16), full matcher patterns
- **Static Export** – `output: "export"` generates static HTML/JSON for all routes

## ISR with Cloudflare KV

For production caching on Workers, Vinext includes a built-in KV cache handler:

```javascript
import { KVCacheHandler } from "vinext/cloudflare";
import { setCacheHandler } from "next/cache";

setCacheHandler(new KVCacheHandler(env.KV));
```

The caching layer is pluggable: you can swap in R2 or another backend if needed.

## Conclusion

- Vinext is a drop-in replacement for Next.js that reimplements the Next.js API on Vite.
- Reimplement the API surface instead of wrapping Next.js output, to avoid adapter fragility and enable deployment anywhere.
- 4.4x faster builds, 57% smaller bundles, 94% API coverage, one-command deploy to Cloudflare Workers.
- Cloudflare. One engineer and an AI model rebuilt it in about one week.
- `npx vinext init` or `npm install vinext` + script updates.
- Run `vinext check`, then `npx vinext init`. Your `app/`, `pages/`, and `next.config.js` work as-is.

Vinext is experimental but already in production for some teams. If you want faster builds, smaller bundles, and deployment flexibility on Cloudflare Workers, it is worth trying on a non-critical project first.
