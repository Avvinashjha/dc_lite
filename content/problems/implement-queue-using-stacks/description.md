Build a first-in-first-out (FIFO) queue using nothing but two stacks as the underlying storage. It needs to support `push(x)` (add an element to the back), `pop()` (remove the element at the front), `peek()` (look at the front element without removing it), and `empty()` (report whether the queue has anything left). The only moves allowed on the underlying stacks are the usual ones — pushing to the top, popping or peeking the top, checking the size, and checking if a stack is empty.

Calls to pop() and peek() occur only when the queue is non-empty.

`pop()` returns the removed value. `peek()` returns the same front value without changing the queue. `empty()` returns a boolean; `push()` has no return value.
