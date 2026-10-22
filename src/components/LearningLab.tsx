import { useId, useState } from 'preact/hooks';
import type { LearningLabData } from '../types/learningLab';
import '../styles/learning-lab.scss';

export default function LearningLab({ data }: { data: LearningLabData }) {
  const group = useId();
  const [step, setStep] = useState(-1);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  function reset() { setStep(-1); setSelected(null); setChecked(false); }
  return <section class="learning-lab" aria-label={data.title}>
    <p class="learning-lab__eyebrow">Predict · trace · explain</p>
    <h3>{data.title}</h3>
    <p>This is a worked walkthrough. Run and modify the Java example in your local environment.</p>
    <pre tabIndex={0} aria-label="Java example"><code>{data.code}</code></pre>
    <fieldset>
      <legend>{data.prediction.question}</legend>
      {data.prediction.options.map((option, index) => <label key={index}>
        <input type="radio" name={group} checked={selected === index} disabled={checked}
          onChange={() => setSelected(index)} />
        <span>{option}</span>
      </label>)}
    </fieldset>
    <div class="learning-lab__actions">
      <button type="button" disabled={selected === null || checked} onClick={() => setChecked(true)}>Check prediction</button>
      <button type="button" onClick={reset}>Reset activity</button>
    </div>
    <div aria-live="polite" aria-atomic="true">
      {checked && <p><strong>{selected === data.prediction.answer ? 'Correct.' : 'Review this idea.'}</strong> {data.prediction.explanation}</p>}
    </div>
    <div class="learning-lab__trace" aria-live="polite" aria-atomic="true">
      {step < 0 ? <p>Make a prediction, then walk through the example one step at a time.</p> : <>
        <p class="learning-lab__eyebrow">Step {step + 1} of {data.steps.length}</p>
        <h4>{data.steps[step].label}</h4><p>{data.steps[step].detail}</p>
        {step === data.steps.length - 1 && <><p>Expected result</p><pre><code>{data.output}</code></pre></>}
      </>}
    </div>
    <div class="learning-lab__actions">
      <button type="button" disabled={step < 0} onClick={() => setStep(step - 1)}>Previous step</button>
      <button type="button" disabled={step >= data.steps.length - 1} onClick={() => setStep(step + 1)}>{step < 0 ? 'Start trace' : 'Next step'}</button>
    </div>
    <noscript><p>Enable JavaScript for prediction and stepping. The complete walkthrough follows.</p>
      <ol>{data.steps.map(item => <li><strong>{item.label}:</strong> {item.detail}</li>)}</ol>
      <pre>{data.output}</pre><p>{data.prediction.explanation}</p>
    </noscript>
  </section>;
}
