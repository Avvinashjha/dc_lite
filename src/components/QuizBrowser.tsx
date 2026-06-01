import { h, Fragment } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import type { QuizListItem } from '../types/quiz';
import { listCommunityQuizzes, toListItemUrl } from '../lib/quizBrowserHelpers';

interface Props {
  curated: QuizListItem[];
  categories: string[];
}

type RankFilter = 'all' | 'ranked' | 'practice';
type CommunityState = 'idle' | 'loading' | 'ready' | 'unconfigured' | 'error';

function QuizCard({ item }: { item: QuizListItem }) {
  return (
    <a class="quiz-tile" href={toListItemUrl(item)}>
      <div class="quiz-tile__top">
        <span class={`quiz-badge quiz-badge--${item.difficulty}`}>{item.difficulty}</span>
        {item.ranked && <span class="quiz-badge quiz-badge--ranked">Ranked</span>}
        {item.source === 'community' && <span class="quiz-badge quiz-badge--community">Community</span>}
      </div>
      <h3 class="quiz-tile__title">{item.title}</h3>
      <p class="quiz-tile__desc">{item.description}</p>
      <div class="quiz-tile__foot">
        <span class="quiz-badge quiz-badge--neutral">{item.category}</span>
        <span class="quiz-muted">{item.questionCount} questions</span>
      </div>
    </a>
  );
}

export default function QuizBrowser({ curated, categories }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [rank, setRank] = useState<RankFilter>('all');

  const [communityState, setCommunityState] = useState<CommunityState>('idle');
  const [community, setCommunity] = useState<QuizListItem[]>([]);

  useEffect(() => {
    let active = true;
    setCommunityState('loading');
    listCommunityQuizzes().then(res => {
      if (!active) return;
      if (!res.configured) {
        setCommunityState('unconfigured');
        return;
      }
      if (res.error) {
        setCommunityState('error');
        return;
      }
      setCommunity(res.items);
      setCommunityState('ready');
    });
    return () => {
      active = false;
    };
  }, []);

  const allCategories = useMemo(() => {
    const set = new Set<string>(categories);
    community.forEach(c => set.add(c.category));
    return [...set].sort();
  }, [categories, community]);

  const all = useMemo(() => [...curated, ...community], [curated, community]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return all.filter(q => {
      if (term) {
        const hay = `${q.title} ${q.description} ${q.tags.join(' ')} ${q.category}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      if (category !== 'all' && q.category !== category) return false;
      if (difficulty !== 'all' && q.difficulty !== difficulty) return false;
      if (rank === 'ranked' && !q.ranked) return false;
      if (rank === 'practice' && q.ranked) return false;
      return true;
    });
  }, [all, search, category, difficulty, rank]);

  return (
    <div class="quiz-browser">
      <div class="quiz-filters">
        <input
          class="quiz-filters__search"
          type="search"
          placeholder="Search quizzes…"
          value={search}
          onInput={e => setSearch((e.target as HTMLInputElement).value)}
        />
        <select class="quiz-filters__select" value={category} onChange={e => setCategory((e.target as HTMLSelectElement).value)}>
          <option value="all">All categories</option>
          {allCategories.map(c => (
            <option value={c}>{c}</option>
          ))}
        </select>
        <select class="quiz-filters__select" value={difficulty} onChange={e => setDifficulty((e.target as HTMLSelectElement).value)}>
          <option value="all">All difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select class="quiz-filters__select" value={rank} onChange={e => setRank((e.target as HTMLSelectElement).value as RankFilter)}>
          <option value="all">Ranked & practice</option>
          <option value="ranked">Ranked only</option>
          <option value="practice">Practice only</option>
        </select>
      </div>

      <p class="quiz-browser__count quiz-muted">
        {filtered.length} quiz{filtered.length === 1 ? '' : 'zes'}
        {communityState === 'loading' && ' · loading community quizzes…'}
      </p>

      {filtered.length > 0 ? (
        <div class="quiz-grid">
          {filtered.map(item => (
            <QuizCard item={item} />
          ))}
        </div>
      ) : (
        <p class="quiz-muted">No quizzes match your filters.</p>
      )}

      {communityState === 'unconfigured' && (
        <div class="quiz-empty quiz-empty--inline">
          <p class="quiz-empty__title">Community quizzes coming soon</p>
          <p class="quiz-muted">
            The community quiz backend isn’t configured yet, so only curated quizzes are shown. You can still{' '}
            <a href="/quiz/create">build a quiz</a> and export it as JSON.
          </p>
        </div>
      )}
      {communityState === 'error' && (
        <p class="quiz-muted">Couldn’t load community quizzes right now. Curated quizzes are shown above.</p>
      )}
    </div>
  );
}
