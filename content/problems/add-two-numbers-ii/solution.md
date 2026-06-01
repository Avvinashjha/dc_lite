## Stack-Based Addition

Use stacks to reverse the digit order, then add with carry.

```javascript
function addTwoNumbersII(l1, l2) {
  let s1 = [], s2 = [];
  while (l1) { s1.push(l1.val); l1 = l1.next; }
  while (l2) { s2.push(l2.val); l2 = l2.next; }
  let carry = 0, head = null;
  while (s1.length || s2.length || carry) {
    let sum = carry + (s1.pop() || 0) + (s2.pop() || 0);
    carry = Math.floor(sum / 10);
    let node = {val: sum % 10, next: head};
    head = node;
  }
  return head;
}
```

**Time:** O(m + n) | **Space:** O(m + n)
