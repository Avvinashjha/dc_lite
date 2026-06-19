# Creating Elements

JavaScript can create new DOM elements while the page is running.

This is useful when content comes from:

- user input
- an API response
- an array of data
- application state
- a timer or event

Instead of writing every element in the original HTML, your script can build parts of the page dynamically.

## Creating an Element

Use `document.createElement()` to create an element.

```js
const paragraph = document.createElement("p");

paragraph.textContent = "Hello from JavaScript";
```

At this point, the element exists in memory but is not visible on the page.

You need to add it to the DOM.

```js
document.body.append(paragraph);
```

## Appending Elements

`append()` adds content at the end of an element.

```html
<ul id="tasks"></ul>
```

```js
const list = document.querySelector("#tasks");
const item = document.createElement("li");

item.textContent = "Learn the DOM";

list.append(item);
```

Result:

```html
<ul id="tasks">
  <li>Learn the DOM</li>
</ul>
```

`append()` can also append text.

```js
const note = document.createElement("p");

note.append("Saved successfully");
```

## `append()` vs `appendChild()`

You may see both methods.

```js
parent.append(child);
parent.appendChild(child);
```

`append()` is more flexible because it can accept nodes and strings.

```js
const message = document.createElement("p");

message.append("Status: ", "Ready");
```

`appendChild()` accepts only a node and returns the appended child.

For most beginner code, `append()` is easier.

## Adding Content Before or After

There are several insertion methods.

```js
element.before(newNode);
element.after(newNode);
element.prepend(newNode);
element.append(newNode);
```

Example:

```html
<main id="app">
  <h1>Tasks</h1>
</main>
```

```js
const app = document.querySelector("#app");
const heading = app.querySelector("h1");
const intro = document.createElement("p");

intro.textContent = "Here are your tasks for today.";

heading.after(intro);
```

## Building a List from Data

Dynamic rendering usually starts with data.

```js
const tasks = [
  { id: 1, title: "Review notes", done: true },
  { id: 2, title: "Practice selectors", done: false },
  { id: 3, title: "Build a list", done: false },
];
```

Create DOM elements from each item.

```js
const list = document.querySelector("#tasks");

for (const task of tasks) {
  const item = document.createElement("li");

  item.textContent = task.title;

  if (task.done) {
    item.classList.add("completed");
  }

  list.append(item);
}
```

HTML:

```html
<ul id="tasks"></ul>
```

This pattern is common in browser apps:

1. Keep data in JavaScript.
2. Create elements from the data.
3. Add the elements to the DOM.

## Creating Nested Elements

Many UI pieces need nested elements.

```js
const card = document.createElement("article");
const title = document.createElement("h2");
const description = document.createElement("p");
const button = document.createElement("button");

card.classList.add("product-card");
title.textContent = "Notebook";
description.textContent = "A ruled notebook for daily notes.";
button.textContent = "Add to cart";

card.append(title, description, button);

document.querySelector("#products").append(card);
```

This creates a card structure without using a large string of HTML.

## Using `DocumentFragment`

Adding many elements one at a time can cause unnecessary browser work.

For larger lists, build them in a `DocumentFragment` first.

```js
const fragment = document.createDocumentFragment();

for (const task of tasks) {
  const item = document.createElement("li");

  item.textContent = task.title;
  fragment.append(item);
}

document.querySelector("#tasks").append(fragment);
```

A fragment is a temporary container. When it is appended, its children move into the real DOM.

This keeps repeated DOM updates more efficient.

## `innerHTML` and Security

Another way to create elements is with `innerHTML`.

```js
const card = document.querySelector("#card");

card.innerHTML = `
  <h2>Notebook</h2>
  <p>A ruled notebook for daily notes.</p>
`;
```

This can be convenient for trusted markup.

But it can be dangerous with user-controlled content.

```js
const comment = getCommentFromUser();

document.querySelector("#comments").innerHTML = comment; // risky
```

If `comment` contains HTML or a script-like payload, it may create a cross-site scripting problem.

Prefer `textContent` when inserting plain user text.

```js
const commentElement = document.createElement("p");

commentElement.textContent = getCommentFromUser();

document.querySelector("#comments").append(commentElement);
```

## Template Elements

HTML has a `<template>` element for reusable markup.

```html
<template id="task-template">
  <li>
    <span class="task-title"></span>
    <button>Done</button>
  </li>
</template>

<ul id="tasks"></ul>
```

```js
const template = document.querySelector("#task-template");
const list = document.querySelector("#tasks");

const copy = template.content.cloneNode(true);

copy.querySelector(".task-title").textContent = "Read about templates";

list.append(copy);
```

Templates are useful when the HTML structure is easier to read in markup than in JavaScript.

## Best Practices

- Use `createElement()` and `textContent` for untrusted text.
- Build elements from data instead of duplicating HTML manually.
- Use `DocumentFragment` for large batches.
- Keep creation code readable by breaking complex UI into helper functions.
- Avoid assigning user input directly to `innerHTML`.

## Common Mistakes

Creating an element does not automatically display it.

```js
const item = document.createElement("li");
item.textContent = "New task";

// Nothing appears until you append it.
```

Append it to a visible parent.

```js
document.querySelector("#tasks").append(item);
```

Another mistake is reusing the same element in multiple places.

```js
const badge = document.createElement("span");

firstCard.append(badge);
secondCard.append(badge);
```

A DOM node can only be in one place at a time. The second append moves it.

Create separate elements or clone the node.

```js
secondCard.append(badge.cloneNode(true));
```

## Summary

DOM creation lets JavaScript build page content dynamically.

Use `document.createElement()` to create nodes, set safe content with `textContent`, and add nodes with methods like `append()`, `prepend()`, `before()`, and `after()`. Use `innerHTML` carefully because it parses strings as HTML.
