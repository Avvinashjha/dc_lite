# Events and the Event Loop

Browser pages are interactive.

Users click, type, scroll, resize windows, submit forms, and move between pages. The browser reports those actions to JavaScript as events.

An event is a signal that something happened.

## Adding an Event Listener

Use `addEventListener()` to run code when an event happens.

```html
<button id="save">Save</button>
```

```js
const button = document.querySelector("#save");

button.addEventListener("click", () => {
  console.log("Saved");
});
```

The function passed to `addEventListener()` is called an event handler or listener.

## The Event Object

Most event handlers receive an event object.

```js
button.addEventListener("click", (event) => {
  console.log(event.type); // "click"
  console.log(event.target);
});
```

The event object contains information about what happened.

Useful properties:

- `type`
- `target`
- `currentTarget`
- `defaultPrevented`
- key or mouse details for certain events

## `target` vs `currentTarget`

`event.target` is where the event started.

`event.currentTarget` is the element whose listener is currently running.

```html
<button id="save">
  <span>Save</span>
</button>
```

```js
const button = document.querySelector("#save");

button.addEventListener("click", (event) => {
  console.log(event.target); // could be the span
  console.log(event.currentTarget); // the button
});
```

This difference matters when elements are nested.

## Common Browser Events

Mouse and pointer events:

- `click`
- `dblclick`
- `mousedown`
- `mouseup`
- `pointerdown`
- `pointerup`

Keyboard events:

- `keydown`
- `keyup`

Form events:

- `submit`
- `input`
- `change`
- `focus`
- `blur`

Document and window events:

- `DOMContentLoaded`
- `load`
- `resize`
- `scroll`

## Form Submit Events

Forms submit by default.

That often reloads or navigates the page.

Use `preventDefault()` when JavaScript should handle the submission.

```html
<form id="signup">
  <input name="email" type="email">
  <button>Join</button>
</form>
```

```js
const form = document.querySelector("#signup");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const email = data.get("email");

  console.log(email);
});
```

`preventDefault()` does not stop the event from existing. It prevents the browser's default action for that event.

## Input Events

Use `input` when you want to react as the user types.

```js
const search = document.querySelector("#search");
const output = document.querySelector("#output");

search.addEventListener("input", () => {
  output.textContent = search.value;
});
```

Use `change` when you only need to react after a control commits a new value.

```js
const theme = document.querySelector("#theme");

theme.addEventListener("change", () => {
  document.body.dataset.theme = theme.value;
});
```

## Event Bubbling

Many events bubble.

That means the event starts at the target and then travels up through its ancestors.

```html
<section id="panel">
  <button>Click me</button>
</section>
```

```js
const panel = document.querySelector("#panel");

panel.addEventListener("click", (event) => {
  console.log("Panel heard a click");
  console.log(event.target);
});
```

Clicking the button also triggers the listener on `panel` because the click bubbles upward.

## Event Delegation

Event delegation uses bubbling to handle many child elements with one listener on a parent.

```html
<ul id="tasks">
  <li><button data-id="1">Done</button></li>
  <li><button data-id="2">Done</button></li>
</ul>
```

```js
const list = document.querySelector("#tasks");

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");

  if (!button) {
    return;
  }

  console.log(`Complete task ${button.dataset.id}`);
});
```

This is useful when list items are added dynamically.

You do not need to attach a separate listener to every button.

## Removing Event Listeners

To remove a listener, you need a reference to the same function.

```js
function handleClick() {
  console.log("Clicked");
}

button.addEventListener("click", handleClick);
button.removeEventListener("click", handleClick);
```

This does not work because the two arrow functions are different function objects:

```js
button.addEventListener("click", () => console.log("Clicked"));
button.removeEventListener("click", () => console.log("Clicked"));
```

Use a named function when you need to remove it later.

## Events and the Event Loop

Events are connected to the event loop.

When the user clicks a button, the browser schedules the event handler to run as a task.

```js
button.addEventListener("click", () => {
  console.log("click handler");
});
```

The handler runs when the call stack is free.

If JavaScript is busy running a long synchronous task, the browser cannot run the click handler yet.

```js
button.addEventListener("click", () => {
  console.log("This may feel delayed if the main thread is busy");
});
```

This is why long-running work can make a page feel frozen.

## Timers in the Browser

The browser provides timer APIs.

```js
setTimeout(() => {
  console.log("Runs later");
}, 1000);
```

`setTimeout()` schedules a callback after at least the given delay.

It does not pause JavaScript.

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

`setInterval()` repeats a callback.

```js
const id = setInterval(() => {
  console.log("tick");
}, 1000);

clearInterval(id);
```

Clear intervals you no longer need.

## Best Practices

- Use `addEventListener()` instead of inline HTML event attributes.
- Use `preventDefault()` for forms handled by JavaScript.
- Use event delegation for dynamic lists.
- Keep event handlers short.
- Avoid long synchronous work in event handlers.
- Store function references if you need to remove listeners later.

## Common Mistakes

Calling a function immediately instead of passing it:

```js
button.addEventListener("click", save());
```

Correct:

```js
button.addEventListener("click", save);
```

Or:

```js
button.addEventListener("click", () => {
  save();
});
```

Another mistake is forgetting that forms submit by default.

```js
form.addEventListener("submit", () => {
  saveForm();
});
```

If the page reloads, add `event.preventDefault()`.

## Summary

Events let browser JavaScript respond to users and the page lifecycle.

Use event listeners, understand the event object, and take advantage of bubbling and delegation. Event handlers run through the browser's event loop, so keeping them fast helps the page stay responsive.
