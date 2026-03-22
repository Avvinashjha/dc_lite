## Sort + Greedy

```javascript
function canPermute(A, B, k) {
  A.sort((a,b)=>a-b); B.sort((a,b)=>b-a);
  return A.every((a,i) => a+B[i] >= k);
}
```

**Time:** O(n log n) | **Space:** O(1)
