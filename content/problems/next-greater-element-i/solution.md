## Monotonic Stack + Hash Map

```javascript
function nextGreaterElement(nums1, nums2) {
  const map = new Map(), stack = [];
  for (const n of nums2) {
    while (stack.length && stack[stack.length-1] < n) map.set(stack.pop(), n);
    stack.push(n);
  }
  return nums1.map(n => map.get(n) ?? -1);
}
```

**Time:** O(m + n) | **Space:** O(n)
