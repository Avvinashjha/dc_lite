# Event Handling

Event handling means writing code that responds to events.

An event handler is a function that runs when a specific event happens.

## A Basic Handler

```html
<button id="like-button">Like</button>
```

```js
const button = document.querySelector("#like-button");

function handleLikeClick() {
  console.log("Liked");
}

button.addEventListener("click", handleLikeClick);
```

The handler function is `handleLikeClick`.

The browser calls it when the button is clicked.

## Handler Functions Receive an Event Object

Most handlers receive an event object as their first argument.

```js
button.addEventListener("click", (event) => {
  console.log(event.type);
  console.log(event.target);
});
```

The event object contains information about what happened.

Common properties:

| Property | Meaning |
| --- | --- |
| `type` | the event name, such as `"click"` |
| `target` | the element where the event started |
| `currentTarget` | the element whose listener is currently running |
| `timeStamp` | when the event was created |
| `defaultPrevented` | whether `preventDefault()` has been called |

## `target` and `currentTarget`

These two properties are easy to confuse.

`event.target` is where the event originally happened.

`event.currentTarget` is the element that owns the listener currently running.

```html
<button id="save-button">
  <span>Save</span>
</button>
```

```js
const button = document.querySelector("#save-button");

button.addEventListener("click", (event) => {
  console.log(event.target); // Could be the span
  console.log(event.currentTarget); // The button
});
```

If the user clicks the text inside the button, `target` may be the `span`, while
`currentTarget` is the `button`.

## Named Handlers

Inline arrow functions are fine for small behavior.

For important behavior, named functions are often easier to read and remove
later.

```js
function handleSaveClick(event) {
  event.currentTarget.disabled = true;
  console.log("Saving...");
}

saveButton.addEventListener("click", handleSaveClick);
```

Named handlers also make stack traces easier to understand when debugging.

## Reading Values in Handlers

Handlers often read values from form fields.

```js
const form = document.querySelector("#profile-form");
const nameInput = document.querySelector("#name");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  console.log(nameInput.value);
});
```

The value is read when the event happens, not when the listener is registered.

## Updating the DOM in Handlers

Handlers commonly update classes, text, attributes, or form state.

```js
const toggle = document.querySelector("#toggle-details");
const details = document.querySelector("#details");

toggle.addEventListener("click", () => {
  details.hidden = !details.hidden;
});
```

This is the basic pattern behind tabs, accordions, menus, modals, and many other
UI components.

## Avoid Inline HTML Handlers

You may see code like this:

```html
<button onclick="saveUser()">Save</button>
```

This works, but it mixes HTML with JavaScript behavior.

Prefer this:

```js
const button = document.querySelector("#save");

button.addEventListener("click", saveUser);
```

Keeping behavior in JavaScript makes code easier to organize, test, and update.

## Handling Missing Elements

If a selector does not match anything, it returns `null`.

```js
const button = document.querySelector("#delete");

if (button) {
  button.addEventListener("click", handleDelete);
}
```

In small exercises, you may know the element always exists. In larger pages,
checking can prevent errors when a script is shared across pages.

## Common Mistakes

Using the wrong event:

```js
input.addEventListener("click", validateInput);
```

For live input validation, `input` is usually better than `click`.

Forgetting the event parameter:

```js
form.addEventListener("submit", () => {
  event.preventDefault(); // Relies on a global event object and is unreliable
});
```

Use the parameter explicitly:

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();
});
```

## Summary

Event handling is the process of registering functions that respond to browser
events.

Handlers can inspect the event object, read user input, update the DOM, and
coordinate interactive behavior.
