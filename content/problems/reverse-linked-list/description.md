Given the head of a singly linked list, reverse the order of its **original nodes** by rewiring their `next` pointers, then return the new head.

Do not change node values or create replacement nodes. Include every original node exactly once. The old head becomes the tail and must point to `null`; the old tail becomes the new head.

An empty list returns `null`, and a single-node list returns that same node. For `1 → 2 → 3 → null`, return the original node `3`, linked as `3 → 2 → 1 → null`.

Examples display lists as arrays, but your function receives nodes with `val` and `next` properties. An iterative solution can use constant extra space.
