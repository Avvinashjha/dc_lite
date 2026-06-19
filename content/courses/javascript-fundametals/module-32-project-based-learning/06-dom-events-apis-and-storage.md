# DOM, Events, APIs, and Storage

Many JavaScript projects combine four browser skills:

- read and update the DOM
- respond to events
- fetch data from APIs
- save data in browser storage

The challenge is not knowing each skill separately.

The challenge is connecting them in a predictable way.

## The Browser App Flow

A common flow looks like this:

```text
User action -> event handler -> state update -> render -> optional save or API request
```

Example:

```js
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();
  if (!query) {
    showError("Enter a search term.");
    return;
  }

  await searchRepositories(query);
});
```

The event handler should be readable.

Move detailed logic into named functions.

## DOM Rendering

Rendering means turning state into visible HTML.

```js
function renderTasks(tasks) {
  taskList.innerHTML = "";

  for (const task of tasks) {
    const li = document.createElement("li");
    li.textContent = task.title;

    if (task.completed) {
      li.classList.add("completed");
    }

    taskList.append(li);
  }
}
```

For beginner projects, clearing and re-rendering a small list is usually fine.

For very large lists, you may need a more careful update strategy.

## Event Delegation

If a list has many buttons, event delegation can be cleaner than attaching a listener to every button.

```js
taskList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const taskId = button.dataset.taskId;
  const action = button.dataset.action;

  if (action === "delete") {
    deleteTask(taskId);
  }

  if (action === "toggle") {
    toggleTask(taskId);
  }

  renderTasks(state.tasks);
});
```

The buttons can include data attributes:

```html
<button data-action="delete" data-task-id="task-1">Delete</button>
```

This is useful when list items are created dynamically.

## API Integration

API projects need loading, success, and error states.

```js
async function loadUsers() {
  state.isLoading = true;
  state.error = null;
  render();

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    state.users = await response.json();
  } catch (error) {
    state.error = "Could not load users.";
  } finally {
    state.isLoading = false;
    render();
  }
}
```

Notice the order:

1. Show loading.
2. Try the request.
3. Store successful data or an error.
4. Stop loading.
5. Render the result.

## Storage Integration

Storage projects need save and load boundaries.

```js
const STORAGE_KEY = "project-tasks";

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}
```

Call `loadTasks()` during startup.

Call `saveTasks()` after state changes that should persist.

```js
function addTask(title) {
  state.tasks = [
    ...state.tasks,
    { id: crypto.randomUUID(), title, completed: false }
  ];

  saveTasks(state.tasks);
  renderTasks(state.tasks);
}
```

## Forms and Validation

Validate input before changing state.

```js
function getExpenseInput() {
  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);

  if (!description) {
    return { error: "Description is required." };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Amount must be greater than 0." };
  }

  return {
    value: {
      description,
      amount
    }
  };
}
```

This keeps validation separate from state updates.

## Best Practices

- Keep event handlers short and readable.
- Render from state, not from guesses about the DOM.
- Use loading, error, empty, and success states for API projects.
- Validate forms before updating state.
- Save to storage after successful state changes.
- Use event delegation for dynamic lists.

## Common Mistakes

- Calling `response.json()` without `await`.
- Forgetting to handle failed API responses.
- Saving invalid form input.
- Updating the DOM but not the state.
- Updating state but forgetting to render.
- Adding duplicate event listeners every time the UI renders.

## Summary

Browser projects connect events, state, rendering, APIs, and storage.

Keep the flow clear: handle the user action, validate input, update state, save or fetch when needed, and render the current state.
