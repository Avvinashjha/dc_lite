# Linked-List-Backed Stack Implementation

An alternative to the array implementation: use a **singly linked list** where each `push` creates a new **head node**. This is rarely needed in production JavaScript, but it's a popular interview exercise to demonstrate pointer fluency and the link between list heads and stack tops.

## The idea

Keep a single pointer `top` to the head node. Each node stores its value plus a `next` pointer to the node below it (the "previous top").

- **push(x):** create a new node pointing to the old `top`, then move `top` to it.
- **pop():** read the `top` value, advance `top` to `top.next`, return the value.
- **peek():** return `top.value`.

```text
push 1:           top -> [1|null]
push 2:           top -> [2|*] -> [1|null]
push 3:           top -> [3|*] -> [2|*] -> [1|null]
pop  (returns 3): top -> [2|*] -> [1|null]
```

## The code

```javascript
class StackLL {
  constructor() {
    this.top = null;
    this.count = 0;
  }

  push(x) {
    this.top = { value: x, next: this.top };
    this.count++;
  }

  pop() {
    if (this.top === null) throw new Error("pop from empty stack");
    const v = this.top.value;
    this.top = this.top.next;
    this.count--;
    return v;
  }

  peek() {
    if (this.top === null) throw new Error("peek on empty stack");
    return this.top.value;
  }

  isEmpty() {
    return this.top === null;
  }

  size() {
    return this.count;
  }
}
```

Every operation runs in O(1) **worst case** — no buffer resizing because each node is allocated on demand.

## Walkthrough

```text
stack.push(10) -> top = Node(10, next=null), count=1
stack.push(20) -> top = Node(20, next=Node(10,null)), count=2
stack.push(30) -> top = Node(30, next=Node(20,Node(10,null))), count=3

stack.peek() -> 30
stack.pop()  -> returns 30, top = Node(20, next=Node(10,null)), count=2
stack.pop()  -> returns 20, top = Node(10, null), count=1
```

## Array-backed vs linked-list-backed

| Aspect | Array | Linked list |
| --- | --- | --- |
| push / pop worst case | O(n) on resize (amortized O(1)) | O(1) worst-case |
| Cache locality | Excellent (contiguous memory) | Poor (node hops) |
| Per-element memory overhead | Minimal | One pointer per node |
| Typical speed in practice | Faster | Slower |
| Interview "prove you know pointers" | Acceptable | Preferred for pointer fluency questions |

**Bottom line:** In production code, use the array. In an interview where the prompt is "implement a stack using a linked list," use this.

## Why this is not the same as "implement a stack using a linked list library"

If the problem gives you an existing `LinkedList` class with `insertHead`, `removeHead`, etc. and asks you to wrap it with `Stack` methods, that's a different exercise — mostly about good encapsulation, and the complexity characteristics come from whatever the library gives you. The version above is the raw **head-pointer** stack; every operation is expressed directly in terms of node pointers.

## A subtle stability property

With the linked-list version, **existing references to previously-popped nodes keep working** — the node object still exists (until garbage collected) with its original `.value` and `.next`. This is occasionally useful in algorithm problems that want "persistent" or "immutable" stacks where old versions remain accessible. In the array version, popping reuses the same underlying buffer and you can't recover the popped value later.

## Don't manage `count` manually? Compute size by walking the list?

You could — but that makes `size()` O(n). Keeping an explicit `count` field updated by push/pop preserves O(1) for every operation at the cost of one integer of memory.

:::quiz
question: In the linked-list stack, what does `push(x)` do?
options:
  - Creates a new node whose next pointer is the old top, then sets top to the new node.
  - Walks to the tail and appends a new node there.
answer: 0
explanation: The head of the list doubles as the top of the stack; appending at the tail would be O(n).
:::

:::quiz
question: Why is the linked-list stack's worst-case push O(1) while the array-backed stack's is amortized O(1)?
options:
  - The linked list never needs to resize a shared buffer; it allocates one node at a time.
  - Arrays do not support push.
answer: 0
explanation: Array-backed stacks occasionally pay O(n) to grow the underlying buffer; linked-list nodes are independent.
:::

:::quiz
question: Which implementation is typically faster in practice despite having the worse worst case?
options:
  - The array-backed stack, due to cache locality and lower per-element overhead.
  - The linked-list-backed stack.
answer: 0
explanation: Contiguous memory and cheap indexing usually beat pointer chasing on modern hardware.
:::

:::exercise
title: Implement StackLL
description: Implement the singly-linked-list stack with push, pop, peek, isEmpty, and size. Track `count` so size is O(1).
starterCode: |
  class StackLL {
    constructor() {
      this.top = null;
      this.count = 0;
    }

    push(x) { /* create a new head node */ }
    pop()   { /* unlink and return */ }
    peek()  { /* ... */ }
    isEmpty() { return this.top === null; }
    size()  { return this.count; }
  }

  const s = new StackLL();
  s.push(1); s.push(2); s.push(3);
  console.log(s.pop()); // 3
  console.log(s.peek()); // 2
  console.log(s.size()); // 2
:::

## Practice

No required practice for this lesson. The next lesson introduces a classic composition problem: building a queue out of two stacks.
