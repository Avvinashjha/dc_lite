// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';

/**
 * @param {string} value
 */
function slugifyTaxonomy(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * Redirect-only routes emit `<meta name="robots" content="noindex">` stubs that
 * point at the canonical page, so they must be kept out of the sitemap.
 * @param {string} page
 */
function isRedirectRoute(page) {
  const pathname = page.startsWith('http') ? new URL(page).pathname : page;
  return (
    /^\/daily-problems(\/|$)/.test(pathname) ||
    /^\/daily\/problem(\/|$)/.test(pathname) ||
    // Community quiz player is a client-rendered, noindex route.
    /^\/quiz\/play(\/|$)/.test(pathname)
  );
}

/**
 * @param {string} page
 */
function isCanonicalTaxonomyPath(page) {
  const pathname = page.startsWith('http') ? new URL(page).pathname : page;
  const tagMatch = pathname.match(/^\/blog\/tag\/([^/]+)\/$/);
  if (tagMatch) {
    const current = decodeURIComponent(tagMatch[1]);
    return current === slugifyTaxonomy(current);
  }

  const categoryMatch = pathname.match(/^\/blog\/category\/([^/]+)\/$/);
  if (categoryMatch) {
    const current = decodeURIComponent(categoryMatch[1]);
    return current === slugifyTaxonomy(current);
  }

  return true;
}

// https://astro.build/config
export default defineConfig({
  site: 'https://dailycoder.in',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !isRedirectRoute(page) &&
        isCanonicalTaxonomyPath(page),
    }),
    preact(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});
