Fit two independent stacks inside a single array without wasting space. Let the first stack grow forward from index 0, and the second grow backward from the last index, so they advance toward each other from opposite ends. Expose `push1`, `push2`, `pop1`, and `pop2` for each stack respectively — space only runs out once the two stacks' pointers meet somewhere in the middle of the array.

Pushes into a full shared array leave it unchanged. Popping an empty stack returns -1.
