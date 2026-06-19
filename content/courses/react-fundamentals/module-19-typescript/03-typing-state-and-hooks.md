# Typing State and Hooks

React hooks often infer types well.

Add explicit types when inference is unclear, incomplete, or too narrow.

## `useState` Inference

TypeScript can infer simple state.

```tsx
const [count, setCount] = useState(0);
const [name, setName] = useState("");
```

`count` is a number and `name` is a string.

You do not need to write `useState<number>(0)` unless it improves clarity.

## Nullable State

When state starts empty but later holds data, give TypeScript the full shape.

```tsx
type User = {
  id: string;
  name: string;
};

const [user, setUser] = useState<User | null>(null);
```

Now TypeScript requires you to handle the `null` case.

```tsx
if (!user) {
  return <p>Loading user...</p>;
}

return <h1>{user.name}</h1>;
```

## Array State

Empty arrays need help.

```tsx
type Todo = {
  id: string;
  text: string;
  done: boolean;
};

const [todos, setTodos] = useState<Todo[]>([]);
```

Without the type, TypeScript may infer an unhelpful array type in strict setups.

## Typing `useReducer`

Reducers are a great place for discriminated unions.

```tsx
type CounterState = {
  count: number;
};

type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset"; value: number };

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: action.value };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(counterReducer, { count: 0 });
```

TypeScript knows that `action.value` exists only for the `reset` action.

## Typing Custom Hooks

Custom hooks should return clear values.

```tsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue((current) => !current);

  return { value, setValue, toggle };
}
```

For tuple returns, use `as const`.

```tsx
function useBoolean(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  return [value, setValue] as const;
}
```

Without `as const`, TypeScript may infer a broad array instead of a fixed tuple.

## Common Mistakes

- Initializing with `null` and forgetting to include the future type.
- Using `useState({})` and then adding arbitrary properties later.
- Using `any` for reducer actions.
- Forgetting `as const` for tuple-returning custom hooks.
- Storing derived values in state instead of calculating them.

:::quiz
question: Why would you write `useState<User | null>(null)`?
options:
  - The state starts empty but will later contain a `User`
  - React requires all state to include `null`
  - It prevents the component from re-rendering
  - It makes `user.name` safe even when `user` is null
answer: 0
explanation: The generic tells TypeScript the state can be null initially and a User later, so code must handle both cases.
:::

## Practical Challenge

Create a `useAsyncState<T>()` hook that stores:

- loading state
- success data
- error message

Use a discriminated union for the state shape.

Then use it with `User` data and show how TypeScript narrows the success case.

## Recap

Let TypeScript infer simple hook types.

Add explicit types for nullable data, empty arrays, reducers, and custom hook APIs where inference cannot express the full state model.
