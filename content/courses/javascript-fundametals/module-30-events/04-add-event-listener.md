# addEventListener

`addEventListener` is the main modern way to listen for browser events.

It lets you attach one or more listener functions to an element, document, or
window.

## Basic Syntax

```js
element.addEventListener(eventName, handler);
```

Example:

```js
const button = document.querySelector("#save");

button.addEventListener("click", () => {
  console.log("Saved");
});
```

The first argument is the event name as a string.

The second argument is the function that should run.

## Passing a Named Function

```js
function handleClick(event) {
  console.log(event.type);
}

button.addEventListener("click", handleClick);
```

This is useful when:

- the handler is more than a few lines
- you want to reuse the same handler
- you need to remove the listener later
- you want clearer stack traces while debugging

## Multiple Listeners

One element can have multiple listeners for the same event.

```js
button.addEventListener("click", updateUI);
button.addEventListener("click", saveAnalytics);
```

Both listeners run when the button is clicked.

This is one reason `addEventListener` is preferred over assigning directly to
properties like `onclick`.

## `onclick` vs `addEventListener`

This style works:

```js
button.onclick = handleClick;
```

But assigning another handler replaces the previous one:

```js
button.onclick = firstHandler;
button.onclick = secondHandler; // firstHandler is replaced
```

With `addEventListener`, both can be registered:

```js
button.addEventListener("click", firstHandler);
button.addEventListener("click", secondHandler);
```

## Removing a Listener

Use `removeEventListener` with the same event name and the same function
reference.

```js
function handleResize() {
  console.log(window.innerWidth);
}

window.addEventListener("resize", handleResize);
window.removeEventListener("resize", handleResize);
```

This does not work:

```js
window.addEventListener("resize", () => {
  console.log(window.innerWidth);
});

window.removeEventListener("resize", () => {
  console.log(window.innerWidth);
});
```

Those are two different function objects, even though the code looks the same.

## Listener Options

`addEventListener` accepts an optional third argument.

```js
element.addEventListener("click", handler, options);
```

Common options:

| Option | Meaning |
| --- | --- |
| `once` | remove the listener after it runs once |
| `capture` | run during the capturing phase |
| `passive` | promise not to call `preventDefault()` |
| `signal` | remove the listener when an `AbortSignal` is aborted |

## `once`

Use `once` when an event should only be handled one time.

```js
button.addEventListener(
  "click",
  () => {
    console.log("This runs once");
  },
  { once: true }
);
```

## `passive`

Use `passive: true` for scroll and touch listeners when you will not call
`preventDefault()`.

```js
window.addEventListener(
  "scroll",
  () => {
    console.log(window.scrollY);
  },
  { passive: true }
);
```

This can help the browser keep scrolling smooth.

Do not use `passive: true` if the handler needs to call `preventDefault()`.

## `signal`

An `AbortController` can remove one or more listeners at once.

```js
const controller = new AbortController();

window.addEventListener("resize", handleResize, {
  signal: controller.signal
});

controller.abort();
```

This is useful for cleanup when a component, modal, or page section is removed.

## Where Can You Add Listeners?

Many browser objects can receive listeners:

```js
button.addEventListener("click", handleClick);
document.addEventListener("keydown", handleKeydown);
window.addEventListener("resize", handleResize);
```

Use the narrowest target that makes sense. Listening on `document` or `window`
is useful, but it can also make behavior harder to reason about if overused.

## Summary

`addEventListener` registers event handlers without replacing existing ones.

It supports named handlers, multiple listeners, cleanup with
`removeEventListener`, and options such as `once`, `capture`, `passive`, and
`signal`.
