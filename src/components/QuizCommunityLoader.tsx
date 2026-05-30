import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import type { Quiz } from '../types/quiz';
import { listCommunityQuizzes } from '../lib/quizApi';
import QuizPlayer from './QuizPlayer';

type State = 'loading' | 'ready' | 'notfound' | 'unconfigured' | 'error';

export default function QuizCommunityLoader() {
  const [state, setState] = useState<State>('loading');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [slug, setSlug] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('slug') || '';
    setSlug(s);
    if (!s) {
      setState('notfound');
      return;
    }
    let active = true;
    listCommunityQuizzes().then(res => {
      if (!active) return;
      if (!res.configured) {
        setState('unconfigured');
        return;
      }
      if (res.error) {
        setState('error');
        return;
      }
      const found = res.quizzes.find(q => q.slug === s);
      if (found) {
        setQuiz(found);
        setState('ready');
      } else {
        setState('notfound');
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (state === 'loading') {
    return <p class="quiz-muted">Loading quiz…</p>;
  }

  if (state === 'ready' && quiz) {
    return (
      <div>
        <nav class="quiz-breadcrumbs" aria-label="Breadcrumb">
          <a href="/quiz">Quizzes</a>
          <span class="quiz-breadcrumbs__sep">/</span>
          <span>{quiz.title}</span>
        </nav>
        <header class="quiz-detail__head">
          <h1 class="quiz-detail__title">{quiz.title}</h1>
          <p class="quiz-detail__desc">{quiz.description}</p>
          <p class="quiz-muted">Community quiz{quiz.author ? ` · by ${quiz.author}` : ''}</p>
        </header>
        <QuizPlayer quiz={quiz} />
      </div>
    );
  }

  if (state === 'unconfigured') {
    return (
      <div class="quiz-empty">
        <p class="quiz-empty__title">Community quizzes coming soon</p>
        <p class="quiz-muted">
          The community quiz backend isn’t configured yet. Check out the{' '}
          <a href="/quiz">curated quizzes</a> in the meantime.
        </p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div class="quiz-empty">
        <p class="quiz-empty__title">Couldn’t load this quiz</p>
        <p class="quiz-muted">Please try again later or browse <a href="/quiz">all quizzes</a>.</p>
      </div>
    );
  }

  return (
    <div class="quiz-empty">
      <p class="quiz-empty__title">Quiz not found</p>
      <p class="quiz-muted">
        We couldn’t find a community quiz{slug ? ` for "${slug}"` : ''}. Browse <a href="/quiz">all quizzes</a>.
      </p>
    </div>
  );
}
