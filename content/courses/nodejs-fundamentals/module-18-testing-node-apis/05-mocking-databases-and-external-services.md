# Mocking Databases and External Services

## Why It Matters

Tests should be fast and reliable, but real databases and external APIs are slower and less predictable. Mocking and faking let you isolate behavior, while integration tests still verify the real boundary.

## Core Concepts

- A mock records calls and returns programmed responses.
- A fake implements a small working version, often in memory.
- A stub returns fixed data without recording behavior.
- Mock external services for unit tests; use contract or integration tests for critical integrations.
- Do not mock the code you are trying to verify.

## Flow to Remember

The test passes fake dependencies into the service, the service performs its logic, the fake returns controlled outcomes, and the test asserts behavior without network calls.

## Syntax and Examples

```js
import assert from 'node:assert/strict';
import test from 'node:test';

async function inviteUser({ email, usersRepository, emailClient }) {
  const user = await usersRepository.create({ email });
  await emailClient.send({ to: email, subject: 'Welcome' });
  return user;
}

test('inviteUser stores user and sends email', async () => {
  const sent = [];
  const user = await inviteUser({
    email: 'new@example.com',
    usersRepository: { create: async ({ email }) => ({ id: 'user_1', email }) },
    emailClient: { send: async (message) => sent.push(message) }
  });

  assert.equal(user.id, 'user_1');
  assert.equal(sent[0].to, 'new@example.com');
});
```

## Use Cases and Tradeoffs

- Fake repositories for service unit tests.
- Mock payment, email, SMS, and third-party HTTP clients in fast tests.
- Use local emulators or test containers for higher-confidence integration tests.
- Record provider webhook samples as fixtures, then verify signature and parsing code separately.

## Common Mistakes

- Mocking database responses so they no longer resemble real rows.
- Asserting every internal call instead of user-visible behavior.
- Letting mocks hide broken SQL, migrations, or serialization.
- Using live third-party services in normal CI runs.

## Practical Challenge

Build an in-memory fake repository for users with `create`, `findByEmail`, and duplicate email behavior. Use it to test a registration service.

## Recap

- Mocks and fakes trade realism for speed and control.
- Use them at the right boundary.
- Keep integration tests for behavior only real systems can prove.

