## Convert to Numbers

```javascript
function multiplyLists(l1, l2) {
  let n1 = 0n, n2 = 0n;
  while (l1) { n1 = n1 * 10n + BigInt(l1.val); l1 = l1.next; }
  while (l2) { n2 = n2 * 10n + BigInt(l2.val); l2 = l2.next; }
  return Number((n1 * n2) % 1000000007n);
}
```

**Time:** O(m + n) | **Space:** O(1)
