# React Testing Library

React Testing Library helps you test components through the DOM.

Its guiding idea is simple: the more your tests resemble how users use the app, the more confidence they give.

## Rendering a Component

```tsx
import { render, screen } from "@testing-library/react";

function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}

test("greets the user", () => {
  render(<Greeting name="Ava" />);

  expect(screen.getByRole("heading", { name: "Hello, Ava" })).toBeInTheDocument();
});
```

`screen` queries the rendered document.

Prefer role and accessible-name queries when possible.

## Query Priority

Good query choices often follow this order:

- `getByRole`
- `getByLabelText`
- `getByPlaceholderText`
- `getByText`
- `getByDisplayValue`
- `getByAltText`
- `getByTitle`
- `getByTestId` as a last resort

This pushes tests toward accessible markup.

## User Events

Use `@testing-library/user-event` for realistic interactions.

```tsx
import userEvent from "@testing-library/user-event";

test("submits the search query", async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();

  render(<SearchForm onSearch={onSearch} />);

  await user.type(screen.getByRole("textbox", { name: /search/i }), "react");
  await user.click(screen.getByRole("button", { name: /search/i }));

  expect(onSearch).toHaveBeenCalledWith("react");
});
```

In Jest, use `jest.fn()` instead of `vi.fn()`.

## Async UI

Use `findBy...` when an element appears later.

```tsx
test("shows loaded user", async () => {
  render(<UserProfile userId="u1" />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: /ava/i })).toBeInTheDocument();
});
```

`findBy` waits for the element until a timeout.

## Negative Assertions

Use `queryBy...` when checking that something is absent.

```tsx
expect(screen.queryByRole("alert")).not.toBeInTheDocument();
```

`getBy...` throws when it cannot find an element, so it is not right for absence checks.

## Common Mistakes

- Querying by CSS class instead of role, label, or text.
- Using `getByTestId` for elements that have accessible roles.
- Forgetting `await` for user events and async UI.
- Testing implementation details like component state.
- Writing tests that pass even when the UI is inaccessible.

:::quiz
question: Which query is usually best for finding a submit button named "Save"?
options:
  - getByRole("button", { name: /save/i })
  - getByClassName("primary")
  - getByTestId("button-1") as the first choice
  - getByState("clicked")
answer: 0
explanation: Role and accessible name match how users and assistive technologies identify interactive elements.
:::

## Practical Challenge

Test a `NewsletterForm`.

It should:

- type an email address
- submit the form
- call `onSubscribe(email)`
- show a validation message for an invalid email
- query the input by label and the button by role

## Recap

React Testing Library encourages behavior-focused, accessible tests.

Use role and label queries, realistic user events, async helpers for delayed UI, and test IDs only when there is no user-facing query.
