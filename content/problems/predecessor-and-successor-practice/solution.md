## Two BST Searches

For the predecessor, keep the best smaller node seen so far. If the current value is less than `key`, save it and move right to seek a larger qualifying value. Otherwise move left, since the current node and its right subtree cannot qualify.

Search independently for the successor with the comparisons reversed: save a value greater than `key` and move left to seek a smaller qualifying value; otherwise move right.

Both searches work whether or not the key exists. Candidates begin as `null` and remain so when no qualifying node exists. The searches only read the tree and return the original candidate nodes.

```javascript
function findPreSuc(root, key) {
  let pre = null,
    suc = null,
    curr = root;
  while (curr) {
    if (curr.val < key) {
      pre = curr;
      curr = curr.right;
    } else curr = curr.left;
  }
  curr = root;
  while (curr) {
    if (curr.val > key) {
      suc = curr;
      curr = curr.left;
    } else curr = curr.right;
  }
  return [pre, suc];
}
```

**Time:** O(h) | **Space:** O(1), where h is tree height. A balanced tree has logarithmic height, but a one-sided tree can have height n.
