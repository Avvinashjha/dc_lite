# Array-Backed Stack Implementation

In JavaScript, a plain `Array` **is** a stack if you only use `push` and `pop`. Both are amortized **O(1)** and operate on the end of the array, which is exactly the "top" of a stack. This lesson writes a thin `Stack` class wrapper so the intent is explicit — useful in interviews and in real code where semantics matter.

## The code

```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  push(x) {
    this.items.push(x);
  }

  pop() {
    if (this.isEmpty()) throw new Error("pop from empty stack");
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) throw new Error("peek on empty stack");
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}
```

Everything maps one-to-one to the five operations from the previous lesson. Behavior on `pop` / `peek` of an empty stack is a design choice — the two common conventions are **throw** (used above) and **return `undefined`**.

## Why O(1)?

- `Array.prototype.push` appends at the end. The JavaScript engine grows the internal buffer in doubling chunks, making the **amortized** cost per push O(1).
- `Array.prototype.pop` decrements the internal length and returns the last element; O(1) worst-case.
- `items[items.length - 1]` is a direct indexed read; O(1).

"Amortized O(1)" means individual pushes may occasionally take O(n) when the internal buffer needs to resize, but averaged over any long sequence of pushes the cost is constant per operation.

## Using it directly as a plain array

In a typical interview you will write something like:

```javascript
const stack = [];
stack.push(1);
stack.push(2);
stack.pop();                      // 2
stack[stack.length - 1];          // 1  (peek)
stack.length === 0;               // false (isEmpty)
```

No class needed. The wrapper above is what you'd use in **production** or when the interviewer asks you to "design a Stack class."

## Walkthrough

```text
[]
push 10 -> [10]
push 20 -> [10, 20]
push 30 -> [10, 20, 30]
peek    -> 30        ([10, 20, 30])
pop     -> 30        ([10, 20])
pop     -> 20        ([10])
size    -> 1
pop     -> 10        ([])
isEmpty -> true
```

## What NOT to do

Using `Array.prototype.unshift` and `Array.prototype.shift` also gives a stack-like API, but **both are O(n)** because they shift every other element to make room or fill the gap. Always push/pop at the **end** for constant-time stacks.

```javascript
// WRONG: O(n) per op
const badStack = [];
badStack.unshift(x);         // shifts everything right  — O(n)
const top = badStack.shift(); // shifts everything left   — O(n)
```

## Iteration

Iterating a stack is rarely done (it breaks the "only top is visible" abstraction), but if you need to, iterate `items` from the end to the start so the first yielded value is the top:

```javascript
for (let i = this.items.length - 1; i >= 0; i--) {
  yield this.items[i];
}
```

Or expose a **snapshot** as `[...items].reverse()` if you need an array in top-to-bottom order.

## Complexity summary

| Operation | Time (amortized) | Extra space |
| --- | --- | --- |
| push | O(1) | O(1) per element |
| pop | O(1) | O(1) |
| peek | O(1) | O(1) |
| isEmpty / size | O(1) | O(1) |

Total space for `n` elements: O(n).

:::quiz
question: Why do we push and pop at the END of the underlying array instead of the beginning?
options:
  - push/pop at the end are O(1) amortized; unshift/shift are O(n).
  - Because arrays do not support unshift.
answer: 0
explanation: Adding or removing at the front requires shifting every other element, which is linear per operation.
:::

:::quiz
question: What does "amortized O(1)" for push mean?
options:
  - The average cost per push over any long sequence is O(1), even though individual pushes may be O(n) when the buffer resizes.
  - Every single push is guaranteed O(1) in all cases.
answer: 0
explanation: The doubling growth strategy makes occasional O(n) copies rare enough to average out to O(1).
:::

:::quiz
question: What is a correct O(1) way to peek on an array-backed stack?
options:
  - items[items.length - 1]
  - items.find(x => true)
answer: 0
explanation: Direct index access is O(1); a linear search is O(n) and also wrong semantically.
:::

:::exercise
title: Implement the Stack class
description: Implement the `Stack` class with push, pop, peek, isEmpty, and size methods. Throw on pop/peek of an empty stack.
starterCode: |
  class Stack {
    constructor() {
      // initialize internal array
    }

    push(x) { /* ... */ }
    pop()   { /* ... */ }
    peek()  { /* ... */ }
    isEmpty() { /* ... */ }
    size()  { /* ... */ }
  }

  const s = new Stack();
  s.push(1); s.push(2); s.push(3);
  console.log(s.peek()); // 3
  console.log(s.pop());  // 3
  console.log(s.size()); // 2
:::

## Practice

No required practice for this lesson. Lessons 06+ use the stack to solve concrete interview problems.
