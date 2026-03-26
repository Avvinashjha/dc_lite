import rss from '@astrojs/rss';
import { getDailyProblems } from '../../../utils/contentLoader';

export function GET(context) {
  const items = getDailyProblems()
    .slice()
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));

  return rss({
    title: 'DailyCoder Daily Challenge',
    description: 'A daily coding challenge feed with archive access.',
    site: context.site,
    items: items.map((problem) => ({
      title: `Daily Challenge: ${problem.title}`,
      description: `${problem.difficulty} · ${problem.topic} · ${problem.platform}`,
      link: `/daily/problem/${problem.slug}/`,
      pubDate: new Date(problem.publishedAt || new Date().toISOString().slice(0, 10)),
      categories: [problem.difficulty, problem.topic, problem.dailyTrack || 'dsa', ...(problem.topics || [])],
    })),
    customData: '<language>en-us</language>',
  });
}
