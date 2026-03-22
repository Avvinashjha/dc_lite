## Count and Overwrite

```javascript
function sortList012(head) {
  let c = [0,0,0], curr = head;
  while (curr) { c[curr.val]++; curr = curr.next; }
  curr = head;
  for (let v = 0; v <= 2; v++) while (c[v]-- > 0) { curr.val = v; curr = curr.next; }
}
```

**Time:** O(n) | **Space:** O(1)
