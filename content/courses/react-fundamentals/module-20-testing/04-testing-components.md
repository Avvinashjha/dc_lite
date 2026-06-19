# Testing Components

Component tests verify what a component renders and how it responds to user interaction.

They should usually treat the component as a user-facing unit, not as a collection of internal state variables.

## Testing Conditional Rendering

```tsx
function SaveStatus({ status }: { status: "idle" | "saving" | "saved" | "error" }) {
  if (status === "saving") return <p aria-live="polite">Saving...</p>;
  if (status === "saved") return <p>Saved</p>;
  if (status === "error") return <p role="alert">Could not save</p>;

  return null;
}
```

```tsx
test("shows an error message", () => {
  render(<SaveStatus status="error" />);

  expect(screen.getByRole("alert")).toHaveTextContent("Could not save");
});
```

The test checks visible behavior, not how the component branches internally.

## Testing Forms

```tsx
test("submits a new task", async () => {
  const user = userEvent.setup();
  const onCreate = vi.fn();

  render(<TaskForm onCreate={onCreate} />);

  await user.type(screen.getByRole("textbox", { name: /task/i }), "Write tests");
  await user.click(screen.getByRole("button", { name: /add/i }));

  expect(onCreate).toHaveBeenCalledWith("Write tests");
});
```

Use labels so inputs are accessible and easy to test.

## Testing Props and Callbacks

```tsx
test("calls onDismiss when close is clicked", async () => {
  const user = userEvent.setup();
  const onDismiss = vi.fn();

  render(<Banner message="Welcome" onDismiss={onDismiss} />);

  await user.click(screen.getByRole("button", { name: /close/i }));

  expect(onDismiss).toHaveBeenCalledTimes(1);
});
```

Do not check that `setState` was called.

Check the user-visible result or the public callback.

## Testing Components With Providers

Some components need routers, query clients, themes, or contexts.

Create a test render helper.

```tsx
function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}
```

Keep helpers small and explicit.

If every test hides too much setup, failures become harder to understand.

## Edge Cases to Cover

For many components, test:

- empty data
- disabled actions
- validation errors
- permission differences
- slow or failed API states
- keyboard behavior

You do not need to test every pixel.

Test meaningful behavior.

## Common Mistakes

- Taking snapshots of large components instead of asserting important output.
- Querying private implementation details.
- Not testing disabled or error states.
- Forgetting provider setup or reusing a dirty cache between tests.
- Simulating clicks with low-level events when `user-event` is more realistic.

:::quiz
question: What is usually the best way to test a close button?
options:
  - Check that the internal `isOpen` state variable changed
  - Click the button and assert the visible result or callback
  - Inspect the component's source code
  - Assert the exact generated class name
answer: 1
explanation: Component tests should verify behavior through the DOM or public callbacks rather than private state.
:::

## Practical Challenge

Test an `InviteDialog` component.

Cover:

- opening state renders the dialog
- email validation error appears
- submit calls `onInvite(email)`
- Cancel calls `onClose`
- Escape or close button behavior if supported

Use accessible queries for the dialog, input, and buttons.

## Recap

Good component tests exercise real user paths.

Render the component with required providers, interact through accessible elements, and assert behavior that would matter after a refactor.
