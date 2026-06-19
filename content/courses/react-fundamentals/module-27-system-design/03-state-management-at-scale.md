# State Management at Scale

State management at scale begins by asking what kind of state you have. React apps become fragile when every value is treated as global application state.

## State Categories

Common state categories include:

- local UI state: dropdown open, selected tab, input draft
- server state: fetched data, cache status, mutation status
- URL state: filters, page numbers, route ids
- form state: validation, dirty fields, submission status
- global client state: authenticated user, theme, feature flags
- persisted state: values saved to local storage or IndexedDB

Each category has different lifetime and ownership.

## Local State First

```jsx
function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section>
      <button onClick={() => setIsOpen((value) => !value)}>{title}</button>
      {isOpen && <div>{children}</div>}
    </section>
  );
}
```

This state belongs to the component. Moving it into a global store would make the app harder to understand.

## Server State Is Different

Server state has loading, error, freshness, caching, refetching, and mutation concerns. A dedicated server-state library can be useful when these concerns grow.

Questions to ask:

- how fresh must the data be?
- should data be refetched on focus?
- what happens after a mutation?
- can multiple screens share cached results?
- how are optimistic updates rolled back?

## URL State

If state should survive refresh, support sharing, or affect navigation, consider the URL.

```text
/products?category=books&page=2&sort=price
```

URL state is especially useful for search, filters, pagination, and selected tabs on shareable pages.

## Context Is Not a Store by Itself

React Context passes values through the tree. It does not automatically solve caching, updates, normalization, or performance.

Context works well for values like:

- theme
- current locale
- auth session summary
- dependency injection for clients

For frequently changing large data, context can cause broad rerenders unless carefully structured.

## Ownership Contracts

At scale, state needs ownership rules.

For each important value, define:

- who owns the source of truth
- which components may update it
- whether it is local, URL, server, global, or persisted state
- how stale data is refreshed
- what happens when updates fail

Example:

```text
Product filters: URL owns the source of truth.
Product results: server-state cache owns fetched data.
Selected row: local page state owns the current selection.
Cart count: server response owns final value after mutation.
```

Clear contracts prevent accidental duplication, such as storing the same filter in a component, URL search params, and global store at the same time.

## Common Mistakes

- Putting form drafts in global state without a reason.
- Storing server data manually without handling stale data or mutation errors.
- Keeping filters in component state when users expect shareable URLs.
- Using context for a high-frequency value that rerenders the whole app.
- Duplicating the same state in several places and trying to keep it synchronized.
- Letting multiple teams update shared state without defining ownership and failure behavior.

:::quiz
question: Which state is usually a strong candidate for URL state?
options:
  - Search filters that should survive refresh and be shareable
  - Whether a tooltip is currently visible while hovering
  - A password typed into a login form
  - A temporary animation frame value
answer: 0
explanation: Search filters often represent navigation state. The URL makes them refresh-safe and shareable.
:::

## Practice Challenge

Take a product listing page and classify each state value as local UI, server, URL, form, global, or persisted state. Move one filter from component state into the URL and explain the tradeoff.

## Recap

Good state architecture reduces synchronization problems. Choose the smallest owner that matches the state's lifetime, sharing needs, and user expectations.
