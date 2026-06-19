# Array Basics

You have already seen arrays briefly when learning about objects and reference types.

Now it is time to work with them more directly.

Arrays are one of the most important data structures in JavaScript.

They let you store an **ordered collection** of values under one variable name.

For example, instead of writing this:

```js
const firstFruit = "Apple";
const secondFruit = "Banana";
const thirdFruit = "Cherry";
```

You can write this:

```js
const fruits = ["Apple", "Banana", "Cherry"];
```

Now all three values are grouped together in one array.

## What Is an Array?

An array is an ordered list of values.

Each value inside an array is called an **element**.

```js
const colors = ["Red", "Green", "Blue"];
```

This array has three elements:

- `"Red"`
- `"Green"`
- `"Blue"`

Arrays are useful when you have multiple related values:

```js
const scores = [95, 88, 72, 100];
const users = ["Ava", "Mira", "Noah"];
const tasks = ["Write notes", "Review code", "Deploy app"];
```

You will use arrays constantly in JavaScript.

They appear in almost every real application.

## Why Arrays Are Useful

Arrays help you work with collections.

For example:

```js
const products = ["Laptop", "Mouse", "Keyboard"];
```

Once values are in an array, you can:

- access items by position
- add new items
- remove items
- update items
- loop through items
- search for items
- transform items into new arrays

This module will cover many of those operations.

This lesson starts with the foundation.

## Creating Arrays

The most common way to create an array is with square brackets:

```js
const fruits = ["Apple", "Banana", "Cherry"];
```

This is called an **array literal**.

It is the preferred way to create arrays in modern JavaScript.

## Array Literal Syntax

Use square brackets `[]`.

```js
const fruits = ["Apple", "Banana", "Cherry"];
const numbers = [10, 20, 30, 40];
const booleans = [true, false, true];
const empty = [];
```

An empty array contains no elements:

```js
const empty = [];

console.log(empty.length); // 0
```

Array literals are:

- short
- readable
- predictable
- widely used

Use them by default.

## Arrays Can Hold Any Type

An array can contain any JavaScript value.

```js
const mixed = [1, "Hello", true, null, { name: "Alice" }];
```

This is allowed.

JavaScript does not require every array element to have the same type.

However, in real code, arrays are usually easier to understand when they contain the same kind of value.

Clear:

```js
const prices = [10, 25, 50];
const names = ["Ava", "Noah", "Mira"];
```

Harder to reason about:

```js
const randomValues = [10, "Ava", false, null, { role: "admin" }];
```

Mixed arrays can be useful sometimes, but beginners should usually prefer arrays where each item has a clear shared purpose.

## Avoid `new Array()`

JavaScript also has an `Array` constructor:

```js
const fruits = new Array("Apple", "Banana");
```

This works, but it is usually not recommended.

The main problem is that `new Array()` behaves differently depending on its arguments.

```js
const arr1 = new Array(3);

console.log(arr1); // [empty x 3]
```

This does not create:

```js
[3]
```

It creates an array with a length of `3` and empty slots.

But this creates an array with two strings:

```js
const arr2 = new Array("Apple", "Banana");

console.log(arr2); // ["Apple", "Banana"]
```

This inconsistency makes `new Array()` easier to misuse.

Prefer array literals:

```js
const arr = [3];
const fruits = ["Apple", "Banana"];
```

Rule of thumb:

```text
Use [] to create arrays.
```

## Accessing Array Elements

Arrays are ordered.

Each element has a numeric position called an **index**.

JavaScript arrays use **zero-based indexing**.

That means the first item is at index `0`, not index `1`.

```js
const colors = ["Red", "Green", "Blue"];

console.log(colors[0]); // Red
console.log(colors[1]); // Green
console.log(colors[2]); // Blue
```

The positions are:

| Index | Element |
| --- | --- |
| `0` | `"Red"` |
| `1` | `"Green"` |
| `2` | `"Blue"` |

To access an element, use bracket notation:

```js
array[index]
```

Example:

```js
const users = ["Ava", "Noah", "Mira"];

const firstUser = users[0];

console.log(firstUser); // Ava
```

## Out-of-Bounds Access

If you access an index that does not exist, JavaScript returns `undefined`.

```js
const colors = ["Red", "Green", "Blue"];

console.log(colors[3]); // undefined
console.log(colors[99]); // undefined
```

This does not throw an error.

It simply gives you `undefined`.

This can be useful, but it can also hide mistakes.

For example:

```js
const users = ["Ava", "Noah"];

console.log(users[2]); // undefined
```

If you expected a third user, this tells you the array does not contain one.

## The `.length` Property

Every array has a `.length` property.

It tells you how many elements are in the array.

```js
const animals = ["Dog", "Cat", "Bird"];

console.log(animals.length); // 3
```

This array has three elements.

The indexes are:

```text
0, 1, 2
```

The length is:

```text
3
```

Because indexing starts at `0`, the last index is always:

```js
array.length - 1
```

## Getting the Last Element

To get the last element, use `.length - 1`.

```js
const animals = ["Dog", "Cat", "Bird"];

const lastAnimal = animals[animals.length - 1];

console.log(lastAnimal); // Bird
```

Why does this work?

```js
animals.length
```

is `3`.

So:

```js
animals.length - 1
```

is `2`.

And:

```js
animals[2]
```

is `"Bird"`.

## Using `.at()`

Modern JavaScript also has the `.at()` method.

```js
const animals = ["Dog", "Cat", "Bird"];

console.log(animals.at(0)); // Dog
console.log(animals.at(-1)); // Bird
```

The useful part is negative indexing:

```js
animals.at(-1)
```

returns the last element.

```js
animals.at(-2)
```

returns the second-to-last element.

You will still see this older pattern often:

```js
animals[animals.length - 1]
```

Both are valid.

## Updating Array Elements

Arrays are mutable.

That means their contents can be changed.

You can update an element by assigning a new value to an index.

```js
const scores = [90, 85, 88];

scores[1] = 95;

console.log(scores); // [90, 95, 88]
```

The element at index `1` changed from `85` to `95`.

Remember:

```js
scores[0] // 90
scores[1] // 95
scores[2] // 88
```

## `const` Does Not Make Arrays Immutable

This is important.

If an array is declared with `const`, you cannot reassign the variable:

```js
const scores = [90, 85, 88];

scores = [100, 100, 100]; // TypeError
```

But you can still change the array's contents:

```js
const scores = [90, 85, 88];

scores[1] = 95;
scores.push(100);

console.log(scores); // [90, 95, 88, 100]
```

`const` protects the variable binding.

It does not freeze the array.

This is the same reference-type behavior you saw earlier with objects.

## Adding Items With `push()`

The `push()` method adds one or more elements to the end of an array.

```js
const tasks = ["Email boss"];

tasks.push("Write report");

console.log(tasks); // ["Email boss", "Write report"]
```

You can push multiple items at once:

```js
const tasks = ["Email boss"];

tasks.push("Write report", "Call client");

console.log(tasks); // ["Email boss", "Write report", "Call client"]
```

`push()` changes the original array.

It also returns the new length:

```js
const tasks = ["Email boss"];

const newLength = tasks.push("Write report");

console.log(newLength); // 2
console.log(tasks); // ["Email boss", "Write report"]
```

## Removing Items With `pop()`

The `pop()` method removes the last element from an array.

It returns the removed element.

```js
const stack = ["Plate 1", "Plate 2", "Plate 3"];

const removed = stack.pop();

console.log(removed); // Plate 3
console.log(stack); // ["Plate 1", "Plate 2"]
```

`pop()` changes the original array.

If the array is empty, `pop()` returns `undefined`.

```js
const items = [];

console.log(items.pop()); // undefined
```

## Adding and Removing at the Beginning

JavaScript also has methods for the beginning of an array.

`unshift()` adds to the beginning:

```js
const queue = ["Second", "Third"];

queue.unshift("First");

console.log(queue); // ["First", "Second", "Third"]
```

`shift()` removes from the beginning:

```js
const queue = ["First", "Second", "Third"];

const first = queue.shift();

console.log(first); // First
console.log(queue); // ["Second", "Third"]
```

These methods are useful, but `push()` and `pop()` are more common.

Adding or removing at the end is usually simpler and often more efficient than changing the beginning.

## Arrays Are Reference Types

Arrays are reference types.

That means assigning an array to another variable does not create a new copy.

It creates another reference to the same array.

```js
const original = [1, 2, 3];
const copy = original;

copy.push(4);

console.log(original); // [1, 2, 3, 4]
console.log(copy); // [1, 2, 3, 4]
```

This surprises many beginners.

The variable `copy` is not a real copy.

Both variables point to the same array in memory.

## Comparing Array References

Two arrays with the same contents are not automatically equal.

```js
const first = [1, 2, 3];
const second = [1, 2, 3];

console.log(first === second); // false
```

They look the same, but they are different arrays.

They are stored in different places in memory.

But this is true:

```js
const first = [1, 2, 3];
const second = first;

console.log(first === second); // true
```

Both variables reference the same array.

## Copying an Array

To make a shallow copy of an array, you can use spread syntax:

```js
const original = [1, 2, 3];
const copy = [...original];

copy.push(4);

console.log(original); // [1, 2, 3]
console.log(copy); // [1, 2, 3, 4]
```

The spread syntax:

```js
[...original]
```

creates a new array containing the elements from `original`.

This is a **shallow copy**.

For arrays of primitive values, that is usually enough.

For arrays containing objects, the objects inside are still shared references.

```js
const users = [{ name: "Alice" }];
const copiedUsers = [...users];

copiedUsers[0].name = "Ava";

console.log(users[0].name); // Ava
```

The array was copied, but the object inside was not deeply copied.

You will see this idea again when working with modern array patterns.

## Sparse Arrays and Empty Slots

You may sometimes see arrays with empty slots.

```js
const numbers = [];

numbers[3] = 10;

console.log(numbers); // [empty x 3, 10]
console.log(numbers.length); // 4
```

This creates an array with empty slots before index `3`.

Avoid creating sparse arrays on purpose as a beginner.

They can behave differently from arrays filled with actual `undefined` values.

Prefer adding items with methods like `push()`.

## Practical Example: Todo List

Here is a small example using array basics:

```js
const todos = [];

todos.push("Learn array basics");
todos.push("Practice push and pop");
todos.push("Review reference types");

console.log(todos.length); // 3
console.log(todos[0]); // Learn array basics
console.log(todos[todos.length - 1]); // Review reference types

const completedTask = todos.pop();

console.log(completedTask); // Review reference types
console.log(todos); // ["Learn array basics", "Practice push and pop"]
```

This example creates an array, adds items, reads items, checks the length, and removes the last item.

These are the building blocks for more advanced array methods.

## Best Practices

Use array literals:

```js
const items = [];
const numbers = [1, 2, 3];
```

Avoid `new Array()` unless you have a specific reason:

```js
// Avoid this for normal arrays
const items = new Array(3);
```

Remember zero-based indexing:

```js
const firstItem = items[0];
```

Use `.length` for the number of elements:

```js
console.log(items.length);
```

Use `.length - 1` or `.at(-1)` for the last element:

```js
const lastItem = items[items.length - 1];
const alsoLastItem = items.at(-1);
```

Be careful when assigning arrays to new variables:

```js
const copy = original; // Not a real copy
```

Use spread syntax when you need a shallow copy:

```js
const copy = [...original];
```

## Common Mistakes

### Mistake 1: Forgetting That Indexing Starts at 0

```js
const fruits = ["Apple", "Banana", "Cherry"];

console.log(fruits[1]); // Banana
```

`fruits[1]` is the second element, not the first.

The first element is:

```js
fruits[0]
```

### Mistake 2: Using `.length` as the Last Index

```js
const fruits = ["Apple", "Banana", "Cherry"];

console.log(fruits[fruits.length]); // undefined
```

`fruits.length` is `3`.

The last index is `2`.

Correct:

```js
console.log(fruits[fruits.length - 1]); // Cherry
```

### Mistake 3: Expecting `const` to Prevent Mutation

```js
const numbers = [1, 2, 3];

numbers.push(4);

console.log(numbers); // [1, 2, 3, 4]
```

This is allowed.

`const` prevents reassignment, not mutation.

### Mistake 4: Thinking Assignment Copies an Array

```js
const original = [1, 2, 3];
const copy = original;

copy.push(4);

console.log(original); // [1, 2, 3, 4]
```

Both variables reference the same array.

Use spread syntax for a shallow copy:

```js
const copy = [...original];
```

### Mistake 5: Using `new Array(3)` Expecting `[3]`

```js
const numbers = new Array(3);

console.log(numbers); // [empty x 3]
```

Use an array literal instead:

```js
const numbers = [3];
```

## Quick Check

What does this log?

```js
const colors = ["Red", "Green", "Blue"];

console.log(colors[0]);
console.log(colors[colors.length - 1]);
```

It logs:

```text
Red
Blue
```

The first index is `0`.

The last index is `.length - 1`.

What does this log?

```js
const numbers = [1, 2, 3];
const other = numbers;

other.push(4);

console.log(numbers);
```

It logs:

```js
[1, 2, 3, 4]
```

Both variables point to the same array.

What does this log?

```js
const numbers = [1, 2, 3];
const copy = [...numbers];

copy.push(4);

console.log(numbers);
console.log(copy);
```

It logs:

```js
[1, 2, 3]
[1, 2, 3, 4]
```

The spread syntax created a new shallow array copy.

## Summary

Arrays store ordered collections of values.

- Create arrays with `[]`.
- Avoid `new Array()` for normal array creation.
- Arrays use zero-based indexing.
- Access elements with bracket notation like `array[0]`.
- `.length` tells you how many elements are in the array.
- The last index is `array.length - 1`.
- Arrays are mutable, even when declared with `const`.
- `push()` adds to the end.
- `pop()` removes from the end.
- Arrays are reference types, so assignment does not copy them.
- Use spread syntax like `[...array]` to create a shallow copy.
