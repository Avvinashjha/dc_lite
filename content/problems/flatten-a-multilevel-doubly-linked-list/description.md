You're given a doubly linked list in which any node may additionally hold a `child` pointer to the head of its own separate doubly linked list, and those child lists can themselves contain further nested children, forming a multilevel structure. Collapse the entire structure into one single-level doubly linked list, inserting each child list depth-first between its parent node and the parent's original next node. Once flattened, no node should retain a `child` pointer.

**Example:**
```
Input: [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]
Output: [1,2,3,7,8,11,12,9,10,4,5,6]
```
