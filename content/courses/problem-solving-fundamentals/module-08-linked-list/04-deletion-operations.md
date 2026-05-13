# Deletion (Head, Value, Position)

Deletion mirrors insertion: once you hold a pointer to the **predecessor** of the node you want to remove, unlinking is **O(1)** — a single pointer update. The subtlety is finding that predecessor and handling the case where the deleted node is the **head** itself (no predecessor exists).

This lesson walks through deleting at the head, deleting by value, and deleting by position.

## Delete the head

The new head is the old head's `next`. Anything more is unnecessary.

```javascript
function removeHead(head) {
  if (head === null) return null;
  return head.next;
}
```

**Time:** O(1). **Space:** O(1).

Visualization:

```text
Before:   head ──► [A|*] ──► [B|*] ──► [C|null]

Return head.next, which is B.
The old A is now unreferenced; garbage collected when nothing else holds it.

After:    head ──► [B|*] ──► [C|null]
```

Just like `insertAtHead`, we **return the new head** because the caller's variable needs updating.

## Delete by value (first occurrence)

Walk the list, find the first node whose `val` matches, unlink it.

```javascript
function removeValue(head, target) {
  if (head === null) return null;
  if (head.val === target) return head.next;   // remove the head
  let prev = head;
  while (prev.next !== null && prev.next.val !== target) prev = prev.next;
  if (prev.next !== null) prev.next = prev.next.next;
  return head;
}
```

Two cases that matter:

1. **Head holds the target** → return `head.next`.
2. **Target is somewhere deeper** → walk with `prev`, stopping when `prev.next` is the node to delete. Then splice: `prev.next = prev.next.next`.

**Time:** O(n). **Space:** O(1).

### The critical loop condition

The loop walks `prev` until `prev.next` is the target (or we run out of nodes). We stop on **`prev`**, not the target — because we need the predecessor to rewrite its `next`.

```text
list:    [A|*] ──► [B|*] ──► [C|*] ──► [D|null]
          prev
          
Iteration 1: prev.next = B; B.val !== target (C) -> prev = B
Iteration 2: prev.next = C; C.val === target -> stop

Now splice:
  prev.next = prev.next.next
  i.e., B.next = D

list:    [A|*] ──► [B|*] ──► [D|null]
```

## Delete all occurrences (LC 203 Remove Linked List Elements)

LC 203 asks for all-occurrences removal. The main snag: if multiple consecutive heads match, you need to remove all of them.

Option A — dummy head (preferred; we'll formalize this in lesson 05):

```javascript
function removeElements(head, val) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (prev.next !== null) {
    if (prev.next.val === val) prev.next = prev.next.next;
    else prev = prev.next;
  }
  return dummy.next;
}
```

Option B — skip leading matches first, then run the standard loop:

```javascript
function removeElements(head, val) {
  while (head !== null && head.val === val) head = head.next;
  if (head === null) return null;
  let prev = head;
  while (prev.next !== null) {
    if (prev.next.val === val) prev.next = prev.next.next;
    else prev = prev.next;
  }
  return head;
}
```

Both work. The dummy-head version is cleaner — one loop, no head-vs-rest branching.

**Time:** O(n). **Space:** O(1).

### Why `if/else`?

When `prev.next.val === val`, we **do not** advance `prev`. The removal has already shifted the next candidate into `prev.next`; advancing would skip it. The `else` branch advances `prev` only when we did not remove.

This is a common mistake to watch for.

## Delete at index k

Delete the node at position `k` (0-indexed). Walk to `k - 1`, then splice.

```javascript
function removeAt(head, k) {
  if (head === null) return null;
  if (k === 0) return head.next;
  let prev = head;
  for (let i = 0; i < k - 1 && prev.next !== null; i++) prev = prev.next;
  if (prev.next === null) return head;      // k out of range
  prev.next = prev.next.next;
  return head;
}
```

**Time:** O(k). **Space:** O(1).

Same shape as `insertAt`, same walking strategy — stop one short of `k` to get the predecessor.

## Deleting without the predecessor (LC 237 trick)

If you only have a pointer to the node you want to delete — **not** its predecessor — and the node is **not the tail**, there's a clever workaround: **overwrite this node with the contents of the next one, then delete the next.**

```javascript
function deleteNode(node) {
  if (node === null || node.next === null) return;   // can't handle tail this way
  node.val = node.next.val;
  node.next = node.next.next;
}
```

The node "becomes" its successor, and the successor is unlinked. The list looks logically correct afterwards, even though the physical node at the memory address never got unlinked.

This trick is rarely useful in real code but shows up as a trivia question (LC 237 Delete Node in a Linked List). It only works when:

- You're deleting a **non-tail** node.
- You're allowed to mutate values, not just pointers.

Most interview problems give you access to the predecessor or the head, so you rarely need this trick.

## Complexity summary

| Operation | Time | Space |
| --- | --- | --- |
| Remove head | O(1) | O(1) |
| Remove by value (first) | O(n) | O(1) |
| Remove by value (all) | O(n) | O(1) |
| Remove at index k | O(k) | O(1) |
| Delete node given only its pointer (non-tail) | O(1) | O(1) |

## Common bugs

1. **Forgetting to return the new head when it might change.** Every removal that can touch the head must return a head — even `removeAt(head, 0)` changes it.
2. **Advancing the cursor after a removal.** After `prev.next = prev.next.next`, the **new** `prev.next` is the node that used to come two after. If you also do `prev = prev.next`, you skip over this potential match.
3. **Dereferencing `null`.** `prev.next.val` crashes when `prev.next === null`. Always guard with the loop condition (`prev.next !== null`) or an explicit check.
4. **Walking to index `k` instead of `k - 1`.** You'll splice out the wrong node or miss the target altogether.

## Mental model

Every deletion is one pointer write (plus optional memory reclaim):

```text
<node before>.next = <node after>
```

If you can name the "node before," the code is one line. The rest is finding that predecessor under the various edge cases (empty list, first node, middle node, non-existent target).

The recurring theme across all list operations — **insertion, deletion, reversal, merging** — is "hold a pointer to what's about to change, before it changes." Internalize that and the rest follows.

:::quiz
question: In the by-value removal loop, why do we write `if/else` so `prev` is only advanced when we did NOT remove?
options:
  - After removing, the next candidate is already at `prev.next`; advancing would skip it, missing consecutive matches.
  - For readability — the semantics are the same either way.
answer: 0
explanation: A removal-then-unconditional-advance walks right past the next candidate.
:::

:::quiz
question: To delete the node at index k, you walk prev to:
options:
  - Index k — one past the predecessor.
  - Index k - 1 — the predecessor.
answer: 1
explanation: You need to rewrite the predecessor's `next` pointer; that's the node just before index k.
:::

:::quiz
question: The LC 237 "delete given only a pointer to the node" trick fails on which node?
options:
  - The head.
  - The tail (because there's no successor to copy from).
answer: 1
explanation: The trick copies from `node.next`; the tail has no `next`.
:::

:::exercise
title: Implement removeHead, removeValue, removeAt
description: Implement the three deletion operations. Handle empty lists and out-of-range indices gracefully.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function removeHead(head) { /* return new head */ }
  function removeValue(head, target) { /* remove first occurrence */ }
  function removeAt(head, k) { /* remove at index k; out-of-range: return unchanged */ }

  function toArray(h) { const a = []; for (let c = h; c; c = c.next) a.push(c.val); return a; }
  function fromArray(arr) { const d = new ListNode(); let t = d; for (const v of arr) { t.next = new ListNode(v); t = t.next; } return d.next; }

  console.log(toArray(removeHead(fromArray([1,2,3]))));         // [2, 3]
  console.log(toArray(removeValue(fromArray([1,2,3,4]), 2)));   // [1, 3, 4]
  console.log(toArray(removeValue(fromArray([1,2,3,4]), 1)));   // [2, 3, 4]
  console.log(toArray(removeValue(fromArray([1,2,3,4]), 99)));  // [1, 2, 3, 4]
  console.log(toArray(removeAt(fromArray([1,2,3,4]), 2)));      // [1, 2, 4]
  console.log(toArray(removeAt(fromArray([1,2,3,4]), 0)));      // [2, 3, 4]
:::

## Practice

- [Remove Linked List Elements](/problems/remove-linked-list-elements)
- [Remove Duplicates from Sorted List](/problems/remove-duplicates-from-sorted-list)
