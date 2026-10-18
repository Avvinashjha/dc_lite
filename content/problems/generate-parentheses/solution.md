Backtrack while keeping a count of open and close parentheses used. Add `'('` if the open count is below `n`. Add `')'` only if the close count is below the open count — this guarantees the string stays valid at every step.

```javascript
function generateParenthesis(n) {
  const result = [];
  const path = [];

  function backtrack(open, close) {
    if (path.length === 2 * n) {
      result.push(path.join(''));
      return;
    }
    if (open < n) {
      path.push('(');
      backtrack(open + 1, close);
      path.pop();
    }
    if (close < open) {
      path.push(')');
      backtrack(open, close + 1);
      path.pop();
    }
  }

  backtrack(0, 0);
  return result;
}
```

**Time:** O(n × Cn) = O(4^n / √n), where Cn is the nth Catalan number and each output string has length 2n.
**Space:** O(n) auxiliary space for the shared character buffer and recursion stack, plus O(n × Cn) for the returned strings.
