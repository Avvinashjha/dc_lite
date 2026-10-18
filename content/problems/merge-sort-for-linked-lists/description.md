Given the `head` of a singly linked list, sort its nodes in non-decreasing order using **merge sort** and return the sorted list’s head.

Preserve every value, including duplicates. The input may be empty, in which case return `null`. You may relink the input nodes. The arrays shown in examples are only a display format; your function receives linked-list nodes, not an array.

Split the list into two halves, sort each half, then merge them. Aim for O(n log n) time without converting the list to an array.
