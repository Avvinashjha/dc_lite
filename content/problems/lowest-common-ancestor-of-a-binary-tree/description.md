Given a binary tree and two node values `p` and `q`, find their lowest common ancestor (LCA). The LCA is the deepest node that has both `p` and `q` as descendants. A node can be a descendant of itself. Unlike BST, no ordering property is available here, so a general recursive approach is needed.

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
