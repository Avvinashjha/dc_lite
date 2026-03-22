## Iterative K-Group Reversal

```javascript
function reverseKGroup(head, k) {
  const dummy = {next: head};
  let prev = dummy;
  while (true) {
    let kth = prev;
    for (let i = 0; i < k; i++) { kth = kth.next; if (!kth) return dummy.next; }
    let curr = prev.next, next = curr.next;
    for (let i = 0; i < k - 1; i++) {
      curr.next = next.next; next.next = prev.next; prev.next = next; next = curr.next;
    }
    prev = curr;
  }
}
```

**Time:** O(n) | **Space:** O(1)
