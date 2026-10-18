## Kahn's Algorithm (BFS)

Count incoming edges for each vertex. A zero-indegree vertex has no remaining prerequisites, so it can be emitted next. Remove its outgoing edges conceptually by decrementing its neighbors' indegrees, enqueuing each neighbor when that count becomes zero. Seed the queue with every zero-indegree vertex to include disconnected components. The DAG guarantee ensures all V vertices are eventually emitted.

```javascript
function topologicalSort(V, adj) {
  const inDeg = Array(V).fill(0);
  for (let u=0;u<V;u++) for (const v of adj[u]) inDeg[v]++;
  const q = [], result = [];
  for (let i=0;i<V;i++) if (inDeg[i]===0) q.push(i);
  let head = 0;
  while (head < q.length) {
    const u = q[head++]; result.push(u);
    for (const v of adj[u]) if (--inDeg[v]===0) q.push(v);
  }
  return result;
}
```

**Time:** O(V + E) | **Space:** O(V)
