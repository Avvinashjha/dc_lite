# Event Capturing

Event capturing is the phase before an event reaches its target.

During capturing, the event travels from the top of the page down toward the
element where the event started.

## The Three Event Phases

Many DOM events move through three phases:

1. Capturing phase: from `window` down toward the target.
2. Target phase: on the target element.
3. Bubbling phase: from the target back up through ancestors.

For a button inside a panel, the full journey looks like this:

```text
window -> document -> html -> body -> panel -> button -> panel -> body -> html -> document -> window
```

The first half is capturing.

The second half is bubbling.

## Listening During Capture

By default, listeners run during the bubbling phase.

To listen during the capturing phase, pass `{ capture: true }`.

```js
const panel = document.querySelector("#panel");
const button = document.querySelector("#save");

panel.addEventListener(
  "click",
  () => {
    console.log("panel capture");
  },
  { capture: true }
);

button.addEventListener("click", () => {
  console.log("button");
});

panel.addEventListener("click", () => {
  console.log("panel bubble");
});
```

If the user clicks the button, the output is:

```text
panel capture
button
panel bubble
```

## Why Capture Exists

Capture lets an ancestor see an event before the target handles it.

This can be useful for:

- global analytics
- modal or menu outside-click detection
- low-level UI libraries
- observing events before child components respond

Most beginner application code uses bubbling more often than capturing.

## Capture and `currentTarget`

During capture, `event.target` is still the original target.

`event.currentTarget` is the element whose listener is running.

```js
document.addEventListener(
  "click",
  (event) => {
    console.log(event.target);
    console.log(event.currentTarget);
  },
  { capture: true }
);
```

If the user clicked a button, `target` may be the button and `currentTarget` is
the document.

## Capture Is Not a Replacement for Delegation

Event delegation usually relies on bubbling.

```js
list.addEventListener("click", (event) => {
  if (event.target.matches(".delete")) {
    event.target.closest("li").remove();
  }
});
```

You rarely need capture for ordinary delegated click behavior.

Use capture when the order matters and the ancestor must observe the event before
the target or bubbling listeners.

## Removing Capture Listeners

When removing a listener that was added with capture, the capture setting must
match.

```js
function handleClick(event) {
  console.log(event.target);
}

document.addEventListener("click", handleClick, { capture: true });
document.removeEventListener("click", handleClick, { capture: true });
```

If you omit the matching capture option during removal, the listener may remain.

## Common Mistakes

Using capture without understanding listener order:

```js
document.addEventListener("click", handleClick, { capture: true });
```

This listener runs before normal bubbling listeners lower in the page.

Assuming every event behaves exactly the same:

```text
Some events do not bubble, and some browser APIs have special behavior.
Always check the event you are working with.
```

## Summary

Event capturing is the downward phase of event propagation.

Most everyday event handling uses bubbling, but capture is useful when an
ancestor needs to observe an event before the target and bubbling listeners run.
