# Two Pointers: Same Direction

Sometimes both pointers march **forward** through the array — often called **slow/fast** or **read/write** pointers. This pattern shines for **in-place** transforms: removing elements, deduplicating sorted arrays, or partitioning.

## Remove duplicates from sorted array (idea)

Keep a **write** pointer `k` for the next position of the result. A **read** pointer `i` scans every element. When `nums[i]` differs from the last written value, write it.

```javascript
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let k = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[k++] = nums[i];
    }
  }
  return k; // new logical length
}
```

```text
nums = [1,1,2,2,3]
        ^     ^
        w     i   -> advance i, when nums[i] != nums[w-1], write at w

Result prefix nums[0..k-1] is unique in order.
```

## Fast and slow (cycle detection preview)

On linked lists, a slow pointer stepping one node and a fast pointer stepping two can detect cycles. On arrays, a similar idea appears in **Floyd's tortoise and hare** for cycle detection in function graphs — a future topic.

## Partitioning (quick mental model)

Dutch national flag and quicksort partitions use same-direction pointers from both ends or three-way indices — same family: **in-place rearrangement** with careful invariants.

## When to use same-direction vs opposite

| Pattern | Typical use |
| ------- | ----------- |
| Opposite ends | Palindrome, sorted two-sum, max area |
| Same direction | Filter/dedupe in O(1) extra space, merge-like scans, sliding window (often combined with a window end) |

:::quiz
question: In the dedupe loop, why does `i` start at 1 while `k` starts at 1?
options:
  - We compare nums[i] with nums[i-1] to detect a new distinct value after the first element.
  - Because arrays are 1-indexed in JavaScript.
  - Because k must always be larger than i.
answer: 0
explanation: The first element is always kept. From index 1 onward, we detect transitions between runs of equal values by comparing with the previous cell.
:::

:::quiz
question: Same-direction two-pointer in-place filtering usually needs what extra space?
options:
  - O(n) for a copy array
  - O(1) besides the input array
  - O(log n) stack
answer: 1
explanation: The write pointer overwrites the input; no proportional extra array is allocated — that is why interviewers ask for O(1) auxiliary space.
:::

:::quiz
question: If you remove duplicates using a new array with filter, what is the space complexity?
options:
  - O(1)
  - O(n) for the new array
  - O(log n)
answer: 1
explanation: Building a new array proportional to the input uses O(n) extra space, even if the algorithm is simple.
:::

:::exercise
title: Move zeros to the end
description: Write `moveZeroes(nums)` that mutates `nums` so all non-zero elements keep their relative order, and zeros move to the end. Use O(1) extra space — one pass with a write pointer is enough.
starterCode: |
  function moveZeroes(nums) {
    // Hint: write non-zeros to the front, then fill the rest with 0.
  }

  const a = [0, 1, 0, 3, 12];
  moveZeroes(a);
  console.log(a); // [1, 3, 12, 0, 0]
:::

## Practice

- [Remove Duplicates from Sorted Array](/problems/remove-duplicates-from-sorted-array) — canonical read/write pointer.
- [Merge Sorted Array](/problems/merge-sorted-array) — two pointers from the ends or from the start depending on variant.
