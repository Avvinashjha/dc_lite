# useReducer

`useReducer` manages state with a reducer function. It is useful when state transitions are more complex than a few independent `useState` calls.

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

The reducer receives the current state and an action, then returns the next state.

## Basic Example

```jsx
import { useReducer } from "react";

const initialState = { count: 0 };

function counterReducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>Add</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </>
  );
}
```

## Why Reducers Help

Reducers centralize transitions.

Instead of spreading update logic across many handlers, you describe what happened.

```jsx
dispatch({ type: "fieldChanged", field: "email", value: nextEmail });
dispatch({ type: "submitStarted" });
dispatch({ type: "submitFailed", errors });
```

This makes complex flows easier to test and reason about.

## Reducers Must Be Pure

A reducer should not:

- mutate state
- make network requests
- read from the DOM
- generate random values for important state transitions

It should return the next state based on `state` and `action`.

## useReducer vs useState

Use `useState` when state is simple and updates are local.

Use `useReducer` when:

- many updates affect the same state object
- one event changes several fields
- transitions have names
- state logic deserves unit tests

## Lazy Initialization

For expensive initial state, pass an initializer.

```jsx
function init(savedCart) {
  return savedCart ?? { items: [] };
}

const [cart, dispatch] = useReducer(cartReducer, savedCart, init);
```

## Common Mistakes

Do not dispatch during render. Dispatch in event handlers, effects, or callbacks.

Do not mutate nested arrays or objects inside the reducer.

```jsx
// Wrong
state.items.push(action.item);
return state;
```

Return a new object.

```jsx
return { ...state, items: [...state.items, action.item] };
```

:::quiz
question: What should a reducer return?
options:
  - The next state
  - A JSX element
  - A promise from an API request
answer: 0
explanation: Reducers calculate and return the next state from the current state and an action.
:::

## Practice Challenge

Build a reducer for a checkout form.

Actions:

- `fieldChanged`
- `submitStarted`
- `submitSucceeded`
- `submitFailed`
- `reset`

Include state for `values`, `errors`, `isSubmitting`, and `status`.

## Recap

`useReducer` is best when state transitions are named and connected. Keep reducers pure, return new state objects, and use dispatch to describe events instead of manually coordinating many setters.
