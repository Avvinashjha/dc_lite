# Redux Fundamentals

Redux stores application state in one central store and changes it through dispatched actions.

The core idea is predictability.

Given the current state and an action, a reducer returns the next state.

## The Three Core Pieces

Redux is built around:

- store: holds the current state
- action: describes what happened
- reducer: calculates the next state

```js
const initialState = {
  items: [],
};

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case "cart/itemAdded":
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    default:
      return state;
  }
}
```

A reducer should not mutate the existing state directly in classic Redux.

It returns a new state object.

## Actions Describe Events

An action is a plain object.

```js
const action = {
  type: "cart/itemAdded",
  payload: { id: "p1", name: "Keyboard", price: 79 },
};
```

Good action names describe what happened, not just what code should do.

Prefer `cart/itemAdded` over `setItems`.

## Dispatching Actions From React

React components use `useSelector` to read state and `useDispatch` to send actions.

```jsx
function CartButton({ product }) {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.cart.items.length);

  return (
    <button onClick={() => dispatch({ type: "cart/itemAdded", payload: product })}>
      Add to cart ({count})
    </button>
  );
}
```

Selectors should return only the data the component needs.

Returning a large object can cause unnecessary re-renders.

## Reducers Must Be Pure

A reducer should not:

- call `fetch`
- read from `localStorage`
- generate random IDs
- mutate external variables
- dispatch another action

Bad reducer:

```js
function reducer(state, action) {
  if (action.type === "todo/added") {
    state.items.push({ id: crypto.randomUUID(), text: action.payload });
    return state;
  }

  return state;
}
```

This mutates state and creates an ID inside the reducer.

Create IDs before dispatching or use middleware patterns.

## Async Work

Redux itself is synchronous.

Async work usually happens in middleware, thunks, or external data-fetching tools.

```js
function loadUser(userId) {
  return async function loadUserThunk(dispatch) {
    dispatch({ type: "user/loadingStarted" });

    try {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      dispatch({ type: "user/loaded", payload: user });
    } catch (error) {
      dispatch({ type: "user/loadingFailed", error: String(error) });
    }
  };
}
```

In modern apps, consider TanStack Query for server state before writing a lot of Redux async logic.

## Common Mistakes

- Mutating state in a hand-written reducer.
- Dispatching vague actions like `setData` everywhere.
- Storing derived values that can be calculated from existing state.
- Reading too much state in a component selector.
- Using Redux as a cache for every API response without considering server-state tools.

:::quiz
question: What should a Redux reducer do?
options:
  - Fetch data from an API and update the DOM
  - Return the next state from the current state and an action
  - Store component refs for every input
  - Subscribe directly to browser events
answer: 1
explanation: Reducers are pure functions that calculate the next state based on the current state and an action.
:::

## Practical Challenge

Write actions and a reducer for a notification center.

Support adding a notification, marking one as read, and clearing all read notifications.

Then identify which values are stored state and which values could be derived.

## Recap

Redux gives you a predictable event log for global client state.

Use actions to describe what happened, reducers to calculate next state, and selectors to keep components focused on the data they actually need.
