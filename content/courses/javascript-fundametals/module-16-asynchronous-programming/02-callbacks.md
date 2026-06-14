# Callbacks

A callback is a function passed into another function to be called later.

You have already seen callbacks with array methods:

```js
const numbers = [1, 2, 3];

const doubled = numbers.map((number) => number * 2);
```

The function passed to `map` is a callback.

In asynchronous programming, callbacks are often used to run code after something finishes.

## Callback Basics

```js
function greet(name, callback) {
  const message = `Hello, ${name}`;
  callback(message);
}

greet("Alice", (message) => {
  console.log(message);
});
```

Output:

```text
Hello, Alice
```

The callback lets `greet` decide when to run your function.

## Async Callback Example

```js
console.log("Start");

setTimeout(() => {
  console.log("Timer finished");
}, 1000);

console.log("End");
```

Output:

```text
Start
End
Timer finished
```

The callback passed to `setTimeout` runs later.

## Callbacks With Events

Browser events use callbacks.

```js
button.addEventListener("click", () => {
  console.log("Button clicked");
});
```

The callback runs when the user clicks.

You do not call it yourself.

The browser calls it later.

## Named Callback Functions

Callbacks do not have to be inline.

```js
function handleClick() {
  console.log("Button clicked");
}

button.addEventListener("click", handleClick);
```

Named callbacks can make code easier to read and reuse.

Do not call the function when passing it:

```js
button.addEventListener("click", handleClick); // correct
button.addEventListener("click", handleClick()); // wrong
```

The second version calls `handleClick` immediately.

## Callback Parameters

The function that runs the callback decides what arguments to pass.

```js
function loadUser(callback) {
  const user = {
    id: 1,
    name: "Alice",
  };

  callback(user);
}

loadUser((user) => {
  console.log(user.name);
});
```

Output:

```text
Alice
```

## Error-First Callbacks

Older Node.js APIs often use error-first callbacks.

The first callback argument is an error.

The second argument is the result.

```js
function readData(callback) {
  const success = true;

  if (!success) {
    callback(new Error("Could not read data"));
    return;
  }

  callback(null, { name: "Alice" });
}

readData((error, data) => {
  if (error) {
    console.log(error.message);
    return;
  }

  console.log(data.name);
});
```

This pattern makes success and failure explicit.

Modern code often uses promises instead, but you will still see callbacks in older APIs and event systems.

## Callbacks and `this`

When passing object methods as callbacks, `this` can be lost.

```js
const user = {
  name: "Alice",
  greet() {
    console.log(`Hello, ${this.name}`);
  },
};

setTimeout(user.greet, 1000); // this may be lost
```

Use a wrapper:

```js
setTimeout(() => {
  user.greet();
}, 1000);
```

Or bind the method:

```js
setTimeout(user.greet.bind(user), 1000);
```

This connects back to the `this` module.

## Best Practices

Use callbacks when an API expects them, such as events.

Use named callbacks when inline functions become too long.

Do not call the callback while passing it unless the API expects a returned function.

Handle errors explicitly in error-first callbacks.

Keep callback logic small.

## Common Mistakes

### Mistake 1: Calling Instead of Passing

```js
setTimeout(showMessage(), 1000);
```

This calls `showMessage` immediately.

Correct:

```js
setTimeout(showMessage, 1000);
```

or:

```js
setTimeout(() => showMessage(), 1000);
```

### Mistake 2: Ignoring Callback Errors

```js
readData((error, data) => {
  console.log(data.name);
});
```

If `error` exists, `data` may be missing.

Handle the error first.

### Mistake 3: Making Callbacks Too Deep

Nested callbacks quickly become hard to read.

You will learn this as callback hell in the next lesson.

## Summary

Callbacks are functions passed to other functions to run later.

- Callbacks are used in arrays, events, timers, and older async APIs.
- The caller decides when to run the callback.
- Error-first callbacks pass `(error, data)`.
- Do not call a callback while passing it unless intended.
- Passing methods as callbacks can lose `this`.
- Deeply nested callbacks can become hard to maintain.
