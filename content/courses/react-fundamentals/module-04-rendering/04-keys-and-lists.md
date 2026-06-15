# Keys and Lists

Lists are one of the first places where React's rendering model becomes visible.

You usually render lists with `.map()` and give each item a stable `key`.

```jsx
function ProjectList({ projects }) {
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  );
}
```

## Rendering Arrays

JSX can render arrays of elements.

```jsx
const items = [
  <li key="html">HTML</li>,
  <li key="css">CSS</li>,
  <li key="js">JavaScript</li>,
];

function SkillList() {
  return <ul>{items}</ul>;
}
```

In real components, arrays usually come from data.

```jsx
function SkillList({ skills }) {
  return (
    <ul>
      {skills.map((skill) => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>
  );
}
```

## What Makes a Good Key

A good key is:

- unique among siblings
- stable between renders
- tied to the item's identity

Database ids, slugs, and stable generated ids from your data are good choices.

```jsx
<InvoiceRow key={invoice.id} invoice={invoice} />
```

Values that can change are poor keys.

```jsx
// Bad if displayName can change
<UserRow key={user.displayName} user={user} />
```

## Why Index Keys Can Break UI

Array indexes are tempting.

```jsx
{todos.map((todo, index) => (
  <TodoItem key={index} todo={todo} />
))}
```

This is safe only for static lists that never reorder, insert, or delete items.

Consider a todo list where each row has an input. If you use indexes and insert a new todo at the top, React may preserve the input state by position instead of by todo identity. A draft typed into one row can appear attached to another row.

Use ids instead:

```jsx
{todos.map((todo) => (
  <TodoItem key={todo.id} todo={todo} />
))}
```

## Filtering and Sorting

Keys are especially important when the same list can be filtered or sorted.

```jsx
function ProductList({ products, query }) {
  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ul>
      {visibleProducts.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

Filtering changes positions. Stable keys let React keep track of which items remain.

## Empty States

Lists should handle the empty case clearly.

```jsx
function NotificationList({ notifications }) {
  if (notifications.length === 0) {
    return <p>No notifications.</p>;
  }

  return (
    <ul>
      {notifications.map((notification) => (
        <li key={notification.id}>{notification.message}</li>
      ))}
    </ul>
  );
}
```

Do not leave the user staring at a blank area when no data exists.

## Nested Lists

Keys only need to be unique among siblings, not globally across the app.

```jsx
function Menu({ sections }) {
  return (
    <nav>
      {sections.map((section) => (
        <section key={section.id}>
          <h2>{section.title}</h2>
          <ul>
            {section.links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
```

The section keys are compared with other sections. The link keys are compared with other links in the same `ul`.

## Common Mistakes

- Using indexes as keys for lists that can change order.
- Using `Math.random()` as a key. This changes every render and forces React to recreate items.
- Forgetting keys on the outermost element returned by `.map()`.
- Putting the key on a child inside the mapped component instead of on the element returned by the map.
- Assuming keys are available as `props.key`.

:::quiz
question: Why is `key={Math.random()}` a bad idea?
options:
  - It creates a key that changes every render, so React cannot preserve item identity
  - React does not allow numeric keys
  - Random keys make CSS invalid
  - Keys must always be database ids
answer: 0
explanation: If keys change every render, React treats items as new each time. This can lose state and cause unnecessary DOM work.
:::

## Practice Challenge

Build a `ShoppingList` component.

Requirements:

- Accept an `items` array with `{ id, name, quantity }`.
- Render an empty state if the array is empty.
- Render a list of item names and quantities.
- Use each item's `id` as the key.
- Add a note explaining why index keys would be risky if items can be removed.

## Recap

Lists are rendered with arrays of elements. Stable keys help React preserve identity correctly when items are inserted, removed, filtered, or reordered.
