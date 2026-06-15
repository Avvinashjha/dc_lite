# Common Design Patterns

Design patterns are reusable ways to solve common problems.

In React, patterns should make code easier to understand and change. They should not be used just because they sound advanced.

## Composition

Composition is React's core pattern.

```jsx
function Card({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

```jsx
<Card title="Billing">
  <PaymentMethod />
  <InvoiceList />
</Card>
```

The parent decides what goes inside.

## Compound Components

Compound components share behavior through a parent-child relationship.

```jsx
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}
```

Usage can read naturally:

```jsx
<Tabs>
  <Tabs.List />
  <Tabs.Panel id="overview" />
  <Tabs.Panel id="settings" />
</Tabs>
```

Use this when components are tightly related and should be configured together.

## Controlled and Uncontrolled Components

A controlled component receives its value from props.

```jsx
function SearchInput({ value, onChange }) {
  return <input value={value} onChange={(event) => onChange(event.target.value)} />;
}
```

An uncontrolled component owns its own state or relies on the DOM.

```jsx
function NameForm() {
  const inputRef = useRef(null);

  function handleSubmit() {
    alert(inputRef.current.value);
  }

  return <input ref={inputRef} />;
}
```

Controlled inputs are easier to validate and synchronize. Uncontrolled inputs can be simpler for isolated forms.

## Render Props

Render props pass rendering behavior as a function.

```jsx
function MousePosition({ children }) {
  const position = useMousePosition();
  return children(position);
}
```

```jsx
<MousePosition>
  {({ x, y }) => <p>{x}, {y}</p>}
</MousePosition>
```

Custom hooks often replace render props for new code, but render props still appear in libraries.

## Provider Pattern

Providers make shared state or services available to a subtree.

```jsx
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}
```

Use providers for values many components need. Avoid placing frequently changing large objects in broad contexts without memoization or selectors.

## Adapter Pattern

Adapters isolate external APIs.

```js
export async function getCurrentUser() {
  const data = await apiJson("/api/me");

  return {
    id: data.user_id,
    name: data.display_name,
  };
}
```

The rest of the app can use a clean internal shape even if the backend response is awkward.

## State Reducer Pattern

Reducers help when state transitions are complex.

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "opened":
      return { ...state, isOpen: true };
    case "closed":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}
```

Reducers make transitions explicit and testable.

## Common Mistakes

- Using context for everything and causing broad re-renders.
- Replacing simple props with complex patterns too early.
- Building compound components when plain composition would work.
- Creating adapters that merely rename every field without adding value.
- Using reducers for trivial boolean state.

## Tricky Question

Are custom hooks a design pattern?

Yes. They are React's standard way to reuse stateful behavior. But they should not hide unrelated responsibilities under one name.

:::quiz
question: When is the adapter pattern useful?
options:
  - When you want to isolate the rest of the app from an external API shape
  - When a component needs one static class name
  - When React should skip all renders
  - When CSS must be removed from a project
answer: 0
explanation: Adapters translate between external contracts and internal app models, reducing coupling.
:::

## Practical Challenge

Choose a form-heavy component and refactor one part using a pattern:

- controlled input for validation
- reducer for multi-step state
- adapter for backend response shape
- provider for shared form configuration

Explain why the pattern helps in that case.

## Recap

Patterns are tools. Composition, controlled components, providers, adapters, reducers, and compound components can all help when they fit the problem.

Prefer the simplest pattern that makes responsibilities clearer.
