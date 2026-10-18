## Approach: BFS with Position Indexing

Assign a position index to each node: root is 0, left child is 2*pos, right is 2*pos+1. Width at each level is rightmost - leftmost + 1. Normalize positions by subtracting the first active position at each level before creating child positions. Read that first position at queue[head], since earlier queue entries have already been processed. BigInt keeps position arithmetic exact.

```javascript
function maximumWidthOfBinaryTree(root) {
  if (!root) return 0;
  let maxWidth = 0;
  const queue = [[root, 0n]];
  let head = 0;
  while (head < queue.length) {
    const size = queue.length - head;
    const first = queue[head][1];
    let last = first;
    for (let i = 0; i < size; i++) {
      const [node, pos] = queue[head++];
      last = pos;
      const offset = pos - first;
      if (node.left) queue.push([node.left, 2n * offset]);
      if (node.right) queue.push([node.right, 2n * offset + 1n]);
    }
    maxWidth = Math.max(maxWidth, Number(last - first + 1n));
  }
  return maxWidth;
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(n)
