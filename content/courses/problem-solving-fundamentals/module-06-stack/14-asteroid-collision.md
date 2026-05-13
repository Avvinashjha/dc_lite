# Asteroid Collision

**LeetCode 735.** Given an array of asteroids moving along a 1D line, each asteroid's **absolute value** is its size and the **sign** is its direction (`+` moves right, `-` moves left). When two asteroids moving toward each other collide:

- The smaller one explodes.
- Equal size → both explode.
- Asteroids moving in the **same direction** never collide.

Return the state of the asteroids after all collisions.

This is a pure stack problem — almost a direct translation of the problem statement into code.

## Key observation

Only asteroids moving **right** (`+`) can be hit by an asteroid moving **left** (`-`). So as we scan left to right:

- A `+` asteroid is a potential "wall" for future `-` asteroids → push it.
- A `-` asteroid needs to collide with any `+` asteroids currently on the stack, in LIFO order (most recent first).

For each incoming `-a`:

- While the top is a smaller `+` asteroid, pop it (it explodes).
- If the top is an equal `+` asteroid, pop it (they both explode), stop.
- If the top is a larger `+` asteroid, the incoming one explodes, stop.
- Otherwise (empty stack or top is `-`), push the incoming asteroid.

## The code

```javascript
function asteroidCollision(asteroids) {
  const stack = [];

  for (const a of asteroids) {
    let alive = true;
    while (alive && a < 0 && stack.length > 0 && stack[stack.length - 1] > 0) {
      const top = stack[stack.length - 1];
      if (top < -a) {
        stack.pop();           // top explodes; continue checking
      } else if (top === -a) {
        stack.pop();           // both explode
        alive = false;
      } else {
        alive = false;         // top survives; incoming explodes
      }
    }
    if (alive) stack.push(a);
  }
  return stack;
}
```

Notice the four conditions in the `while`:

1. `alive` — the incoming asteroid is still alive.
2. `a < 0` — it moves left (otherwise no collisions).
3. `stack.length > 0` — something to collide with.
4. `stack[top] > 0` — that thing moves right (otherwise they move the same direction, no collision).

All four must hold to enter the collision logic.

## Walkthrough

```text
asteroids = [5, 10, -5]

5:   + push                stack=[5]
10:  + push                stack=[5, 10]
-5:  - alive, |a|=5, top=10 > 5 -> top survives, incoming dies, stop
                              stack=[5, 10]

answer = [5, 10]
```

```text
asteroids = [8, -8]

8:   push                  stack=[8]
-8:  top=8, top == |-8| -> both explode, stop
                              stack=[]

answer = []
```

```text
asteroids = [10, 2, -5]

10:  push                  stack=[10]
2:   push                  stack=[10, 2]
-5:  top=2 < 5 -> top explodes, pop      stack=[10]
     top=10 > 5 -> incoming dies, stop   stack=[10]

answer = [10]
```

```text
asteroids = [-2, -1, 1, 2]

-2:  a<0 but stack empty -> just push    stack=[-2]
-1:  a<0 but top is negative -> push     stack=[-2, -1]
 1:  a>0 push                            stack=[-2, -1, 1]
 2:  a>0 push                            stack=[-2, -1, 1, 2]

answer = [-2, -1, 1, 2]   (no collisions: outgoing in both directions)
```

## Complexity

- **Time:** O(n). Each asteroid is pushed at most once and popped at most once.
- **Space:** O(n) for the stack.

## Why this is pure-stack, not monotonic-stack

The stack here **is not monotonic** — a surviving `-5` followed by a later `+10` has `-5, 10` on the stack with no ordering invariant. What makes this a stack problem is that **collisions only happen with the most recent survivor moving right**, which is exactly the top of the stack.

## Common bugs

1. **Not handling the equal-size case correctly.** Both must be removed; a common mistake is to leave the top alone and kill only the incoming one.
2. **Forgetting `alive`.** Without a "still alive" flag, the while loop's after-logic can incorrectly push a destroyed incoming asteroid.
3. **Wrong sign direction.** `+` is right, `-` is left. Swap them accidentally and every collision condition inverts.

:::quiz
question: In this problem, when do we push the current asteroid onto the stack?
options:
  - Always.
  - Only when it survives any collisions triggered during the scan — i.e., when `alive` is still true at the end of processing it.
answer: 1
explanation: Pushing a destroyed asteroid pollutes the stack with a ghost that would incorrectly collide with future asteroids.
:::

:::quiz
question: Two asteroids of equal magnitude moving toward each other:
options:
  - Both explode.
  - Both survive.
answer: 0
explanation: The problem specifies mutual destruction on equal size.
:::

:::quiz
question: Why don't we need to compare when the current asteroid moves right (`a > 0`)?
options:
  - A rightward-moving asteroid is behind (earlier in the scan) and cannot collide with rightward-moving earlier ones; it just waits on the stack for a future leftward comer.
  - Collisions only happen on negative arithmetic.
answer: 0
explanation: Two same-direction asteroids never collide per the problem statement.
:::

:::exercise
title: Implement asteroidCollision
description: Implement `asteroidCollision(asteroids)` using a stack. Handle smaller-top (pop), equal-top (both die), and larger-top (incoming dies) cases.
starterCode: |
  function asteroidCollision(asteroids) {
    const stack = [];
    for (const a of asteroids) {
      let alive = true;
      // while alive, a < 0, and top is positive and smaller -> pop
      // handle equal / larger / empty cases
      if (alive) stack.push(a);
    }
    return stack;
  }

  console.log(asteroidCollision([5, 10, -5]));    // [5, 10]
  console.log(asteroidCollision([8, -8]));        // []
  console.log(asteroidCollision([10, 2, -5]));    // [10]
  console.log(asteroidCollision([-2, -1, 1, 2])); // [-2, -1, 1, 2]
:::

## Practice

No dedicated practice folder exists for this problem in the repo. Revisit it after you're comfortable with the monotonic-stack trio (lessons 10–12).
