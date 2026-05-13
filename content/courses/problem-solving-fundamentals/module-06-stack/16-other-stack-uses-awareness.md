# Other Stack Uses: Call Stack, Undo/Redo, Infix-to-Postfix (Awareness)

This is a short awareness lesson — recognizing three real-world stack use-cases so you can identify them when an interviewer gestures at them. We won't drill any of these; they are mostly background knowledge and cultural context.

## 1. The function call stack

Every programming language with function calls has a **call stack** in its runtime:

- When a function is called, a **stack frame** is pushed — holding its parameters, local variables, and the return address.
- When the function returns, its frame is popped.
- The currently-executing function is always the top frame.

Consequences for everyday programming:

- **Recursion depth is bounded** by the call stack size. Excessive recursion → **stack overflow**. In Node.js that's typically ~10,000–15,000 frames.
- **Tail calls** (returning the result of another call as the last step) **could** in principle be optimized to reuse the current frame. Strict-mode JavaScript specifies tail-call optimization, but most engines (V8) don't implement it in practice.
- The error stack trace you see in the console is a snapshot of the call stack at the moment the error was thrown.

You don't implement this — the runtime does. But understanding that it **is** a stack helps debug infinite recursion, understand async vs sync flow, and reason about memory usage of recursive algorithms (the recursion's depth equals the extra stack space).

## 2. Undo / Redo

Editor-style undo is a stack. Every action pushes an **inverse operation** onto the undo stack. When the user presses undo:

- Pop the top action.
- Apply its inverse to the document.
- Push the inverse onto the **redo stack**.

When the user edits after undoing, **clear the redo stack** — the alternate future no longer makes sense.

```javascript
class UndoManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  apply(action) {
    action.do();
    this.undoStack.push(action);
    this.redoStack = [];       // any new action invalidates redo
  }

  undo() {
    if (this.undoStack.length === 0) return;
    const a = this.undoStack.pop();
    a.undo();
    this.redoStack.push(a);
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const a = this.redoStack.pop();
    a.do();
    this.undoStack.push(a);
  }
}
```

Same structure appears in: **browser back/forward buttons**, **terminal command history traversal**, **tree editors with checkpointing**, **game state rewind**.

## 3. Infix to Postfix conversion (shunting-yard, brief sketch)

Shunting-yard converts human-readable **infix** expressions (`3 + 4 * 2`) into the RPN form we evaluated in lesson 08 (`3 4 2 * +`). It uses **two stacks** — an output queue (really a list) and an operator stack.

High-level rules while scanning left to right:

- **Operand:** append to output.
- **Operator:** while the operator stack has an op of **higher or equal precedence**, pop it to output. Then push the new operator.
- **Left parenthesis:** push onto operator stack.
- **Right parenthesis:** pop operators to output until the matching left paren; discard the left paren.
- **End of input:** pop remaining operators to output.

The algorithm is clean and efficient (O(n)). The full implementation is worth writing once if you want to build a calculator, but it's **rarely asked verbatim** in interviews — instead, you're often asked to evaluate an infix expression directly (Basic Calculator family), which combines shunting-yard ideas with direct evaluation.

For interview preparation, it's enough to know:

- Converting infix to postfix is a **stack-based parsing** problem.
- Operator **precedence** and **associativity** determine when an operator is popped from the stack to output.
- Parentheses are handled as **push on left, pop-until-matching on right** — same pattern as valid-parentheses.

## Where else stacks appear

- **Browser history** (back button).
- **DFS traversal** of trees and graphs (either recursive via call stack, or iterative with an explicit stack).
- **Expression parsing** in compilers and interpreters.
- **Window activation stack** in operating systems.
- **Backtracking algorithms** — each recursive call represents a saved state.

Any time the problem involves "go back to the most recent state" or "process the most recently seen thing," a stack is almost certainly the right data structure.

## What to take away

When you see any of these words in a problem statement, your first thought should be **stack**:

- "most recent"
- "undo" / "revert"
- "nested"
- "match pair"
- "balanced"
- "backtrack"
- "call depth"

The next lesson closes out the module with a complexity cheat sheet and a practice ladder.

:::quiz
question: When you get a stack-overflow error from deep recursion, what has happened?
options:
  - The runtime's call stack exceeded its maximum frame count; each recursive call pushed a frame and the runtime refused to push more.
  - The CPU cache was exhausted.
answer: 0
explanation: The runtime's call stack has a bounded size; deep recursion exhausts it.
:::

:::quiz
question: Why does performing a new action clear the redo stack in undo/redo systems?
options:
  - The new action creates a new timeline, invalidating any "future" actions that were previously undone.
  - To save memory.
answer: 0
explanation: The redo stack represents the path forward that was abandoned; new actions make it stale.
:::

:::quiz
question: Which of the following is NOT naturally modeled with a stack?
options:
  - Balanced bracket validation.
  - Priority-based task scheduling (e.g., serving the highest-priority task first).
answer: 1
explanation: Priority scheduling is a heap; stacks serve only LIFO order.
:::

## Practice

No required practice for this awareness lesson. The next lesson has the full module practice ladder.
