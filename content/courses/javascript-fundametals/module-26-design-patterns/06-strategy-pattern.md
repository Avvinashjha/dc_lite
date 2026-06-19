# Strategy Pattern

The strategy pattern lets you define a family of interchangeable algorithms and choose one at runtime.

Instead of putting every behavior inside one large conditional, each behavior becomes its own function or object.

## The Problem

Imagine checkout code with different shipping rules.

```js
function calculateShipping(type, total) {
  if (type === "standard") {
    return 5;
  }

  if (type === "express") {
    return 15;
  }

  if (type === "free") {
    return total >= 50 ? 0 : 5;
  }

  throw new Error("Unknown shipping type");
}
```

This is fine for a few cases.

But as rules grow, the function becomes harder to read and change.

## Strategy With Functions

```js
const shippingStrategies = {
  standard(total) {
    return 5;
  },
  express(total) {
    return 15;
  },
  free(total) {
    return total >= 50 ? 0 : 5;
  },
};

function calculateShipping(type, total) {
  const strategy = shippingStrategies[type];

  if (!strategy) {
    throw new Error(`Unknown shipping type: ${type}`);
  }

  return strategy(total);
}
```

Each strategy has the same interface: it accepts `total` and returns a shipping cost.

## Strategy With Objects

Strategies can also be objects when each option needs more than one method.

```js
const paymentStrategies = {
  card: {
    validate(payment) {
      return Boolean(payment.cardNumber);
    },
    pay(amount) {
      console.log(`Charging card for ${amount}`);
    },
  },
  paypal: {
    validate(payment) {
      return Boolean(payment.email);
    },
    pay(amount) {
      console.log(`Charging PayPal for ${amount}`);
    },
  },
};

function processPayment(type, payment, amount) {
  const strategy = paymentStrategies[type];

  if (!strategy) {
    throw new Error(`Unknown payment type: ${type}`);
  }

  if (!strategy.validate(payment)) {
    throw new Error("Invalid payment details");
  }

  strategy.pay(amount);
}
```

The calling function can use any strategy with the expected methods.

## Passing the Strategy Directly

Sometimes you do not need a registry.

Just pass the behavior in.

```js
function sortUsers(users, compare) {
  return [...users].sort(compare);
}

const byName = (a, b) => a.name.localeCompare(b.name);
const byAge = (a, b) => a.age - b.age;

sortUsers(users, byName);
sortUsers(users, byAge);
```

The comparison function is the strategy.

JavaScript uses this idea in many built-in APIs.

## Built-In Strategy Examples

`Array.prototype.sort()` accepts a comparison strategy.

```js
numbers.sort((a, b) => a - b);
```

`Array.prototype.map()` accepts a transformation strategy.

```js
names.map((name) => name.toUpperCase());
```

The function you pass controls the behavior.

## Strategy vs Conditional

A conditional is not automatically bad.

Use a simple `if` or `switch` when:

- there are only a few cases
- the behavior is short
- the cases are unlikely to grow
- keeping everything together is clearer

Use strategy when:

- each case has meaningful logic
- behavior changes at runtime
- new options are added often
- each option can be tested independently
- callers should provide custom behavior

## Keeping Strategies Consistent

All strategies should follow the same contract.

```js
const discounts = {
  student(order) {
    return order.total * 0.1;
  },
  employee(order) {
    return order.total * 0.2;
  },
};
```

If one strategy returns a number and another returns an object, the caller becomes complicated.

## Common Mistakes

### Creating a Strategy for One Option

If there is only one behavior, a strategy pattern may be unnecessary.

### Hiding Required Data

Strategies should clearly state what data they need through their parameters.

### Allowing Invalid Strategy Names Silently

Fail clearly when a requested strategy does not exist.

```js
if (!strategy) {
  throw new Error(`Unknown strategy: ${type}`);
}
```

## Best Practices

- Use functions as strategies when possible.
- Keep each strategy focused on one behavior.
- Give every strategy the same input and output shape.
- Use a registry object or `Map` for named strategies.
- Throw clear errors for unknown strategies.
- Keep simple conditionals when they are easier to read.

## Summary

The strategy pattern separates interchangeable behavior into separate functions or objects.

It is useful when an app needs to choose between algorithms, rules, or workflows at runtime.

In JavaScript, the cleanest strategy is often just a function passed as an argument.

