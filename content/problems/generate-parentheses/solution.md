## Approach: Backtracking

Build the string one character at a time. At every step, keep two invariants:

1. Add `'('` only if we have used fewer than `n` opens so far.
2. Add `')'` only if the number of closes is strictly less than the number of opens — this prevents invalid prefixes like `())`.

When the string reaches length `2n` it is guaranteed valid, so we record it.

```javascript
function generateParentheses(n) {
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

**Time:** O(4^n / √n) — the nth Catalan number bounds the number of valid strings.
**Space:** O(n) for the recursion stack (plus the output).

## Why the pruning matters

A naive version that generates all `2^(2n)` strings of length `2n` and filters invalid ones would do exponentially more work. By rejecting invalid prefixes early — refusing to add `)` unless there is an unmatched `(` — we only explore the Catalan-number-sized tree of valid prefixes. This is the essence of **backtracking**: cut off branches as soon as a constraint would be violated.
