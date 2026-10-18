Given a singly linked list sorted in nondecreasing order, remove **every occurrence** of any value that appears more than once. Return the head of the list containing only values that appeared exactly once in the original list.

Reuse the surviving original nodes, preserve their order, and do not change their values. The returned head may differ from the input head. Return `null` when the input is empty or no nodes survive.

For `[1, 2, 3, 3, 4, 4, 5]`, return `[1, 2, 5]`. Both `3`s and both `4`s are removed; do not retain one representative from those groups.

Examples display lists as arrays; your function receives nodes with `val` and `next` properties.
