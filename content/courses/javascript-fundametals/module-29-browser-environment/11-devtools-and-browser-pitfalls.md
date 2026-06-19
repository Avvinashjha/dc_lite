# DevTools and Browser Pitfalls

Browser development includes more than writing JavaScript.

You also need to inspect the page, debug runtime behavior, understand network requests, and avoid browser-specific mistakes.

Browser DevTools are the main tool for that work.

## Opening DevTools

Most browsers provide DevTools.

Common ways to open them:

- right-click the page and choose Inspect
- use the browser menu
- use a keyboard shortcut such as `Cmd+Option+I` on macOS or `Ctrl+Shift+I` on Windows and Linux

DevTools panels vary by browser, but the core ideas are similar.

## Elements Panel

The Elements panel shows the live DOM and CSS.

Use it to:

- inspect selected elements
- see applied CSS rules
- toggle classes
- edit attributes temporarily
- check layout and box model values

Remember that this is the live DOM, not necessarily the original HTML source.

If JavaScript adds an element after page load, it appears in the Elements panel even if it was not in the original file.

## Console Panel

The Console shows logs, warnings, and errors.

```js
console.log("Loaded");
console.warn("Missing optional setting");
console.error("Something failed");
```

You can also run JavaScript expressions in the console.

```js
document.querySelector("h1").textContent
```

Avoid leaving noisy debug logs in production code unless they are intentional.

## Sources Panel and Breakpoints

The Sources panel lets you debug JavaScript.

Useful features:

- breakpoints
- stepping through code
- inspecting variables
- watching expressions
- viewing call stacks

Breakpoints are often better than adding many `console.log()` calls.

You can pause exactly where a bug happens and inspect the program state.

## Network Panel

The Network panel shows browser requests.

Use it to inspect:

- request URLs
- methods
- status codes
- headers
- request payloads
- response bodies
- timing
- CORS-related failures

When a `fetch()` call fails, check the Network panel before guessing.

You can often see whether:

- the request was sent
- the server responded
- the status was 404 or 500
- the response was blocked by CORS
- the response body was not valid JSON

## Application Panel

The Application panel shows browser storage and app-related data.

Depending on the browser, it may include:

- local storage
- session storage
- cookies
- IndexedDB
- cache storage
- service workers

Use it to inspect what your page stored.

This is useful when debugging login state, preferences, or stale data.

## Performance Panel

The Performance panel helps identify slow rendering and JavaScript work.

Use it when the page:

- feels frozen
- scrolls poorly
- responds slowly to input
- has expensive animations

Performance tools can show long tasks, layout work, rendering updates, and function call timing.

Measure before optimizing. Guessing often leads to unnecessary changes.

## Common Pitfall: Running Before the DOM Exists

This code can fail:

```html
<script src="app.js"></script>
<button id="save">Save</button>
```

```js
const button = document.querySelector("#save");

button.addEventListener("click", save);
```

If the script runs before the button is parsed, `button` is `null`.

Use `defer`, move the script after the HTML, or wait for `DOMContentLoaded`.

```html
<script defer src="app.js"></script>
```

## Common Pitfall: Confusing Attributes and Properties

Attributes come from HTML.

Properties are values on DOM objects.

They often reflect each other, but not always exactly.

```html
<input id="name" value="Asha">
```

```js
const input = document.querySelector("#name");

input.value = "Mina";

console.log(input.getAttribute("value")); // "Asha"
console.log(input.value); // "Mina"
```

For current form values, use properties like `value` and `checked`.

## Common Pitfall: Trusting User HTML

Do not insert untrusted strings as HTML.

```js
comments.innerHTML = userComment;
```

Use `textContent` for plain text.

```js
const comment = document.createElement("p");

comment.textContent = userComment;
comments.append(comment);
```

This helps prevent cross-site scripting vulnerabilities.

## Common Pitfall: Assuming Browser APIs Are Always Available

Some APIs require HTTPS, permissions, or specific browser support.

```js
await navigator.clipboard.writeText("Copied");
```

This may fail if the API is unavailable, permission is denied, or the page is not in a secure context.

Use feature detection and handle errors.

```js
async function copyText(text) {
  if (!("clipboard" in navigator)) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
```

## Common Pitfall: Stale DOM References

A selected element can become stale if it is removed or replaced.

```js
const button = document.querySelector("#save");

document.querySelector("#toolbar").innerHTML = `<button id="save">Save</button>`;

button.addEventListener("click", save); // attaches to the old removed button
```

If you replace a DOM subtree, select the new elements afterward or use event delegation.

## Common Pitfall: Browser Cache

Sometimes the browser uses cached files.

If a change does not appear:

- hard refresh the page
- check the Network panel
- disable cache while DevTools is open
- confirm the correct file is loaded

This is especially common with CSS, JavaScript bundles, and service workers.

## Debugging Checklist

When browser JavaScript does not work, ask:

1. Is the script loaded?
2. Did it run before the DOM existed?
3. Are there console errors?
4. Does the selector match an element?
5. Is the event listener attached?
6. Did the browser prevent a default action?
7. Did a network request fail?
8. Is data stored differently than expected?
9. Is a browser security rule involved?
10. Is the API supported in this browser?

## Best Practices

- Use DevTools early instead of guessing.
- Check the Console and Network panels for runtime evidence.
- Inspect the live DOM in the Elements panel.
- Use breakpoints for complex bugs.
- Treat browser cache and stale state as possible causes.
- Keep security and compatibility in mind when using browser APIs.

## Summary

DevTools help you see what the browser is actually doing.

Use the Elements, Console, Sources, Network, Application, and Performance panels to debug DOM updates, JavaScript errors, API requests, storage, and responsiveness. Many browser bugs come from timing, selectors, security boundaries, stale references, or unsupported APIs.
