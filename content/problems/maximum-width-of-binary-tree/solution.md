## Approach: BFS with Position Indexing

Assign a position index to each node: root is 0, left child is 2*pos, right is 2*pos+1. Width at each level is rightmost - leftmost + 1. Use BigInt to avoid overflow for deep trees.

```javascript
function maximumWidthOfBinaryTree(root) {
  if (!root) return 0;
  let maxWidth = 0;
  const queue = [[root, 0n]];
  while (queue.length) {
    const size = queue.length;
    const first = queue[0][1];
    let last = first;
    for (let i = 0; i < size; i++) {
      const [node, pos] = queue.shift();
      last = pos;
      if (node.left) queue.push([node.left, 2n * pos]);
      if (node.right) queue.push([node.right, 2n * pos + 1n]);
    }
    maxWidth = Math.max(maxWidth, Number(last - first + 1n));
  }
  return maxWidth;
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(n)
