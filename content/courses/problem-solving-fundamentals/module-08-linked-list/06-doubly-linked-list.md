# Doubly Linked List

A **doubly linked list** (DLL) is a linked list where each node carries **two** pointers:

- `next` — to the following node (or `null` at the tail).
- `prev` — to the preceding node (or `null` at the head).

This tiny addition unlocks **bidirectional traversal** and **O(1) deletion given only a node reference** — properties the singly linked list cannot match. In exchange, you pay one extra pointer per node and must keep `prev`/`next` in sync on every modification.

The DLL is the backbone of many real data structures: the **deque** (Module 07, lesson 5), **LRU cache** (hash map + DLL), browser history, editor lines, and the quirky LC 430 (flatten a multilevel DLL).

## The node

```javascript
class DNode {
  constructor(val = 0, prev = null, next = null) {
    this.val = val;
    this.prev = prev;
    this.next = next;
  }
}
```

## Visualization

```text
null ◄── [A] ◄──► [B] ◄──► [C] ──► null
         head              tail
```

Every internal node has both pointers; boundary nodes have `prev === null` at the head and `next === null` at the tail.

## A minimal DLL class

Most real DLL code keeps a **head + tail** pair of pointers so both ends are reachable in O(1), plus an optional **size** counter for O(1) length queries.

```javascript
class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.count = 0;
  }

  addFront(val) {
    const node = new DNode(val, null, this.head);
    if (this.head) this.head.prev = node;
    else this.tail = node;
    this.head = node;
    this.count++;
    return node;
  }

  addBack(val) {
    const node = new DNode(val, this.tail, null);
    if (this.tail) this.tail.next = node;
    else this.head = node;
    this.tail = node;
    this.count++;
    return node;
  }

  removeFront() {
    if (!this.head) return undefined;
    const v = this.head.val;
    this.head = this.head.next;
    if (this.head) this.head.prev = null;
    else this.tail = null;
    this.count--;
    return v;
  }

  removeBack() {
    if (!this.tail) return undefined;
    const v = this.tail.val;
    this.tail = this.tail.prev;
    if (this.tail) this.tail.next = null;
    else this.head = null;
    this.count--;
    return v;
  }

  removeNode(node) {
    const p = node.prev, n = node.next;
    if (p) p.next = n; else this.head = n;
    if (n) n.prev = p; else this.tail = p;
    node.prev = node.next = null;
    this.count--;
  }

  size() { return this.count; }
  isEmpty() { return this.count === 0; }
}
```

All operations are **O(1)** worst case.

## The magical `removeNode(node)`

This is the DLL's superpower: given **only** a reference to a node (not its position, not its predecessor), unlink it in O(1):

```javascript
removeNode(node) {
  const p = node.prev, n = node.next;
  if (p) p.next = n; else this.head = n;
  if (n) n.prev = p; else this.tail = p;
  node.prev = node.next = null;
}
```

This is not possible on a singly linked list — you'd need to walk from the head to find the predecessor, which is O(n). The DLL gives each node access to its predecessor for free, turning `removeNode(x)` into a handful of pointer updates.

This is the property that makes the DLL the right data structure for **LRU caches** (touch/move-to-front operations must be O(1)) and **task queues** where you can cancel an arbitrary pending task.

## Iterating forward and backward

```javascript
// forward
for (let cur = list.head; cur !== null; cur = cur.next) use(cur);

// backward
for (let cur = list.tail; cur !== null; cur = cur.prev) use(cur);
```

Bidirectional traversal is the other DLL superpower — invaluable when you need to step back to revise a decision.

## Insertion at arbitrary position (insertAfter / insertBefore)

Two universal helpers, both O(1) given a reference node:

```javascript
function insertAfter(list, ref, val) {
  const node = new DNode(val, ref, ref.next);
  if (ref.next) ref.next.prev = node;
  else list.tail = node;
  ref.next = node;
  list.count++;
}

function insertBefore(list, ref, val) {
  const node = new DNode(val, ref.prev, ref);
  if (ref.prev) ref.prev.next = node;
  else list.head = node;
  ref.prev = node;
  list.count++;
}
```

Three pointer updates per insertion, symmetric either way.

## Singly vs doubly — when does doubling pay off?

| Benefit | Singly | Doubly |
| --- | --- | --- |
| Forward traversal | ✓ | ✓ |
| Backward traversal | ✗ | ✓ |
| Remove node given only its pointer | ✗ (O(n)) | ✓ (O(1)) |
| Per-node memory | 1 pointer + value | 2 pointers + value |
| Bug surface | Smaller | Larger (keep prev/next in sync) |

**Reach for a DLL when:**

- Arbitrary-position deletion must be O(1) (LRU, deque, undo lists).
- You iterate backwards frequently.
- You splice sublists.

**Stick with singly linked when:**

- The problem only needs forward traversal (most interview LL problems).
- Memory is tight.
- You don't want the extra `prev`-sync bookkeeping.

## Splicing two DLLs

A characteristic DLL operation: **insert list B between nodes A1 and A2 of list A**, in O(1) given references. This is prohibitively messy on a singly linked list if A1 isn't the head.

```javascript
// Given a..A1 <-> A2..z in list A, and B's head bHead and tail bTail.
// Link A1 <-> bHead ... bTail <-> A2.
A1.next = bHead;  bHead.prev = A1;
bTail.next = A2;  A2.prev = bTail;
```

Four pointer writes; lengths don't matter. This ability to glue and split lists cheaply is why DLLs underpin persistent undo histories and incremental editors.

## Common bugs

1. **Updating `next` but not `prev` (or vice versa).** Every DLL modification writes **two** pointer updates per boundary. Forgetting one silently desyncs the list — iteration appears correct in one direction and broken in the other.
2. **Dropping `head` on removeFront without updating the new head's `prev`.** The second node must get `prev = null`.
3. **Forgetting the empty-transition cases.** removeFront that empties the list must set `tail = null` too.
4. **Creating orphan pointers.** After `removeNode(x)`, you should null out `x.prev` and `x.next` to help the garbage collector and avoid accidental re-use.

## Sanity-checking technique

When debugging DLLs, walk the list **both** directions and compare:

```javascript
function sanityCheck(list) {
  const fwd = [];
  for (let c = list.head; c; c = c.next) fwd.push(c.val);
  const bwd = [];
  for (let c = list.tail; c; c = c.prev) bwd.push(c.val);
  bwd.reverse();
  console.log(fwd.join() === bwd.join() ? "OK" : `MISMATCH fwd=${fwd} bwd=${bwd}`);
}
```

A forward/backward mismatch is always a prev/next desync bug. Start debugging where the mismatch diverges.

:::quiz
question: Which operation is O(1) on a doubly linked list but O(n) on a singly linked list (given only a pointer to the target node)?
options:
  - Removing a node from the middle.
  - Traversing to the head.
answer: 0
explanation: The DLL's prev pointer gives you the predecessor for free; in a singly linked list, you'd have to walk from head.
:::

:::quiz
question: How many pointer updates does a middle-of-list insertion in a DLL require?
options:
  - 3 (the new node's prev, the new node's next, and either the predecessor's next or the successor's prev).
  - Exactly 4 — new node's two pointers plus predecessor.next and successor.prev.
answer: 1
explanation: Both neighbors must be updated on both sides: four pointer writes.
:::

:::quiz
question: You're building an LRU cache. Why is a DLL (usually paired with a hash map) the right backbone?
options:
  - Touching a node (move to front) must be O(1); a DLL supports unlinking any node and relinking at head in O(1).
  - Singly linked lists already do it.
answer: 0
explanation: LRU requires O(1) unlink-anywhere and O(1) move-to-head; the DLL delivers both.
:::

:::exercise
title: Build a DLL with O(1) removeNode
description: Implement DoublyLinkedList with addFront, addBack, removeFront, removeBack, and removeNode(node). Return values via removeNode isn't required — unlink in place and decrement count.
starterCode: |
  class DNode {
    constructor(val = 0, prev = null, next = null) {
      this.val = val; this.prev = prev; this.next = next;
    }
  }

  class DoublyLinkedList {
    constructor() { this.head = null; this.tail = null; this.count = 0; }
    addFront(val)  { /* ... */ }
    addBack(val)   { /* ... */ }
    removeFront()  { /* ... */ }
    removeBack()   { /* ... */ }
    removeNode(n)  { /* unlink n in O(1) */ }
    size()         { return this.count; }
  }

  const d = new DoublyLinkedList();
  const a = d.addBack("A");
  const b = d.addBack("B");
  const c = d.addBack("C");
  d.removeNode(b);
  console.log(d.size());        // 2
  console.log(a.next === c);    // true
  console.log(c.prev === a);    // true
:::

## Practice

No dedicated practice folder for plain DLL construction in this repo. Lessons 09–21 focus on singly linked lists, which are more common in interviews.
