# Context Best Practices

Context is powerful because it removes repetitive prop passing. It is risky because it can hide dependencies and make large parts of the app re-render together.

Use context deliberately.

## Prefer Local State First

If state belongs to one component or a small parent-child group, keep it local.

```jsx
function ProductCard({ product }) {
  const [expanded, setExpanded] = useState(false);
}
```

This does not need context. Local state is easier to understand and cheaper to update.

## Place Providers Carefully

Place providers close to the components that need them.

```jsx
function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutForm />
      <OrderSummary />
    </CheckoutProvider>
  );
}
```

Do not wrap the entire app in a checkout provider if checkout state is irrelevant elsewhere.

## Split Contexts by Change Pattern

A common performance issue is one context value that changes often.

```jsx
<AppContext.Provider value={{ user, theme, cart, notifications }}>
```

Any change creates a new value for all consumers.

Prefer focused contexts.

```jsx
<UserProvider>
  <ThemeProvider>
    <CartProvider>{children}</CartProvider>
  </ThemeProvider>
</UserProvider>
```

You can also split state and actions.

```jsx
const CartStateContext = createContext(null);
const CartActionsContext = createContext(null);
```

Actions often stay stable while state changes frequently.

## Memoize Provider Values When Needed

```jsx
const value = useMemo(() => {
  return { user, updateUser };
}, [user, updateUser]);
```

Memoization helps avoid changing provider value identity when the underlying values did not change. It does not make context free; consumers still update when the value actually changes.

## Use Custom Hooks

Custom hooks make context usage consistent.

```jsx
function useCart() {
  const cart = useContext(CartStateContext);

  if (cart === null) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return cart;
}
```

This is easier to maintain than repeating `useContext(CartStateContext)` everywhere.

## Context vs External State

Context is not a full state management solution by itself. It passes values through the tree.

For server state, prefer data libraries or framework loaders. For complex client state with many updates, a reducer plus context may be enough, but an external store can be better if performance and subscriptions become difficult.

:::quiz
question: Which context design is usually more performance-friendly?
options:
  - One giant context containing all app state
  - Focused contexts split by concern and update frequency
  - Recreating providers inside every render loop
answer: 1
explanation: Focused contexts reduce the number of consumers affected by each value change.
:::

## Common Mistakes

Do not put fast-changing input text in app-wide context unless many distant components truly need every keystroke.

Do not mutate context values. Use state setters or reducers to create new values.

Do not make reusable components depend on app context when props would make them easier to reuse and test.

Do not ignore provider order. A hook that reads context must render under the provider that supplies it.

## Practice Challenge

Design context for a shopping app.

Requirements:

- `UserContext` for the signed-in user
- `ThemeContext` for visual theme
- `CartStateContext` for cart items
- `CartActionsContext` for cart operations
- provider placement that avoids wrapping unrelated marketing pages in cart state

Explain why you split or combined each context.

## Recap

Good context design is about scope and update frequency. Keep state local when possible, place providers intentionally, split broad values, memoize provider values when useful, and use custom hooks for clear consumer APIs.
