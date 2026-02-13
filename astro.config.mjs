// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
      filter: (page) => !page.includes('/404') && isCanonicalTaxonomyPath(page),
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});
