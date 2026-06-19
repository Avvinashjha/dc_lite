# Unit Testing Services

## Why It Matters

Services are where business rules should live. Unit testing them directly gives fast confidence without booting Express, opening ports, or preparing a real database for every case.

## Core Concepts

- A service should accept plain inputs and dependencies, then return values or throw domain errors.
- Dependency injection makes repositories and external clients replaceable in tests.
- Test behavior and outcomes, not private helper calls.
- Use small fakes for repositories when they make tests clearer.
- Keep Express `req` and `res` out of services.

## Flow to Remember

The test creates fake dependencies, calls the service with input, asserts the returned result or thrown error, and verifies important interactions only when they are part of behavior.

## Syntax and Examples

```js
import assert from 'node:assert/strict';
import test from 'node:test';

export function createUserService({ usersRepository }) {
  return {
    async register({ email, name }) {
      const existing = await usersRepository.findByEmail(email);
      if (existing) throw new Error('EMAIL_TAKEN');
      return usersRepository.create({ email: email.toLowerCase(), name });
    }
  };
}

test('register rejects duplicate emails', async () => {
  const service = createUserService({
    usersRepository: {
      findByEmail: async () => ({ id: 'user_1' }),
      create: async () => assert.fail('create should not be called')
    }
  });

  await assert.rejects(() => service.register({ email: 'A@EXAMPLE.COM', name: 'Asha' }), /EMAIL_TAKEN/);
});
```

## Use Cases and Tradeoffs

- Unit test validation decisions, permission checks, pricing rules, duplicate handling, and state transitions.
- Use table-driven tests for many input/output cases.
- Use fakes instead of mocks when an in-memory behavior is easier to understand.
- Add integration tests separately for actual database queries.

## Common Mistakes

- Instantiating the whole Express app for service behavior.
- Mocking implementation details so refactors break tests even when behavior is unchanged.
- Testing only the happy path.
- Using random time, IDs, or environment values without controlling them.

## Practical Challenge

Create a `cancelOrder` service that rejects shipped orders. Unit test pending, shipped, missing, and unauthorized cases with fake repositories.

## Recap

- Services should be easy to test without HTTP.
- Inject dependencies that cross process or database boundaries.
- Unit tests should focus on business behavior.

