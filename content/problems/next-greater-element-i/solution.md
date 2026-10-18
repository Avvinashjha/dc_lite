## Monotonic Stack + Hash Map

Scan nums2 from left to right, keeping unresolved values in a decreasing stack. When a larger value arrives, it is the first greater value for every smaller stack top: otherwise those values would already have been removed. Record those answers in a map. Any values still unresolved at the end have no greater element to their right.

Unique values let the map use values as keys. Finally look up queries in nums1 order. Each nums2 value is pushed and popped at most once, yielding linear time.

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
