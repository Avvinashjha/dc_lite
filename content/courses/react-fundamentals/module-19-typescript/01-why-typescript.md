# Why TypeScript with React

TypeScript adds static types to JavaScript.

In React apps, it helps catch mistakes in props, state, events, API shapes, and component contracts before the code runs in the browser.

TypeScript does not make the app bug-free.

It makes many common mistakes harder to write.

## A Simple Prop Bug

JavaScript version:

```jsx
function Price({ amount }) {
  return <strong>${amount.toFixed(2)}</strong>;
}

<Price amount="19.99" />;
```

This can crash because `"19.99"` is a string, and strings do not have `toFixed`.

TypeScript version:

```tsx
type PriceProps = {
  amount: number;
};

function Price({ amount }: PriceProps) {
  return <strong>${amount.toFixed(2)}</strong>;
}

<Price amount="19.99" />;
```

TypeScript flags the incorrect prop before runtime.

## Component Contracts

Types document how a component should be used.

```tsx
type UserCardProps = {
  user: {
    id: string;
    name: string;
    email?: string;
  };
  onSelect: (userId: string) => void;
};
```

This tells other developers:

- `user.id` and `user.name` are required
- `user.email` may be missing
- `onSelect` receives a user id string

## TypeScript Is Not Runtime Validation

TypeScript checks code at build time.

It does not prove that data from an API is correct at runtime.

```tsx
const response = await fetch("/api/user");
const user = (await response.json()) as User;
```

The `as User` assertion does not validate the data.

It only tells TypeScript to trust you.

For untrusted API data, use runtime validation when correctness matters.

## Common React Areas Where Types Help

TypeScript is especially useful for:

- component props
- event handlers
- reducer actions
- context values
- custom hooks
- API response shapes
- discriminated unions for UI states

Example discriminated union:

```tsx
type RequestState<T> =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: T };

function UserPanel({ state }: { state: RequestState<User> }) {
  if (state.status === "loading") return <p>Loading...</p>;
  if (state.status === "error") return <p>{state.error}</p>;

  return <h1>{state.data.name}</h1>;
}
```

After checking `state.status`, TypeScript knows which fields are available.

## Common Mistakes

- Using `any` whenever TypeScript complains.
- Using `as` assertions to silence real uncertainty.
- Making every prop optional and losing useful guarantees.
- Expecting TypeScript to validate API responses at runtime.
- Fighting inference by writing unnecessary types everywhere.

:::quiz
question: What does TypeScript do for a React app?
options:
  - It catches every runtime bug automatically
  - It checks many code contracts before runtime
  - It replaces the browser's JavaScript engine
  - It validates every API response automatically
answer: 1
explanation: TypeScript checks static types during development and build time, but it does not replace runtime validation or testing.
:::

## Practical Challenge

Create types for a `ProductCard` component.

The product should have:

- `id`
- `name`
- `price`
- optional `description`

The component should also accept an `onAddToCart(productId)` callback.

Then intentionally pass a string price and observe the TypeScript error.

## Recap

TypeScript improves React code by making component contracts explicit.

Use it to model real states and data shapes, but remember that external data still needs runtime care.
