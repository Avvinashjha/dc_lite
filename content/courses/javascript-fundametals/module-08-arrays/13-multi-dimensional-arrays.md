# Multi-dimensional Arrays

So far, most of the arrays you have worked with were flat arrays.

A flat array is a single list of values:

```js
const scores = [90, 85, 72, 100];
const names = ["Alice", "Bob", "Charlie"];
```

But real-world data is often more structured than one simple list.

For example:

- a chessboard has rows and columns
- a spreadsheet has cells inside rows
- a calendar has weeks and days
- API responses may group results by category
- a game map may use a grid

In JavaScript, you can represent this kind of nested structure with **multi-dimensional arrays**.

## What Is a Multi-dimensional Array?

A multi-dimensional array is an array that contains other arrays.

There is no special syntax.

You simply put arrays inside an array.

```js
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
```

This is a two-dimensional array.

You can think of it as rows and columns:

```text
Row 0: 1 2 3
Row 1: 4 5 6
Row 2: 7 8 9
```

Each inner array represents one row.

## Arrays of Arrays

Multi-dimensional arrays are often called **arrays of arrays**.

```js
const rows = [
  ["A", "B", "C"],
  ["D", "E", "F"],
];
```

The outer array contains two elements.

Each element is also an array.

```js
console.log(rows[0]); // ["A", "B", "C"]
console.log(rows[1]); // ["D", "E", "F"]
```

The first level gives you a row.

The second level gives you a value inside that row.

## Accessing Nested Elements

To access an item inside a multi-dimensional array, use chained bracket notation.

```js
const grid = [
  ["A", "B", "C"],
  ["D", "E", "F"],
];

console.log(grid[0][0]); // A
console.log(grid[0][2]); // C
console.log(grid[1][0]); // D
console.log(grid[1][2]); // F
```

Read this:

```js
grid[1][2]
```

as:

```text
Go to row 1.
Then get column 2 from that row.
```

In this array:

```js
const grid = [
  ["A", "B", "C"], // row 0
  ["D", "E", "F"], // row 1
];
```

`grid[1]` is:

```js
["D", "E", "F"]
```

Then `grid[1][2]` is:

```js
"F"
```

## Row and Column Thinking

When working with two-dimensional arrays, it helps to use row and column names.

```js
const board = [
  ["X", "O", "X"],
  ["O", "X", "O"],
  ["O", "X", "X"],
];

const row = 1;
const column = 2;

console.log(board[row][column]); // O
```

The first bracket is the row.

The second bracket is the column.

```js
board[row][column]
```

This pattern is common in grids, tables, games, and matrix-like data.

## Updating Nested Elements

You can update nested array values with the same bracket syntax.

```js
const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

board[0][0] = "X";
board[1][1] = "O";

console.log(board);
```

Result:

```js
[
  ["X", "", ""],
  ["", "O", ""],
  ["", "", ""]
]
```

Arrays are mutable, so this changes the nested array directly.

## Different Row Lengths

Inner arrays do not have to be the same length.

```js
const groups = [
  ["Alice", "Bob"],
  ["Charlie"],
  ["Dana", "Eve", "Frank"],
];
```

This is valid JavaScript.

But it means you should not assume every row has the same number of columns.

```js
console.log(groups[0][1]); // Bob
console.log(groups[1][1]); // undefined
```

`groups[1]` only has one item.

So `groups[1][1]` is `undefined`.

## Accessing Safely With Optional Chaining

If a row might not exist, chained bracket access can fail.

```js
const grid = [["A", "B"]];

console.log(grid[2][0]); // TypeError
```

`grid[2]` is `undefined`.

Trying to access `[0]` from `undefined` causes an error.

Use optional chaining when the path may be missing:

```js
console.log(grid[2]?.[0]); // undefined
```

This safely stops if `grid[2]` is missing.

## Iterating With Nested `for` Loops

To process every item in a two-dimensional array, you can use nested loops.

```js
const grid = [
  [1, 2],
  [3, 4],
];

for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
  const row = grid[rowIndex];

  for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
    console.log(`Row ${rowIndex}, Column ${columnIndex}: ${row[columnIndex]}`);
  }
}
```

Output:

```text
Row 0, Column 0: 1
Row 0, Column 1: 2
Row 1, Column 0: 3
Row 1, Column 1: 4
```

The outer loop moves through rows.

The inner loop moves through columns inside each row.

## Iterating With Nested `forEach`

You can also use nested `.forEach()` calls.

```js
const grid = [
  [1, 2],
  [3, 4],
];

grid.forEach((row, rowIndex) => {
  row.forEach((item, columnIndex) => {
    console.log(`Item at [${rowIndex}][${columnIndex}] is ${item}`);
  });
});
```

Output:

```text
Item at [0][0] is 1
Item at [0][1] is 2
Item at [1][0] is 3
Item at [1][1] is 4
```

This style is often easier to read when you do not need `break` or `continue`.

Use `for` or `for...of` loops when you need more loop control.

## Iterating With `entries`

Since you just learned `.entries()`, you can use it with nested arrays too.

```js
const grid = [
  ["A", "B"],
  ["C", "D"],
];

for (const [rowIndex, row] of grid.entries()) {
  for (const [columnIndex, value] of row.entries()) {
    console.log(`[${rowIndex}][${columnIndex}] = ${value}`);
  }
}
```

Output:

```text
[0][0] = A
[0][1] = B
[1][0] = C
[1][1] = D
```

This gives you both indexes and values without manually managing counters.

## Mapping a Multi-dimensional Array

You can use nested `.map()` calls to transform a grid while keeping the same shape.

```js
const numbers = [
  [1, 2],
  [3, 4],
];

const doubled = numbers.map((row) => {
  return row.map((number) => {
    return number * 2;
  });
});

console.log(doubled);
```

Output:

```js
[
  [2, 4],
  [6, 8]
]
```

The outer `map` transforms each row.

The inner `map` transforms each item in that row.

Concise version:

```js
const doubled = numbers.map((row) => row.map((number) => number * 2));
```

Use this pattern when you want to preserve the nested structure.

## Flattening Multi-dimensional Arrays

Sometimes you do not want rows anymore.

You want one flat list.

```js
const grid = [
  [1, 2],
  [3, 4],
  [5, 6],
];

const flat = grid.flat();

console.log(flat); // [1, 2, 3, 4, 5, 6]
```

`.flat()` returns a new array.

It does not mutate the original array.

```js
console.log(grid);
```

Still:

```js
[
  [1, 2],
  [3, 4],
  [5, 6]
]
```

## Flattening by Depth

By default, `.flat()` flattens one level.

```js
const nested = [1, [2, 3], [4, [5, 6]]];

console.log(nested.flat()); // [1, 2, 3, 4, [5, 6]]
```

To flatten deeper, pass a depth:

```js
console.log(nested.flat(2)); // [1, 2, 3, 4, 5, 6]
```

To flatten all levels:

```js
console.log(nested.flat(Infinity)); // [1, 2, 3, 4, 5, 6]
```

You learned this in the `flat` and `flatMap` lesson.

Multi-dimensional arrays are one of the main reasons these methods are useful.

## Using `flatMap` With Nested Results

`flatMap` is useful when each item becomes an array and you want one combined result.

```js
const sentences = ["Hello world", "JavaScript is fun"];

const words = sentences.flatMap((sentence) => {
  return sentence.split(" ");
});

console.log(words); // ["Hello", "world", "JavaScript", "is", "fun"]
```

Without `flatMap`, `.map()` would create a nested array:

```js
const mapped = sentences.map((sentence) => {
  return sentence.split(" ");
});

console.log(mapped);
```

Output:

```js
[
  ["Hello", "world"],
  ["JavaScript", "is", "fun"]
]
```

`flatMap` maps and flattens one level.

## Practical Example: Seating Chart

A seating chart is a natural two-dimensional array.

```js
const seats = [
  ["A1", "A2", "A3"],
  ["B1", "B2", "B3"],
  ["C1", "C2", "C3"],
];
```

Access a specific seat:

```js
console.log(seats[1][2]); // B3
```

List every seat:

```js
for (const [rowIndex, row] of seats.entries()) {
  for (const [seatIndex, seat] of row.entries()) {
    console.log(`Row ${rowIndex}, Seat ${seatIndex}: ${seat}`);
  }
}
```

Get one flat list:

```js
const allSeats = seats.flat();

console.log(allSeats);
```

## Practical Example: Calendar Weeks

A calendar can be represented as weeks containing days.

```js
const month = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
];
```

Get a specific day:

```js
console.log(month[2][3]); // 18
```

That means:

```text
Week index 2.
Day index 3.
```

Find whether a day exists:

```js
const hasDayTwenty = month.flat().includes(20);

console.log(hasDayTwenty); // true
```

## Practical Example: Game Board

```js
const board = [
  ["X", "", "O"],
  ["", "X", ""],
  ["O", "", "X"],
];
```

Check the center:

```js
console.log(board[1][1]); // X
```

Update a cell:

```js
board[0][1] = "O";

console.log(board);
```

Loop through the board:

```js
board.forEach((row, rowIndex) => {
  row.forEach((cell, columnIndex) => {
    console.log(`Cell [${rowIndex}][${columnIndex}] = ${cell}`);
  });
});
```

## Multi-dimensional Arrays vs Arrays of Objects

Multi-dimensional arrays are useful when position is the most important thing.

Good fit:

```js
const board = [
  ["X", "O", ""],
  ["", "X", ""],
  ["O", "", "X"],
];
```

The row and column positions matter.

But if the data has named properties, an array of objects may be clearer.

Less clear:

```js
const users = [
  [1, "Alice", "admin"],
  [2, "Bob", "user"],
];
```

Clearer:

```js
const users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" },
];
```

With objects, you do not need to remember what index `0`, `1`, and `2` mean.

Use the data structure that makes the meaning easiest to understand.

## Best Practices

Use multi-dimensional arrays for grid-like data:

```js
const grid = [
  [1, 2],
  [3, 4],
];
```

Use clear row and column variable names:

```js
const value = grid[rowIndex][columnIndex];
```

Use optional chaining when nested data may be missing:

```js
const value = grid[rowIndex]?.[columnIndex];
```

Use nested loops or nested array methods to process every item:

```js
grid.forEach((row) => {
  row.forEach((item) => {
    console.log(item);
  });
});
```

Use `.flat()` when you need one simple list:

```js
const allItems = grid.flat();
```

Prefer arrays of objects when the values need names:

```js
const users = [{ id: 1, name: "Alice" }];
```

## Common Mistakes

### Mistake 1: Forgetting the Second Bracket

```js
const grid = [
  ["A", "B"],
  ["C", "D"],
];

console.log(grid[1]); // ["C", "D"]
```

`grid[1]` gives the whole second row.

To get `"D"`:

```js
console.log(grid[1][1]); // D
```

### Mistake 2: Mixing Up Row and Column

```js
const grid = [
  ["A", "B", "C"],
  ["D", "E", "F"],
];

console.log(grid[1][2]); // F
```

The first index is the row.

The second index is the column.

### Mistake 3: Assuming Every Row Has the Same Length

```js
const groups = [
  ["Alice", "Bob"],
  ["Charlie"],
];

console.log(groups[1][1]); // undefined
```

The second row does not have an item at index `1`.

Check row lengths when data may be uneven.

### Mistake 4: Using Deep Indexes for Complex Data

```js
const user = data[0][1][2][3];
```

Deep chained indexes are hard to understand.

If your data starts looking like this, consider using objects with named properties.

### Mistake 5: Expecting `flat()` to Mutate the Original

```js
const grid = [[1, 2], [3, 4]];

grid.flat();

console.log(grid); // [[1, 2], [3, 4]]
```

`flat()` returns a new array.

Store the result:

```js
const flatGrid = grid.flat();
```

## Quick Check

What does this log?

```js
const grid = [
  ["A", "B"],
  ["C", "D"],
];

console.log(grid[0][1]);
console.log(grid[1][0]);
```

It logs:

```text
B
C
```

What does this return?

```js
const grid = [
  [1, 2],
  [3, 4],
];

const result = grid.flat();
```

It returns:

```js
[1, 2, 3, 4]
```

What does this log?

```js
const grid = [["A"]];

console.log(grid[2]?.[0]);
```

It logs:

```js
undefined
```

Optional chaining prevents an error when the row does not exist.

## Summary

Multi-dimensional arrays are arrays that contain other arrays.

- They are useful for grids, boards, tables, calendars, and grouped data.
- Access nested items with chained brackets like `array[row][column]`.
- The first index usually selects the row.
- The second index usually selects the column.
- Use nested loops or nested array methods to process every item.
- Use `.entries()` when you need row and column indexes while looping.
- Use `.flat()` to turn nested arrays into a simpler array.
- Use `.flatMap()` when you need to map and flatten one level.
- Prefer arrays of objects when named properties would make the data clearer.
