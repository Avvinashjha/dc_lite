## DFS

```javascript
function numOfMinutes(n, headID, manager, informTime) {
  const children = Array.from({length:n}, ()=>[]);
  for (let i=0;i<n;i++) if (manager[i]!==-1) children[manager[i]].push(i);
  function dfs(id) {
    let max = 0;
    for (const child of children[id]) max = Math.max(max, dfs(child));
    return informTime[id] + max;
  }
  return dfs(headID);
}
```

**Time:** O(n) | **Space:** O(n)
