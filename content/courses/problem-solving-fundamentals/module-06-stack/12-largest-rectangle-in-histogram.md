# Largest Rectangle in Histogram

**LeetCode 84.** Given an array `heights` representing the heights of bars in a histogram (each of unit width), find the **area of the largest rectangle** that fits inside the histogram.

```text
heights = [2, 1, 5, 6, 2, 3]

   █
   █
   █ █
 █ █ █   █
 █ █ █ █ █
 █ █ █ █ █
 2 1 5 6 2 3
```

The largest rectangle here has height `5` spanning bars 2..3, so area `5 * 2 = 10`.

This is the canonical **hard** monotonic-stack problem. The idea is surprising the first time you see it, and then universally applicable.

## Key insight

For each bar `i`, the **widest rectangle of height `heights[i]`** that uses bar `i` as its shortest bar extends:

- **Leftward** until the first bar that is **strictly shorter** than `heights[i]`.
- **Rightward** until the first bar that is **strictly shorter** than `heights[i]`.

If `L[i]` is the index of the nearest shorter bar on the left (or `-1`), and `R[i]` is the nearest shorter bar on the right (or `n`), then the rectangle has:

```text
width  = R[i] - L[i] - 1
area   = heights[i] * width
```

The answer is the max over all `i`.

Both `L[]` and `R[]` come from a monotonic-increasing stack. Because of how the stack naturally reveals both on each pop, we can compute the answer in **a single pass**.

## The code

```javascript
function largestRectangleArea(heights) {
  const n = heights.length;
  const stack = [];    // indices with heights strictly increasing top-up
  let best = 0;

  for (let i = 0; i <= n; i++) {
    const curHeight = i === n ? 0 : heights[i];
    while (stack.length > 0 && heights[stack[stack.length - 1]] > curHeight) {
      const j = stack.pop();
      const left = stack.length === 0 ? -1 : stack[stack.length - 1];
      const width = i - left - 1;
      best = Math.max(best, heights[j] * width);
    }
    stack.push(i);
  }
  return best;
}
```

Two tricks here:

1. We iterate `i` up to and **including** `n`, using a sentinel height of `0`. That guarantees every real index gets popped (because 0 is shorter than everything), so no index is left behind.
2. When we pop `j`, the **previous** top of the stack (after popping) is the nearest shorter on the left — that's the `L[j]`. The current `i` is the nearest shorter on the right. Width is `i - left - 1`.

## Walkthrough

```text
heights = [2, 1, 5, 6, 2, 3]

i=0 h=2  stack empty          push 0    stack=[0]       (h at stack: 2)
i=1 h=1  h[0]=2 > 1 pop 0
           j=0 left=-1, width=1-(-1)-1=1, area=2*1=2
         push 1                stack=[1]       (h: 1)
i=2 h=5  h[1]=1 < 5 push 2     stack=[1,2]     (h: 1,5)
i=3 h=6  h[2]=5 < 6 push 3     stack=[1,2,3]   (h: 1,5,6)
i=4 h=2  h[3]=6 > 2 pop 3
           j=3 left=2, width=4-2-1=1, area=6*1=6
         h[2]=5 > 2 pop 2
           j=2 left=1, width=4-1-1=2, area=5*2=10   <-- best so far
         h[1]=1 < 2 push 4     stack=[1,4]     (h: 1,2)
i=5 h=3  h[4]=2 < 3 push 5     stack=[1,4,5]   (h: 1,2,3)

i=6 h=0  (sentinel)
         h[5]=3 > 0 pop 5
           j=5 left=4, width=6-4-1=1, area=3*1=3
         h[4]=2 > 0 pop 4
           j=4 left=1, width=6-1-1=4, area=2*4=8
         h[1]=1 > 0 pop 1
           j=1 left=-1, width=6-(-1)-1=6, area=1*6=6
         push 6

best = 10
```

## Why the invariant works

The stack always holds indices whose heights are **strictly increasing from bottom to top**. When a new bar `i` is **shorter** than the top, the top bar has no hope of extending further right (the current bar blocks it). So we pop it and finalize its rectangle — we know its left boundary (the new top after popping) and its right boundary (`i`).

By the time we process the sentinel, every real index has been popped, so every possible rectangle has been considered.

## Complexity

- **Time:** O(n) — each index pushed once and popped once.
- **Space:** O(n) worst case for the stack.

## Why this matters

Largest rectangle in histogram is the **building block** for:

- **LC 85 Maximal Rectangle** — largest all-1 rectangle in a binary matrix. Treat each row as the base and compute a histogram of consecutive 1s above each column; feed each histogram into LC 84.
- **LC 42 Trapping Rain Water** (next lesson) — similar stack idea with a different invariant.

Master LC 84 and you unlock a whole class of problems.

## Common bugs

1. **Forgetting the sentinel.** Without the `i = n` pass, tall bars at the end of the histogram never get popped, and their rectangles are never considered.
2. **`>=` vs `>` in the while condition.** Strict `>` is required. Equal heights are fine to stay; popping on equal would prematurely truncate rectangles.
3. **Wrong width formula.** It's `i - left - 1`, where `left` is the index of the bar to the **left** of the popped one (or `-1` if none). Getting this off by one is the #1 source of wrong answers.

:::quiz
question: After popping index `j`, how is the width of bar `j`'s maximal rectangle computed?
options:
  - `i - left - 1`, where `i` is the current index and `left` is the index on top of the stack after the pop (or -1 if empty).
  - `i - j`.
answer: 0
explanation: The rectangle spans from just after `left` to just before `i`; the formula i - left - 1 gives that width.
:::

:::quiz
question: Why do we append a sentinel height of 0 (loop to i = n)?
options:
  - To force every remaining bar on the stack to get popped and its rectangle evaluated.
  - It's an accidental off-by-one.
answer: 0
explanation: Without the sentinel, tall bars on the stack at the end never trigger a pop and their rectangles are never measured.
:::

:::quiz
question: Time complexity of this algorithm is:
options:
  - O(n log n)
  - O(n)
answer: 1
explanation: Each index is pushed once and popped once; the amortized total is linear.
:::

:::exercise
title: Implement largestRectangleArea
description: Implement the single-pass monotonic-stack algorithm with a `0` sentinel and index-based stack.
starterCode: |
  function largestRectangleArea(heights) {
    const n = heights.length;
    const stack = [];
    let best = 0;
    // iterate i from 0 to n (inclusive), using 0 as sentinel when i === n
    //   while top's height > current height, pop and compute area
    //   push i
    return best;
  }

  console.log(largestRectangleArea([2,1,5,6,2,3])); // 10
  console.log(largestRectangleArea([2,4]));         // 4
  console.log(largestRectangleArea([1]));           // 1
  console.log(largestRectangleArea([]));            // 0
:::

## Practice

- [Largest Rectangle in Histogram](/problems/largest-rectangle-in-histogram)
