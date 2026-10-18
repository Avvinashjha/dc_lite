Implement two independent LIFO stacks using one array with total capacity `n`. The stacks share all available slots: either stack may use the entire capacity when the other is empty.

Expose `push1(x)`, `push2(x)`, `pop1()`, and `pop2()`. A push when the combined element count equals `n` does nothing. A pop from an empty stack returns `-1`; otherwise it removes and returns the most recently pushed value from that stack. Freed slots must be reusable by either stack.
