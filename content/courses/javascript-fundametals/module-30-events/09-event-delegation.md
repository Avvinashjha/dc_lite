# Event Delegation

Event delegation is a pattern where you listen on a parent element and handle
events from its children.

It works because many events bubble.

## The Problem

Imagine a list with several delete buttons.

```html
<ul id="todo-list">
  <li>Learn events <button class="delete">Delete</button></li>
  <li>Practice DOM <button class="delete">Delete</button></li>
  <li>Build a project <button class="delete">Delete</button></li>
</ul>
```

You could add a listener to every button.

```js
const buttons = document.querySelectorAll(".delete");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    button.closest("li").remove();
  });
});
```

This works, but it has two downsides:

- many listeners may be created for large lists
- buttons added later will not automatically have listeners

## Delegating to the Parent

Instead, listen on the parent list.

```js
const list = document.querySelector("#todo-list");

list.addEventListener("click", (event) => {
  if (!event.target.matches(".delete")) {
    return;
  }

  event.target.closest("li").remove();
});
```

When a delete button is clicked, the click bubbles to the list. The list listener
checks whether the original target matches `.delete`.

## Using `closest`

Sometimes the click target is inside the button.

```html
<button class="delete">
  <span>Delete</span>
</button>
```

If the user clicks the `span`, `event.target.matches(".delete")` is false.

Use `closest` to search upward from the target.

```js
list.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete");

  if (!deleteButton || !list.contains(deleteButton)) {
    return;
  }

  deleteButton.closest("li").remove();
});
```

The `contains` check keeps the handler scoped to this list.

## Works with Dynamic Elements

Delegation is especially useful when elements are added later.

```js
const item = document.createElement("li");
item.innerHTML = 'New task <button class="delete">Delete</button>';

list.append(item);
```

The new delete button works without adding another listener because the listener
is on the list.

## Delegating Different Actions

You can use data attributes to describe actions.

```html
<div id="toolbar">
  <button data-action="save">Save</button>
  <button data-action="preview">Preview</button>
  <button data-action="publish">Publish</button>
</div>
```

```js
const toolbar = document.querySelector("#toolbar");

toolbar.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const action = button.dataset.action;

  if (action === "save") {
    saveDraft();
  } else if (action === "preview") {
    showPreview();
  } else if (action === "publish") {
    publishPost();
  }
});
```

This keeps one listener in charge of a related group of controls.

## When Delegation Is a Good Fit

Use delegation when:

- many similar child elements need the same behavior
- children may be added or removed dynamically
- a parent naturally owns the interaction
- you want fewer listener registrations

## When Direct Listeners Are Better

Direct listeners may be clearer when:

- there is only one element
- the handler is very specific to that element
- the event does not bubble
- the parent would need complicated checks

```js
modalCloseButton.addEventListener("click", closeModal);
```

Simple direct code is often better than clever delegation.

## Common Mistakes

Forgetting to filter the target:

```js
list.addEventListener("click", () => {
  // This runs for every click anywhere in the list.
});
```

Using `event.target` when nested elements are possible:

```js
if (event.target.matches(".delete")) {
  // May fail if the user clicks an icon inside the button.
}
```

Delegating too high in the document:

```js
document.addEventListener("click", handleEveryClick);
```

Global listeners can be useful, but too many can make interactions hard to
debug.

## Summary

Event delegation uses bubbling to handle child events from a parent listener.

It is especially useful for lists, menus, tables, toolbars, and dynamic content.
Use `closest` and careful target checks to keep delegated handlers reliable.
