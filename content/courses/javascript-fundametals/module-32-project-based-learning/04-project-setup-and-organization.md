# Project Setup and Organization

Project setup does not need to be complicated.

For many JavaScript fundamentals projects, a simple folder is enough:

```text
expense-tracker/
  index.html
  styles.css
  src/
    main.js
    state.js
    storage.js
    render.js
```

The goal is to make the project easy to open, understand, and change.

## Start Simple

A beginner project can begin with three files:

```text
index.html
styles.css
script.js
```

That is fine for very small projects.

As the project grows, split JavaScript by responsibility:

- `main.js` starts the app and connects event listeners
- `state.js` stores and updates app data
- `render.js` updates the DOM
- `api.js` contains API request functions
- `storage.js` reads and writes browser storage
- `utils.js` contains small reusable helpers

Do not create folders just to look professional.

Create them when they make the code easier to reason about.

## Use Modules When Helpful

JavaScript modules let files share code with `import` and `export`.

Example:

```js
// state.js
export const state = {
  tasks: [],
  filter: "all"
};

export function addTask(title) {
  state.tasks.push({
    id: crypto.randomUUID(),
    title,
    completed: false
  });
}
```

```js
// main.js
import { addTask, state } from "./state.js";

addTask("Practice JavaScript");
console.log(state.tasks);
```

In the browser, load the entry file as a module:

```html
<script type="module" src="./src/main.js"></script>
```

## Keep Responsibilities Separate

Avoid putting every line of code inside one event listener.

Messy:

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  tasks.push({ id: Date.now(), title, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  list.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.title;
    list.append(li);
  });
});
```

Better:

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = getTaskTitle();
  if (!title) {
    showError("Enter a task title.");
    return;
  }

  addTask(title);
  saveTasks(state.tasks);
  renderTasks(state.tasks);
  clearForm();
});
```

The second version is easier to test and change because the steps are named.

## Use a Startup Function

A startup function makes the app's first steps clear.

```js
function init() {
  state.tasks = loadTasks();
  bindEvents();
  renderTasks(state.tasks);
}

init();
```

This pattern is useful for browser projects:

1. Load saved data.
2. Select DOM elements.
3. Attach event listeners.
4. Render the first UI.

## Choose Names Carefully

Good names reduce comments.

Prefer:

```js
const activeFilter = "completed";
const visibleTasks = getVisibleTasks(tasks, activeFilter);
```

Avoid:

```js
const x = "completed";
const data2 = getStuff(data, x);
```

Names should explain the role of a value.

## Keep Configuration Together

If your project uses repeated values, put them in one place.

```js
const STORAGE_KEY = "daily-coder-expenses";
const API_BASE_URL = "https://api.example.com";
```

This makes future changes safer.

Be careful with secrets.

Frontend JavaScript is visible to users, so do not store private API keys in browser code.

## Best Practices

- Start with the simplest structure that supports the project.
- Split files by responsibility when a file becomes hard to scan.
- Use modules for shared functions and state.
- Keep startup logic in one obvious place.
- Use constants for repeated configuration values.
- Do not put secrets in frontend code.

## Common Mistakes

- Creating too many files before the project has real behavior.
- Leaving all code inside one large event listener.
- Mixing DOM rendering, API calls, storage, and data updates in every function.
- Forgetting `type="module"` when using browser imports.
- Using unclear file names like `stuff.js` or `new-script-final.js`.

## Summary

Good setup makes a project easier to build and maintain.

Start simple, split by responsibility when needed, use modules deliberately, and make the app's startup flow easy to follow.
