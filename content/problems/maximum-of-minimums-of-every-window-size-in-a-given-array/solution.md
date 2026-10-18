## Approach: Stack-based with Next/Prev Smaller

For each element, compute the range where it is the minimum using next-smaller and prev-smaller stacks. That element is a candidate for the answer at that range length; take the maximum across candidates. Both boundaries are strictly smaller, so equal values do not prematurely shorten a span.

Propagate answers from larger sizes to smaller sizes: a window with minimum v contains a shorter window with minimum at least v. This fills missing sizes and ensures the answers are non-increasing. Initialize with -Infinity so negative arrays are handled correctly.

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
  const result = new Array(n + 1).fill(-Infinity);
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
