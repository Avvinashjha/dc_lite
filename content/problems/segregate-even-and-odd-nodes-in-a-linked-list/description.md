Rearrange a nonempty singly linked list so that all nodes with **even values** appear before all nodes with odd values. Preserve the original relative order within each group.

Classify by node value, not by position. Zero is even, and negative integers follow the same parity rule. Rewire the original nodes without changing their values or creating replacements, then return the new head.

For `[17, 15, 8, 12, 10, 5, 4]`, return `[8, 12, 10, 4, 17, 15, 5]`. The even group is not sorted; its original order remains intact. If every node belongs to one group, keep the entire list in its original order.

Your function receives nodes with `val` and `next` properties. Examples display lists as value arrays.
