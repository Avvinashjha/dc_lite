# Browser DevTools

Browser DevTools are built into modern browsers.

They let you inspect the page, run JavaScript, debug source code, watch network requests, check storage, and measure performance.

Most browsers have similar tools. The exact labels may differ, but the ideas are the same.

## Opening DevTools

Common ways to open DevTools:

- Right-click the page and choose Inspect
- Press `Cmd+Option+I` on macOS
- Press `Ctrl+Shift+I` on Windows or Linux
- Use the browser menu and choose Developer Tools

You will usually see several panels:

- Elements
- Console
- Sources
- Network
- Application or Storage
- Performance
- Memory

You do not need to master every panel at once. Start with the panels that answer your current question.

## Elements Panel

The Elements panel shows the current DOM.

It is useful when the page does not look the way you expected.

You can inspect:

- which elements exist
- which classes and attributes are applied
- which CSS rules are active
- which CSS rules are crossed out
- the layout box model

For example, if a button is invisible, inspect it and ask:

- Does the button exist in the DOM?
- Is it hidden with `display: none`, `visibility: hidden`, or `opacity: 0`?
- Is another element covering it?
- Is the expected class missing?

The Elements panel shows the page as it exists now, not only the original HTML.

That matters because JavaScript can create, remove, or modify elements after the page loads.

## Console Panel

The Console panel displays logs, warnings, errors, and JavaScript evaluation results.

You can run expressions directly in the console.

```js
document.querySelector("button");
```

You can also inspect application state if it is available globally.

```js
localStorage.getItem("theme");
```

Be careful when running code in the console. You are executing real JavaScript in the current page.

## Sources Panel

The Sources panel shows JavaScript files loaded by the page.

It is where you set breakpoints and step through code.

Use it when logs are not enough and you need to see exactly how code executes line by line.

The Sources panel can help answer:

- Did this function run?
- Which branch did the code take?
- What is the value of this variable at this line?
- What does `this` refer to here?
- What is in the closure scope?

You will use this panel heavily in the next lesson.

## Network Panel

The Network panel shows requests made by the page.

It is essential for debugging API problems.

For each request, you can inspect:

- URL
- method
- status code
- request headers
- response headers
- request payload
- response body
- timing

If an API call fails, the Network panel is usually more reliable than guessing from the UI.

For example, a login form might show "Something went wrong."

The Network panel can show whether the actual problem was:

- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `500 Internal Server Error`
- a CORS failure
- a request that never happened

## Application or Storage Panel

The Application panel in Chrome, or Storage panel in some browsers, shows browser storage.

You can inspect:

- cookies
- `localStorage`
- `sessionStorage`
- IndexedDB
- cache storage
- service workers

This is useful when a bug depends on stored state.

For example:

```js
localStorage.setItem("theme", "dark");
```

If the app starts in the wrong theme, check whether `localStorage` contains an old or unexpected value.

## Preserving Logs

By default, the console and network request list may clear when the page reloads.

Enable Preserve log when debugging problems that happen during navigation or refresh.

This is especially useful for:

- login redirects
- page-load errors
- failed form submissions
- requests that happen before you can open the panel

## Disabling Cache

When DevTools is open, browsers usually let you disable the cache.

This helps when your page keeps loading an old JavaScript or CSS file.

If a fix appears to have no effect, check whether the browser is using a cached asset.

## Device and Responsive Tools

DevTools can simulate different screen sizes.

Use responsive tools when a bug only happens on mobile widths.

This does not perfectly replace testing on real devices, but it helps catch layout and interaction issues quickly.

## Reading Error Locations

Browser errors often include a file name, line, and column.

```text
Uncaught TypeError: Cannot read properties of undefined (reading 'name')
    at renderUser (user-card.js:14:21)
    at app.js:32:3
```

Clicking the file location usually opens that line in the Sources panel.

Start at the top frame that belongs to your code.

Library or browser internals may appear in the stack trace, but your code is usually where the incorrect value was created or passed.

## A Practical DevTools Workflow

When something is broken:

1. Check the Console for errors.
2. Check the Network panel if the problem involves data from a server.
3. Inspect the DOM if the problem is visual or event-related.
4. Use Sources and breakpoints when you need to follow the code path.
5. Check storage when the bug depends on saved state.

DevTools are most effective when you choose the panel that matches the symptom.

## Common Mistakes

Do not assume the DOM matches the original HTML file. JavaScript may have changed it.

Do not debug API failures only from the UI message. Inspect the actual request and response.

Do not ignore the first error in the console. Later errors may be side effects of the first one.

Do not forget about stored state. Old cookies, local storage, or cached files can make a bug look random.

## Summary

Browser DevTools give you direct evidence about what the browser is doing.

Use:

- Elements for DOM and CSS problems
- Console for logs and errors
- Sources for breakpoints and execution flow
- Network for requests and responses
- Application or Storage for persisted browser state

The goal is not to memorize every feature. The goal is to ask better questions and inspect the right evidence.
