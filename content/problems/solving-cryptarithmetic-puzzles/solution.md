## Approach: Backtracking with Constraint Checking

Extract all unique letters, then try assigning each an unused digit via backtracking. After all letters are assigned, check if the equation holds. Prune by enforcing the leading-letter-not-zero constraint early.

```javascript
function solveCryptarithmetic(words, result) {
  const letters = [...new Set([...words.join(''), ...result])];
  const leadingLetters = new Set([...words.map(w => w[0]), result[0]]);
  const assignment = {};
  const usedDigits = new Set();

  function wordToNum(word) {
    return word.split('').reduce((acc, ch) => acc * 10 + assignment[ch], 0);
  }

  function solve(idx) {
    if (idx === letters.length) {
      const sum = words.reduce((acc, w) => acc + wordToNum(w), 0);
      return sum === wordToNum(result);
    }

    const letter = letters[idx];
    const start = leadingLetters.has(letter) ? 1 : 0;

    for (let d = start; d <= 9; d++) {
      if (usedDigits.has(d)) continue;
      assignment[letter] = d;
      usedDigits.add(d);
      if (solve(idx + 1)) return true;
      usedDigits.delete(d);
      delete assignment[letter];
    }
    return false;
  }

  if (solve(0)) return { ...assignment };
  return null;
}
```

**Time Complexity:** O(10! / (10-n)!) where n is the number of unique letters

**Space Complexity:** O(n) for recursion and the assignment map
