## Fix Adjacent Comparisons Greedily

Walk the list from left to right, alternating the required comparison. When a pair violates it, swap the two values; otherwise leave them alone.

This does not break the previous comparison. When fixing `current <= next`, a swap makes `current` smaller, preserving the preceding `previous >= current`. When fixing `current >= next`, a swap makes `current` larger, preserving the preceding `previous <= current`.

After each step, every comparison through that pair is correct. Value swaps preserve the multiset of input values and leave all node links unchanged. Equal values require no swap.

```javascript
function zigZagList(head) {
  let curr = head,
    flag = true;
  while (curr && curr.next) {
    if (
      (flag && curr.val > curr.next.val) ||
      (!flag && curr.val < curr.next.val)
    )
      [curr.val, curr.next.val] = [curr.next.val, curr.val];
    curr = curr.next;
    flag = !flag;
  }
}
```

**Time:** O(n) | **Space:** O(1)
