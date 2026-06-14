# Event Methods

Event objects have methods that can change how the browser handles an event.

The most important ones are:

- `preventDefault()`
- `stopPropagation()`
- `stopImmediatePropagation()`

Use them carefully. They are powerful, but overusing them can make a page harder
to understand.

## `preventDefault()`

Some events have default browser behavior.

Examples:

- clicking a link navigates to its `href`
- submitting a form reloads or navigates the page
- pressing a key in an input types text
- right-clicking opens a context menu

`preventDefault()` asks the browser not to perform that default action.

```js
const form = document.querySelector("#signup-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  console.log("Handle the form with JavaScript");
});
```

This is common when JavaScript validates or submits a form with `fetch`.

## Preventing Link Navigation

```js
const link = document.querySelector("#confirm-link");

link.addEventListener("click", (event) => {
  const confirmed = confirm("Leave this page?");

  if (!confirmed) {
    event.preventDefault();
  }
});
```

Only prevent default behavior when you have a clear reason.

Links should normally navigate, and forms should normally submit unless your code
replaces that behavior.

## `defaultPrevented`

You can check whether default behavior has already been prevented.

```js
document.addEventListener("click", (event) => {
  if (event.defaultPrevented) {
    console.log("Another listener prevented the default action");
  }
});
```

This can help when multiple listeners coordinate around the same event.

## Cancelable Events

Not every event can be canceled.

```js
element.addEventListener("click", (event) => {
  console.log(event.cancelable);
});
```

If `event.cancelable` is `false`, calling `preventDefault()` has no effect.

## Passive Listeners and `preventDefault`

A passive listener promises not to call `preventDefault()`.

```js
window.addEventListener(
  "scroll",
  (event) => {
    // event.preventDefault() is not allowed in a passive listener.
  },
  { passive: true }
);
```

Passive listeners can improve scroll performance, but they are not appropriate
when you need to block a default action.

## `stopPropagation()`

`stopPropagation()` stops the event from continuing through the capturing or
bubbling phases.

```js
button.addEventListener("click", (event) => {
  event.stopPropagation();
  console.log("Button only");
});

panel.addEventListener("click", () => {
  console.log("Panel");
});
```

If the button is inside the panel, the panel's bubbling listener will not run
after the button calls `stopPropagation()`.

## Use `stopPropagation()` Carefully

Stopping propagation can break parent-level behavior such as:

- delegated list handlers
- analytics listeners
- outside-click detection
- keyboard or accessibility helpers

Before using it, ask whether a more precise target check would solve the problem.

```js
panel.addEventListener("click", (event) => {
  if (event.target.closest(".ignore-panel-click")) {
    return;
  }

  closePanel();
});
```

This often keeps the event flow easier to reason about.

## `stopImmediatePropagation()`

`stopImmediatePropagation()` is stronger.

It stops the event from reaching other listeners on the same element and also
stops further propagation.

```js
button.addEventListener("click", (event) => {
  event.stopImmediatePropagation();
  console.log("First listener");
});

button.addEventListener("click", () => {
  console.log("Second listener will not run");
});
```

Use this rarely. It can make behavior very surprising.

## Methods Compared

| Method | What it does |
| --- | --- |
| `preventDefault()` | prevents the browser's default action |
| `stopPropagation()` | stops the event from moving to other elements |
| `stopImmediatePropagation()` | also stops later listeners on the same element |

These methods solve different problems.

Preventing a form submit does not stop bubbling. Stopping propagation does not
prevent a link from navigating.

## Summary

Use `preventDefault()` when you are replacing a default browser action.

Use propagation-stopping methods only when event flow itself is the problem, and
prefer careful target checks when they are enough.
