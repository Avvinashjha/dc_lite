# Breakpoints and Stepping

Breakpoints let you pause JavaScript while it is running.

When execution pauses, you can inspect variables, scope, closures, `this`, the call stack, and the exact line that will run next.

This is often better than adding many `console.log()` calls.

## Why Use Breakpoints?

Logs show selected values after you decide what to print.

Breakpoints let you explore the current state while the program is paused.

Use breakpoints when:

- you do not know which value is wrong yet
- the code path is complicated
- a function is called from several places
- `this` or closure state is confusing
- a loop changes data over time
- an async callback runs later than expected

## Setting a Breakpoint

Open the Sources panel in DevTools.

Find the JavaScript file you want to inspect.

Click the line number where you want execution to pause.

When the browser reaches that line, it pauses before running it.

```js
function calculateTotal(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08;
  return subtotal + tax;
}
```

If the result is wrong, set a breakpoint on the `subtotal` line or the `return` line and inspect `items`, `subtotal`, and `tax`.

## Step Controls

When code is paused, DevTools usually shows several controls.

| Control | Meaning |
| --- | --- |
| Resume | Continue running until the next breakpoint |
| Step over | Run the current line without entering called functions |
| Step into | Enter the function called on the current line |
| Step out | Finish the current function and pause where it returns |
| Restart frame | Run the current function frame again, when supported |

Use Step over when the function call is not relevant.

Use Step into when the bug may be inside that function.

Use Step out when you stepped too deep and want to return to the caller.

## Inspecting Variables

While paused, hover over variables or use the Scope panel.

```js
function applyCoupon(cart, coupon) {
  const discount = cart.total * coupon.percent;
  return cart.total - discount;
}
```

If `discount` is `NaN`, inspect:

- `cart`
- `cart.total`
- `coupon`
- `coupon.percent`

The wrong output is usually caused by a wrong input, a wrong assumption, or a missed state change.

## Watching Expressions

The Watch panel lets you track expressions while stepping.

Examples:

```js
cart.items.length
user?.profile?.email
typeof total
this
```

Watch expressions are useful when the value is nested or when it changes across several steps.

## The Call Stack

The call stack shows how execution reached the paused line.

```js
function validateOrder(order) {
  return hasValidAddress(order.shippingAddress);
}

function hasValidAddress(address) {
  return address.city.length > 0;
}
```

If the debugger pauses inside `hasValidAddress`, the call stack shows that `validateOrder` called it.

This helps when a function is correct for some callers but not for others.

## Inspecting Scope and Closures

JavaScript functions remember variables from outer scopes.

```js
function createCounter() {
  let count = 0;

  return function increment() {
    count += 1;
    return count;
  };
}
```

When paused inside `increment`, DevTools can show the closure scope containing `count`.

This is useful when a closure keeps old state or when multiple functions share the same closed-over variable.

## Inspecting `this`

`this` depends on how a function is called.

```js
const user = {
  name: "Ari",
  greet() {
    return `Hi, ${this.name}`;
  },
};

const greet = user.greet;
greet();
```

If you pause inside `greet`, inspect `this`.

In this detached call, `this` is not the `user` object, so `this.name` will not behave as expected.

Breakpoints make these context problems easier to see than reading the code alone.

## Conditional Breakpoints

A conditional breakpoint pauses only when an expression is true.

This is useful in loops.

```js
for (const user of users) {
  processUser(user);
}
```

Instead of pausing for every user, create a conditional breakpoint:

```js
user.id === 42
```

Now the debugger pauses only for the user you care about.

## Logpoints

Some DevTools support logpoints.

A logpoint prints a message without pausing execution and without changing your source file.

This is useful when you want temporary logging but do not want to edit code.

Example message:

```js
"processing user", user.id, user.role
```

## Debugger Statement

You can also pause code by adding a `debugger` statement.

```js
function submitForm(data) {
  debugger;
  return sendForm(data);
}
```

When DevTools is open, execution pauses on that line.

Remove `debugger` statements before committing or shipping code.

## Breakpoints in Event Handlers

If a bug happens after a click, submit, key press, or timer, set a breakpoint inside the handler.

```js
button.addEventListener("click", (event) => {
  event.preventDefault();
  savePreferences();
});
```

Pause inside the handler and inspect:

- the `event` object
- selected DOM elements
- form values
- state variables
- the call stack

## Common Mistakes

Do not set a breakpoint after the bug already happened. Pause before the suspicious value is created or changed.

Do not step into every library function. Step over code that is not relevant to your investigation.

Do not ignore the call stack. It often explains why a function received an unexpected value.

Do not forget that paused code stops the page. Timers, animations, and pending interactions may wait while the debugger is paused.

## Summary

Breakpoints let you inspect JavaScript at the exact moment it runs.

Use them to:

- pause before suspicious code
- inspect variables, scope, closures, and `this`
- follow the call stack
- step into or over functions
- use conditional breakpoints for noisy loops
- debug event handlers and async callbacks

The debugger is strongest when you use it to follow evidence one line at a time.
