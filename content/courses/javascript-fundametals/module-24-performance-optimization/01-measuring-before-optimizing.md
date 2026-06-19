# Measuring Before Optimizing

Performance optimization means making a program faster, smoother, or less resource-hungry.

Good optimization starts with measurement.

If you guess, you can easily spend time improving code that was not causing the problem.

## What Performance Can Mean

Performance is not only "how fast does this function run?"

In JavaScript applications, performance can include:

- how quickly the page becomes usable
- how smoothly scrolling and animation run
- how quickly input responds
- how much network data is downloaded
- how much memory the page keeps
- how often the UI freezes
- how much battery or CPU the app uses

A change that improves one area can hurt another.

For example, caching data can reduce repeated calculations, but it can also increase memory usage.

## Start With a Question

Before optimizing, define the problem.

Good questions:

- "Why does typing in this search box feel slow?"
- "Why does this page take five seconds to become interactive?"
- "Why does scrolling stutter after many items are loaded?"
- "Why does memory keep growing after navigating between screens?"

Vague questions like "How do I make the app faster?" are harder to answer.

## Simple Timing With `performance.now()`

For small experiments, use `performance.now()`.

```js
const start = performance.now();

const result = expensiveCalculation();

const end = performance.now();

console.log(`Calculation took ${end - start}ms`);
```

`performance.now()` is more precise than `Date.now()` and is designed for performance measurement.

## Timing Repeated Work

One run may be misleading.

The browser may be warming up, the computer may be busy, or garbage collection may happen during the test.

Run the work many times when testing small operations.

```js
const start = performance.now();

for (let i = 0; i < 10000; i++) {
  expensiveCalculation();
}

const end = performance.now();

console.log(`Total time: ${end - start}ms`);
```

This does not replace real profiling, but it can help you compare two small approaches.

## Use `console.time()`

`console.time()` and `console.timeEnd()` are convenient during debugging.

```js
console.time("build menu");

buildMenu(items);

console.timeEnd("build menu");
```

The label must match.

## Measure Real User Impact

A function that takes 10 milliseconds may not matter.

A 10 millisecond task that runs on every mouse movement may matter a lot.

Ask:

- How often does this run?
- Does it block user input?
- Does it delay rendering?
- Does it happen during startup?
- Does the user notice it?

Optimization should focus on visible impact.

## Common Performance Metrics

Browser performance is often discussed with user-centered metrics.

| Metric | What It Measures |
| --- | --- |
| First Contentful Paint | when the first text or image appears |
| Largest Contentful Paint | when the main content appears |
| Interaction to Next Paint | how quickly the page responds to interaction |
| Cumulative Layout Shift | how much the page unexpectedly moves |
| Total Blocking Time | how much long JavaScript work blocks interaction |

You do not need to memorize every metric now.

The important idea is that performance should be measured from the user's point of view.

## Avoid Micro-Optimization First

Micro-optimization means improving tiny details that may not matter.

Example:

```js
// This difference is usually not worth worrying about by itself.
for (let i = 0; i < items.length; i++) {
  total += items[i].price;
}

for (const item of items) {
  total += item.price;
}
```

The first version may be faster in some situations.

The second version may be clearer.

Choose clarity unless measurement shows the code is a real bottleneck.

## Optimization Checklist

Before changing code, ask:

1. What is slow?
2. How did you measure it?
3. How often does it happen?
4. Is it blocking rendering or input?
5. Will the fix make the code harder to understand?
6. What tradeoff does the fix introduce?

## Common Mistakes

- Optimizing code because it "looks slow" without measuring.
- Comparing tiny snippets that are not the real bottleneck.
- Making code harder to read for no visible user benefit.
- Forgetting that network, rendering, and memory can matter more than raw JavaScript speed.
- Measuring in development mode and assuming production will behave the same.

## Summary

Measure before optimizing.

Define the user-visible problem, gather evidence, make one focused change, and measure again.

The best optimization is not the cleverest one.

It is the one that improves the real bottleneck without making the code unnecessarily complex.
