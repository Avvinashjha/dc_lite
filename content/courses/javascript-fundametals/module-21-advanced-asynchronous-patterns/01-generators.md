# Generators

Generators are functions that can pause and resume.

They are not automatically asynchronous, but they are an important foundation for async iterators and streaming patterns.

## A Normal Function Runs to Completion

A regular function starts, runs all of its code, and returns one value.

```js
function getNumber() {
  return 1;
}

console.log(getNumber()); // 1
```

Once a regular function returns, it is done.

## A Generator Can Yield Many Values

A generator function uses `function*`.

Inside a generator, `yield` sends a value out and pauses the function.

```js
function* countToThree() {
  yield 1;
  yield 2;
  yield 3;
}

const counter = countToThree();

console.log(counter.next()); // { value: 1, done: false }
console.log(counter.next()); // { value: 2, done: false }
console.log(counter.next()); // { value: 3, done: false }
console.log(counter.next()); // { value: undefined, done: true }
```

Calling the generator function does not run the body immediately.

It returns a generator object. Each call to `.next()` resumes the function until the next `yield`.

## Understanding `value` and `done`

Each `.next()` call returns an object:

```js
{
  value: "some value",
  done: false
}
```

- `value` is the yielded or returned value.
- `done` tells you whether the generator has finished.

When the generator is complete, `done` becomes `true`.

## Using Generators With for...of

Generators are iterable, so you can loop over them.

```js
function* colors() {
  yield "red";
  yield "green";
  yield "blue";
}

for (const color of colors()) {
  console.log(color);
}
```

Output:

```txt
red
green
blue
```

`for...of` automatically calls `.next()` until `done` is `true`.

## Lazy Values

Generators are useful because they create values only when requested.

```js
function* ids() {
  let id = 1;

  while (true) {
    yield id;
    id += 1;
  }
}

const nextId = ids();

console.log(nextId.next().value); // 1
console.log(nextId.next().value); // 2
console.log(nextId.next().value); // 3
```

This generator can produce an unlimited sequence, but it does not create all values upfront.

That idea is called laziness.

## Returning From a Generator

A generator can also use `return`.

```js
function* example() {
  yield "first";
  return "finished";
}

const iterator = example();

console.log(iterator.next()); // { value: "first", done: false }
console.log(iterator.next()); // { value: "finished", done: true }
```

The returned value is not included in a `for...of` loop.

```js
for (const value of example()) {
  console.log(value); // "first"
}
```

## Passing Values Back In

`.next()` can pass a value back into the generator.

```js
function* askForName() {
  const name = yield "What is your name?";
  yield `Hello, ${name}`;
}

const conversation = askForName();

console.log(conversation.next().value); // "What is your name?"
console.log(conversation.next("Ada").value); // "Hello, Ada"
```

This pattern is less common in everyday application code, but it shows that generators are two-way control flows.

## Practical Uses

Generators can help with:

- producing sequences
- walking nested data
- processing large data step by step
- building custom iterables
- understanding async iterators

Example: walking a tree.

```js
const menu = {
  title: "Root",
  children: [
    { title: "Products", children: [] },
    {
      title: "Account",
      children: [{ title: "Settings", children: [] }],
    },
  ],
};

function* walkMenu(item) {
  yield item.title;

  for (const child of item.children) {
    yield* walkMenu(child);
  }
}

console.log([...walkMenu(menu)]);
// ["Root", "Products", "Account", "Settings"]
```

`yield*` delegates to another iterable.

## Common Mistakes

Do not forget the `*`.

```js
function numbers() {
  yield 1; // SyntaxError
}
```

Use:

```js
function* numbers() {
  yield 1;
}
```

Do not expect a generator to run immediately.

```js
function* logMessage() {
  console.log("Running");
  yield 1;
}

const iterator = logMessage(); // Nothing logged yet
iterator.next(); // "Running"
```

## Best Practices

- Use generators when values are naturally produced one at a time.
- Prefer arrays for small fixed lists that are already in memory.
- Keep generator logic focused and readable.
- Use `yield*` when delegating to another iterable.
- Remember that generators are synchronous unless combined with async APIs.

## Summary

Generators are pause-and-resume functions.

They use `function*` and `yield`, return iterator result objects from `.next()`, and work naturally with `for...of`.

They introduce the idea of consuming values over time, which prepares you for async iterators and streaming data.
