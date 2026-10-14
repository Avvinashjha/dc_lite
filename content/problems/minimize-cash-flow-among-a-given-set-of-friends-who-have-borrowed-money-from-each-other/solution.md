## Backtracking on Net Balances

First cancel each person's incoming and outgoing debts. Skip settled people, then pair the first unsettled balance with each opposite-sign balance. Transfer the first person's full remaining balance and recurse; the counterpart may become a debtor or creditor. Keep the settlement with the fewest payments. This exhaustive search includes an optimal settlement, unlike repeatedly matching the largest debtor and creditor.

```javascript
function minCashFlow(graph) {
  const n = graph.length, net = Array(n).fill(0);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    net[i] -= graph[i][j]; net[j] += graph[i][j];
  }
  let best = null;
  function search(start, payments) {
    while (start < n && net[start] === 0) start++;
    if (start === n) { if (!best || payments.length < best.length) best = payments.slice(); return; }
    if (best && payments.length >= best.length) return;
    const balance = net[start], tried = new Set();
    for (let j = start + 1; j < n; j++) {
      if (net[j] * balance >= 0 || tried.has(net[j])) continue;
      tried.add(net[j]);
      const previous = net[j]; net[j] += balance;
      payments.push(balance < 0 ? [start, j, -balance] : [j, start, balance]);
      search(start + 1, payments);
      payments.pop(); net[j] = previous;
      if (previous + balance === 0) break;
    }
  }
  search(0, []);
  return best || [];
}
```

**Time:** O(N² + N!) as a loose upper bound. **Space:** O(N) auxiliary space, excluding the input matrix.
