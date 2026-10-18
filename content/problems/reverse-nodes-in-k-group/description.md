Given a nonempty singly linked list and an integer `k`, divide the list from its head into consecutive groups of `k` nodes. Reverse each **complete group** and return the resulting head.

If the final group has fewer than `k` nodes, leave it in its original order. Rewire the original nodes without changing their values or creating replacements. Use constant extra space.

For `[1, 2, 3, 4, 5]` and `k = 2`, return `[2, 1, 4, 3, 5]`. With `k = 3`, return `[3, 2, 1, 4, 5]`: the final two nodes remain unchanged. With `k = 1`, the whole list stays unchanged.

Your function receives nodes with `val` and `next` properties; examples display value arrays.
