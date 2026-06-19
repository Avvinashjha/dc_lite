# Generics in Components

Generics let a component or function work with many data types while preserving type safety.

They are useful for reusable lists, tables, selectors, forms, and custom hooks.

## Generic Functions First

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const firstName = first(["Ava", "Mina"]);
const firstNumber = first([1, 2, 3]);
```

`T` represents the item type.

TypeScript infers it from the argument.

## Generic List Component

```tsx
type ListProps<T> = {
  items: T[];
  getKey: (item: T) => React.Key;
  renderItem: (item: T) => React.ReactNode;
};

function List<T>({ items, getKey, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

Usage:

```tsx
<List
  items={users}
  getKey={(user) => user.id}
  renderItem={(user) => <span>{user.name}</span>}
/>;
```

Inside `renderItem`, `user` has the correct type.

## Constraining Generics

Sometimes a generic type must have certain fields.

```tsx
type Option = {
  id: string;
  label: string;
};

type SelectProps<T extends Option> = {
  options: T[];
  value: string;
  onChange: (id: string) => void;
};

function Select<T extends Option>({ options, value, onChange }: SelectProps<T>) {
  return (
    <select value={value} onChange={(event) => onChange(event.currentTarget.value)}>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
```

The component accepts richer option objects, but it requires `id` and `label`.

## Generic Custom Hooks

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = window.localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

This hook can store strings, objects, arrays, or booleans.

Remember that parsing JSON from storage is runtime data, so the type assertion should be used thoughtfully.

## Common Mistakes

- Using generics when a simple prop type is clearer.
- Naming every generic `T` even when a descriptive name would help.
- Forgetting constraints when the component assumes certain fields.
- Using `any` inside a generic component and losing the benefit.
- Trusting generic types for unvalidated runtime data.

:::quiz
question: What does `T extends { id: string }` mean?
options:
  - T must be exactly `{ id: string }` and no other fields
  - T must have at least an `id` string field
  - T must be a React component
  - T is converted into a string
answer: 1
explanation: A generic constraint requires the type to include the specified structure, while still allowing additional fields.
:::

## Practical Challenge

Build a generic `DataTable<T>` component.

It should accept:

- `rows: T[]`
- `getRowKey(row): React.Key`
- `columns`, where each column has a label and `render(row)` function

Use it with a `User` type and a `Product` type.

## Recap

Generics make reusable React utilities type-safe.

Use them when a component truly works across multiple data shapes, and add constraints when the component relies on specific fields.
