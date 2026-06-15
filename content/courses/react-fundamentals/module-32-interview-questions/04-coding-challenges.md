# Coding Challenges

React coding interviews usually test how you structure state, handle user input, render lists, manage async flows, and communicate tradeoffs while coding.

Do not silently code for twenty minutes. Explain your plan, name edge cases, build the smallest working version, then improve it.

## Challenge 1: Counter with Step

Build a counter with:

- current count
- increment button
- decrement button
- reset button
- step input
- minimum value of zero

Expected behavior:

- increment adds the current step
- decrement subtracts the current step but never goes below zero
- reset sets count to zero
- invalid step values are rejected or corrected

Edge cases:

- empty step input
- negative step
- decimal step
- very large step

Strong solution notes:

- keep `count` and `step` in state
- parse input intentionally
- use functional state updates when next count depends on previous count

## Challenge 2: Todo List

Build a todo list with:

- add task
- toggle complete
- delete task
- filter all, active, completed
- count remaining tasks

Follow-up questions:

- Why should task ids be stable?
- Why is `remainingCount` derived instead of stored?
- How would you persist tasks?
- How would you test this component?

Common mistake:

Mutating the todo object directly:

```js
todo.completed = true;
```

Prefer returning new objects:

```js
setTodos((todos) =>
  todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  )
);
```

## Challenge 3: Searchable List

Build a list with:

- search input
- case-insensitive filtering
- empty state
- result count

Data:

```js
const users = [
  { id: 1, name: "Ada Lovelace", role: "Engineer" },
  { id: 2, name: "Grace Hopper", role: "Computer Scientist" },
  { id: 3, name: "Katherine Johnson", role: "Mathematician" }
];
```

Expected behavior:

- search by name or role
- trim leading and trailing whitespace
- show all users when query is empty
- show "No results" when nothing matches

Follow-up:

When would you use `useMemo` here?

Answer:

Only if the list is large or filtering is expensive. For three users, memoization is unnecessary.

## Challenge 4: Fetch with Loading and Error

Build a component that fetches posts and renders:

- loading state
- error state
- empty state
- list of posts
- retry button

Requirements:

- no unhandled promise errors
- cleanup or ignore stale requests if the component unmounts
- user-friendly error message

Skeleton:

```jsx
function PostsList() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  // implement loading here
}
```

Follow-up questions:

- How would this change with TanStack Query?
- How would you test loading and error states?
- What happens if the user clicks retry quickly?

## Challenge 5: Tabs Component

Build accessible tabs.

Requirements:

- render tab buttons from data
- show active panel
- support keyboard arrow navigation as an extension
- use stable ids
- keep active tab in state

Data:

```js
const tabs = [
  { id: "overview", label: "Overview", content: "Project summary" },
  { id: "settings", label: "Settings", content: "Project settings" },
  { id: "billing", label: "Billing", content: "Billing details" }
];
```

Accessibility hints:

- use `role="tablist"`
- use `role="tab"`
- use `role="tabpanel"`
- connect tabs and panels with `aria-controls` and `aria-labelledby`
- indicate selected tab with `aria-selected`

## Challenge 6: Modal Dialog

Build a modal that:

- opens from a button
- closes from a close button
- closes on Escape
- traps focus as an advanced extension
- restores focus to the opener as an advanced extension

Common mistakes:

- closing only with a mouse
- leaving background content focusable
- not cleaning up keydown listeners
- rendering modal content but hiding it only visually

## Challenge 7: Cart Reducer

Implement a cart reducer.

Actions:

```text
add_item
remove_item
set_quantity
clear_cart
```

Rules:

- adding an existing item increases quantity
- quantity must be at least one
- removing deletes the item
- total is derived outside the reducer

Follow-up:

Why is a reducer useful here?

Answer:

It centralizes cart state transitions and makes action behavior easier to test.

:::quiz
question: During a React coding interview, what is usually the best first step?
options:
  - Start typing immediately without asking questions.
  - Clarify requirements and edge cases before coding.
  - Add every optimization API first.
  - Use global state for every challenge.
answer: 1
explanation: Clarifying expected behavior and edge cases prevents building the wrong solution and shows senior thinking.
:::

## Interview Strategy

Use this flow:

1. Repeat the requirements.
2. Ask about edge cases.
3. Define state shape.
4. Build the simplest working UI.
5. Handle validation and empty states.
6. Refactor repeated logic.
7. Explain tests and tradeoffs.

## Common Mistakes

- Overengineering before the base behavior works.
- Forgetting empty and error states.
- Mutating arrays or objects in state.
- Using index keys in interactive lists.
- Not explaining decisions.
- Ignoring accessibility for tabs, forms, and modals.
- Adding `useMemo` before identifying a performance problem.

## Practice Plan

Pick three challenges and solve each twice:

- first version: working in 20 minutes
- second version: cleaner architecture and tests

After each attempt, write:

- what state you used
- what edge case you missed
- what you would improve with more time

## Recap

React coding challenges reward clear state design, incremental delivery, edge-case awareness, and communication. Build the core behavior first, then polish.
