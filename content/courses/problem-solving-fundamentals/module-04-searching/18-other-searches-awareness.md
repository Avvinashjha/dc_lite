# Other Searches: Exponential, Interpolation, Ternary (Awareness)

This lesson is **awareness-only**. These variants are mentioned in algorithms textbooks and sometimes pop up in trivia questions, but they are **rarely drilled in coding interviews**. Skim once; do not spend drill time here unless a specific problem demands one.

## Exponential search (aka galloping)

Use case: a **sorted** array where the target is likely near the front, or the array has unknown / huge length.

Idea: double an index `bound` starting at `1` until the value at that index is `>= target` (or you hit the end), then binary-search inside `[bound/2, min(bound, n - 1)]`.

```javascript
function exponentialSearch(arr, target) {
  const n = arr.length;
  if (n === 0) return -1;
  if (arr[0] === target) return 0;

  let bound = 1;
  while (bound < n && arr[bound] < target) bound *= 2;

  let lo = bound >>> 1;
  let hi = Math.min(bound, n - 1);
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

**Time:** O(log k) where `k` is the target's index. **Space:** O(1). Useful for huge arrays when `k` is small — most interview problems give you `n` up front so plain binary search is enough.

## Interpolation search

Use case: **sorted numeric** arrays where values are **uniformly distributed** (e.g., evenly-spaced IDs).

Idea: instead of probing the midpoint, estimate where `target` should sit by linear interpolation:

```text
pos = lo + (target - arr[lo]) / (arr[hi] - arr[lo]) * (hi - lo)
```

**Time:** O(log log n) average on uniform data, **O(n) worst** when the distribution is skewed. Fragile — interviewers essentially never ask for this.

## Ternary search

Use case: finding the maximum (or minimum) of a **unimodal** function on `[L, R]` — the function goes up then down, or down then up.

Idea: pick two interior probes `m1` and `m2` a third of the way in, compare `f(m1)` with `f(m2)`, discard one third each step.

For the array peak problem from lesson 13, **binary search on the slope** is simpler and just as fast. Ternary search is usually taught for continuous functions in competitive programming contexts.

## String search

**Naive** substring search runs in O(n · m). **KMP** and **Boyer-Moore** are classical O(n + m) algorithms with pattern preprocessing. These are their own module; they do not belong in an introductory searching module. If a string-search question comes up in an interview, the expected answer is usually the naive O(n · m) scan unless the interviewer explicitly asks for better.

## What to remember

- For **interview** binary-search problems, the templates from lessons 03–15 cover essentially everything.
- Recognize the names of these variants so you can nod along if they come up in conversation.
- Do not invest drill time here until you have all the core templates memorized.

:::quiz
question: Exponential search is primarily useful when:
options:
  - The target is likely near the beginning of a large (possibly unbounded) sorted array.
  - The array is unsorted.
answer: 0
explanation: Doubling is cheap when k (the target's index) is small; it wastes no effort scanning the full length.
:::

:::quiz
question: Why is interpolation search rare in interviews?
options:
  - Its worst case degrades to O(n) on skewed distributions; plain binary search's O(log n) worst case is simpler and more robust.
  - It is wrong.
answer: 0
explanation: The complexity win only happens under uniform-distribution assumptions that rarely hold in interview inputs.
:::

:::quiz
question: When would you reach for ternary search over binary search on an array?
options:
  - When you genuinely have a continuous unimodal function and want to narrow the peak by thirds instead of halves.
  - Always — ternary is strictly faster.
answer: 0
explanation: For integer arrays, binary search on the slope (lesson 13) is simpler and equally fast.
:::

## Practice

No required practice for this lesson. Revisit once you are comfortable with all prior lessons; the next lesson is the complexity summary and the practice ladder.
