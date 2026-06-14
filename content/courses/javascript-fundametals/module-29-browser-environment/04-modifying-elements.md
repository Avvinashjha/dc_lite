# Modifying Elements

After selecting or creating an element, JavaScript can modify it.

Common modifications include:

- changing text
- changing attributes
- changing classes
- changing styles
- adding or removing elements
- enabling or disabling controls

These changes update the live DOM and can affect what the user sees immediately.

## Changing Text

Use `textContent` for plain text.

```html
<p id="status">Loading...</p>
```

```js
const status = document.querySelector("#status");

status.textContent = "Ready";
```

`textContent` treats the value as text, not HTML.

```js
status.textContent = "<strong>Ready</strong>";
```

The page displays the characters `<strong>Ready</strong>`.

This is usually safer for user-controlled content.

## Changing HTML

Use `innerHTML` when you intentionally want to parse a string as HTML.

```js
const message = document.querySelector("#message");

message.innerHTML = "<strong>Saved</strong>";
```

Do not pass untrusted user input to `innerHTML`.

```js
const userComment = getUserComment();

message.innerHTML = userComment; // risky
```

Prefer:

```js
message.textContent = userComment;
```

## Changing Attributes

Attributes are values written in HTML.

```html
<img id="avatar" src="default.png" alt="Default avatar">
```

Use properties for many common attributes.

```js
const avatar = document.querySelector("#avatar");

avatar.src = "asha.png";
avatar.alt = "Asha profile photo";
```

You can also use `setAttribute()`.

```js
avatar.setAttribute("loading", "lazy");
```

Read attributes with `getAttribute()`.

```js
console.log(avatar.getAttribute("alt"));
```

Remove attributes with `removeAttribute()`.

```js
avatar.removeAttribute("loading");
```

## Boolean Attributes

Some attributes are boolean-like in HTML.

Examples:

- `disabled`
- `checked`
- `selected`
- `hidden`

Use properties when possible.

```js
const saveButton = document.querySelector("#save");

saveButton.disabled = true;
```

```js
saveButton.disabled = false;
```

## Working with Classes

Classes are commonly used for styling and state.

Use `classList`.

```js
const panel = document.querySelector(".panel");

panel.classList.add("open");
panel.classList.remove("closed");
```

Toggle a class:

```js
panel.classList.toggle("open");
```

Check whether a class exists:

```js
if (panel.classList.contains("open")) {
  console.log("Panel is open");
}
```

You can pass a second argument to `toggle()` to force the result.

```js
const isValid = false;

panel.classList.toggle("error", !isValid);
```

This adds `error` when `!isValid` is true and removes it when false.

## Changing Inline Styles

Elements have a `style` property for inline styles.

```js
const box = document.querySelector(".box");

box.style.backgroundColor = "tomato";
box.style.padding = "1rem";
```

CSS property names use camelCase in JavaScript.

```js
box.style.borderRadius = "8px";
```

Inline styles are useful for dynamic values.

For normal UI states, classes are often better.

```js
box.classList.add("warning");
```

CSS:

```css
.warning {
  background-color: tomato;
  padding: 1rem;
  border-radius: 8px;
}
```

Classes keep styling in CSS and behavior in JavaScript.

## Dataset Attributes

`data-*` attributes store custom values in HTML.

```html
<button data-product-id="42">Add to cart</button>
```

Use `dataset` to read them.

```js
const button = document.querySelector("button");

console.log(button.dataset.productId); // "42"
```

Notice the conversion:

- `data-product-id` in HTML
- `dataset.productId` in JavaScript

Dataset values are strings.

Convert them if you need numbers or booleans.

```js
const productId = Number(button.dataset.productId);
```

## Removing Elements

Use `remove()` to remove an element from the DOM.

```js
const alert = document.querySelector(".alert");

alert.remove();
```

To clear all children from an element, use `replaceChildren()`.

```js
const list = document.querySelector("#tasks");

list.replaceChildren();
```

You can also replace children with new nodes.

```js
const emptyState = document.createElement("p");

emptyState.textContent = "No tasks yet.";

list.replaceChildren(emptyState);
```

## Updating Form Controls

Form controls have useful properties.

```html
<input id="email" value="user@example.com">
<input id="subscribe" type="checkbox" checked>
```

```js
const email = document.querySelector("#email");
const subscribe = document.querySelector("#subscribe");

console.log(email.value);
console.log(subscribe.checked);
```

Update them with properties.

```js
email.value = "";
subscribe.checked = false;
```

## Reading Layout

Sometimes you need information about where an element is on the screen.

```js
const card = document.querySelector(".card");
const rect = card.getBoundingClientRect();

console.log(rect.top);
console.log(rect.width);
```

Be careful when mixing layout reads and writes repeatedly. That can force the browser to recalculate layout more often than needed.

Prefer grouping reads together and writes together in performance-sensitive code.

## Best Practices

- Use `textContent` for text.
- Use `classList` for visual states.
- Use properties for common attributes like `disabled`, `value`, `checked`, `src`, and `alt`.
- Use `dataset` for simple custom metadata.
- Avoid untrusted `innerHTML`.
- Keep DOM updates focused and easy to follow.

## Common Mistakes

This changes HTML, not plain text:

```js
output.innerHTML = userInput;
```

Use:

```js
output.textContent = userInput;
```

Another mistake is overwriting all classes.

```js
button.className = "active";
```

This removes every existing class. Prefer `classList` when adding or removing one state.

```js
button.classList.add("active");
```

## Summary

DOM modification is how browser JavaScript changes a page.

Use `textContent`, attributes, properties, `classList`, styles, and methods like `remove()` or `replaceChildren()` to update elements. Keep security in mind whenever a string is interpreted as HTML.
