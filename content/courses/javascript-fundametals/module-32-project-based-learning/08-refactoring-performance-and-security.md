# Refactoring, Performance, and Security

After a feature works, improve the code without changing what the user sees.

That is refactoring.

Refactoring is not adding features.

It is making existing behavior easier to understand, test, and maintain.

## Refactor After Behavior Works

Do not refactor while the feature is still broken.

First make the behavior pass your manual checks.

Then improve the code in small steps.

Example before refactoring:

```js
button.addEventListener("click", () => {
  const amount = Number(amountInput.value);
  total += amount;
  totalElement.textContent = `$${total.toFixed(2)}`;
  amountInput.value = "";
});
```

Refactored:

```js
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function renderTotal(total) {
  totalElement.textContent = formatCurrency(total);
}

button.addEventListener("click", () => {
  const amount = Number(amountInput.value);
  total += amount;
  renderTotal(total);
  amountInput.value = "";
});
```

The behavior is the same, but the responsibilities are clearer.

## Signs Code Needs Refactoring

Refactor when you notice:

- a function is doing many unrelated jobs
- the same code is copied in several places
- variable names are unclear
- deeply nested conditionals are hard to follow
- rendering code is mixed with data calculations
- API handling is repeated for every request
- changing one feature breaks another feature

Refactor for a reason.

Do not rewrite code just because you learned a new syntax.

## Extract Helper Functions

Helper functions are useful when they name an idea.

```js
function isValidExpense(expense) {
  return expense.description.trim() !== "" && expense.amount > 0;
}
```

This is easier to understand than repeating the condition everywhere.

## Reduce Duplicate Rendering Code

If several features need to update the UI, centralize rendering.

```js
function updateApp() {
  const visibleTasks = getVisibleTasks(state.tasks, state.filter);
  renderTasks(visibleTasks);
  renderTaskCount(state.tasks);
  saveTasks(state.tasks);
}
```

Then event handlers can update state and call `updateApp()`.

Be careful not to hide too much inside one function.

If a function becomes a mystery, split it again.

## Performance Basics

Small projects usually do not need advanced optimization.

But they should avoid obvious waste.

Watch for:

- rendering thousands of items unnecessarily
- repeatedly querying the same DOM elements
- running expensive work on every keypress
- making duplicate API requests
- storing huge data in `localStorage`

For search inputs, consider debouncing:

```js
function debounce(callback, delay) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
}
```

Use it when you want to wait until typing pauses before running a search.

## Security Basics

Frontend projects still need security awareness.

Important rules:

- Do not put secret API keys in browser JavaScript.
- Treat user input as untrusted.
- Prefer `textContent` when inserting user-provided text.
- Be careful with `innerHTML`.
- Validate data from APIs and storage.
- Avoid storing sensitive personal data in `localStorage`.

Safer:

```js
titleElement.textContent = userProvidedTitle;
```

Riskier:

```js
titleElement.innerHTML = userProvidedTitle;
```

`innerHTML` parses HTML, so unsafe input can become executable markup.

Use it only when you control and trust the HTML.

## Accessibility Checks

Project quality is not only JavaScript.

Check that:

- buttons are real `<button>` elements
- form inputs have labels
- error messages are visible and understandable
- keyboard users can complete the main flow
- important images have useful alt text
- color is not the only way to communicate status

These checks make projects more usable.

## Best Practices

- Refactor only after behavior works.
- Make one refactoring change at a time.
- Extract helpers that name meaningful ideas.
- Keep rendering, state updates, and side effects understandable.
- Check performance only where there is real cost.
- Use `textContent` for user-provided text.
- Keep secrets out of frontend code.

## Common Mistakes

- Rewriting the project during refactoring.
- Adding abstractions before duplication exists.
- Optimizing code that is not slow.
- Using `innerHTML` with untrusted input.
- Saving private information in local storage.
- Ignoring accessibility until the end.

## Summary

Refactoring improves code structure without changing behavior.

Performance and security checks help make the project reliable for real use.

Keep changes small, protect user input, avoid exposed secrets, and make the app usable beyond the happy path.
