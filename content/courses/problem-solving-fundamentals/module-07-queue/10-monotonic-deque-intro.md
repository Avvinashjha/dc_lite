# The Monotonic Deque Pattern

A **monotonic deque** is the queue-world cousin of the monotonic stack from Module 06. It's a deque whose elements are kept in sorted order (either increasing or decreasing) with respect to their values — so the **front** of the deque is always the running min or max of the items currently "live" in a window.

It's the killer tool for **sliding-window extremum** problems: sliding window maximum (LC 239) and sliding window minimum are the canonical uses; applications extend to more advanced problems like LC 862 (Shortest Subarray with Sum at Least K) and LC 1425 (Constrained Subsequence Sum).

## When to reach for it

You want a monotonic deque when a problem asks:

- The **maximum (or minimum)** of a sliding window as it moves over an array.
- For each position, the min/max of **the last K elements**.
- Streaming max/min over a fixed time/position window.

If you can phrase the answer as "max (or min) over the last K items," the monotonic deque is your tool.

## The key insight

Consider a sliding window asking for its maximum. Say the window currently contains `[3, 1, 4, 1, 5]`. The maximum is `5`. When the window slides right and evicts the leftmost `3`, the maximum doesn't change — `5` is still in the window.

**Smaller elements that appear before a larger one cannot ever be the window's maximum** while the larger one is still in the window. So as we add each new element to the back, we can throw away every smaller element from the back of the deque — they are **dominated**. Whatever survives forms a **monotonically decreasing deque** (by value, from front to back).

For sliding window **minimum**, mirror the logic: monotonically increasing deque, discard larger elements from the back.

## The generic template (sliding window maximum)

```javascript
function slidingWindowMax(nums, k) {
  const n = nums.length;
  const dq = [];            // stores indices; values at those indices are decreasing front-to-back
  const result = [];

  for (let i = 0; i < n; i++) {
    // 1. evict indices that have fallen out of the window
    while (dq.length > 0 && dq[0] <= i - k) dq.shift();

    // 2. evict all dominated tail indices
    while (dq.length > 0 && nums[dq[dq.length - 1]] < nums[i]) dq.pop();

    // 3. push current index
    dq.push(i);

    // 4. record the front (it's the max of the current window) once the first window is formed
    if (i >= k - 1) result.push(nums[dq[0]]);
  }
  return result;
}
```

Three events, in this order:

1. **Evict from front.** The front index may have aged out of the window.
2. **Evict from back.** Any index whose value is smaller than the incoming one is dominated and can never be the max while the new one is present.
3. **Push.** Add the new index at the back.

After step 3, if we've processed at least `k` elements, the front's value is the current window's max.

## Why indices, not values

The deque must know when an element **falls out of the window**. That's a position check — which needs the index. Storing values alone would lose that information.

## Walkthrough

```text
nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3

i=0 val=1
  no evict (empty)
  push 0                            dq=[0]       vals=[1]
  i=0 < k-1=2, no output
i=1 val=3
  no front-evict
  tail val 1 < 3, pop 0             dq=[]
  push 1                            dq=[1]       vals=[3]
  i=1 < 2, no output
i=2 val=-1
  no front-evict
  tail val 3 >= -1, no pop
  push 2                            dq=[1,2]     vals=[3,-1]
  i=2 >= 2, output nums[1]=3        result=[3]
i=3 val=-3
  front index 1; 1 <= 3-3=0? no
  tail val -1 >= -3, no pop
  push 3                            dq=[1,2,3]   vals=[3,-1,-3]
  output nums[1]=3                  result=[3,3]
i=4 val=5
  front index 1; 1 <= 4-3=1? yes shift -> dq=[2,3]
  tail val -3 < 5 pop 3 -> dq=[2]
  tail val -1 < 5 pop 2 -> dq=[]
  push 4                            dq=[4]       vals=[5]
  output nums[4]=5                  result=[3,3,5]
i=5 val=3
  front index 4; 4 <= 5-3=2? no
  tail val 5 >= 3, no pop
  push 5                            dq=[4,5]     vals=[5,3]
  output nums[4]=5                  result=[3,3,5,5]
i=6 val=6
  front index 4; 4 <= 6-3=3? no
  tail val 3 < 6 pop 5; tail val 5 < 6 pop 4; dq=[]
  push 6                            dq=[6]       vals=[6]
  output 6                          result=[3,3,5,5,6]
i=7 val=7
  front index 6; 6 <= 7-3=4? no
  tail val 6 < 7 pop; dq=[]
  push 7                            dq=[7]       vals=[7]
  output 7                          result=[3,3,5,5,6,7]
```

## Why it's O(n)

Every index is **pushed once** and **popped at most once** (either from the front as it ages out, or from the back when dominated). Total work across all iterations is O(n) pushes and O(n) pops. The inner loops look quadratic but amortize to linear — the same amortized argument as monotonic stacks.

Note on implementation: `dq.shift()` is O(n) in naive JS. For `n` up to ~10⁵ it's usually fine in practice; for tight problems, use a head-index deque or a circular buffer. The next lesson shows the proper implementation for LC 239.

## Four flavors

| Goal | Invariant (front to back) | What to pop from the back |
| --- | --- | --- |
| Sliding window max | Strictly decreasing | `vals[back] < x` |
| Sliding window max with ties kept | Non-strictly decreasing | `vals[back] < x` (same; keep equals) |
| Sliding window min | Strictly increasing | `vals[back] > x` |
| Sliding window min with ties | Non-strictly increasing | `vals[back] > x` |

For "max," strict `<` is almost always what you want — equal values can stay without causing correctness issues and keeping them around makes no behavioral difference for the answer.

## Monotonic stack vs monotonic deque

| | Monotonic stack | Monotonic deque |
| --- | --- | --- |
| Use case | "Next greater / previous smaller" | "Max / min over sliding window" |
| Ends used | One end (top) | Both ends (front & back) |
| Key extra op | N/A | Front-eviction when element falls out of window |
| Classic problem | Largest rectangle in histogram | Sliding window maximum |

You already know the stack version from Module 06 — this is the natural extension when a **window** (not just a prefix history) constrains which elements count.

## Common bugs

1. **Evicting from front before checking the window size.** Result: incorrect outputs for the first `k - 1` elements. Mentally separate "window formation" (before `i >= k - 1`) from "window slides" (after).
2. **Storing values instead of indices.** You can't tell when an element has aged out.
3. **`<=` in the back-eviction for max.** Correct for "include only strictly-dominating" semantics; incorrect (but mostly harmless) for strict ordering. Stick with `<` for clarity.
4. **`shift()` cost in hot loops.** For LC 239 with n=10⁵ it's borderline; know how to swap to a head-index deque (next lesson).

:::quiz
question: In a monotonic deque for sliding-window max, which elements are evicted from the BACK when a new element `x` arrives?
options:
  - All elements with value strictly less than `x`, because they can never be the window max while `x` is present.
  - The single largest element on the back.
answer: 0
explanation: Any smaller element is dominated by `x` for the rest of `x`'s lifetime in the window.
:::

:::quiz
question: Which elements are evicted from the FRONT, and when?
options:
  - The front index, whenever it has aged out of the current window (index <= i - k).
  - The front, whenever it's larger than the back.
answer: 0
explanation: The front is the current max; it only leaves when it slides out of the window's range.
:::

:::quiz
question: What is the overall time complexity of the sliding-window-max template?
options:
  - O(n · k)
  - O(n) amortized
answer: 1
explanation: Each index is pushed once and popped at most once; total work is linear in n.
:::

:::exercise
title: Monotonic deque template
description: Implement `slidingWindowMax(nums, k)` returning the max of each size-k window using a monotonic deque of indices. Accept shift() being O(n); we'll optimize in the next lesson.
starterCode: |
  function slidingWindowMax(nums, k) {
    const dq = [];
    const result = [];
    // for i from 0 to n-1:
    //   evict front if out of window
    //   evict back while nums[back] < nums[i]
    //   push i
    //   if i >= k-1, push nums[dq[0]] to result
    return result;
  }

  console.log(slidingWindowMax([1,3,-1,-3,5,3,6,7], 3)); // [3,3,5,5,6,7]
  console.log(slidingWindowMax([1], 1));                  // [1]
  console.log(slidingWindowMax([9,11], 2));               // [11]
:::

## Practice

Read through this template once; the next lesson solves Sliding Window Maximum end-to-end and tightens the implementation to true O(n).
