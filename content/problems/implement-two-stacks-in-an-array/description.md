Fit two independent stacks inside a single array without wasting space. Let the first stack grow forward from index 0, and the second grow backward from the last index, so they advance toward each other from opposite ends. Expose `push1`, `push2`, `pop1`, and `pop2` for each stack respectively — space only runs out once the two stacks' pointers meet somewhere in the middle of the array.

**Example:**
```
push1(1), push2(2), push1(3), pop1() -> 3, pop2() -> 2
```
