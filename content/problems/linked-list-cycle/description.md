Given the `head` of a singly linked list, return `true` if repeatedly following `next` pointers revisits the **same node object**. Return `false` if traversal reaches `null`, including when the list is empty.

Equal node values do not imply a cycle. For example, three distinct nodes with values `[5,5,5]` and a tail pointing to `null` are not cyclic. A single node whose `next` points to itself is cyclic.

Use O(1) extra space.

The examples encode the list as `[values, pos]`. If `pos` is not `-1`, the last node points back to the node at that zero-based index. Your function receives only `head`, not the array or `pos`.
