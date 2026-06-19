# Currying

Currying is a technique where a function with multiple arguments is transformed into a series of functions that each take one argument.

Regular function:

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // 5
```

Curried function:

```js
function add(a) {
  return function addB(b) {
    return a + b;
  };
}

console.log(add(2)(3)); // 5
```

`add(2)` returns a new function.

That returned function receives `3`.

## Arrow Function Version

Currying is often written with arrow functions.

```js
const add = (a) => (b) => a + b;

console.log(add(2)(3)); // 5
```

This is compact, but it can be harder for beginners to read at first.

Expanded version:

```js
const add = (a) => {
  return (b) => {
    return a + b;
  };
};
```

## Partial Application

Currying lets you create specialized functions.

```js
const multiply = (a) => (b) => a * b;

const double = multiply(2);
const triple = multiply(3);

console.log(double(10)); // 20
console.log(triple(10)); // 30
```

`double` remembers `2`.

`triple` remembers `3`.

This works because of closures.

## Practical Example: Formatting

```js
const formatCurrency = (currency) => (amount) => {
  return `${currency}${amount.toFixed(2)}`;
};

const formatDollars = formatCurrency("$");
const formatRupees = formatCurrency("Rs. ");

console.log(formatDollars(10)); // $10.00
console.log(formatRupees(10)); // Rs. 10.00
```

The first function chooses the currency.

The returned function formats amounts.

## Practical Example: Filtering

```js
const hasRole = (role) => (user) => user.role === role;

const users = [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Carol", role: "admin" },
];

const admins = users.filter(hasRole("admin"));

console.log(admins);
```

`hasRole("admin")` returns a predicate function.

That predicate is passed to `filter()`.

## Currying vs Normal Functions

Normal function:

```js
const hasRole = (user, role) => user.role === role;

const admins = users.filter((user) => hasRole(user, "admin"));
```

Curried function:

```js
const hasRole = (role) => (user) => user.role === role;

const admins = users.filter(hasRole("admin"));
```

Currying can reduce repeated wrapper functions.

But it is not always necessary.

## When Currying Helps

Currying is useful when you want to:

- create specialized functions
- reuse partially configured behavior
- compose functions
- pass configured callbacks to array methods
- avoid repeating the same argument

## When Currying Can Hurt

Currying can make code harder to read if overused.

This is especially true when functions become deeply nested.

```js
const result = a(1)(2)(3)(4);
```

If the team is not comfortable with that style, a normal function may be clearer.

## Best Practices

Use currying when it improves reuse or readability.

Prefer clear names for partially applied functions.

Avoid deeply nested curried calls in beginner code.

Do not curry every function automatically.

Use currying with array methods when it makes callbacks cleaner.

## Common Mistakes

### Mistake 1: Forgetting the Second Call

```js
const add = (a) => (b) => a + b;

console.log(add(2)); // function
```

You need:

```js
console.log(add(2)(3)); // 5
```

Or store the returned function:

```js
const addTwo = add(2);
console.log(addTwo(3)); // 5
```

### Mistake 2: Using Currying Where a Normal Function Is Clearer

Currying is a tool, not a requirement.

Use it when it helps.

### Mistake 3: Losing Readability With Short Names

```js
const f = (a) => (b) => (c) => a + b + c;
```

Prefer descriptive names when teaching or working in teams.

## Summary

Currying turns a multi-argument function into a chain of single-argument functions.

- `add(2, 3)` becomes `add(2)(3)`.
- Curried functions can create specialized functions.
- Closures let returned functions remember earlier arguments.
- Currying works well with array methods and composition.
- Use currying when it improves clarity, not just because it is possible.
