# Merge Two Sorted Lists

**LeetCode 21.** Given the heads of two **sorted** singly linked lists `l1` and `l2`, merge them into a single sorted list and return the head. The merged list should **reuse existing nodes** (splicing, not copying).

Example: `l1 = 1 -> 2 -> 4`, `l2 = 1 -> 3 -> 4` → `1 -> 1 -> 2 -> 3 -> 4 -> 4`.

This is a 10-line problem, but it's one of the most pattern-dense in the entire module: **dummy head + tail cursor + splice** is the template you'll reuse in merge sort (lesson 17), merge-k-sorted (LC 23), partition list (LC 86), odd-even list (LC 328), and several others.

## Iterative merge with dummy head

```javascript
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy;

  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }

  // at most one list remains non-empty — append whatever's left
  tail.next = (l1 !== null) ? l1 : l2;

  return dummy.next;
}
```

Done. Let's break it apart.

## The three key ideas

### 1. Dummy head

The dummy node lets us build the result from left to right without a special-case branch for "this is the first node." The returned head is always `dummy.next`.

### 2. Tail cursor

`tail` always points at the **last node of the output so far**. Appending is always "`tail.next = newNode; tail = tail.next`." This is an O(1)-per-append append loop.

### 3. Splicing, not copying

Notice there's no `new ListNode(...)` inside the loop. We **reuse** the input nodes, just rewiring their `next` pointers. This is the standard "in-place merge" pattern and is what makes the function O(1) extra space (beyond the dummy).

## Walkthrough

```text
l1: 1 -> 2 -> 4
l2: 1 -> 3 -> 4

Step 0: dummy -> ?    tail = dummy

Step 1: l1.val (1) <= l2.val (1). attach l1.
  dummy -> 1 -> ?   tail = 1(l1)
  l1 advances to 2.

Step 2: l1.val (2) > l2.val (1). attach l2.
  dummy -> 1 -> 1 -> ?   tail = 1(l2)
  l2 advances to 3.

Step 3: l1.val (2) <= l2.val (3). attach l1.
  dummy -> 1 -> 1 -> 2 -> ?   tail = 2
  l1 advances to 4.

Step 4: l1.val (4) > l2.val (3). attach l2.
  dummy -> 1 -> 1 -> 2 -> 3 -> ?   tail = 3
  l2 advances to 4.

Step 5: l1.val (4) <= l2.val (4). attach l1.
  dummy -> 1 -> 1 -> 2 -> 3 -> 4 -> ?   tail = 4
  l1 advances to null.

Loop exits (l1 === null).

Append remainder: tail.next = l2 (which is still 4 -> null)
  dummy -> 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> null

Return dummy.next.
```

## Why `<=` for the comparison?

Using `<=` attaches from `l1` on ties. This makes the merge **stable** — ties preserve the order of their input lists. Most problems don't care (any sorted merge is correct), but stability matters when you're sorting records with a secondary key.

`<` would work for correctness but lose stability on ties.

## The `tail.next = (l1 !== null) ? l1 : l2` trick

At loop exit, exactly one of the two inputs has been fully consumed. The other still has a sorted tail that belongs at the end of the output. We simply point `tail.next` at that remaining tail — **no need to copy or walk it**. This is the power of splicing.

A common first-attempt bug is to write two separate "if l1 is not null, walk it and attach each node" loops. That works but does O(n) extra work the splice handles in O(1).

## Complexity

- **Time:** O(n + m) where n = `len(l1)`, m = `len(l2)`. Each node is visited once.
- **Space:** O(1). We don't allocate new nodes (one dummy excepted).

## Recursive variant

The recursive version is beautiful and worth knowing:

```javascript
function mergeTwoListsRec(l1, l2) {
  if (l1 === null) return l2;
  if (l2 === null) return l1;
  if (l1.val <= l2.val) {
    l1.next = mergeTwoListsRec(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoListsRec(l1, l2.next);
    return l2;
  }
}
```

Interpretation:

- "The merged list's head is the smaller of `l1` and `l2`'s heads."
- "Its `next` is the merge of the remaining nodes."

Space: O(n + m) stack depth. Correct but dangerous for long inputs in JS. Iterative is preferred in production.

## Edge cases

- Both empty → loop never runs, `tail.next = null`, returns `dummy.next = null`. ✓
- One empty → loop never runs, `tail.next = non-empty list`. ✓
- Identical lists → merges alternately. ✓

All handled without extra code.

## When this pattern appears

- **LC 21 Merge Two Sorted Lists** (this problem).
- **LC 23 Merge k Sorted Lists** — min-heap of heads plus this merge, or a divide-and-conquer binary merge.
- **LC 148 Sort List (merge sort on list)** — base case of the divide step is "merge two sorted halves."
- **LC 86 Partition List** — build two lists (less, greater-equal) with this pattern, then concatenate.
- **LC 328 Odd-Even Linked List** — separate odd-index and even-index nodes into two lists, then concatenate.

In all five, the skeleton is **dummy + tail cursor + splice**. Once you see it three or four times, you'll never forget it.

## Common bugs

1. **Forgetting `tail = tail.next` after attaching.** Your output becomes a tangle.
2. **Walking the remainder instead of splicing.** Correct but does unnecessary O(n) work.
3. **Using `<` instead of `<=`.** Loses stability (only matters when it does).
4. **Returning `dummy` instead of `dummy.next`.** Off-by-one on the output head; the dummy's fake value leaks out.
5. **Mutating inputs unexpectedly.** Callers often expect merge to leave the inputs intact; this implementation splices them, which is standard but worth documenting.

:::quiz
question: Why does this solution use `tail.next = (l1 !== null) ? l1 : l2` instead of looping over the remainder?
options:
  - The remainder is already a sorted suffix; one pointer assignment splices it in place in O(1).
  - Looping is more readable.
answer: 0
explanation: Splicing leverages the fact that the inputs are already linked lists; no work per node needed.
:::

:::quiz
question: Why do we use `l1.val <= l2.val` (rather than strict `<`) when comparing?
options:
  - Preserves stability — elements from l1 come before equal elements from l2 in the merged output.
  - It's the only correct choice.
answer: 0
explanation: Strict `<` also works correctly, but stability is a nice-to-have and this costs nothing.
:::

:::quiz
question: Space complexity of the iterative merge:
options:
  - O(1) — the dummy and a few pointers, independent of input size.
  - O(n + m) — one new node per output element.
answer: 0
explanation: We splice existing nodes; no per-element allocation.
:::

:::exercise
title: Implement mergeTwoLists with dummy head
description: Implement `mergeTwoLists(l1, l2)` iteratively. Splice the inputs; do not allocate new nodes for the result.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function mergeTwoLists(l1, l2) {
    // dummy head + tail cursor; pick smaller of l1.val, l2.val; splice remainder
  }

  function fromArray(a) { const d = new ListNode(); let t = d; for (const v of a) { t.next = new ListNode(v); t = t.next; } return d.next; }
  function toArray(h)   { const a = []; for (let c = h; c; c = c.next) a.push(c.val); return a; }

  console.log(toArray(mergeTwoLists(fromArray([1,2,4]), fromArray([1,3,4])))); // [1,1,2,3,4,4]
  console.log(toArray(mergeTwoLists(fromArray([]),     fromArray([0]))));     // [0]
  console.log(toArray(mergeTwoLists(fromArray([]),     fromArray([]))));      // []
  console.log(toArray(mergeTwoLists(fromArray([1]),    fromArray([2]))));     // [1,2]
:::

## Practice

- [Merge Two Sorted Lists](/problems/merge-two-sorted-lists)
