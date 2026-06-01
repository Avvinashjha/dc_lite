## Approach: Stack-based with Next/Prev Smaller

For each element, compute the range where it is the minimum using next-smaller and prev-smaller stacks. That element is the answer for a window of that range length. Fill remaining positions from right to left.

```javascript
function maximumOfMinimumsOfEveryWindowSizeInAGivenArray(arr) {
  const n = arr.length;
  const left = new Array(n), right = new Array(n), stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && arr[stack[stack.length-1]] >= arr[i]) stack.pop();
    left[i] = stack.length ? stack[stack.length-1] : -1;
    stack.push(i);
  }
  stack.length = 0;
  for (let i = n-1; i >= 0; i--) {
    while (stack.length && arr[stack[stack.length-1]] >= arr[i]) stack.pop();
    right[i] = stack.length ? stack[stack.length-1] : n;
    stack.push(i);
  }
  const result = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    const len = right[i] - left[i] - 1;
    result[len] = Math.max(result[len], arr[i]);
  }
  for (let i = n-1; i >= 1; i--) result[i] = Math.max(result[i], result[i+1]);
  return result.slice(1);
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(n)
