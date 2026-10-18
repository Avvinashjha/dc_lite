Given a nonempty singly linked list and two **1-based positions** `left` and `right`, reverse the nodes in that inclusive segment and return the resulting head.

Rewire the original nodes without changing their values or creating replacements. Keep the nodes before and after the selected segment in their original order. If `left = right`, the list is unchanged. If `left = 1`, the head may change.

For `[1, 2, 3, 4, 5]`, `left = 2`, and `right = 4`, return `[1, 4, 3, 2, 5]`. These numbers specify positions, not values to search for.

Your function receives nodes with `val` and `next` properties; examples display value arrays. Use constant extra space.
