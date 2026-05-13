# Daily Temperatures

**LeetCode 739.** Given an array `temperatures` where `temperatures[i]` is the temperature on day `i`, return an array `answer` where `answer[i]` is the **number of days you have to wait** until a warmer temperature. If no future day is warmer, `answer[i]` is `0`.

This is "next greater element" where the answer is the **distance** (index difference) instead of the value. A perfect application of the monotonic stack.

## Example

```text
temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
answer       = [ 1,  1,  4,  2,  1,  1,  0,  0]

day 0 (73): day 1 is 74 > 73, wait 1 day.
day 1 (74): day 2 is 75 > 74, wait 1 day.
day 2 (75): day 6 is 76 > 75, wait 4 days.
day 3 (71): day 5 is 72 > 71, wait 2 days.
day 4 (69): day 5 is 72 > 69, wait 1 day.
day 5 (72): day 6 is 76 > 72, wait 1 day.
day 6 (76): no warmer day, 0.
day 7 (73): no warmer day, 0.
```

## The code

A monotonic **decreasing** stack of **indices**. When we see a warmer temperature than the top-of-stack's temperature, that top index finally has an answer — and the distance is `i - j`.

```javascript
function dailyTemperatures(T) {
  const n = T.length;
  const ans = new Array(n).fill(0);
  const stack = [];   // indices with temperatures decreasing top-to-bottom... no, bottom-to-top? see below

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && T[stack[stack.length - 1]] < T[i]) {
      const j = stack.pop();
      ans[j] = i - j;
    }
    stack.push(i);
  }
  return ans;
}
```

Stack invariant: temperatures at the stacked indices are **decreasing from bottom to top**. Equivalently, the top of the stack is always the smallest temperature among those currently "waiting for a warmer day."

## Walkthrough

```text
T = [73, 74, 75, 71, 69, 72, 76, 73]

i=0 T=73  push 0                        stack=[0]       temps(stack)=[73]
i=1 T=74  74 > 73 pop 0 ans[0]=1-0=1
          push 1                        stack=[1]       temps=[74]
i=2 T=75  75 > 74 pop 1 ans[1]=2-1=1
          push 2                        stack=[2]       temps=[75]
i=3 T=71  71 < 75 push 3                stack=[2,3]     temps=[75,71]
i=4 T=69  69 < 71 push 4                stack=[2,3,4]   temps=[75,71,69]
i=5 T=72  72 > 69 pop 4 ans[4]=5-4=1
          72 > 71 pop 3 ans[3]=5-3=2
          72 < 75 push 5                stack=[2,5]     temps=[75,72]
i=6 T=76  76 > 72 pop 5 ans[5]=6-5=1
          76 > 75 pop 2 ans[2]=6-2=4
          push 6                        stack=[6]       temps=[76]
i=7 T=73  73 < 76 push 7                stack=[6,7]     temps=[76,73]

end: indices 6, 7 remain on stack; ans stays 0 for them.
ans = [1, 1, 4, 2, 1, 1, 0, 0]
```

## Why "distance" instead of "value"

The pattern is identical to next-greater-element. The only change is the line inside the pop:

```javascript
ans[j] = i - j;      // store distance (this problem)
// vs.
ans[j] = T[i];       // store value (next greater element)
```

Recognizing "answer is a distance" as "same monotonic stack, different payload" is the exact mental move that turns a medium into an easy.

## Complexity

- **Time:** O(n) — each index pushed and popped at most once.
- **Space:** O(n) worst case for the stack (strictly decreasing input).

## Why the brute force fails

For each day, scan forward looking for a warmer temperature. Worst case O(n²). For `n = 10^5` (the typical LC constraint), that's `10^10` — well over the time limit. O(n) is required.

## Common bugs

1. **Using `<=` instead of `<`** in the while condition. The problem asks for **strictly warmer**, so equal temperatures should not satisfy. Use strict `<`.
2. **Storing temperatures instead of indices.** You need the index to compute the distance.
3. **Initializing `ans` with anything other than `0`.** The problem specifies `0` for days with no warmer future.

## Related problems

- **LC 496 Next Greater Element I** — same pattern, different payload.
- **LC 503 Next Greater Element II** — circular array.
- **LC 901 Online Stock Span** — previous greater-or-equal, but streamed.
- **LC 84 Largest Rectangle in Histogram** (next lesson) — advanced variant that uses both sides.

:::quiz
question: The only substantive change from "next greater element" to "daily temperatures" is:
options:
  - Storing `i - j` (distance) instead of the next greater value when popping.
  - Switching from a monotonic decreasing stack to a monotonic increasing stack.
answer: 0
explanation: Same invariant, same structure, different payload on the write.
:::

:::quiz
question: What does an index that remains on the stack at the end represent?
options:
  - A day with no warmer day ahead; its answer is 0.
  - A bug in the algorithm.
answer: 0
explanation: Unresolved indices at the end correspond to positions with no qualifying future element.
:::

:::quiz
question: Using `T[top] <= T[i]` instead of `T[top] < T[i]` would produce:
options:
  - Correct behavior only for strictly-decreasing inputs.
  - Wrong answers whenever equal temperatures occur, because they'd incorrectly count as warmer.
answer: 1
explanation: The spec says "warmer," not "warmer-or-equal"; non-strict pop would falsely resolve ties.
:::

:::exercise
title: Implement dailyTemperatures
description: Implement `dailyTemperatures(T)` using a monotonic-decreasing stack of indices. Return an array of day-distances.
starterCode: |
  function dailyTemperatures(T) {
    const n = T.length;
    const ans = new Array(n).fill(0);
    const stack = []; // indices with T[stack[k]] strictly decreasing
    // iterate i, pop while top is cooler, set ans[j] = i - j
    return ans;
  }

  console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));
  // [1, 1, 4, 2, 1, 1, 0, 0]
  console.log(dailyTemperatures([30, 40, 50, 60]));
  // [1, 1, 1, 0]
  console.log(dailyTemperatures([30, 60, 90]));
  // [1, 1, 0]
:::

## Practice

- [Daily Temperatures](/problems/daily-temperatures)
