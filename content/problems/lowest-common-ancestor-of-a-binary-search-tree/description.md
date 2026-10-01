You're given the root of a binary search tree (BST) along with two node values `p` and `q` known to exist in it. Find their lowest common ancestor (LCA) — the deepest node in the tree that has both `p` and `q` somewhere below it (a node counts as its own descendant too). Since the tree is a BST, you can lean on its ordering property to locate the LCA without touching every node.

**Example 1:**
```
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
Output: 6
```

**Example 2:**
```
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
Output: 2
```
