# while Loops

A `while` loop repeats code as long as a condition remains true.

Use a `while` loop when you do not know the exact number of times the loop should run.

Examples:

- Keep asking for input until it is valid.
- Keep rolling a die until you get a specific number.
- Keep reading data until there is no more data.
- Keep retrying until a condition changes.

## Basic Structure

A `while` loop has one condition.

```js
while (condition) {
  // code to repeat
}
```

Before every iteration, JavaScript checks the condition.

If the condition is truthy, the block runs.

If the condition is falsy, the loop stops.

## Basic Countdown Example

```js
let count = 3;

while (count > 0) {
  console.log(count);
  count--;
}

console.log("Blastoff!");
```

Output:

```text
3
2
1
Blastoff!
```

Here is what happens:

1. `count` starts at `3`.
2. JavaScript checks `count > 0`.
3. If true, it prints `count`.
4. `count--` decreases the value.
5. The condition is checked again.
6. The loop stops when `count` becomes `0`.

The update step is important:

```js
count--;
```

Without it, the loop would never stop.

## `while` vs `for`

Use a `for` loop when the number of iterations is known or naturally index-based.

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

Use a `while` loop when the number of iterations depends on a condition that may change dynamically.

```js
let attempts = 0;
let success = false;

while (!success) {
  attempts++;
  success = attempts === 3;
}
```

The difference:

| Loop | Best for |
| --- | --- |
| `for` | Known counts, indexes, arrays |
| `while` | Unknown counts, dynamic conditions |

## Rolling Until a Condition Is Met

Here is a common `while` example: roll a die until you get `6`.

```js
let roll = 0;
let attempts = 0;

while (roll !== 6) {
  roll = Math.floor(Math.random() * 6) + 1;
  attempts++;

  console.log(`Rolled a ${roll}`);
}

console.log(`It took ${attempts} attempts to roll a 6.`);
```

You do not know how many times this loop will run.

It might roll a `6` on the first attempt.

It might take many attempts.

That makes `while` a good fit.

## Using `while` with Input-Like Conditions

In real applications, a `while` loop can represent repeated checking.

```js
let password = "";
let attempts = 0;

while (password !== "secret" && attempts < 3) {
  attempts++;
  password = attempts === 3 ? "secret" : "wrong";
}

console.log(`Attempts: ${attempts}`);
```

In a browser, real user input is usually handled with events and forms rather than blocking loops. But the logic is similar:

```text
keep trying while the password is wrong and attempts remain
```

## `do...while`

`do...while` is a variation of `while`.

The condition is checked after the loop body runs.

That means the code runs at least once.

```js
do {
  // code to run at least once
} while (condition);
```

Example:

```js
let energy = 0;

do {
  console.log("Drinking coffee...");
  energy += 10;
} while (energy < 50);
```

This loop runs once before checking `energy < 50`.

Then it continues while the condition remains true.

## `while` vs `do...while`

`while` may run zero times.

```js
let count = 0;

while (count > 0) {
  console.log(count);
}
```

The condition is false from the start, so the block never runs.

`do...while` runs at least once.

```js
let count = 0;

do {
  console.log(count);
} while (count > 0);
```

Output:

```text
0
```

Use `do...while` only when the first run should always happen.

## Infinite Loops

An infinite loop happens when the condition never becomes false.

```js
let isActive = true;

while (isActive) {
  console.log("Running...");
}
```

This loop never stops because `isActive` never changes.

A safer version:

```js
let isActive = true;
let runs = 0;

while (isActive) {
  console.log("Running...");
  runs++;

  if (runs === 3) {
    isActive = false;
  }
}
```

The loop stops after three runs.

## Updating State Inside the Loop

Every `while` loop should have some path that moves it toward stopping.

Counter example:

```js
let count = 0;

while (count < 3) {
  console.log(count);
  count++;
}
```

Condition-changing example:

```js
let found = false;
let attempts = 0;

while (!found && attempts < 5) {
  attempts++;

  if (attempts === 4) {
    found = true;
  }
}
```

The condition changes because `attempts` changes and `found` can become true.

## Using `break` with `while`

Sometimes you want to stop a loop from inside the body.

Use `break`.

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

`while (true)` creates an intentional infinite loop, but `break` provides the stopping condition.

Use this carefully. Make sure the `break` condition is reachable.

## Common Mistakes

## Forgetting to Update the Condition

```js
let count = 0;

while (count < 5) {
  console.log(count);
}
```

`count` never changes, so this loop never stops.

Fix:

```js
let count = 0;

while (count < 5) {
  console.log(count);
  count++;
}
```

## Using `while` When `for` Is Clearer

This works:

```js
let i = 0;

while (i < 5) {
  console.log(i);
  i++;
}
```

But this is clearer for a known count:

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

Use the loop that best communicates your intent.

## Writing Conditions That Never Become False

```js
let count = 10;

while (count > 0) {
  console.log(count);
  count++;
}
```

This moves in the wrong direction. `count` gets larger, so `count > 0` stays true.

Fix:

```js
let count = 10;

while (count > 0) {
  console.log(count);
  count--;
}
```

## Summary

A `while` loop repeats code while a condition remains truthy.

Remember:

1. Use `while` when the number of iterations is not known ahead of time.
2. The condition is checked before each iteration.
3. If the condition starts false, a `while` loop may run zero times.
4. Use `do...while` when the block must run at least once.
5. Always update state so the condition can eventually become false.
6. Be careful to avoid infinite loops.
7. Use `for` when the loop is based on a clear counter or array index.
8. Use `break` carefully when stopping from inside the loop body.

Next, you will learn about `break` and `continue`, two tools for controlling loop execution more precisely.
