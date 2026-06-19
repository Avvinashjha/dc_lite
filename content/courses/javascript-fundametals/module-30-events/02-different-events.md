# Different Types of Events

Browsers create many kinds of events.

You do not need to memorize every event name, but you should understand the main
groups and when they are used.

## Mouse Events

Mouse events happen when a user interacts with a mouse or trackpad.

Common mouse events:

| Event | When it happens |
| --- | --- |
| `click` | the user clicks an element |
| `dblclick` | the user double-clicks an element |
| `mousedown` | a mouse button is pressed |
| `mouseup` | a mouse button is released |
| `mousemove` | the pointer moves |
| `mouseenter` | the pointer enters an element |
| `mouseleave` | the pointer leaves an element |

```js
const card = document.querySelector(".card");

card.addEventListener("mouseenter", () => {
  card.classList.add("is-hovered");
});

card.addEventListener("mouseleave", () => {
  card.classList.remove("is-hovered");
});
```

## Pointer Events

Pointer events work across mouse, touch, and stylus input.

Common pointer events:

- `pointerdown`
- `pointerup`
- `pointermove`
- `pointerenter`
- `pointerleave`

For modern interactive components, pointer events are often a better choice than
mouse-only events.

```js
const box = document.querySelector(".box");

box.addEventListener("pointerdown", () => {
  box.classList.add("is-pressed");
});
```

## Keyboard Events

Keyboard events happen when the user presses keys.

Common keyboard events:

| Event | When it happens |
| --- | --- |
| `keydown` | a key is pressed |
| `keyup` | a key is released |

```js
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});
```

Use `event.key` for readable key names such as `"Enter"`, `"Escape"`, or
`"ArrowDown"`.

## Form Events

Form events are essential for interactive forms.

Common form events:

| Event | When it happens |
| --- | --- |
| `submit` | a form is submitted |
| `input` | a field value changes |
| `change` | a committed value changes |
| `focus` | an element receives focus |
| `blur` | an element loses focus |

```js
const email = document.querySelector("#email");

email.addEventListener("input", () => {
  console.log(email.value);
});
```

`input` is useful for live updates. `change` is useful when you only care about
the final committed value.

## Page and Resource Events

The browser also fires events for page and resource lifecycle changes.

Common examples:

- `DOMContentLoaded`
- `load`
- `beforeunload`
- `error`
- `resize`
- `scroll`

```js
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM is ready");
});
```

`DOMContentLoaded` fires when the HTML has been parsed and the DOM is ready.
`load` waits for additional resources like images too.

## Clipboard Events

Clipboard events happen when the user copies, cuts, or pastes.

```js
const textarea = document.querySelector("textarea");

textarea.addEventListener("paste", (event) => {
  console.log("Pasted content");
});
```

Do not surprise users by blocking normal clipboard behavior without a strong
reason.

## Drag and Drop Events

Drag and drop interactions use events such as:

- `dragstart`
- `dragover`
- `drop`
- `dragend`

```js
dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  console.log(event.dataTransfer.files);
});
```

Drag and drop has its own details, but it still follows the same listener model.

## Custom Events

Your code can also create its own events.

```js
const event = new CustomEvent("cart:updated", {
  detail: { itemCount: 3 }
});

document.dispatchEvent(event);
```

Custom events are useful when separate parts of a page need to communicate
without calling each other directly.

## Choosing the Right Event

Ask what user action or browser change you really care about.

Examples:

- use `click` for button activation
- use `submit` for form submission
- use `input` for live typing feedback
- use `keydown` for keyboard shortcuts
- use `scroll` carefully for scroll-based UI
- use `pointerdown` for pointer interactions that should work across devices

## Summary

Events cover user input, form activity, page lifecycle, resources, scrolling,
resizing, clipboard actions, drag and drop, and custom application signals.

Knowing the main categories helps you choose the right event for the behavior
you want to build.
