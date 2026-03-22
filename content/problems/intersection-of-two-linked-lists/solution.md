## Two Pointer

Traverse both lists; when one ends, redirect to the other's head.

```javascript
function getIntersectionNode(headA, headB) {
  let a = headA, b = headB;
  while (a !== b) {
    a = a ? a.next : headB;
    b = b ? b.next : headA;
  }
  return a;
}
```

**Time:** O(m + n) | **Space:** O(1)
