# Types of Testing

Testing is the practice of checking that your code behaves the way you expect.

You have already learned functions, objects, modules, async code, APIs, DOM work, and browser behavior. Testing helps you keep that knowledge reliable as programs grow.

## Why Testing Matters

A test is code that runs your code and checks the result.

Good tests help you:

- catch mistakes before users do
- make changes with more confidence
- document how code is supposed to behave
- prevent old bugs from returning
- design smaller, clearer functions

Testing does not prove that a program is perfect. It gives you useful evidence that important behavior still works.

## Manual Testing

Manual testing means trying the program yourself.

For example:

1. Open the app.
2. Fill out a form.
3. Click submit.
4. Check whether the result looks correct.

Manual testing is useful, especially while exploring a feature. But it is slow to repeat, easy to forget, and hard to run the exact same way every time.

Automated tests are repeatable checks that a computer can run for you.

## Unit Tests

A unit test checks a small piece of code in isolation.

Usually the "unit" is a function, method, or small module.

```js
function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

// A unit test would check:
// formatPrice(1299) returns "$12.99"
```

Unit tests are usually fast and focused. They are especially useful for pure functions because pure functions do not depend on changing outside state.

## Integration Tests

An integration test checks whether multiple pieces work together.

For example:

- a form validator plus a submit handler
- an API wrapper plus response parsing
- a module that reads from storage and updates the DOM

Integration tests are broader than unit tests. They can catch bugs that only appear when pieces are connected.

## End-to-End Tests

An end-to-end test checks a full user workflow.

For example:

1. Visit the login page.
2. Type an email and password.
3. Submit the form.
4. Verify that the dashboard appears.

End-to-end tests are closest to real user behavior. They are also usually slower and more expensive to maintain.

## Regression Tests

A regression is a bug that returns after it was already fixed.

A regression test is a test you add for a bug so the same mistake is less likely to come back.

```js
function getDiscount(total) {
  if (total >= 100) {
    return 10;
  }

  return 0;
}
```

If a customer reported that exactly `100` did not receive the discount, you could add a test for that exact boundary.

## Smoke Tests

A smoke test is a small check that the most important behavior is not completely broken.

For example:

- the app can start
- the homepage can render
- the main API endpoint responds

Smoke tests do not check every detail. They answer: "Is this build obviously broken?"

## Test Pyramid

A common testing strategy is called the test pyramid.

| Level | Amount | Speed | Purpose |
| --- | --- | --- | --- |
| Unit | Many | Fast | Check small pieces |
| Integration | Some | Medium | Check connected behavior |
| End-to-end | Few | Slower | Check complete workflows |

The exact balance depends on the project, but the idea is useful: write many focused tests and fewer expensive full-system tests.

## What Should You Test?

Good candidates for testing include:

- calculations
- formatting functions
- validation rules
- branching logic
- API response handling
- edge cases
- bug fixes

You usually do not need to test that JavaScript itself works.

For example, testing that `Array.prototype.map()` returns an array is not useful. Testing your callback logic inside `map()` can be useful.

## Common Mistakes

Do not only test the happy path. Also test invalid input, empty arrays, missing values, failed requests, and boundary values.

Do not write tests that duplicate the implementation line by line. A test should care about behavior, not every internal step.

Do not rely only on manual testing for behavior that changes often. If it matters and can break, consider automating it.

## Summary

Testing helps you check behavior repeatedly and confidently.

The main categories are:

- unit tests for small pieces
- integration tests for connected pieces
- end-to-end tests for full workflows
- regression tests for old bugs
- smoke tests for basic health checks

In the next lessons, you will learn how to structure tests and apply these ideas to real JavaScript code.
