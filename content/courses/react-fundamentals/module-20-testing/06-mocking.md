# Mocking and Spies

Mocking replaces a real dependency with a controlled test version.

Spies record how a function was called.

Both are useful, but overusing them can make tests less realistic.

## Function Spies

```tsx
test("calls onSave with the title", async () => {
  const user = userEvent.setup();
  const onSave = vi.fn();

  render(<TitleForm onSave={onSave} />);

  await user.type(screen.getByRole("textbox", { name: /title/i }), "Roadmap");
  await user.click(screen.getByRole("button", { name: /save/i }));

  expect(onSave).toHaveBeenCalledWith("Roadmap");
});
```

In Jest, use `jest.fn()`.

In Vitest, use `vi.fn()`.

## Mocking API Requests

Prefer mocking at the network boundary when testing components that fetch data.

Mock Service Worker, often called MSW, is a common tool for this.

```ts
http.get("/api/users/:id", () => {
  return HttpResponse.json({ id: "u1", name: "Ava" });
});
```

The component still runs its real fetching code.

The test controls the server response.

## Mocking Modules

Sometimes you need to mock a module.

```ts
vi.mock("../analytics", () => ({
  trackEvent: vi.fn(),
}));
```

Use module mocks for boundaries such as analytics, feature flags, or browser-only APIs.

Avoid mocking the component you are trying to gain confidence in.

## Mocking Browser APIs

Some browser APIs are not fully available in test environments.

```ts
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: query.includes("dark"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});
```

Keep these mocks close to test setup and document why they exist.

## What Not to Mock

Be careful about mocking:

- React Testing Library
- the component under test
- simple pure functions that are part of the behavior
- every child component by default
- implementation details just to make assertions easier

If all dependencies are mocked, the test may only prove that mocks were called.

## Common Mistakes

- Mocking too deeply and losing realistic behavior.
- Forgetting to reset mocks between tests.
- Testing that a private helper was called instead of testing visible output.
- Mocking successful requests only and never testing failure.
- Letting mock data drift away from real API shapes.

:::quiz
question: Why is network-level mocking often better than mocking a data-fetching hook directly?
options:
  - It lets the component use its real request logic while the test controls the response
  - It prevents any assertions from running
  - It makes tests depend on the live production server
  - It disables accessibility queries
answer: 0
explanation: Network-level mocks preserve more of the real component behavior while avoiding live network dependency.
:::

## Practical Challenge

Test a `UserProfile` component that fetches `/api/users/u1`.

Mock:

- a successful response
- a 500 error response
- a slow response that shows loading UI

Assert visible behavior for each case.

Then identify one dependency that should not be mocked.

## Recap

Mocks are tools for controlling boundaries.

Use spies for callbacks, network mocks for API behavior, and module mocks for true external boundaries while keeping tests as realistic as practical.
