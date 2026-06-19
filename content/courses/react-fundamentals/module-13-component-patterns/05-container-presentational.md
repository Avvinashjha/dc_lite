# Container and Presentational Components

The container/presentational pattern separates data and behavior from visual rendering.

It is not a rule. It is a way to keep components easier to understand when one component is doing too much.

## Presentational Components

A presentational component focuses on how things look.

```jsx
function UserList({ users, onSelectUser }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <button onClick={() => onSelectUser(user.id)}>
            {user.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

This component does not fetch users. It receives users and callbacks through props.

Presentational components are often:

- easier to reuse
- easier to test
- easier to render in Storybook or examples
- less tied to routing, APIs, or global state

## Container Components

A container component focuses on where data comes from and what actions mean.

```jsx
function UserListContainer() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then(setUsers);
  }, []);

  return (
    <UserList
      users={users}
      onSelectUser={(id) => navigate(`/users/${id}`)}
    />
  );
}
```

The container knows about fetching and navigation. The presentational component only knows how to render a list.

## Controlled and Uncontrolled Components

This pattern also appears in form components.

Controlled input:

```jsx
function SearchBox({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search"
    />
  );
}
```

The parent owns the value.

Uncontrolled input:

```jsx
function SearchBox({ defaultValue = "", onSearch }) {
  const inputRef = useRef(null);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(inputRef.current.value);
      }}
    >
      <input ref={inputRef} defaultValue={defaultValue} />
      <button>Search</button>
    </form>
  );
}
```

The DOM owns the current value until submit.

Controlled components are better when React needs to validate, filter, or react to every change. Uncontrolled components can be simpler for one-off form reads.

## Custom Hooks as Containers

Modern React often moves container logic into a custom hook.

```jsx
function useUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then(setUsers);
  }, []);

  return users;
}

function UserListPage() {
  const users = useUsers();
  const navigate = useNavigate();

  return <UserList users={users} onSelectUser={(id) => navigate(`/users/${id}`)} />;
}
```

The page component becomes a thin container.

## When the Pattern Helps

Use this split when:

- rendering is mixed with fetching, routing, permissions, and analytics
- the visual component should be reused with different data sources
- tests are hard because a component requires too much setup
- a design system component should not know app-specific behavior

Do not split every component automatically. Small components can keep data and rendering together.

## Common Mistakes

- Creating extra files for tiny components without improving clarity.
- Calling a component "presentational" but letting it fetch data anyway.
- Passing too many unrelated props through a container.
- Making uncontrolled inputs when the parent needs live validation.
- Making controlled inputs when the value is only needed on submit.

:::quiz
question: What is the main purpose of the container/presentational pattern?
options:
  - To separate data and behavior concerns from rendering concerns
  - To force every component into two files
  - To avoid using props
  - To make all form inputs uncontrolled
answer: 0
explanation: The pattern is useful when separating data orchestration from visual rendering makes the code easier to understand or reuse.
:::

## Recap

Container components decide what data and actions mean. Presentational components focus on rendering.

Use the split when it reduces complexity. Prefer simple components when no split is needed.

## Practice

Start with a `ProductsPage` that fetches products and renders all markup in one component.

Extract a presentational `ProductGrid`, then decide whether the remaining data logic belongs in a container component or a custom hook.
