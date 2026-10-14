import { useEffect, useState } from 'preact/hooks';
import type { SchoolAttempt, SchoolLesson, SchoolMode, SchoolProfile, SchoolStream, QuizMode } from '../../types/school';
import { SCHOOL_LESSONS, SCHOOL_MODES, SCHOOL_REFERENCES, SCHOOL_STREAMS, SCHOOL_SUBJECTS } from '../../data/school';
import { DEFAULT_SCHOOL_PROFILE, SCHOOL_STORAGE_KEY, isSchoolGrade, isSchoolStream, restoreSchoolProfile, schoolLessons, schoolStage, schoolSubjects } from '../../lib/school';
import Icon from './SchoolIcon';
import SchoolQuiz from './SchoolQuiz';
import { SchoolCode, SchoolPlay } from './SchoolActivities';

const stageCopy = {
  discover: { label: 'Little explorers', title: 'Big discoveries start\nwith a little wonder.', description: 'Play with ideas, try something new, and let your curiosity lead the way.' },
  explore: { label: 'Curiosity, every day', title: 'A little curiosity.\nA world of possibility.', description: 'Explore your subjects, play with ideas, and find your next “I get it!” moment.' },
  focus: { label: 'Build your understanding', title: 'Understand the idea.\nFind your confidence.', description: 'Learn a concept, practise it, and see where to focus next. One clear step at a time.' },
  specialise: { label: 'Make your next move', title: 'Your subjects.\nYour direction.', description: 'Build stronger foundations in the subjects that matter to your next chapter.' },
};

function AskPanel({ lessons, initial }: { lessons: SchoolLesson[]; initial?: string }) {
  const [lessonId, setLessonId] = useState(lessons.find(l => l.id === initial)?.id || lessons[0]?.id || '');
  const [action, setAction] = useState<'idea' | 'example' | 'question'>('idea');
  const lesson = lessons.find(l => l.id === lessonId);
  return <div class="school-two-column">
    <section class="school-panel"><span class="school-kicker">A little guidance</span><h2>Let’s revisit an idea.</h2><p>Choose a starter lesson and explore its explanation or worked example.</p>
      <label class="school-field">Lesson<select value={lessonId} onChange={e => { setLessonId(e.currentTarget.value); setAction('idea'); }}>{lessons.map(l => <option value={l.id} key={l.id}>{SCHOOL_SUBJECTS.find(s => s.id === l.subject)?.name} · {l.title}</option>)}</select></label>
      {lesson ? <><div class="school-pills">{([['idea', 'Key idea'], ['example', 'Worked example'], ['question', 'Think about it']] as const).map(([id, label]) => <button key={id} class={id === action ? 'is-active' : ''} aria-pressed={id === action} onClick={() => setAction(id)}>{label}</button>)}</div>
        <div class="school-lesson-recap" aria-live="polite"><span class="school-tag">Authored lesson recap</span><h3>{lesson.title}</h3><p>{action === 'idea' ? lesson.sections[0].text : action === 'example' ? lesson.example : lesson.questions[0].prompt}</p>
        {action === 'question' && <p class="school-small">Explain your reasoning, then try the lesson quiz to check your answer.</p>}</div></> : <p>No starter lessons are available for this selection yet.</p>}
    </section>
    <aside class="school-panel school-ask-status"><span class="school-icon-tile pink"><Icon name="chat" size={30}/></span><span class="school-tag">AI tutor · Planned</span><h3>A helper that stays with your lesson.</h3><p>The AI question-and-answer service is not connected yet. The recap beside this card comes directly from our starter material.</p><p class="school-small">The planned tutor will use your selected class, subject, and lesson, with short explanations, hints, and references to the learning material.</p></aside>
  </div>;
}

export default function SchoolApp({ mode = 'home' }: { mode?: SchoolMode }) {
  const [profile, setProfile] = useState<SchoolProfile>({ ...DEFAULT_SCHOOL_PROFILE });
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [subject, setSubject] = useState('all');
  const [lessonId, setLessonId] = useState('');
  const [quizMode, setQuizMode] = useState<QuizMode>('think');
  const [session, setSession] = useState<SchoolLesson | null>(null);
  const stage = schoolStage(profile.grade);
  const copy = stageCopy[stage];
  const subjects = schoolSubjects(profile.grade, profile.stream);
  const lessons = schoolLessons(profile.grade).filter(l => subjects.some(s => s.id === l.subject));
  const filtered = lessons.filter(l => subject === 'all' || l.subject === subject);
  const activeLesson = lessons.find(l => l.id === lessonId);
  const completeCount = lessons.filter(l => profile.completed.includes(l.id)).length;
  const nextLesson = lessons.find(l => !profile.completed.includes(l.id)) || lessons[0];
  const currentAttempts = profile.attempts.filter(a => lessons.some(l => l.id === a.lessonId));

  useEffect(() => {
    let restored = restoreSchoolProfile(null);
    try { restored = restoreSchoolProfile(JSON.parse(localStorage.getItem(SCHOOL_STORAGE_KEY) || 'null')); }
    catch { setStorageAvailable(false); }
    const params = new URLSearchParams(location.search);
    const grade = Number(params.get('class'));
    if (isSchoolGrade(grade)) restored.grade = grade;
    const stream = params.get('stream');
    if (isSchoolStream(stream)) restored.stream = stream;
    const subjectId = params.get('subject');
    if (schoolSubjects(restored.grade, restored.stream).some(s => s.id === subjectId)) setSubject(subjectId!);
    const lesson = SCHOOL_LESSONS.find(l => l.id === params.get('lesson') && l.grade === restored.grade && schoolSubjects(restored.grade, restored.stream).some(s => s.id === l.subject));
    if (lesson) setLessonId(lesson.id);
    setProfile(restored); setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(SCHOOL_STORAGE_KEY, JSON.stringify(profile)); setStorageAvailable(true); }
    catch { setStorageAvailable(false); }
  }, [profile, ready]);

  function href(target: SchoolMode, extra: Record<string, string> = {}) {
    const params = new URLSearchParams({ class: String(profile.grade), ...(profile.grade >= 11 ? { stream: profile.stream } : {}), ...extra });
    return `/school${target === 'home' ? '' : `/${target}`}?${params}`;
  }

  function updateSelection(grade: number, stream: SchoolStream) {
    setProfile(p => ({ ...p, grade, stream })); setSubject('all'); setLessonId(''); setSession(null);
    const params = new URLSearchParams({ class: String(grade), ...(grade >= 11 ? { stream } : {}) });
    history.replaceState(null, '', `${location.pathname}?${params}`);
  }

  function openLesson(lesson: SchoolLesson) {
    setLessonId(lesson.id);
    history.replaceState(null, '', href('learn', { subject: lesson.subject, lesson: lesson.id }));
    document.getElementById('school-main')?.scrollIntoView({ behavior: 'instant' });
  }

  function recordAttempt(attempt: SchoolAttempt) { setProfile(p => ({ ...p, attempts: [...p.attempts, attempt].slice(-50) })); }
  function subjectCards() {
    return <div class="school-subject-grid">{subjects.map(s => {
      const count = lessons.filter(l => l.subject === s.id).length;
      return <a class="school-subject-card" href={href('learn', { subject: s.id })} key={s.id}><span class={`school-subject-symbol ${s.color}`} aria-hidden="true">{s.symbol}</span><div><h3>{s.name}</h3><p>{count ? `${count} starter lesson${count > 1 ? 's' : ''}` : 'Lessons being prepared'}</p></div><Icon name="arrow" size={17}/></a>;
    })}</div>;
  }

  function subjectFilters() {
    return <div class="school-pills" aria-label="Filter by subject"><button class={subject === 'all' ? 'is-active' : ''} aria-pressed={subject === 'all'} onClick={() => { setSubject('all'); setLessonId(''); }}>All subjects</button>{subjects.map(s => <button class={subject === s.id ? 'is-active' : ''} aria-pressed={subject === s.id} onClick={() => { setSubject(s.id); setLessonId(''); }} key={s.id}>{s.name}</button>)}</div>;
  }

  return <div class={`school-app school-stage-${stage}`} inert={!ready} aria-busy={!ready}>
    <header class="school-header"><a class="school-brand" href={href('home')} aria-label="DailyCoder School home"><span class="school-brand-mark" aria-hidden="true"><Icon name="book" size={25}/></span><span>dailycoder<span class="school-brand-school">school<span class="school-brand-dot">.</span></span></span></a>
      <div class="school-header-right"><span class="school-board-label">CBSE / NCERT</span><label class="school-class-picker"><span>Your class</span><select aria-label="Your class" disabled={!ready} value={profile.grade} onChange={e => updateSelection(Number(e.currentTarget.value), profile.stream)}>{Array.from({ length: 12 }, (_, i) => <option value={i + 1} key={i + 1}>Class {i + 1}</option>)}</select></label><a class="school-back-link" href="/">DailyCoder <span aria-hidden="true">↗</span></a></div>
    </header>
    <div class="school-shell">
      <aside class="school-sidebar"><span class="school-nav-label">YOUR LEARNING SPACE</span><nav aria-label="School activities"><a class={mode === 'home' ? 'is-active' : ''} href={href('home')} aria-current={mode === 'home' ? 'page' : undefined}><Icon name="home"/><span>My space</span></a>{SCHOOL_MODES.map(item => <a class={mode === item.id ? 'is-active' : ''} href={href(item.id)} aria-current={mode === item.id ? 'page' : undefined} key={item.id}><Icon name={item.icon}/><span>{item.label}</span>{item.id === 'ask' && <span class="school-nav-soon">Soon</span>}</a>)}</nav>
        <div class="school-sidebar-note"><Icon name="leaf" size={28}/><p>Small steps.<br/><strong>Wonderful things.</strong></p><span>Learn at your own pace.</span></div>
        <p class="school-storage-status"><Icon name="lock" size={14}/>{storageAvailable ? 'Progress saved on this device' : 'Progress stays in this session'}</p>
      </aside>
      <main id="school-main" class="school-main" tabIndex={-1}>
        <div class="school-breadcrumb"><span>School</span><span>/</span><span>Class {profile.grade}</span><span>/</span><strong>{mode === 'home' ? 'My space' : SCHOOL_MODES.find(m => m.id === mode)?.label}</strong><span class="school-preview-label">Early preview</span></div>
        {profile.grade >= 11 && <section class="school-streams"><label class="school-field">Your direction<select aria-label="Subject direction" value={profile.stream} onChange={e => updateSelection(profile.grade, e.currentTarget.value as SchoolStream)}>{SCHOOL_STREAMS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></label><p>{SCHOOL_STREAMS.find(s => s.id === profile.stream)?.detail}<span>Suggested subject groups. Choose “All subjects” to explore other combinations.</span></p></section>}

        {mode === 'home' && <>
          <section class="school-hero"><div class="school-hero-copy"><span class="school-kicker"><span class="school-live-dot"/>{copy.label}</span><h1>{copy.title.split('\n').map((line, i) => <span key={i}>{line}</span>)}</h1><p>{copy.description}</p><a class="school-button" href={href('learn')}>Let’s explore<Icon name="arrow" size={18}/></a><span class="school-hero-footnote">Free to explore. Room to grow.</span></div>
            <div class="school-hero-art" aria-hidden="true"><span class="school-art-orbit"/><span class="school-art-star star-one">✳</span><span class="school-art-star star-two">✦</span><div class="school-art-note"><span>A LITTLE DISCOVERY</span><strong>½ <span>=</span> ²⁄₄</strong><div class="school-fraction-dots"><i/><i/><i/><i/></div><small>Different parts. Same whole.</small></div><div class="school-art-book"><Icon name="book" size={53}/><span>one new idea</span></div><span class="school-art-code">{'{ hello, world }'}</span></div>
          </section>
          <section class="school-section"><div class="school-section-heading"><h2>How would you like to explore?</h2><span class="school-small">Make a little room for curiosity.</span></div><div class="school-mode-grid">{SCHOOL_MODES.map(item => <a class="school-mode-card" href={href(item.id)} key={item.id}><span class={`school-icon-tile ${item.color}`}><Icon name={item.icon} size={27}/></span><h3>{item.label}<Icon name="arrow" size={16}/></h3><p>{item.description}</p>{item.id === 'ask' && <span class="school-small">Lesson recap available · AI planned</span>}</a>)}</div></section>
          <div class="school-dashboard-columns"><section class="school-section"><div class="school-section-heading"><h2>Your subjects</h2><a href={href('learn')} class="school-text-link">Explore all <span aria-hidden="true">↗</span></a></div>{subjectCards()}</section><aside class="school-section"><div class="school-section-heading"><h2>A step worth taking</h2></div>{nextLesson && <div class="school-next-card"><span class="school-kicker">{profile.completed.includes(nextLesson.id) ? 'Revisit an idea' : 'Start somewhere good'}</span><span class="school-next-symbol" aria-hidden="true">✦</span><h3>{nextLesson.title}</h3><p>{nextLesson.summary}</p><span class="school-small"><Icon name="clock" size={14}/>{nextLesson.minutes} min · Class {profile.grade}</span><a class="school-button" href={href('learn', { lesson: nextLesson.id, subject: nextLesson.subject })}>{profile.completed.includes(nextLesson.id) ? 'Review lesson' : 'Explore this lesson'}<Icon name="arrow" size={17}/></a></div>}</aside></div>
          <section class="school-progress-summary"><span class="school-icon-tile mint"><Icon name="leaf"/></span><div><h3>Your learning is taking shape.</h3><p>{completeCount} of {lessons.length} starter lessons completed · {currentAttempts.length} quiz or test attempts</p></div><progress value={completeCount} max={Math.max(1, lessons.length)} aria-label={`${completeCount} of ${lessons.length} starter lessons completed`}/></section>
        </>}

        {mode === 'learn' && <>
          <div class="school-page-heading"><span class="school-kicker">Learn · Class {profile.grade}</span><h1>One idea at a time.</h1><p>Choose a subject. Read a little, try an example, and check your understanding.</p></div>
          {activeLesson ? <article class="school-panel school-lesson" lang={activeLesson.subject === 'hindi' ? 'hi' : 'en'}><button class="school-text-button" onClick={() => { setLessonId(''); history.replaceState(null, '', href('learn', { subject: activeLesson.subject })); }}>← Back to lessons</button><span class="school-kicker">{SCHOOL_SUBJECTS.find(s => s.id === activeLesson.subject)?.name} · {activeLesson.minutes} min · Starter lesson</span><h2>{activeLesson.title}</h2><p class="school-lesson-outcome">{activeLesson.outcome}</p>{activeLesson.sections.map(section => <section key={section.title}><h3>{section.title}</h3><p>{section.text}</p></section>)}<section class="school-example"><span class="school-kicker">Let’s see it in action</span><p>{activeLesson.example}</p></section><div class="school-actions"><button class="school-button" disabled={profile.completed.includes(activeLesson.id)} onClick={() => setProfile(p => ({ ...p, completed: [...new Set([...p.completed, activeLesson.id])] }))}>{profile.completed.includes(activeLesson.id) ? '✓ Lesson completed' : 'Mark as completed'}</button><a class="school-button secondary" href={href('quiz', { subject: activeLesson.subject, lesson: activeLesson.id })}>Practise this idea<Icon name="arrow" size={17}/></a><a class="school-text-link" href={href('ask', { lesson: activeLesson.id })}>Revisit the explanation</a></div></article> : <>
            {subjectFilters()}{filtered.length ? <div class="school-lesson-grid">{filtered.map(lesson => <article class="school-panel school-lesson-card" key={lesson.id}><span class="school-kicker">{SCHOOL_SUBJECTS.find(s => s.id === lesson.subject)?.name}</span><h2>{lesson.title}</h2><p>{lesson.summary}</p><div class="school-section-heading"><span class="school-small">{lesson.minutes} min · Starter lesson</span>{profile.completed.includes(lesson.id) && <span class="school-tag is-correct">Completed</span>}</div><button class="school-button secondary" onClick={() => openLesson(lesson)}>{profile.completed.includes(lesson.id) ? 'Read again' : 'Start learning'}<Icon name="arrow" size={17}/></button></article>)}</div> : <div class="school-panel school-empty"><Icon name="book" size={36}/><h2>This shelf is growing.</h2><p>Class {profile.grade} {SCHOOL_SUBJECTS.find(s => s.id === subject)?.name} lessons are being prepared. You can explore another subject or visit the official textbook library.</p><a class="school-button secondary" href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener noreferrer">NCERT textbooks ↗</a></div>}
          </>}
        </>}

        {mode === 'play' && <><div class="school-page-heading"><span class="school-kicker">Play · Class {profile.grade}</span><h1>Good things grow through play.</h1><p>A small challenge for your memory and a little space to enjoy learning.</p></div><SchoolPlay key={profile.grade} grade={profile.grade}/></>}
        {mode === 'code' && <><div class="school-page-heading"><span class="school-kicker">Code · First steps</span><h1>Think it. Build it. Try it.</h1><p>Start with sequencing and debugging. No typing experience needed.</p></div><SchoolCode key={profile.grade} completed={profile.codeCompleted} onComplete={id => setProfile(p => ({ ...p, codeCompleted: [...new Set([...p.codeCompleted, id])] }))}/></>}

        {(mode === 'quiz' || mode === 'tests') && <>
          <div class="school-page-heading"><span class="school-kicker">{mode === 'tests' ? 'Tests' : 'Quiz'} · Class {profile.grade}</span><h1>{mode === 'tests' ? 'Find out what’s clicking.' : 'Three ways to challenge yourself.'}</h1><p>{mode === 'tests' ? 'Short checks for individual starter lessons, with explanations after you submit.' : 'Choose your pace, pick a subject, and give it a go.'}</p></div>
          {session ? <SchoolQuiz key={`${profile.grade}-${session.id}-${quizMode}`} lesson={session} mode={mode === 'tests' ? 'test' : quizMode} onFinish={recordAttempt} onClose={() => setSession(null)}/> : <>
            {mode === 'quiz' && <div class="school-quiz-modes">{([{ id: 'smash', title: 'Smash', subtitle: 'Tap. Discover. Repeat.', desc: 'Big answer tiles and feedback after every question.', color: 'peach', icon: 'bolt' }, { id: 'rush', title: 'Rush', subtitle: 'A little race with yourself.', desc: 'A 60-second round. Review your answers at the end.', color: 'yellow', icon: 'clock' }, { id: 'think', title: 'Think', subtitle: 'Good ideas take their time.', desc: 'Untimed questions with room to explain your thinking.', color: 'lavender', icon: 'chat' }] as const).map(item => <button key={item.id} class={`school-panel school-quiz-mode ${quizMode === item.id ? 'is-selected' : ''}`} onClick={() => setQuizMode(item.id)} aria-pressed={quizMode === item.id}><span class={`school-icon-tile ${item.color}`}><Icon name={item.icon}/></span><h2>{item.title}</h2><strong>{item.subtitle}</strong><p>{item.desc}</p><span class="school-mode-indicator">{quizMode === item.id ? '✓ Selected' : 'Choose this mode'}</span></button>)}</div>}
            {subjectFilters()}
            {filtered.length ? <div class="school-test-list">{filtered.map(lesson => <article class="school-panel school-test-card" key={lesson.id}><div><span class="school-kicker">{SCHOOL_SUBJECTS.find(s => s.id === lesson.subject)?.name}</span><h3>{lesson.title}</h3><p>{lesson.questions.length} questions · {mode === 'tests' ? 'Untimed starter test' : quizMode === 'rush' ? '60 seconds' : 'At your own pace'}</p></div><button class="school-button secondary" onClick={() => { setSession(lesson); document.getElementById('school-main')?.scrollIntoView({ behavior: 'instant' }); }}>Start {mode === 'tests' ? 'test' : quizMode}<Icon name="arrow" size={17}/></button></article>)}</div> : <div class="school-panel school-empty"><h2>More questions are on their way.</h2><p>This subject does not have a starter check for Class {profile.grade} yet. Choose another subject to practise.</p></div>}
            {!!currentAttempts.length && <section class="school-section"><h2>Your recent practice</h2><div class="school-panel">{currentAttempts.slice(-5).reverse().map((attempt, i) => <div class="school-attempt-row" key={`${attempt.completedAt}-${i}`}><span>{SCHOOL_LESSONS.find(l => l.id === attempt.lessonId)?.title}<small>{attempt.mode === 'test' ? 'Subject check' : attempt.mode}</small></span><strong>{attempt.correct} / {attempt.total}</strong></div>)}</div></section>}
          </>}
        </>}

        {mode === 'ask' && <><div class="school-page-heading"><span class="school-kicker">Ask · Your lesson companion</span><h1>A little help goes a long way.</h1><p>Revisit the idea in front of you. The AI tutor will join this space in a future release.</p></div><AskPanel key={`${profile.grade}-${profile.stream}-${ready}`} lessons={lessons} initial={lessonId}/></>}

        <footer class="school-footer"><p><strong>A growing learning space.</strong> Original starter activities for a CBSE/NCERT-first platform. Full syllabus mapping is in progress.</p><div>{SCHOOL_REFERENCES.map(ref => <a href={ref.href} target="_blank" rel="noopener noreferrer" key={ref.href}>{ref.label} ↗</a>)}</div><span>Class selection and progress stay in this browser. No account needed.</span></footer>
      </main>
    </div>
  </div>;
}
