## Approach: Two Pointers

Use two pointers, one starting at each head. When a pointer reaches the end of its list, redirect it to the head of the other list. Both pointers travel the same total distance, so they will meet at the intersection node, or both reach null if there is no intersection.

```javascript
function intersectionOfTwoLinkedLists(headA, headB) {
  let a = headA, b = headB;
  while (a !== b) {
    a = a ? a.next : headB;
    b = b ? b.next : headA;
  }
  return a;
}
```

**Time Complexity:** O(m + n)

**Space Complexity:** O(1)
