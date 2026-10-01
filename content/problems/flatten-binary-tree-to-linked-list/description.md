Given the `root` of a binary tree, rearrange it in-place into a "linked list" built from the same `TreeNode` structure: every node's `left` pointer becomes `null`, and its `right` pointer leads to the next node in the sequence. The resulting order of nodes should match what a pre-order traversal of the original tree would produce.

**Example 1:**
```
Input: root = [1,2,5,3,4,null,6]
Output: [1,null,2,null,3,null,4,null,5,null,6]
```

**Example 2:**
```
Input: root = []
Output: []
```
