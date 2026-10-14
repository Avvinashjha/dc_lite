Backtrack while keeping a count of open and close parentheses used. Add `'('` if the open count is below `n`. Add `')'` only if the close count is below the open count — this guarantees the string stays valid at every step.

```javascript
function generateParenthesis(n) {
  const result = [];

  function backtrack(current, open, close) {
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }
    if (open < n) {
      backtrack(current + '(', open + 1, close);
    }
    if (close < open) {
      backtrack(current + ')', open, close + 1);
    }
  }

  backtrack('', 0, 0);
  return result;
}
```

**Time:** O(n × Cn) = O(4^n / √n), where Cn is the nth Catalan number and each output string has length 2n.
**Space:** O(n) for the recursion stack.
