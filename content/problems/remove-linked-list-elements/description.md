Given the head of a singly linked list and an integer `val`, remove every node whose value equals `val`. Return the head of the remaining list.

Keep every other original node in its original relative order. Reuse those nodes without changing their values or creating replacements. The input is not necessarily sorted.

The head may change when leading nodes are removed. Return `null` for an empty input or when every node is removed. If no value matches, return the unchanged list.

For `[6, 6, 1, 6, 2]` with `val = 6`, the result is `[1, 2]`. Consecutive matches must all be removed. Examples show value arrays, but the function receives nodes with `val` and `next` properties.
