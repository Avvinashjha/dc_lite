# break and continue

Loops normally run until their condition becomes false.

Sometimes you need more control:

- Stop the loop early because you found what you needed.
- Skip one item and continue with the next item.
- Exit a nested loop.

JavaScript gives you two important keywords for this:

- `break`
- `continue`

## The `break` Statement

`break` immediately stops the loop.

After `break` runs, JavaScript jumps to the first line after the loop.

```js
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    break;
  }

  console.log(i);
}

console.log("Loop finished");
```

Output:

```text
1
2
Loop finished
```

When `i` becomes `3`, the loop stops completely.

## Using `break` to Stop Searching

`break` is useful when you are searching for something.

Once you find it, there is no reason to keep looping.

```js
const numbers = [10, 25, 4, 8, 15, 30];

for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] === 15) {
    console.log(`Found 15 at index ${i}`);
    break;
  }

  console.log(`Checking ${numbers[i]}...`);
}
```

Output:

```text
Checking 10...
Checking 25...
Checking 4...
Checking 8...
Found 15 at index 4
```

The loop never checks `30` because the goal was already reached.

This is called an **early exit**.

## `break` in a `while` Loop

`break` also works inside `while` loops.

```js
let count = 0;

while (true) {
  count++;

  if (count === 3) {
    break;
  }
}

console.log(count); // 3
```

`while (true)` creates a loop that would run forever, but `break` provides the stopping point.

Use this pattern carefully. Always make sure the `break` condition can actually happen.

## `break` in a `switch`

You have already seen `break` in `switch` statements.

```js
const status = "success";

switch (status) {
  case "loading":
    console.log("Loading");
    break;
  case "success":
    console.log("Done");
    break;
  default:
    console.log("Unknown status");
}
```

In a `switch`, `break` prevents fall-through into the next case.

## The `continue` Statement

`continue` skips the rest of the current iteration.

The loop does not stop.

It moves to the next iteration.

```js
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue;
  }

  console.log(i);
}
```

Output:

```text
1
2
4
5
```

When `i` is `3`, JavaScript skips the `console.log(i)` line and continues with `4`.

## Using `continue` to Skip Invalid Data

`continue` is useful when some items should be ignored.

```js
const users = [
  { name: "Asha", age: 25 },
  { name: "Ravi", age: null },
  { name: "Maya", age: 30 }
];

for (let i = 0; i < users.length; i++) {
  if (users[i].age === null) {
    console.log(`Skipping ${users[i].name}: age is missing`);
    continue;
  }

  console.log(`${users[i].name} is ${users[i].age} years old`);
}
```

Output:

```text
Asha is 25 years old
Skipping Ravi: age is missing
Maya is 30 years old
```

The loop continues processing the rest of the users.

## `continue` in a `while` Loop

When using `continue` in a `while` loop, be careful to update your loop state before continuing.

This works:

```js
let count = 0;

while (count < 5) {
  count++;

  if (count === 3) {
    continue;
  }

  console.log(count);
}
```

Output:

```text
1
2
4
5
```

If you place `continue` before updating the counter, you can accidentally create an infinite loop.

## `break` vs `continue`

| Keyword | What it does | Loop continues later? |
| --- | --- | --- |
| `break` | Stops the loop completely | No |
| `continue` | Skips the current iteration | Yes |

Example with `break`:

```js
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    break;
  }

  console.log(i);
}
```

Output:

```text
1
2
```

Example with `continue`:

```js
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue;
  }

  console.log(i);
}
```

Output:

```text
1
2
4
5
```

## Nested Loops

A normal `break` only exits the loop it is directly inside.

```js
for (let row = 1; row <= 3; row++) {
  for (let col = 1; col <= 3; col++) {
    if (col === 2) {
      break;
    }

    console.log(`row=${row}, col=${col}`);
  }
}
```

The `break` exits only the inner loop.

The outer loop continues.

## Labels

JavaScript supports labels for breaking out of nested loops.

A label is a name followed by a colon before a loop.

```js
outerLoop: for (let row = 1; row <= 3; row++) {
  for (let col = 1; col <= 3; col++) {
    if (row === 2 && col === 2) {
      console.log("Breaking out of both loops");
      break outerLoop;
    }

    console.log(`row=${row}, col=${col}`);
  }
}
```

Output:

```text
row=1, col=1
row=1, col=2
row=1, col=3
row=2, col=1
Breaking out of both loops
```

Labels are valid JavaScript, but they are rare in modern application code.

If you need labels often, the code may be easier to understand if you split logic into functions.

## Replacing Loops with Array Methods Later

In later modules, you will learn array methods like:

- `find()`
- `filter()`
- `map()`
- `some()`
- `every()`

Some of these can replace loops that use `break` or `continue`.

For example, searching with a loop:

```js
const users = ["Asha", "Ravi", "Maya"];
let foundUser = null;

for (let i = 0; i < users.length; i++) {
  if (users[i] === "Ravi") {
    foundUser = users[i];
    break;
  }
}
```

Later, you can write:

```js
const foundUser = users.find((user) => user === "Ravi");
```

For now, learning `break` and `continue` helps you understand what these methods do internally.

## Common Mistakes

## Using `continue` Before Updating State

```js
let i = 0;

while (i < 5) {
  if (i === 3) {
    continue;
  }

  i++;
}
```

When `i` becomes `3`, the loop continues before `i++` can run. The loop gets stuck.

Fix:

```js
let i = 0;

while (i < 5) {
  i++;

  if (i === 3) {
    continue;
  }
}
```

## Overusing `break` and `continue`

Too many jumps can make a loop hard to follow.

If a loop becomes confusing, consider:

- naming conditions clearly
- extracting logic into a function
- using array methods later
- simplifying the loop

## Using `break` When You Meant `continue`

If you only want to skip one item, use `continue`.

If you want to stop the entire loop, use `break`.

## Summary

`break` and `continue` give you more control inside loops.

Remember:

1. `break` stops the loop completely.
2. `continue` skips the current iteration and moves to the next one.
3. `break` is useful when searching and you have found what you need.
4. `continue` is useful when skipping invalid or unwanted items.
5. In `while` loops, update loop state before using `continue`.
6. A normal `break` exits only the nearest loop.
7. Labels can break out of nested loops, but they are rarely needed.
8. If `break` and `continue` make code hard to follow, consider refactoring.

Next, you will review the module with a control-flow knowledge check.
