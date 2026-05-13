# Valid Parentheses

**LeetCode 20.** Given a string containing only `(`, `)`, `[`, `]`, `{`, `}`, determine whether it is well-formed — every opening bracket has a matching closing bracket of the same kind, and brackets are correctly nested.

This is the **Hello, World!** of stack interview problems. You'll see variations of it in almost every coding interview that tests data-structure fundamentals.

## Why a stack

As you scan left to right, the **most recent unclosed opening bracket** is the one that needs to be matched by the next closing bracket. "Most recent" → stack.

- **Opening bracket?** Push it.
- **Closing bracket?** The top of the stack must be the matching opener. Pop it. If it doesn't match (or the stack is empty), the string is invalid.
- **End of string?** The stack must be empty — otherwise there's an unclosed opener.

## The code

```javascript
function isValid(s) {
  const stack = [];
  const pair = { ")": "(", "]": "[", "}": "{" };

  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else {
      if (stack.pop() !== pair[ch]) return false;
    }
  }
  return stack.length === 0;
}
```

Two subtle correctness details:

- `stack.pop()` on an empty array returns `undefined`, which won't equal any valid opener — so `stack.pop() !== pair[ch]` naturally handles "closing bracket with nothing to close."
- The final check `stack.length === 0` catches strings like `(((` that never close.

## Walkthrough

```text
s = "{[()]}"

ch='{' open -> stack=['{']
ch='[' open -> stack=['{', '[']
ch='(' open -> stack=['{', '[', '(']
ch=')' close, pop '(' matches '(' -> stack=['{', '[']
ch=']' close, pop '[' matches '[' -> stack=['{']
ch='}' close, pop '{' matches '{' -> stack=[]

end of string, stack empty -> return true
```

### A failing case

```text
s = "([)]"

ch='(' open -> stack=['(']
ch='[' open -> stack=['(', '[']
ch=')' close, pop '[', expected '('    -> return false
```

Even though every bracket has a partner, they're **incorrectly nested** — the stack catches that.

### Another failing case

```text
s = "("
ch='(' -> stack=['(']
end of string, stack not empty -> return false
```

## Complexity

- **Time:** O(n) — each character is pushed and popped at most once.
- **Space:** O(n) worst case for the stack (e.g., all openers).

## Generalization

The same pattern solves any "match opening and closing tokens with nesting" problem:

- HTML / XML tag validation.
- Matching custom syntax like `BEGIN` / `END`, `{% if %}` / `{% endif %}`.
- Checking balanced parentheses in math expressions.

Replace the `pair` map with whatever your language uses.

## Common bugs

1. **Forgetting the final length check.** `"(("` passes a naive implementation that only checks closers but forgets unclosed openers.
2. **Using an object as the stack.** Stacks need order; a plain object won't do. Always use an array.
3. **Comparing with the wrong side of `pair`.** `pair[ch]` maps `')' -> '('`; the stack's top after a pop should equal `pair[ch]`, not `ch`.

:::quiz
question: Why is a stack the natural data structure for bracket matching?
options:
  - The most recent unclosed opening bracket is always the one the next closer must match — "most recent" is LIFO.
  - Because a queue would also work equally well.
answer: 0
explanation: FIFO would match the earliest unclosed opener first, which is wrong for nested structures.
:::

:::quiz
question: What must the stack look like at the end of a valid input?
options:
  - Empty — every opener has been paired.
  - Containing exactly one element.
answer: 0
explanation: Any non-empty leftover means at least one opening bracket was never closed.
:::

:::quiz
question: For input `"]"`, what does `stack.pop()` return, and how does the code handle it?
options:
  - Returns `undefined`; since `undefined !== pair[']']`, we return false — correct.
  - Throws a TypeError.
answer: 0
explanation: JavaScript's `pop` on an empty array returns `undefined`, which conveniently fails the match check.
:::

:::exercise
title: Implement isValid
description: Implement `isValid(s)` using a stack. Use a map from closing brackets to their matching openers.
starterCode: |
  function isValid(s) {
    const stack = [];
    const pair = { ")": "(", "]": "[", "}": "{" };
    // iterate over s: push openers, match+pop closers
    return stack.length === 0;
  }

  console.log(isValid("()"));      // true
  console.log(isValid("()[]{}"));  // true
  console.log(isValid("(]"));      // false
  console.log(isValid("([)]"));    // false
  console.log(isValid("{[]}"));    // true
  console.log(isValid(""));        // true
:::

## Practice

- [Valid Parentheses](/problems/valid-parentheses)
