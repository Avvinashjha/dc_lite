Use a stack. Push every opening bracket. When a closing bracket appears, check that the stack is non-empty and the top matches. If the stack is empty at the end, all brackets were properly matched.

```javascript
function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };

  for (const ch of s) {
    if (ch === '(' || ch === '{' || ch === '[') {
      stack.push(ch);
    } else {
      if (stack.length === 0 || stack[stack.length - 1] !== pairs[ch]) {
        return false;
      }
      stack.pop();
    }
  }

  return stack.length === 0;
}
```

**Time:** O(n) — single pass through the string.
**Space:** O(n) — stack holds at most n/2 elements.
