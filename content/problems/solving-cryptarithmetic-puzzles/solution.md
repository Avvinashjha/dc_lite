## Approach: Column-by-Column Backtracking

Work from the units column toward the left. Assign unused digits to the addend letters, then enforce the result digit and carry immediately. Repeated letters reuse their assigned digit. Reject zero for leading letters. This prunes invalid assignments before completing the whole mapping and avoids converting long words to JavaScript numbers.

```javascript
function solveCryptarithmetic(words, result) {
  const letters = [...new Set(words.join('') + result)];
  if (letters.length > 10) return null;
  const leading = new Set([...words.map(w => w[0]), result[0]]);
  const assignment = {}, used = new Set();
  const width = Math.max(result.length, ...words.map(w => w.length));
  function column(col, row, sum) {
    if (col === width) return sum === 0;
    if (row < words.length) {
      const word = words[row], ch = word[word.length - 1 - col];
      if (!ch) return column(col, row + 1, sum);
      if (assignment[ch] !== undefined) return column(col, row + 1, sum + assignment[ch]);
      for (let d = leading.has(ch) ? 1 : 0; d <= 9; d++) {
        if (used.has(d)) continue;
        assignment[ch] = d; used.add(d);
        if (column(col, row + 1, sum + d)) return true;
        delete assignment[ch]; used.delete(d);
      }
      return false;
    }
    const ch = result[result.length - 1 - col];
    if (!ch) return sum === 0 && column(col + 1, 0, 0);
    const digit = sum % 10, carry = Math.floor(sum / 10);
    if (assignment[ch] !== undefined) return assignment[ch] === digit && column(col + 1, 0, carry);
    if (used.has(digit) || (digit === 0 && leading.has(ch))) return false;
    assignment[ch] = digit; used.add(digit);
    if (column(col + 1, 0, carry)) return true;
    delete assignment[ch]; used.delete(digit);
    return false;
  }
  return column(0, 0, 0) ? { ...assignment } : null;
}
```

**Time Complexity:** O(L × 10! / (10-U)!) as a loose upper bound, where U is the number of unique letters and L is the total input length

**Space Complexity:** O(L + U) for recursion and the assignment map
