## Kirchhoff's Matrix Tree Theorem

Compute any cofactor of the Laplacian matrix (degree matrix - adjacency matrix).

```javascript
function countSpanningTrees(adj, V) {
  const L = Array.from({length:V}, ()=>Array(V).fill(0));
  for (let i=0;i<V;i++) for (let j=0;j<V;j++) {
    if (i===j) L[i][j] = adj[i].length;
    else if (adj[i].includes(j)) L[i][j] = -1;
  }
  const n = V-1, M = L.slice(0,n).map(r=>r.slice(0,n));
  // Gaussian elimination for determinant
  let det = 1;
  for (let i=0;i<n;i++) {
    let pivot = i;
    for (let j=i+1;j<n;j++) if (Math.abs(M[j][i])>Math.abs(M[pivot][i])) pivot=j;
    if (pivot!==i) { [M[i],M[pivot]]=[M[pivot],M[i]]; det*=-1; }
    det *= M[i][i];
    for (let j=i+1;j<n;j++) {
      const f=M[j][i]/M[i][i];
      for (let k=i;k<n;k++) M[j][k]-=f*M[i][k];
    }
  }
  return Math.round(det);
}
```

**Time:** O(V³) | **Space:** O(V²)
