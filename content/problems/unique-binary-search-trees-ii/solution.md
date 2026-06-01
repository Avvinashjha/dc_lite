## Recursive Generation

```javascript
function generateTrees(n) {
  function build(lo, hi) {
    if (lo > hi) return [null];
    const trees = [];
    for (let i = lo; i <= hi; i++) {
      for (const left of build(lo, i-1)) {
        for (const right of build(i+1, hi)) {
          trees.push({val: i, left, right});
        }
      }
    }
    return trees;
  }
  return n === 0 ? [] : build(1, n);
}
```

**Time:** O(4^n / n^(3/2)) | **Space:** O(4^n / n^(3/2))
