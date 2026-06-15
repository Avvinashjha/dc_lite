# Building a Todo App

A todo app is small enough to finish, but rich enough to practice React fundamentals: components, props, state, events, forms, derived data, persistence, and accessibility.

The goal is not to build the most original todo app. The goal is to build a reliable one and explain every decision.

## Project Goal

Build a task manager where users can add, edit, complete, delete, filter, and persist tasks.

Version one should work without a backend. Use React state and `localStorage`.

## Core Requirements

Your app must support:

- adding a task with a non-empty title
- marking a task complete or active
- editing a task title
- deleting a task
- filtering by all, active, and completed
- showing task counts
- clearing completed tasks
- saving tasks across refreshes
- showing helpful empty states

## Suggested Component Architecture

```text
App
  TodoHeader
  TodoForm
  TodoStats
  TodoFilters
  TodoList
    TodoItem
  TodoFooter
```

State can live in `App` for version one:

```js
const [todos, setTodos] = useState([]);
const [filter, setFilter] = useState("all");
```

Example task shape:

```js
const todo = {
  id: "todo-1",
  title: "Review useState",
  completed: false,
  createdAt: "2026-06-15T10:00:00.000Z"
};
```

Use derived data instead of storing extra state:

```js
const activeTodos = todos.filter((todo) => !todo.completed);
const completedTodos = todos.filter((todo) => todo.completed);
```

## Milestones

1. Render a static list of hard-coded tasks.
2. Add tasks from a controlled form.
3. Validate empty input.
4. Toggle completion.
5. Delete tasks.
6. Add filters.
7. Add editing.
8. Persist to `localStorage`.
9. Add keyboard and accessibility polish.
10. Deploy the project and write a README.

## Acceptance Criteria

- Empty or whitespace-only tasks are rejected.
- New tasks appear immediately after submission.
- Completed tasks are visually distinct.
- Filters show the correct subset.
- Counts update after every change.
- Editing preserves the task id and completion state.
- Refreshing the page keeps tasks.
- Corrupt saved data does not crash the app.
- Buttons have accessible labels when icon-only.

## Edge Cases

Handle these deliberately:

- user submits `"   "`
- user edits a title to an empty value
- all tasks are deleted
- all completed tasks are cleared while the completed filter is active
- saved `localStorage` data is invalid JSON
- two tasks have the same title
- user presses Enter while editing
- user presses Escape while editing

## Common Mistakes

- Mutating the todo array in place.
- Storing filtered todos in state instead of deriving them.
- Using array index as the task id.
- Forgetting to trim user input.
- Writing to `localStorage` during render.
- Letting edit mode remain open after a task is deleted.
- Hiding focus outlines and making keyboard use harder.

## Inline Implementation Hint

When updating one task, return a new array:

```js
setTodos((currentTodos) =>
  currentTodos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  )
);
```

This preserves React's expectation that state updates produce new references.

:::quiz
question: Why is storing `visibleTodos` in state usually a mistake?
options:
  - It cannot be rendered by React.
  - It duplicates data that can be derived from todos and filter.
  - It prevents localStorage from working.
  - It makes JSX invalid.
answer: 1
explanation: Visible todos are derived from the source todo list and current filter. Duplicating them in state can cause stale UI bugs.
:::

## Practice Challenges

Beginner challenge:

- Add a character limit to task titles.
- Show a validation message when the limit is exceeded.

Intermediate challenge:

- Add due dates and a "due today" filter.
- Sort overdue tasks first.

Advanced challenge:

- Add drag-and-drop ordering.
- Persist the custom order.
- Keep keyboard controls usable.

## README Checklist

Your README should include:

- project goal
- features
- component structure
- state model
- local setup commands
- known limitations
- deployment URL
- manual test checklist

## Recap

A todo app teaches the basics of React state design. Keep source state small, derive what you can, update immutably, handle edge cases, and make the UI usable by keyboard and screen reader users.
