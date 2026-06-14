# Practical Project Briefs

This lesson gives you project briefs you can build after finishing JavaScript fundamentals.

Each brief includes:

- goal
- core features
- acceptance criteria
- JavaScript skills practiced
- extension ideas

Choose one project and build version one before adding extensions.

## Project 1: Todo App

Goal:

```text
Build a task manager where users can add, complete, delete, filter, and save tasks.
```

Core features:

- add a task
- reject empty tasks
- mark tasks complete or incomplete
- delete tasks
- filter by all, active, and completed
- save tasks in `localStorage`

Acceptance criteria:

- Submitting a valid task adds it to the list.
- Empty submissions show a message and do not add a task.
- Completed tasks are visually different.
- Filters show the correct tasks.
- Refreshing the page keeps saved tasks.

Skills practiced:

- arrays and objects
- DOM rendering
- event handling
- state management
- local storage
- validation

Extensions:

- edit task titles
- add due dates
- drag and drop ordering
- show task counts
- add keyboard shortcuts

## Project 2: Quiz App

Goal:

```text
Build a quiz app that shows questions, records answers, calculates a score, and displays feedback.
```

Core features:

- store questions in an array
- show one question at a time
- allow one answer selection
- check the selected answer
- show score at the end
- restart the quiz

Acceptance criteria:

- Each question displays the correct prompt and options.
- The user cannot submit without choosing an answer.
- Correct and incorrect answers update the score properly.
- The final screen shows total score and percentage.
- Restarting returns to the first question with score reset.

Skills practiced:

- data modeling
- control flow
- DOM updates
- event handling
- derived state
- functions

Extensions:

- randomize question order
- add categories
- persist best score
- add explanations after each answer
- load questions from JSON

## Project 3: API Dashboard

Goal:

```text
Build a dashboard that fetches data from a public API and displays loading, success, and error states.
```

Core features:

- submit a search term or selection
- call an API with `fetch()`
- show a loading message
- render API results
- handle empty results
- handle failed requests

Acceptance criteria:

- The app does not request data for empty input.
- Loading state appears during the request.
- Successful responses render useful data.
- Failed responses show a user-friendly error.
- The browser console has no unhandled promise errors.

Skills practiced:

- async functions
- promises
- `fetch()`
- JSON parsing
- error handling
- conditional rendering

Extensions:

- add pagination
- cache recent results
- sort or filter API results
- save favorite items
- add request cancellation for fast repeated searches

## Project 4: Expense Tracker

Goal:

```text
Build an expense tracker where users can add expenses, categorize them, and see totals.
```

Core features:

- add description, amount, and category
- validate amount
- render expense list
- delete expenses
- calculate total spending
- filter by category
- save expenses in `localStorage`

Acceptance criteria:

- Invalid amounts are rejected.
- The total updates after adding or deleting expenses.
- Category filtering shows matching expenses only.
- Saved expenses load after refresh.
- Currency values are formatted consistently.

Skills practiced:

- object arrays
- form validation
- `reduce()`
- filtering
- rendering derived data
- local storage

Extensions:

- monthly budgets
- charts
- export to CSV
- recurring expenses
- date range filtering

## Project 5: Mini Node CLI

Goal:

```text
Build a command-line tool that reads input, performs an action, and prints useful output.
```

Example:

```text
node notes.js add "Review promises"
node notes.js list
node notes.js remove 1
```

Core features:

- read command-line arguments
- support at least three commands
- store data in a JSON file
- print clear success and error messages
- handle invalid commands

Acceptance criteria:

- `add` stores a new item.
- `list` prints saved items.
- `remove` deletes the selected item.
- Invalid commands show help text.
- The JSON file remains valid after operations.

Skills practiced:

- Node.js basics
- modules
- file system APIs
- JSON
- error handling
- command parsing

Extensions:

- search notes
- mark notes complete
- add tags
- use dates
- package the CLI with a `bin` script

## Choosing a Project

Choose based on what you want to practice.

If you want DOM and storage practice, build the todo app or expense tracker.

If you want data modeling and control flow practice, build the quiz app.

If you want async and API practice, build the API dashboard.

If you want Node.js practice, build the mini CLI.

## Best Practices

- Build one brief as written before adding extensions.
- Turn acceptance criteria into a manual test checklist.
- Keep extension ideas separate from version one.
- Write a README after version one works.
- Refactor before starting major extensions.

## Common Mistakes

- Combining all project briefs into one huge project.
- Adding extensions before acceptance criteria pass.
- Choosing an API that requires private secrets in frontend code.
- Skipping validation because the project is "just practice."
- Forgetting to save or document the final version.

## Summary

Project briefs turn broad practice into focused work.

Pick one project, complete version one, test the acceptance criteria, then choose extensions that strengthen the skills you want to practice.
