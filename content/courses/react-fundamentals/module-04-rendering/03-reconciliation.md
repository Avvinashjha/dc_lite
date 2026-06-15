# Reconciliation and Diffing

Reconciliation is React's process for matching the previous UI tree with the next UI tree.

Diffing is the comparison step inside that process.

## The Core Idea

When state changes, React calls components again.

```jsx
function Status({ isOnline }) {
  return <p>{isOnline ? "Online" : "Offline"}</p>;
}
```

If `isOnline` changes, React compares:

```jsx
<p>Offline</p>
```

with:

```jsx
<p>Online</p>
```

The element type is still `p`, so React can keep the same DOM node and update its text.

## Element Type Matters

If the element type changes, React usually treats it as a different subtree.

```jsx
function Message({ important }) {
  if (important) {
    return <strong>Read this</strong>;
  }

  return <span>Read this</span>;
}
```

Switching from `span` to `strong` means React replaces that DOM element.

The same idea applies to components.

```jsx
{mode === "edit" ? <EditForm /> : <ReadOnlyView />}
```

Changing component types can unmount one component and mount another, which resets state inside that subtree.

## Position Matters

React matches children by their position unless keys tell it otherwise.

```jsx
function Toolbar({ isAdmin }) {
  return (
    <div>
      {isAdmin && <button>Delete</button>}
      <button>Save</button>
    </div>
  );
}
```

When `isAdmin` changes from `false` to `true`, the `Save` button shifts from the first child position to the second. For simple DOM nodes this may be fine, but for stateful components position changes can reset or move state in surprising ways.

Keys help React understand identity in lists and changing sets of children.

## Keys and Identity

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
```

The key tells React that the item with id `todo-7` is the same logical item even if it moves to another position.

Keys are not passed as normal props.

```jsx
function TodoItem({ todo }) {
  // There is no props.key here.
  return <li>{todo.text}</li>;
}
```

If the component needs the id, pass it explicitly.

```jsx
<TodoItem key={todo.id} id={todo.id} todo={todo} />
```

## State Preservation and Reset

React preserves component state when the same component type stays in the same position.

```jsx
{isCompact ? <SearchBox /> : <SearchBox />}
```

This preserves `SearchBox` state because both branches produce the same component type in the same place.

To intentionally reset state, change the key.

```jsx
<ProfileForm key={user.id} user={user} />
```

When `user.id` changes, React treats it as a different `ProfileForm` instance and resets its internal state.

## Common Mistakes

- Assuming React matches elements by visual similarity instead of type, position, and key.
- Using array indexes as keys for lists that can reorder or delete items.
- Expecting a component's state to reset when props change. Props changing does not automatically reset local state.
- Forgetting that switching component types unmounts one subtree and mounts another.
- Trying to read `key` inside the child component as a normal prop.

:::quiz
question: What is the main purpose of keys during reconciliation?
options:
  - To style list items
  - To help React track item identity across renders
  - To make props read-only
  - To prevent all re-renders
answer: 1
explanation: Keys tell React which children represent the same logical items between renders, especially when items are inserted, removed, or reordered.
:::

## Practice Challenge

You have a tabbed profile page:

```jsx
<ProfileEditor user={selectedUser} />
```

The editor has local draft state. When `selectedUser` changes, the draft should reset.

Update the JSX so React treats each selected user as a distinct editor instance. Then explain why the change works.

## Recap

Reconciliation matches old and new UI trees. React preserves or replaces DOM and component state based on element type, position, and keys.
