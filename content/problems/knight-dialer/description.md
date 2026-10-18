Count the distinct digit sequences of length `n` that a chess knight can dial on this keypad:

```text
1 2 3
4 5 6
7 8 9
  0
```

Start on any digit. Each jump moves two cells in one direction and one cell perpendicular to it, landing only on a digit. The two blank bottom corners are unavailable.

Include the starting digit, so a sequence of length `n` uses exactly `n - 1` jumps. Leading zeros and revisiting digits are allowed. For example, `04` and `40` are different valid sequences of length 2. Digit `5` has no legal moves, but still counts when `n = 1`. Return the count modulo `1000000007`.
