import rss from '@astrojs/rss';
import { getDailyProblems } from '../../../utils/contentLoader';

export function GET(context) {
  const items = getDailyProblems()
    .slice()
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));

  return rss({
    title: 'DailyCoder Daily Challenge',
    description: 'Problem of the day from the catalog—open in the in-browser editor.',
    site: context.site,
    items: items.map((problem) => ({
      title: `Daily: ${problem.title}`,
      description: `${problem.difficulty} · ${problem.topic} · ${problem.platform}`,
      link: `/problems/${problem.slug}/`,
      pubDate: new Date((problem.publishedAt || '') + 'T12:00:00.000Z'),
      categories: [problem.difficulty, problem.topic, problem.dailyTrack || 'dsa', ...(problem.topics || [])],
    })),
    customData: '<language>en-us</language>',
  });
}
