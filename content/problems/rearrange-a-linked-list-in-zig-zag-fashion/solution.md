## Swap Values

```javascript
function zigZagList(head) {
  let curr = head, flag = true;
  while (curr && curr.next) {
    if ((flag && curr.val > curr.next.val) || (!flag && curr.val < curr.next.val))
      [curr.val, curr.next.val] = [curr.next.val, curr.val];
    curr = curr.next; flag = !flag;
  }
}
```

**Time:** O(n) | **Space:** O(1)
