Use backtracking to place numbers 1 to n into positions 1 to n. At each position, only place a number if it satisfies the divisibility condition (position divides number or number divides position).

```javascript
function countArrangement(n) {
  let count = 0;
  const visited = new Array(n + 1).fill(false);

  function backtrack(pos) {
    if (pos > n) {
      count++;
      return;
    }
    for (let num = 1; num <= n; num++) {
      if (!visited[num] && (num % pos === 0 || pos % num === 0)) {
        visited[num] = true;
        backtrack(pos + 1);
        visited[num] = false;
      }
    }
  }

  backtrack(1);
  return count;
}
```

**Time:** O(k) where k is the number of valid permutations (bounded by n!)
**Space:** O(n) for recursion stack and visited array
