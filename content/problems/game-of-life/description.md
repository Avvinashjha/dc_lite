Conway's Game of Life is played on an `m x n` board where each cell is either alive (`1`) or dead (`0`). Every cell has up to eight neighbors — horizontally, vertically, and diagonally adjacent — and the whole board updates at once, following these rules:

- A live cell with fewer than two live neighbors dies (underpopulation).
- A live cell with two or three live neighbors survives.
- A live cell with more than three live neighbors dies (overpopulation).
- A dead cell with exactly three live neighbors comes alive (reproduction).

Given the board's current state, compute its next state.
