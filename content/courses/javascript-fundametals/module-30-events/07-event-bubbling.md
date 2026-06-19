# Event Bubbling

Many events do not stop at the element where they start.

After the event runs on the original target, it can travel upward through parent
elements. This is called event bubbling.

## A Nested Example

```html
<section id="panel">
  <button id="save">Save</button>
</section>
```

```js
const panel = document.querySelector("#panel");
const button = document.querySelector("#save");

button.addEventListener("click", () => {
  console.log("button listener");
});

panel.addEventListener("click", () => {
  console.log("panel listener");
});
```

If the user clicks the button, the output is:

```text
button listener
panel listener
```

The event starts at the button, then bubbles to the panel.

## The Bubbling Path

For a click inside nested elements, the event may move through a path like this:

```text
button -> section -> body -> html -> document -> window
```

You can inspect this path with `event.composedPath()`.

```js
button.addEventListener("click", (event) => {
  console.log(event.composedPath());
});
```

This is useful for debugging complex UI.

## `target` Stays the Same

During bubbling, `event.target` stays the original element where the event
started.

`event.currentTarget` changes depending on which listener is currently running.

```js
panel.addEventListener("click", (event) => {
  console.log(event.target); // the clicked element
  console.log(event.currentTarget); // the panel
});
```

This difference is important for event delegation.

## Not Every Event Bubbles

Many common events bubble:

- `click`
- `input`
- `keydown`
- `submit`
- `mouseover`

Some events do not bubble in the same way:

- `focus`
- `blur`
- `mouseenter`
- `mouseleave`

For focus behavior that bubbles, use `focusin` and `focusout`.

```js
form.addEventListener("focusin", (event) => {
  event.target.classList.add("is-focused");
});
```

## Why Bubbling Is Useful

Bubbling lets parent elements observe events from their children.

```js
const list = document.querySelector("#todo-list");

list.addEventListener("click", (event) => {
  console.log("Something inside the list was clicked");
});
```

This becomes very powerful when a list contains many buttons or items.

Instead of adding a listener to every child, you can add one listener to the
parent. This pattern is called event delegation.

## Bubbling and Dynamic Elements

Bubbling also helps with elements created after the page loads.

```js
const list = document.querySelector("#messages");

list.addEventListener("click", (event) => {
  if (event.target.matches(".delete-button")) {
    event.target.closest(".message").remove();
  }
});
```

The listener is on the existing list. New delete buttons added later still work
because their click events bubble to the list.

## Debugging Bubbling

When an event seems to run more than once, bubbling may be involved.

Check:

- whether multiple ancestors have listeners
- whether the same listener was registered more than once
- what `event.target` and `event.currentTarget` are
- whether a delegated listener matches more elements than intended

```js
document.addEventListener("click", (event) => {
  console.log("target:", event.target);
  console.log("current:", event.currentTarget);
});
```

## Summary

Event bubbling is the upward movement of an event from the original target
through its ancestors.

It explains why parent listeners can respond to child events and makes event
delegation possible.
