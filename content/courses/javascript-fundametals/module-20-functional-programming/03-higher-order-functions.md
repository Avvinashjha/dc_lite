# Higher-Order Functions

A higher-order function is a function that works with other functions.

It can:

- accept a function as an argument
- return a function
- do both

JavaScript uses higher-order functions everywhere.

## Function as an Argument

```js
function repeat(times, action) {
  for (let index = 0; index < times; index++) {
    action(index);
  }
}

repeat(3, (index) => {
  console.log(`Run ${index}`);
});
```

`repeat` is a higher-order function because it accepts `action`.

## Returning a Function

```js
function createMultiplier(multiplier) {
  return function multiply(value) {
    return value * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

`createMultiplier` returns a new function.

This works because of closures.

The returned function remembers `multiplier`.

## Array Methods Are Higher-Order Functions

Many array methods accept callback functions.

```js
const numbers = [1, 2, 3, 4];

const doubled = numbers.map((number) => number * 2);
const even = numbers.filter((number) => number % 2 === 0);
const total = numbers.reduce((sum, number) => sum + number, 0);
```

`map`, `filter`, and `reduce` are higher-order functions.

They let you describe what should happen to each value.

## map()

Use `map()` to transform every item.

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const names = users.map((user) => user.name);

console.log(names); // ["Alice", "Bob"]
```

`map()` returns a new array with the same length.

## filter()

Use `filter()` to keep some items.

```js
const products = [
  { name: "Keyboard", inStock: true },
  { name: "Monitor", inStock: false },
  { name: "Mouse", inStock: true },
];

const availableProducts = products.filter((product) => product.inStock);

console.log(availableProducts);
```

`filter()` returns a new array.

The result may be shorter than the original.

## reduce()

Use `reduce()` to combine many values into one value.

```js
const numbers = [10, 20, 30];

const total = numbers.reduce((sum, number) => {
  return sum + number;
}, 0);

console.log(total); // 60
```

The second argument, `0`, is the initial value.

## forEach() vs map()

`forEach()` is for side effects.

```js
users.forEach((user) => {
  console.log(user.name);
});
```

`map()` is for transformations.

```js
const names = users.map((user) => user.name);
```

Do not use `map()` only to run side effects.

```js
users.map((user) => console.log(user.name)); // avoid
```

Use `forEach()` for that.

## Custom Higher-Order Function

```js
function withLogging(fn) {
  return function loggedFunction(...args) {
    console.log("Calling function with:", args);
    return fn(...args);
  };
}

function add(a, b) {
  return a + b;
}

const loggedAdd = withLogging(add);

console.log(loggedAdd(2, 3)); // 5
```

`withLogging` takes a function and returns a new function with extra behavior.

This pattern is common in middleware, decorators, event handling, and utility libraries.

## Best Practices

Use `map()` when you want a transformed array.

Use `filter()` when you want a subset.

Use `reduce()` when you want to combine values.

Use `forEach()` for side effects.

Name callback functions when the logic gets complex.

Keep callbacks small and readable.

## Common Mistakes

### Mistake 1: Forgetting to Return From map()

```js
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

Or:

```js
const doubled = numbers.map((number) => number * 2);
```

### Mistake 2: Using map() for Side Effects

```js
users.map((user) => console.log(user.name));
```

Use `forEach()` when you do not need the returned array.

### Mistake 3: Missing reduce Initial Value

```js
const total = numbers.reduce((sum, number) => sum + number);
```

This can work, but an explicit initial value is clearer and safer.

```js
const total = numbers.reduce((sum, number) => sum + number, 0);
```

## Summary

Higher-order functions work with other functions.

- They can accept functions as arguments.
- They can return functions.
- `map`, `filter`, `reduce`, and `forEach` are higher-order functions.
- Use the right array method for the job.
- Returned functions can remember values through closures.
