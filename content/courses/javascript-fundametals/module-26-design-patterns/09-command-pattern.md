# Command Pattern

The command pattern represents an action as an object or function.

Instead of running an action immediately, you can store it, pass it around, queue it, retry it, log it, or undo it later.

## Simple Function Commands

In JavaScript, a command can be as simple as a function.

```js
const commands = [];

commands.push(() => console.log("Save file"));
commands.push(() => console.log("Send email"));

for (const command of commands) {
  command();
}
```

Each function represents an action.

## Command Objects

A command object gives the action a name and related data.

```js
const command = {
  type: "add-todo",
  payload: {
    text: "Learn design patterns",
  },
  execute(state) {
    return {
      ...state,
      todos: [...state.todos, this.payload],
    };
  },
};
```

The object describes what should happen and how to run it.

## Command Processor

A command processor receives commands and executes them.

```js
function createTodoStore() {
  let state = { todos: [] };

  return {
    dispatch(command) {
      state = command.execute(state);
      return state;
    },
    getState() {
      return state;
    },
  };
}

const store = createTodoStore();

store.dispatch({
  execute(state) {
    return {
      ...state,
      todos: [...state.todos, { text: "Practice" }],
    };
  },
});
```

The store does not need to know every possible action ahead of time.

## Undoable Commands

Commands can support undo behavior.

```js
function createAddTodoCommand(todo) {
  return {
    execute(state) {
      return {
        ...state,
        todos: [...state.todos, todo],
      };
    },
    undo(state) {
      return {
        ...state,
        todos: state.todos.filter((item) => item !== todo),
      };
    },
  };
}
```

A history manager can store executed commands.

```js
const history = [];

function runCommand(command, state) {
  const nextState = command.execute(state);
  history.push(command);
  return nextState;
}
```

This idea appears in editors, drawing apps, and form builders.

## Async Commands

Commands can represent async work too.

```js
function createFetchUserCommand(userId) {
  return {
    type: "fetch-user",
    async execute(apiClient) {
      return apiClient.get(`/users/${userId}`);
    },
  };
}
```

Async commands can be queued, retried, or logged.

## UI Example

A button can receive a command instead of hard-coding the action.

```js
function createButton(label, command) {
  return {
    label,
    click() {
      command.execute();
    },
  };
}

const saveButton = createButton("Save", {
  execute() {
    console.log("Saving document");
  },
});

saveButton.click();
```

The button is reusable because the action is injected.

## Command vs Direct Function Call

A direct function call is simpler.

```js
saveDocument();
```

Use a command when you need to treat actions as data.

Good reasons:

- queue actions
- retry actions
- log actions
- send actions between systems
- support undo and redo
- separate UI elements from actions
- schedule work for later

## Common Mistakes

### Turning Every Function Into a Command

Most functions should just be functions.

Use commands when storing or managing actions is useful.

### Making Commands Too Large

A command should represent one action.

If it does many unrelated things, split it.

### Hiding Dependencies

If a command needs an API client, pass it clearly.

```js
command.execute(apiClient);
```

Do not rely on hidden globals unless the project intentionally uses that style.

## Best Practices

- Use functions for simple commands.
- Use objects when commands need metadata, undo behavior, or multiple methods.
- Keep command interfaces consistent.
- Make dependencies visible.
- Store enough information to retry or undo when needed.
- Avoid command layers for straightforward code paths.

## Summary

The command pattern turns actions into values.

This is useful when actions need to be queued, stored, logged, retried, passed around, or undone.

In JavaScript, commands can be plain functions or small objects with an `execute()` method.

