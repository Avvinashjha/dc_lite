# Keyboard, Form, and Input Events

Keyboard and form events are central to real web applications.

They let users search, submit data, navigate interfaces, and receive feedback
while they type.

## Keyboard Events

The most common keyboard events are `keydown` and `keyup`.

```js
document.addEventListener("keydown", (event) => {
  console.log(event.key);
});
```

Use `event.key` for readable values:

- `"Enter"`
- `"Escape"`
- `"Tab"`
- `"ArrowUp"`
- `"ArrowDown"`
- `"a"`

## Keyboard Shortcuts

```js
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});
```

For modifier keys, check properties such as `ctrlKey`, `metaKey`, `shiftKey`,
and `altKey`.

```js
document.addEventListener("keydown", (event) => {
  const isSaveShortcut = (event.ctrlKey || event.metaKey) && event.key === "s";

  if (isSaveShortcut) {
    event.preventDefault();
    saveDraft();
  }
});
```

On macOS, many shortcuts use `metaKey`. On Windows and Linux, many use `ctrlKey`.

## Be Careful with Global Shortcuts

Global keyboard listeners can interfere with typing.

```js
document.addEventListener("keydown", (event) => {
  if (event.key === "s") {
    // This would run even while the user is typing in an input.
  }
});
```

Check where the event started.

```js
document.addEventListener("keydown", (event) => {
  const isTypingField = event.target.matches("input, textarea, select");

  if (isTypingField) {
    return;
  }

  if (event.key === "s") {
    openSearch();
  }
});
```

## Form Submission

Use the form's `submit` event instead of a button's `click` event when handling a
form.

```html
<form id="login-form">
  <input name="email" type="email" required>
  <input name="password" type="password" required>
  <button>Log in</button>
</form>
```

```js
const form = document.querySelector("#login-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  console.log(formData.get("email"));
});
```

The `submit` event works when the user clicks the button or presses Enter in a
field.

## `input` vs `change`

`input` fires whenever the value changes.

```js
search.addEventListener("input", () => {
  console.log(search.value);
});
```

`change` fires when the user commits the change.

```js
themeSelect.addEventListener("change", () => {
  document.body.dataset.theme = themeSelect.value;
});
```

Use `input` for live previews, search suggestions, counters, and instant
validation.

Use `change` for select boxes, checkboxes, radio groups, and settings where the
committed value matters.

## Focus and Blur

Focus events help you respond when users enter or leave fields.

```js
email.addEventListener("focus", () => {
  email.classList.add("is-active");
});

email.addEventListener("blur", () => {
  email.classList.remove("is-active");
});
```

`focus` and `blur` do not bubble. For delegated focus handling, use `focusin`
and `focusout`.

```js
form.addEventListener("focusin", (event) => {
  event.target.classList.add("is-focused");
});
```

## Basic Form Validation

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = form.elements.email.value.trim();

  if (!email.includes("@")) {
    showError("Enter a valid email address.");
    return;
  }

  submitEmail(email);
});
```

Let HTML validation help too:

```html
<input name="email" type="email" required>
```

JavaScript validation can improve the experience, but server-side validation is
still required for real applications.

## Accessibility Considerations

Interactive controls should work with a keyboard.

Prefer semantic elements:

- use `<button>` for actions
- use `<a>` for navigation
- use `<label>` with form inputs
- use real form controls when possible

Avoid building keyboard behavior from scratch unless necessary.

```html
<label>
  Email
  <input name="email" type="email">
</label>
```

When you do add keyboard behavior, support expected keys such as Enter, Escape,
Tab, and arrow keys based on the component.

## Summary

Keyboard, form, input, focus, and change events make pages usable beyond simple
clicks.

Use `submit` for forms, `input` for live value changes, `change` for committed
changes, and semantic HTML for accessible interaction.
