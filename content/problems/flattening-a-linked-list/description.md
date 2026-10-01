You're given a linked list where each node sits at the head of its own sorted sub-list: alongside a `next` pointer connecting it to the following node in the main list, every node also has a `bottom` pointer leading down through its own vertical sorted list. Merge everything into one fully sorted list that's linked purely through `bottom` pointers.

**Example:**
```
Input: 5->10->19->28 with bottom lists 5->7->8->30, 10->20, 19->22->50, 28->35->40->45
Output: 5->7->8->10->19->20->22->28->30->35->40->45->50
```
