# Context Binding

In the previous lesson, you learned that `this` depends on how a function is called.

That leads to a common problem:

```text
Sometimes a function loses the object it was meant to use.
```

This is called losing context.

Context binding means making sure a function keeps the `this` value you want.

## What Is Context?

In JavaScript, a function's context is the value of `this` when the function runs.

```js
const user = {
  name: "Alice",
  greet() {
    console.log(`Hello, ${this.name}`);
  },
};

user.greet(); // Hello, Alice
```

Here the context is `user`.

Inside `greet`, `this` is `user`.

## Losing Context

Context can be lost when you separate a method from its object.

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

The method was originally on `user`.

But the call is now:

```js
greet()
```

There is no object before the dot.

So `this` is not `user`.

## Why This Happens

Functions are values.

You can store them in variables, pass them into other functions, and return them.

```js
const sayName = user.greet;
```

This copies the function value.

It does not permanently attach the function to `user`.

When the function is later called, JavaScript checks how it is called at that moment.

## Context Loss in Callbacks

Context loss often happens with callbacks.

```js
const user = {
  name: "Alice",
  greet() {
    console.log(`Hello, ${this.name}`);
  },
};

function runCallback(callback) {
  callback();
}

runCallback(user.greet); // this is not user
```

`user.greet` is passed as a function value.

Inside `runCallback`, it is called as:

```js
callback()
```

There is no `user.` before the call.

So the original context is lost.

## Context Loss With Timers

Timers are another common example.

```js
const user = {
  name: "Alice",
  greet() {
    console.log(`Hello, ${this.name}`);
  },
};

setTimeout(user.greet, 1000);
```

The method is passed to `setTimeout` as a callback.

Later, JavaScript calls it without `user` as the receiver.

So `this` is not `user`.

## Fix 1: Wrap the Method Call

One simple fix is to wrap the method call in another function.

```js
const user = {
  name: "Alice",
  greet() {
    console.log(`Hello, ${this.name}`);
  },
};

setTimeout(function () {
  user.greet();
}, 1000);
```

Now `user.greet()` is called with `user` before the dot.

So `this` is `user`.

You can also use an arrow function as the wrapper:

```js
setTimeout(() => {
  user.greet();
}, 1000);
```

This works because the callback explicitly calls `user.greet()`.

## Fix 2: Store `this` in a Variable

Older JavaScript code sometimes used this pattern:

```js
const user = {
  name: "Alice",
  greetLater() {
    const self = this;

    setTimeout(function () {
      console.log(`Hello, ${self.name}`);
    }, 1000);
  },
};

user.greetLater();
```

You may also see:

```js
const that = this;
```

This was common before arrow functions and `bind` were widely used.

Modern code usually prefers arrow functions or `bind`.

## Fix 3: Use `bind`

`bind` creates a new function with `this` permanently set.

```js
const user = {
  name: "Alice",
  greet() {
    console.log(`Hello, ${this.name}`);
  },
};

const boundGreet = user.greet.bind(user);

boundGreet(); // Hello, Alice
```

You will learn `bind` in detail in the next lesson.

For now, understand the idea:

```text
bind locks a function's this value.
```

## Fix 4: Use `call` or `apply`

`call` and `apply` let you call a function immediately with a specific `this` value.

```js
function introduce() {
  console.log(`I am ${this.name}`);
}

const user = {
  name: "Alice",
};

introduce.call(user); // I am Alice
```

You will learn `call` and `apply` in later lessons.

## Context Binding in Event Handlers

In browser event handlers, `this` can depend on how the handler is registered and called.

Example in older DOM style:

```js
button.addEventListener("click", function () {
  console.log(this); // often the button element
});
```

With an arrow function:

```js
button.addEventListener("click", () => {
  console.log(this); // not the button element
});
```

Arrow functions handle `this` differently.

You will learn this in the next lesson.

For now, remember:

```text
Callbacks often change how a function is called, which can change this.
```

## Method Extraction vs Method Call

These two lines look similar but behave differently:

```js
user.greet();
```

and:

```js
const greet = user.greet;
greet();
```

The first line calls the method with `user` as `this`.

The second line calls a standalone function.

The context was lost.

## Practical Example

```js
const counter = {
  count: 0,
  increment() {
    this.count += 1;
    console.log(this.count);
  },
};

counter.increment(); // 1

const increment = counter.increment;

increment(); // this is not counter
```

To preserve context:

```js
const increment = counter.increment.bind(counter);

increment(); // 2
```

Now the function is bound to `counter`.

## Best Practices

Be careful when passing object methods as callbacks:

```js
setTimeout(user.greet, 1000); // likely loses this
```

Prefer wrapping the method call when it is simple:

```js
setTimeout(() => user.greet(), 1000);
```

Use `bind` when you need a reusable function with fixed context:

```js
const greet = user.greet.bind(user);
```

When debugging `this`, check the actual function call:

```text
Was it called as object.method() or plainFunction()?
```

## Common Mistakes

### Mistake 1: Passing a Method as a Callback Directly

```js
setTimeout(user.greet, 1000);
```

This passes the function, but not the original method call.

Use:

```js
setTimeout(() => user.greet(), 1000);
```

or:

```js
setTimeout(user.greet.bind(user), 1000);
```

### Mistake 2: Thinking Assignment Keeps Context

```js
const greet = user.greet;
greet();
```

Assignment copies the function value.

It does not remember the original object.

### Mistake 3: Binding to the Wrong Object

```js
const greet = user.greet.bind(admin);
```

Now `this` will be `admin`, not `user`.

That may be useful sometimes, but it must be intentional.

## Quick Check

What is the problem here?

```js
const user = {
  name: "Alice",
  greet() {
    console.log(this.name);
  },
};

setTimeout(user.greet, 1000);
```

The method is passed as a callback, so it may lose `user` as its `this` value.

One fix:

```js
setTimeout(() => user.greet(), 1000);
```

Another fix:

```js
setTimeout(user.greet.bind(user), 1000);
```

## Summary

Context binding is about controlling the value of `this`.

- A method can lose context when extracted from its object.
- Passing a method as a callback often loses `this`.
- A wrapper function can preserve the intended method call.
- `bind` creates a new function with fixed `this`.
- `call` and `apply` call a function immediately with a chosen `this`.
- To debug context problems, inspect how the function is actually called.
