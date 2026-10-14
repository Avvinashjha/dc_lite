import { useEffect, useRef, useState } from 'preact/hooks';
import type { QuizMode, SchoolAttempt, SchoolLesson } from '../../types/school';
import { scoreSchoolQuestions } from '../../lib/school';
import Icon from './SchoolIcon';

interface Props { lesson: SchoolLesson; mode: QuizMode; onFinish: (attempt: SchoolAttempt) => void; onClose: () => void }

export default function SchoolQuiz({ lesson, mode, onFinish, onClose }: Props) {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(lesson.questions.map(() => null));
  const [remaining, setRemaining] = useState(60);
  const [revealed, setRevealed] = useState(false);
  const [reflection, setReflection] = useState('');
  const answerRef = useRef(answers);
  const finished = useRef(false);
  const deadline = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const total = lesson.questions.length;
  const title = { smash: 'Smash', rush: 'Rush', think: 'Think', test: 'Subject check' }[mode];
  const description = {
    smash: 'Tap an answer, see why it works, and move to the next question. No timer.',
    rush: 'A 60-second round. Answers are reviewed at the end. Unanswered questions earn no points.',
    think: 'Take your time. Think through each answer and read the explanation.',
    test: 'An untimed starter test. Answer all questions, then submit to see explanations.',
  }[mode];

  function finish() {
    if (finished.current) return;
    finished.current = true;
    setDone(true);
    onFinish({ lessonId: lesson.id, mode, correct: scoreSchoolQuestions(lesson.questions, answerRef.current), total, completedAt: Date.now() });
  }

  useEffect(() => {
    if (!started || done || mode !== 'rush') return;
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds === 0) finish();
    };
    const id = window.setInterval(tick, 250);
    document.addEventListener('visibilitychange', tick);
    return () => { window.clearInterval(id); document.removeEventListener('visibilitychange', tick); };
  }, [started, done, mode]);

  useEffect(() => { if (started) heading.current?.focus(); }, [index, started, done]);

  function select(questionIndex: number, optionIndex: number) {
    if (finished.current) return;
    if (mode === 'rush' && Date.now() >= deadline.current) { finish(); return; }
    const next = [...answerRef.current]; next[questionIndex] = optionIndex;
    answerRef.current = next; setAnswers(next);
    if (mode === 'smash' || mode === 'think') setRevealed(true);
  }

  const score = scoreSchoolQuestions(lesson.questions, answers);
  if (done) return <section class="school-panel school-session">
    <span class="school-kicker">{title} · Complete</span>
    <h2 ref={heading} tabIndex={-1}>You got {score} of {total} right.</h2>
    <p>{score === total ? 'Nicely reasoned. Keep exploring the subject.' : 'Every attempt tells you what to practise next. Let’s review.'}</p>
    <div class="school-review">{lesson.questions.map((question, i) => <article key={i}>
      <span class={`school-tag ${answers[i] === question.correct ? 'is-correct' : ''}`}>{answers[i] === question.correct ? 'Correct' : answers[i] === null ? 'Not answered' : 'Keep practising'}</span>
      <h3>{i + 1}. {question.prompt}</h3>
      <p>Your answer: <strong>{answers[i] === null ? 'Not answered' : question.options[answers[i]!]}</strong></p>
      <p>Correct answer: <strong>{question.options[question.correct]}</strong></p>
      <p>{question.explanation}</p>
    </article>)}</div>
    <button class="school-button" onClick={onClose}>Back to {mode === 'test' ? 'tests' : 'quizzes'} <Icon name="arrow" size={18}/></button>
  </section>;

  if (!started) return <section class="school-panel school-session school-session-intro">
    <span class={`school-icon-tile ${mode === 'rush' ? 'peach' : 'lavender'}`}><Icon name={mode === 'rush' ? 'clock' : 'bolt'} size={30}/></span>
    <span class="school-kicker">Class {lesson.grade} · {total} questions</span>
    <h2>{title}: {lesson.title}</h2><p>{description}</p>
    <p class="school-small">Each correct answer earns one point. This checks the starter lesson, not a full chapter or board paper.</p>
    <div class="school-actions"><button class="school-button" onClick={() => { deadline.current = Date.now() + 60_000; setStarted(true); }}>Start {mode === 'test' ? 'test' : title}<Icon name="arrow" size={18}/></button>
    <button class="school-button secondary" onClick={onClose}>Go back</button></div>
  </section>;

  function options(questionIndex: number) {
    const question = lesson.questions[questionIndex];
    return <div class={`school-answers ${mode === 'smash' ? 'school-answers--smash' : ''}`} role="group" aria-label={`Answers to question ${questionIndex + 1}`}>
      {question.options.map((option, oi) => <button key={oi}
        class={`school-answer ${answers[questionIndex] === oi ? 'is-selected' : ''} ${revealed && mode !== 'test' && oi === question.correct ? 'is-correct' : ''}`}
        aria-pressed={answers[questionIndex] === oi} disabled={revealed && mode !== 'test'}
        onClick={() => select(questionIndex, oi)}><span>{String.fromCharCode(65 + oi)}</span>{option}</button>)}
    </div>;
  }

  return <section class="school-panel school-session">
    <div class="school-section-heading"><span class="school-kicker">{title} · {lesson.title}</span>
      {mode === 'rush' && <span class={`school-timer ${remaining <= 10 ? 'is-urgent' : ''}`} role="timer" aria-label={`${remaining} seconds remaining`}><Icon name="clock" size={17}/>{remaining}s</span>}
    </div>
    {mode === 'test' ? <>
      <h2 ref={heading} tabIndex={-1}>Show what you understand.</h2>
      {lesson.questions.map((question, qi) => <fieldset class="school-test-question" key={qi}><legend>{qi + 1}. {question.prompt}</legend>{options(qi)}</fieldset>)}
      <button class="school-button" disabled={answers.some(a => a === null)} onClick={finish}>Submit test</button>
      <p class="school-small">{answers.filter(a => a !== null).length} of {total} answered</p>
    </> : <>
      <progress class="school-progress" value={index} max={total} aria-label="Quiz progress"/>
      <p class="school-small">Question {index + 1} of {total}</p>
      <h2 ref={heading} tabIndex={-1}>{lesson.questions[index].prompt}</h2>
      {options(index)}
      {mode === 'think' && <label class="school-field">Your thinking <span class="school-small">Optional · stays on this screen</span><textarea value={reflection} maxLength={500} onInput={e => setReflection(e.currentTarget.value)} placeholder="What helped you choose that answer?" rows={2}/></label>}
      {revealed && <div class="school-feedback" role="status"><strong>{answers[index] === lesson.questions[index].correct ? 'That’s it!' : 'Let’s work through it.'}</strong><p>{lesson.questions[index].explanation}</p></div>}
      <button class="school-button" disabled={answers[index] === null} onClick={() => {
        if (index === total - 1) finish();
        else { setIndex(index + 1); setRevealed(false); setReflection(''); }
      }}>{index === total - 1 ? 'See my results' : 'Next question'}<Icon name="arrow" size={18}/></button>
    </>}
    <button class="school-text-button school-exit" onClick={onClose}>Leave this attempt</button>
  </section>;
}
