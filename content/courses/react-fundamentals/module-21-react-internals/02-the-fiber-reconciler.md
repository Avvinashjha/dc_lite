# The Fiber Reconciler

Fiber is React's internal architecture for representing work.

Before Fiber, rendering large updates was harder to pause or split. Fiber lets React break rendering into units, prioritize them, and resume or discard work when needed.

You do not usually interact with Fiber directly, but understanding it explains many React behaviors.

## What Is a Fiber?

A fiber is an internal object representing a unit of work for a component or host element.

You can think of it as React's working record for part of the UI tree.

```text
App fiber
  Header fiber
  Main fiber
    ProductList fiber
      ProductRow fiber
```

A fiber tracks information such as:

- component type
- props
- state
- child and sibling relationships
- pending updates
- effects that need to run
- priority information

This is an implementation model, not a public API.

## Why React Needs Reconciliation

When state changes, React receives a new description of UI.

It needs to decide how that new tree relates to the previous tree.

```jsx
function Tabs({ activeTab }) {
  return activeTab === "profile" ? <Profile /> : <Settings />;
}
```

If `activeTab` changes, React must decide which fibers can be reused and which need to be mounted or removed.

## The Basic Matching Rules

React's reconciliation uses practical heuristics.

For a given position in the tree:

- same component type usually means update existing component state
- different component type means replace that subtree
- keys help match children across reorders

```jsx
{items.map((item) => (
  <TodoRow key={item.id} todo={item} />
))}
```

Keys tell React which item is which between renders.

## Why Keys Matter

Without stable keys, React may match items by position.

```jsx
{items.map((item, index) => (
  <TodoRow key={index} todo={item} />
))}
```

Using the index as a key can be fine for a static list. It is risky when items can be inserted, removed, sorted, or filtered.

The problem is not only rendering speed. It can attach old state to the wrong item.

```text
Before insert:
0 -> "Buy milk"     editing: false
1 -> "Pay rent"     editing: true

After insert at top with index keys:
0 -> "Call bank"    gets old state from "Buy milk"
1 -> "Buy milk"     gets old state from "Pay rent"
```

Stable identity prevents these bugs.

## Render Work Can Be Reused

Fiber keeps enough information for React to compare old and new work.

React does not diff raw HTML strings. It walks the tree of fibers and elements.

For each part of the tree, React asks:

- is this the same type as before?
- does it have the same key?
- do props or state require children to be recalculated?
- are there effects to run later?

## Reconciliation Is Not a Deep Object Diff

React does not recursively inspect every object prop for semantic equality.

```jsx
function App() {
  const options = { sort: "name" };
  return <UserList options={options} />;
}
```

This creates a new `options` object on every render. React can still render correctly, but memoized children may see the prop as changed.

```jsx
const UserList = memo(function UserList({ options }) {
  // ...
});
```

`memo` compares props shallowly by default.

## Fiber and State Preservation

State is tied to a component's position in the tree, plus its type and key.

```jsx
function App({ showCompany }) {
  return (
    <section>
      {showCompany ? <CompanyForm /> : <PersonForm />}
    </section>
  );
}
```

Switching between different component types resets state.

Keys can intentionally reset state too.

```jsx
<ProfileForm key={userId} userId={userId} />
```

When `userId` changes, React treats this as a different form.

## Common Mistakes

- Using array indexes as keys for editable or reorderable lists.
- Expecting React to deeply compare prop objects.
- Assuming state belongs to JSX text instead of tree position.
- Adding random keys such as `key={Math.random()}`, which forces remounts every render.
- Treating Fiber as a public API.

## Edge Cases

Conditional rendering can preserve state when the same component stays in the same position.

```jsx
function Panel({ compact }) {
  return compact ? <Details size="small" /> : <Details size="large" />;
}
```

`Details` stays the same component type in the same position, so its state is preserved.

If you need a reset, use a key.

```jsx
<Details key={compact ? "compact" : "full"} size={compact ? "small" : "large"} />
```

:::quiz
question: Why can `key={index}` cause bugs in a list?
options:
  - React may preserve state by position and attach it to the wrong item after reordering
  - React does not allow numeric keys
  - Index keys always prevent rendering
  - Index keys disable event handlers
answer: 0
explanation: Index keys make identity depend on position. If the order changes, React can reuse component state for a different item.
:::

## Practical Challenge

Build a list of editable notes. First use `key={index}`. Then insert a new note at the top while one row is being edited.

Replace the key with a stable note id and compare the behavior.

## Recap

Fiber is React's internal work structure. Reconciliation uses type, position, and keys to decide what can be reused.

Good keys are not just a performance detail. They preserve the correct identity of stateful UI.
