# Context vs Redux

Context and Redux both help data reach many components, but they solve different problems.

Context is a React feature for passing values through the tree without prop drilling.

Redux is an external state container with predictable updates, developer tools, middleware, and a strong pattern for large shared state.

## What Context Is Good At

Context is excellent for values that are read by many components and change occasionally.

```jsx
const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Save</button>;
}
```

Common Context use cases:

- theme
- current locale
- authenticated user summary
- feature flags
- dependency injection, such as an analytics client

## What Context Is Not

Context is not automatically a full state management solution.

If the provider value changes, consumers that read that context can re-render.

```jsx
function AppProvider({ children }) {
  const [draft, setDraft] = useState("");
  const [user, setUser] = useState(null);

  const value = { draft, setDraft, user, setUser };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

In this example, a component that only reads `user` may still re-render when `draft` changes because the provider value changes.

For small apps this may be fine.

For large, frequently changing state, it can become noisy.

## What Redux Is Good At

Redux is useful when state changes often, many parts of the app need it, and you want predictable update flows.

```jsx
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    itemAdded(state, action) {
      state.items.push(action.payload);
    },
    itemRemoved(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});
```

Redux is common for:

- complex global client state
- shopping carts
- multi-step workflows
- collaborative UI state
- applications that need time-travel debugging or strict event history

Modern Redux usually means Redux Toolkit, not hand-written action constants and switch statements.

## Prop Drilling Is Not Always Bad

Passing props through one or two levels is normal.

```jsx
function Page() {
  const user = useCurrentUser();
  return <Header user={user} />;
}

function Header({ user }) {
  return <Avatar user={user} />;
}
```

Do not introduce global state just to avoid one prop.

Reach for Context when many components need the value across a wide tree.

## Context With a Reducer

For medium complexity, Context plus `useReducer` can be enough.

```jsx
const TodosContext = createContext(null);

function todosReducer(state, action) {
  switch (action.type) {
    case "added":
      return [...state, { id: action.id, text: action.text, done: false }];
    case "toggled":
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function TodosProvider({ children }) {
  const [todos, dispatch] = useReducer(todosReducer, []);

  return (
    <TodosContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodosContext.Provider>
  );
}
```

This gives predictable updates without adding a store library.

## Common Mistakes

- Using Context for fast-changing values like every keystroke in a large form.
- Creating one giant app context with unrelated state.
- Choosing Redux before the app has real shared-state complexity.
- Avoiding Redux even when global updates are hard to trace.
- Forgetting that server data usually belongs in a data-fetching cache, not Redux.

:::quiz
question: Which situation is the strongest reason to choose Redux over plain Context?
options:
  - A static theme string used by many components
  - One parent passing one prop to a child
  - Complex global state with frequent updates and debugging needs
  - A modal open flag used only inside one component
answer: 2
explanation: Redux is most useful when shared client state has complex update flows, frequent changes, and needs strong debugging tools.
:::

## Practical Challenge

Design state management for a shopping cart.

List which values would live in local component state, which would live in a global client store, and which would come from the server.

Explain whether Context alone is enough or Redux Toolkit would be helpful.

## Recap

Context passes values through the component tree.

Redux manages shared client state with predictable update patterns.

Use Context for simple, low-frequency shared values and Redux Toolkit when global state becomes complex enough that structure and tooling are worth the cost.
