# Updating State Correctly

State updates should create the next value, not mutate the current one.

This is one of the most important React habits.

## Replace, Do Not Mutate

React state should be treated as immutable.

```jsx
const [user, setUser] = useState({
  name: "Ada",
  role: "Developer",
});
```

Do not mutate the existing object.

```jsx
// Bad
user.role = "Admin";
setUser(user);
```

Create a new object.

```jsx
setUser({
  ...user,
  role: "Admin",
});
```

React compares references. If you reuse the same object or array, React may not see the update clearly and your code becomes harder to reason about.

## Updating Objects

Use object spread for shallow updates.

```jsx
function ProfileForm() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  function updateName(event) {
    setProfile({
      ...profile,
      name: event.target.value,
    });
  }

  return (
    <input value={profile.name} onChange={updateName} />
  );
}
```

For a generic field handler:

```jsx
function updateField(event) {
  const { name, value } = event.target;

  setProfile((profile) => ({
    ...profile,
    [name]: value,
  }));
}
```

## Updating Nested Objects

Spread each level you are changing.

```jsx
const [settings, setSettings] = useState({
  theme: "light",
  notifications: {
    email: true,
    push: false,
  },
});

setSettings((settings) => ({
  ...settings,
  notifications: {
    ...settings.notifications,
    push: true,
  },
}));
```

Deeply nested state can become awkward. If updates feel too complex, consider flattening the state shape.

## Updating Arrays

Use array methods that return new arrays.

Add an item:

```jsx
setTodos((todos) => [
  ...todos,
  { id: crypto.randomUUID(), text: "Learn React", done: false },
]);
```

Remove an item:

```jsx
setTodos((todos) => todos.filter((todo) => todo.id !== idToRemove));
```

Update an item:

```jsx
setTodos((todos) =>
  todos.map((todo) =>
    todo.id === idToToggle
      ? { ...todo, done: !todo.done }
      : todo
  )
);
```

Avoid mutating methods such as `push`, `splice`, `sort`, and direct index assignment on state arrays.

If you need sorting, copy first.

```jsx
setUsers((users) =>
  [...users].sort((a, b) => a.name.localeCompare(b.name))
);
```

## Batching

React batches multiple state updates from the same event so it can render once.

```jsx
function handleClick() {
  setIsSaving(true);
  setMessage("Saving changes...");
}
```

React usually waits until the handler finishes, then renders with both updates.

Because updates are queued, use functional updates when the next value depends on the previous one.

```jsx
function addThree() {
  setCount((count) => count + 1);
  setCount((count) => count + 1);
  setCount((count) => count + 1);
}
```

## Common Mistakes

- Mutating an object and passing the same object back to the setter.
- Using `array.push()` and then calling the setter with the same array.
- Forgetting to copy nested objects.
- Sorting a state array in place.
- Using `setCount(count + 1)` repeatedly when functional updates are needed.

:::quiz
question: Which update correctly toggles one todo without mutating state?
options:
  - `todos[0].done = true; setTodos(todos)`
  - `setTodos(todos.push(newTodo))`
  - `setTodos(todos.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo))`
  - `todos.sort(); setTodos(todos)`
answer: 2
explanation: Mapping returns a new array, and object spread creates a new object for the changed todo while preserving the others.
:::

## Practice Challenge

Build a `TodoList` component with state shaped like:

```jsx
[
  { id: "1", text: "Read lesson", done: false },
  { id: "2", text: "Try challenge", done: false },
]
```

Add handlers to:

- add a todo
- toggle a todo
- remove a todo

Each handler must create new arrays and objects instead of mutating existing state.

## Recap

React state updates should produce new values. Use spread, `map`, `filter`, and functional updates to keep object and array updates predictable.
