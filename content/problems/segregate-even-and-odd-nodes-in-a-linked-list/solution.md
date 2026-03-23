## Two Lists Merge

```javascript
function segregateEvenOdd(head) {
  const even = {next:null}, odd = {next:null};
  let e = even, o = odd, curr = head;
  while (curr) {
    if (curr.val % 2 === 0) { e.next = curr; e = e.next; }
    else { o.next = curr; o = o.next; }
    curr = curr.next;
  }
  o.next = null; e.next = odd.next;
  return even.next;
}
```

**Time:** O(n) | **Space:** O(1)
