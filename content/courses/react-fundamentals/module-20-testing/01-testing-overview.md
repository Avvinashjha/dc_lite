# Testing Overview

Testing gives you evidence that the application behaves the way users and developers expect.

React testing is not about testing React itself.

It is about testing your components, state, data flows, and user interactions.

## The Testing Pyramid

A common way to think about tests:

- unit tests: small functions or hooks
- component tests: React components rendered with realistic user interactions
- integration tests: multiple parts working together
- end-to-end tests: the full app in a browser

Most projects need many focused tests and fewer full browser tests.

E2E tests are powerful, but slower and more expensive to maintain.

## What to Test

Good tests focus on behavior.

Examples:

- a button submits the form when required fields are valid
- an error message appears when the request fails
- a user can open and close a menu with keyboard controls
- a reducer returns the expected next state
- a route redirects unauthenticated users

Avoid testing implementation details that users do not observe.

## Testing Tools Awareness

Common tools:

- Jest: mature JavaScript test runner and assertion library
- Vitest: fast Vite-friendly test runner with Jest-like APIs
- React Testing Library: render React components and query like a user
- Testing Library user-event: simulate realistic user interactions
- Playwright or Cypress: browser-based end-to-end testing

Tool choice depends on the project setup.

The testing principles are more important than memorizing one runner.

## Behavior Over Implementation

Less helpful:

```tsx
expect(wrapper.state("open")).toBe(true);
```

More helpful:

```tsx
await user.click(screen.getByRole("button", { name: /menu/i }));
expect(screen.getByRole("navigation")).toBeInTheDocument();
```

The second test checks what a user can observe.

It is less tied to how state is stored internally.

## Common Mistakes

- Writing only snapshot tests.
- Testing private implementation details instead of user-visible behavior.
- Mocking so much that the test no longer resembles the app.
- Having many slow E2E tests for cases a component test could cover.
- Ignoring accessibility queries and keyboard behavior.

:::quiz
question: What should most React component tests prioritize?
options:
  - Internal state variable names
  - User-visible behavior and interactions
  - The exact number of hooks called
  - The names of CSS classes only
answer: 1
explanation: Behavior-focused tests survive refactors better and verify what matters to users.
:::

## Practical Challenge

Pick a login form and write a test plan with:

- two component tests
- one unit test
- one E2E test
- one accessibility-focused check

For each test, explain why that level is the right level.

## Recap

Good testing balances confidence and maintenance cost.

Use the testing pyramid, prefer behavior over implementation details, and include accessibility and error paths in your definition of "works".
