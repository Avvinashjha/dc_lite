# Callback Hell

Callback hell happens when callbacks are nested inside callbacks inside callbacks.

The code becomes hard to read, debug, and maintain.

```js
getUser(userId, (error, user) => {
  if (error) {
    handleError(error);
    return;
  }

  getOrders(user.id, (error, orders) => {
    if (error) {
      handleError(error);
      return;
    }

    getOrderDetails(orders[0].id, (error, details) => {
      if (error) {
        handleError(error);
        return;
      }

      console.log(details);
    });
  });
});
```

This is sometimes called the pyramid of doom because indentation keeps growing.

## Why Callback Hell Is a Problem

Nested callbacks make it harder to:

- follow the order of operations
- handle errors consistently
- reuse steps
- test individual pieces
- add new behavior safely

The logic is not only top-to-bottom.

It is also left-to-right through nested indentation.

## Error Handling Gets Repetitive

With error-first callbacks, every step needs error handling.

```js
stepOne((error, resultOne) => {
  if (error) {
    handleError(error);
    return;
  }

  stepTwo(resultOne, (error, resultTwo) => {
    if (error) {
      handleError(error);
      return;
    }

    stepThree(resultTwo, (error, resultThree) => {
      if (error) {
        handleError(error);
        return;
      }

      console.log(resultThree);
    });
  });
});
```

The repeated error checks add noise.

## Fix 1: Use Named Functions

One improvement is to extract named functions.

```js
getUser(userId, handleUser);

function handleUser(error, user) {
  if (error) {
    handleError(error);
    return;
  }

  getOrders(user.id, handleOrders);
}

function handleOrders(error, orders) {
  if (error) {
    handleError(error);
    return;
  }

  getOrderDetails(orders[0].id, handleOrderDetails);
}

function handleOrderDetails(error, details) {
  if (error) {
    handleError(error);
    return;
  }

  console.log(details);
}
```

This reduces nesting.

But the flow is now spread across several functions.

## Fix 2: Use Promises

Promises help represent async work as values that can succeed or fail later.

```js
getUser(userId)
  .then((user) => getOrders(user.id))
  .then((orders) => getOrderDetails(orders[0].id))
  .then((details) => {
    console.log(details);
  })
  .catch((error) => {
    handleError(error);
  });
```

The code becomes flatter.

There is one `.catch()` for the chain.

You will learn promises next.

## Fix 3: Use async / await

`async` / `await` makes promise-based code read more like synchronous code.

```js
async function showFirstOrderDetails(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const details = await getOrderDetails(orders[0].id);

    console.log(details);
  } catch (error) {
    handleError(error);
  }
}
```

This is often the clearest modern style.

But it still uses promises underneath.

## When Callbacks Are Still Fine

Callbacks are not bad.

They are still useful for:

- event listeners
- array methods
- simple timers
- small APIs that expect callbacks

Example:

```js
button.addEventListener("click", handleClick);
```

This is perfectly fine.

The problem is not callbacks themselves.

The problem is deeply nested async control flow.

## Best Practices

Avoid deeply nested callbacks.

Use early returns for error handling.

Extract named functions when it improves readability.

Use promises or `async` / `await` for multi-step async workflows.

Keep each async step focused.

## Common Mistakes

### Mistake 1: Adding More Nesting Instead of Refactoring

If code keeps moving right, pause and simplify.

### Mistake 2: Handling Errors Inconsistently

Some nested callback paths may forget to handle errors.

Use a consistent pattern.

### Mistake 3: Thinking Callbacks Are Always Bad

Callbacks are still useful.

Deeply nested callbacks are the issue.

## Summary

Callback hell is deeply nested callback-based async code.

- It is hard to read and maintain.
- Error handling becomes repetitive.
- Named functions can reduce nesting.
- Promises flatten async chains.
- `async` / `await` often provides the clearest modern flow.
- Simple callbacks are still useful for events and small tasks.
