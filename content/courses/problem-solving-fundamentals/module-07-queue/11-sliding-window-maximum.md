# Sliding Window Maximum

**LeetCode 239.** Given an array `nums` and an integer `k`, return the **maximum** of every contiguous subarray of size `k`.

```text
nums = [1, 3, -1, -3, 5, 3, 6, 7]   k = 3

Windows         Max
[1, 3, -1]        3
[3, -1, -3]       3
[-1, -3, 5]       5
[-3, 5, 3]        5
[5, 3, 6]         6
[3, 6, 7]         7

Output: [3, 3, 5, 5, 6, 7]
```

This is the signature application of the monotonic deque. We'll solve it twice — once with the straightforward `dq.shift()` that you'd write in an interview, and once with a true O(1)-per-operation head-index deque for larger inputs.

## Why brute force is too slow

For each of the `n - k + 1` windows, scan `k` elements to find the max → O(n · k). For `n = 10^5` and `k = 10^4`, that's `10^9` operations — TLE. We need O(n).

A heap approach gets O(n log k) and works, but is more complex and slower in practice. The monotonic deque gets you O(n) and is the standard answer.

## Solution 1 — monotonic deque (clear version)

```javascript
function maxSlidingWindow(nums, k) {
  const n = nums.length;
  const dq = [];            // indices; nums at these indices are strictly decreasing
  const result = [];

  for (let i = 0; i < n; i++) {
    // 1. evict front if out of window
    while (dq.length > 0 && dq[0] <= i - k) dq.shift();

    // 2. evict dominated tail
    while (dq.length > 0 && nums[dq[dq.length - 1]] < nums[i]) dq.pop();

    // 3. push current
    dq.push(i);

    // 4. record max once the first window is complete
    if (i >= k - 1) result.push(nums[dq[0]]);
  }
  return result;
}
```

Exactly the template from the previous lesson. The only wrinkle: `dq.shift()` is O(n) in JS because it reindexes — but front-evictions happen at most once per element, so the total work remains bounded. In practice this version passes LC 239.

## Walkthrough

```text
nums = [1, 3, -1, -3, 5, 3, 6, 7]   k = 3

i=0 val=1
  no evict
  push 0                dq=[0]          vals=[1]
i=1 val=3
  back: nums[0]=1 < 3 pop  dq=[]
  push 1                dq=[1]          vals=[3]
i=2 val=-1
  back: nums[1]=3 >= -1
  push 2                dq=[1,2]        vals=[3,-1]
  i >= k-1=2: push nums[dq[0]]=3       result=[3]
i=3 val=-3
  front: dq[0]=1 <= 3-3=0? no
  back: nums[2]=-1 >= -3
  push 3                dq=[1,2,3]      vals=[3,-1,-3]
  push nums[1]=3                        result=[3,3]
i=4 val=5
  front: dq[0]=1 <= 4-3=1? yes shift    dq=[2,3]
  back: nums[3]=-3 < 5 pop              dq=[2]
        nums[2]=-1 < 5 pop              dq=[]
  push 4                dq=[4]          vals=[5]
  push nums[4]=5                        result=[3,3,5]
i=5 val=3
  front: 4 <= 5-3=2? no
  back: nums[4]=5 >= 3
  push 5                dq=[4,5]        vals=[5,3]
  push 5                                result=[3,3,5,5]
i=6 val=6
  front: 4 <= 6-3=3? no
  back: nums[5]=3 < 6 pop, nums[4]=5 < 6 pop  dq=[]
  push 6                dq=[6]          vals=[6]
  push 6                                result=[3,3,5,5,6]
i=7 val=7
  front: 6 <= 7-3=4? no
  back: nums[6]=6 < 7 pop                dq=[]
  push 7                dq=[7]          vals=[7]
  push 7                                result=[3,3,5,5,6,7]
```

## Solution 2 — head-index deque (true O(1) per op)

If `shift()` performance matters (very large `n`, or you want to be pedantically correct), replace the array with a fixed-size circular buffer:

```javascript
function maxSlidingWindow(nums, k) {
  const n = nums.length;
  const dq = new Int32Array(n);  // enough capacity, stores indices
  let head = 0, tail = 0;         // [head, tail)
  const result = new Array(n - k + 1);

  for (let i = 0; i < n; i++) {
    if (head < tail && dq[head] <= i - k) head++;
    while (head < tail && nums[dq[tail - 1]] < nums[i]) tail--;
    dq[tail++] = i;
    if (i >= k - 1) result[i - k + 1] = nums[dq[head]];
  }
  return result;
}
```

`Int32Array` for the deque is a nice-to-have optimization — contiguous memory and no per-element boxing. `head` and `tail` indices plus an integer array give you a true O(1)-per-operation deque. Each element enters the deque exactly once (`tail++`) and leaves at most once (via `head++` or `tail--`).

This version is the production-quality answer and is what I'd default to for large inputs.

## Why the naive `shift()` still passes

Even though `shift()` is O(n) in isolation, the **total** number of shifts across the whole loop is bounded by `n` — each index can be the front only once before it's evicted forever. The total cost is O(n²) in a pathological sense (each shift moves ~n items), but in practice the inner arrays are small and the engine optimization is effective for LC's constraint `n ≤ 10^5`. The head-index version avoids this concern entirely.

## Complexity

| Solution | Time | Space |
| --- | --- | --- |
| Monotonic deque with `shift()` | O(n · w_avg) where `w_avg` is the average deque size (usually small, passes LC 239). | O(k) |
| Head-index deque | O(n) worst case | O(k) (`Int32Array` of size `n` is also fine) |

Either is acceptable in an interview; mention the trade-off if asked about worst-case.

## Extension — sliding window minimum

Mirror the comparisons:

```javascript
function minSlidingWindow(nums, k) {
  const dq = [];
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length > 0 && dq[0] <= i - k) dq.shift();
    while (dq.length > 0 && nums[dq[dq.length - 1]] > nums[i]) dq.pop();
    dq.push(i);
    if (i >= k - 1) result.push(nums[dq[0]]);
  }
  return result;
}
```

Note the one character difference: `<` becomes `>` in the back-eviction. The deque is now monotonically **increasing**, and `dq[0]` is the current min.

## Common bugs

1. **Outputting before the first window is formed.** The guard `i >= k - 1` is essential.
2. **Comparing `dq[0] < i - k + 1`** instead of `<= i - k`. Both are correct if you adjust consistently, but mixing them is a classic off-by-one.
3. **Popping back with `<=` for "max."** This drops equal elements prematurely, still producing the right answer but doing unnecessary work and being logically confusing.
4. **Trying to use a hash-map or sorted container.** Sorted containers give O(log n); heaps give O(n log k). A monotonic deque gives O(n). Reach for the simplest tool that does the job.

## Recognition checklist

Reach for the monotonic deque when:

- The window size is **fixed** (`k` given).
- You need an **extremum** (max or min) for each position.
- Elements enter at one side and leave at the other (sliding).

If the window is variable-size (e.g., "longest subarray satisfying X"), a two-pointer / two-deque combo or a different technique is usually a better fit.

:::quiz
question: Why don't we consider sorted containers or heaps as the default for this problem?
options:
  - The monotonic deque gives O(n) vs O(n log n) for heaps and sorted sets.
  - They're equally fast.
answer: 0
explanation: Amortized O(n) is the best-possible; the deque solution is also typically the simplest to code.
:::

:::quiz
question: In the head-index deque version, `head < tail` serves as:
options:
  - The "not empty" test for the deque.
  - A modulo operation.
answer: 0
explanation: `head === tail` means empty in a half-open index range.
:::

:::quiz
question: Extending this to sliding window MINIMUM requires which change?
options:
  - Flip the back-eviction comparator from `<` to `>` (and keep the monotonic deque increasing).
  - Recompute from scratch — there's no easy extension.
answer: 0
explanation: The algorithm is symmetric; flipping the comparator switches max to min.
:::

:::exercise
title: Implement maxSlidingWindow with a monotonic deque
description: Implement the clean version using an array deque with shift()/pop(). Make sure to handle `k = 1` and `nums.length < k` gracefully.
starterCode: |
  function maxSlidingWindow(nums, k) {
    const dq = [];
    const result = [];
    for (let i = 0; i < nums.length; i++) {
      // 1. front-evict if out of window
      // 2. back-evict while nums[back] < nums[i]
      // 3. push i
      // 4. if i >= k-1 push nums[dq[0]] to result
    }
    return result;
  }

  console.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3)); // [3,3,5,5,6,7]
  console.log(maxSlidingWindow([1,-1], 1));               // [1,-1]
  console.log(maxSlidingWindow([9,11], 2));               // [11]
  console.log(maxSlidingWindow([7,2,4], 2));              // [7,4]
:::

## Practice

- [Sliding Window Maximum](/problems/sliding-window-maximum)
