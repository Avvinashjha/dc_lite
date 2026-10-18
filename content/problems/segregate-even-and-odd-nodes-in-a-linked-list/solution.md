## Build Stable Even and Odd Chains

Maintain separate dummy heads and tails for even and odd values. Traverse the original nodes once, appending each to its matching chain. Appending in input order preserves relative order inside both groups.

Set the odd tail's next link to `null` before joining the chains: its old link may still point to an even node and would otherwise create a cycle. Connect the even tail to the odd head and return the even dummy's next node.

Dummy heads handle all-even and all-odd lists without special cases. They are temporary helpers; every returned node comes from the original input. Testing remainder against zero correctly handles negative even values too.

```javascript
function segregateEvenOdd(head) {
  const even = { next: null },
    odd = { next: null };
  let e = even,
    o = odd,
    curr = head;
  while (curr) {
    if (curr.val % 2 === 0) {
      e.next = curr;
      e = e.next;
    } else {
      o.next = curr;
      o = o.next;
    }
    curr = curr.next;
  }
  o.next = null;
  e.next = odd.next;
  return even.next;
}
```

**Time:** O(n) | **Space:** O(1)
