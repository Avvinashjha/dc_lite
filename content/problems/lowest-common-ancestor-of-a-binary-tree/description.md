You're given the root of a binary tree and two node values `p` and `q`. Find their lowest common ancestor (LCA) — the deepest node in the tree that has both `p` and `q` among its descendants, where a node is allowed to be a descendant of itself. The tree has no BST-style ordering to exploit here, so this calls for a general tree traversal rather than value comparisons.

**Example 1:**
```
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
Output: 3
```

**Example 2:**
```
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
Output: 5
```
