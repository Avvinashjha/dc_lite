## Iterative DFS with Active Frames

Track unvisited, active, and finished vertices. Each stack frame stores the next edge to examine. An edge to an active vertex closes a directed cycle.

```javascript
function hasCycle(V, adj) {
  const color=Array(V).fill(0);
  for(let start=0;start<V;start++)if(color[start]===0){
    const stack=[[start,0]];color[start]=1;
    while(stack.length){const frame=stack[stack.length-1],u=frame[0];
      if(frame[1]===adj[u].length){color[u]=2;stack.pop();continue;}
      const v=adj[u][frame[1]++];if(color[v]===1)return true;if(color[v]===0){color[v]=1;stack.push([v,0]);}
    }
  }
  return false;
}
```

**Time:** O(V + E) | **Space:** O(V)
