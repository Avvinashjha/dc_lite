# Pure Functions

Functional programming is a style of writing code with functions as the main building blocks.

One of its most important ideas is the pure function.

A pure function is a function that:

1. Returns the same output for the same input.
2. Does not cause side effects.

## Same Input, Same Output

This is pure:

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // 5
console.log(add(2, 3)); // 5
```

The result depends only on `a` and `b`.

It does not depend on hidden state, time, random values, user input, or external data.

## Impure Function Example

```js
let taxRate = 0.1;

function calculateTotal(price) {
  return price + price * taxRate;
}
```

This function depends on `taxRate`, which lives outside the function.

```js
console.log(calculateTotal(100)); // 110

taxRate = 0.2;

console.log(calculateTotal(100)); // 120
```

Same input, different output.

That makes it impure.

## Making It Pure

Pass needed values as arguments.

```js
function calculateTotal(price, taxRate) {
  return price + price * taxRate;
}

console.log(calculateTotal(100, 0.1)); // 110
console.log(calculateTotal(100, 0.1)); // 110
```

Now the function's result is fully explained by its inputs.

## What Is a Side Effect?

A side effect is anything a function does beyond returning a value.

Examples:

- changing a global variable
- modifying an argument object or array
- logging to the console
- writing to a database
- making an API request
- changing the DOM
- reading the current time
- generating a random number

Not all side effects are bad.

Programs need side effects to be useful.

Functional programming encourages you to keep side effects controlled and easy to find.

## Side Effect Example

```js
const cart = [];

function addToCart(item) {
  cart.push(item);
}

addToCart("Book");
console.log(cart); // ["Book"]
```

`addToCart` changes a variable outside itself.

That makes it impure.

## Pure Version

```js
function addToCart(cart, item) {
  return [...cart, item];
}

const cart = [];
const updatedCart = addToCart(cart, "Book");

console.log(cart); // []
console.log(updatedCart); // ["Book"]
```

The pure version returns a new array instead of changing the original.

## Why Pure Functions Are Useful

Pure functions are easier to:

- understand
- test
- reuse
- debug
- combine with other functions

Because they do not hide behavior, you can reason about them locally.

## Testing Pure Functions

A pure function is simple to test.

```js
function formatName(user) {
  return `${user.firstName} ${user.lastName}`;
}

console.log(formatName({ firstName: "Ada", lastName: "Lovelace" }));
// "Ada Lovelace"
```

You only need input and expected output.

No database.

No DOM.

No random setup.

## Pure Functions With Objects

Pure functions should not mutate object inputs.

Impure:

```js
function markComplete(todo) {
  todo.completed = true;
  return todo;
}
```

Pure:

```js
function markComplete(todo) {
  return {
    ...todo,
    completed: true,
  };
}
```

The pure version creates a new object.

## Pure and Impure Code Together

Real applications need both.

Example:

```js
function getDiscountedPrice(price, discountPercent) {
  return price - price * discountPercent;
}

async function showPrice(productId) {
  const response = await fetch(`/api/products/${productId}`);
  const product = await response.json();

  const finalPrice = getDiscountedPrice(product.price, 0.2);
  console.log(finalPrice);
}
```

`getDiscountedPrice` is pure.

`showPrice` is impure because it fetches data and logs output.

This is normal.

Keep core logic pure when possible, and put side effects near the edges of your program.

## Best Practices

Pass dependencies as arguments.

Return new values instead of mutating inputs.

Keep calculations separate from side effects.

Use pure functions for business logic and transformations.

Allow side effects where they are necessary, such as API calls and UI updates.

## Common Mistakes

### Mistake 1: Mutating Arguments

```js
function addRole(user) {
  user.role = "admin";
  return user;
}
```

This changes the original object.

Prefer:

```js
function addRole(user) {
  return {
    ...user,
    role: "admin",
  };
}
```

### Mistake 2: Depending on Hidden State

```js
let multiplier = 2;

function multiply(value) {
  return value * multiplier;
}
```

Prefer:

```js
function multiply(value, multiplier) {
  return value * multiplier;
}
```

### Mistake 3: Thinking All Side Effects Are Bad

Side effects are necessary.

The goal is to make them intentional and easy to locate.

## Summary

Pure functions are predictable functions.

- Same inputs produce the same output.
- Pure functions do not cause side effects.
- Mutating arguments makes a function impure.
- Pure functions are easier to test and reuse.
- Real programs still need side effects, but they should be controlled.
