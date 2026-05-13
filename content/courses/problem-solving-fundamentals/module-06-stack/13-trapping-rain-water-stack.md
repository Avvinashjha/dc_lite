# Trapping Rain Water (Stack Approach)

**LeetCode 42.** Given `n` non-negative integers representing an elevation map where each bar's width is 1, compute how much rain water can be **trapped** after it rains.

```text
heights = [0,1,0,2,1,0,1,3,2,1,2,1]

 total water trapped = 6 (filled █'s below)

              █
      █ █ █ █ █ █ █ █
  █ █ █ █ █ █ █ █ █ █ █ █
```

There are three well-known solutions: (a) pre-compute left/right max arrays, (b) two-pointer sweep, (c) **monotonic stack**. This lesson focuses on the stack approach because it cleanly generalizes from the monotonic-stack pattern we've been drilling.

## The monotonic-stack idea

As we scan from left to right, maintain a stack of indices with **decreasing heights**. When the current bar `i` is **taller** than the top of the stack, we've found the right wall of a trapping basin. Pop the bottom of the basin, the new top is the left wall, and water height is the minimum of the two walls.

For each popped "floor" index `j`, the water trapped **right above `j`** is:

```text
left  = index on top of stack after popping j
right = current index i
water_above_j = (min(heights[left], heights[i]) - heights[j]) * (i - left - 1)
```

`(i - left - 1)` is the width. `(min - heights[j])` is the added height above the popped bar.

## The code

```javascript
function trap(heights) {
  const stack = [];  // indices with heights decreasing top-to-bottom
  let total = 0;

  for (let i = 0; i < heights.length; i++) {
    while (stack.length > 0 && heights[stack[stack.length - 1]] < heights[i]) {
      const j = stack.pop();
      if (stack.length === 0) break;   // no left wall
      const left = stack[stack.length - 1];
      const width = i - left - 1;
      const bounded = Math.min(heights[left], heights[i]) - heights[j];
      total += bounded * width;
    }
    stack.push(i);
  }
  return total;
}
```

If the stack is empty after popping `j`, there is **no left wall** — water escapes to the left. That's the `break`.

## Walkthrough

```text
heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]

Scan:
i=0 h=0 push                stack=[0]
i=1 h=1 top h=0 < 1 pop 0, stack empty -> break, push 1
                            stack=[1]
i=2 h=0 top h=1 >=0 push 2  stack=[1,2]
i=3 h=2 top h=0<2 pop 2 j=2
          left=1, width=3-1-1=1, bounded=min(1,2)-0=1, water +=1
        top h=1<2 pop 1 j=1, stack empty, break
        push 3              stack=[3]
i=4 h=1 push 4              stack=[3,4]
i=5 h=0 push 5              stack=[3,4,5]
i=6 h=1 top h=0<1 pop 5 j=5
          left=4, width=6-4-1=1, bounded=min(1,1)-0=1, water +=1
        top h=1 >=1 push 6  stack=[3,4,6]    total=2
i=7 h=3 top h=1<3 pop 6 j=6
          left=4, width=7-4-1=2, bounded=min(1,3)-1=0, water +=0
        top h=1<3 pop 4 j=4
          left=3, width=7-3-1=3, bounded=min(2,3)-1=1, water +=3
        top h=2<3 pop 3 j=3, stack empty, break
        push 7              stack=[7]        total=5
i=8 h=2 push 8              stack=[7,8]
i=9 h=1 push 9              stack=[7,8,9]
i=10 h=2 top h=1<2 pop 9 j=9
           left=8, width=10-8-1=1, bounded=min(2,2)-1=1, water +=1
         top h=2 >=2 push 10 stack=[7,8,10]   total=6
i=11 h=1 push 11             stack=[7,8,10,11]

total = 6
```

## Why it's O(n)

Each index is pushed once and popped at most once. The inner while loop, across the whole scan, is bounded by `n` total iterations.

## Complexity

- **Time:** O(n).
- **Space:** O(n) for the stack.

## Alternative: two-pointer sweep (briefly)

A slicker solution uses **two pointers** `l, r` with running `leftMax, rightMax`:

```javascript
function trap(heights) {
  let l = 0, r = heights.length - 1;
  let leftMax = 0, rightMax = 0, total = 0;
  while (l < r) {
    if (heights[l] < heights[r]) {
      if (heights[l] >= leftMax) leftMax = heights[l];
      else total += leftMax - heights[l];
      l++;
    } else {
      if (heights[r] >= rightMax) rightMax = heights[r];
      else total += rightMax - heights[r];
      r--;
    }
  }
  return total;
}
```

**Time:** O(n). **Space:** O(1). Usually the preferred interview solution because of the lower space overhead. Mention both approaches if asked.

## Why the stack version is still worth knowing

It's the most **general** monotonic-stack pattern: add each trapped "layer" one at a time using only local comparisons. The same shape appears in problems where the two-pointer trick doesn't apply (e.g., LC 85 Maximal Rectangle after the LC 84 reduction).

## Common bugs

1. **Missing the empty-stack break.** Popping the bottom with no wall to the left causes an out-of-bounds read.
2. **Using `<=` instead of `<`.** Equal heights should be pushed (to keep the invariant intact), not popped.
3. **Confusing width with `(i - j)` instead of `(i - left - 1)`.** The width of the trap spans from `left + 1` to `i - 1`, not from `j` to `i`.

:::quiz
question: In the stack approach, the width of a single trapped layer atop popped index `j` is:
options:
  - `i - left - 1` where `left` is the stack top after popping `j`.
  - `i - j`.
answer: 0
explanation: The layer spans the gap between the left and right walls, excluding both walls.
:::

:::quiz
question: The bounded height of the layer above popped `j` is:
options:
  - `min(heights[left], heights[i]) - heights[j]`
  - `max(heights[left], heights[i]) - heights[j]`
answer: 0
explanation: Water is limited by the shorter of the two walls; any excess above that height spills out.
:::

:::quiz
question: What does it mean if the stack is empty after popping `j`?
options:
  - There is no left wall, so water above `j` escapes — we break out of the while loop.
  - We made an error.
answer: 0
explanation: No left wall means no container; subsequent water above `j` is determined by later bars, not this layer.
:::

:::exercise
title: Implement trap using a monotonic stack
description: Implement `trap(heights)` using the stack approach. Pop while the top is strictly shorter than the current bar, and stop when the stack becomes empty (no left wall).
starterCode: |
  function trap(heights) {
    const stack = [];
    let total = 0;
    // iterate i over heights
    //   while top is strictly shorter than heights[i]:
    //     pop j
    //     if stack is empty, break
    //     compute width and bounded height; add to total
    //   push i
    return total;
  }

  console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6
  console.log(trap([4,2,0,3,2,5]));             // 9
  console.log(trap([]));                        // 0
:::

## Practice

- [Trapping Rain Water](/problems/trapping-rain-water)
