# Mocha

Mocha is another popular JavaScript test runner.

Unlike Jest, Mocha focuses on running tests and leaves assertions and mocks to other libraries.

A common combination is:

- Mocha for running tests
- Chai for assertions
- Sinon for spies, stubs, and mocks

## A Simple Mocha Test

Imagine this function:

```js
// math.js
export function multiply(a, b) {
  return a * b;
}
```

A Mocha test with Chai might look like this:

```js
// math.test.js
import { expect } from "chai";
import { multiply } from "./math.js";

describe("multiply", () => {
  it("multiplies two numbers", () => {
    expect(multiply(4, 5)).to.equal(20);
  });
});
```

Mocha provides `describe()` and `it()`.

Chai provides `expect()`.

## Mocha's Role

Mocha handles:

- finding test files
- running test cases
- supporting async tests
- reporting pass/fail results
- running setup and teardown hooks

It does not require one specific assertion style.

That flexibility is one reason some teams choose Mocha.

## Chai Assertions

Chai supports readable assertions.

```js
expect(total).to.equal(42);
expect(user).to.deep.equal({ name: "Ava" });
expect(items).to.include("javascript");
expect(isValid).to.equal(true);
```

Use deep equality for objects and arrays:

```js
expect(["a", "b"]).to.deep.equal(["a", "b"]);
```

Without deep equality, the assertion checks whether two values are the same object reference.

## Testing Errors

To test a thrown error, pass a function to the assertion.

```js
function requireName(name) {
  if (!name) {
    throw new Error("Name is required");
  }

  return name;
}

it("throws when name is missing", () => {
  expect(() => requireName("")).to.throw("Name is required");
});
```

Do not call the function directly inside `expect()`:

```js
// Wrong: the error is thrown before Chai can check it.
expect(requireName("")).to.throw();
```

## Async Tests

Mocha supports Promise-returning and `async` tests.

```js
async function loadMessage() {
  return "Ready";
}

it("loads a message", async () => {
  const message = await loadMessage();

  expect(message).to.equal("Ready");
});
```

If the awaited Promise rejects, the test fails.

Older Mocha tests may use a `done` callback:

```js
it("loads with a callback", (done) => {
  setTimeout(() => {
    expect(2 + 2).to.equal(4);
    done();
  }, 10);
});
```

For modern Promise-based code, prefer `async` and `await` because it is easier to read.

## Hooks

Mocha has setup and teardown hooks:

```js
before(() => {
  // run once before the group
});

beforeEach(() => {
  // run before each test
});

afterEach(() => {
  // run after each test
});

after(() => {
  // run once after the group
});
```

Use `beforeEach()` when each test needs fresh data.

Avoid putting too much hidden logic in hooks. A reader should still be able to understand what each test is checking.

## Sinon for Test Doubles

Sinon is often used with Mocha for spies and stubs.

```js
import sinon from "sinon";

it("calls the save function", () => {
  const save = sinon.stub();

  save({ name: "Ava" });

  expect(save.calledOnce).to.equal(true);
  expect(save.firstCall.args[0]).to.deep.equal({ name: "Ava" });
});
```

A spy records calls.

A stub can also control behavior, such as returning a specific value.

## Mocha vs Jest

Jest is more batteries-included.

Mocha is more modular.

| Feature | Jest | Mocha |
| --- | --- | --- |
| Test runner | Included | Included |
| Assertions | Included | Usually Chai |
| Mocks | Included | Usually Sinon |
| Configuration style | Integrated | Flexible |

Neither tool is "the only correct choice." In real projects, use the tool already chosen by the team unless there is a strong reason to change.

## Node's Built-In Test Runner

Modern Node.js also includes a built-in test runner through `node:test`.

```js
import test from "node:test";
import assert from "node:assert/strict";

test("adds numbers", () => {
  assert.equal(2 + 3, 5);
});
```

You may see Jest, Mocha, Vitest, or Node's built-in runner in different projects. The core testing ideas are similar across tools.

## Common Mistakes

Do not mix assertion styles randomly in the same test file.

Do not forget to return or await asynchronous work.

Do not choose a framework only because it is popular. For a real project, consider the existing stack, community support, configuration, speed, and team familiarity.

## Summary

Mocha is a flexible test runner often paired with Chai and Sinon.

The important concepts are the same as other test tools:

- define focused tests
- make clear assertions
- handle async code correctly
- use hooks carefully
- keep tests independent
