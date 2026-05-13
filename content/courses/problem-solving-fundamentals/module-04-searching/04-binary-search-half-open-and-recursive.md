# Binary Search: Half-Open Template and Recursive Variant

The closed-interval template works great for “is this exact value here?” problems. For **boundary** problems (lower bound, upper bound, search insert position) the **half-open** template is cleaner. Many interviewers write it this way.

## Half-open interval `[lo, hi)`

`lo` is inclusive; `hi` is **exclusive**. A window of size 0 means `lo === hi`, and the loop stops there.

```javascript
function binarySearchHalfOpen(nums, target) {
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return -1;
}
```

Differences from the closed template:

- `hi = nums.length` (one **past** the last index).
- Loop condition `lo < hi` (not `<=`).
- When `nums[mid] > target`, set `hi = mid` (not `mid - 1`). Because `hi` is exclusive, `mid` is already excluded.

## When to prefer each template

| Use case | Template |
| --- | --- |
| Find the **exact index** of target | Closed `[lo, hi]` |
| Find the **first index** satisfying a condition (lower / upper bound, insert position) | Half-open `[lo, hi)` |

Pick one template, memorize it, and avoid mixing — switching templates mid-problem is the #1 source of off-by-one bugs.

## Recursive variant

Same algorithm as recursion. Base case: empty window returns -1.

```javascript
function binarySearchRecursive(nums, target, lo = 0, hi = nums.length - 1) {
  if (lo > hi) return -1;
  const mid = (lo + hi) >>> 1;
  if (nums[mid] === target) return mid;
  if (nums[mid] < target) return binarySearchRecursive(nums, target, mid + 1, hi);
  return binarySearchRecursive(nums, target, lo, mid - 1);
}
```

**Time:** O(log n). **Space:** O(log n) from recursion stack — which is why the iterative version is usually preferred in interviews.

## Tail-recursion note

These calls are in **tail position**, but JavaScript engines do not reliably optimize tail calls. Stick with iteration for large inputs.

:::quiz
question: In the half-open template, `hi` is initialized to what?
options:
  - nums.length - 1
  - nums.length (one past the last valid index)
answer: 1
explanation: Half-open means hi is exclusive, so hi equals the total length.
:::

:::quiz
question: When nums[mid] > target in the half-open template, the correct update is:
options:
  - hi = mid - 1
  - hi = mid
answer: 1
explanation: Because hi is exclusive, setting hi = mid already removes mid from the window.
:::

:::quiz
question: Why is iterative binary search usually preferred over the recursive version in interviews?
options:
  - The recursive version is incorrect.
  - The iterative version uses O(1) extra space, while the recursive version uses O(log n) stack space and risks stack issues on very large inputs in unoptimized engines.
answer: 1
explanation: Correctness is the same; the iterative version has strictly better space usage and predictable behavior.
:::

:::exercise
title: Half-open equality search
description: Implement `search(nums, target)` using the half-open template. Return the index of `target`, or -1 if not found.
starterCode: |
  function search(nums, target) {
    let lo = 0;
    let hi = nums.length;
    // while (lo < hi) ...
    return -1;
  }

  console.log(search([1, 2, 3, 4, 5], 4)); // 3
  console.log(search([1, 2, 3, 4, 5], 6)); // -1
:::

## Practice

- [Binary Search](/problems/binary-search) — submit both the closed and half-open versions to lock in the difference.
