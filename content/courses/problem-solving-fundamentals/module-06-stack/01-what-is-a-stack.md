# What Is a Stack? The LIFO Model

A **stack** is a linear data structure with one rule: the **last element you put in is the first one you take out**. This is called **LIFO** — Last In, First Out. Stacks are small, simple, and show up everywhere in interview problems once you learn to recognize the pattern.

## Real-world analogies

- A stack of **plates** on a cafeteria spring-loaded tray: you put a plate on top; you take from the top.
- A stack of **books** on a desk: add to top, remove from top.
- Your browser's **back button**: visiting new pages pushes history; pressing back pops the most recent.
- The function **call stack** of any programming language: each function call is pushed on top; returning pops it off.

The common thread: **you only ever access the top**. You cannot reach into the middle without removing everything above it.

## The abstract operations

A stack is defined by five operations — independent of how it's actually stored:

| Operation | What it does | Time |
| --- | --- | --- |
| `push(x)` | Put `x` on top | O(1) |
| `pop()` | Remove and return the top | O(1) |
| `peek()` / `top()` | Return the top without removing it | O(1) |
| `isEmpty()` | Is the stack empty? | O(1) |
| `size()` | How many elements are in the stack? | O(1) |

All five operations are **constant time** — that's what makes stacks so cheap to use.

## A mental picture

```text
push(1)   push(2)   push(3)   pop()    peek()
                    |---|
                    | 3 |             returns 3
          |---|     |---|     |---|
          | 2 |     | 2 |     | 2 |    returns 2 (still there)
|---|     |---|     |---|     |---|
| 1 |     | 1 |     | 1 |     | 1 |
|---|     |---|     |---|     |---|
```

`pop` returned `3`; after that, `peek` returned `2` without removing it.

## Stack vs queue — the one-line difference

- **Stack:** Last In, First Out (LIFO). Add and remove at the **same end**.
- **Queue:** First In, First Out (FIFO). Add at one end, remove at the other.

A line at a ticket counter is a queue; a stack of plates is a stack.

## Why stacks appear so often in interviews

Many problems reduce to "what was the most recent thing I saw that matters?" Examples you will meet in this module:

- **Valid parentheses:** the most recent unclosed bracket.
- **Next greater element:** the most recent unresolved value.
- **Evaluate RPN:** the most recent operands.
- **Function call tracing:** the most recent unfinished function.

Once you see the "most recent unresolved X" shape, a stack is almost always the right tool.

## How it's implemented

Two standard implementations — both O(1) per operation:

1. **Array-backed** (next lesson) — a JavaScript `Array` used as a dynamic stack.
2. **Linked-list-backed** (lesson 03) — each push creates a new head node.

You will almost always use the array version in production code; the linked-list version is occasionally asked in interviews to test your pointer fluency.

## Key vocabulary

- **Top of stack:** the last element pushed; the first one that would be popped.
- **Bottom of stack:** the first element pushed; the hardest one to reach.
- **Overflow:** trying to push on a fixed-capacity stack that is full. (JavaScript arrays grow dynamically, so you rarely see this unless you cap the size manually.)
- **Underflow:** trying to `pop` or `peek` on an empty stack. The right behavior depends on the API — usually throw or return a sentinel.

:::quiz
question: A stack follows which access order?
options:
  - First In, First Out (FIFO)
  - Last In, First Out (LIFO)
answer: 1
explanation: A stack always adds and removes from the same end, giving Last In, First Out behavior.
:::

:::quiz
question: Which of these is NOT a stack operation that runs in O(1)?
options:
  - push
  - pop
  - peek
  - Searching for a specific value in the middle
answer: 3
explanation: Stacks only expose the top; arbitrary-position search is not part of the ADT and would be O(n) if done by popping everything.
:::

:::quiz
question: Which everyday phenomenon is best modeled by a stack?
options:
  - People queueing at a ticket counter.
  - The back button in a browser, which returns you to the most recently visited page.
answer: 1
explanation: "Most recent first" is the defining LIFO characteristic; back-button history is a textbook stack.
:::

:::exercise
title: Predict the output
description: In comments, state what the stack trace prints for each operation. Do not write code — this is a mental-model exercise.
starterCode: |
  // Starting with an empty stack s.
  // s.push(10)
  // s.push(20)
  // s.push(30)
  // Print: s.peek()      -> ?
  // Print: s.pop()       -> ?
  // Print: s.pop()       -> ?
  // Print: s.size()      -> ?
  // Print: s.isEmpty()   -> ?
:::

## Practice

No required practice for this lesson. The next two lessons implement the stack; from lesson 06 onward you will solve interview problems with it.
