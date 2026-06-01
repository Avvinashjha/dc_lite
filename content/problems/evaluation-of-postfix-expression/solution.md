## Stack-Based Evaluation

```javascript
function evaluatePostfix(exp) {
  const stack = [];
  for (const c of exp) {
    if ('+-*/'.includes(c)) {
      const b = stack.pop(), a = stack.pop();
      if (c === '+') stack.push(a + b);
      else if (c === '-') stack.push(a - b);
      else if (c === '*') stack.push(a * b);
      else stack.push(Math.trunc(a / b));
    } else stack.push(Number(c));
  }
  return stack[0];
}
```

**Time:** O(n) | **Space:** O(n)
