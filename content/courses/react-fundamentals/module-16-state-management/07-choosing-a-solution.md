# Choosing a Solution

Choosing state management is a design decision, not a popularity contest.

Start with the kind of state, then choose the simplest tool that keeps the code understandable.

## Decision Guide

| State Need | Good Starting Point |
| --- | --- |
| One component owns it | `useState` |
| Nearby components share it | lift state up |
| Complex local transitions | `useReducer` |
| App-wide low-frequency value | Context |
| Complex global client state | Redux Toolkit or Zustand |
| Many independent state atoms | Jotai or another atom store |
| API data with caching | TanStack Query or SWR |
| Shareable filters or pagination | URL state |

This table is a starting point.

Real apps often combine several approaches.

## Ask Ownership Questions

Before adding a library, ask:

1. Who owns this state?
2. Who needs to read it?
3. Who needs to update it?
4. Should it survive refresh?
5. Should it be shareable in a URL?
6. Is it copied from the server?
7. How often does it change?
8. Do we need debugging tools or action history?

The answers usually point to the right location.

## Example: Product Search Page

A product search page might use several state strategies at once.

```jsx
function ProductsPage() {
  const [viewMode, setViewMode] = useState("grid");
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "all";

  const productsQuery = useQuery({
    queryKey: ["products", category],
    queryFn: () => fetchProducts({ category }),
  });

  return (
    <ProductLayout
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      products={productsQuery.data ?? []}
    />
  );
}
```

Here:

- `viewMode` is local UI state
- `category` is URL state
- `productsQuery` is server state

No global client store is needed yet.

## Example: Shopping Cart

A cart may need global client state because many screens update it.

```js
const useCartStore = create((set) => ({
  items: [],
  addItem(product) {
    set((state) => ({ items: [...state.items, product] }));
  },
  clearCart() {
    set({ items: [] });
  },
}));
```

If the cart must sync across devices, the server becomes the source of truth and the client store may only represent pending local UI changes.

## Tricky Cases

Authentication is often mixed state.

The current session may come from the server, while small UI permissions or user menu state may be local.

Forms are also mixed.

Draft input values are often local, but saved form data may be server state, and multi-step wizard progress may belong in URL or global state depending on refresh and navigation needs.

## Common Mistakes

- Adding Redux because "large apps use Redux".
- Avoiding libraries so strongly that Context providers become a hidden global store.
- Storing URL-like state in memory, breaking refresh and share links.
- Storing API responses in multiple places and creating synchronization bugs.
- Choosing a tool without considering team familiarity and debugging workflow.

:::quiz
question: A page has a `page=3` pagination value that should survive refresh and be shareable. Where should it usually live?
options:
  - Local component state only
  - A Redux slice
  - The URL query string
  - A ref
answer: 2
explanation: Pagination that affects navigation and shareable page state is usually best represented in the URL.
:::

## Practical Challenge

For a project management app, decide where each value belongs:

- current user profile
- sidebar collapsed state
- selected project id
- task list loaded from an API
- unsaved task title input
- global toast notifications

For each one, name the state category and the React or library tool you would start with.

## Recap

The best state management solution is usually a combination.

Use local state, URL state, server-state caches, Context, and global stores where each one fits.

Good React architecture comes from putting state where it naturally belongs.
