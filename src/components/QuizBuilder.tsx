import { h, Fragment } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { userStore } from '../store/userStore';
import { openLoginModal } from '../store/authModalStore';
import type { Quiz, Question, QuizDifficulty, QuestionType } from '../types/quiz';
import { slugifyTaxonomy } from '../utils/taxonomy';
import { createCommunityQuiz, isQuizApiConfigured } from '../lib/quizApi';
import { saveDraft, getDraft } from '../lib/quizStore';

interface EditableQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options: { id: string; text: string }[];
  correct: string[];
  explanation: string;
  points: number;
}

const DRAFT_ID = 'builder-current';

function uid(prefix: string): string {
  return `${prefix}${Math.random().toString(36).slice(2, 8)}`;
}

function blankQuestion(): EditableQuestion {
  return {
    id: uid('q_'),
    type: 'single',
    prompt: '',
    options: [
      { id: uid('o_'), text: '' },
      { id: uid('o_'), text: '' },
    ],
    correct: [],
    explanation: '',
    points: 1,
  };
}

function booleanOptions(): { id: string; text: string }[] {
  return [
    { id: 'true', text: 'True' },
    { id: 'false', text: 'False' },
  ];
}

type SubmitState = 'idle' | 'submitting' | 'done' | 'error' | 'unconfigured';

export default function QuizBuilder() {
  const user = useStore(userStore);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('easy');
  const [tags, setTags] = useState('');
  const [timeLimitMin, setTimeLimitMin] = useState('');
  const [questions, setQuestions] = useState<EditableQuestion[]>([blankQuestion()]);

  const [errors, setErrors] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [createdSlug, setCreatedSlug] = useState('');

  // Load existing draft once.
  useEffect(() => {
    getDraft(DRAFT_ID).then(d => {
      if (!d) return;
      if (d.title) setTitle(d.title);
      if (d.description) setDescription(d.description);
      if (d.category) setCategory(d.category);
      if (d.difficulty) setDifficulty(d.difficulty as QuizDifficulty);
      if (Array.isArray(d.tags)) setTags(d.tags.join(', '));
      if (d.timeLimitSec) setTimeLimitMin(String(Math.round(d.timeLimitSec / 60)));
      if (Array.isArray(d.questions) && d.questions.length) {
        setQuestions(
          d.questions.map(q => ({
            id: q.id || uid('q_'),
            type: (q.type as QuestionType) || 'single',
            prompt: q.prompt || '',
            options: Array.isArray(q.options) && q.options.length ? q.options : blankQuestion().options,
            correct: Array.isArray(q.correct) ? q.correct : [],
            explanation: q.explanation || '',
            points: q.points || 1,
          }))
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildQuiz = useMemo(() => {
    return (): Quiz => {
      const slug = slugifyTaxonomy(title) || `quiz-${Date.now()}`;
      const tlMin = parseInt(timeLimitMin, 10);
      const questionsOut: Question[] = questions.map(q => ({
        id: q.id,
        type: q.type,
        prompt: q.prompt.trim(),
        options: q.options.map(o => ({ id: o.id, text: o.text.trim() })),
        correct: q.correct,
        explanation: q.explanation.trim() || undefined,
        points: q.points || 1,
      }));
      return {
        id: slug,
        slug,
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'General',
        difficulty,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        author: user?.displayName || 'Anonymous',
        ranked: false,
        timeLimitSec: !isNaN(tlMin) && tlMin > 0 ? tlMin * 60 : undefined,
        source: 'community',
        questions: questionsOut,
        publishedAt: new Date().toISOString().slice(0, 10),
      };
    };
  }, [title, description, category, difficulty, tags, timeLimitMin, questions, user]);

  function validate(): string[] {
    const errs: string[] = [];
    if (!title.trim()) errs.push('Add a quiz title.');
    if (!questions.length) errs.push('Add at least one question.');
    questions.forEach((q, i) => {
      const n = i + 1;
      if (!q.prompt.trim()) errs.push(`Question ${n}: prompt is empty.`);
      const filledOptions = q.options.filter(o => o.text.trim());
      if (q.type !== 'boolean' && filledOptions.length < 2) {
        errs.push(`Question ${n}: needs at least 2 options with text.`);
      }
      if (!q.correct.length) {
        errs.push(`Question ${n}: mark the correct answer${q.type === 'multiple' ? '(s)' : ''}.`);
      }
      if (q.type !== 'multiple' && q.correct.length > 1) {
        errs.push(`Question ${n}: only one answer can be correct for this type.`);
      }
    });
    return errs;
  }

  // ──── Question mutations ────
  function updateQuestion(qid: string, patch: Partial<EditableQuestion>) {
    setQuestions(prev => prev.map(q => (q.id === qid ? { ...q, ...patch } : q)));
  }

  function changeType(qid: string, type: QuestionType) {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== qid) return q;
        if (type === 'boolean') {
          return { ...q, type, options: booleanOptions(), correct: [] };
        }
        // restore at least two editable options when leaving boolean
        const options =
          q.options.length && q.options[0].id !== 'true' ? q.options : blankQuestion().options;
        return { ...q, type, options, correct: [] };
      })
    );
  }

  function toggleCorrect(qid: string, optionId: string) {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== qid) return q;
        if (q.type === 'multiple') {
          const correct = q.correct.includes(optionId)
            ? q.correct.filter(id => id !== optionId)
            : [...q.correct, optionId];
          return { ...q, correct };
        }
        return { ...q, correct: [optionId] };
      })
    );
  }

  function updateOption(qid: string, oid: string, text: string) {
    setQuestions(prev =>
      prev.map(q =>
        q.id === qid ? { ...q, options: q.options.map(o => (o.id === oid ? { ...o, text } : o)) } : q
      )
    );
  }

  function addOption(qid: string) {
    setQuestions(prev =>
      prev.map(q => (q.id === qid ? { ...q, options: [...q.options, { id: uid('o_'), text: '' }] } : q))
    );
  }

  function removeOption(qid: string, oid: string) {
    setQuestions(prev =>
      prev.map(q =>
        q.id === qid
          ? { ...q, options: q.options.filter(o => o.id !== oid), correct: q.correct.filter(c => c !== oid) }
          : q
      )
    );
  }

  function addQuestion() {
    setQuestions(prev => [...prev, blankQuestion()]);
  }

  function removeQuestion(qid: string) {
    setQuestions(prev => (prev.length > 1 ? prev.filter(q => q.id !== qid) : prev));
  }

  // ──── Actions ────
  async function handleSaveDraft() {
    const quiz = buildQuiz();
    await saveDraft({ draftId: DRAFT_ID, updatedAt: Date.now(), ...quiz });
    setStatusMsg('Draft saved in this browser.');
    setTimeout(() => setStatusMsg(''), 2500);
  }

  function handleExport() {
    const quiz = buildQuiz();
    const blob = new Blob([JSON.stringify(quiz, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quiz.slug || 'quiz'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMsg('Quiz JSON downloaded.');
    setTimeout(() => setStatusMsg(''), 2500);
  }

  async function handleSubmit() {
    const errs = validate();
    setErrors(errs);
    if (errs.length) return;

    if (!user) {
      openLoginModal('Sign in to publish your quiz to the community');
      return;
    }
    if (!isQuizApiConfigured()) {
      setSubmitState('unconfigured');
      return;
    }
    setSubmitState('submitting');
    const quiz = buildQuiz();
    const res = await createCommunityQuiz(quiz, user.uid);
    if (!res.configured) {
      setSubmitState('unconfigured');
    } else if (res.ok) {
      setCreatedSlug(res.slug || quiz.slug);
      setSubmitState('done');
    } else {
      setSubmitState('error');
    }
  }

  const apiConfigured = isQuizApiConfigured();

  return (
    <div class="quiz-builder">
      {!user && (
        <div class="quiz-note quiz-note--block">
          You can build and save a draft without signing in. <button type="button" class="quiz-link-btn" onClick={() => openLoginModal('Sign in to publish your quiz')}>Sign in</button> to publish it to the community.
        </div>
      )}
      {!apiConfigured && (
        <div class="quiz-note quiz-note--block">
          Community publishing isn’t configured yet. You can still build, save a local draft, and <strong>export your quiz as JSON</strong>.
        </div>
      )}

      {/* Quiz meta */}
      <section class="quiz-builder__section">
        <h2 class="quiz-builder__legend">Quiz details</h2>
        <div class="quiz-field">
          <label>Title</label>
          <input value={title} onInput={e => setTitle((e.target as HTMLInputElement).value)} placeholder="e.g. TypeScript Generics" />
        </div>
        <div class="quiz-field">
          <label>Description</label>
          <textarea value={description} onInput={e => setDescription((e.target as HTMLTextAreaElement).value)} placeholder="What is this quiz about?" rows={2} />
        </div>
        <div class="quiz-field-row">
          <div class="quiz-field">
            <label>Category</label>
            <input value={category} onInput={e => setCategory((e.target as HTMLInputElement).value)} placeholder="e.g. TypeScript" />
          </div>
          <div class="quiz-field">
            <label>Difficulty</label>
            <select value={difficulty} onChange={e => setDifficulty((e.target as HTMLSelectElement).value as QuizDifficulty)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div class="quiz-field">
            <label>Time limit (min, optional)</label>
            <input type="number" min="0" value={timeLimitMin} onInput={e => setTimeLimitMin((e.target as HTMLInputElement).value)} placeholder="0 = none" />
          </div>
        </div>
        <div class="quiz-field">
          <label>Tags (comma-separated)</label>
          <input value={tags} onInput={e => setTags((e.target as HTMLInputElement).value)} placeholder="typescript, types, generics" />
        </div>
      </section>

      {/* Questions */}
      <section class="quiz-builder__section">
        <h2 class="quiz-builder__legend">Questions</h2>
        {questions.map((q, qi) => (
          <div class="quiz-builder__question">
            <div class="quiz-builder__question-head">
              <span class="quiz-builder__qnum">Question {qi + 1}</span>
              <div class="quiz-builder__question-controls">
                <select value={q.type} onChange={e => changeType(q.id, (e.target as HTMLSelectElement).value as QuestionType)}>
                  <option value="single">Single choice</option>
                  <option value="multiple">Multiple choice</option>
                  <option value="boolean">True / False</option>
                </select>
                <input
                  class="quiz-builder__points"
                  type="number"
                  min="1"
                  value={q.points}
                  title="Points"
                  onInput={e => updateQuestion(q.id, { points: Math.max(1, parseInt((e.target as HTMLInputElement).value, 10) || 1) })}
                />
                <button type="button" class="quiz-btn quiz-btn--ghost quiz-btn--sm" onClick={() => removeQuestion(q.id)} disabled={questions.length === 1}>
                  Remove
                </button>
              </div>
            </div>

            <div class="quiz-field">
              <label>Prompt</label>
              <textarea value={q.prompt} onInput={e => updateQuestion(q.id, { prompt: (e.target as HTMLTextAreaElement).value })} rows={2} placeholder="Type the question…" />
            </div>

            <div class="quiz-field">
              <label>Options {q.type === 'multiple' ? '(tick all correct)' : '(tick the correct one)'}</label>
              <div class="quiz-builder__options">
                {q.options.map(o => (
                  <div class="quiz-builder__option">
                    <button
                      type="button"
                      class={`quiz-builder__correct ${q.correct.includes(o.id) ? 'quiz-builder__correct--on' : ''}`}
                      title="Mark correct"
                      aria-pressed={q.correct.includes(o.id)}
                      onClick={() => toggleCorrect(q.id, o.id)}
                    >
                      {q.correct.includes(o.id) ? '✓' : ''}
                    </button>
                    {q.type === 'boolean' ? (
                      <span class="quiz-builder__bool">{o.text}</span>
                    ) : (
                      <input value={o.text} onInput={e => updateOption(q.id, o.id, (e.target as HTMLInputElement).value)} placeholder="Option text" />
                    )}
                    {q.type !== 'boolean' && q.options.length > 2 && (
                      <button type="button" class="quiz-builder__opt-remove" title="Remove option" onClick={() => removeOption(q.id, o.id)}>×</button>
                    )}
                  </div>
                ))}
              </div>
              {q.type !== 'boolean' && (
                <button type="button" class="quiz-btn quiz-btn--ghost quiz-btn--sm" onClick={() => addOption(q.id)}>+ Add option</button>
              )}
            </div>

            <div class="quiz-field">
              <label>Explanation (optional)</label>
              <textarea value={q.explanation} onInput={e => updateQuestion(q.id, { explanation: (e.target as HTMLTextAreaElement).value })} rows={2} placeholder="Explain the correct answer…" />
            </div>
          </div>
        ))}
        <button type="button" class="quiz-btn quiz-btn--outline" onClick={addQuestion}>+ Add question</button>
      </section>

      {errors.length > 0 && (
        <ul class="quiz-builder__errors">
          {errors.map(e => (
            <li>{e}</li>
          ))}
        </ul>
      )}

      <div class="quiz-actions quiz-builder__actions">
        <button type="button" class="quiz-btn quiz-btn--primary" onClick={handleSubmit}>
          {user ? 'Publish to community' : 'Sign in & publish'}
        </button>
        <button type="button" class="quiz-btn quiz-btn--outline" onClick={handleSaveDraft}>Save draft</button>
        <button type="button" class="quiz-btn quiz-btn--ghost" onClick={handleExport}>Export JSON</button>
      </div>

      {statusMsg && <p class="quiz-ok">{statusMsg}</p>}
      {submitState === 'submitting' && <p class="quiz-muted">Publishing…</p>}
      {submitState === 'done' && (
        <p class="quiz-ok">
          ✓ Published! Your quiz is now live.{' '}
          <a href={`/quiz/play/?slug=${encodeURIComponent(createdSlug)}`}>Play it</a>.
        </p>
      )}
      {submitState === 'error' && <p class="quiz-err">Publishing failed. Please try again later (your draft is saved locally).</p>}
      {submitState === 'unconfigured' && (
        <p class="quiz-muted">Community publishing isn’t configured yet — but your draft is saved and you can export the JSON above.</p>
      )}
    </div>
  );
}
