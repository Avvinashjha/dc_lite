# Typing Props

Props are one of the best places to use TypeScript in React.

Typed props make a component's public contract clear.

## Basic Props

```tsx
type ButtonProps = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

function Button({ label, disabled = false, onClick }: ButtonProps) {
  return (
    <button disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
```

`disabled?: boolean` means the prop is optional.

The default value keeps the component behavior predictable.

## Children

Use `React.ReactNode` when a component accepts normal renderable children.

```tsx
type CardProps = {
  title: string;
  children: React.ReactNode;
};

function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

`React.ReactNode` covers strings, numbers, elements, fragments, `null`, and arrays of renderable content.

## Event Callback Props

Callback props should describe what information the child sends back.

```tsx
type SearchBoxProps = {
  value: string;
  onChange: (nextValue: string) => void;
};

function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  );
}
```

The parent does not need to know about DOM events if the component can pass a clean value.

## Union Props

Unions can limit allowed values.

```tsx
type AlertProps = {
  tone: "success" | "warning" | "error";
  message: string;
};

function Alert({ tone, message }: AlertProps) {
  return <p className={`alert alert-${tone}`}>{message}</p>;
}
```

Now `tone="danger"` is rejected unless it is part of the union.

## Discriminated Union Props

Sometimes props change based on a mode.

```tsx
type LinkButtonProps =
  | {
      kind: "link";
      href: string;
      children: React.ReactNode;
    }
  | {
      kind: "button";
      onClick: () => void;
      children: React.ReactNode;
    };

function LinkButton(props: LinkButtonProps) {
  if (props.kind === "link") {
    return <a href={props.href}>{props.children}</a>;
  }

  return <button onClick={props.onClick}>{props.children}</button>;
}
```

This prevents invalid combinations such as a link without `href` or a button without `onClick`.

## Common Mistakes

- Using `any` for props because the component is still changing.
- Making required props optional to avoid fixing call sites.
- Passing raw DOM events to parents when a simpler value would be better.
- Using `React.FC` without understanding its children behavior and tradeoffs.
- Using one large prop object type for unrelated components.

:::quiz
question: What is a benefit of discriminated union props?
options:
  - They allow every prop combination
  - They model different valid prop shapes based on a shared field
  - They remove the need to render JSX
  - They convert props into global state
answer: 1
explanation: A discriminant such as `kind` lets TypeScript narrow props to the correct shape for each component mode.
:::

## Practical Challenge

Create a `Notification` component with two valid prop shapes:

- `{ type: "info"; message: string }`
- `{ type: "action"; message: string; actionLabel: string; onAction: () => void }`

Render the action button only for the action variant.

Then try passing `type: "action"` without `onAction` and confirm TypeScript catches it.

## Recap

Typed props are component documentation that the compiler can enforce.

Use required fields, optional fields, callback types, unions, and discriminated unions to describe the real ways a component can be used.
