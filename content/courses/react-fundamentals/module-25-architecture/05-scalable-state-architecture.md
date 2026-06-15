# Scalable State Architecture

State architecture is about putting each kind of state in the right place.

React apps become difficult when every value is treated the same way. Local UI state, server data, form state, URL state, and global app state have different needs.

## Types of State

Common categories:

- local UI state: open menus, selected tabs, temporary toggles
- form state: input values, touched fields, validation
- server state: data fetched from APIs
- URL state: filters, search, page number, route params
- global client state: auth user, theme, feature flags
- derived state: values calculated from other state

Classifying state helps choose where it belongs.

## Keep State Close

Start by storing state near where it is used.

```jsx
function AccordionItem() {
  const [isOpen, setIsOpen] = useState(false);
  return <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>;
}
```

Do not move state global just because it exists.

Lift state when multiple siblings need to coordinate.

## Avoid Duplicated State

If a value can be derived, do not store it separately.

```jsx
const completedCount = lessons.filter((lesson) => lesson.completed).length;
```

Avoid:

```jsx
const [completedCount, setCompletedCount] = useState(0);
```

Duplicated state can get out of sync.

## Server State Is Different

Server state is owned by the backend.

It has concerns such as:

- loading
- errors
- caching
- refetching
- stale data
- optimistic updates
- pagination
- background refresh

Libraries such as React Query, SWR, Apollo Client, or framework loaders can help.

Avoid copying server data into global client state unless you have a clear reason.

## URL State

Filters, search queries, and page numbers often belong in the URL.

```text
/courses?level=beginner&page=2
```

Benefits:

- shareable links
- back/forward button support
- reload preserves state
- easier deep linking

Do not hide important navigation state only in memory.

## Context

Context is useful for values needed by many components.

Good fits:

- theme
- current user summary
- locale
- app configuration
- feature flags

Be careful with frequently changing values in broad contexts. Every consumer may re-render when the context value changes.

Split contexts or use selector-based state libraries when needed.

## Reducers and State Machines

Reducers help when transitions are explicit.

```js
function checkoutReducer(state, action) {
  switch (action.type) {
    case "shippingSubmitted":
      return { ...state, step: "payment", shipping: action.shipping };
    case "paymentFailed":
      return { ...state, error: action.error };
    default:
      return state;
  }
}
```

For complex workflows, a state machine can make allowed transitions clear.

```text
cart -> shipping -> payment -> review -> complete
                  -> paymentError
```

## Global Stores

Global state libraries can be useful, but they should have a purpose.

Use a global store for:

- client state used across distant parts of the app
- complex cross-feature interactions
- data that must survive route changes
- performance-sensitive subscriptions

Do not use a global store as a dumping ground for all fetched data and all form fields.

## Common Mistakes

- Putting all state in one global store.
- Copying props into state without a synchronization plan.
- Storing derived values and forgetting to update them.
- Keeping route filters out of the URL.
- Using context for high-frequency updates across a large tree.
- Treating server state like local UI state.

## Edge Case

Sometimes local state should reset when an identity changes.

```jsx
<LessonEditor key={lessonId} lessonId={lessonId} />
```

The key tells React to create a fresh editor state for a different lesson.

:::quiz
question: Which value is usually best represented as URL state?
options:
  - A course search filter the user may share or reload
  - Whether one tooltip is currently hovered
  - A temporary password field value
  - A private database connection
answer: 0
explanation: Search filters are often shareable navigation state, so the URL is a good place for them.
:::

## Practical Challenge

Audit a page and classify every state value as:

- local UI state
- form state
- server state
- URL state
- global client state
- derived state

Move one misplaced state value to a better home and explain the tradeoff.

## Recap

Scalable state architecture starts with classification.

Keep state close, derive what you can, use the URL for navigation state, treat server state separately, and reserve global stores for real cross-app needs.
