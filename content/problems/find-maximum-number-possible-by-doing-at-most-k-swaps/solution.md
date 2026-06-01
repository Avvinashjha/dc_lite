## Approach: Backtracking

For each position from left to right, find the maximum digit in the remaining positions. If it's larger than the current digit, swap them and recurse with `k - 1`. Track the global maximum found so far. Prune by skipping positions where the digit is already the max possible.

```javascript
function findMaximumNum(num, k) {
  let maxNum = num.split('');

  function solve(arr, k, idx) {
    if (k === 0 || idx === arr.length) return;

    let maxDigit = arr[idx];
    for (let i = idx + 1; i < arr.length; i++) {
      if (arr[i] > maxDigit) maxDigit = arr[i];
    }

    if (maxDigit === arr[idx]) {
      solve(arr, k, idx + 1);
      return;
    }

    for (let i = arr.length - 1; i > idx; i--) {
      if (arr[i] === maxDigit) {
        [arr[idx], arr[i]] = [arr[i], arr[idx]];
        if (arr.join('') > maxNum.join('')) {
          maxNum = [...arr];
        }
        solve(arr, k - 1, idx + 1);
        [arr[idx], arr[i]] = [arr[i], arr[idx]];
      }
    }
  }

  solve(num.split(''), k, 0);
  return maxNum.join('');
}
```

**Time Complexity:** O(n! / (n-k)!) in the worst case, but pruning makes it much faster in practice

**Space Complexity:** O(n) for recursion stack
