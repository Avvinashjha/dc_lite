import { h, Fragment } from 'preact';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { userStore } from '../store/userStore';
import { openLoginModal } from '../store/authModalStore';
import type { Quiz, Question, QuizAnswers, QuizResult } from '../types/quiz';
import { gradeQuiz } from '../lib/quizScoring';
import { saveAttempt, getBestPercentForQuiz } from '../lib/quizStore';
import { submitScore, isQuizApiConfigured } from '../lib/quizApi';
import QuizLeaderboard from './QuizLeaderboard';

interface Props {
  quiz: Quiz;
}

type Phase = 'intro' | 'playing' | 'results';
type ResultTab = 'review' | 'leaderboard';
type SubmitState = 'idle' | 'submitting' | 'done' | 'error' | 'unconfigured';

function formatClock(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Build the same `.cb` code-block markup that lesson markdown uses, so quiz code
// snippets get identical styling and the global copy button works. Runtime
// fallback only (community quizzes); curated/course quizzes are pre-highlighted
// at build time. No syntax colors here since highlight.js isn't bundled client-side.
function codeBlockHtml(code: string, lang: string): string {
  const body = escapeHtml(code.replace(/^\n+/, '').replace(/\s+$/, ''));
  const label = escapeHtml(lang || 'text');
  const lineCount = body.replace(/\n$/, '').split('\n').length;
  const gutter = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');
  return (
    `<figure class="cb" data-lang="${label}">` +
    `<figcaption class="cb__bar"><span class="cb__lang">${label}</span>` +
    `<button type="button" class="cb__copy" aria-label="Copy code">` +
    `<svg class="cb__copy-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
    `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>` +
    `<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>` +
    `</svg><span class="cb__copy-label">Copy</span></button></figcaption>` +
    `<div class="cb__main"><pre class="cb__gutter" aria-hidden="true">${gutter}</pre>` +
    `<pre class="cb__code"><code class="hljs">${body}</code></pre></div>` +
    `</figure>`
  );
}

/**
 * Render a quiz string that may contain markdown code (inline `code` and
 * fenced ```lang ... ``` blocks) into safe HTML. Everything is HTML-escaped
 * first, so community-authored content cannot inject markup.
 */
function richHtml(input: string): string {
  if (!input) return '';
  const fences: string[] = [];

  // Pull out fenced code blocks before escaping so they render as blocks.
  let text = input.replace(/```([\w-]*)[ \t]*\n?([\s\S]*?)```/g, (_m, lang: string, code: string) => {
    fences.push(codeBlockHtml(code, lang));
    return `\u0000FENCE${fences.length - 1}\u0000`;
  });

  text = escapeHtml(text);

  // Inline code spans (content is already escaped).
  text = text.replace(/`([^`]+)`/g, (_m, code: string) => `<code>${code}</code>`);

  text = text.replace(/\n/g, '<br>');

  // Restore fenced blocks.
  text = text.replace(/\u0000FENCE(\d+)\u0000/g, (_m, i: string) => fences[Number(i)] || '');
  return text;
}

// Prefer build-time pre-rendered HTML; fall back to the client renderer.
function fieldHtml(pre: string | undefined, raw: string): string {
  return pre || richHtml(raw);
}

export default function QuizPlayer({ quiz }: Props) {
  const user = useStore(userStore);
  const questions = quiz.questions || [];
  const total = questions.length;

  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [resultTab, setResultTab] = useState<ResultTab>('review');
  const [remaining, setRemaining] = useState<number>(quiz.timeLimitSec || 0);
  const [bestPercent, setBestPercent] = useState<number | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [leaderboardKey, setLeaderboardKey] = useState(0);
  const [shareMsg, setShareMsg] = useState('');

  const startRef = useRef<number>(0);
  const submittedRef = useRef(false);

  useEffect(() => {
    getBestPercentForQuiz(quiz.slug).then(setBestPercent);
  }, [quiz.slug, phase]);

  const finish = useCallback(
    (finalAnswers: QuizAnswers) => {
      const timeSec = Math.max(0, Math.round((Date.now() - startRef.current) / 1000));
      const res = gradeQuiz(questions, finalAnswers, timeSec);
      setResult(res);
      setPhase('results');
      setResultTab('review');

      const attempt = {
        slug: quiz.slug,
        title: quiz.title,
        score: res.score,
        maxScore: res.maxScore,
        percent: res.percent,
        timeSec: res.timeSec,
        ranked: !!quiz.ranked,
        completedAt: res.completedAt,
      };
      saveAttempt(attempt).catch(() => {});

      // Notify any host context (e.g. a course quiz lesson) of the result so it
      // can mark the lesson complete. Guarded so standalone quizzes are unaffected.
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('dc:quizcompleted', {
            detail: {
              slug: quiz.slug,
              percent: res.percent,
              score: res.score,
              maxScore: res.maxScore,
            },
          })
        );
      }

      // Auto-submit ranked scores when signed in.
      if (quiz.ranked && user) {
        submitRanked(res);
      } else if (quiz.ranked && !user) {
        setSubmitState('idle');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, quiz, user]
  );

  // Countdown timer
  useEffect(() => {
    if (phase !== 'playing' || !quiz.timeLimitSec) return;
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(id);
          // Use a microtask so state from current render is flushed first.
          setTimeout(() => {
            if (!submittedRef.current) {
              submittedRef.current = true;
              finish(answersRef.current);
            }
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, quiz.timeLimitSec]);

  // Keep a ref of the latest answers for the timer's auto-submit.
  const answersRef = useRef<QuizAnswers>(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  function start() {
    setAnswers({});
    setIndex(0);
    setResult(null);
    setSubmitState('idle');
    submittedRef.current = false;
    setRemaining(quiz.timeLimitSec || 0);
    startRef.current = Date.now();
    setPhase('playing');
  }

  function selectOption(q: Question, optionId: string) {
    setAnswers(prev => {
      const current = prev[q.id] || [];
      if (q.type === 'multiple') {
        const next = current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : [...current, optionId];
        return { ...prev, [q.id]: next };
      }
      return { ...prev, [q.id]: [optionId] };
    });
  }

  function submitNow() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    finish(answersRef.current);
  }

  async function submitRanked(res: QuizResult) {
    if (!user) return;
    if (!isQuizApiConfigured()) {
      setSubmitState('unconfigured');
      return;
    }
    setSubmitState('submitting');
    const out = await submitScore({
      quizSlug: quiz.slug,
      uid: user.uid,
      displayName: user.displayName || 'Anonymous',
      score: res.score,
      maxScore: res.maxScore,
      timeSec: res.timeSec,
      completedAt: new Date(res.completedAt).toISOString(),
    });
    if (!out.configured) {
      setSubmitState('unconfigured');
    } else if (out.ok) {
      setSubmitState('done');
      setLeaderboardKey(k => k + 1);
    } else {
      setSubmitState('error');
    }
  }

  function shareResult() {
    if (!result) return;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `I scored ${result.score}/${result.maxScore} (${result.percent}%) on the "${quiz.title}" quiz at DailyCoder!`;
    const shareData = { title: `${quiz.title} — DailyCoder Quiz`, text, url };
    const nav = typeof navigator !== 'undefined' ? navigator : undefined;
    if (nav && typeof nav.share === 'function') {
      nav.share(shareData).catch(() => {});
    } else if (nav && nav.clipboard) {
      nav.clipboard.writeText(`${text} ${url}`).then(
        () => {
          setShareMsg('Result copied to clipboard!');
          setTimeout(() => setShareMsg(''), 2500);
        },
        () => {}
      );
    }
  }

  // ──── Render: intro ────
  if (phase === 'intro') {
    return (
      <div class="quiz-card quiz-intro">
        <div class="quiz-intro__meta">
          <span class={`quiz-badge quiz-badge--${quiz.difficulty}`}>{quiz.difficulty}</span>
          {quiz.ranked && <span class="quiz-badge quiz-badge--ranked">Ranked</span>}
          <span class="quiz-badge quiz-badge--neutral">{quiz.category}</span>
        </div>
        <ul class="quiz-intro__facts">
          <li><strong>{total}</strong> questions</li>
          <li>
            {quiz.timeLimitSec ? <Fragment><strong>{formatClock(quiz.timeLimitSec)}</strong> time limit</Fragment> : 'No time limit'}
          </li>
          {bestPercent != null && (
            <li>Your best: <strong>{bestPercent}%</strong></li>
          )}
        </ul>

        {quiz.ranked && !user && (
          <p class="quiz-note">
            Playing in <strong>practice mode</strong>. <button type="button" class="quiz-link-btn" onClick={() => openLoginModal('Sign in to submit your score to the leaderboard')}>Sign in</button> to submit your score to the leaderboard.
          </p>
        )}
        {quiz.ranked && user && (
          <p class="quiz-note">Signed in as <strong>{user.displayName || 'you'}</strong> — your score will be submitted to the leaderboard.</p>
        )}

        <div class="quiz-actions">
          <button type="button" class="quiz-btn quiz-btn--primary" onClick={start}>
            Start quiz
          </button>
        </div>
      </div>
    );
  }

  // ──── Render: playing ────
  if (phase === 'playing') {
    const q = questions[index];
    const selected = answers[q.id] || [];
    const answeredCount = questions.filter(qq => (answers[qq.id] || []).length > 0).length;
    const isLast = index === total - 1;

    return (
      <div class="quiz-card quiz-play">
        <div class="quiz-play__top">
          <div class="quiz-progress" aria-hidden="true">
            <div class="quiz-progress__bar" style={{ width: `${((index + 1) / total) * 100}%` }} />
          </div>
          <div class="quiz-play__status">
            <span>Question {index + 1} of {total}</span>
            {quiz.timeLimitSec ? (
              <span class={`quiz-timer ${remaining <= 15 ? 'quiz-timer--low' : ''}`}>⏱ {formatClock(remaining)}</span>
            ) : (
              <span class="quiz-muted">{answeredCount}/{total} answered</span>
            )}
          </div>
        </div>

        <div class="quiz-question__prompt" role="heading" aria-level={2} dangerouslySetInnerHTML={{ __html: fieldHtml(q.promptHtml, q.prompt) }} />
        <span class="quiz-question__hint">
          {q.type === 'multiple' ? 'Select all that apply' : q.type === 'boolean' ? 'True or false' : 'Select one'}
        </span>

        <div class="quiz-options" role="group">
          {q.options.map(opt => {
            const active = selected.includes(opt.id);
            return (
              <button
                type="button"
                class={`quiz-option ${active ? 'quiz-option--active' : ''}`}
                aria-pressed={active}
                onClick={() => selectOption(q, opt.id)}
              >
                <span class={`quiz-option__marker quiz-option__marker--${q.type === 'multiple' ? 'check' : 'radio'}`}>
                  {active ? (q.type === 'multiple' ? '✓' : '●') : ''}
                </span>
                <span class="quiz-option__text" dangerouslySetInnerHTML={{ __html: fieldHtml(opt.textHtml, opt.text) }} />
              </button>
            );
          })}
        </div>

        <div class="quiz-actions quiz-actions--nav">
          <button
            type="button"
            class="quiz-btn quiz-btn--ghost"
            disabled={index === 0}
            onClick={() => setIndex(i => Math.max(0, i - 1))}
          >
            ← Previous
          </button>
          {isLast ? (
            <button type="button" class="quiz-btn quiz-btn--primary" onClick={submitNow}>
              Submit quiz
            </button>
          ) : (
            <button type="button" class="quiz-btn quiz-btn--primary" onClick={() => setIndex(i => Math.min(total - 1, i + 1))}>
              Next →
            </button>
          )}
        </div>

        <div class="quiz-dots">
          {questions.map((qq, i) => (
            <button
              type="button"
              aria-label={`Go to question ${i + 1}`}
              class={`quiz-dot ${i === index ? 'quiz-dot--current' : ''} ${(answers[qq.id] || []).length ? 'quiz-dot--done' : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    );
  }

  // ──── Render: results ────
  if (phase === 'results' && result) {
    const passed = result.percent >= 70;
    return (
      <div class="quiz-card quiz-results">
        <div class={`quiz-score quiz-score--${passed ? 'pass' : 'fail'}`}>
          <div class="quiz-score__ring" style={{ '--pct': `${result.percent}` } as h.JSX.CSSProperties}>
            <span class="quiz-score__pct">{result.percent}%</span>
          </div>
          <div class="quiz-score__detail">
            <p class="quiz-score__headline">{passed ? 'Well done!' : 'Keep practicing!'}</p>
            <p class="quiz-muted">
              {result.score} / {result.maxScore} points · {result.correctCount}/{result.total} correct · {formatClock(result.timeSec)}
            </p>
          </div>
        </div>

        {quiz.ranked && (
          <div class="quiz-submit-status">
            {submitState === 'submitting' && <span class="quiz-muted">Submitting your score…</span>}
            {submitState === 'done' && <span class="quiz-ok">✓ Score submitted to the leaderboard</span>}
            {submitState === 'error' && <span class="quiz-err">Couldn’t submit your score. Please try again later.</span>}
            {submitState === 'unconfigured' && (
              <span class="quiz-muted">Leaderboard not configured yet — your score is saved locally.</span>
            )}
            {submitState === 'idle' && !user && (
              <button
                type="button"
                class="quiz-btn quiz-btn--outline"
                onClick={() => openLoginModal('Sign in to submit your score to the leaderboard')}
              >
                Sign in to submit your score
              </button>
            )}
            {submitState === 'idle' && user && (
              <button type="button" class="quiz-btn quiz-btn--outline" onClick={() => result && submitRanked(result)}>
                Submit to leaderboard
              </button>
            )}
          </div>
        )}

        <div class="quiz-actions">
          <button type="button" class="quiz-btn quiz-btn--primary" onClick={start}>↺ Retry</button>
          <button type="button" class="quiz-btn quiz-btn--outline" onClick={shareResult}>Share result</button>
          <a class="quiz-btn quiz-btn--ghost" href="/quiz">All quizzes</a>
        </div>
        {shareMsg && <p class="quiz-ok quiz-share-msg">{shareMsg}</p>}

        {quiz.ranked && (
          <div class="quiz-tabs">
            <button
              type="button"
              class={`quiz-tabs__btn ${resultTab === 'review' ? 'quiz-tabs__btn--active' : ''}`}
              onClick={() => setResultTab('review')}
            >
              Review answers
            </button>
            <button
              type="button"
              class={`quiz-tabs__btn ${resultTab === 'leaderboard' ? 'quiz-tabs__btn--active' : ''}`}
              onClick={() => setResultTab('leaderboard')}
            >
              Leaderboard
            </button>
          </div>
        )}

        {(!quiz.ranked || resultTab === 'review') && (
          <div class="quiz-review">
            {questions.map((q, i) => {
              const r = result.perQuestion[i];
              return (
                <div class={`quiz-review__item quiz-review__item--${r.correct ? 'correct' : 'wrong'}`}>
                  <div class="quiz-review__q">
                    <span class="quiz-review__num">{i + 1}.</span>
                    <div class="quiz-review__qtext" dangerouslySetInnerHTML={{ __html: fieldHtml(q.promptHtml, q.prompt) }} />
                  </div>
                  <ul class="quiz-review__options">
                    {q.options.map(opt => {
                      const isCorrect = r.correctIds.includes(opt.id);
                      const isSelected = r.selected.includes(opt.id);
                      let cls = '';
                      if (isCorrect) cls = 'quiz-review__opt--correct';
                      else if (isSelected) cls = 'quiz-review__opt--wrong';
                      return (
                        <li class={`quiz-review__opt ${cls}`}>
                          <span class="quiz-review__opt-icon">
                            {isCorrect ? '✓' : isSelected ? '✕' : ''}
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: fieldHtml(opt.textHtml, opt.text) }} />
                        </li>
                      );
                    })}
                  </ul>
                  {q.explanation && (
                    <div class="quiz-review__explain" dangerouslySetInnerHTML={{ __html: fieldHtml(q.explanationHtml, q.explanation) }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {quiz.ranked && resultTab === 'leaderboard' && (
          <QuizLeaderboard quizSlug={quiz.slug} refreshKey={leaderboardKey} highlightUid={user?.uid} />
        )}
      </div>
    );
  }

  return null;
}
