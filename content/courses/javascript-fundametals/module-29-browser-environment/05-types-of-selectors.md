# Types of Selectors

Browser DOM methods like `querySelector()` and `querySelectorAll()` use CSS selectors.

If you understand selector types, you can find elements accurately and avoid brittle DOM code.

## Type Selectors

A type selector matches elements by tag name.

```js
const firstParagraph = document.querySelector("p");
const allButtons = document.querySelectorAll("button");
```

HTML:

```html
<p>First paragraph</p>
<p>Second paragraph</p>
<button>Save</button>
```

Type selectors are simple, but they can be too broad on large pages.

## ID Selectors

An ID selector starts with `#`.

```html
<h1 id="page-title">Settings</h1>
```

```js
const title = document.querySelector("#page-title");
```

IDs should be unique in a document.

Use IDs for important single elements, but avoid creating too many global dependencies around them.

## Class Selectors

A class selector starts with `.`.

```html
<button class="primary">Save</button>
<button class="secondary">Cancel</button>
```

```js
const primaryButton = document.querySelector(".primary");
const buttons = document.querySelectorAll(".primary, .secondary");
```

Classes are useful because multiple elements can share them.

They are often better than tag selectors when selecting repeated UI pieces.

## Attribute Selectors

Attribute selectors match elements with specific attributes.

```html
<input name="email" type="email">
<input name="password" type="password">
```

```js
const email = document.querySelector('[name="email"]');
const passwordFields = document.querySelectorAll('input[type="password"]');
```

Attribute selectors are useful for forms and `data-*` attributes.

```html
<button data-action="save">Save</button>
<button data-action="delete">Delete</button>
```

```js
const saveButton = document.querySelector('[data-action="save"]');
```

## Descendant Selectors

A descendant selector matches elements inside other elements.

```html
<nav>
  <a href="/home">Home</a>
</nav>

<main>
  <a href="/help">Help</a>
</main>
```

```js
const navLinks = document.querySelectorAll("nav a");
```

This selects only links inside `nav`.

## Child Selectors

A child selector uses `>`.

It matches direct children only.

```html
<ul class="menu">
  <li>Home</li>
  <li>
    Products
    <ul>
      <li>Books</li>
    </ul>
  </li>
</ul>
```

```js
const topLevelItems = document.querySelectorAll(".menu > li");
```

This selects only the direct `li` children of `.menu`.

## Combining Selectors

Selectors can be combined.

```html
<button class="primary" data-action="save">Save</button>
```

```js
const saveButton = document.querySelector('button.primary[data-action="save"]');
```

This means:

- a `button`
- with class `primary`
- with `data-action="save"`

Combined selectors can be useful, but do not make them more complicated than needed.

## Multiple Selectors

Use commas to match more than one selector.

```js
const controls = document.querySelectorAll("button, input, select, textarea");
```

This selects all listed element types.

## Pseudo-Classes

Some CSS pseudo-classes work in selectors.

```js
const checked = document.querySelectorAll("input:checked");
const disabledButtons = document.querySelectorAll("button:disabled");
const firstItem = document.querySelector("li:first-child");
```

These can be helpful for form state.

Not every CSS pseudo-class is useful or appropriate for JavaScript selection, but many common ones work.

## Escaping Special Characters

Selectors have syntax rules.

If an ID or class contains special characters, the selector may need escaping.

```html
<div id="user:42">Asha</div>
```

This selector can fail:

```js
document.querySelector("#user:42");
```

Use `CSS.escape()` when building selectors from dynamic values.

```js
const id = "user:42";
const element = document.querySelector(`#${CSS.escape(id)}`);
```

Avoid building selectors from user input unless you understand the escaping requirements.

## Selector Specificity vs DOM Selection

CSS specificity decides which style rule wins.

DOM selection does not use specificity to decide the "best" match.

`querySelector()` returns the first matching element in document order.

```js
const element = document.querySelector(".card .title");
```

If several elements match, only the first one is returned.

Use `querySelectorAll()` when you expect multiple matches.

## Choosing Good Selectors

Good JavaScript selectors are:

- stable
- readable
- scoped
- tied to behavior, not fragile styling details

This can be brittle:

```js
document.querySelector("main > div > div > button");
```

Small HTML changes can break it.

This is clearer:

```html
<button data-action="save-profile">Save</button>
```

```js
document.querySelector('[data-action="save-profile"]');
```

For larger projects, teams often use `data-*` attributes specifically for JavaScript hooks or tests.

## Best Practices

- Use class, ID, or `data-*` selectors for meaningful targets.
- Search inside a known container to avoid accidental matches.
- Avoid very long structure-based selectors.
- Use `CSS.escape()` for dynamic selector parts.
- Use `querySelectorAll()` when multiple elements should match.

## Common Mistakes

Forgetting the `#` for an ID:

```js
document.querySelector("submit-button"); // looks for a <submit-button> tag
```

Correct:

```js
document.querySelector("#submit-button");
```

Forgetting the `.` for a class:

```js
document.querySelector("active"); // looks for an <active> tag
```

Correct:

```js
document.querySelector(".active");
```

## Summary

Selectors connect your JavaScript to specific parts of the DOM.

Use simple, stable selectors when possible. Understand type, ID, class, attribute, descendant, child, combined, and pseudo-class selectors so your DOM code selects exactly what it means to select.
