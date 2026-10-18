Implement a factory returning independent `stack` and `queue` objects, each backed by its own deque. A deque supports adding or removing at either end and inspecting either end. Implement the needed deque operations yourself; no deque object is supplied.

- `stack.push(x)` adds a value; `stack.pop()` removes and returns the most recently added value.
- `queue.enqueue(x)` adds a value; `queue.dequeue()` removes and returns the oldest value.
- Each object exposes `peek()` to return its next removable value without consuming it, and `empty()` to return whether it has no values.

Insertion methods have no return value. Removals and peeks are called only on nonempty structures. Operations on one structure must not affect the other.
