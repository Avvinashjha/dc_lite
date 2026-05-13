# Evaluate Reverse Polish Notation

**LeetCode 150.** Evaluate the value of an arithmetic expression given in **Reverse Polish Notation (RPN)**, also called **postfix** notation.

RPN writes operators **after** their operands. The expression `2 + 3` in infix becomes `2 3 +` in RPN. The advantage: **no parentheses needed** — operator precedence is fully encoded in the token order.

```text
Infix:   (2 + 3) * 4
RPN:      2 3 + 4 *

Infix:    2 + 3 * 4
RPN:      2 3 4 * +
```

## Why a stack?

Scanning tokens left to right, each operator consumes the **two most recently produced values** — which is exactly what a stack gives you.

- **Operand (number):** push onto the stack.
- **Operator:** pop the top two values (the second-popped is the left operand), apply the op, push the result.
- **End of input:** the final answer is the single value left on the stack.

Order matters when popping: if you pop `b` then `a`, the operator is `a OP b`, not the other way around.

## The code

```javascript
function evalRPN(tokens) {
  const stack = [];
  const ops = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => Math.trunc(a / b),   // integer division toward zero
  };

  for (const token of tokens) {
    if (token in ops) {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(ops[token](a, b));
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0];
}
```

Two details that matter:

- `Number(token)` converts the string to a number. Handles negative numbers like `"-7"` correctly.
- `Math.trunc(a / b)` implements division that truncates **toward zero** — the behavior LC 150 specifies. Plain `Math.floor` is wrong for negative quotients: `Math.floor(-7 / 2)` is `-4`, but truncation toward zero gives `-3`.

## Walkthrough

```text
tokens = ["2", "1", "+", "3", "*"]   (this is (2 + 1) * 3)

"2" -> stack=[2]
"1" -> stack=[2, 1]
"+" -> pop b=1, a=2, push 2+1=3 -> stack=[3]
"3" -> stack=[3, 3]
"*" -> pop b=3, a=3, push 3*3=9 -> stack=[9]

return 9
```

### A slightly trickier one

```text
tokens = ["4", "13", "5", "/", "+"]   (this is 4 + (13 / 5))

"4"  -> stack=[4]
"13" -> stack=[4, 13]
"5"  -> stack=[4, 13, 5]
"/"  -> pop b=5, a=13, push Math.trunc(13/5)=2 -> stack=[4, 2]
"+"  -> pop b=2, a=4, push 6 -> stack=[6]

return 6
```

## Complexity

- **Time:** O(n) — each token is pushed and popped at most twice.
- **Space:** O(n) worst case for the stack.

## The broader pattern

RPN is a toy example of a huge class of problems: **expression evaluation** and **parsing** with a stack. Related problems include:

- `basic-calculator` (infix, requires handling parentheses).
- `basic-calculator-ii` (infix without parens, uses precedence).
- "Shunting-yard" algorithm for converting infix to postfix.

For interviews, mastering RPN first makes the harder infix calculators much easier — you build the calculator as an on-the-fly conversion to RPN plus this evaluator.

## Common bugs

1. **Popping in the wrong order.** It's `a - b`, not `b - a`. Pop `b` first (the more recently pushed operand is the right-hand side).
2. **Using plain `parseInt`.** `parseInt("12abc")` returns `12` silently — too lenient. `Number` throws `NaN` on invalid input, which is safer.
3. **Dividing with `/` then `Math.floor`.** Produces wrong results for negative integer division. Always use `Math.trunc` to match LC's "truncate toward zero" rule.

:::quiz
question: In RPN evaluation, what does an operator token do?
options:
  - Pops two operands, applies the op (left = second-popped, right = first-popped), pushes the result.
  - Pushes an operator token onto the stack.
answer: 0
explanation: Operators consume two operands and produce one result.
:::

:::quiz
question: Why `Math.trunc(a / b)` and not `Math.floor(a / b)`?
options:
  - The problem requires truncation toward zero; floor would round down (e.g., floor(-7/2) = -4 vs. trunc = -3).
  - They are the same for all inputs.
answer: 0
explanation: floor differs from trunc for negative quotients; the spec asks for truncation toward zero.
:::

:::quiz
question: What is the final answer after evaluating `["3", "4", "+", "2", "*"]`?
options:
  - 14  ((3+4)*2)
  - 11  (3 + 4*2)
answer: 0
explanation: Plus binds first in this RPN ordering, giving (3+4)*2 = 14.
:::

:::exercise
title: Implement evalRPN
description: Implement `evalRPN(tokens)` using the stack-based approach. Use `Math.trunc` for integer division.
starterCode: |
  function evalRPN(tokens) {
    const stack = [];
    const ops = {
      "+": (a, b) => a + b,
      "-": (a, b) => a - b,
      "*": (a, b) => a * b,
      "/": (a, b) => Math.trunc(a / b),
    };

    // iterate tokens: push numbers, apply operators
    return stack[0];
  }

  console.log(evalRPN(["2", "1", "+", "3", "*"]));         // 9
  console.log(evalRPN(["4", "13", "5", "/", "+"]));        // 6
  console.log(evalRPN(["10","6","9","3","+","-11","*","/","*","17","+","5","+"])); // 22
:::

## Practice

- [Evaluate Reverse Polish Notation](/problems/evaluate-reverse-polish-notation)
