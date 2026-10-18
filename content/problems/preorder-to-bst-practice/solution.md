## Recursive Construction with an Upper Bound

Keep one shared index pointing to the next unused preorder value. `build(bound)` constructs the next subtree whose values must be below `bound`. If the next value exceeds the bound, it belongs to an ancestor's later subtree, so return `null` without consuming it.

Otherwise consume that value as a root. Build its left subtree with the root value as its upper bound, then build its right subtree with the inherited bound. This follows preorder's root-left-right order while consuming each value exactly once.

Distinct values and a guaranteed valid BST preorder are essential: they make an explicit lower-bound check unnecessary for reconstruction. This routine is not a validator for arbitrary traversal arrays.

```javascript
function preorderToBST(pre) {
  let i = 0;
  function build(bound) {
    if (i >= pre.length || pre[i] > bound) return null;
    const node = { val: pre[i++], left: null, right: null };
    node.left = build(node.val);
    node.right = build(bound);
    return node;
  }
  return build(Infinity);
}
```

**Time:** O(n) | **Space:** O(h) auxiliary recursion space plus O(n) for the returned nodes, where h is the reconstructed tree height. A sorted traversal produces height n.
