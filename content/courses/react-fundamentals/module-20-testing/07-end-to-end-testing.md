# End-to-End Testing

End-to-end tests run the application like a user would, usually in a real browser.

They verify that routing, rendering, data, interactions, and browser behavior work together.

Common tools include Playwright and Cypress.

## What E2E Tests Are Good For

Use E2E tests for critical flows:

- sign up
- sign in
- checkout
- creating an important record
- permissions and redirects
- multi-page workflows

Do not use E2E tests for every small component variant.

Those are usually faster and clearer as component tests.

## Playwright-Style Example

```ts
import { test, expect } from "@playwright/test";

test("user can create a project", async ({ page }) => {
  await page.goto("/projects");

  await page.getByRole("button", { name: /new project/i }).click();
  await page.getByRole("textbox", { name: /project name/i }).fill("Website Redesign");
  await page.getByRole("button", { name: /create/i }).click();

  await expect(page.getByRole("heading", { name: "Website Redesign" })).toBeVisible();
});
```

Notice the role-based locators.

They make tests more resilient and encourage accessible UI.

## Test Data

E2E tests need reliable data.

Common strategies:

- seed a test database before the run
- create records through API helpers during setup
- use isolated test accounts
- clean up data after the test
- mock only external third-party services

Avoid depending on random existing production-like data.

## Avoid Flaky Tests

Flaky tests pass sometimes and fail other times without a real product change.

Common causes:

- waiting for fixed timeouts
- depending on test order
- sharing mutable data between tests
- using unstable selectors
- relying on animations or network timing

Prefer waiting for a real UI condition.

```ts
await expect(page.getByText("Saved")).toBeVisible();
```

Avoid:

```ts
await page.waitForTimeout(2000);
```

## Accessibility-Focused E2E Checks

E2E tests can catch accessibility regressions in real flows.

Include checks such as:

- key pages can be navigated with the keyboard
- modals trap focus and return focus when closed
- form fields have labels
- error messages are announced or visible
- important controls have accessible names

Automated accessibility scanners can help, but they do not replace manual keyboard testing.

## E2E vs Component Tests

Ask where the risk lives.

If the risk is a button callback, use a component test.

If the risk is a complete checkout flow across routing, network, and browser behavior, use an E2E test.

Too many E2E tests slow the feedback loop.

Too few leave critical flows unprotected.

## Common Mistakes

- Testing every visual detail through E2E.
- Using brittle CSS selectors instead of role or label locators.
- Depending on test order.
- Waiting with fixed sleeps instead of visible conditions.
- Skipping failure paths such as declined payment or unauthorized access.

:::quiz
question: Which behavior is a strong candidate for an E2E test?
options:
  - A pure function adds two numbers
  - A complete checkout flow succeeds from cart to confirmation page
  - A CSS module generated a class name
  - A reducer returns an object for one action
answer: 1
explanation: E2E tests are best for critical full-user flows that require multiple app layers to work together.
:::

## Practical Challenge

Write an E2E test plan for a password reset flow.

Include:

- starting from the login page
- requesting a reset email
- opening or simulating a reset link
- entering a new password
- confirming the user can sign in
- one accessibility check

Then decide which parts should be E2E and which could be component or unit tests.

## Recap

E2E tests provide high confidence for critical user journeys.

Keep them focused, use stable accessible locators, manage test data carefully, and avoid fixed waits that create flaky test suites.
