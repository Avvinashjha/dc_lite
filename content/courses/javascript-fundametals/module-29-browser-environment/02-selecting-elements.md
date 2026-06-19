# Selecting Elements

Before JavaScript can update a page, it usually needs to find the right element.

The DOM gives you several methods for selecting elements from the document.

The most common modern methods are:

- `document.querySelector()`
- `document.querySelectorAll()`
- `element.querySelector()`
- `element.querySelectorAll()`

These methods use CSS selectors.

## Selecting One Element

Use `querySelector()` to find the first matching element.

```html
<h1 id="page-title">Dashboard</h1>
```

```js
const title = document.querySelector("#page-title");

console.log(title.textContent); // "Dashboard"
```

If no element matches, `querySelector()` returns `null`.

```js
const missing = document.querySelector(".does-not-exist");

console.log(missing); // null
```

Always remember that a selected element may not exist.

```js
const message = document.querySelector("#message");

if (message) {
  message.textContent = "Saved";
}
```

## Selecting Multiple Elements

Use `querySelectorAll()` to find all matching elements.

```html
<li class="task">Write HTML</li>
<li class="task">Add CSS</li>
<li class="task">Use JavaScript</li>
```

```js
const tasks = document.querySelectorAll(".task");

console.log(tasks.length); // 3
```

`querySelectorAll()` returns a `NodeList`.

You can loop over it with `for...of` or `forEach()`.

```js
const tasks = document.querySelectorAll(".task");

for (const task of tasks) {
  console.log(task.textContent);
}
```

```js
tasks.forEach((task) => {
  task.classList.add("highlight");
});
```

## Selecting Inside an Element

You do not always need to search the whole document.

If you already have a container, search inside it.

```html
<section id="profile">
  <h2>Asha</h2>
  <button>Edit</button>
</section>
```

```js
const profile = document.querySelector("#profile");
const editButton = profile.querySelector("button");

console.log(editButton.textContent); // "Edit"
```

This is useful when a page has repeated sections.

```js
const cards = document.querySelectorAll(".product-card");

for (const card of cards) {
  const button = card.querySelector("button");
  const name = card.querySelector(".product-name");

  button.addEventListener("click", () => {
    console.log(`Selected ${name.textContent}`);
  });
}
```

Each card looks up its own button and name.

## Older Selection Methods

You will also see older DOM selection methods.

```js
document.getElementById("page-title");
document.getElementsByClassName("task");
document.getElementsByTagName("li");
```

`getElementById()` is still common and fast.

```js
const form = document.getElementById("signup-form");
```

The `getElementsBy...` methods return live collections, which can update automatically when the DOM changes.

That behavior can surprise beginners.

```js
const items = document.getElementsByClassName("item");

console.log(items.length);
```

For most beginner code, `querySelector()` and `querySelectorAll()` are easier to reason about.

## Static NodeList vs Live Collection

`querySelectorAll()` returns a static `NodeList`.

It does not automatically update when new matching elements are added.

```js
const items = document.querySelectorAll(".item");

document.body.insertAdjacentHTML("beforeend", `<p class="item">New</p>`);

console.log(items.length); // still the original count
```

If you need the latest elements, select again.

```js
const updatedItems = document.querySelectorAll(".item");
```

Live collections from methods like `getElementsByClassName()` behave differently.

```js
const liveItems = document.getElementsByClassName("item");

document.body.insertAdjacentHTML("beforeend", `<p class="item">New</p>`);

console.log(liveItems.length); // updated count
```

Live collections can be useful, but static results are often simpler.

## Useful Element Properties

After selecting an element, you can inspect it.

```js
const button = document.querySelector("button");

console.log(button.id);
console.log(button.className);
console.log(button.textContent);
console.log(button.dataset.action);
```

HTML:

```html
<button id="save-button" class="primary" data-action="save">
  Save
</button>
```

`dataset` gives access to `data-*` attributes.

```js
console.log(button.dataset.action); // "save"
```

## Checking Matches and Closest Ancestors

Elements also have selection-related methods.

`matches()` checks whether an element matches a selector.

```js
const button = document.querySelector("button");

console.log(button.matches(".primary"));
```

`closest()` walks up the DOM tree until it finds a matching ancestor.

```html
<article class="card">
  <button>Buy</button>
</article>
```

```js
const button = document.querySelector("button");
const card = button.closest(".card");

console.log(card);
```

`closest()` is especially useful in event handlers.

## Best Practices

- Prefer `querySelector()` for one element.
- Prefer `querySelectorAll()` for multiple elements.
- Use specific selectors that describe intent.
- Search inside a container when possible.
- Handle `null` when an element may not exist.
- Avoid depending on live collections unless you intentionally need them.

## Common Mistakes

This fails when the element is missing:

```js
document.querySelector("#status").textContent = "Ready";
```

Better:

```js
const status = document.querySelector("#status");

if (status) {
  status.textContent = "Ready";
}
```

Another mistake is treating a `NodeList` as a single element.

```js
const buttons = document.querySelectorAll("button");

buttons.textContent = "Click"; // wrong
```

Loop over the collection instead.

```js
const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
  button.textContent = "Click";
});
```

## Summary

DOM selection is the first step in most browser interactions.

Use `querySelector()` for one element and `querySelectorAll()` for many. Remember that selectors can fail, collections are not the same as elements, and searching within a container often makes code clearer.
