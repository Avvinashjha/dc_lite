# Insertion (Head, Tail, Middle)

Insertion is where linked lists start to earn their keep. Once you have a pointer to the right spot, adding a new node is **O(1)** — no shifting, no resizing, just two pointer updates. Arrays can't do that.

This lesson walks through the three standard insertions: at the **head**, at the **tail**, and at an **arbitrary position**.

## Insert at the head

Adding a node before the current head is the easiest operation — no loop needed. The new node becomes the new head.

```javascript
function insertAtHead(head, val) {
  return new ListNode(val, head);
}
```

Usage:

```javascript
let head = fromArray([2, 3, 4]);
head = insertAtHead(head, 1);     // head now points to 1 -> 2 -> 3 -> 4
```

The function returns the **new head** because the caller's variable needs updating. Returning the head is a common linked-list idiom; get used to it.

### What happens in memory

```text
Before:   head ──► [2|*] ──► [3|*] ──► [4|null]

Create a new node with val=1 and next=head:

              [1|*]
               │
               └───► [2|*] ──► [3|*] ──► [4|null]

Return the new node. Caller reassigns head.

After:    head ──► [1|*] ──► [2|*] ──► [3|*] ──► [4|null]
```

**Time:** O(1). **Space:** O(1) per insertion (one new node).

## Insert at the tail

If you have a **tail pointer** maintained externally, tail insertion is O(1). Without one, you must walk to the end first — O(n).

Version without tail pointer:

```javascript
function insertAtTail(head, val) {
  const node = new ListNode(val);
  if (head === null) return node;
  let cur = head;
  while (cur.next !== null) cur = cur.next;
  cur.next = node;
  return head;
}
```

Version with a tail pointer (used in queue implementations, etc.):

```javascript
// assumes `tail` is kept in sync outside this function
tail.next = new ListNode(val);
tail = tail.next;
```

In problems where you build a list by appending (e.g., merging, or reconstructing), **maintain a tail pointer** so each append is O(1). This is the core idea behind the "dummy head + tail cursor" pattern you'll see in lesson 05.

### Visualization

```text
Before:   head ──► [A|*] ──► [B|null]

Walk: cur moves from A to B. Now cur.next === null -- we've found the tail.

Create new node with val=C, next=null:

                   [A|*] ──► [B|*] ──► [C|null]
                                 │
                                 └── cur.next = new node

Return head (unchanged).
```

## Insert after a given node

If you already hold a reference to the node you want to insert **after**, it's O(1):

```javascript
function insertAfter(prev, val) {
  prev.next = new ListNode(val, prev.next);
}
```

Read that carefully. We use `prev.next` **twice**: once on the right (to set the new node's `next`) and once on the left (to make `prev` point to the new node). Because JavaScript evaluates the right-hand side first, the **old** `prev.next` is captured before being overwritten. No intermediate variable needed — but if you're unsure, write it out:

```javascript
function insertAfter(prev, val) {
  const node = new ListNode(val);
  node.next = prev.next;
  prev.next = node;
}
```

Same thing. Two lines, clearly showing the two pointer updates.

### Visualization

```text
Before:   ... ──► [prev|*] ──► [after|*] ──► ...

Create node, set node.next = prev.next:
                  [prev|*] ──► [after|*]
                      ^
                  [node|*] ────┘

Set prev.next = node:
                  [prev|*] ──► [node|*] ──► [after|*]
```

## Insert at index k

Insert so the new node ends up at position `k` (0-indexed). If `k === 0`, it's a head insertion. Otherwise, walk to position `k - 1` and insert after it.

```javascript
function insertAt(head, k, val) {
  if (k === 0) return insertAtHead(head, val);
  let prev = head;
  for (let i = 0; i < k - 1 && prev !== null; i++) prev = prev.next;
  if (prev === null) return head;         // k out of range
  insertAfter(prev, val);
  return head;
}
```

**Time:** O(k). **Space:** O(1).

Walking to `k - 1` is the key step. Stopping one short of `k` gives us the **predecessor** we need to splice into.

Note how inserting at `k === 0` requires returning a **new head**, while any other position keeps the same head. That asymmetry is one of the many reasons the dummy-head trick (lesson 05) is so useful.

## Walkthrough

```text
list: 10 -> 20 -> 30 -> null

insertAtHead(head, 5):
  new node {5, next: 10}
  return new head
  list: 5 -> 10 -> 20 -> 30 -> null

insertAtTail(head, 40):
  walk cur: 5, 10, 20, 30 (cur.next===null, stop)
  cur.next = new node {40, null}
  return same head
  list: 5 -> 10 -> 20 -> 30 -> 40 -> null

insertAt(head, 2, 15):  // position 2 means between 10 and 20
  k=2 != 0
  walk prev from head: prev starts at 5
    i=0 < 1 -> prev = 10 (index 1)
  prev=10. insertAfter(10, 15)
  list: 5 -> 10 -> 15 -> 20 -> 30 -> 40 -> null
```

## Complexity summary

| Operation | Time |
| --- | --- |
| insertAtHead | O(1) |
| insertAtTail (no tail pointer) | O(n) |
| insertAtTail (with tail pointer) | O(1) |
| insertAfter(given node) | O(1) |
| insertAt(index k) | O(k) |

**Space** is always O(1) per inserted node.

## Common bugs

1. **Not returning the new head.** `insertAtHead` changes the head — forgetting to return it leaves the caller with the old head.
2. **Walking too far.** To insert at index `k`, walk to `k - 1`, not `k`. Inserting "after" the node at index `k` puts the new node at index `k + 1`.
3. **Forgetting to link `node.next = prev.next` before `prev.next = node`.** Overwriting `prev.next` first detaches the rest of the list.
4. **Calling `insertAtTail` on an empty list without the `head === null` guard.** You'll try to read `cur.next` on `null`.

## Mental model

Every insertion is two pointer writes (plus allocating the node):

```text
node.next = <the node that should come after>
<the node that should come before>.next = node
```

If you can name those two nodes, you can write the code. The **only** thing that varies is how you find them.

:::quiz
question: In `insertAfter(prev, val)`, why do we set `node.next = prev.next` BEFORE `prev.next = node`?
options:
  - If we overwrite `prev.next` first, we lose the reference to the old `prev.next` and the rest of the list becomes unreachable.
  - Just style preference — the order doesn't matter.
answer: 0
explanation: Always save pointers you need before overwriting them; otherwise you cut off access to the rest of the list.
:::

:::quiz
question: Why does `insertAtHead` return the new head, while `insertAfter(prev, val)` returns nothing?
options:
  - Head insertion changes which node is the head; the caller's head variable must be reassigned. Mid-list insertion leaves the head unchanged.
  - It's a stylistic choice; both could be symmetric.
answer: 0
explanation: The return value signals "the head you knew may no longer be valid."
:::

:::quiz
question: Time to insert at a known position (you already have a pointer to the predecessor):
options:
  - O(1)
  - O(n)
answer: 0
explanation: Just two pointer updates; no walking needed.
:::

:::exercise
title: Implement the three insertion functions
description: Implement insertAtHead, insertAtTail, and insertAt(k). Use the canonical helpers and handle edge cases (empty list, k at boundary).
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function insertAtHead(head, val) { /* return new head */ }
  function insertAtTail(head, val) { /* walk to tail, append; return head (or new node if empty) */ }
  function insertAt(head, k, val)  { /* delegate to head insertion if k===0, else walk to k-1 */ }

  function toArray(h) { const a = []; for (let c = h; c; c = c.next) a.push(c.val); return a; }

  let h = null;
  h = insertAtTail(h, 20);
  h = insertAtTail(h, 30);
  h = insertAtHead(h, 10);
  console.log(toArray(h));          // [10, 20, 30]
  h = insertAt(h, 1, 15);
  console.log(toArray(h));          // [10, 15, 20, 30]
  h = insertAt(h, 0, 5);
  console.log(toArray(h));          // [5, 10, 15, 20, 30]
:::

## Practice

No required practice for this lesson. The next lesson covers deletion — a mirror-image operation with its own edge cases.
