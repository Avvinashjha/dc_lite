# The Merge Operation (Two Sorted Ranges)

Before diving into merge sort, master its engine: **merge two sorted sequences into one sorted output** in linear time. This operation is useful on its own (LeetCode 88 "Merge Sorted Array") and is the building block of merge sort.

## The idea

Walk both inputs with two pointers. At each step, take the **smaller front element** and write it to the output.

```text
left  = [1, 4, 6]   i
right = [2, 3, 5]   j
out   = []

compare left[0]=1 with right[0]=2 -> take 1 -> out=[1]        i++
compare left[1]=4 with right[0]=2 -> take 2 -> out=[1,2]      j++
compare left[1]=4 with right[1]=3 -> take 3 -> out=[1,2,3]    j++
compare left[1]=4 with right[2]=5 -> take 4 -> out=[1,2,3,4]  i++
compare left[2]=6 with right[2]=5 -> take 5 -> out=[1,2,3,4,5] j++
right exhausted -> copy remaining left -> out=[1,2,3,4,5,6]
```

## The code: two sorted arrays → new array

```javascript
function mergeArrays(left, right) {
  const out = new Array(left.length + right.length);
  let i = 0;
  let j = 0;
  let k = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out[k++] = left[i++];
    else out[k++] = right[j++];
  }
  while (i < left.length) out[k++] = left[i++];
  while (j < right.length) out[k++] = right[j++];
  return out;
}
```

Key detail: the comparison is `left[i] <= right[j]` (not `<`). Taking from the **left** on ties is what keeps the merge **stable**.

## The code: in-place merge of two sorted halves of one array

This is the form used inside merge sort. Two sorted ranges `[lo..mid]` and `[mid+1..hi]` share the same array; we merge them using an **auxiliary buffer** `aux` of the merged length, then copy back.

```javascript
function merge(arr, lo, mid, hi, aux) {
  let i = lo;
  let j = mid + 1;
  let k = 0;
  while (i <= mid && j <= hi) {
    if (arr[i] <= arr[j]) aux[k++] = arr[i++];
    else aux[k++] = arr[j++];
  }
  while (i <= mid) aux[k++] = arr[i++];
  while (j <= hi) aux[k++] = arr[j++];
  for (let t = 0; t < k; t++) arr[lo + t] = aux[t];
}
```

## Complexity

- **Time:** O(n + m) — each element read and written once.
- **Space:** O(n + m) for the auxiliary output (or the shared `aux` buffer).

## LeetCode 88 twist — merging into the end of nums1

LeetCode 88 gives you `nums1` of length `m + n` with the first `m` positions filled and trailing zeros as padding, and asks for an **in-place** merge. The trick is to merge **from the back** so you never overwrite unread data.

```javascript
function merge88(nums1, m, nums2, n) {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;
  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
    else nums1[k--] = nums2[j--];
  }
  while (j >= 0) nums1[k--] = nums2[j--];
}
```

## Why this deserves its own lesson

Merge sort's recursive structure is easy once the merge step is rock-solid. Most merge-sort bugs in interviews are actually **merge bugs** — off-by-one on `<= mid`, forgetting to drain one side, overwriting during in-place merge. Nail this step first.

:::quiz
question: To keep the merge stable, the comparison should be:
options:
  - `left[i] <= right[j]` (take from left on ties).
  - `left[i] < right[j]` (take from right on ties).
answer: 0
explanation: On ties, taking the left side first preserves relative order of equal elements from the original left half.
:::

:::quiz
question: For LeetCode 88, why do we merge from the back of nums1 instead of the front?
options:
  - Because the tail of nums1 is padding, so writing from the back never overwrites an unread value.
  - Because JavaScript arrays grow backwards.
answer: 0
explanation: Writing from the back uses the padded region for the merged output; writing from the front would clobber unread source values.
:::

:::quiz
question: Time complexity of merging two sorted arrays of lengths n and m is:
options:
  - O(n + m)
  - O(n * m)
  - O((n + m) log(n + m))
answer: 0
explanation: Each element is examined exactly once, yielding linear time in the combined length.
:::

:::exercise
title: Implement mergeArrays
description: Implement `mergeArrays(left, right)` that returns a new sorted array. Make sure it is stable (`<=` on ties).
starterCode: |
  function mergeArrays(left, right) {
    const out = new Array(left.length + right.length);
    let i = 0, j = 0, k = 0;
    // while both non-empty
    // drain remaining
    return out;
  }

  console.log(mergeArrays([1, 4, 6], [2, 3, 5])); // [1,2,3,4,5,6]
  console.log(mergeArrays([], [1, 2]));            // [1,2]
  console.log(mergeArrays([1, 1], [1, 2]));        // [1,1,1,2]
:::

## Practice

- [Merge Sorted Array](/problems/merge-sorted-array) — exactly LC 88.
- [Merge Two Sorted Lists](/problems/merge-two-sorted-lists) — same idea on linked lists.
