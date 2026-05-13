# Merge Sort on a Linked List

**LeetCode 148.** Given the head of a linked list, sort it in **ascending order** and return the head. The expected complexity is **O(n log n)** time and **O(1)** extra space (ignoring recursion stack).

This is where **merge sort truly shines**. On arrays, merge sort uses O(n) extra space for the merge buffer. On linked lists, merging is O(1) space because we splice. That makes merge sort the natural sort for linked lists — and the only O(n log n) comparison sort that achieves O(1) extra space on them.

## The recipe

Classic divide-and-conquer:

1. **Base case:** a list of 0 or 1 nodes is already sorted. Return it.
2. **Divide:** split the list into two halves.
3. **Conquer:** recursively sort each half.
4. **Combine:** merge the two sorted halves (the routine from lesson 16).

Each step uses only constant extra space; the merging is in-place by splicing.

## The code

```javascript
function sortList(head) {
  if (head === null || head.next === null) return head;

  // 1. split the list into halves
  const mid = getMid(head);
  const right = mid.next;
  mid.next = null;

  // 2. recurse on each half
  const leftSorted = sortList(head);
  const rightSorted = sortList(right);

  // 3. merge the two sorted halves
  return merge(leftSorted, rightSorted);
}

function getMid(head) {
  let slow = head;
  let fast = head.next;          // shifted start gives LEFT middle on even
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

function merge(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
    else                  { tail.next = l2; l2 = l2.next; }
    tail = tail.next;
  }
  tail.next = (l1 !== null) ? l1 : l2;
  return dummy.next;
}
```

Three pieces you already know: slow/fast (lesson 8), the merge routine (lesson 16), and straightforward divide-and-conquer recursion.

## Why `fast = head.next` (not `head`) in `getMid`?

We want the **left middle** for even-length lists so the split produces a left half of `ceil(n/2)` and a right half of `floor(n/2)`. With `fast = head`, slow lands on the right middle; we'd then split with the left half one node shorter — still correct, but by convention merge sort splits left-heavier.

More importantly: on a list of length 2, `fast = head` advances once and exits, leaving `slow = head` (so the split puts both nodes in the "left" half — infinite recursion!). Starting `fast = head.next` fixes this: slow stays at head, mid is the first node, and the split gives left=[first], right=[second]. Correct.

This is a genuinely subtle edge case. The `fast = head.next` initialization is the **load-bearing** detail that keeps merge sort correct on lists of length 2.

## Walkthrough on a small example

```text
input: 4 -> 2 -> 1 -> 3

sortList(4 -> 2 -> 1 -> 3)
  mid = getMid = 2 (left middle of 4 nodes)
  right = 1 -> 3,  left = 4 -> 2 (after split with mid.next = null)
  
  sortList(4 -> 2)
    mid = 4 (with fast = head.next initialization)
    right = 2, left = 4
    sortList(4) -> 4 (base case)
    sortList(2) -> 2 (base case)
    merge(4, 2): 2 -> 4
  
  sortList(1 -> 3)
    mid = 1
    right = 3, left = 1
    sortList(1) -> 1
    sortList(3) -> 3
    merge(1, 3): 1 -> 3
  
  merge(2 -> 4, 1 -> 3):
    pick 1 (smaller), then 2, then 3, then 4
    result: 1 -> 2 -> 3 -> 4

return: 1 -> 2 -> 3 -> 4 ✓
```

## Complexity

- **Time:** O(n log n). log n levels of recursion; at each level, the total work of merging across all sub-problems is O(n).
- **Space:** O(log n) for the recursion stack. No auxiliary O(n) buffer. For lists up to ~10^5 nodes, the stack depth is ~17 — well within JS limits.

Note the asterisk: "O(1) extra space" claims usually ignore recursion stack. Truly O(1) requires a **bottom-up iterative** merge sort (more complex; below).

## Bottom-up iterative merge sort

To avoid recursion entirely, merge sort can be written bottom-up: merge pairs of 1-node sublists into 2-node sorted sublists, then pairs of 2-node sublists into 4-node sorted sublists, etc., until the whole list is sorted.

```javascript
function sortListIterative(head) {
  let length = 0;
  for (let cur = head; cur !== null; cur = cur.next) length++;

  const dummy = new ListNode(0, head);
  for (let size = 1; size < length; size *= 2) {
    let prev = dummy;
    let cur = dummy.next;
    while (cur !== null) {
      const left = cur;
      const right = split(left, size);
      cur = split(right, size);
      prev = mergeInto(prev, left, right);
    }
  }
  return dummy.next;
}

// detach first `size` nodes of `head`; return the head of the rest
function split(head, size) {
  if (head === null) return null;
  let cur = head;
  for (let i = 1; i < size && cur.next !== null; i++) cur = cur.next;
  const rest = cur.next;
  cur.next = null;
  return rest;
}

// merge l1 and l2 onto prev.next; return the new tail
function mergeInto(prev, l1, l2) {
  let tail = prev;
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
    else                  { tail.next = l2; l2 = l2.next; }
    tail = tail.next;
  }
  tail.next = (l1 !== null) ? l1 : l2;
  while (tail.next !== null) tail = tail.next;
  return tail;
}
```

This achieves true **O(1)** extra space — no recursion. But the recursive version is shorter, more readable, and sufficient for interviews unless they specifically probe on space.

## Why merge sort, not quick sort?

Merge sort's virtues on linked lists:

- **No random access needed.** Quick sort's partitioning relies on swapping by index — awkward on linked lists. Merge sort just walks sequentially.
- **Stable.** Equal elements keep their input order.
- **Worst-case O(n log n).** Quick sort degrades to O(n²) on sorted input without a random pivot.
- **Simple to split.** Slow/fast split is O(n); merge sort's performance doesn't depend on split quality.

Quick sort on a linked list is possible (Hoare's trick for lists), but merge sort wins on simplicity, stability, and worst-case guarantees.

## Why not just copy to an array and sort?

You could:

```javascript
function sortListArr(head) {
  const arr = [];
  for (let c = head; c; c = c.next) arr.push(c.val);
  arr.sort((a, b) => a - b);
  // rebuild list
  const dummy = new ListNode(0);
  let t = dummy;
  for (const v of arr) { t.next = new ListNode(v); t = t.next; }
  return dummy.next;
}
```

Correct, O(n log n) time, but **O(n) extra space** for the array and a fresh set of nodes. The in-place merge sort is the "right" answer for the problem as stated.

Always mention the array version as a baseline in interviews.

## Complexity summary

| Approach | Time | Extra Space |
| --- | --- | --- |
| Copy to array + `Array.sort` | O(n log n) | O(n) |
| Recursive merge sort | O(n log n) | O(log n) stack |
| Bottom-up merge sort | O(n log n) | O(1) |

## When this pattern appears

- **LC 148 Sort List** (this problem).
- **LC 23 Merge k Sorted Lists** — pairwise merges in a divide-and-conquer tree, same structure as merge sort's combine step.
- **Interview variants** — "sort a linked list by a custom comparator," "merge n lists pairwise," etc.

If you've mastered sortList, you've implicitly mastered both.

## Common bugs

1. **Using `fast = head` in `getMid`.** Breaks on lists of length 2: mid lands on the second node, and the split recurses forever.
2. **Forgetting `mid.next = null`** before recursing. The left half still points into the right half, and the recursive sortList gets confused.
3. **Base case `head.next === null` missing.** You'll recurse on a one-node list, split into one + zero, recurse on zero + zero ... infinite.
4. **Modifying both halves inside the merge in ways that break the recursion.** Merge should consume its two input lists and return a single sorted list; inputs don't survive the call.

:::quiz
question: Why must `getMid` initialize `fast = head.next` (not `head`) for merge sort?
options:
  - On a 2-node list, `fast = head` would leave slow at head, so the split puts both nodes in the left half — infinite recursion.
  - It's a stylistic choice.
answer: 0
explanation: The shifted initialization ensures the left half is strictly smaller than the whole on length-2 inputs.
:::

:::quiz
question: The recursive merge sort achieves O(log n) space for which reason?
options:
  - The recursion stack depth is log n; merging itself is in-place.
  - Because it uses an O(log n) auxiliary array.
answer: 0
explanation: Merging splices existing nodes; no per-call array allocation.
:::

:::quiz
question: Why doesn't quick sort dominate merge sort on linked lists the way it often does on arrays?
options:
  - Quick sort relies on random access for efficient partitioning; linked lists don't support it cheaply. Merge sort just walks sequentially.
  - It's purely a matter of constant factors.
answer: 0
explanation: Cache locality advantages of arrays disappear on lists; merge sort's sequential scans are a natural fit.
:::

:::exercise
title: Implement sortList recursively
description: Implement `sortList(head)` using merge sort: split with slow/fast (with `fast = head.next`), recurse, merge.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function sortList(head) {
    if (head === null || head.next === null) return head;
    // split
    // recurse
    // merge
  }

  function fromArray(a) { const d = new ListNode(); let t = d; for (const v of a) { t.next = new ListNode(v); t = t.next; } return d.next; }
  function toArray(h)   { const a = []; for (let c = h; c; c = c.next) a.push(c.val); return a; }

  console.log(toArray(sortList(fromArray([4,2,1,3]))));           // [1,2,3,4]
  console.log(toArray(sortList(fromArray([-1,5,3,4,0]))));        // [-1,0,3,4,5]
  console.log(toArray(sortList(fromArray([1]))));                 // [1]
  console.log(toArray(sortList(fromArray([]))));                  // []
  console.log(toArray(sortList(fromArray([2,1]))));               // [1,2]
:::

## Practice

- [Sort List](/problems/sort-list)
- [Merge k Sorted Lists](/problems/merge-k-sorted-lists)
