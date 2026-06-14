# Debugging and Testing Strategy

Projects fail in more interesting ways than isolated exercises.

A typo may break rendering.

Invalid data may break storage.

A slow API may leave the interface stuck in a loading state.

Debugging and testing help you find those problems before users do.

## Debug One Layer at a Time

When something fails, identify the layer:

- Is the event listener running?
- Is the input value correct?
- Did state update?
- Did rendering run?
- Did storage save?
- Did the API request succeed?

Use small checks.

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Form submitted");
});
```

Then check the next step:

```js
console.log("Input:", taskInput.value);
```

Do not guess across the whole project.

Narrow the problem.

## Use the Browser DevTools

Browser DevTools are part of the JavaScript workflow.

Use them to:

- inspect HTML and CSS
- read console errors
- run quick JavaScript expressions
- watch network requests
- inspect local storage
- set breakpoints

For API projects, the Network tab is especially useful.

Check:

- request URL
- request method
- status code
- response body
- request and response headers

## Read Error Messages

Error messages are clues.

Example:

```text
Cannot read properties of null (reading 'addEventListener')
```

This often means a DOM selector did not find an element.

Check:

```js
const form = document.querySelector("#task-form");
console.log(form);
```

If it logs `null`, verify the HTML ID and script loading order.

## Manual Test Checklist

Manual testing means using the app like a user.

For a todo app, test:

- add a valid task
- submit an empty task
- complete a task
- delete a task
- refresh the page
- add several tasks quickly
- use filters with no matching tasks

Write this checklist down.

Run it before you call the project done.

## Test Pure Functions

Some logic can be tested without the DOM.

```js
function getTotal(expenses) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}
```

You can test it with simple checks:

```js
console.assert(getTotal([]) === 0);
console.assert(
  getTotal([
    { amount: 5 },
    { amount: 7 }
  ]) === 12
);
```

For course projects, even a few assertions can catch mistakes in calculations, filters, and validators.

## Test Edge Cases

Edge cases are unusual but possible inputs or states.

Examples:

- empty lists
- duplicate names
- negative numbers
- invalid JSON in storage
- failed network requests
- very long text
- missing API fields

Do not only test the happy path.

Projects become stronger when edge cases are planned.

## Debug Async Code Carefully

Async bugs often come from missing `await`, unhandled errors, or state updates in the wrong order.

Problem:

```js
const data = response.json();
renderUsers(data);
```

Fix:

```js
const data = await response.json();
renderUsers(data);
```

Also check that loading state is cleared in `finally`:

```js
try {
  state.isLoading = true;
  state.items = await loadItems();
} catch {
  state.error = "Could not load items.";
} finally {
  state.isLoading = false;
  render();
}
```

## Best Practices

- Reproduce the bug before changing code.
- Check one layer at a time.
- Use DevTools instead of guessing.
- Write manual test checklists for project features.
- Test pure helper functions with small inputs.
- Include failed API and invalid storage cases.

## Common Mistakes

- Changing many things at once while debugging.
- Ignoring console errors.
- Testing only the perfect path.
- Forgetting that `fetch()` does not reject for HTTP error statuses.
- Leaving temporary logs everywhere after debugging.
- Refactoring before the bug is understood.

## Summary

Debugging is a process of narrowing the problem.

Testing is a process of proving important behavior works.

Use DevTools, check layers one at a time, test edge cases, and keep a manual checklist for each project.
