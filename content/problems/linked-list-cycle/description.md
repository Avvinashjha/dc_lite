Given the `head` of a linked list, figure out whether it loops back on itself anywhere — that is, whether repeatedly following `next` pointers eventually revisits a node you've already seen. Return `true` if such a loop exists and `false` if the list simply ends. Aim for a solution that uses only O(1) extra memory.

**Example 1:**
```
Input: head = [3,2,0,-4], pos = 1 (tail connects to index 1)
Output: true
```

**Example 2:**
```
Input: head = [1], pos = -1
Output: false
```
