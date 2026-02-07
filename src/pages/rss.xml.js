import rss from '@astrojs/rss';
import { getBlogPostsSorted } from '../utils/contentLoader';

export function GET(context) {
  const posts = getBlogPostsSorted();

  return rss({
    title: 'DevContent',
    description: 'Blog, courses, and documentation for modern web development.',
    site: context.site,
    items: posts.map(post => ({
      title: post.title,
      description: post.description,
      link: `/blog/${post.slug}/`,
      pubDate: new Date(post.date),
      author: post.author,
      categories: [post.category, ...post.tags],
    })),
    customData: `<language>en-us</language>`,
  });
}
