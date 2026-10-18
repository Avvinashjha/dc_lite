## Reverse and Restore the Second Half

Find the end of the first half using a slow pointer and a pointer moving twice as fast. Reverse the list after that node, then compare its values with the first half. For odd lengths, the middle node is excluded from the reversed half because it does not need a partner.

Record the result without returning early on a mismatch. Reverse the second half again and reconnect it before returning, so both successful and unsuccessful checks preserve every original node and link.

```javascript
function isPalindrome(head) {
  if (!head || !head.next) return true;
  function reverse(node) {
    let prev = null;
    while (node) {
      const next = node.next;
      node.next = prev;
      prev = node;
      node = next;
    }
    return prev;
  }
  let slow = head,
    fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  const second = reverse(slow.next);
  let left = head,
    right = second;
  let matches = true;
  while (right) {
    if (left.val !== right.val) {
      matches = false;
      break;
    }
    left = left.next;
    right = right.next;
  }
  slow.next = reverse(second);
  return matches;
}
```

**Time:** O(L) | **Space:** O(1), where L is the number of nodes. All traversals are iterative, including restoration.
