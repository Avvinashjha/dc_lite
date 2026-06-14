# DOM and Event Debugging

DOM and event bugs happen when the page structure, event listeners, form values, or browser defaults do not match your assumptions.

DevTools help you inspect the live page instead of guessing from the source files.

## Check Whether the Element Exists

If code cannot update an element, first confirm that the selector finds it.

```js
const message = document.querySelector(".message");

console.log(message);
```

If the result is `null`, check:

- the selector spelling
- whether the element exists in the current page
- whether the script runs before the DOM is created
- whether the element is created later by JavaScript

For scripts that run before the page is ready, wait for `DOMContentLoaded`.

```js
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".save-button");
  console.log(button);
});
```

## Check the Live DOM

The Elements panel shows the current DOM.

This may differ from the original HTML.

JavaScript can:

- create elements
- remove elements
- change classes
- update attributes
- replace entire sections of the page

If an element disappeared, inspect the DOM after the action that caused the problem.

## Check Classes and Attributes

Many UI bugs are caused by a missing or unexpected class.

```js
menu.classList.toggle("open");
```

Inspect the element and check whether `open` is actually applied.

For attributes, inspect the current value.

```js
button.disabled = true;
input.setAttribute("aria-invalid", "true");
```

If the UI does not update, confirm that your code modifies the element you think it modifies.

## Check Event Listeners

If a click or submit handler does not run, check the listener setup.

```js
const button = document.querySelector(".save-button");

button.addEventListener("click", () => {
  console.log("save clicked");
});
```

Debug these questions:

- Is `button` `null`?
- Is the listener added more than once?
- Is another element receiving the click?
- Is the element disabled?
- Is the handler removed later?
- Does an earlier error stop the setup code?

Some DevTools can show event listeners attached to the selected DOM element.

## Event Target vs Current Target

In event handlers, `event.target` and `event.currentTarget` are different.

```js
list.addEventListener("click", (event) => {
  console.log("target:", event.target);
  console.log("currentTarget:", event.currentTarget);
});
```

`event.target` is the actual element that started the event.

`event.currentTarget` is the element whose listener is currently running.

This matters with event delegation.

```js
list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");

  if (!button) {
    return;
  }

  deleteItem(button.dataset.id);
});
```

If delegated events behave strangely, inspect both values.

## Preventing Default Browser Behavior

Forms submit by default.

If you handle a form with JavaScript, you often need `event.preventDefault()`.

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  console.log(Object.fromEntries(formData));
});
```

Without `preventDefault`, the page may reload before your debugging logs are useful.

Enable Preserve log in DevTools if you need to inspect logs during navigation.

## Event Propagation

Events usually bubble from the target element up through its ancestors.

```js
document.body.addEventListener("click", () => {
  console.log("body clicked");
});

button.addEventListener("click", () => {
  console.log("button clicked");
});
```

Clicking the button can run both handlers.

If a parent handler causes unexpected behavior, inspect propagation.

Use `event.stopPropagation()` only when you intentionally want to stop the event from continuing.

```js
button.addEventListener("click", (event) => {
  event.stopPropagation();
});
```

Do not add it as a random fix. It can break other listeners.

## Debugging Input Values

When form data is wrong, inspect the values at submit time.

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = form.elements.email.value;
  const password = form.elements.password.value;

  console.log({ email, passwordLength: password.length });
});
```

Avoid logging real passwords. Log length or presence instead.

For checkboxes, use `.checked`.

```js
const wantsUpdates = form.elements.newsletter.checked;
```

For selects, inspect `.value`.

```js
const plan = form.elements.plan.value;
```

## Mutation Breakpoints

Some DevTools let you pause when a DOM node changes.

This is useful when an element is removed or an attribute changes and you do not know which code did it.

Examples:

- pause when a subtree changes
- pause when an attribute changes
- pause when a node is removed

After DevTools pauses, inspect the call stack to find the code responsible.

## Debugging CSS vs JavaScript

Sometimes JavaScript works, but CSS hides the result.

If an element exists but is not visible, inspect:

- `display`
- `visibility`
- `opacity`
- `position`
- `z-index`
- dimensions
- overflow clipping

If the DOM has the right state but the page looks wrong, the problem may be CSS rather than JavaScript.

## Common Mistakes

Do not assume `querySelector` found an element. Check for `null`.

Do not attach listeners before the elements exist unless your script is deferred or waits for the DOM.

Do not confuse `event.target` with the element that owns the listener.

Do not log sensitive form values.

Do not use `stopPropagation` or `preventDefault` without understanding which browser behavior you are changing.

## Summary

DOM and event debugging focuses on the live page.

Check:

- whether elements exist
- current classes and attributes
- listener setup
- event target and current target
- default browser behavior
- propagation
- form values
- CSS visibility

Use the Elements panel, Console, event breakpoints, and the call stack together to find where the page state changes.
