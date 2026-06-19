# Styled Components

Styled Components is a CSS-in-JS library.

It lets you define styled React components with CSS written in JavaScript template strings.

```jsx
import styled from "styled-components";

const Card = styled.article`
  border: 1px solid #d0d7de;
  border-radius: 8px;
  padding: 1rem;
`;

function ProductCard({ product }) {
  return <Card>{product.name}</Card>;
}
```

The generated class names are scoped to the component.

## Styling With Props

CSS-in-JS is often used for prop-based variants.

```jsx
const Button = styled.button`
  border: 0;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  background: ${(props) => (props.$danger ? "#cf222e" : "#0969da")};
  color: white;
`;

function DeleteButton() {
  return <Button $danger>Delete</Button>;
}
```

The `$danger` prop is a transient prop convention.

It is used by Styled Components without being passed to the DOM as an invalid HTML attribute.

## Pseudo-Classes and Media Queries

Styled Components supports normal CSS features.

```jsx
const LinkButton = styled.a`
  color: #0969da;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 3px solid #54aeff;
    outline-offset: 2px;
  }

  @media (max-width: 600px) {
    display: block;
    width: 100%;
  }
`;
```

This is more expressive than inline styles.

## Theming

Styled Components has a `ThemeProvider`.

```jsx
const theme = {
  colors: {
    primary: "#0969da",
    text: "#24292f",
  },
};

const Title = styled.h1`
  color: ${(props) => props.theme.colors.text};
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Title>Dashboard</Title>
    </ThemeProvider>
  );
}
```

This can be useful for design systems.

## Tradeoffs

Styled Components can improve colocation and variant handling.

It also adds a dependency and can introduce runtime styling cost depending on setup.

Server rendering and critical CSS extraction may require framework-specific configuration.

For simple static styles, CSS Modules or plain CSS may be easier.

## Common Mistakes

- Creating styled components inside render functions, causing new component definitions on every render.
- Passing styling props to the DOM instead of using transient props.
- Using dynamic styles for values that could be stable CSS classes.
- Forgetting accessible focus and disabled states.
- Letting every component invent its own colors instead of using theme tokens.

:::quiz
question: Why might a Styled Components prop be named `$danger` instead of `danger`?
options:
  - To make it a required React prop
  - To mark it as transient so it is not forwarded to the DOM
  - To convert it into a CSS variable automatically
  - To make it available in localStorage
answer: 1
explanation: Transient props are consumed by Styled Components and are not passed as invalid attributes to DOM elements.
:::

## Practical Challenge

Build a styled `Alert` component with:

- `success`, `warning`, and `error` variants
- visible focus styling for an optional action button
- theme-based colors
- no invalid props passed to the DOM

## Recap

Styled Components shines when component variants, theming, and colocated styles matter.

Use it with discipline: keep styled component definitions stable, prefer design tokens, and consider runtime and server-rendering tradeoffs.
