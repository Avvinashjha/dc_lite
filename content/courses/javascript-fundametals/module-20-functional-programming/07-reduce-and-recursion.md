# Reduce and Recursion

Functional programming often uses patterns that transform data without changing it.

Two important patterns are:

- `reduce()`
- recursion

You do not need to use them everywhere.

But you should understand what they are and when they help.

## reduce() Review

`reduce()` combines an array into a single result.

```js
const numbers = [1, 2, 3, 4];

const total = numbers.reduce((sum, number) => {
  return sum + number;
}, 0);

console.log(total); // 10
```

The callback receives:

```js
(accumulator, currentItem) => nextAccumulator
```

The initial value is `0`.

## Building an Object With reduce()

`reduce()` can build objects.

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const usersById = users.reduce((lookup, user) => {
  return {
    ...lookup,
    [user.id]: user,
  };
}, {});

console.log(usersById);
```

Result:

```js
{
  1: { id: 1, name: "Alice" },
  2: { id: 2, name: "Bob" }
}
```

This returns a new object at each step.

## Grouping With reduce()

```js
const products = [
  { name: "Keyboard", category: "electronics" },
  { name: "Book", category: "books" },
  { name: "Mouse", category: "electronics" },
];

const grouped = products.reduce((groups, product) => {
  const existingGroup = groups[product.category] ?? [];

  return {
    ...groups,
    [product.category]: [...existingGroup, product],
  };
}, {});

console.log(grouped);
```

This groups products by category without mutating the original array.

## When reduce() Is a Good Fit

Use `reduce()` when you are building one result from many values.

Good examples:

- totals
- averages
- lookup objects
- grouped data
- derived summaries

If `map()` or `filter()` directly expresses the intent, use them instead.

## When reduce() Is Too Clever

This is valid:

```js
const doubled = numbers.reduce((result, number) => {
  return [...result, number * 2];
}, []);
```

But this is clearer:

```js
const doubled = numbers.map((number) => number * 2);
```

Choose the method that communicates intent.

## What Is Recursion?

Recursion is when a function calls itself.

```js
function countDown(number) {
  if (number <= 0) {
    return;
  }

  console.log(number);
  countDown(number - 1);
}

countDown(3);
```

Output:

```text
3
2
1
```

## Base Case

Every recursive function needs a base case.

The base case stops the recursion.

```js
function factorial(number) {
  if (number === 0) {
    return 1;
  }

  return number * factorial(number - 1);
}

console.log(factorial(5)); // 120
```

Base case:

```js
if (number === 0) {
  return 1;
}
```

Without a base case, recursion can continue until the call stack overflows.

## Recursion With Nested Data

Recursion is useful for tree-like data.

```js
const comments = [
  {
    id: 1,
    text: "First",
    replies: [
      {
        id: 2,
        text: "Reply",
        replies: [],
      },
    ],
  },
];
```

Count all comments:

```js
function countComments(comments) {
  return comments.reduce((total, comment) => {
    return total + 1 + countComments(comment.replies);
  }, 0);
}

console.log(countComments(comments)); // 2
```

Each comment can contain more comments.

That makes recursion a natural fit.

## Recursion vs Loops

Loops are often simpler for linear data.

```js
for (const item of items) {
  console.log(item);
}
```

Recursion often fits nested structures.

Examples:

- folders inside folders
- comments with replies
- menus with submenus
- organization charts
- abstract syntax trees

## Best Practices

Use `reduce()` for combining arrays into one result.

Prefer `map()` or `filter()` when they express the task more clearly.

Always include a base case in recursive functions.

Use recursion for nested or tree-like data.

Avoid very deep recursion when stack overflow is possible.

Prioritize readability.

## Common Mistakes

### Mistake 1: Missing reduce Initial Value

```js
const total = numbers.reduce((sum, number) => sum + number);
```

This can fail on empty arrays.

Prefer:

```js
const total = numbers.reduce((sum, number) => sum + number, 0);
```

### Mistake 2: Using reduce() for Everything

If `map()`, `filter()`, or `find()` is clearer, use that.

### Mistake 3: Forgetting the Recursive Base Case

```js
function countDown(number) {
  console.log(number);
  countDown(number - 1);
}
```

This never stops.

Add a base case.

## Summary

`reduce()` and recursion are useful functional patterns.

- `reduce()` combines many values into one result.
- Always consider an initial value for `reduce()`.
- Recursion means a function calls itself.
- Recursive functions need a base case.
- Recursion is useful for nested data.
- Use the clearest tool for the problem.
