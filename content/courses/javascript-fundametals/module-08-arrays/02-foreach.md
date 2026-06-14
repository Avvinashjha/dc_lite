# forEach

In the previous lesson, you learned how arrays store ordered collections of values.

Now you need a way to do something with each item in an array.

You could use a `for` loop:

```js
const fruits = ["Apple", "Banana", "Cherry"];

for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
```

This works, but it requires you to manage:

- the counter variable
- the loop condition
- the index lookup

JavaScript gives you a cleaner array method for this kind of task: **`forEach`**.

## What Is `forEach`?

`forEach` is an array method that runs a callback function once for each element in an array.

```js
const fruits = ["Apple", "Banana", "Cherry"];

fruits.forEach(function (fruit) {
  console.log(fruit);
});
```

Output:

```text
Apple
Banana
Cherry
```

`forEach` is a higher-order function because it receives another function as an argument.

The function you pass to `forEach` is called a **callback**.

## Basic Syntax

The general syntax looks like this:

```js
array.forEach(function (currentValue, index, array) {
  // code to run for each item
});
```

The callback can receive three arguments:

| Argument | Meaning | Common? |
| --- | --- | --- |
| `currentValue` | The current element being processed | Yes |
| `index` | The index of the current element | Sometimes |
| `array` | The original array `forEach` was called on | Rarely |

Most of the time, you only need the first argument.

```js
const names = ["Ava", "Noah", "Mira"];

names.forEach(function (name) {
  console.log(name);
});
```

## How `forEach` Works

Think of `forEach` like this:

```text
For each item in this array, run this callback.
```

Example:

```js
const numbers = [10, 20, 30];

numbers.forEach(function (number) {
  console.log(number);
});
```

JavaScript calls the callback three times:

```js
// first call
callback(10);

// second call
callback(20);

// third call
callback(30);
```

You do not write those calls manually.

`forEach` handles them for you.

## Using an Anonymous Function

A common `forEach` pattern uses an anonymous function.

```js
const fruits = ["Apple", "Banana", "Cherry"];

fruits.forEach(function (fruit) {
  console.log(fruit);
});
```

The callback function has no name because it is only used here.

This is readable when the callback is short.

## Using an Arrow Function

Modern JavaScript often uses arrow functions with `forEach`.

```js
const fruits = ["Apple", "Banana", "Cherry"];

fruits.forEach((fruit) => {
  console.log(fruit);
});
```

For a very short callback, you may see this concise form:

```js
fruits.forEach((fruit) => console.log(fruit));
```

All three versions do the same thing:

```js
fruits.forEach(function (fruit) {
  console.log(fruit);
});

fruits.forEach((fruit) => {
  console.log(fruit);
});

fruits.forEach((fruit) => console.log(fruit));
```

Use the style that is clearest for the amount of logic you have.

## Using the Index

Sometimes you need to know the position of the current item.

The second callback argument is the index.

```js
const colors = ["Red", "Green", "Blue"];

colors.forEach((color, index) => {
  console.log(`Color #${index + 1} is ${color}`);
});
```

Output:

```text
Color #1 is Red
Color #2 is Green
Color #3 is Blue
```

The index starts at `0`, so this expression:

```js
index + 1
```

is used to display human-friendly numbering.

## Using the Original Array Argument

The third callback argument is the original array.

```js
const scores = [80, 90, 100];

scores.forEach((score, index, array) => {
  console.log(`${score} is item ${index + 1} of ${array.length}`);
});
```

Output:

```text
80 is item 1 of 3
90 is item 2 of 3
100 is item 3 of 3
```

This third argument is available, but it is not used as often.

If you already have access to the array variable, you can usually use that directly:

```js
scores.forEach((score, index) => {
  console.log(`${score} is item ${index + 1} of ${scores.length}`);
});
```

## `forEach` Is Good for Side Effects

`forEach` is best when you want to perform a **side effect** for each item.

A side effect is an action that affects something outside the callback's returned value.

Common side effects include:

- logging to the console
- updating the page
- sending data somewhere
- pushing values into another array
- updating an object

Example:

```js
const tasks = ["Write notes", "Review code", "Deploy app"];

tasks.forEach((task) => {
  console.log(`Task: ${task}`);
});
```

Here, the side effect is logging.

## Practical Example: Building a Total

You can use `forEach` to update an outer variable.

```js
const prices = [10, 20, 30];
let total = 0;

prices.forEach((price) => {
  total += price;
});

console.log(total); // 60
```

This works because the callback can access and update `total`.

However, later in this module you will learn that `.reduce()` is often a better fit for calculating a single value from an array.

For now, this example shows that `forEach` can perform repeated actions.

## Practical Example: Updating the DOM

In browser code, `forEach` is often used to create or update elements.

```js
const items = ["Home", "About", "Contact"];
const list = document.querySelector("#menu");

items.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item;
  list.appendChild(li);
});
```

The callback runs once for each menu item.

Each run creates and appends one `<li>` element.

This is a good use of `forEach` because the goal is a side effect: updating the page.

## `forEach` Returns `undefined`

This is one of the most important rules.

`forEach` always returns `undefined`.

```js
const numbers = [1, 2, 3];

const result = numbers.forEach((number) => {
  return number * 2;
});

console.log(result); // undefined
```

The `return` statement inside the callback does not make `forEach` return a new array.

It only returns from the current callback call.

If you want a new transformed array, use `map`.

```js
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => {
  return number * 2;
});

console.log(doubled); // [2, 4, 6]
```

You will learn `map` in the next lesson.

## `return` Inside `forEach`

A `return` inside a `forEach` callback exits only that callback execution.

```js
const numbers = [1, 2, 3, 4];

numbers.forEach((number) => {
  if (number % 2 === 0) {
    return;
  }

  console.log(number);
});
```

Output:

```text
1
3
```

This `return` skips the rest of the callback for the current item.

It does not stop the whole `forEach`.

The callback still runs for the next item.

## You Cannot `break` Out of `forEach`

`forEach` is not a loop statement.

It is a method call.

Because of that, you cannot use `break` inside it.

```js
const numbers = [1, 2, 3, 4, 5];

numbers.forEach((number) => {
  if (number === 3) {
    break;
  }

  console.log(number);
});
```

This causes a syntax error.

If you need to stop early, use a regular loop or a `for...of` loop.

```js
const numbers = [1, 2, 3, 4, 5];

for (const number of numbers) {
  if (number === 3) {
    break;
  }

  console.log(number);
}
```

Output:

```text
1
2
```

## You Cannot `continue` in `forEach`

You also cannot use `continue` inside `forEach`.

```js
numbers.forEach((number) => {
  if (number % 2 === 0) {
    continue;
  }

  console.log(number);
});
```

This causes a syntax error.

Use `return` to skip the current callback:

```js
const numbers = [1, 2, 3, 4];

numbers.forEach((number) => {
  if (number % 2 === 0) {
    return;
  }

  console.log(number);
});
```

Output:

```text
1
3
```

This behaves like "skip this item," but it does not stop the entire iteration.

## `forEach` vs `for...of`

Use `forEach` when you want to run a callback for every item.

```js
const names = ["Ava", "Noah", "Mira"];

names.forEach((name) => {
  console.log(name);
});
```

Use `for...of` when you need loop control like `break` or `continue`.

```js
const names = ["Ava", "Noah", "Mira"];

for (const name of names) {
  if (name === "Noah") {
    break;
  }

  console.log(name);
}
```

Output:

```text
Ava
```

`for...of` gives you more control.

`forEach` gives you a clean callback style.

## `forEach` Does Not Change the Array by Itself

Calling `forEach` does not automatically change the array.

```js
const numbers = [1, 2, 3];

numbers.forEach((number) => {
  number * 2;
});

console.log(numbers); // [1, 2, 3]
```

The expression `number * 2` creates a value, but nothing uses it.

If you mutate the array inside the callback, then the array can change:

```js
const numbers = [1, 2, 3];

numbers.forEach((number, index, array) => {
  array[index] = number * 2;
});

console.log(numbers); // [2, 4, 6]
```

This is possible, but it is not always the clearest choice.

If you want a transformed array, prefer `map`.

## `forEach` and Async Code

Be careful with async code inside `forEach`.

This pattern often does not do what beginners expect:

```js
const ids = [1, 2, 3];

ids.forEach(async (id) => {
  await fetch(`/api/users/${id}`);
});

console.log("Done");
```

The `forEach` method does not wait for async callbacks to finish.

`"Done"` may log before the requests complete.

You will learn async JavaScript later, but remember this rule:

```text
forEach is not designed for awaiting async work.
```

When you need to wait for async operations, other patterns are usually better.

## Best Practices

Use `forEach` for side effects:

```js
users.forEach((user) => {
  console.log(user.name);
});
```

Use arrow functions for short callbacks:

```js
numbers.forEach((number) => console.log(number));
```

Use a named callback if the logic is longer:

```js
function logUser(user) {
  console.log(`${user.name} (${user.role})`);
}

users.forEach(logUser);
```

Use `for...of` if you need `break` or `continue`:

```js
for (const user of users) {
  if (user.isBlocked) {
    break;
  }

  console.log(user.name);
}
```

Use `map` when you need a new transformed array:

```js
const doubled = numbers.map((number) => number * 2);
```

## Common Mistakes

### Mistake 1: Expecting `forEach` to Return a New Array

```js
const numbers = [1, 2, 3];

const doubled = numbers.forEach((number) => {
  return number * 2;
});

console.log(doubled); // undefined
```

Use `map` instead:

```js
const doubled = numbers.map((number) => {
  return number * 2;
});

console.log(doubled); // [2, 4, 6]
```

### Mistake 2: Trying to Use `break`

```js
numbers.forEach((number) => {
  if (number === 3) {
    break;
  }
});
```

This is invalid.

Use `for...of` when you need to stop early.

### Mistake 3: Thinking `return` Stops the Whole `forEach`

```js
const numbers = [1, 2, 3, 4];

numbers.forEach((number) => {
  if (number === 3) {
    return;
  }

  console.log(number);
});
```

Output:

```text
1
2
4
```

The `return` skips only the callback for `3`.

It does not stop the entire `forEach`.

### Mistake 4: Forgetting the Index Is the Second Argument

```js
const colors = ["Red", "Green", "Blue"];

colors.forEach((index, color) => {
  console.log(index, color);
});
```

This is backwards.

The first argument is the current value.

The second argument is the index.

Correct:

```js
colors.forEach((color, index) => {
  console.log(index, color);
});
```

## Quick Check

What does this log?

```js
const fruits = ["Apple", "Banana"];

fruits.forEach((fruit) => {
  console.log(fruit);
});
```

It logs:

```text
Apple
Banana
```

What does this return?

```js
const numbers = [1, 2, 3];

const result = numbers.forEach((number) => number * 2);
```

It returns:

```js
undefined
```

`forEach` always returns `undefined`.

What should you use if you want `[2, 4, 6]` from `[1, 2, 3]`?

Use `map`:

```js
const doubled = numbers.map((number) => number * 2);
```

## Summary

`forEach` runs a callback once for each element in an array.

- It is a higher-order function.
- The callback receives `currentValue`, `index`, and the original array.
- It is best for side effects like logging or updating the page.
- It always returns `undefined`.
- You cannot use `break` or `continue` inside `forEach`.
- `return` inside the callback only exits the current callback call.
- Use `for...of` when you need loop control.
- Use `map` when you need a new transformed array.
