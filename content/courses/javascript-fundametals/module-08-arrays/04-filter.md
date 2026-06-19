# filter

In the previous lesson, you learned that `.map()` transforms every item in an array and returns a new array of the same length.

Now you will learn how to keep only some items.

That is what **`.filter()`** is for.

If `.map()` means:

```text
Transform every item.
```

Then `.filter()` means:

```text
Keep only the items that pass a condition.
```

## What Is `filter`?

`filter` is an array method that creates a new array containing only the elements that pass a test.

```js
const numbers = [1, 2, 3, 4, 5, 6];

const evens = numbers.filter((number) => {
  return number % 2 === 0;
});

console.log(evens); // [2, 4, 6]
console.log(numbers); // [1, 2, 3, 4, 5, 6]
```

The original array is unchanged.

The new array contains only the items where the callback returned `true`.

You can read `.filter()` like this:

```text
Look at each item.
Run a condition.
Keep the item if the condition passes.
Discard it if the condition fails.
```

## Basic Syntax

The syntax looks like this:

```js
const newArray = originalArray.filter(function (currentValue, index, array) {
  return condition;
});
```

The callback can receive three arguments:

| Argument | Meaning | Common? |
| --- | --- | --- |
| `currentValue` | The current element being processed | Yes |
| `index` | The index of the current element | Sometimes |
| `array` | The original array `filter` was called on | Rarely |

The most important rule is:

```text
Return true to keep the item.
Return false to remove the item.
```

Technically, the callback can return any truthy or falsy value.

But when learning, it is clearest to return an explicit boolean condition.

## Basic Example: Even Numbers

```js
const numbers = [1, 2, 3, 4, 5, 6];

const evens = numbers.filter((number) => {
  return number % 2 === 0;
});

console.log(evens); // [2, 4, 6]
```

The condition is:

```js
number % 2 === 0
```

This checks whether the number is even.

| Number | Condition result | Kept? |
| --- | --- | --- |
| `1` | `false` | No |
| `2` | `true` | Yes |
| `3` | `false` | No |
| `4` | `true` | Yes |
| `5` | `false` | No |
| `6` | `true` | Yes |

## Concise Arrow Function Syntax

When the condition is simple, you can use a concise arrow function.

```js
const numbers = [1, 2, 3, 4, 5, 6];

const evens = numbers.filter((number) => number % 2 === 0);

console.log(evens); // [2, 4, 6]
```

This:

```js
(number) => number % 2 === 0
```

is the short version of:

```js
(number) => {
  return number % 2 === 0;
}
```

Both are correct.

Use the longer version when the condition needs multiple lines.

## Filtering Strings

You can filter strings by length, contents, or any other condition.

```js
const names = ["Ava", "Noah", "Mira", "Li"];

const longNames = names.filter((name) => {
  return name.length >= 4;
});

console.log(longNames); // ["Noah", "Mira"]
```

Another example:

```js
const words = ["apple", "banana", "apricot", "cherry"];

const wordsStartingWithA = words.filter((word) => {
  return word.startsWith("a");
});

console.log(wordsStartingWithA); // ["apple", "apricot"]
```

## Filtering Objects by Property

Filtering arrays of objects is one of the most common real-world uses of `filter`.

```js
const products = [
  { name: "Laptop", price: 999, inStock: true },
  { name: "Mouse", price: 25, inStock: false },
  { name: "Keyboard", price: 75, inStock: true },
];

const availableProducts = products.filter((product) => {
  return product.inStock === true;
});

console.log(availableProducts);
```

Output:

```js
[
  { name: "Laptop", price: 999, inStock: true },
  { name: "Keyboard", price: 75, inStock: true }
]
```

Because `product.inStock` is already a boolean, you can write:

```js
const availableProducts = products.filter((product) => product.inStock);
```

This keeps products where `product.inStock` is truthy.

## Filtering by Multiple Conditions

You can combine conditions with logical operators.

```js
const products = [
  { name: "Laptop", price: 999, inStock: true },
  { name: "Mouse", price: 25, inStock: false },
  { name: "Keyboard", price: 75, inStock: true },
  { name: "Monitor", price: 250, inStock: true },
];

const affordableAvailableProducts = products.filter((product) => {
  return product.inStock && product.price < 300;
});

console.log(affordableAvailableProducts);
```

This keeps products that are:

- in stock
- cheaper than `300`

Output:

```js
[
  { name: "Keyboard", price: 75, inStock: true },
  { name: "Monitor", price: 250, inStock: true }
]
```

## Filtering by Index

The second callback argument is the index.

```js
const letters = ["a", "b", "c", "d", "e"];

const evenIndexLetters = letters.filter((letter, index) => {
  return index % 2 === 0;
});

console.log(evenIndexLetters); // ["a", "c", "e"]
```

The values at indexes `0`, `2`, and `4` are kept.

You do not need the first argument in this example, but it is still passed by JavaScript.

Some developers write `_` when they do not use a parameter:

```js
const evenIndexLetters = letters.filter((_, index) => index % 2 === 0);
```

The `_` is just a normal parameter name.

It signals that the value is intentionally unused.

## Removing Falsy Values

Because `filter` uses truthy and falsy results, you can remove falsy values.

```js
const messyArray = ["Apple", null, "Banana", undefined, "", "Cherry", 0];

const cleanArray = messyArray.filter((item) => item);

console.log(cleanArray); // ["Apple", "Banana", "Cherry"]
```

This works because the callback returns each item itself.

Truthy values are kept.

Falsy values are removed.

The removed falsy values include:

- `null`
- `undefined`
- `""`
- `0`

## Be Careful Removing Falsy Values

Filtering with `(item) => item` can be useful, but it can also remove values you meant to keep.

```js
const scores = [0, 10, 20, null, 30];

const cleaned = scores.filter((score) => score);

console.log(cleaned); // [10, 20, 30]
```

The score `0` was removed.

If `0` is a valid value, this is a bug.

Be more specific:

```js
const cleaned = scores.filter((score) => score !== null);

console.log(cleaned); // [0, 10, 20, 30]
```

Or remove both `null` and `undefined`:

```js
const cleaned = scores.filter((score) => score != null);

console.log(cleaned); // [0, 10, 20, 30]
```

This uses the intentional `value == null` pattern you learned earlier.

It matches both `null` and `undefined`.

## Removing Specific Values

You can use `filter` to remove a specific item.

```js
const users = ["Alice", "Bob", "Charlie"];

const withoutBob = users.filter((user) => {
  return user !== "Bob";
});

console.log(withoutBob); // ["Alice", "Charlie"]
```

This is common when removing an item from a list without mutating the original array.

For example:

```js
const tasks = [
  { id: 1, text: "Learn arrays" },
  { id: 2, text: "Practice filter" },
  { id: 3, text: "Review map" },
];

const remainingTasks = tasks.filter((task) => {
  return task.id !== 2;
});

console.log(remainingTasks);
```

The task with `id: 2` is removed from the new array.

The original `tasks` array is not changed.

## `filter` Does Not Mutate the Original Array

Like `map`, `filter` returns a new array.

It does not change the original array by itself.

```js
const numbers = [1, 2, 3, 4];

const greaterThanTwo = numbers.filter((number) => {
  return number > 2;
});

console.log(greaterThanTwo); // [3, 4]
console.log(numbers); // [1, 2, 3, 4]
```

This makes `filter` useful when you want to create a smaller array safely.

## `filter` Can Return an Empty Array

If no items pass the condition, `filter` returns an empty array.

```js
const numbers = [1, 2, 3];

const largeNumbers = numbers.filter((number) => {
  return number > 100;
});

console.log(largeNumbers); // []
```

This is not an error.

It means no elements matched.

## `filter` Keeps Original Elements

`filter` does not transform items.

It keeps or removes the original elements.

```js
const numbers = [1, 2, 3];

const result = numbers.filter((number) => {
  return number * 2;
});

console.log(result); // [1, 2, 3]
```

Why does this keep everything?

The callback returns:

- `2`
- `4`
- `6`

All of those are truthy.

So every item is kept.

If you want doubled values, use `map`:

```js
const doubled = numbers.map((number) => number * 2);

console.log(doubled); // [2, 4, 6]
```

If you want only numbers greater than `1`, use a boolean condition:

```js
const greaterThanOne = numbers.filter((number) => number > 1);

console.log(greaterThanOne); // [2, 3]
```

## Chaining `filter` and `map`

Because `filter` and `map` both return new arrays, you can chain them.

```js
const users = [
  { name: "Alice", age: 25, role: "admin" },
  { name: "Bob", age: 17, role: "user" },
  { name: "Charlie", age: 30, role: "user" },
];

const adultUserNames = users
  .filter((user) => {
    return user.age >= 18;
  })
  .map((user) => {
    return user.name;
  });

console.log(adultUserNames); // ["Alice", "Charlie"]
```

Step by step:

1. `filter` keeps only adult users.
2. `map` transforms those users into their names.

With concise arrows:

```js
const adultUserNames = users
  .filter((user) => user.age >= 18)
  .map((user) => user.name);
```

This reads like a data pipeline.

## `filter` vs `map`

Use `filter` to keep or remove items.

Use `map` to transform items.

| Feature | `filter` | `map` |
| --- | --- | --- |
| Main purpose | Select matching items | Transform every item |
| Callback returns | Boolean or truthy/falsy value | New value |
| New array length | Same or shorter | Always same length |
| Changes values? | No, keeps original elements | Yes, returns transformed values |

Example with `filter`:

```js
const numbers = [1, 2, 3];

const greaterThanOne = numbers.filter((number) => number > 1);

console.log(greaterThanOne); // [2, 3]
```

Example with `map`:

```js
const doubled = numbers.map((number) => number * 2);

console.log(doubled); // [2, 4, 6]
```

## `filter` vs `find`

You will learn `find` later in this module.

For now, know this:

- `filter` returns all matching items in an array
- `find` returns the first matching item

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const matchingUsers = users.filter((user) => user.id > 1);

console.log(matchingUsers);
```

This returns an array:

```js
[
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
]
```

If you only need one item, `find` may be better.

## Best Practices

Use `filter` when you want a subset:

```js
const activeUsers = users.filter((user) => user.isActive);
```

Return clear boolean conditions:

```js
const expensiveProducts = products.filter((product) => product.price > 100);
```

Be careful with truthy/falsy filtering:

```js
const cleaned = values.filter((value) => value != null);
```

Chain `filter` and `map` when it improves readability:

```js
const activeUserNames = users
  .filter((user) => user.isActive)
  .map((user) => user.name);
```

Use `filter` to remove items immutably:

```js
const remainingTasks = tasks.filter((task) => task.id !== completedTaskId);
```

## Common Mistakes

### Mistake 1: Returning the Item Instead of a Condition

```js
const numbers = [1, 2, 3];

const result = numbers.filter((number) => number);

console.log(result); // [1, 2, 3]
```

This keeps all numbers because they are all truthy.

If you want numbers greater than `1`, write the condition:

```js
const result = numbers.filter((number) => number > 1);

console.log(result); // [2, 3]
```

### Mistake 2: Forgetting `return`

```js
const numbers = [1, 2, 3];

const result = numbers.filter((number) => {
  number > 1;
});

console.log(result); // []
```

With braces, arrow functions need an explicit `return`.

Correct:

```js
const result = numbers.filter((number) => {
  return number > 1;
});
```

Or:

```js
const result = numbers.filter((number) => number > 1);
```

### Mistake 3: Expecting `filter` to Transform Values

```js
const numbers = [1, 2, 3];

const result = numbers.filter((number) => number * 2);

console.log(result); // [1, 2, 3]
```

`filter` keeps or removes original items.

It does not transform them.

Use `map` for transformations:

```js
const result = numbers.map((number) => number * 2);

console.log(result); // [2, 4, 6]
```

### Mistake 4: Accidentally Removing Valid Falsy Values

```js
const scores = [0, 10, 20, null];

const cleaned = scores.filter((score) => score);

console.log(cleaned); // [10, 20]
```

The valid score `0` was removed.

Be specific:

```js
const cleaned = scores.filter((score) => score !== null);

console.log(cleaned); // [0, 10, 20]
```

## Quick Check

What does this return?

```js
const numbers = [1, 2, 3, 4];

const result = numbers.filter((number) => number > 2);
```

It returns:

```js
[3, 4]
```

What does this return?

```js
const numbers = [1, 2, 3];

const result = numbers.filter((number) => {
  number > 1;
});
```

It returns:

```js
[]
```

The callback does not return the condition.

What should you use if you want `[2, 4, 6]` from `[1, 2, 3]`?

Use `map`, not `filter`:

```js
const doubled = numbers.map((number) => number * 2);
```

## Summary

`filter` creates a new array containing only the items that pass a condition.

- Use `filter` when you want a subset of an array.
- The original array is not changed.
- Return `true` or a truthy value to keep an item.
- Return `false` or a falsy value to remove an item.
- `filter` can return an empty array.
- `filter` keeps original items; it does not transform them.
- Use `map` for transformations.
- Chain `filter` and `map` when you need to select and transform data.
- Be careful with truthy/falsy filtering when values like `0` or `""` are valid.
