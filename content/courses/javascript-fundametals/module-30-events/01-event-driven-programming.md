# Event-Driven Programming

Events are how browser pages react to what happens.

Instead of running one long script from top to bottom, interactive pages wait for
events and respond when they occur.

Examples:

- a user clicks a button
- a user types into a search box
- a form is submitted
- an image finishes loading
- a network request completes
- the page scrolls
- a timer finishes

This style is called event-driven programming.

## The Basic Idea

In event-driven code, you usually describe:

1. What should be watched.
2. Which event should be watched.
3. What function should run when the event happens.

```js
const button = document.querySelector("#save");

button.addEventListener("click", () => {
  console.log("Save button clicked");
});
```

The function does not run immediately.

It runs later, when the `click` event happens.

## Events Connect JavaScript to the Browser

JavaScript can create variables, call functions, work with arrays, and make API
requests on its own.

Events are different because they connect your code to browser activity.

```js
const input = document.querySelector("#username");

input.addEventListener("input", () => {
  console.log(input.value);
});
```

Every time the user changes the input, the browser creates an `input` event.
Your listener function responds to it.

## Event Listeners

A function that runs because of an event is often called an event listener or
event handler.

```js
function handleClick() {
  console.log("Clicked");
}

button.addEventListener("click", handleClick);
```

Important:

```text
You pass the function itself.
You do not call it immediately.
```

Correct:

```js
button.addEventListener("click", handleClick);
```

Incorrect:

```js
button.addEventListener("click", handleClick());
```

The incorrect version calls `handleClick` right away and passes its return value
as the listener.

## The Browser Keeps Running

After registering a listener, the script can finish.

The browser keeps the page alive and calls your listener when the event happens.

```js
console.log("Before listener");

button.addEventListener("click", () => {
  console.log("Button clicked later");
});

console.log("After listener");
```

Output when the page loads:

```text
Before listener
After listener
```

Output after the user clicks:

```text
Button clicked later
```

## Events Are Usually Asynchronous

Most event handlers run later, after the current script has finished.

This connects to the event loop you learned earlier:

1. The browser notices an event.
2. The browser queues work for JavaScript.
3. JavaScript runs your handler when the call stack is available.

That means event handlers should be small and focused. A slow event handler can
make the page feel frozen.

## Common Event-Driven UI Pattern

Many UI features follow this structure:

```js
const form = document.querySelector("#signup-form");
const message = document.querySelector("#message");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  message.textContent = "Thanks for signing up!";
});
```

The page waits for the form submission. When it happens, JavaScript prevents the
default browser action and updates the DOM.

## Best Practices

- Register listeners after the elements exist in the DOM.
- Keep handlers short when possible.
- Give handler functions clear names for important behavior.
- Use `addEventListener` instead of inline HTML event attributes.
- Avoid doing heavy work directly inside frequent events like `scroll` or
  `mousemove`.

## Common Mistakes

Calling the handler immediately:

```js
button.addEventListener("click", saveUser());
```

Selecting an element before it exists:

```js
const button = document.querySelector("#save"); // null if the element is not loaded yet
button.addEventListener("click", handleSave);
```

Doing too much work in one handler:

```js
window.addEventListener("scroll", () => {
  // Expensive work on every tiny scroll movement can hurt performance.
});
```

## Summary

Event-driven programming lets JavaScript respond to browser activity.

You register listener functions, and the browser calls them later when matching
events happen. This is the foundation of interactive web pages.
