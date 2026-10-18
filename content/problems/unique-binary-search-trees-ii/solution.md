## Recursive Generation

Choose each possible root in the interval. Recursively generate every left tree from smaller keys and every right tree from larger keys, then combine every left/right pair with that root. Different roots or child shapes produce different trees.

An empty interval returns [null], representing one choice of an absent child. Returning an empty array there would incorrectly eliminate combinations with a missing child.

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

**Time:** O(n × Cn) as a loose upper bound, where Cn is the nth Catalan number | **Space:** O(n × Cn), including returned trees
