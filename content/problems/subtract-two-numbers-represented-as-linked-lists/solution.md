## Exact BigInt Subtraction

```javascript
function subtractLists(l1, l2) {
  function toNum(l) { let n = 0n; while (l) { n = n*10n + BigInt(l.val); l = l.next; } return n; }
  let diff = toNum(l1) - toNum(l2);
  if (diff < 0n) diff = -diff;
  const s = diff.toString(); let head = null, tail = null;
  for (const c of s) {
    const node = {val: parseInt(c), next: null};
    if (!head) head = tail = node; else { tail.next = node; tail = node; }
  }
  return head || {val: 0, next: null};
}
```

**Time:** O(m² + n²) as a loose bound when accounting for growing BigInt arithmetic | **Space:** O(max(m,n))
