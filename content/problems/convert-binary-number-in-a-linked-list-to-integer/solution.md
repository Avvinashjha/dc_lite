## Bit Shift Traversal

```javascript
function getDecimalValue(head) {
  let num = 0;
  while (head) { num = num * 2 + head.val; head = head.next; }
  return num;
}
```

**Time:** O(n) | **Space:** O(1)
