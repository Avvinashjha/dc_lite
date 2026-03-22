## Approach: Stack with Operator Precedence

Scan left to right, building up each number. When you hit an operator (or the end), apply the *previous* operator: push for `+`/`-`, but pop-and-compute for `*`/`/` so multiplication and division are handled before addition and subtraction. Sum the stack at the end.

```javascript
function calculate(s) {
  const stack = [];
  let num = 0;
  let op = '+';

  for (let i = 0; i <= s.length; i++) {
    const ch = s[i];
    if (ch >= '0' && ch <= '9') {
      num = num * 10 + (ch - '0');
    } else if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || i === s.length) {
      if (op === '+') stack.push(num);
      else if (op === '-') stack.push(-num);
      else if (op === '*') stack.push(stack.pop() * num);
      else if (op === '/') stack.push(Math.trunc(stack.pop() / num));
      op = ch;
      num = 0;
    }
  }
  return stack.reduce((a, b) => a + b, 0);
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(n) for the stack
