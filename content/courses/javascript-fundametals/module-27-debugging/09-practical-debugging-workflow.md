# Practical Debugging Workflow

Debugging is not just a collection of tools.

It is a repeatable process for moving from "something is wrong" to "I know what caused it and I fixed it."

Good debugging reduces guessing.

## Step 1: Describe the Bug Clearly

Start with a concrete description.

Weak description:

```text
The checkout is broken.
```

Better description:

```text
When a logged-in user applies a 20% coupon to a cart with two items, the total becomes NaN after clicking Apply Coupon.
```

Include:

- what you did
- what you expected
- what actually happened
- what changed recently, if known
- the environment where it happens

Specific descriptions make bugs easier to reproduce.

## Step 2: Reproduce It

A bug you can reproduce is much easier to fix.

Write steps:

```text
1. Open the checkout page.
2. Add any two products.
3. Enter coupon SAVE20.
4. Click Apply Coupon.
5. Notice the total changes to NaN.
```

If the bug is intermittent, record what conditions seem related:

- browser
- screen size
- account type
- network speed
- stored data
- time of day
- input values

## Step 3: Check the Obvious Evidence

Before editing code, inspect the evidence.

Useful first checks:

- Console errors
- Network requests
- current DOM state
- local storage or cookies
- recent code changes
- the exact input data

Do not skip this step. The error message or failed request may already point to the issue.

## Step 4: Form One Hypothesis

A hypothesis is a testable explanation.

Example:

```text
The coupon percent is a string like "20%" instead of a number like 0.2.
```

Now test it.

```js
console.log("coupon:", coupon);
console.log("coupon.percent:", coupon.percent, typeof coupon.percent);
```

Or pause before the calculation and inspect the value.

If the hypothesis is wrong, update it based on what you learned.

## Step 5: Trace the Data Backward

When a value is wrong, find where it became wrong.

```js
function calculateDiscount(total, coupon) {
  return total * coupon.percent;
}
```

If `coupon.percent` is wrong here, ask:

- Who called this function?
- Where did `coupon` come from?
- Was it parsed from JSON?
- Was it read from a form?
- Was it transformed by another function?

Use the call stack, logs, and breakpoints to walk backward.

## Step 6: Minimize the Example

Remove unrelated details until the bug is small.

Original situation:

- checkout page
- user session
- cart items
- coupon input
- API response
- rendering logic

Smaller test:

```js
const coupon = { percent: "20%" };
const total = 100;

console.log(total * coupon.percent);
```

This returns `NaN`, which confirms the calculation cannot use `"20%"` directly.

Small examples make bugs easier to reason about.

## Step 7: Use Binary Search Debugging

Binary search debugging means checking the middle of a process to decide which half contains the bug.

Example flow:

```text
form input -> request payload -> API response -> transform -> render
```

If the rendered value is wrong, inspect the transform input.

- If the transform input is already wrong, debug earlier steps.
- If the transform input is correct, debug the transform or render steps.

This is faster than checking every line from the beginning.

You can also use this idea with recent changes:

- If yesterday worked and today is broken, compare what changed.
- Temporarily disable half of a suspicious change set.
- Narrow down until the responsible change is clear.

Do not use destructive git commands while doing this unless you are sure and have permission.

## Step 8: Fix the Cause, Not the Symptom

Bad fix:

```js
const discount = total * coupon.percent || 0;
```

This hides the `NaN`, but it does not explain why `coupon.percent` is invalid.

Better fix:

```js
function parsePercent(value) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.endsWith("%")) {
    return Number(value.slice(0, -1)) / 100;
  }

  throw new Error(`Invalid percent: ${value}`);
}

const discount = total * parsePercent(coupon.percent);
```

The better fix makes the expected input explicit.

## Step 9: Lock the Bug With a Test

When possible, add a test that fails before the fix and passes after the fix.

```js
function calculateDiscount(total, coupon) {
  return total * parsePercent(coupon.percent);
}

console.assert(
  calculateDiscount(100, { percent: "20%" }) === 20,
  "20% coupon should discount 20 from 100",
);
```

In a real project, this might be a unit test.

Tests are useful because they:

- prove the bug is fixed
- prevent the same bug from returning
- document the expected behavior

## Step 10: Clean Up

After fixing the bug:

- remove temporary logs
- remove `debugger` statements
- keep useful tests
- keep helpful error messages
- verify related cases
- update comments or docs if behavior changed

Then rerun the reproduction steps.

The bug should be gone for the original case and any important related cases.

## Common Debugging Mistakes

Do not change several unrelated things at once. You will not know which change fixed the bug.

Do not assume the first suspicious line is the root cause.

Do not ignore user input, stored state, API data, or timing.

Do not silence errors just to make the console clean.

Do not forget to test the failing case after the fix.

Do not leave temporary debugging code behind.

## A Short Checklist

Use this checklist when stuck:

- Can I reproduce the bug?
- What is the exact error or wrong behavior?
- What is the first wrong value?
- Where did that value come from?
- What assumption failed?
- Can I make a smaller example?
- Can I prove the fix with a test?
- Did I remove temporary debugging code?

## Summary

A practical debugging workflow is:

1. Describe the bug.
2. Reproduce it.
3. Gather evidence.
4. Form one hypothesis.
5. Trace data backward.
6. Minimize the example.
7. Narrow the search area.
8. Fix the cause.
9. Add a test when possible.
10. Clean up and verify.

Debugging gets easier when you treat each step as a way to replace assumptions with facts.
