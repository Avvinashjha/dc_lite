You are given a doubly linked list where each node may have a `child` pointer to a separate doubly linked list. These child lists may also have children, forming a multilevel structure. Flatten the list so that all nodes appear in a single-level doubly linked list. Child lists should be inserted between the current node and its next node, depth-first. After flattening, no node should have a child pointer.

**Example:**
```
Input: [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]
Output: [1,2,3,7,8,11,12,9,10,4,5,6]
```
