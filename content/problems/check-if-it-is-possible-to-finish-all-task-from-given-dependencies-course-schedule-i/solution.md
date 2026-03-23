## Topological Sort (Kahn's Algorithm)

If we can process all courses via BFS topological sort, there's no cycle.

```javascript
function canFinish(numCourses, prerequisites) {
  const graph = Array.from({length: numCourses}, () => []);
  const inDeg = Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) { graph[b].push(a); inDeg[a]++; }
  const q = [];
  for (let i = 0; i < numCourses; i++) if (inDeg[i] === 0) q.push(i);
  let count = 0;
  while (q.length) {
    const node = q.shift(); count++;
    for (const next of graph[node]) { if (--inDeg[next] === 0) q.push(next); }
  }
  return count === numCourses;
}
```

**Time:** O(V + E) | **Space:** O(V + E)
