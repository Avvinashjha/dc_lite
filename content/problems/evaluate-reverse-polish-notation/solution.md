## Stack

Push numbers. For an operator, pop its right operand and then its left operand, evaluate, and push the result. `Math.trunc` handles negative division correctly.

```javascript
function evalRPN(tokens) {
  const stack = [];
  for (const t of tokens) {
    if ('+-*/'.includes(t)) {
      const b = stack.pop(),
        a = stack.pop();
      if (t === '+') stack.push(a + b);
      else if (t === '-') stack.push(a - b);
      else if (t === '*') stack.push(a * b);
      else stack.push(Math.trunc(a / b));
    } else stack.push(Number(t));
  }
  return stack[0];
}
```

**Time:** O(n) | **Space:** O(n)
