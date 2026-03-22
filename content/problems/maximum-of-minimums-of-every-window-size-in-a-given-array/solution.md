## Stack-based approach

Use next/prev smaller elements to determine each element's window.

```javascript
function maxOfMin(arr) {
  const n = arr.length, left = Array(n).fill(-1), right = Array(n).fill(n), stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && arr[stack[stack.length-1]] >= arr[i]) right[stack.pop()] = i;
    if (stack.length) left[i] = stack[stack.length-1];
    stack.push(i);
  }
  const ans = Array(n+1).fill(0);
  for (let i = 0; i < n; i++) {
    const w = right[i] - left[i] - 1;
    ans[w] = Math.max(ans[w], arr[i]);
  }
  for (let i = n-1; i >= 1; i--) ans[i] = Math.max(ans[i], ans[i+1]);
  return ans.slice(1);
}
```

**Time:** O(n) | **Space:** O(n)
