# bind()

`bind()` creates a new function with a fixed `this` value.

It does not call the function immediately.

It returns a new function that you can call later.

```js
function greet() {
  return `Hello, ${this.name}`;
}

const user = {
  name: "Alice",
};

const greetUser = greet.bind(user);

console.log(greetUser()); // Hello, Alice
```

The important part:

```js
greet.bind(user)
```

This creates a new version of `greet` where `this` is always `user`.

## Why Use `bind()`?

Use `bind()` when a function needs to keep a specific `this` value for later.

Common situations:

- passing methods as callbacks
- using timers
- event handlers
- creating reusable functions with preset context
- fixing lost `this`

## Basic Syntax

```js
const boundFunction = originalFunction.bind(thisValue);
```

Example:

```js
function sayName() {
  console.log(this.name);
}

const user = {
  name: "Alice",
};

const boundSayName = sayName.bind(user);

boundSayName(); // Alice
```

`thisValue` is the value you want `this` to be inside the function.

## `bind()` Does Not Call the Function

This is a common beginner mistake.

```js
function sayName() {
  console.log(this.name);
}

const user = {
  name: "Alice",
};

const bound = sayName.bind(user);
```

Nothing is logged yet.

`bind()` returns a new function.

You still need to call it:

```js
bound(); // Alice
```

## Fixing Lost Method Context

```js
const user = {
  name: "Alice",
  greet() {
    console.log(`Hello, ${this.name}`);
  },
};

const greet = user.greet;

greet(); // this is not user
```

Fix with `bind()`:

```js
const greet = user.greet.bind(user);

greet(); // Hello, Alice
```

Now `greet` is a new function with `this` locked to `user`.

## `bind()` With Timers

```js
const user = {
  name: "Alice",
  greet() {
    console.log(`Hello, ${this.name}`);
  },
};

setTimeout(user.greet.bind(user), 1000);
```

Without `bind`, `user.greet` would be passed as a plain callback and lose its context.

With `bind`, the callback keeps `user` as `this`.

## `bind()` With Arguments

`bind()` can also preset arguments.

```js
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);

console.log(double(5)); // 10
```

Here:

```js
multiply.bind(null, 2)
```

creates a new function where the first argument is always `2`.

This is called partial application.

`null` is used because `multiply` does not use `this`.

## Binding Methods Once

Sometimes you create a bound method once and reuse it.

```js
const counter = {
  count: 0,
  increment() {
    this.count += 1;
    console.log(this.count);
  },
};

const incrementCounter = counter.increment.bind(counter);

incrementCounter(); // 1
incrementCounter(); // 2
```

The bound function always uses `counter` as `this`.

## Bound Functions Stay Bound

Once a function is bound, you cannot easily change its `this` with another `bind`.

```js
function showName() {
  console.log(this.name);
}

const alice = { name: "Alice" };
const ava = { name: "Ava" };

const showAlice = showName.bind(alice);
const tryShowAva = showAlice.bind(ava);

tryShowAva(); // Alice
```

The first binding wins.

This is useful to know when debugging.

## `bind()` vs Wrapper Function

You can often solve the same problem with a wrapper function.

```js
setTimeout(() => user.greet(), 1000);
```

or with `bind`:

```js
setTimeout(user.greet.bind(user), 1000);
```

Both can work.

The wrapper is often more readable when the call is simple.

`bind` is useful when you need a reusable bound function.

## `bind()` and Arrow Functions

`bind()` does not change an arrow function's `this`.

```js
const user = {
  name: "Alice",
};

const greet = () => {
  console.log(this.name);
};

const boundGreet = greet.bind(user);

boundGreet(); // not Alice
```

Arrow functions use lexical `this`, so `bind()` cannot replace it.

Use regular functions or method syntax when you need binding.

## Best Practices

Use `bind()` when you need a function to keep its `this` value:

```js
const handler = user.greet.bind(user);
```

Remember that `bind()` returns a new function:

```js
const bound = fn.bind(context);
bound();
```

Use wrapper functions when they are clearer:

```js
setTimeout(() => user.greet(), 1000);
```

Do not use `bind()` to fix arrow functions.

Avoid repeatedly creating bound functions inside hot loops unless necessary.

## Common Mistakes

### Mistake 1: Forgetting to Call the Bound Function

```js
user.greet.bind(user); // creates a function, but does not call it
```

Correct:

```js
const greet = user.greet.bind(user);
greet();
```

### Mistake 2: Binding to the Wrong Object

```js
const greet = user.greet.bind(admin);
```

Now `this` is `admin`, not `user`.

That may be intentional, but it should not be accidental.

### Mistake 3: Trying to Bind an Arrow Function

```js
const fn = () => this.name;
const bound = fn.bind(user);
```

`bind()` cannot change an arrow function's lexical `this`.

## Quick Check

What does this log?

```js
function sayName() {
  console.log(this.name);
}

const user = {
  name: "Alice",
};

const bound = sayName.bind(user);

bound();
```

It logs:

```text
Alice
```

Does `bind()` call the function immediately?

No.

It returns a new function.

## Summary

`bind()` creates a new function with fixed `this`.

- `bind()` does not call the function immediately.
- It is useful when passing methods as callbacks.
- It can fix lost context.
- It can also preset arguments.
- Bound functions keep their original binding.
- `bind()` does not change arrow function `this`.
- Use `bind()` when you need a reusable function with a stable context.
