## Level-by-Level Using Next Pointers

```javascript
function connect(root) {
  if (!root) return root;
  let leftmost = root;
  while (leftmost.left) {
    let curr = leftmost;
    while (curr) {
      curr.left.next = curr.right;
      if (curr.next) curr.right.next = curr.next.left;
      curr = curr.next;
    }
    leftmost = leftmost.left;
  }
  return root;
}
```

**Time:** O(n) | **Space:** O(1)
