## Iterative DFS with Arrival Times

A subordinate receives the news after its manager’s arrival time plus the manager’s informTime. Track those arrival times and return their maximum.

```javascript
function numOfMinutes(n, headID, manager, informTime) {
  const children=Array.from({length:n},()=>[]);
  for(let i=0;i<n;i++)if(manager[i]!==-1)children[manager[i]].push(i);
  const stack=[[headID,0]];let total=0;
  while(stack.length){const [id,time]=stack.pop();total=Math.max(total,time);for(const child of children[id])stack.push([child,time+informTime[id]]);}
  return total;
}
```

**Time:** O(n) | **Space:** O(n)
