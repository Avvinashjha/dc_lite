You're given the `root` of a binary tree. Walk it in **inorder** order — left subtree first, then the current node, then the right subtree — and return the node values you collect, in that order. Applying this traversal to a binary search tree naturally yields the values in ascending order. Rather than relying on recursion, write an iterative version that uses an explicit stack, which makes the space usage easier to reason about.

**Example 1:**
```
Input: root = [1,null,2,3]
Output: [1,3,2]
```

**Example 2:**
```
Input: root = []
Output: []
```
