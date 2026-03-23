Given a linked list where every node represents a linked list and contains two pointers: (i) a `next` pointer to the next node in the main list, (ii) a `bottom` pointer to a linked list where this node is the head. All the bottom linked lists are sorted. Flatten the list into a single sorted list using the `bottom` pointer.

**Example:**
```
Input: 5->10->19->28 with bottom lists 5->7->8->30, 10->20, 19->22->50, 28->35->40->45
Output: 5->7->8->10->19->20->22->28->30->35->40->45->50
```
