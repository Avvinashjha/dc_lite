## Elementary Math with Carry

Traverse both lists simultaneously, summing digits with carry.

```javascript
function addTwoNumbers(l1, l2) {
  let dummy = {val: 0, next: null}, curr = dummy, carry = 0;
  while (l1 || l2 || carry) {
    let sum = carry + (l1 ? l1.val : 0) + (l2 ? l2.val : 0);
    carry = Math.floor(sum / 10);
    curr.next = {val: sum % 10, next: null};
    curr = curr.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummy.next;
}
```

**Time:** O(max(m, n)) | **Space:** O(max(m, n))
