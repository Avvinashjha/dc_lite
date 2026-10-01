Take a binary tree and reshape it, in-place, into a doubly linked list. Reuse the existing node pointers rather than allocating new ones: each node's left pointer becomes the "previous" link of the list, and its right pointer becomes the "next" link. The order of nodes in the resulting list should match the tree's inorder sequence (left, node, right). Return the node that becomes the head of the list.

**Example:**
```
Input: tree = [10,12,15,25,30,36]
Output: 25 <-> 12 <-> 30 <-> 10 <-> 36 <-> 15
```
