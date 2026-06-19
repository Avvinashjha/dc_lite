# Designing Data and State

Most JavaScript projects are easier when you separate two ideas:

- data: the information your app works with
- state: the current condition of the app

For example, in a quiz app, the questions are data.

The current question, selected answer, and score are state.

## Data Models

A data model is the shape of your objects and arrays.

For a todo app:

```js
const task = {
  id: "task-1",
  title: "Review modules",
  completed: false,
  createdAt: "2026-06-14T10:00:00.000Z"
};
```

For an expense tracker:

```js
const expense = {
  id: "expense-1",
  description: "Lunch",
  amount: 12.5,
  category: "food",
  date: "2026-06-14"
};
```

For an API dashboard:

```js
const repository = {
  id: 123,
  name: "daily-coder",
  stars: 42,
  language: "JavaScript"
};
```

Good data models use predictable property names and value types.

## App State

App state describes what is currently happening.

```js
const state = {
  expenses: [],
  filter: "all",
  sortBy: "date",
  isLoading: false,
  error: null
};
```

This state can answer important questions:

- What data should be shown?
- Is the app waiting for something?
- Did something fail?
- Which filter or screen is active?

When state is clear, rendering becomes easier.

## Keep DOM and State Separate

Do not use the DOM as your main data source.

Weak approach:

```js
const total = document.querySelectorAll(".expense").length;
```

Better approach:

```js
const total = state.expenses.length;
```

The DOM should display state.

The state should not be hidden inside the DOM.

## Update State First, Then Render

A common pattern is:

```text
event -> update state -> render UI
```

Example:

```js
function handleAddExpense(description, amount) {
  state.expenses = [
    ...state.expenses,
    {
      id: crypto.randomUUID(),
      description,
      amount
    }
  ];

  render();
}
```

This keeps the UI in sync with the data.

## Derived Data

Derived data is calculated from existing state.

Do not store it unless you need to.

```js
function getTotal(expenses) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

function getFilteredExpenses(expenses, category) {
  if (category === "all") {
    return expenses;
  }

  return expenses.filter((expense) => expense.category === category);
}
```

The total and filtered list can be calculated when rendering.

That avoids bugs where stored totals become outdated.

## IDs Matter

Many project features need stable IDs:

- deleting one item
- editing one item
- toggling one item
- linking details to a list item

Avoid using array indexes as long-term IDs.

```js
const task = {
  id: crypto.randomUUID(),
  title: "Build project plan",
  completed: false
};
```

Array indexes change when items are inserted, removed, or sorted.

## Persisted State

When saving state to `localStorage`, convert it to JSON:

```js
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
```

When loading it, parse carefully:

```js
function loadTasks() {
  const saved = localStorage.getItem("tasks");

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
```

Stored data can be missing, old, or invalid.

Handle that at the boundary where you load it.

## Best Practices

- Write example objects before building UI.
- Keep state as plain objects and arrays when possible.
- Use stable IDs for list items.
- Calculate derived data instead of storing duplicate values.
- Update state before rendering.
- Validate data loaded from storage or APIs.

## Common Mistakes

- Letting DOM elements become the main source of truth.
- Storing totals that should be calculated.
- Using array indexes as permanent IDs.
- Mutating state in many unrelated places.
- Saving data without planning how to load invalid saved values.

## Summary

Data design affects the whole project.

Choose clear object shapes, keep app state separate from DOM nodes, update state first, render from state, and calculate derived values when needed.
