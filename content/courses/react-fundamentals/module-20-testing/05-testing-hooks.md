# Testing Hooks

Custom hooks are reusable behavior.

You can often test them through a component that uses the hook.

When the hook has complex logic and no meaningful UI, hook-level tests can be useful.

## Prefer Testing Through Components First

```tsx
function CounterButton() {
  const { count, increment } = useCounter();

  return <button onClick={increment}>Count: {count}</button>;
}

test("increments the counter", async () => {
  const user = userEvent.setup();

  render(<CounterButton />);

  await user.click(screen.getByRole("button", { name: /count: 0/i }));

  expect(screen.getByRole("button", { name: /count: 1/i })).toBeInTheDocument();
});
```

This tests the hook through observable behavior.

## Testing With `renderHook`

Testing Library provides `renderHook` in modern versions.

```tsx
import { renderHook, act } from "@testing-library/react";

test("toggles a boolean", () => {
  const { result } = renderHook(() => useToggle(false));

  act(() => {
    result.current.toggle();
  });

  expect(result.current.value).toBe(true);
});
```

Use `act` when an update happens outside normal user-event helpers.

## Hooks With Props

```tsx
test("uses the initial value", () => {
  const { result, rerender } = renderHook(
    ({ initialValue }) => useCounter(initialValue),
    { initialProps: { initialValue: 5 } }
  );

  expect(result.current.count).toBe(5);

  rerender({ initialValue: 10 });
  expect(result.current.count).toBe(5);
});
```

This example shows an important hook edge case: initial state does not automatically reset when props change.

## Hooks With Providers

If a hook reads context, wrap it.

```tsx
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider initialMode="dark">{children}</ThemeProvider>
);

const { result } = renderHook(() => useTheme(), { wrapper });
```

The wrapper should match the real provider contract.

## Async Hooks

For async hooks, wait for observable state.

```tsx
test("loads data", async () => {
  const { result } = renderHook(() => useUser("u1"));

  await waitFor(() => {
    expect(result.current.status).toBe("success");
  });

  expect(result.current.user?.name).toBe("Ava");
});
```

Avoid arbitrary timeouts.

Wait for the condition that matters.

## Common Mistakes

- Testing every hook directly when a component test would provide better confidence.
- Forgetting `act` for direct state updates.
- Assuming changed props reset internal state.
- Not wrapping hooks that require context.
- Using real network requests in hook tests.

:::quiz
question: When is `renderHook` most useful?
options:
  - When a hook has meaningful logic that is hard to observe through a component
  - For replacing all component tests
  - For testing CSS classes only
  - For running E2E tests in a browser
answer: 0
explanation: Hook-level tests are useful for reusable hook logic, especially when component tests would be awkward or indirect.
:::

## Practical Challenge

Test a `useDebouncedValue(value, delay)` hook.

Cover:

- initial value
- value does not change before the delay
- value updates after the delay
- cleanup when the value changes quickly

Use fake timers if your test runner supports them.

## Recap

Test hooks through components when that gives clear user-facing confidence.

Use `renderHook` for focused hook logic, wrap required providers, and wait for real conditions instead of sleeping in tests.
