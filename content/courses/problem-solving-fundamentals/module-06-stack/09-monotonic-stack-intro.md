# The Monotonic Stack Pattern

A **monotonic stack** is a stack whose elements always stay in sorted order — either **increasing from bottom to top** or **decreasing from bottom to top**. Every time a new element arrives that would violate the order, you **pop** elements off until the invariant holds, then push the new element.

This single idea — a stack with a monotonic invariant — is one of the highest-leverage patterns in array interview problems. It turns many seemingly-O(n²) problems into O(n).

## When to reach for it

Look for problems that ask, for each position in an array, a question involving **the next (or previous) element satisfying some condition**:

- Next greater element to the right.
- Previous smaller element to the left.
- How many days until a warmer temperature.
- Width of the largest rectangle spanning a histogram bar.
- For each bar, how many bars on either side are at least as tall.

If you can phrase the answer as "the next/previous element that is larger/smaller," a monotonic stack is almost always the right tool.

## The generic template (monotonic decreasing stack, find next greater)

```javascript
function nextGreater(nums) {
  const n = nums.length;
  const ans = new Array(n).fill(-1);
  const stack = [];   // indices, values at these indices are decreasing

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
      const j = stack.pop();
      ans[j] = nums[i];
    }
    stack.push(i);
  }
  return ans;
}
```

The stack holds **indices**, not values — that way we know **where** to write the answer when we pop. The values at those indices form a **decreasing sequence** from bottom to top. When the new number is larger than the top, the top has finally found its "next greater" and gets popped.

## Trace

```text
nums = [2, 1, 2, 4, 3]
               answer index -> meaning

i=0 val=2  stack empty          -> push 0        stack=[0]   (values: [2])
i=1 val=1  1 < 2 (top)          -> push 1        stack=[0,1] (values: [2,1])
i=2 val=2  2 > 1 pop 1 ans[1]=2
           2 == 2 (not strictly >) push 2        stack=[0,2] (values: [2,2])
i=3 val=4  4 > 2 pop 2 ans[2]=4
           4 > 2 pop 0 ans[0]=4
           push 3                                stack=[3]   (values: [4])
i=4 val=3  3 < 4                 -> push 4       stack=[3,4] (values: [4,3])

end: remaining indices (3, 4) have no next greater -> ans stays -1.
ans = [4, 2, 4, -1, -1]
```

## Why this is O(n)

Every index is **pushed once** and **popped at most once**. So the total work across all iterations is bounded by `2n` pushes/pops. The nested `while` looks like it might make the algorithm O(n²), but the amortized argument shows otherwise — exactly like the queue-from-two-stacks analysis.

## Four flavors — pick the right one

| Goal | Stack invariant | On top of stack when pushing `x` |
| --- | --- | --- |
| Next greater element | Strictly decreasing | Pop while `top < x` |
| Next greater-or-equal | Non-strictly decreasing | Pop while `top <= x` |
| Next smaller element | Strictly increasing | Pop while `top > x` |
| Next smaller-or-equal | Non-strictly increasing | Pop while `top >= x` |

For **previous** versions, iterate right-to-left and the same rules apply — or record each element's "previous X" when it is **pushed**, not when popped.

## Variants — what to store on the stack

- **Indices** (most common): when we pop `j`, we know the array position that just resolved.
- **Values only**: fine for problems that only care about the answer value, not the index.
- **(index, count) pairs**: used in problems where equal values can be merged — more advanced; you'll see this in largest-rectangle-in-histogram.

## Common bugs

1. **Popping the wrong direction.** `nums[stack.top] < nums[i]` for "next greater"; `nums[stack.top] > nums[i]` for "next smaller." Flip it and the algorithm is silently wrong.
2. **Forgetting to process leftovers.** Anything still on the stack at the end has no qualifying neighbor; decide up front whether that means `-1`, `n`, or array length — don't leave them undefined.
3. **Storing values instead of indices when you need indices.** You can't recover the original position from a stack of values.

## Mental checklist before coding

Ask yourself:

1. For each position, am I asking "what's the next/previous X-ier element"?
2. Which direction do I scan?
3. Increasing or decreasing invariant?
4. Strict or non-strict?
5. Do I need indices or values on the stack?

Write the template, substitute your comparison, done. The next four lessons apply this template to four classic problems.

:::quiz
question: A monotonic decreasing stack (from bottom to top) is useful for finding:
options:
  - The next greater element for each position.
  - The previous smaller element for each position.
answer: 0
explanation: When a new larger value arrives, all smaller values on top get their "next greater" answer in one pass.
:::

:::quiz
question: Why does the inner while loop NOT make the algorithm O(n²)?
options:
  - Each index is pushed and popped at most once; total stack work across all iterations is O(n).
  - Because of JavaScript optimizations.
answer: 0
explanation: Amortized analysis: the total work is bounded by 2n, not by the worst-case inner iteration count.
:::

:::quiz
question: Why typically push indices onto a monotonic stack rather than raw values?
options:
  - Indices let you know which array position just found its answer when it is popped; they also give O(1) value lookup.
  - Indices take less memory.
answer: 0
explanation: The index tells you where to write the answer; with values alone you lose positional information.
:::

:::exercise
title: Decreasing monotonic stack — next greater
description: Implement `nextGreater(nums)` returning an array where `ans[i]` is the next element to the right that is strictly greater than `nums[i]`, or `-1` if none.
starterCode: |
  function nextGreater(nums) {
    const n = nums.length;
    const ans = new Array(n).fill(-1);
    const stack = []; // indices, values decreasing
    // iterate i from 0 to n-1:
    //   while top index has nums[top] < nums[i], pop and set ans[top] = nums[i]
    //   push i
    return ans;
  }

  console.log(nextGreater([2, 1, 2, 4, 3])); // [4, 2, 4, -1, -1]
  console.log(nextGreater([5, 4, 3, 2, 1])); // [-1, -1, -1, -1, -1]
  console.log(nextGreater([1, 2, 3, 4]));    // [2, 3, 4, -1]
:::

## Practice

Read through this template once, then try the next four lessons end-to-end. They all reuse this structure.
