Given the head of a singly linked list and a threshold `x`, rearrange the **original nodes** into two groups: nodes with values less than `x`, followed by nodes with values greater than or equal to `x`.

Preserve the original relative order within each group. This is a stable partition, not a sort. Do not change node values or replace the nodes with copies. Return the new head, or `null` for an empty list.

For `head = [1, 4, 3, 2, 5, 2]` and `x = 3`, the result is `[1, 2, 2, 4, 3, 5]`. The second group remains `[4, 3, 5]` in its original order, and values equal to `x` belong to that group.

Examples display lists as arrays; your function receives nodes with `val` and `next` properties.
