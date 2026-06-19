# call()

`call()` lets you run a function immediately with a specific `this` value.

```js
function greet() {
  return `Hello, ${this.name}`;
}

const user = {
  name: "Alice",
};

console.log(greet.call(user)); // Hello, Alice
```

The important part:

```js
greet.call(user)
```

This calls `greet` and sets `this` to `user` for that call.

## Basic Syntax

```js
functionName.call(thisValue, arg1, arg2, arg3);
```

The first argument is the value of `this`.

The remaining arguments are passed into the function normally.

## `call()` Runs Immediately

Unlike `bind()`, `call()` does not return a new function for later.

It runs the function now.

```js
function sayName() {
  console.log(this.name);
}

const user = {
  name: "Alice",
};

sayName.call(user); // Alice
```

The function runs immediately.

## `call()` With Arguments

```js
function introduce(role, city) {
  return `${this.name} is a ${role} from ${city}`;
}

const user = {
  name: "Alice",
};

const message = introduce.call(user, "developer", "Delhi");

console.log(message); // Alice is a developer from Delhi
```

Here:

- `this` is `user`
- `role` is `"developer"`
- `city` is `"Delhi"`

Arguments after the first one are passed one by one.

## Borrowing Methods

`call()` can let one object use a method from another object.

```js
const user = {
  name: "Alice",
  describe() {
    return `User: ${this.name}`;
  },
};

const admin = {
  name: "Ava",
};

console.log(user.describe.call(admin)); // User: Ava
```

The method belongs to `user`, but for this call, `this` is `admin`.

This is called method borrowing.

## Reusing Generic Functions

Instead of putting the same method on many objects, you can write one function and call it with different objects.

```js
function describeUser() {
  return `${this.name} has role ${this.role}`;
}

const alice = {
  name: "Alice",
  role: "admin",
};

const bob = {
  name: "Bob",
  role: "editor",
};

console.log(describeUser.call(alice)); // Alice has role admin
console.log(describeUser.call(bob)); // Bob has role editor
```

The same function works with different contexts.

## `call()` Does Not Permanently Bind

`call()` only affects one function call.

```js
function sayName() {
  console.log(this.name);
}

const alice = { name: "Alice" };
const ava = { name: "Ava" };

sayName.call(alice); // Alice
sayName.call(ava); // Ava
```

Each call can use a different `this`.

If you need a reusable function with fixed `this`, use `bind()`.

## `call()` vs Direct Method Call

These can produce the same result:

```js
const user = {
  name: "Alice",
  greet() {
    return `Hello, ${this.name}`;
  },
};

console.log(user.greet()); // Hello, Alice
console.log(user.greet.call(user)); // Hello, Alice
```

The direct method call is simpler.

Use `call()` when you need to choose or change the context explicitly.

## `call()` With `null` or `undefined`

If a function does not use `this`, you may see `null` as the first argument.

```js
function add(a, b) {
  return a + b;
}

console.log(add.call(null, 2, 3)); // 5
```

Here `this` does not matter.

The main reason to use `call()` here would be consistency or metaprogramming, not normal beginner code.

## `call()` and Arrow Functions

`call()` cannot change an arrow function's `this`.

```js
const user = {
  name: "Alice",
};

const greet = () => {
  console.log(this.name);
};

greet.call(user); // not Alice
```

Arrow functions use lexical `this`.

Use a regular function when you need `call()`.

## `call()` vs `bind()`

| Method | Calls immediately? | Returns new function? |
| --- | --- | --- |
| `call()` | Yes | No |
| `bind()` | No | Yes |

Example:

```js
greet.call(user); // runs now
```

```js
const boundGreet = greet.bind(user); // creates function
boundGreet(); // runs later
```

## Best Practices

Use `call()` when you want to run a function now with a chosen `this`.

```js
fn.call(context, arg1, arg2);
```

Use `bind()` when you need to save the function for later.

Do not use `call()` when a normal method call is clearer.

Use regular functions when you need `call()` to control `this`.

Remember that `call()` only affects one invocation.

## Common Mistakes

### Mistake 1: Thinking `call()` Returns a Bound Function

```js
const result = greet.call(user);
```

This stores the return value of `greet`, not a bound function.

If you need a bound function:

```js
const bound = greet.bind(user);
```

### Mistake 2: Passing Arguments as an Array

```js
introduce.call(user, ["developer", "Delhi"]);
```

This passes one array argument.

With `call`, pass arguments one by one:

```js
introduce.call(user, "developer", "Delhi");
```

Use `apply()` if your arguments are already in an array.

### Mistake 3: Using `call()` on an Arrow Function to Change `this`

```js
arrowFn.call(user);
```

This does not change the arrow function's lexical `this`.

## Quick Check

What does this log?

```js
function sayRole() {
  console.log(this.role);
}

const user = {
  role: "admin",
};

sayRole.call(user);
```

It logs:

```text
admin
```

Does `call()` run the function immediately?

Yes.

## Summary

`call()` runs a function immediately with a chosen `this`.

- The first argument to `call()` becomes `this`.
- Remaining arguments are passed one by one.
- `call()` is useful for method borrowing and explicit context.
- `call()` does not permanently bind a function.
- Use `bind()` when you need a function for later.
- Use `apply()` when arguments are already in an array.
- `call()` cannot change arrow function `this`.
