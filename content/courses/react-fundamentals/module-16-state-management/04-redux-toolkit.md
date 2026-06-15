# Redux Toolkit

Redux Toolkit is the recommended way to write Redux.

It removes much of the boilerplate from classic Redux and gives you safer defaults.

Redux Toolkit includes:

- `configureStore`
- `createSlice`
- `createAsyncThunk`
- Immer-powered reducer logic
- good development defaults

## Creating a Slice

A slice groups the reducer logic and action creators for one part of state.

```js
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    itemAdded(state, action) {
      state.items.push(action.payload);
    },
    itemRemoved(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { itemAdded, itemRemoved } = cartSlice.actions;
export default cartSlice.reducer;
```

This looks like mutation, but Redux Toolkit uses Immer.

Immer records the changes and produces an immutable next state.

## Configuring the Store

```js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
```

Then provide the store to React.

```jsx
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

## Reading and Updating State

```jsx
import { useDispatch, useSelector } from "react-redux";
import { itemAdded } from "./cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.cart.items.length);

  return (
    <article>
      <h2>{product.name}</h2>
      <button onClick={() => dispatch(itemAdded(product))}>
        Add to cart ({count})
      </button>
    </article>
  );
}
```

Keep selectors specific.

If a component only needs `count`, select `count`, not the entire `cart` object.

## Async Thunks

`createAsyncThunk` handles common async action states.

```js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("user/fetchUser", async (userId) => {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    throw new Error("User request failed");
  }

  return response.json();
});

const userSlice = createSlice({
  name: "user",
  initialState: { data: null, status: "idle", error: null },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      });
  },
});
```

This is useful, but do not use Redux Toolkit async thunks for every server request by default.

TanStack Query or SWR may handle caching, deduping, and revalidation with less code.

## Common Mistakes

- Writing classic action constants and switch reducers when `createSlice` would be clearer.
- Mutating nested values outside a Redux Toolkit reducer and expecting Immer to help.
- Putting non-serializable values like DOM nodes, promises, or class instances in Redux state.
- Keeping all form keystrokes in Redux when local state would be simpler.
- Using async thunks as a replacement for a server-state cache.

:::quiz
question: Why can Redux Toolkit reducers appear to mutate state?
options:
  - Redux Toolkit disables immutability rules
  - Immer converts those apparent mutations into immutable updates
  - React automatically freezes all Redux state
  - The state is only mutated in development mode
answer: 1
explanation: Redux Toolkit uses Immer inside slices, so reducer code can look mutative while producing immutable next state.
:::

## Practical Challenge

Build a `preferencesSlice` with:

- `theme` set to `"light"` by default
- `language` set to `"en"` by default
- actions to change each value

Then write two selectors: one for the theme and one for whether dark mode is active.

## Recap

Redux Toolkit is modern Redux.

Use `configureStore` and `createSlice` for client state that benefits from predictable global updates, and use async thunks carefully when a dedicated server-state library is not the better fit.
