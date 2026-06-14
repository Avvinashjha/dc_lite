# Integration Testing

An integration test checks whether multiple pieces of code work together correctly.

Unit tests ask, "Does this small piece work by itself?"

Integration tests ask, "Do these pieces still work when connected?"

## Why Integration Tests Matter

A program can have passing unit tests and still fail when parts are combined.

For example:

- a validator returns errors in one shape, but the UI expects another shape
- an API helper returns a `Response`, but the caller expects parsed JSON
- a storage module saves a string, but another module expects an object

Integration tests catch contract mistakes between modules.

## Example: Validation Plus Form Logic

Imagine this validation function:

```js
export function validateSignup({ email, password }) {
  const errors = {};

  if (!email.includes("@")) {
    errors.email = "Enter a valid email";
  }

  if (password.length < 8) {
    errors.password = "Use at least 8 characters";
  }

  return errors;
}
```

Now a form handler uses it:

```js
export function createSignupHandler({ saveUser, showErrors }) {
  return async function handleSignup(formValues) {
    const errors = validateSignup(formValues);

    if (Object.keys(errors).length > 0) {
      showErrors(errors);
      return;
    }

    await saveUser(formValues);
  };
}
```

An integration test can check that the handler uses validation correctly.

```js
test("shows validation errors and does not save invalid signup", async () => {
  const saveUser = jest.fn();
  const showErrors = jest.fn();
  const handleSignup = createSignupHandler({ saveUser, showErrors });

  await handleSignup({ email: "bad-email", password: "123" });

  expect(showErrors).toHaveBeenCalledWith({
    email: "Enter a valid email",
    password: "Use at least 8 characters",
  });
  expect(saveUser).not.toHaveBeenCalled();
});
```

This test checks multiple pieces together:

- validation
- branching behavior
- dependency calls

## Integration vs End-to-End

Integration tests are not always full browser tests.

An integration test might run in Node.js and check several modules together.

An end-to-end test usually drives the app like a user would:

- open a page
- click buttons
- type into inputs
- verify visible results

Integration tests sit between unit and end-to-end tests.

| Test type | Scope | Example |
| --- | --- | --- |
| Unit | One function | `formatPrice(1299)` returns `"$12.99"` |
| Integration | Multiple modules | form handler validates before saving |
| End-to-end | Full workflow | user signs up in the browser |

## Testing API Integration

Integration tests are useful for API wrapper code.

```js
export async function loadUserName(userId, fetchJson) {
  const user = await fetchJson(`/api/users/${userId}`);
  return user.name;
}
```

Test the interaction:

```js
test("loads a user and returns the name", async () => {
  const fetchJson = jest.fn().mockResolvedValue({
    id: 7,
    name: "Nora",
  });

  await expect(loadUserName(7, fetchJson)).resolves.toBe("Nora");

  expect(fetchJson).toHaveBeenCalledWith("/api/users/7");
});
```

This does not call a real network. It checks that your module cooperates with its dependency.

## Setup and Teardown

Setup means preparing what a test needs.

Teardown means cleaning up after a test.

```js
let users;

beforeEach(() => {
  users = [
    { id: 1, name: "Ava" },
    { id: 2, name: "Leo" },
  ];
});

afterEach(() => {
  jest.clearAllMocks();
});
```

Use setup to avoid repeating long preparation code. Keep it simple. If setup becomes difficult to understand, the tests can become harder to read.

## Keep Tests Independent

Each test should be able to run alone.

Avoid this pattern:

```js
test("creates a user", () => {
  // creates shared state
});

test("updates the created user", () => {
  // depends on the previous test
});
```

Tests that depend on order are fragile. A future test runner, config change, or parallel execution can break them.

Prefer each test arranging its own data.

## What to Mock

In integration tests, you usually want real code for the pieces being integrated and test doubles for slow or external systems.

Common things to replace with mocks:

- network requests
- databases
- timers
- random values
- current time
- browser APIs that are hard to control

Common things to keep real:

- validation functions
- formatting functions
- data transformation modules
- local business rules

## Common Mistakes

Do not mock everything. If every dependency is fake, the test may become a unit test with extra steps.

Do not use the real network for normal automated tests unless the project intentionally has a separate external integration test suite.

Do not write integration tests that only repeat implementation details. Check visible behavior, returned values, and important calls across boundaries.

## Summary

Integration tests check connected behavior.

They are useful when a bug could happen between modules, not just inside one function.

Use real code for the pieces you want to verify together, and use controlled test doubles for external systems such as network requests.
