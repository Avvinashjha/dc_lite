## Greedy: Net Amounts

Compute net amount for each person, greedily settle max creditor with max debtor.

```javascript
function minCashFlow(graph) {
  const n = graph.length, net = Array(n).fill(0);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) { net[i] -= graph[i][j]; net[j] += graph[i][j]; }
  const result = [];
  function settle() {
    let maxCred = 0, maxDeb = 0;
    for (let i = 1; i < n; i++) {
      if (net[i] > net[maxCred]) maxCred = i;
      if (net[i] < net[maxDeb]) maxDeb = i;
    }
    if (net[maxCred] === 0 && net[maxDeb] === 0) return;
    const amount = Math.min(-net[maxDeb], net[maxCred]);
    net[maxCred] -= amount; net[maxDeb] += amount;
    result.push([maxDeb, maxCred, amount]);
    settle();
  }
  settle();
  return result;
}
```

**Time:** O(n²) | **Space:** O(n)
