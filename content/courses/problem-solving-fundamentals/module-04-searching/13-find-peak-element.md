# Find Peak Element

**LeetCode 162.** A **peak element** is one that is **strictly greater** than both neighbors (edge elements only need one neighbor to compare against). The array does not need to be sorted, but adjacent elements are guaranteed to be different. Find **any** peak in **O(log n)**.

## The surprise: binary search on unsorted data

Binary search does **not** require a fully sorted array — it requires a **monotonic decision** that reliably halves the window. The trick here:

- Look at `nums[mid]` and `nums[mid + 1]`.
- If `nums[mid] < nums[mid + 1]`, we are climbing upward to the right → a peak must exist somewhere in `[mid+1 .. hi]`.
- Else we are flat-or-descending → a peak must exist in `[lo .. mid]` (mid itself is a candidate).

Either way, one side is guaranteed to contain a peak, and we can discard the other.

## The code

```javascript
function findPeakElement(nums) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
```

## Walkthrough

```text
nums = [1, 2, 3, 1]

lo=0 hi=3 mid=1 nums[1]=2 < nums[2]=3 -> climb right -> lo=2
lo=2 hi=3 mid=2 nums[2]=3 > nums[3]=1 -> peak candidate -> hi=2
lo=2 hi=2 -> return 2
```

### Multi-peak

```text
nums = [1, 2, 1, 3, 5, 6, 4]
               ^      ^
peak at 1 (index 1) AND peak at 5 (index 5) — return either.

lo=0 hi=6 mid=3 nums[3]=3 < nums[4]=5 -> lo=4
lo=4 hi=6 mid=5 nums[5]=6 > nums[6]=4 -> hi=5
lo=4 hi=5 mid=4 nums[4]=5 < nums[5]=6 -> lo=5
lo=5 hi=5 -> return 5
```

## Why a peak always exists

Imagine the array is bounded by `-infinity` beyond both ends. Walk from the left: values go up or down. Since both invisible neighbors are `-infinity`, the sequence must reach a maximum somewhere inside — that local maximum is a peak.

## Why `lo < hi` (not `<=`)

Inside the loop we read `nums[mid + 1]`. If `hi` were reachable by `mid`, we could index past the array. With `lo < hi` and `mid = (lo + hi) >>> 1`, `mid + 1 <= hi` always — safe.

## Complexity

- **Time:** O(log n).
- **Space:** O(1).

:::quiz
question: Why does the slope comparison `nums[mid] < nums[mid + 1]` suffice?
options:
  - If we are climbing, a peak exists somewhere on the rising side; if we are descending or flat-to-lower, a peak exists on the current side including mid.
  - Because the array is sorted.
answer: 0
explanation: The bounded sequence must reach a maximum; following the rising direction guarantees we hit one of them.
:::

:::quiz
question: For a strictly increasing array of length n, the peak returned is:
options:
  - Index n - 1 (the last element).
  - Index 0.
answer: 0
explanation: We always move right on a rising slope; the loop terminates at the last index.
:::

:::quiz
question: Why is the loop condition `lo < hi` and not `lo <= hi`?
options:
  - So that `mid + 1` is always a valid index inside the window.
  - Because the array might be empty.
answer: 0
explanation: With lo < hi, mid is at most hi - 1, making mid + 1 <= hi a valid read.
:::

:::exercise
title: Implement findPeakElement
description: Implement `findPeakElement(nums)` returning the index of any peak. Assume adjacent elements differ.
starterCode: |
  function findPeakElement(nums) {
    let lo = 0, hi = nums.length - 1;
    // while (lo < hi) ...
    return lo;
  }

  console.log(findPeakElement([1, 2, 3, 1]));          // 2
  console.log(findPeakElement([1, 2, 1, 3, 5, 6, 4])); // 1 or 5
  console.log(findPeakElement([1]));                   // 0
:::

## Practice

- [Find Peak Element](/problems/find-peak-element)
