import { useEffect, useRef, useState } from 'preact/hooks';
import { ROBOT_CHALLENGES, runSchoolRobot } from '../../lib/school';
import type { RobotCommand } from '../../lib/school';
import Icon from './SchoolIcon';

export function SchoolCode({ completed, onComplete }: { completed: string[]; onComplete: (id: string) => void }) {
  const [level, setLevel] = useState(0);
  const [commands, setCommands] = useState<RobotCommand[]>([]);
  const [result, setResult] = useState<ReturnType<typeof runSchoolRobot> | null>(null);
  const [hint, setHint] = useState(false);
  const challenge = ROBOT_CHALLENGES[level];
  const arrows = { up: '↑', right: '→', down: '↓', left: '←' };
  const final = result?.path.at(-1) || [0, 0];
  function reset(next = level) { setLevel(next); setCommands([]); setResult(null); setHint(false); }
  return <>
    <div class="school-section-heading"><h2>Code a little adventure</h2><span class="school-tag">Beginner · Sequencing</span></div>
    <p>Write a program with direction blocks. Run it, inspect the path, and change a step if you need to.</p>
    <div class="school-pills" aria-label="Coding challenges">{ROBOT_CHALLENGES.map((c, i) => <button class={level === i ? 'is-active' : ''} aria-pressed={level === i} onClick={() => reset(i)} key={c.id}>Challenge {i + 1}{completed.includes(c.id) ? ' ✓' : ''}</button>)}</div>
    <section class="school-panel school-code-grid">
      <div><span class="school-kicker">Challenge {level + 1}</span><h3>{challenge.title}</h3>
        <div class="school-robot-board" role="img" aria-label={`4 by 4 board. Robot at row ${final[1] + 1}, column ${final[0] + 1}. Goal at row ${challenge.goal[1] + 1}, column ${challenge.goal[0] + 1}. ${challenge.blocks.length ? `Blocked squares: ${challenge.blocks.map(([x, y]) => `row ${y + 1} column ${x + 1}`).join('; ')}.` : 'No blocked squares.'}`}>
          {Array.from({ length: 16 }, (_, i) => {
            const x = i % 4, y = Math.floor(i / 4);
            const block = challenge.blocks.some(([bx, by]) => bx === x && by === y);
            const robot = final[0] === x && final[1] === y;
            const goal = challenge.goal[0] === x && challenge.goal[1] === y;
            const visited = result?.path.some(([px, py]) => px === x && py === y);
            return <span class={`school-robot-cell ${block ? 'is-blocked' : ''} ${visited ? 'is-visited' : ''}`} key={i} aria-hidden="true">{robot ? '▣' : goal ? '★' : block ? '✿' : '·'}</span>;
          })}
        </div><p class="school-small">▣ Robot · ★ Goal · ✿ Garden</p>
      </div>
      <div class="school-program"><h3>Your instructions</h3><p class="school-small">Use up to {challenge.limit} steps. The robot starts at the top left on every run.</p>
        <div class="school-directions">{(Object.keys(arrows) as RobotCommand[]).map(direction => <button class="school-button secondary" disabled={commands.length >= challenge.limit} onClick={() => { setCommands(previous => previous.length < challenge.limit ? [...previous, direction] : previous); setResult(null); }} aria-label={`Add ${direction} instruction`} key={direction}>{arrows[direction]}<span>{direction}</span></button>)}</div>
        <ol class="school-command-list" aria-label="Your program">{commands.length ? commands.map((c, i) => <li key={i}><span>{i + 1}</span>{arrows[c]} {c}</li>) : <li class="school-empty-step">Choose a direction to start your program.</li>}</ol>
        <div class="school-actions"><button class="school-button" disabled={!commands.length} onClick={() => { const next = runSchoolRobot(commands, challenge); setResult(next); if (next.success) onComplete(challenge.id); }}><Icon name="play" size={18}/>Run program</button>
          <button class="school-button secondary" disabled={!commands.length} onClick={() => { setCommands(previous => previous.slice(0, -1)); setResult(null); }}>Undo</button><button class="school-text-button" onClick={() => reset()}>Reset</button></div>
        {result && <div class="school-feedback" role="status">{result.message}{result.success && level < 2 && <button class="school-text-button" onClick={() => reset(level + 1)}>Try the next challenge →</button>}</div>}
        <button class="school-text-button" onClick={() => setHint(!hint)} aria-expanded={hint}>{hint ? 'Hide hint' : 'A little hint?'}</button>{hint && <p class="school-small">{challenge.hint}</p>}
      </div>
    </section>
    <div class="school-note"><Icon name="code"/><p><strong>You just practised an algorithm.</strong> The order of your instructions changes the result. Finding and fixing a wrong step is called debugging.</p></div>
  </>;
}

const MEMORY_PAIRS = {
  young: [['1', '●'], ['2', '● ●'], ['3', '● ● ●'], ['4', '● ● ● ●'], ['5', '● ● ● ● ●'], ['6', '● ● ● ● ● ●']],
  middle: [['1/2', '0.5'], ['1/4', '0.25'], ['3/4', '0.75'], ['1/5', '0.2'], ['1/10', '0.1'], ['2/5', '0.4']],
  senior: [['2³', '8'], ['3²', '9'], ['4²', '16'], ['5²', '25'], ['2⁵', '32'], ['6²', '36']],
};

export function SchoolPlay({ grade }: { grade: number }) {
  const [cards, setCards] = useState<{ pair: number; text: string }[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const locked = useRef(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  function start() {
    clearTimeout(timer.current); locked.current = false;
    const pairs = grade <= 4 ? MEMORY_PAIRS.young : grade <= 8 ? MEMORY_PAIRS.middle : MEMORY_PAIRS.senior;
    const deck = pairs.flatMap((pair, id) => pair.map(text => ({ pair: id, text })));
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    setCards(deck); setOpen([]); setMatched([]); setMoves(0); setMessage('Choose two cards to find a matching pair.');
  }
  function flip(i: number) {
    if (locked.current || open.includes(i) || matched.includes(cards[i].pair)) return;
    const next = [...open, i]; setOpen(next);
    if (next.length === 2) {
      setMoves(moves + 1);
      const a = cards[next[0]], b = cards[next[1]];
      if (a.pair === b.pair) {
        const found = [...matched, a.pair]; setMatched(found); setOpen([]);
        setMessage(found.length === 6 ? `All six pairs found in ${moves + 1} turns. Well done!` : `A match: ${a.text} and ${b.text}. ${found.length} of 6 pairs found.`);
      } else {
        locked.current = true; setMessage(`${a.text} and ${b.text} do not match. Remember their places and try again.`);
        timer.current = setTimeout(() => { setOpen([]); locked.current = false; }, 1400);
      }
    }
  }
  return <>
    <div class="school-section-heading"><h2>A playful pause</h2><span class="school-tag">No timer. Just curiosity.</span></div>
    <section class="school-panel school-memory-panel"><div class="school-section-heading"><div><span class="school-kicker">Memory garden</span><h3>{grade <= 4 ? 'Match numbers to dots' : grade <= 8 ? 'Match fractions to decimals' : 'Match powers to values'}</h3></div><span class="school-icon-tile peach"><Icon name="leaf" size={30}/></span></div>
      <p>Turn over two cards. Find the pairs with the same value. A little memory, a little maths.</p>
      {!cards.length ? <button class="school-button" onClick={start}>Let’s play<Icon name="arrow" size={18}/></button> : <>
        <div class="school-section-heading"><span>{matched.length} / 6 pairs</span><span>{moves} turns</span></div>
        <div class="school-memory-board">{cards.map((card, i) => {
          const found = matched.includes(card.pair), visible = found || open.includes(i);
          return <button key={i} class={`school-memory-card ${visible ? 'is-open' : ''} ${found ? 'is-matched' : ''}`} disabled={found || open.includes(i)} aria-label={visible ? `Card ${i + 1}: ${card.text}${found ? ', matched' : ''}` : `Turn over card ${i + 1}`} onClick={() => flip(i)}>{visible ? card.text : <Icon name="leaf" size={26}/>}</button>;
        })}</div>
        <p class="school-feedback" role="status">{message}</p><button class="school-button secondary" onClick={start}>{matched.length === 6 ? 'Play again' : 'Restart game'}</button>
      </>}
    </section>
  </>;
}
