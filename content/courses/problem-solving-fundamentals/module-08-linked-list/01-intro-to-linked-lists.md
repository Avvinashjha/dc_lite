# Introduction to Linked Lists

A **linked list** is a sequence of **nodes**, where each node holds a value and a **pointer** to the next node. The sequence is reached through a single reference: the **head**. Linked lists feel clumsy at first, but they power many of the most frequently asked interview problems — and more importantly, they are the purest way to drill **pointer thinking** in JavaScript.

## The anatomy of a node

```javascript
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}
```

Two fields, no more:

- `val` — the payload stored at this node.
- `next` — a reference to the **next node**, or `null` if this is the last one.

You navigate a linked list by following `next` pointers, one hop at a time. There is **no random access**. To reach the 5th node, you walk through nodes 1, 2, 3, 4 first. There is no `list[4]`.

## Building a list by hand

```javascript
const n3 = new ListNode(3, null);
const n2 = new ListNode(2, n3);
const n1 = new ListNode(1, n2);
const head = n1;
```

Visualization:

```text
head ──► [1 | *] ──► [2 | *] ──► [3 | null]
```

A useful helper for tests:

```javascript
function fromArray(arr) {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of arr) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}

function toArray(head) {
  const out = [];
  for (let cur = head; cur !== null; cur = cur.next) out.push(cur.val);
  return out;
}

const list = fromArray([1, 2, 3]);   // head of 1 -> 2 -> 3
toArray(list);                        // [1, 2, 3]
```

You'll use `fromArray` and `toArray` over and over when testing your own code. Keep them handy.

## Singly vs doubly linked

- **Singly linked**: each node has `next` only. One-way traversal. Least memory per node.
- **Doubly linked**: each node has `next` **and** `prev`. Bi-directional traversal. Slightly more memory; much easier to delete or iterate backwards.

Most interview problems use singly linked lists. Lesson 06 covers the doubly linked variant.

## Linked list vs array

| | Linked List | Array (Dynamic Array) |
| --- | --- | --- |
| Memory layout | Scattered nodes | Contiguous buffer |
| Access by index | O(n) | O(1) |
| Insert/delete at head | O(1) | O(n) — shift everything |
| Insert/delete at tail (with tail pointer) | O(1) | O(1) amortized |
| Insert/delete in the middle (given a reference) | O(1) — just relink | O(n) — shift right side |
| Cache locality | Poor | Excellent |
| Space overhead | Extra pointer per node | Slack from doubling |

**When linked lists shine:**

- O(1) insertion / deletion when you **already have a pointer** to the right spot.
- Splicing two lists together without copying data.
- Building stacks, queues, deques with worst-case O(1) operations.
- Lists whose size isn't known in advance and varies wildly.

**When arrays are better:**

- Random access by index.
- Tight loops over all elements (cache).
- Almost any "normal" use case in application code.

In interview problems, linked lists usually show up because the problem wants to test **pointer manipulation**, not because a linked list is the best data structure for that specific task.

## Why interviewers love linked lists

1. **Pointer fluency.** Many list problems are really "can you carefully manipulate three pointers without getting confused?"
2. **Edge cases.** Empty list, single node, head / tail, cycles. A well-written solution handles all of these; a sloppy one crashes on the first.
3. **Pattern density.** A small number of patterns (two-pointer, dummy head, reverse, merge) unlock a huge fraction of the standard question bank.

## The core patterns you'll learn in this module

- **Traversal and search.**
- **Insertion and deletion** at head, tail, and arbitrary position.
- **Dummy-head pattern** — sentinel that eliminates most special-case code.
- **Two-pointer (slow / fast).** Middle, cycle detection, n-from-end.
- **Reversal.** Iterative, recursive, sublist, k-group.
- **Merging.** Two sorted lists, k sorted lists, merge-sort on a list.
- **Deep copy and structural transformation.**

Each gets its own lesson.

## The right mental posture

When you write linked-list code, think in terms of **pointer surgery**. Before touching a `.next`, know exactly which node's pointer you are rewriting and where it will point afterward. Draw a before/after diagram on paper; the code almost writes itself once the picture is correct.

The single biggest bug in list code is **losing access to a node before you are done with it**. If you do `cur.next = newNode` and `newNode.next = ???` but you've already discarded the old `cur.next`, you've severed the rest of the list. Always save references **before** overwriting them.

## Key vocabulary

- **Head** — the first node (or `null` for an empty list).
- **Tail** — the last node, whose `next` is `null`.
- **Node** — one record in the list.
- **Pointer / reference** — the `next` field (or `prev` in doubly linked).
- **Sentinel / dummy** — a fake node used as a placeholder, often before the head, to simplify code.

:::quiz
question: Why is accessing the k-th element of a singly linked list O(k) rather than O(1)?
options:
  - There is no index; you must walk from the head following `next` pointers.
  - JavaScript arrays secretly back the list.
answer: 0
explanation: Random access requires either an index (arrays) or additional structure; singly linked lists offer neither.
:::

:::quiz
question: Which operation is faster on a linked list than on a dynamic array?
options:
  - Inserting at the head (linked list: O(1); array: O(n) because everything must shift).
  - Accessing by index.
answer: 0
explanation: Head insertion is the canonical "linked list wins" scenario; array head insertion is O(n).
:::

:::quiz
question: What is the `next` field of the last node in a linked list?
options:
  - `null`
  - A pointer back to the head.
answer: 0
explanation: The tail's `next` is `null` by convention; a pointer back to the head would form a cycle.
:::

:::exercise
title: Build helpers and a three-node list
description: Implement `fromArray` and `toArray` helpers, then build `1 -> 2 -> 3` twice — once by hand with new ListNode(...), once via the helper — and verify both produce the same array.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) {
      this.val = val;
      this.next = next;
    }
  }

  function fromArray(arr) { /* build list, return head */ }
  function toArray(head)  { /* walk list, return array */ }

  const a = new ListNode(1, new ListNode(2, new ListNode(3)));
  const b = fromArray([1, 2, 3]);
  console.log(toArray(a));   // [1, 2, 3]
  console.log(toArray(b));   // [1, 2, 3]
:::

## Practice

No required practice for this lesson. The next lesson begins with traversal, length, and search — the basic building blocks.
