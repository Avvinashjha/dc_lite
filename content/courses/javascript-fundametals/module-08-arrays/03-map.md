# map

In the previous lesson, you learned that `.forEach()` is useful when you want to do something with every item in an array.

For example:

```js
const numbers = [1, 2, 3];

numbers.forEach((number) => {
  console.log(number * 2);
});
```

This logs doubled values, but it does not create a new array.

When you want to **transform** every item and get a new array back, use **`.map()`**.

## What Is `map`?

`map` is an array method that creates a new array by transforming each element in the original array.

```js
const numbers = [1, 2, 3, 4];

const doubled = numbers.map((number) => {
  return number * 2;
});

console.log(doubled); // [2, 4, 6, 8]
console.log(numbers); // [1, 2, 3, 4]
```

The original array is unchanged.

The new array contains the values returned by the callback.

You can read `.map()` like this:

```text
Take each item.
Transform it.
Put the transformed value into a new array.
```

## Basic Syntax

The syntax looks like this:

```js
const newArray = originalArray.map(function (currentValue, index, array) {
  return transformedValue;
});
```

The callback can receive three arguments:

| Argument | Meaning | Common? |
| --- | --- | --- |
| `currentValue` | The current element being processed | Yes |
| `index` | The index of the current element | Sometimes |
| `array` | The original array `map` was called on | Rarely |

The most important rule is:

```text
The callback must return the value you want in the new array.
```

## Basic Example: Doubling Numbers

```js
const numbers = [1, 2, 3, 4];

const doubled = numbers.map((number) => {
  return number * 2;
});

console.log(doubled); // [2, 4, 6, 8]
```

Each callback return value becomes one element in the new array.

| Original value | Callback returns | New array value |
| --- | --- | --- |
| `1` | `2` | `2` |
| `2` | `4` | `4` |
| `3` | `6` | `6` |
| `4` | `8` | `8` |

The new array has the same length as the original array.

```js
console.log(numbers.length); // 4
console.log(doubled.length); // 4
```

## Concise Arrow Function Syntax

When the callback only returns one expression, you can use a concise arrow function.

```js
const numbers = [1, 2, 3, 4];

const doubled = numbers.map((number) => number * 2);

console.log(doubled); // [2, 4, 6, 8]
```

This:

```js
(number) => number * 2
```

is the short version of:

```js
(number) => {
  return number * 2;
}
```

Both are correct.

Use the longer version when the transformation needs multiple lines.

Use the concise version when the transformation is simple.

## `map` Does Not Mutate the Original Array

`map` returns a new array.

It does not change the original array by itself.

```js
const prices = [10, 20, 30];

const discounted = prices.map((price) => {
  return price * 0.9;
});

console.log(prices); // [10, 20, 30]
console.log(discounted); // [9, 18, 27]
```

This is one reason `map` is so useful.

It lets you create transformed data without damaging the original data.

## Transforming Strings

`map` can transform strings too.

```js
const names = ["ava", "noah", "mira"];

const upperNames = names.map((name) => {
  return name.toUpperCase();
});

console.log(upperNames); // ["AVA", "NOAH", "MIRA"]
```

The original array is unchanged:

```js
console.log(names); // ["ava", "noah", "mira"]
```

## Extracting Object Properties

One of the most common uses of `map` is extracting one property from each object.

```js
const users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" },
  { id: 3, name: "Charlie", role: "user" },
];

const userNames = users.map((user) => {
  return user.name;
});

console.log(userNames); // ["Alice", "Bob", "Charlie"]
```

Shorter version:

```js
const userNames = users.map((user) => user.name);
```

This is common when working with API data.

You may receive a large array of objects, but only need one field from each object.

## Transforming Objects

You can also use `map` to create a new array of modified objects.

```js
const products = [
  { name: "Keyboard", price: 50 },
  { name: "Mouse", price: 25 },
  { name: "Monitor", price: 200 },
];

const productsWithTax = products.map((product) => {
  return {
    name: product.name,
    price: product.price,
    priceWithTax: product.price * 1.08,
  };
});

console.log(productsWithTax);
```

Each original product becomes a new object in the returned array.

You can also use object spread to keep existing properties:

```js
const productsWithTax = products.map((product) => {
  return {
    ...product,
    priceWithTax: product.price * 1.08,
  };
});
```

This creates new objects.

It does not mutate the original objects directly.

## Returning Object Literals With Arrow Functions

There is one syntax detail to know.

If you want to implicitly return an object literal from an arrow function, wrap the object in parentheses.

```js
const users = ["Alice", "Bob"];

const userObjects = users.map((name) => ({
  name,
  active: true,
}));

console.log(userObjects);
```

Without parentheses, JavaScript may treat `{}` as the function body instead of an object.

This is wrong:

```js
const userObjects = users.map((name) => {
  name,
  active: true,
});
```

Use either an explicit `return`:

```js
const userObjects = users.map((name) => {
  return {
    name,
    active: true,
  };
});
```

Or an implicit return with parentheses:

```js
const userObjects = users.map((name) => ({
  name,
  active: true,
}));
```

## Using the Index

The second callback argument is the index.

```js
const tasks = ["Install dependencies", "Run tests", "Deploy"];

const numberedTasks = tasks.map((task, index) => {
  return `${index + 1}. ${task}`;
});

console.log(numberedTasks);
```

Output:

```js
[
  "1. Install dependencies",
  "2. Run tests",
  "3. Deploy"
]
```

The index starts at `0`, so `index + 1` gives a human-friendly number.

## Changing Data Types

`map` can convert values from one type to another.

```js
const stringNumbers = ["10", "20", "30"];

const numbers = stringNumbers.map((value) => {
  return Number(value);
});

console.log(numbers); // [10, 20, 30]
```

Shorter version:

```js
const numbers = stringNumbers.map(Number);
```

This works because `Number` is a function.

`map` calls it for each item.

## Be Careful With `parseInt`

You might think this works:

```js
const values = ["10", "20", "30"];

const numbers = values.map(parseInt);

console.log(numbers);
```

But this can produce surprising results.

Why?

`map` passes more than one argument to the callback:

```js
currentValue, index, array
```

`parseInt` accepts a second argument called the radix.

So the index gets passed as the radix.

Use this instead:

```js
const numbers = values.map((value) => parseInt(value, 10));

console.log(numbers); // [10, 20, 30]
```

Or use `Number` when simple conversion is enough:

```js
const numbers = values.map(Number);
```

## Generating UI Data

In frontend development, `map` is often used to generate UI elements from data.

Here is a simple HTML string example:

```js
const items = ["Milk", "Eggs", "Bread"];

const htmlItems = items.map((item) => {
  return `<li>${item}</li>`;
});

console.log(htmlItems);
```

Output:

```js
["<li>Milk</li>", "<li>Eggs</li>", "<li>Bread</li>"]
```

You can join them into one string:

```js
const html = htmlItems.join("");

console.log(html); // <li>Milk</li><li>Eggs</li><li>Bread</li>
```

Frameworks like React use this same idea to render lists from arrays of data.

## Forgetting to Return

This is the classic `map` mistake.

```js
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => {
  number * 2;
});

console.log(doubled); // [undefined, undefined, undefined]
```

The callback uses curly braces, but it does not return anything.

So each callback call returns `undefined`.

`map` builds a new array from those returned values.

Correct version:

```js
const doubled = numbers.map((number) => {
  return number * 2;
});
```

Or:

```js
const doubled = numbers.map((number) => number * 2);
```

## `map` Always Returns the Same Length

`map` returns a new array with the same number of elements as the original.

```js
const numbers = [1, 2, 3];

const result = numbers.map((number) => {
  if (number > 1) {
    return number;
  }
});

console.log(result); // [undefined, 2, 3]
```

The first item did not return a value, so it became `undefined`.

`map` did not remove it.

If you want to remove items, use `filter`.

```js
const result = numbers.filter((number) => {
  return number > 1;
});

console.log(result); // [2, 3]
```

You will learn `filter` in the next lesson.

## `map` vs `forEach`

`forEach` is for doing side effects.

`map` is for transforming data into a new array.

| Feature | `forEach` | `map` |
| --- | --- | --- |
| Main purpose | Run side effects | Transform each item |
| Return value | `undefined` | A new array |
| Callback return needed? | No | Yes |
| New array length | No new array | Same length as original |
| Best for | Logging, DOM updates, external actions | Creating transformed arrays |

Example with `forEach`:

```js
const numbers = [1, 2, 3];

numbers.forEach((number) => {
  console.log(number * 2);
});
```

Example with `map`:

```js
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => {
  return number * 2;
});

console.log(doubled); // [2, 4, 6]
```

If you need the transformed values later, use `map`.

## `map` and Mutation

`map` itself returns a new array and does not mutate the original array.

But you can still write a callback that mutates objects inside the array.

```js
const users = [
  { name: "Alice", active: false },
  { name: "Bob", active: false },
];

const result = users.map((user) => {
  user.active = true;
  return user;
});

console.log(users[0].active); // true
```

This mutates the original objects because objects are reference values.

A safer approach is to return new objects:

```js
const result = users.map((user) => {
  return {
    ...user,
    active: true,
  };
});

console.log(users[0].active); // false
console.log(result[0].active); // true
```

This pattern is common in modern JavaScript.

## Best Practices

Use `map` when you want a new array:

```js
const doubled = numbers.map((number) => number * 2);
```

Always return a value from the callback:

```js
const names = users.map((user) => {
  return user.name;
});
```

Use concise arrow functions for simple transformations:

```js
const names = users.map((user) => user.name);
```

Use explicit returns for multi-line transformations:

```js
const summaries = users.map((user) => {
  const label = `${user.name} (${user.role})`;

  return label;
});
```

Avoid mutating objects inside `map` unless that is truly intended:

```js
const updatedUsers = users.map((user) => ({
  ...user,
  active: true,
}));
```

Use `filter` if your goal is to remove items:

```js
const adults = users.filter((user) => user.age >= 18);
```

## Common Mistakes

### Mistake 1: Forgetting `return`

```js
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => {
  number * 2;
});

console.log(doubled); // [undefined, undefined, undefined]
```

Correct:

```js
const doubled = numbers.map((number) => {
  return number * 2;
});
```

### Mistake 2: Using `map` for Side Effects Only

```js
const names = ["Ava", "Noah"];

names.map((name) => {
  console.log(name);
});
```

This creates a new array that you ignore.

Use `forEach` for side effects:

```js
names.forEach((name) => {
  console.log(name);
});
```

### Mistake 3: Expecting `map` to Filter Items

```js
const numbers = [1, 2, 3];

const result = numbers.map((number) => {
  if (number > 1) {
    return number;
  }
});

console.log(result); // [undefined, 2, 3]
```

Use `filter` to remove items:

```js
const result = numbers.filter((number) => number > 1);

console.log(result); // [2, 3]
```

### Mistake 4: Accidentally Returning an Object Incorrectly

```js
const names = ["Ava", "Noah"];

const users = names.map((name) => {
  name: name;
});

console.log(users); // [undefined, undefined]
```

Use parentheses for an implicit object return:

```js
const users = names.map((name) => ({
  name: name,
}));
```

Or use an explicit return:

```js
const users = names.map((name) => {
  return {
    name: name,
  };
});
```

## Quick Check

What does this return?

```js
const numbers = [2, 4, 6];

const result = numbers.map((number) => number + 1);
```

It returns:

```js
[3, 5, 7]
```

What does this return?

```js
const numbers = [1, 2, 3];

const result = numbers.map((number) => {
  number * 2;
});
```

It returns:

```js
[undefined, undefined, undefined]
```

The callback does not explicitly return a value.

What should you use if you want to remove items from an array?

Use `filter`, not `map`.

```js
const numbers = [1, 2, 3];

const greaterThanOne = numbers.filter((number) => number > 1);

console.log(greaterThanOne); // [2, 3]
```

## Summary

`map` transforms every element in an array and returns a new array.

- Use `map` when you want a transformed array.
- The original array is not changed by `map` itself.
- The callback receives `currentValue`, `index`, and the original array.
- The callback's return value becomes the new array element.
- The new array has the same length as the original.
- Forgetting `return` gives you `undefined` values.
- Use `forEach` for side effects.
- Use `filter` when you want to remove items.
- Be careful not to mutate objects inside `map` unless you intend to.
