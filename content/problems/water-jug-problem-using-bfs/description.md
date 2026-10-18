Two unmarked jugs have capacities `x` and `y` litres and start empty. There is an unlimited water supply. Each move may:

- Fill either jug completely.
- Empty either jug completely.
- Pour from one jug into the other until the source is empty or the destination is full. You cannot stop a pour arbitrarily.

Use breadth-first search over reachable states to decide whether **either jug, or both jugs combined**, can hold exactly `target` litres. Return a boolean; you do not need to return a sequence or a minimum number of moves. `target = 0` is already satisfied by the initial state.

For capacities `3` and `5`, filling both jugs measures `8` litres in total. To measure `4`, one possible sequence of states `(amount in first jug, amount in second jug)` is:

`(0,0) → (0,5) → (3,2) → (0,2) → (2,0) → (2,5) → (3,4)`
