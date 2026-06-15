# Profiling with DevTools

Performance work should start with evidence.

React DevTools and browser DevTools help you find what is actually slow instead of guessing.

## Start With a Reproduction

Write down the slow behavior clearly.

Examples:

- "Typing in the product search lags after 2,000 products."
- "Opening the reports route takes four seconds."
- "Scrolling the activity feed stutters on low-end devices."
- "Changing one setting re-renders the entire dashboard."

If you cannot reproduce the issue, you cannot reliably verify the fix.

## React DevTools Profiler

The React DevTools Profiler records component renders.

A typical workflow:

1. Open React DevTools.
2. Go to the Profiler tab.
3. Start recording.
4. Perform the slow interaction.
5. Stop recording.
6. Inspect which components rendered and how long they took.

Look for:

- components that render many times
- expensive components
- renders caused by unexpected parent updates
- context changes that update too much of the tree
- lists with many slow rows

## Flamegraph and Ranked Views

The flamegraph shows the component tree for a commit.

The ranked view helps find components that took the most time.

Do not only look at the largest bar once. Check whether it appears repeatedly across commits.

A component that takes 8ms once may matter less than a component that takes 2ms hundreds of times.

## Why Did This Render?

React DevTools can help explain render causes in some setups.

Common causes include:

- props changed
- state changed
- context changed
- parent rendered
- hook value changed

This helps decide whether to move state, memoize props, split context, or leave the code alone.

## Browser Performance Panel

React profiling shows component work. Browser profiling shows main-thread work.

Use the browser Performance panel to inspect:

- long tasks
- scripting time
- layout
- paint
- network timing
- CPU throttling
- memory pressure

React may not be the bottleneck. The slow part could be layout, a large image, a blocking script, or an API response.

## Measure Before and After

Make one focused change and record again.

Good performance notes include:

- reproduction steps
- device or throttling settings
- before measurement
- change made
- after measurement
- remaining risk

This avoids "it feels faster on my machine" decisions.

## Over-Optimization Traps

Avoid these traps:

- adding `React.memo` everywhere without measuring
- memoizing cheap calculations
- hiding stale dependency bugs to reduce renders
- splitting code into tiny chunks that increase loading overhead
- optimizing development-only Strict Mode behavior
- making code much harder to read for a tiny gain

Performance improvements should make the product better, not just make the code look optimized.

## Common Fixes After Profiling

Depending on the evidence, fixes may include:

- moving state closer to where it is used
- splitting a large component
- memoizing an expensive child
- stabilizing object or function props
- virtualizing a large list
- debouncing expensive input work
- code splitting a heavy route
- reducing context provider churn
- moving expensive work off the main thread

Choose the smallest fix that addresses the measured problem.

## Common Mistakes

- Profiling only in development and assuming numbers match production.
- Measuring without a consistent reproduction.
- Looking only at render count, not render cost.
- Optimizing React when the bottleneck is network or layout.
- Making several changes at once and not knowing which one helped.

:::quiz
question: What is the best first step in React performance work?
options:
  - Create a clear reproduction and measure the slow interaction
  - Add React.memo to every component
  - Replace every function with useCallback
  - Disable all effects
answer: 0
explanation: A clear reproduction and measurement tell you where the bottleneck is and whether your fix worked.
:::

## Recap

Profiling turns performance work from guessing into debugging.

Use React DevTools for component render behavior and browser DevTools for main-thread, network, layout, paint, and memory evidence.

## Practice

Profile a slow search interaction.

Record the baseline, apply one optimization, record again, and write a short note explaining whether the change actually helped.
