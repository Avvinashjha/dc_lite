Build a first-in-first-out (FIFO) queue using nothing but two stacks as the underlying storage. It needs to support `push(x)` (add an element to the back), `pop()` (remove the element at the front), `peek()` (look at the front element without removing it), and `empty()` (report whether the queue has anything left). The only moves allowed on the underlying stacks are the usual ones — pushing to the top, popping or peeking the top, checking the size, and checking if a stack is empty.

**Example:**
```
push(1), push(2), peek() -> 1, pop() -> 1, empty() -> false
```
