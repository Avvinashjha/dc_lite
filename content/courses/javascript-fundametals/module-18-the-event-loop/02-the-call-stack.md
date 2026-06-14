# The Call Stack

The call stack is where JavaScript keeps track of currently running function calls.

JavaScript runs one stack frame at a time.

When a function is called, it goes onto the stack.

When the function finishes, it comes off the stack.

## Simple Example

```js
function greet() {
  console.log("Hello");
}

greet();
```

When `greet()` is called:

1. `greet` is pushed onto the call stack.
2. `console.log` runs.
3. `greet` finishes.
4. `greet` is popped off the stack.

## Nested Function Calls

```js
function first() {
  second();
}

function second() {
  third();
}

function third() {
  console.log("Done");
}

first();
```

Call order:

```text
first()
second()
third()
console.log()
```

Stack grows as functions call other functions.

Then it unwinds as functions finish.

## Stack Diagram

At the deepest point:

```text
console.log
third
second
first
global
```

The top of the stack runs first.

`first` cannot finish until `second` finishes.

`second` cannot finish until `third` finishes.

## Synchronous Code Uses the Stack

```js
console.log("A");
console.log("B");
console.log("C");
```

This runs in order because each operation finishes before the next begins.

Output:

```text
A
B
C
```

## Blocking the Stack

If one function takes a long time, the stack is blocked.

```js
console.log("Start");

for (let i = 0; i < 1_000_000_000; i++) {}

console.log("End");
```

The second log cannot run until the loop finishes.

In the browser, this can freeze the UI.

## Stack Overflow

If functions keep calling without stopping, the stack can overflow.

```js
function recurse() {
  recurse();
}

recurse();
```

This eventually throws an error like:

```text
RangeError: Maximum call stack size exceeded
```

This usually happens with recursion that has no base case.

Correct recursive functions need a stopping condition.

```js
function countDown(number) {
  if (number <= 0) {
    return;
  }

  countDown(number - 1);
}
```

## Async Code and the Stack

Async callbacks do not run while the stack is busy.

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
```

Output:

```text
A
C
B
```

The timer callback waits until the current stack is clear and the event loop picks it later.

## Stack Traces

When an error occurs, JavaScript often shows a stack trace.

```js
function first() {
  second();
}

function second() {
  throw new Error("Failed");
}

first();
```

The stack trace helps you see the path of function calls that led to the error.

This is useful for debugging.

## Best Practices

Keep long-running synchronous work small.

Avoid blocking the main thread in browser code.

Use stack traces to debug where errors came from.

Always include a base case in recursion.

Remember that async callbacks wait until the call stack is clear.

## Common Mistakes

### Mistake 1: Thinking `setTimeout(..., 0)` Runs Immediately

It does not interrupt the current stack.

It schedules work for later.

### Mistake 2: Writing Recursion Without a Base Case

```js
function loop() {
  loop();
}
```

This eventually overflows the stack.

### Mistake 3: Blocking the UI With Heavy Loops

Long synchronous loops can prevent clicks, rendering, and timers from being handled promptly.

## Summary

The call stack tracks currently running JavaScript function calls.

- Function calls are pushed onto the stack.
- Finished functions are popped off.
- JavaScript runs the top of the stack.
- Long synchronous work blocks later work.
- Async callbacks wait until the stack is clear.
- Stack overflow can happen with runaway recursion.
- Stack traces show the chain of function calls that led to an error.
