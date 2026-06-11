# for Loops

Programs often need to repeat work.

For example:

- Print numbers from 1 to 10.
- Process every item in a shopping cart.
- Show every user in a list.
- Retry an action a fixed number of times.

Instead of writing the same code again and again, you use a **loop**.

A `for` loop is commonly used when you know how many times you want the code to run.

## Basic Structure

A `for` loop has three parts inside parentheses:

```js
for (initialization; condition; finalExpression) {
  // code to repeat
}
```

The three parts are:

1. **Initialization**: Runs once before the loop starts.
2. **Condition**: Checked before each iteration.
3. **Final expression**: Runs after each iteration.

Example:

```js
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
```

This prints:

```text
1
2
3
4
5
```

## Understanding the Parts

Look at this loop:

```js
for (let i = 1; i <= 5; i++) {
  console.log(`Count is: ${i}`);
}
```

Part 1:

```js
let i = 1
```

This creates the loop counter.

Part 2:

```js
i <= 5
```

This condition decides whether the loop should continue.

Part 3:

```js
i++
```

This updates the counter after each loop run.

## Step-by-Step Execution

For this loop:

```js
for (let i = 1; i <= 5; i++) {
  console.log(`Count is: ${i}`);
}
```

JavaScript does this:

1. Create `i` and set it to `1`.
2. Check `i <= 5`.
3. If true, run the loop body.
4. Run `i++`.
5. Check the condition again.
6. Repeat until the condition becomes false.

When `i` becomes `6`, the condition `i <= 5` is false, so the loop stops.

## Counting from Zero

In JavaScript, loops often start at `0`.

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

Output:

```text
0
1
2
3
4
```

This pattern is common because array indexes start at `0`.

## Looping Through Arrays

One of the most common uses of a `for` loop is reading every item in an array.

```js
const fruits = ["Apple", "Banana", "Cherry", "Date"];

for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
```

Output:

```text
Apple
Banana
Cherry
Date
```

Why does this work?

- `i` starts at `0`.
- The first item is `fruits[0]`.
- The loop continues while `i < fruits.length`.
- The last index is `fruits.length - 1`.

Do not use `i <= fruits.length` here.

```js
const fruits = ["Apple", "Banana", "Cherry"];

for (let i = 0; i <= fruits.length; i++) {
  console.log(fruits[i]);
}
```

This tries to access one index too far and prints `undefined` at the end.

Use:

```js
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
```

## Looping Backward

You can also count backward.

```js
for (let i = 5; i >= 1; i--) {
  console.log(i);
}
```

Output:

```text
5
4
3
2
1
```

Backward loops are useful when you need to process items from the end of an array.

```js
const tasks = ["Plan", "Build", "Test"];

for (let i = tasks.length - 1; i >= 0; i--) {
  console.log(tasks[i]);
}
```

Output:

```text
Test
Build
Plan
```

## Skipping by More Than One

The final expression does not have to be `i++`.

You can increment by `2`.

```js
for (let i = 0; i <= 10; i += 2) {
  console.log(i);
}
```

Output:

```text
0
2
4
6
8
10
```

This is useful when you want every second value.

## Building a Total

Loops are often used to calculate totals.

```js
const prices = [100, 250, 50];
let total = 0;

for (let i = 0; i < prices.length; i++) {
  total += prices[i];
}

console.log(total); // 400
```

The loop visits each price and adds it to `total`.

## Finding a Value

You can use a loop to search for something.

```js
const users = ["Asha", "Ravi", "Maya"];
let found = false;

for (let i = 0; i < users.length; i++) {
  if (users[i] === "Ravi") {
    found = true;
  }
}

console.log(found); // true
```

Later, you will learn `break`, which lets you stop a loop early once the value is found.

## Infinite Loops

An infinite loop happens when the condition never becomes false.

This is dangerous:

```js
for (let i = 0; i < 5; i--) {
  console.log(i);
}
```

The problem is `i--`.

`i` starts at `0`, then becomes `-1`, `-2`, `-3`, and so on.

It never reaches `5`, so `i < 5` stays true forever.

Always make sure the final expression moves the loop toward stopping.

## Use `let` for Loop Counters

Use `let` for the loop counter.

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}
```

`let` is block-scoped, so `i` only exists inside the loop.

Avoid `var`:

```js
for (var i = 0; i < 3; i++) {
  console.log(i);
}

console.log(i); // 3
```

Because `var` is not block-scoped, it leaks outside the loop.

## Naming Loop Counters

Short names like `i`, `j`, and `k` are common for simple loops.

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

For more meaningful loops, a descriptive name can be clearer.

```js
for (let index = 0; index < users.length; index++) {
  console.log(users[index]);
}
```

Use the style that makes the code easiest to read.

## Caching Array Length

You may see code like this:

```js
for (let i = 0, len = fruits.length; i < len; i++) {
  console.log(fruits[i]);
}
```

This stores the array length before the loop continues.

In most modern JavaScript code, this is not necessary for normal arrays. Use the simpler version unless you have a specific reason:

```js
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
```

## Common Mistakes

## Off-by-One Errors

This loop goes too far:

```js
const fruits = ["Apple", "Banana", "Cherry"];

for (let i = 0; i <= fruits.length; i++) {
  console.log(fruits[i]);
}
```

Use `<`, not `<=`, when looping over array indexes:

```js
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
```

## Forgetting to Update the Counter

```js
for (let i = 0; i < 5;) {
  console.log(i);
}
```

This never changes `i`, so the loop never stops.

## Updating in the Wrong Direction

```js
for (let i = 0; i < 5; i--) {
  console.log(i);
}
```

The condition expects `i` to grow, but `i--` makes it smaller.

## Summary

A `for` loop repeats a block of code.

Remember:

1. A `for` loop has initialization, condition, and final expression.
2. The condition is checked before each iteration.
3. The final expression runs after each iteration.
4. Use `let` for loop counters.
5. Array loops usually start at `0` and use `i < array.length`.
6. Be careful with off-by-one errors.
7. Make sure the loop moves toward a stopping condition.
8. Use simple, readable loops unless optimization is truly needed.

Next, you will learn about `while` loops, which are useful when you do not know exactly how many times a loop should run.
