# Browser Runtime and the DOM

JavaScript can run in more than one environment.

In earlier modules, you learned the core language: values, functions, objects, classes, modules, promises, the event loop, security, performance, testing, and debugging.

The browser environment adds another layer.

It gives JavaScript access to web-page features such as:

- the current browser window
- the loaded HTML document
- DOM nodes and styles
- user events
- timers
- storage
- navigation
- network requests
- DevTools

## JavaScript Engine vs Browser Runtime

The JavaScript engine runs the language itself.

Examples of engines:

- V8 in Chrome and Edge
- SpiderMonkey in Firefox
- JavaScriptCore in Safari

The engine understands things like variables, functions, objects, promises, and classes.

The browser runtime provides web APIs around the engine.

Examples:

- `document`
- `window`
- `setTimeout`
- `fetch`
- `localStorage`
- `history`
- `location`
- `addEventListener`

These are not part of the core JavaScript language. They are browser-provided APIs.

```js
console.log(Array); // JavaScript language feature
console.log(document); // Browser-provided API
```

This is why browser code and Node.js code do not always have the same globals.

## The `window` Object

In a normal browser page, `window` represents the browser window or tab.

It is the top-level global object for classic browser scripts.

```js
console.log(window.innerWidth);
console.log(window.location.href);
```

Many browser globals are properties of `window`.

```js
console.log(window.document === document); // true
console.log(window.setTimeout === setTimeout); // true
```

When you write a top-level `var` in a classic script, it becomes a property of `window`.

```html
<script>
  var username = "Asha";

  console.log(window.username); // "Asha"
</script>
```

Top-level `let` and `const` do not become `window` properties.

```html
<script>
  let theme = "dark";

  console.log(window.theme); // undefined
</script>
```

Prefer `let`, `const`, modules, and explicit imports. Avoid relying on global variables.

## The `document` Object

`document` represents the HTML page loaded in the current tab.

It gives JavaScript a structured way to inspect and change the page.

```js
console.log(document.title);
console.log(document.body);
```

You can use `document` to:

- find elements
- create elements
- update text
- change attributes
- attach event listeners
- add or remove parts of the page

## What Is the DOM?

DOM stands for Document Object Model.

The browser reads HTML and builds an object tree from it.

HTML:

```html
<main>
  <h1>Products</h1>
  <button>Add item</button>
</main>
```

DOM structure:

```text
document
+-- html
    +-- body
        +-- main
            +-- h1
            +-- button
```

Each element becomes a DOM node that JavaScript can work with.

```js
const heading = document.querySelector("h1");

console.log(heading.textContent); // "Products"
```

## HTML Source vs Live DOM

The HTML source is the original text sent by the server or written in the file.

The DOM is the live structure the browser is using right now.

JavaScript can change the DOM after the page loads.

```js
document.title = "Updated title";
document.body.append("Loaded with JavaScript");
```

Those changes may not appear in the original HTML file, but they affect what the user sees.

## DOM Nodes and Elements

The DOM contains different kinds of nodes.

Common node types:

- document nodes
- element nodes
- text nodes
- comment nodes

Most beginner DOM work focuses on element nodes.

```js
const card = document.querySelector(".card");

console.log(card instanceof Element); // true
```

Text inside an element is also represented in the DOM.

```html
<p>Hello</p>
```

The `<p>` is an element node. The word `Hello` is a text node inside it.

## DOM Changes Are Side Effects

Changing the DOM is a side effect.

```js
function showMessage(message) {
  document.querySelector("#status").textContent = message;
}
```

This function does not just return a value. It changes the page.

Side effects are normal in browser programming, but keep them easy to find.

A useful pattern is to separate:

- data calculations
- DOM updates
- event handling

```js
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function renderPrice(price) {
  document.querySelector("#price").textContent = formatPrice(price);
}
```

## When DOM Code Runs

DOM code needs the elements to exist before it selects them.

If a script runs before the element is parsed, the result can be `null`.

```html
<script>
  const button = document.querySelector("button");

  console.log(button); // null if the button has not been parsed yet
</script>

<button>Save</button>
```

Common fixes:

- place the script near the end of `<body>`
- use the `defer` attribute
- listen for `DOMContentLoaded`

```html
<script defer src="app.js"></script>
```

Or:

```js
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("button");

  console.log(button.textContent);
});
```

You will learn more about script loading later in this module.

## Best Practices

- Treat `window` and `document` as browser-specific APIs.
- Prefer `const` and `let` instead of global `var`.
- Keep DOM update logic small and focused.
- Select elements only after they exist.
- Remember that the DOM is live and can change after the page loads.

## Common Mistakes

```js
const title = document.querySelector("#title");

title.textContent = "Hello";
```

This fails if no element with `id="title"` exists.

Safer:

```js
const title = document.querySelector("#title");

if (title) {
  title.textContent = "Hello";
}
```

Another common mistake is assuming browser APIs exist everywhere.

```js
console.log(document.title);
```

This works in a browser page. It does not work in plain Node.js unless a DOM-like environment is provided.

## Summary

The browser environment combines the JavaScript engine with web APIs.

`window` represents the browser tab. `document` represents the loaded page. The DOM is the live object model of the HTML document.

Browser JavaScript is powerful because it can react to users, change the page, store data, navigate, and communicate with servers. It also requires care because those actions are side effects that depend on the browser runtime.
