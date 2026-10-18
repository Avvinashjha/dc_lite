Count the distinct digit sequences of length `n` that can be typed on this keypad:

```text
1 2 3
4 5 6
7 8 9
  0
```

The first press may be any digit, including `0`. For each subsequent press, stay on the same key or move one key up, down, left, or right. Diagonal moves, wrapping, and the two blank positions beside `0` are not allowed.

Leading zeros count, so `"00"` and `"08"` are valid two-press sequences. From `0`, the next key can only be `0` or `8`. From `5`, it can be `2`, `4`, `5`, `6`, or `8`. Return the exact count, not the sequences themselves.
