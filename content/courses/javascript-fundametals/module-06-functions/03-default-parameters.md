# Default Parameters

In the previous lesson, you saw that missing arguments become `undefined`.

For example:

```js
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet()); // Hello, undefined!
```

That output is usually not what you want.

In real programs, functions often need a fallback value when an argument is not provided.

JavaScript gives you a clean way to do this with **default parameters**.

## The Problem Default Parameters Solve

Imagine you are writing a greeting function:

```js
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("Alice")); // Hello, Alice!
console.log(greet()); // Hello, undefined!
```

The first call works because `"Alice"` is passed as an argument.

The second call does not pass an argument, so `name` becomes `undefined`.

Before default parameters, developers had to handle this inside the function:

```js
function greet(name) {
  if (name === undefined) {
    name = "Guest";
  }

  return `Hello, ${name}!`;
}

console.log(greet()); // Hello, Guest!
```

This works, but it adds extra code.

Default parameters let you write the fallback directly in the parameter list.

## Basic Syntax

To create a default parameter, assign a value in the function definition:

```js
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}
```

Now `name` uses `"Guest"` when no argument is provided:

```js
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}

console.log(greet("Alice")); // Hello, Alice!
console.log(greet()); // Hello, Guest!
```

The syntax is:

```js
function functionName(parameter = defaultValue) {
  // function body
}
```

You can use default parameters with function declarations:

```js
function multiply(number, factor = 2) {
  return number * factor;
}

console.log(multiply(5)); // 10
console.log(multiply(5, 3)); // 15
```

And with function expressions:

```js
const multiply = function (number, factor = 2) {
  return number * factor;
};

console.log(multiply(5)); // 10
```

## Defaults Only Apply to `undefined`

This is the most important rule:

**A default parameter is used only when the argument is `undefined` or omitted.**

It does not apply to other falsy values.

```js
function createUser(role = "viewer") {
  return `Role is: ${role}`;
}

console.log(createUser()); // Role is: viewer
console.log(createUser(undefined)); // Role is: viewer
console.log(createUser(null)); // Role is: null
console.log(createUser("")); // Role is:
console.log(createUser("admin")); // Role is: admin
```

The default is used here:

```js
createUser();
createUser(undefined);
```

Both calls give `role` the value `undefined`.

The default is not used here:

```js
createUser(null);
createUser("");
```

`null` and `""` are real values. JavaScript assumes you passed them intentionally.

## Default Parameters and Falsy Values

This behavior is important because JavaScript has several falsy values:

- `false`
- `0`
- `-0`
- `0n`
- `""`
- `null`
- `undefined`
- `NaN`

Default parameters do not check for "falsy."

They check only for `undefined`.

```js
function setVolume(volume = 50) {
  return `Volume: ${volume}`;
}

console.log(setVolume()); // Volume: 50
console.log(setVolume(undefined)); // Volume: 50
console.log(setVolume(0)); // Volume: 0
console.log(setVolume(false)); // Volume: false
console.log(setVolume(null)); // Volume: null
```

This is a feature.

If `0` is a valid value, the function should preserve it.

For example, a volume of `0` may mean muted:

```js
function setVolume(volume = 50) {
  return volume;
}

console.log(setVolume(0)); // 0
```

The default does not overwrite `0`.

## Multiple Default Parameters

You can give defaults to more than one parameter.

```js
function createGreeting(name = "Guest", greeting = "Hello", punctuation = "!") {
  return `${greeting}, ${name}${punctuation}`;
}

console.log(createGreeting()); // Hello, Guest!
console.log(createGreeting("Alice")); // Hello, Alice!
console.log(createGreeting("Bob", "Welcome")); // Welcome, Bob!
console.log(createGreeting("Mira", "Hi", ".")); // Hi, Mira.
```

Each parameter uses its default only when the matching argument is `undefined`.

## Skipping a Default Parameter

Arguments are matched by position.

That means skipping a middle parameter can be awkward.

```js
function createGreeting(name = "Guest", greeting = "Hello", punctuation = "!") {
  return `${greeting}, ${name}${punctuation}`;
}
```

If you want to use the default `greeting` but provide a custom `punctuation`, you need to pass `undefined`:

```js
console.log(createGreeting("Alice", undefined, "?")); // Hello, Alice?
```

Passing `undefined` tells JavaScript:

```text
Use the default for this parameter.
```

This works, but it can be hard to read if you need to do it often.

That is why parameter order matters.

## Put Defaults Near the End

As a general rule, put parameters with default values near the end of the parameter list.

This is harder to use:

```js
function createBox(width, height = 10, depth) {
  return `${width} x ${height} x ${depth}`;
}

console.log(createBox(5, undefined, 5)); // 5 x 10 x 5
```

The caller has to pass `undefined` just to skip `height`.

This is easier:

```js
function createBox(width, depth, height = 10) {
  return `${width} x ${height} x ${depth}`;
}

console.log(createBox(5, 5)); // 5 x 10 x 5
```

Now the required values come first, and the optional value comes last.

That makes the function easier to call.

## Default Values Can Be Expressions

A default value can be any expression.

It does not have to be a fixed string or number.

```js
function getRandomNumber(max = 10) {
  return Math.floor(Math.random() * max);
}

console.log(getRandomNumber()); // Random number from 0 to 9
console.log(getRandomNumber(100)); // Random number from 0 to 99
```

The default value can use math:

```js
function calculatePrice(price, tax = price * 0.08) {
  return price + tax;
}

console.log(calculatePrice(100)); // 108
console.log(calculatePrice(100, 20)); // 120
```

The default expression runs only when the argument is missing or `undefined`.

## Defaults Are Evaluated at Call Time

Default expressions are evaluated when the function is called, not when the function is defined.

```js
function createId(id = Math.random()) {
  return id;
}

console.log(createId());
console.log(createId());
console.log(createId());
```

Each call without an argument gets a new random number.

If the default were evaluated only once, all three calls would return the same value.

But default expressions run at call time, so each call can produce a different result.

## Using Earlier Parameters as Defaults

Default parameters can refer to earlier parameters.

```js
function calculateTotal(price, taxRate = 0.08, total = price + price * taxRate) {
  return total;
}

console.log(calculateTotal(100)); // 108
console.log(calculateTotal(100, 0.1)); // 110
console.log(calculateTotal(100, 0.1, 150)); // 150
```

This works because JavaScript handles parameters from left to right.

By the time JavaScript reaches `taxRate`, `price` is already available.

By the time JavaScript reaches `total`, both `price` and `taxRate` are available.

This does not work:

```js
function calculateTotal(total = price + tax, price, tax) {
  return total;
}
```

`price` and `tax` are not available yet when JavaScript tries to calculate the default for `total`.

Use earlier parameters in later defaults, not the other way around.

## Default Parameters vs `||` Fallbacks

Before default parameters, developers often used the `||` operator for fallback values:

```js
function greet(name) {
  name = name || "Guest";
  return `Hello, ${name}!`;
}
```

This works for missing values:

```js
console.log(greet()); // Hello, Guest!
```

But it also replaces other falsy values:

```js
console.log(greet("")); // Hello, Guest!
```

That may be wrong if an empty string is a valid value.

Default parameters are more precise:

```js
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}

console.log(greet()); // Hello, Guest!
console.log(greet("")); // Hello, !
```

The modern version only falls back for `undefined`.

This is similar to why `??` is often safer than `||` for defaults when values like `0`, `""`, or `false` should be preserved.

## Default Parameters vs `??` Inside the Function

Sometimes you may want a fallback for both `null` and `undefined`.

Default parameters only handle `undefined`.

If you want to treat `null` as missing too, use `??` inside the function:

```js
function greet(name) {
  const displayName = name ?? "Guest";
  return `Hello, ${displayName}!`;
}

console.log(greet()); // Hello, Guest!
console.log(greet(undefined)); // Hello, Guest!
console.log(greet(null)); // Hello, Guest!
console.log(greet("")); // Hello, !
```

Use a default parameter when only `undefined` should trigger the fallback.

Use `??` when both `null` and `undefined` should trigger the fallback.

## Default Parameters With Objects

Default parameters are especially useful when a function accepts an object.

```js
function createUser(options = {}) {
  return {
    name: options.name ?? "Guest",
    role: options.role ?? "viewer",
  };
}

console.log(createUser());
console.log(createUser({ name: "Alice", role: "admin" }));
```

The default `{}` prevents an error when no object is passed.

Without it, this would fail:

```js
function createUser(options) {
  return {
    name: options.name ?? "Guest",
    role: options.role ?? "viewer",
  };
}

console.log(createUser()); // TypeError
```

If `options` is `undefined`, JavaScript cannot read `options.name`.

The default object gives the function something safe to read from.

## Best Practices

Use default parameters for simple fallback values:

```js
function formatCurrency(amount, currency = "USD") {
  return `${currency} ${amount}`;
}
```

Place required parameters first and optional parameters later:

```js
function sendMessage(to, message, urgent = false) {
  return {
    to,
    message,
    urgent,
  };
}
```

Avoid putting defaults in the middle unless there is a strong reason:

```js
// Harder to call clearly
function sendMessage(to, urgent = false, message) {
  return {
    to,
    message,
    urgent,
  };
}
```

Use `??` inside the function if `null` should also use the fallback:

```js
function normalizeName(name = "Guest") {
  return name;
}

function normalizeNameIncludingNull(name) {
  return name ?? "Guest";
}
```

Keep default expressions simple.

This is clear:

```js
function calculateTotal(price, tax = price * 0.08) {
  return price + tax;
}
```

This is harder to read:

```js
function calculateTotal(price, tax = getTaxRate(price) * price + getFee(price)) {
  return price + tax;
}
```

If the default logic becomes complex, move it into the function body.

## Common Mistakes

### Mistake 1: Expecting Defaults to Replace `null`

```js
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}

console.log(greet(null)); // Hello, null!
```

`null` does not trigger the default.

If you want `null` to use the fallback, use `??`:

```js
function greet(name) {
  return `Hello, ${name ?? "Guest"}!`;
}

console.log(greet(null)); // Hello, Guest!
```

### Mistake 2: Expecting Defaults to Replace Empty Strings

```js
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}

console.log(greet("")); // Hello, !
```

An empty string is a real value.

JavaScript does not use the default.

### Mistake 3: Putting Optional Parameters Before Required Ones

```js
function createBox(width, height = 10, depth) {
  return `${width} x ${height} x ${depth}`;
}

console.log(createBox(5, 5)); // 5 x 5 x undefined
```

The second argument goes into `height`, not `depth`.

A clearer version puts the default last:

```js
function createBox(width, depth, height = 10) {
  return `${width} x ${height} x ${depth}`;
}

console.log(createBox(5, 5)); // 5 x 10 x 5
```

### Mistake 4: Using `||` When `0` Is Valid

```js
function setRetries(retries) {
  retries = retries || 3;
  return retries;
}

console.log(setRetries(0)); // 3
```

If `0` means "do not retry," this is a bug.

Use a default parameter instead:

```js
function setRetries(retries = 3) {
  return retries;
}

console.log(setRetries(0)); // 0
```

## Quick Check

What does this return?

```js
function getRole(role = "viewer") {
  return role;
}

getRole();
```

It returns:

```js
"viewer"
```

What does this return?

```js
function getRole(role = "viewer") {
  return role;
}

getRole(null);
```

It returns:

```js
null
```

`null` does not trigger a default parameter.

What does this return?

```js
function getCount(count = 10) {
  return count;
}

getCount(0);
```

It returns:

```js
0
```

`0` is falsy, but it is not `undefined`, so the default is not used.

## Summary

Default parameters let functions use fallback values when arguments are missing.

- Add a default with `parameter = defaultValue`.
- Defaults run only when the argument is omitted or `undefined`.
- Defaults do not replace `null`, `0`, `false`, `""`, or `NaN`.
- Default values can be expressions and are evaluated at call time.
- Later defaults can use earlier parameters.
- Put required parameters first and default parameters near the end.
- Use `??` inside the function when both `null` and `undefined` should use a fallback.
