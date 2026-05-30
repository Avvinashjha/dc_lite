import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getLeaderboard, type LeaderboardResponse } from '../lib/quizApi';
import type { LeaderboardEntry } from '../types/quiz';

interface Props {
  quizSlug: string;
  /** Increment to force a re-fetch (e.g. after a score is submitted). */
  refreshKey?: number;
  highlightUid?: string;
}

function formatTime(sec: number): string {
  if (!sec || sec < 0) return '—';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function QuizLeaderboard({ quizSlug, refreshKey = 0, highlightUid }: Props) {
  const [state, setState] = useState<'loading' | 'ready'>('loading');
  const [data, setData] = useState<LeaderboardResponse>({ configured: true, scores: [] });

  useEffect(() => {
    let active = true;
    setState('loading');
    getLeaderboard(quizSlug, 20).then(res => {
      if (!active) return;
      setData(res);
      setState('ready');
    });
    return () => {
      active = false;
    };
  }, [quizSlug, refreshKey]);

  if (state === 'loading') {
    return <p class="quiz-muted">Loading leaderboard…</p>;
  }

  if (!data.configured) {
    return (
      <div class="quiz-empty">
        <p class="quiz-empty__title">Leaderboard coming soon</p>
        <p class="quiz-muted">
          The leaderboard backend isn’t configured yet. Your scores are still saved locally in this browser.
        </p>
      </div>
    );
  }

  if (data.error) {
    return <p class="quiz-muted">Couldn’t load the leaderboard right now. Please try again later.</p>;
  }

  if (!data.scores.length) {
    return <p class="quiz-muted">No scores yet. Be the first to set a record!</p>;
  }

  return (
    <div class="quiz-leaderboard">
      <table class="quiz-leaderboard__table">
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Score</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.scores.map((entry: LeaderboardEntry, i: number) => (
            <tr class={highlightUid && entry.uid === highlightUid ? 'quiz-leaderboard__row--me' : ''}>
              <td class="quiz-leaderboard__rank">{i + 1}</td>
              <td class="quiz-leaderboard__name">{entry.displayName || 'Anonymous'}</td>
              <td>
                {entry.score}
                <span class="quiz-muted"> / {entry.maxScore}</span>
              </td>
              <td>{formatTime(entry.timeSec)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
