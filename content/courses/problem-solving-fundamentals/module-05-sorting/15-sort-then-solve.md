# Sort Then Solve: Pattern and Examples

Many interview problems have messy O(n^2) brute-force solutions that become **linear or near-linear** once you sort the input first. Recognizing "sorting exposes structure here" is one of the highest-leverage interview skills.

## The general shape

```text
unsorted input
      |
      | sort by the right key    (O(n log n))
      v
sorted input
      |
      | single linear pass       (O(n))
      v
answer
```

Total time: **O(n log n)**. You trade `log n` to set up the data and save a factor of `n` on the work itself.

## Example 1: Detect duplicates

Given an array, do any two elements match?

- **Brute force:** O(n^2) nested loops.
- **Sort then scan:** sort once, then check adjacent pairs.

```javascript
function hasDuplicate(nums) {
  nums = [...nums].sort((a, b) => a - b);
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) return true;
  }
  return false;
}
```

O(n log n). (For this specific problem, a hash set is even faster at O(n) — always consider both.)

## Example 2: Merge overlapping intervals

Given intervals `[[1,3],[2,6],[8,10],[15,18]]`, merge overlapping ones.

Without sorting, you'd need O(n^2) comparisons to find overlaps. Sort by **start time**, and now any overlap must be with the immediately previous interval in the sorted order.

```javascript
function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  intervals = [...intervals].sort((a, b) => a[0] - b[0]);
  const out = [intervals[0].slice()];
  for (let i = 1; i < intervals.length; i++) {
    const last = out[out.length - 1];
    const cur = intervals[i];
    if (cur[0] <= last[1]) {
      last[1] = Math.max(last[1], cur[1]);
    } else {
      out.push(cur.slice());
    }
  }
  return out;
}
```

```text
input  = [[1,3],[2,6],[8,10],[15,18]]
sorted = [[1,3],[2,6],[8,10],[15,18]]   (already sorted)

[1,3] -> out = [[1,3]]
[2,6] starts at 2 <= last end 3 -> merge -> out = [[1,6]]
[8,10] starts at 8 > 6          -> push  -> out = [[1,6],[8,10]]
[15,18] starts at 15 > 10       -> push  -> out = [[1,6],[8,10],[15,18]]
```

O(n log n).

## Example 3: Two-sum on a sorted array with two pointers

Given a **sorted** array and a target, find a pair summing to target.

```javascript
function twoSumSorted(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const sum = nums[lo] + nums[hi];
    if (sum === target) return [lo, hi];
    if (sum < target) lo++;
    else hi--;
  }
  return [-1, -1];
}
```

O(n) after sorting. On an unsorted array, sorting first gives O(n log n) — still better than O(n^2). Note this loses original indices; if you need them, sort `(value, index)` pairs.

## Example 4: 3-sum

Classic LeetCode 15 — find triplets summing to 0.

After sorting, the O(n^3) brute force becomes O(n^2): fix one element, then use two pointers in the remaining suffix. Sorting also makes **skipping duplicates** a one-line check: `if (nums[i] === nums[i - 1]) continue;`

## When NOT to sort first

- When a **hash map** gives you O(n) directly (e.g., plain Two Sum with any pair of indices — LeetCode 1 — runs in O(n) with a hash map and does not need sorting).
- When the problem requires **preserving input order** — sorting would destroy it unless you sort `(value, index)` pairs.
- When the data is **partially sorted** in a useful way already and you can exploit that structure without a full sort.

## The interview habit

When facing a problem that "feels" O(n^2), ask yourself: **"Would this be easy if the input were sorted by X?"** If yes, that's your angle. Sorting first costs O(n log n) and almost always beats a quadratic loop.

:::quiz
question: Merge Intervals sorts by which key?
options:
  - End time.
  - Start time — overlaps can then only occur with the immediately previous interval.
answer: 1
explanation: Sorting by start reduces overlap checking to a single linear pass.
:::

:::quiz
question: For problems that need original indices, how do you combine sorting with index preservation?
options:
  - Sort `(value, originalIndex)` pairs and read the index field after sorting.
  - Sorting is impossible in that case.
answer: 0
explanation: Attaching the original index as a payload preserves it through the sort.
:::

:::quiz
question: When is sorting-then-scanning worse than a hash-map approach?
options:
  - When the problem can be solved in O(n) with a hash map; then sorting adds an unnecessary O(log n) factor.
  - Never — sorting is always faster.
answer: 0
explanation: Linear hash-map solutions are asymptotically better than sort+scan.
:::

:::exercise
title: Merge intervals
description: Implement `mergeIntervals(intervals)` that returns a new array of merged intervals. Input intervals may be in any order; output should be sorted by start time.
starterCode: |
  function mergeIntervals(intervals) {
    if (!intervals.length) return [];
    intervals = [...intervals].sort((a, b) => a[0] - b[0]);
    const out = [intervals[0].slice()];
    // iterate, merging when cur[0] <= last[1]
    return out;
  }

  console.log(mergeIntervals([[1,3],[2,6],[8,10],[15,18]]));
  // [[1,6],[8,10],[15,18]]
  console.log(mergeIntervals([[1,4],[4,5]]));
  // [[1,5]]
:::

## Practice

- [Merge Sorted Array](/problems/merge-sorted-array) — after sorting, a two-pointer merge is a classic sort-then-solve companion.
